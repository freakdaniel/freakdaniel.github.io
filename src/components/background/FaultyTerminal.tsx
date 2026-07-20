import { Renderer, Program, Mesh, Color, Triangle, Texture } from 'ogl';
import {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type HTMLAttributes,
} from 'react';

type Vec2 = [number, number];

export type FaultyTerminalMode = 'matrix' | 'text';

export interface FaultyTerminalProps extends HTMLAttributes<HTMLDivElement> {
  mode?: FaultyTerminalMode;
  content?: string;
  contentAlign?: 'center' | 'start';
  showCaret?: boolean;
  scale?: number;
  gridMul?: Vec2;
  digitSize?: number;
  timeScale?: number;
  pause?: boolean;
  scanlineIntensity?: number;
  glitchAmount?: number;
  flickerAmount?: number;
  noiseAmp?: number;
  chromaticAberration?: number;
  dither?: number | boolean;
  curvature?: number;
  tint?: string;
  mouseReact?: boolean;
  mouseStrength?: number;
  dpr?: number;
  pageLoadAnimation?: boolean;
  brightness?: number;
}

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

varying vec2 vUv;

uniform float iTime;
uniform vec3  iResolution;
uniform float uScale;

uniform vec2  uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3  uTint;
uniform vec2  uMouse;
uniform float uMouseStrength;
uniform float uUseMouse;
uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;
uniform float uBrightness;

uniform float uUseText;
uniform sampler2D uScreen;
uniform float uCaretBlink;

float time;

float hash21(vec2 p){
  p = fract(p * 234.56);
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p)
{
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2;
}

mat2 rotate(float angle)
{
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float fbm(vec2 p)
{
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;

  mat2 modify0 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify0 * p * 2.0;
  amp *= 0.454545;

  mat2 modify1 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify1 * p * 2.0;
  amp *= 0.454545;

  mat2 modify2 = rotate(time * 0.08);
  f += amp * noise(p);

  return f;
}

float pattern(vec2 p, out vec2 q, out vec2 r) {
  vec2 offset1 = vec2(1.0);
  vec2 offset0 = vec2(0.0);
  mat2 rot01 = rotate(0.1 * time);
  mat2 rot1 = rotate(0.1);

  q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
  r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
  return fbm(p + r);
}

float digit(vec2 p){
    vec2 grid = uGridMul * 15.0;
    vec2 s = floor(p * grid) / grid;
    p = p * grid;
    vec2 q, r;
    float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;

    if(uUseMouse > 0.5){
        vec2 mouseWorld = uMouse * uScale;
        float distToMouse = distance(s, mouseWorld);
        float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
        intensity += mouseInfluence;

        float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
        intensity += ripple;
    }

    if(uUsePageLoadAnimation > 0.5){
        float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
        float cellDelay = cellRandom * 0.8;
        float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
        intensity *= smoothstep(0.0, 1.0, cellProgress);
    }

    p = fract(p);
    p *= uDigitSize;

    float px5 = p.x * 5.0;
    float py5 = (1.0 - p.y) * 5.0;
    float x = fract(px5);
    float y = fract(py5);

    float i = floor(py5) - 2.0;
    float j = floor(px5) - 2.0;
    float n = i * i + j * j;
    float f = n * 0.0625;

    float isOn = step(0.1, intensity - f);
    float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);

    return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;
}

float onOff(float a, float b, float c)
{
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}

float displace(vec2 look)
{
    float y = look.y - mod(iTime * 0.25, 1.0);
    float window = 1.0 / (1.0 + 50.0 * y * y);
    return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
}

vec3 getMatrixColor(vec2 p){
    float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
    bar *= uScanlineIntensity;

    float displacement = displace(p);
    p.x += displacement;

    if (uGlitchAmount != 1.0) {
      float extra = displacement * (uGlitchAmount - 1.0);
      p.x += extra;
    }

    float middle = digit(p);

    const float off = 0.002;
    float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
                digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
                digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));

    return vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;
}

vec2 barrel(vec2 uv){
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + uCurvature * r2;
  return c * 0.5 + 0.5;
}

vec2 distortUv(vec2 uv){
  if(uCurvature != 0.0){
    uv = barrel(uv);
  }

  float displacement = displace(uv);
  // Stronger horizontal tear so glitch reads on text, not only matrix mode
  uv.x += displacement * max(uGlitchAmount, 0.0) * 1.65;

  if(uUseMouse > 0.5){
    vec2 d = uv - uMouse;
    float dist = length(d);
    uv += d * exp(-dist * 5.5) * uMouseStrength * 0.055;
  }

  return uv;
}

