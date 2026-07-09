import type { ComponentType, SVGProps } from 'react';
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

export type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { title?: string }
>;

export type ChipGlyph =
  | { kind: 'svg'; Icon: IconComponent }
  | { kind: 'img'; src: string };

/**
 * Maps a technology name (as it appears in project data) to the glyph
 * shown beside it. SVG entries recolor with `currentColor`; img entries
 * (custom logos without a Simple-Icons entry) are raster assets.
 *
 * Shared between the project-card badges and `<TechChip />` so a single
 * source of truth covers both compact cards and the detail page.
 */
export const iconByName: Record<string, ChipGlyph | undefined> = {
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

/** Resolve the glyph for a tech name, optionally overriding the lookup key. */
export function getTechGlyph(name: string, iconKey?: string): ChipGlyph | undefined {
  return iconByName[iconKey ?? name];
}
