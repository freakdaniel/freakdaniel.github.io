import type { ComponentType, CSSProperties, SVGProps } from 'react';
import {
  SiCplusplus,
  SiSharp,
  SiDotnet,
  SiNodedotjs,
  SiReact,
  SiTypescript,
  SiVuedotjs,
  SiTailwindcss,
  SiMongodb,
  SiMysql,
  SiGit,
  SiLinux,
  SiFigma,
  SiWebstorm,
  SiAvaloniaui,
  SiChakraui,
  SiVite,
  SiReactrouter,
  SiElectron,
  SiGreensock,
} from '@icons-pack/react-simple-icons';

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;

type ChipGlyph =
  | { kind: 'svg'; Icon: IconComponent }
  | { kind: 'img'; src: string };

const iconByName: Record<string, ChipGlyph | undefined> = {
  CPlusPlus: { kind: 'svg', Icon: SiCplusplus },
  CSharp: { kind: 'svg', Icon: SiSharp },
  Dotnet: { kind: 'svg', Icon: SiDotnet },
  Nodedotjs: { kind: 'svg', Icon: SiNodedotjs },
  React: { kind: 'svg', Icon: SiReact },
  TypeScript: { kind: 'svg', Icon: SiTypescript },
  Vuedotjs: { kind: 'svg', Icon: SiVuedotjs },
  Tailwind: { kind: 'svg', Icon: SiTailwindcss },
  Tailwindcss: { kind: 'svg', Icon: SiTailwindcss },
  MongoDB: { kind: 'svg', Icon: SiMongodb },
  MySQL: { kind: 'svg', Icon: SiMysql },
  Git: { kind: 'svg', Icon: SiGit },
  Linux: { kind: 'svg', Icon: SiLinux },
  Figma: { kind: 'svg', Icon: SiFigma },
  WebStorm: { kind: 'svg', Icon: SiWebstorm },
  AvaloniaUI: { kind: 'svg', Icon: SiAvaloniaui },
  'Avalonia UI': { kind: 'svg', Icon: SiAvaloniaui },
  ChakraUI: { kind: 'svg', Icon: SiChakraui },
  'Chakra UI': { kind: 'svg', Icon: SiChakraui },
  Vite: { kind: 'svg', Icon: SiVite },
  ReactRouter: { kind: 'svg', Icon: SiReactrouter },
  'React Router': { kind: 'svg', Icon: SiReactrouter },
  Electron: { kind: 'svg', Icon: SiElectron },
  GSAP: { kind: 'svg', Icon: SiGreensock },
  '.NET 10': { kind: 'svg', Icon: SiDotnet },
  '.NET': { kind: 'svg', Icon: SiDotnet },
  'Node.js': { kind: 'svg', Icon: SiNodedotjs },
  Vue: { kind: 'svg', Icon: SiVuedotjs },
  TS: { kind: 'svg', Icon: SiTypescript },
  'P/Invoke': { kind: 'svg', Icon: SiSharp },
  Roslyn: { kind: 'img', src: '/imgs/chip-roslyn.png' },
  ogl: { kind: 'img', src: '/imgs/chip-ogl.png' },
};

export interface TechChipProps {
  name: string;
  /** Optional explicit key into the icon map (overrides `name`). */
  iconKey?: string;
  /** Size variant. `sm` for cards, `md` for detail pages. */
  size?: 'sm' | 'md';
  className?: string;
}

export default function TechChip({
  name,
  iconKey,
  size = 'sm',
  className = '',
}: TechChipProps) {
  const glyph = iconByName[iconKey ?? name];

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] gap-1.5 px-2 py-1'
      : 'text-xs gap-2 px-2.5 py-1.5';

  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';

  return (
    <li
      style={{ '--chip-name': `'${name}'` } as CSSProperties}
      className={`inline-flex items-center rounded-full border border-line-strong bg-[#111] text-fg ${sizeClasses} ${className}`}
    >
      {glyph?.kind === 'svg' ? (
        <glyph.Icon
          className={`${iconSize} shrink-0 text-fg opacity-90`}
          aria-hidden="true"
        />
      ) : glyph?.kind === 'img' ? (
        <img
          src={glyph.src}
          alt=""
          aria-hidden="true"
          className={`${iconSize} shrink-0 object-contain opacity-90`}
        />
      ) : null}
      <span className="leading-none">{name}</span>
    </li>
  );
}