vec3 sampleScreen(vec2 uv){
  // soft clamp so glitch edges don't wrap garbage — match page bg (#0a0a0a)
  if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0){
    return vec3(0.0392157);
  }
  return texture2D(uScreen, uv).rgb;
}

vec3 getTextColor(vec2 uv){
  vec2 suv = distortUv(uv);

  vec3 col;
  if(uChromaticAberration != 0.0){
    // pixel-scale RGB split reads as a TV tube, not just soft blur
    vec2 ca = vec2(uChromaticAberration * 1.35) / iResolution.xy;
    col.r = sampleScreen(suv + ca).r;
    col.g = sampleScreen(suv).g;
    col.b = sampleScreen(suv - ca).b;
  } else {
    col = sampleScreen(suv);
  }

  // Classic CRT horizontal scanlines
  float py = suv.y * iResolution.y;
  float lineMask = 0.55 + 0.45 * sin(py * 3.14159265);
  col *= mix(1.0, lineMask, clamp(uScanlineIntensity, 0.0, 1.5) * 0.85);

  // Rolling bright band (TV refresh)
  float roll = mod(suv.y + time * 0.35, 1.0);
  float rollBand = smoothstep(0.0, 0.04, roll) * smoothstep(0.12, 0.04, roll);
  col += col * rollBand * 0.22 * uScanlineIntensity;

  // Secondary slower sweep
  float sweep = sin((suv.y + time * 0.12) * 6.28318) * 0.5 + 0.5;
  col *= 1.0 - sweep * 0.06 * uScanlineIntensity;

  // Phosphor grain / static
  float grain = (hash21(gl_FragCoord.xy + floor(iTime * 24.0)) - 0.5) * 0.07 * uNoiseAmp;
  col += grain * (0.45 + length(col));

  // Tube flicker
  col *= 1.0 + onOff(4.0, 2.0, 0.8) * 0.06 * max(uFlickerAmount, 0.35);

  // Soft edge falloff (monitor bezel feel, still page-blended)
  vec2 vc = uv * 2.0 - 1.0;
  col *= clamp(1.0 - dot(vc, vc) * 0.12, 0.55, 1.0);

  return col;
}

