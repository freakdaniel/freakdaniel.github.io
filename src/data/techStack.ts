import { createElement, type ComponentType, type SVGProps } from 'react';
import {
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiVuedotjs,
  SiNodedotjs,
  SiDotnet,
  SiMysql,
  SiMongodb,
  SiWebstorm,
  SiFigma,
  SiLinux,
  SiGit,
  SiVite,
  SiElectron,
  SiGreensock,
  SiThreedotjs,
  SiChakraui,
  SiFramer,
  SiI18next,
  SiSqlite,
  SiSharp,
  SiCplusplus,
  SiDocker,
  SiCmake,
  SiGithubactions,
} from '@icons-pack/react-simple-icons';

export type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { title?: string }
>;

function imgIcon(src: string, label: string): IconComponent {
  const Comp: IconComponent = (props) => {
    const { className, ...rest } = props;
    return createElement(
      'svg',
      {
        viewBox: '0 0 24 24',
        className,
        role: 'img',
        'aria-label': label,
        ...rest,
      },
      createElement('image', {
        href: src,
        width: 24,
        height: 24,
        preserveAspectRatio: 'xMidYMid meet',
      })
    );
  };
  Comp.displayName = `ImgIcon(${label})`;
  return Comp;
}

const SiOgl = imgIcon('/imgs/chip-ogl.png', 'ogl');
const SiRoslyn = imgIcon('/imgs/chip-roslyn.png', 'Roslyn');

export type TechGroupKey = 'frontend' | 'backend' | 'tools';

export type TechId =
  | 'react'
  | 'typescript'
  | 'tailwind'
  | 'vue'
  | 'vite'
  | 'electron'
  | 'gsap'
  | 'ogl'
  | 'three'
  | 'chakra'
  | 'framer'
  | 'i18next'
  | 'nodejs'
  | 'dotnet'
  | 'csharp'
  | 'cplusplus'
  | 'mysql'
  | 'mongodb'
  | 'sqlite'
  | 'roslyn'
  | 'docker'
  | 'webstorm'
  | 'figma'
  | 'linux'
  | 'git'
  | 'cmake'
  | 'githubactions';

export interface TechItem {
  id: TechId;
  name: string;
  groupKey: TechGroupKey;
  Icon: IconComponent;
}

export const techStack: TechItem[] = [
  { id: 'react', name: 'React', groupKey: 'frontend', Icon: SiReact },
  { id: 'typescript', name: 'TypeScript', groupKey: 'frontend', Icon: SiTypescript },
  { id: 'vite', name: 'Vite', groupKey: 'frontend', Icon: SiVite },
  { id: 'tailwind', name: 'Tailwind', groupKey: 'frontend', Icon: SiTailwindcss },
  { id: 'vue', name: 'Vue', groupKey: 'frontend', Icon: SiVuedotjs },
  { id: 'electron', name: 'Electron', groupKey: 'frontend', Icon: SiElectron },
  { id: 'gsap', name: 'GSAP', groupKey: 'frontend', Icon: SiGreensock },
  { id: 'ogl', name: 'ogl', groupKey: 'frontend', Icon: SiOgl },
  { id: 'three', name: 'Three.js', groupKey: 'frontend', Icon: SiThreedotjs },
  { id: 'chakra', name: 'Chakra UI', groupKey: 'frontend', Icon: SiChakraui },
  { id: 'framer', name: 'Framer Motion', groupKey: 'frontend', Icon: SiFramer },
  { id: 'i18next', name: 'i18next', groupKey: 'frontend', Icon: SiI18next },

  { id: 'dotnet', name: '.NET', groupKey: 'backend', Icon: SiDotnet },
  { id: 'csharp', name: 'C#', groupKey: 'backend', Icon: SiSharp },
  { id: 'cplusplus', name: 'C++', groupKey: 'backend', Icon: SiCplusplus },
  { id: 'nodejs', name: 'Node.js', groupKey: 'backend', Icon: SiNodedotjs },
  { id: 'roslyn', name: 'Roslyn', groupKey: 'backend', Icon: SiRoslyn },
  { id: 'sqlite', name: 'SQLite', groupKey: 'backend', Icon: SiSqlite },
  { id: 'mysql', name: 'MySQL', groupKey: 'backend', Icon: SiMysql },
  { id: 'mongodb', name: 'MongoDB', groupKey: 'backend', Icon: SiMongodb },
  { id: 'docker', name: 'Docker', groupKey: 'backend', Icon: SiDocker },

  { id: 'webstorm', name: 'WebStorm', groupKey: 'tools', Icon: SiWebstorm },
  { id: 'figma', name: 'Figma', groupKey: 'tools', Icon: SiFigma },
  { id: 'git', name: 'Git', groupKey: 'tools', Icon: SiGit },
  { id: 'linux', name: 'Linux', groupKey: 'tools', Icon: SiLinux },
  { id: 'cmake', name: 'CMake', groupKey: 'tools', Icon: SiCmake },
  { id: 'githubactions', name: 'GitHub Actions', groupKey: 'tools', Icon: SiGithubactions },
];

export const techGroupOrder: TechGroupKey[] = [
  'frontend',
  'backend',
  'tools',
];

export const defaultTechId: TechId = 'react';

export function getTechById(id: TechId): TechItem {
  return techStack.find((t) => t.id === id) ?? techStack[0]!;
}
