import type { CSSProperties, ComponentType, SVGProps } from 'react';
import { useTranslation } from 'react-i18next';
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
} from '@icons-pack/react-simple-icons';
import FadeIn from '../ui/FadeIn';
import SectionHeader from '../ui/SectionHeader';

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;

interface TechItem {
  name: string;
  Icon: IconComponent;
}

interface TechGroup {
  /** i18n key under `tech.groups` for this group's label. */
  groupKey: 'frontend' | 'backend' | 'tools';
  items: TechItem[];
}

const groups: TechGroup[] = [
  {
    groupKey: 'frontend',
    items: [
      { name: 'React', Icon: SiReact },
      { name: 'TypeScript', Icon: SiTypescript },
      { name: 'Tailwind', Icon: SiTailwindcss },
      { name: 'Vue', Icon: SiVuedotjs },
    ],
  },
  {
    groupKey: 'backend',
    items: [
      { name: 'Node.js', Icon: SiNodedotjs },
      { name: '.NET', Icon: SiDotnet },
      { name: 'MySQL', Icon: SiMysql },
      { name: 'MongoDB', Icon: SiMongodb },
    ],
  },
  {
    groupKey: 'tools',
    items: [
      { name: 'WebStorm', Icon: SiWebstorm },
      { name: 'Figma', Icon: SiFigma },
      { name: 'Linux', Icon: SiLinux },
      { name: 'Git', Icon: SiGit },
    ],
  },
];

export default function Tech() {
  const { t } = useTranslation();
  return (
    <section id="tech" className="px-6 sm:px-10 lg:px-16 py-32">
      <div className="mx-auto w-full max-w-6xl space-y-16">
        <FadeIn revealId="tech-header">
          <SectionHeader
            label={t('tech.sectionLabel')}
            title={t('tech.title')}
          />
        </FadeIn>

        <FadeIn stagger revealId="tech-grid">
          <dl className="reveal-stagger grid gap-12 sm:grid-cols-3">
            {groups.map((g, gi) => (
              <div key={g.groupKey} className="flex flex-col gap-4">
                <dt
                  className="reveal-child text-sm uppercase tracking-[0.2em] text-muted border-b border-line pb-3"
                  style={{ '--i': gi } as CSSProperties}
                >
                  {t(`tech.groups.${g.groupKey}`)}
                </dt>
                <dd>
                  <ul className="flex flex-col gap-2">
                    {g.items.map((item, ii) => (
                      <li
                        key={item.name}
                        className="reveal-child flex items-center gap-3 text-base text-fg"
                        style={{ '--i': gi * 4 + ii + 1 } as CSSProperties}
                      >
                        <item.Icon
                          className="h-4 w-4 shrink-0 text-fg"
                          aria-hidden="true"
                        />
                        <span>{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}