void main() {
    time = iTime * 0.333333;
    vec2 uv = vUv;
    vec3 col;

    if(uUseText > 0.5){
      col = getTextColor(uv);
    } else {
      if(uCurvature != 0.0){
        uv = barrel(uv);
      }
      vec2 p = uv * uScale;
      col = getMatrixColor(p);

      if(uChromaticAberration != 0.0){
        vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
        col.r = getMatrixColor(p + ca).r;
        col.b = getMatrixColor(p - ca).b;
      }
    }

    col *= uTint;
    col *= uBrightness;

    if(uDither > 0.0){
      float rnd = hash21(gl_FragCoord.xy);
      col += (rnd - 0.5) * (uDither * 0.003922);
    }

    gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(h.slice(0, 6), 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

function wrapLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!text) return [''];
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    if (ctx.measureText(trial).width <= maxWidth) {
      current = trial;
    } else {
      if (current) lines.push(current);
      if (ctx.measureText(word).width > maxWidth) {
        let chunk = '';
        for (const ch of word) {
          const t = chunk + ch;
          if (ctx.measureText(t).width > maxWidth && chunk) {
            lines.push(chunk);
            chunk = ch;
          } else {
            chunk = t;
          }
        }
        current = chunk;
      } else {
        current = word;
      }
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

const PAGE_BG = '#0a0a0a';
const PAGE_BG_RGB = { r: 10 / 255, g: 10 / 255, b: 10 / 255 } as const;

const CRT = {
  bg: PAGE_BG,
  fg: '#fafafa',
  dim: '#e8e8e8',
  key: '#a5e4ff',
  string: '#ffe08a',
  comment: '#9a9a9a',
  punct: '#d4d4d4',
  prompt: '#f5f5f5',
  caret: '#ffffff',
} as const;

type Span = { text: string; color: string };

function tokenizeLine(line: string): Span[] {
  if (/^user@freaksite:/.test(line)) {
    const m = line.match(/^(user@freaksite:~\$\s*)(.*)$/);
    if (m) {
      return [
        { text: m[1]!, color: CRT.prompt },
        { text: m[2]!, color: CRT.fg },
      ];
    }
    return [{ text: line, color: CRT.prompt }];
  }

  if (line.trim() === '{' || line.trim() === '}') {
    return [{ text: line, color: CRT.punct }];
  }

  const jsonProp =
    /^(?<indent>\s*)(?<key>"[^"]*")(?<colon>:\s*)(?<val>"[^"]*")(?<comma>,?)(?<gap>\s*)(?<comment>\/\/.*)?$/;
  const jm = line.match(jsonProp);
  if (jm?.groups) {
    const spans: Span[] = [];
    if (jm.groups.indent)
      spans.push({ text: jm.groups.indent, color: CRT.punct });
    spans.push({ text: jm.groups.key!, color: CRT.key });
    spans.push({ text: jm.groups.colon!, color: CRT.punct });
    spans.push({ text: jm.groups.val!, color: CRT.string });
    if (jm.groups.comma)
      spans.push({ text: jm.groups.comma, color: CRT.punct });
    if (jm.groups.gap) spans.push({ text: jm.groups.gap, color: CRT.punct });
    if (jm.groups.comment)
      spans.push({ text: jm.groups.comment, color: CRT.comment });
    return spans;
  }

  // Default body / about text
  return [{ text: line, color: CRT.dim }];
}

function drawSpans(
  ctx: CanvasRenderingContext2D,
  spans: Span[],
  x: number,
  y: number
) {
  let cx = x;
  for (const span of spans) {
    if (!span.text) continue;
    ctx.fillStyle = span.color;
    if (span.color === CRT.key || span.color === CRT.string) {
      ctx.shadowColor = span.color;
      ctx.shadowBlur = 8;
    } else if (span.color === CRT.fg || span.color === CRT.prompt) {
      ctx.shadowColor = 'rgba(240, 240, 240, 0.4)';
      ctx.shadowBlur = 5;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
    ctx.fillText(span.text, cx, y);
    cx += ctx.measureText(span.text).width;
  }
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

function paintTextScreen(
  canvas: HTMLCanvasElement,
  opts: {
    content: string;
    align: 'center' | 'start';
    showCaret: boolean;
    caretOn: boolean;
    cssW: number;
    cssH: number;
    dpr: number;
  }
) {
  const { content, align, showCaret, caretOn, cssW, cssH, dpr } = opts;
  const w = Math.max(1, Math.floor(cssW * dpr));
  const h = Math.max(1, Math.floor(cssH * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = CRT.bg;
  ctx.fillRect(0, 0, w, h);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.strokeStyle = 'transparent';

  if (align === 'center') {
    const fontSize = Math.min(cssW * 0.09, 52);
    ctx.font = `500 ${fontSize}px ui-monospace, "Cascadia Code", "SF Mono", Menlo, Consolas, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '0.12em';
    ctx.fillStyle = CRT.fg;
    ctx.shadowColor = 'rgba(240, 240, 240, 0.55)';
    ctx.shadowBlur = 10 * dpr;

    const display =
      content + (showCaret && caretOn ? '█' : showCaret ? ' ' : '');
    ctx.fillText(display, cssW / 2, cssH / 2);
    return;
  }

  const narrow = cssW < 520;
  const fontSize = narrow
    ? Math.min(Math.max(cssW * 0.033, 11), 13)
    : Math.min(Math.max(cssW * 0.0175, 12), 15);
  const lineHeight = fontSize * (narrow ? 1.3 : 1.38);
  const padX = narrow ? 2 : 4;
  const padY = Math.max(narrow ? 8 : 10, cssH * 0.018);
  const maxWidth = cssW - padX * 2;

  ctx.font = `400 ${fontSize}px ui-monospace, "Cascadia Code", "SF Mono", Menlo, Consolas, monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.letterSpacing = '0.01em';

  const rawLines = content.split('\n');
  const lines: string[] = [];
  for (const raw of rawLines) {
    const isBrace = raw.trim() === '{' || raw.trim() === '}';
    if (isBrace || (!narrow && /^\s*"/.test(raw))) {
      lines.push(raw);
    } else {
      lines.push(...wrapLine(ctx, raw, maxWidth));
    }
  }

  if (showCaret) {
    if (!lines.length) {
      lines.push(caretOn ? '█' : ' ');
    } else {
      const lastIdx = lines.length - 1;
      lines[lastIdx] = `${lines[lastIdx]!}${caretOn ? '█' : ' '}`;
    }
  }

  const maxRows = Math.max(1, Math.floor((cssH - padY * 2) / lineHeight));
  const visible =
    lines.length > maxRows ? lines.slice(lines.length - maxRows) : lines;

  let y = padY;
  for (let i = 0; i < visible.length; i++) {
    const line = visible[i]!;
    const isLast = i === visible.length - 1;
    const caretChar =
      isLast && showCaret && (line.endsWith('█') || line.endsWith(' '))
        ? line.slice(-1)
        : '';
    const core = caretChar ? line.slice(0, -1) : line;

    const spans = tokenizeLine(core);
    if (caretChar) {
      spans.push({ text: caretChar, color: CRT.caret });
    }
    if (!spans.length) {
      spans.push({ text: core || ' ', color: CRT.dim });
    }

    drawSpans(ctx, spans, padX, y);
    y += lineHeight;
  }
}

export default function FaultyTerminal({
  mode = 'matrix',
  content = '',
  contentAlign = 'start',
  showCaret = false,
  scale = 1.5,
  gridMul = [2, 1],
  digitSize = 1.2,
  timeScale = 1,
  pause = false,
  scanlineIntensity = 1,
  glitchAmount = 1,
  flickerAmount = 1,
  noiseAmp = 1,
  chromaticAberration = 0,
  dither = 0,
  curvature = 0,
  tint = '#ffffff',
  mouseReact = true,
  mouseStrength = 0.5,
  dpr: dprProp,
  pageLoadAnimation = false,
  brightness = 1,
  className = '',
  style,
  ...rest
}: FaultyTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(content);
  const contentAlignRef = useRef(contentAlign);
  const showCaretRef = useRef(showCaret);
  contentRef.current = content;
  contentAlignRef.current = contentAlign;
  showCaretRef.current = showCaret;

  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const frozenTimeRef = useRef(0);
  const rafRef = useRef(0);
  const loadAnimationStartRef = useRef(0);
  const timeOffsetRef = useRef(Math.random() * 100);
  const pauseRef = useRef(pause);
  const mouseReactRef = useRef(mouseReact);
  const mouseStrengthRef = useRef(mouseStrength);
  pauseRef.current = pause;
  mouseReactRef.current = mouseReact;
  mouseStrengthRef.current = mouseStrength;

  const gridMulKey = `${gridMul[0]},${gridMul[1]}`;
  const tintVec = useMemo(() => hexToRgb(tint), [tint]);
  const ditherValue = useMemo(
    () => (typeof dither === 'boolean' ? (dither ? 1 : 0) : dither),
    [dither]
  );
  const useText = mode === 'text';

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!mouseReactRef.current) return;
    const ctn = containerRef.current;
    if (!ctn) return;
    const rect = ctn.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;
    mouseRef.current = { x, y };
  }, []);

  useEffect(() => {
    const ctn = containerRef.current;
    if (!ctn) return;

    const dpr =
      dprProp ??
      (typeof window !== 'undefined'
        ? Math.min(window.devicePixelRatio || 1, 2)
        : 1);

    const renderer = new Renderer({ dpr, alpha: false });
    const gl = renderer.gl;
    gl.clearColor(PAGE_BG_RGB.r, PAGE_BG_RGB.g, PAGE_BG_RGB.b, 1);

    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.backgroundColor = PAGE_BG;

    const geometry = new Triangle(gl);
    const [gridX, gridY] = gridMulKey.split(',').map(Number) as Vec2;

    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 2;
    screenCanvas.height = 2;
    const seedCtx = screenCanvas.getContext('2d');
    if (seedCtx) {
      seedCtx.fillStyle = PAGE_BG;
      seedCtx.fillRect(0, 0, 2, 2);
    }

    const screenTexture = new Texture(gl, {
      image: screenCanvas,
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      flipY: true,
    });

    let lastPaintKey = '';

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / Math.max(gl.canvas.height, 1)
          ),
        },
        uScale: { value: scale },
        uGridMul: { value: new Float32Array([gridX, gridY]) },
        uDigitSize: { value: digitSize },
        uScanlineIntensity: { value: scanlineIntensity },
        uGlitchAmount: { value: glitchAmount },
        uFlickerAmount: { value: flickerAmount },
        uNoiseAmp: { value: noiseAmp },
        uChromaticAberration: { value: chromaticAberration },
        uDither: { value: ditherValue },
        uCurvature: { value: curvature },
        uTint: { value: new Color(tintVec[0], tintVec[1], tintVec[2]) },
        uMouse: {
          value: new Float32Array([
            smoothMouseRef.current.x,
            smoothMouseRef.current.y,
          ]),
        },
        uMouseStrength: { value: mouseStrengthRef.current },
        uUseMouse: { value: mouseReactRef.current ? 1 : 0 },
        uPageLoadProgress: { value: pageLoadAnimation ? 0 : 1 },
        uUsePageLoadAnimation: { value: pageLoadAnimation ? 1 : 0 },
        uBrightness: { value: brightness },
        uUseText: { value: useText ? 1 : 0 },
        uScreen: { value: screenTexture },
        uCaretBlink: { value: 1 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const paintIfNeeded = (tMs: number, force = false) => {
      if (!useText) return;
      const cssW = ctn.offsetWidth;
      const cssH = ctn.offsetHeight;
      if (cssW < 2 || cssH < 2) return;

      const caretOn = Math.floor(tMs / 530) % 2 === 0;
      const key = [
        contentRef.current,
        contentAlignRef.current,
        showCaretRef.current ? 1 : 0,
        showCaretRef.current && caretOn ? 1 : 0,
        Math.round(cssW),
        Math.round(cssH),
      ].join('\0');

      if (!force && key === lastPaintKey) return;
      lastPaintKey = key;

      paintTextScreen(screenCanvas, {
        content: contentRef.current,
        align: contentAlignRef.current,
        showCaret: showCaretRef.current,
        caretOn: showCaretRef.current ? caretOn : false,
        cssW,
        cssH,
        dpr,
      });
      screenTexture.image = screenCanvas;
      screenTexture.needsUpdate = true;
    };

    function resize() {
      if (!ctn) return;
      const w = ctn.offsetWidth;
      const h = ctn.offsetHeight;
      if (w < 1 || h < 1) return;

      renderer.setSize(w, h);
      program.uniforms.iResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / Math.max(gl.canvas.height, 1)
      );
      lastPaintKey = '';
      paintIfNeeded(performance.now(), true);
      gl.clear(gl.COLOR_BUFFER_BIT);
      renderer.render({ scene: mesh });
    }

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(ctn);
    resize();

    const update = (t: number) => {
      rafRef.current = requestAnimationFrame(update);

      program.uniforms.uUseMouse.value = mouseReactRef.current ? 1 : 0;
      program.uniforms.uMouseStrength.value = mouseStrengthRef.current;

      if (pageLoadAnimation && loadAnimationStartRef.current === 0) {
        loadAnimationStartRef.current = t;
      }

      if (!pauseRef.current) {
        const elapsed = (t * 0.001 + timeOffsetRef.current) * timeScale;
        program.uniforms.iTime.value = elapsed;
        frozenTimeRef.current = elapsed;
      } else {
        program.uniforms.iTime.value = frozenTimeRef.current;
      }

      if (pageLoadAnimation && loadAnimationStartRef.current > 0) {
        const progress = Math.min(
          (t - loadAnimationStartRef.current) / 2000,
          1
        );
        program.uniforms.uPageLoadProgress.value = progress;
      }

      if (mouseReactRef.current) {
        const dampingFactor = 0.08;
        const smoothMouse = smoothMouseRef.current;
        const mouse = mouseRef.current;
        smoothMouse.x += (mouse.x - smoothMouse.x) * dampingFactor;
        smoothMouse.y += (mouse.y - smoothMouse.y) * dampingFactor;
        const mouseUniform = program.uniforms.uMouse.value as Float32Array;
        mouseUniform[0] = smoothMouse.x;
        mouseUniform[1] = smoothMouse.y;
      }

      paintIfNeeded(t);
      renderer.render({ scene: mesh });
    };

    rafRef.current = requestAnimationFrame(update);
    ctn.appendChild(canvas);
    paintIfNeeded(performance.now(), true);
    gl.clear(gl.COLOR_BUFFER_BIT);
    renderer.render({ scene: mesh });

    ctn.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      ctn.removeEventListener('mousemove', handleMouseMove);
      if (canvas.parentElement === ctn) ctn.removeChild(canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      loadAnimationStartRef.current = 0;
      timeOffsetRef.current = Math.random() * 100;
    };
  }, [
    dprProp,
    timeScale,
    scale,
    gridMulKey,
    digitSize,
    scanlineIntensity,
    glitchAmount,
    flickerAmount,
    noiseAmp,
    chromaticAberration,
    ditherValue,
    curvature,
    tintVec,
    pageLoadAnimation,
    brightness,
    handleMouseMove,
    useText,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden ${className}`.trim()}
      style={style}
      {...rest}
    />
  );
}
