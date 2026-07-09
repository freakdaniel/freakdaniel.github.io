export interface Project {
  /** URL slug used by the detail page route. */
  slug: string;
  title: string;
  /** Ultra-short one-liner shown on the card. */
  tagline: string;
  description: string;
  /** Short list (2-3 items) for compact cards. */
  shortStack: string[];
  /** Full list for the detail page. */
  fullStack: string[];
  /** Logo color mode. `mono` = uses currentColor (recolors on hover). */
  logo: string;
  logoType: 'svg' | 'png';
  logoMode?: 'mono' | 'normal' | 'dual';
  /** For dual-mode logos: the dark variant shown on hover. */
  logoHover?: string;
  /** Optional preview image shown on the detail page. */
  preview?: string;
  repo: string | null;
  demo: string | null;
}

/**
 * Curated list of projects featured on the homepage and the
 * `/projects/:slug` detail page. Logos and previews are loaded
 * directly from raw.githubusercontent.com / local public/ assets.
 */
export const projects: Project[] = [
  {
    slug: 'kurisu',
    title: 'Kurisu',
    tagline: 'AI agent platform with Roslyn-generated TypeScript IPC',
    description:
      'An open-source AI agent platform that lives in a single desktop app. .NET 10 hosts the agent runtime (MCP, tools, sessions, permissions, hooks) and drives an Electron renderer through a custom bridge. The IPC layer is generated at compile time by a Roslyn source generator that emits typed TypeScript wrappers from C# method signatures. shadcn/ui & Vite on the renderer side',
    shortStack: ['.NET 10', 'Electron', 'Roslyn'],
    fullStack: ['.NET 10', 'C#', 'Electron', 'Vite', 'React', 'shadcn/ui', 'Roslyn'],
    logo: '/imgs/kurisu.png',
    logoType: 'png',
    repo: 'https://github.com/freakdaniel/Kurisu',
    demo: null,
  },
  {
    slug: 'react-bits-vue-bits',
    title: 'react-bits / vue-bits',
    tagline: 'Contributor to a 47k-star component library',
    description:
      'Contributor to one of the largest open-source React & Vue component libraries, around 47k stars combined. Refactored core components (Stack, FadeContent, AnimatedContent) adding custom scroller support, GSAP migration, and safer cleanup. The Ferrofluid background on this site is one of those components',
    shortStack: ['React', 'GSAP', 'ogl'],
    fullStack: ['React', 'TypeScript', 'Tailwind', 'GSAP', 'ogl'],
    logo: '/imgs/react-logo.svg',
    logoType: 'svg',
    logoMode: 'mono',
    repo: 'https://github.com/DavidHDev/react-bits/pulls?q=author%3Afreakdaniel',
    demo: 'https://reactbits.dev',
  },
  {
    slug: 'infiniframe',
    title: 'InfiniFrame',
    tagline: 'Cross-platform native windows for .NET',
    description:
      'Active contributor to a cross-platform native window framework for .NET. Worked on the C++ native backend: refactored the unmanaged layer, fixed memory leaks and null-guard issues, and wrote comprehensive documentation for all four libraries. Also shipped AI-assistant skills and agents for the project',
    shortStack: ['C++', 'C#', 'P/Invoke'],
    fullStack: ['C++', 'C#', '.NET', 'P/Invoke'],
    logo: '/imgs/infiniframe.png',
    logoType: 'png',
    repo: 'https://github.com/freakdaniel/InfiniFrame',
    demo: null,
  },
  {
    slug: 'mpovt',
    title: 'MPOVT',
    tagline: 'Multilingual corporate site, delivered',
    description:
      'Multilingual corporate website for OJSC "MPOVT", a custom build delivered as a paid engagement. React/Vite SPA with Chakra UI & Tailwind, GSAP & ogl/Three.js for hero animations, JWT auth via jose, TanStack Query for data, and full i18n across Belarusian, English, Russian, and Chinese. Light/dark theming, credit listed in the site footer',
    shortStack: ['React', 'Vite', 'Chakra UI'],
    fullStack: [
      'React',
      'TypeScript',
      'Vite',
      'Chakra UI',
      'Tailwind',
      'GSAP',
    ],
    logo: '/imgs/mpovt.png',
    logoType: 'png',
    logoMode: 'dual',
    logoHover: '/imgs/mpovt-dark.png',
    preview: '/imgs/mpovt-preview.png',
    repo: null,
    demo: 'https://mpovt.by',
  },
  {
    slug: 'hyprism',
    title: 'HyPrism',
    tagline: 'Hytale launcher, mainline maintainer',
    description:
      'One of the maintainers of a Hytale launcher written in C# on .NET & Electron. Fixed GPU/instance handling, owned UI work, and shipped build-system improvements across 20+ PRs',
    shortStack: ['C#', 'Electron', '.NET'],
    fullStack: ['C#', 'Electron', '.NET'],
    logo: '/imgs/hyprism.png',
    logoType: 'png',
    repo: 'https://github.com/freakdaniel/HyPrism',
    demo: null,
  },
  {
    slug: 'freaksite',
    title: 'freaksite',
    tagline: 'This site, playground for type, motion, and detail',
    description:
      'The site you are looking at. Personal playground for typography, motion, and tiny interaction details. Vite/React/TypeScript, deployed to GitHub Pages',
    shortStack: ['Vite', 'React', 'TS'],
    fullStack: ['Vite', 'React', 'TypeScript', 'Tailwind'],
    logo: '/icon.svg',
    logoType: 'svg',
    repo: 'https://github.com/freakdaniel/freakdaniel.github.io',
    demo: null,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
