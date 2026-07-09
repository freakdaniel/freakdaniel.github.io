import { useSearchParams } from 'react-router-dom';
import FadeIn from '../ui/FadeIn';
import SectionHeader from '../ui/SectionHeader';
import { projects, type Project } from '../../data/projects';

/**
 * Project tiles for the homepage. Cards are flush tiles in a
 * checkerboard of two near-black tones. Content is centered by
 * default; on hover a white fill wipes up from the bottom, content
 * shifts up to make room for the core stack + "View" label, colors
 * invert, and logos recolor. Clicking opens `<ProjectModal />` via
 * the `?project=<slug>` query.
 */

/** Logo that recolors via a CSS mask, so it animates with the hover. */
function MonoLogo({ src }: { src: string }) {
  return (
    <span
      aria-hidden="true"
      className="project-card-logo block h-14 w-14 transition-colors duration-300"
      style={{
        backgroundColor: 'currentcolor',
        WebkitMask: `url(${src}) center / contain no-repeat`,
        mask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
}

/** Dual-state logo: `src` (light) by default, `hover` (dark) on hover. */
function DualLogo({ src, hover }: { src: string; hover: string }) {
  return (
    <span aria-hidden="true" className="project-card-logo relative block h-14 w-14">
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 group-hover:opacity-0"
      />
      <img
        src={hover}
        alt=""
        className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </span>
  );
}

function CardLogo({ project }: { project: Project }) {
  if (project.logoMode === 'mono') return <MonoLogo src={project.logo} />;
  if (project.logoMode === 'dual' && project.logoHover) {
    return <DualLogo src={project.logo} hover={project.logoHover} />;
  }
  return (
    <img
      src={project.logo}
      alt=""
      aria-hidden="true"
      className="project-card-logo h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-110"
    />
  );
}

export default function Projects() {
  const [, setSearchParams] = useSearchParams();

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
          <SectionHeader label="02 / Projects" title="Selected work" />
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
                  aria-label={`Open project: ${p.title}`}
                >
                  {/* White fill that wipes up from the bottom on hover. */}
                  <span aria-hidden="true" className="project-card-fill" />

                  <div className="project-card-content flex h-full w-full flex-col items-center justify-center gap-3">
                    {/* Centered block: shifts up on hover to make room
                        for the stack + View label below it. */}
                    <div className="project-card-headline flex flex-col items-center gap-3">
                      <CardLogo project={p} />
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium tracking-tight">
                          {p.title}
                        </h3>
                        <p className="project-card-muted text-sm leading-snug transition-colors duration-300">
                          {p.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Core stack + View, revealed on hover. */}
                    <div className="project-card-reveal flex flex-col items-center gap-2.5">
                      <ul className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
                        {p.shortStack.map((tech) => (
                          <li
                            key={tech}
                            className="rounded-full border border-current/20 px-2 py-0.5"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                      <span
                        aria-hidden="true"
                        className="inline-flex items-center gap-1 text-xs font-medium"
                      >
                        View
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
