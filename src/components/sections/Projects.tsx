import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FadeIn from '../ui/FadeIn';
import SectionHeader from '../ui/SectionHeader';
import ProjectLogo from '../ui/ProjectLogo';
import { getTechGlyph } from '../../data/techIcons';
import { projects } from '../../data/projects';

export default function Projects() {
  const [, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const openProject = (slug: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('project', slug);
        return next;
      },
      { replace: false }
    );
  };

  return (
    <section id="projects" className="px-6 sm:px-10 lg:px-16 py-32">
      <div className="mx-auto w-full max-w-6xl space-y-16">
        <FadeIn revealId="projects-header">
          <SectionHeader
            label={t('projects.sectionLabel')}
            title={t('projects.title')}
          />
        </FadeIn>

        <FadeIn>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line rounded-2xl overflow-hidden">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => openProject(p.slug)}
                  className="project-card group flex aspect-[4/3] w-full flex-col items-center justify-center p-8 text-center focus-visible:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-fg/40"
                  style={{
                    backgroundColor: i % 2 === 0 ? '#0a0a0a' : '#111111',
                  }}
                  aria-label={t('projects.openLabel', { title: p.title })}
                >
                  {/* White fill that wipes up from the bottom on hover. */}
                  <span aria-hidden="true" className="project-card-fill" />

                  <div className="project-card-content flex h-full w-full flex-col items-center justify-center gap-3">
                    {/* Centered block: shifts up on hover to make room */}
                    <div className="project-card-headline flex flex-col items-center gap-3">
                      <ProjectLogo
                        project={p}
                        className="project-card-logo h-14 w-14 transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium tracking-tight">
                          {p.title}
                        </h3>
                        <p className="project-card-muted text-sm leading-snug transition-colors duration-300">
                          {t(`projects.items.${p.slug}.tagline`, {
                            defaultValue: p.tagline,
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Core stack + View, revealed on hover. */}
                    <div className="project-card-reveal flex flex-col items-center gap-2.5">
                      <ul className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
                        {p.shortStack.map((tech) => {
                          const glyph = getTechGlyph(tech);
                          return (
                            <li
                              key={tech}
                              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                            >
                              {glyph?.kind === 'svg' ? (
                                <glyph.Icon
                                  className="h-3 w-3 shrink-0"
                                  aria-hidden="true"
                                />
                              ) : glyph?.kind === 'img' ? (
                                <img
                                  src={glyph.src}
                                  alt=""
                                  aria-hidden="true"
                                  className="h-3 w-3 shrink-0 object-contain"
                                />
                              ) : null}
                              <span className="leading-none">{tech}</span>
                            </li>
                          );
                        })}
                      </ul>
                      <span
                        aria-hidden="true"
                        className="inline-flex items-center gap-1 text-xs font-medium"
                      >
                        {t('projects.view')}
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
