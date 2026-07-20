import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

const CMD_ABOUT = 'cat ~/about.md';
const CMD_STATS = 'cat ~/stats.json';
const PROMPT = 'user@freaksite:~$ ';

export type BioTerminalAlign = 'center' | 'start';

export interface BioTerminalFrame {
  content: string;
  contentAlign: BioTerminalAlign;
  showCaret: boolean;
  ariaText: string;
}

type Phase = 'waiting' | 'session' | 'done';

function sleep(sec: number, signal: { aborted: boolean }) {
  return new Promise<void>((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    gsap.delayedCall(sec, () => resolve());
  });
}

function typeText(
  full: string,
  onUpdate: (slice: string) => void,
  opts: { cps?: number; signal: { aborted: boolean } }
): Promise<void> {
  const cps = opts.cps ?? 48;
  const step = 1 / cps;
  return new Promise((resolve) => {
    let i = 0;
    const tick = () => {
      if (opts.signal.aborted) {
        resolve();
        return;
      }
      i = Math.min(full.length, i + 1);
      onUpdate(full.slice(0, i));
      if (i >= full.length) {
        resolve();
        return;
      }
      gsap.delayedCall(step, tick);
    };
    tick();
  });
}

function buildSessionBuffer(parts: {
  cmd1: string;
  about: string;
  cmd2: string;
  stats: string;
  phase: Phase;
}): string {
  const { cmd1, about, cmd2, stats } = parts;
  const chunks: string[] = [];

  if (cmd1) {
    chunks.push(`${PROMPT}${cmd1}`);
  }
  if (about) {
    chunks.push(about);
  }
  if (cmd2) {
    chunks.push(`${PROMPT}${cmd2}`);
  }
  if (stats) {
    chunks.push(stats);
  }
  if (parts.phase === 'done') {
    chunks.push(`${PROMPT}`);
  }

  return chunks.join('\n\n');
}

export default function BioTerminal({
  active,
  onFrame,
}: {
  active: boolean;
  onFrame: (frame: BioTerminalFrame) => void;
}) {
  const { t, i18n } = useTranslation();
  const startedRef = useRef(false);
  const abortRef = useRef({ aborted: false });
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  const p1 = t('bio.p1');
  const p2 = t('bio.p2');
  const stats = useMemo(
    () =>
      [
        { key: 'years', value: '5+', label: t('bio.stats.years') },
        { key: 'projects', value: '15+', label: t('bio.stats.projects') },
        { key: 'tools', value: '12+', label: t('bio.stats.tools') },
      ] as const,
    [t, i18n.language]
  );

  const fullAbout = `${p1}\n\n${p2}`;
  const fullStats = [
    '{',
    ...stats.map(
      (s, i) =>
        `  "${s.key}": "${s.value}"${i < stats.length - 1 ? ',' : ''}  // ${s.label}`
    ),
    '}',
  ].join('\n');

  const ariaText = useMemo(
    () => [p1, p2, ...stats.map((s) => `${s.label}: ${s.value}`)].join('. '),
    [p1, p2, stats]
  );

  const [phase, setPhase] = useState<Phase>('waiting');
  const [cmd1, setCmd1] = useState('');
  const [about, setAbout] = useState('');
  const [cmd2, setCmd2] = useState('');
  const [statsText, setStatsText] = useState('');

  useEffect(() => {
    onFrameRef.current({
      content: buildSessionBuffer({
        cmd1,
        about,
        cmd2,
        stats: statsText,
        phase,
      }),
      contentAlign: 'start',
      showCaret: phase !== 'waiting',
      ariaText,
    });
  }, [phase, cmd1, about, cmd2, statsText, ariaText]);

  useEffect(() => {
    if (!startedRef.current) return;
    abortRef.current.aborted = true;
    abortRef.current = { aborted: false };
    startedRef.current = false;
    setPhase('waiting');
    setCmd1('');
    setAbout('');
    setCmd2('');
    setStatsText('');
  }, [i18n.language, p1, p2]);

  useEffect(() => {
    if (!active || startedRef.current) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      startedRef.current = true;
      setCmd1(CMD_ABOUT);
      setAbout(fullAbout);
      setCmd2(CMD_STATS);
      setStatsText(fullStats);
      setPhase('done');
      return;
    }

    startedRef.current = true;
    const signal = abortRef.current;

    const run = async () => {
      setPhase('session');

      await typeText(CMD_ABOUT, setCmd1, { cps: 28, signal });
      if (signal.aborted) return;
      await sleep(0.18, signal);
      if (signal.aborted) return;
      setAbout(fullAbout);

      await sleep(0.45, signal);
      if (signal.aborted) return;

      await typeText(CMD_STATS, setCmd2, { cps: 28, signal });
      if (signal.aborted) return;
      await sleep(0.16, signal);
      if (signal.aborted) return;
      setStatsText(fullStats);

      await sleep(0.2, signal);
      if (signal.aborted) return;
      setPhase('done');
    };

    void run();

    return () => {
      signal.aborted = true;
    };
  }, [active, fullAbout, fullStats]);

  return (
    <div className="sr-only" aria-live="polite">
      {ariaText}
    </div>
  );
}
