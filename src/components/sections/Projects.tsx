import FadeIn from '../ui/FadeIn';
import SectionHeader from '../ui/SectionHeader';
import ArrowLink from '../ui/ArrowLink';
import type { CSSProperties } from 'react';

interface Project {
  title: string;
  description: string;
  stack: string[];
  repo: string | null;
  demo: string | null;
}

interface Contribution {
  name: string;
  url: string;
}

const projects: Project[] = [
  {
    title: 'MPOVT CORP',
    description:
      'Corporate web platform — services, team, and a content pipeline. Built with React, .NET, and a small design system I had a lot of fun arguing with myself about.',
    stack: ['React', 'TypeScript', '.NET', 'MySQL'],
    repo: 'https://github.com/freakdaniel',
    demo: null,
  },
  {
    title: 'FREAKSITE',
    description:
      'The site you are looking at. Personal playground for typography, motion, and tiny interaction details. Vite + React, deployed to GitHub Pages.',
    stack: ['Vite', 'React', 'Tailwind'],
    repo: 'https://github.com/freakdaniel/freakdaniel.github.io',
    demo: 'https://freakdaniel.github.io',
  },
];

const contributions: Contribution[] = [
  { name: 'React Bits', url: 'https://github.com/DavidHDev/react-bits' },
  { name: 'Vue Bits', url: 'https://github.com/DavidHDev/vue-bits' },
];

export default function Projects() {
  return (
    <section id="projects" className="px-6 sm:px-10 lg:px-16 py-32">
      <div className="mx-auto w-full max-w-6xl space-y-16">
        <FadeIn>
          <SectionHeader label="02 — Projects" title="Selected work" />
        </FadeIn>

        <FadeIn stagger>
          <ul className="reveal-stagger grid gap-px bg-line border border-line rounded-2xl overflow-hidden">
            {projects.map((p, i) => (
              <li
                key={p.title}
                className="reveal-child bg-bg p-8 sm:p-10 transition-colors hover:bg-[#0f0f0f]"
                style={{ '--i': i } as CSSProperties}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-medium tracking-tight">
                      {p.title}
                    </h3>
                    <p className="max-w-2xl text-muted leading-relaxed">
                      {p.description}
                    </p>
                    <ul className="flex flex-wrap gap-2 pt-2">
                      {p.stack.map((tech) => (
                        <li
                          key={tech}
                          className="text-xs uppercase tracking-wider text-muted border border-line-strong rounded-full px-2.5 py-1"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 sm:flex-col sm:items-end sm:text-right shrink-0">
                    {p.repo && (
                      <ArrowLink href={p.repo}>Source</ArrowLink>
                    )}
                    {p.demo && <ArrowLink href={p.demo}>Live</ArrowLink>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={120}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
            <span className="text-fg">Contributed at</span>
            {contributions.map((c, i) => (
              <span key={c.name} className="inline-flex items-center gap-3">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline-offset-4 hover:underline hover:text-fg transition-colors"
                >
                  {c.name}
                </a>
                {i < contributions.length - 1 && (
                  <span aria-hidden="true" className="text-line-strong">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
