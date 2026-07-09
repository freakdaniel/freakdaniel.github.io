import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import TechChip from './ui/TechChip';
import ArrowLink from './ui/ArrowLink';
import CustomScrollbar from './ui/CustomScrollbar';
import { projects, getProjectBySlug } from '../data/projects';

const EXIT_DURATION_MS = 400;

/**
 * Fullscreen project preview overlay, driven by `?project=<slug>`.
 *
 * Open: a full-screen panel rises from the bottom (translateY
 * 100% -> 0), and the content inside fades up with a small stagger
 * as the panel settles. The container itself does not fade — the
 * panel simply layers over the page.
 * Close: the panel slides back down out of view; the overlay stays
 * mounted long enough for that exit animation to play.
 *
 * The article is keyed by slug so switching projects retriggers its
 * own fade-in.
 */
export default function ProjectModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSlug = searchParams.get('project');
  const activeProject = activeSlug ? getProjectBySlug(activeSlug) : undefined;
  const isOpen = Boolean(activeProject);

  // `mounted` keeps the overlay in the DOM during the exit animation;
  // `closing` toggles the .modal-exit class. `lastProject` holds the
  // most recently opened project so the overlay can keep rendering it
  // (and play the fade-out) after the URL is already cleared —
  // otherwise `activeProject` becomes undefined instantly and the
  // exit animation never plays.
  const [mounted, setMounted] = useState(isOpen);
  const [closing, setClosing] = useState(false);
  const [lastProject, setLastProject] = useState(activeProject);
  const exitTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeProject) setLastProject(activeProject);
  }, [activeProject]);

  useEffect(() => {
    if (isOpen) {
      if (exitTimerRef.current != null) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      setMounted(true);
      setClosing(false);
      return;
    }

    if (!mounted) return;
    setClosing(true);
    exitTimerRef.current = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
      exitTimerRef.current = null;
    }, EXIT_DURATION_MS);

    return () => {
      if (exitTimerRef.current != null) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
    };
  }, [isOpen, mounted]);

  // Lock page scroll while the overlay is open. Only `overflow:
  // hidden` — we deliberately do NOT hide the native scrollbar, so
  // the `scrollbar-gutter: stable` on <html> keeps reserving its
  // width and the page does not shift when the overlay opens/closes.
  // The article has its own scroll region, so long content isn't
  // stranded. Released when the close path starts.
  useEffect(() => {
    if (!isOpen) return;
    const originalHtml = document.documentElement.style.overflow;
    const originalBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = originalHtml;
      document.body.style.overflow = originalBody;
    };
  }, [isOpen]);

  // Close on Escape. Skips during the exit animation.
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !closing) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete('project');
            return next;
          },
          { replace: true }
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted, closing, setSearchParams]);

  // Render while open, or while closing (using the last project so
  // the exit animation has something to fade out).
  const shownProject = activeProject ?? (closing ? lastProject : undefined);
  if (!mounted || !shownProject) return null;
  const activeProjectResolved = shownProject;

  const close = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('project');
        return next;
      },
      { replace: true }
    );
  };

  const switchTo = (slug: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('project', slug);
        return next;
      },
      { replace: true }
    );
  };

  // Rendered in two wrappers (plain div on mobile, CustomScrollbar
  // on >= lg); extracted once to keep both copies in sync.
  const articleBody = (
    <>
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <img
          src={activeProjectResolved.logo}
          alt={`${activeProjectResolved.title} logo`}
          className="h-20 w-20 shrink-0 object-contain"
        />
        <div>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight">
            {activeProjectResolved.title}
          </h1>
          <p className="mt-3 text-lg text-muted">
            {activeProjectResolved.tagline}
          </p>
        </div>
      </header>

      {activeProjectResolved.preview && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-line">
          <img
            src={activeProjectResolved.preview}
            alt={`${activeProjectResolved.title} preview`}
            className="block w-full h-auto"
            loading="lazy"
          />
        </div>
      )}

      <section className="mt-12 max-w-3xl">
        <p className="text-lg leading-relaxed text-muted">
          {activeProjectResolved.description}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted border-b border-line pb-3">
          Stack
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {activeProjectResolved.fullStack.map((tech) => (
            <TechChip key={tech} name={tech} size="md" />
          ))}
        </ul>
      </section>

      <section className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
        {activeProjectResolved.repo && (
          <ArrowLink href={activeProjectResolved.repo}>Source</ArrowLink>
        )}
        {activeProjectResolved.demo && (
          <ArrowLink href={activeProjectResolved.demo}>Live</ArrowLink>
        )}
      </section>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Project details"
    >
      {/* The panel: full-screen black background that slides up from
          the bottom on open and slides down on close. The container
          does not animate opacity — the panel simply layers over the
          page. */}
      <div
        className={`absolute inset-0 flex flex-col bg-bg ${
          closing ? 'modal-panel-exit' : 'modal-panel-enter'
        }`}
      >
        {/* Mobile: the overlay itself scrolls. Desktop: fixed frame
            with a pinned sidebar and the article as the scroll region. */}
        <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-visible px-6 sm:px-10 lg:px-16 py-12 sm:py-20">
          {/* On open, children fade up with a small stagger (--i).
              Skip the reveal entirely during the close animation. */}
          <div
            className={`mx-auto flex w-full max-w-6xl flex-col lg:h-full lg:flex-row lg:gap-12 ${
              closing ? '' : 'modal-content-reveal'
            }`}
          >
            <aside
              className="flex shrink-0 flex-col lg:w-56 lg:h-full lg:min-h-0"
              style={{ ['--i' as string]: 0 }}
            >
              <nav aria-label="Project navigation" className="flex flex-col lg:h-full lg:min-h-0">
                {/* Back link sits above the PROJECTS label. */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={close}
                    className="inline-flex items-center gap-2 text-xs text-muted hover:text-fg transition-colors"
                    aria-label="Back to home"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="lg:hidden inline-flex items-center justify-center h-7 w-7 rounded-md text-muted hover:text-fg hover:bg-[#111] transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="hidden lg:block mt-5 mb-4 text-xs uppercase tracking-[0.2em] text-muted">
                  Projects
                </span>
                {/* Desktop-only scroller for the project list. */}
                <CustomScrollbar
                  orientation="vertical"
                  containerClassName="hidden lg:block lg:h-full lg:min-h-0 lg:flex-1"
                  className="lg:h-full lg:min-h-0 lg:pr-3"
                >
                  <ul className="flex gap-2 lg:flex-col">
                    {projects.map((p) => {
                      const isActive = p.slug === activeProjectResolved.slug;
                      return (
                        <li key={p.slug} className="shrink-0">
                          <button
                            type="button"
                            onClick={() => switchTo(p.slug)}
                            className={`group w-full flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors text-left ${
                              isActive
                                ? 'border-line-strong bg-[#111] text-fg'
                                : 'border-transparent text-muted hover:border-line hover:text-fg'
                            }`}
                            aria-current={isActive ? 'true' : undefined}
                          >
                            <img
                              src={p.logo}
                              alt=""
                              aria-hidden="true"
                              className={`h-5 w-5 shrink-0 object-contain transition-opacity duration-200 ${
                                isActive
                                  ? 'opacity-100'
                                  : 'opacity-60 group-hover:opacity-100'
                              }`}
                            />
                            <span className="whitespace-nowrap lg:whitespace-normal">
                              {p.title}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </CustomScrollbar>
              </nav>
            </aside>

            {/* Mobile: article flows inline (overlay scrolls).
                Desktop: article is the bounded scroll region. */}
            <div
              className="lg:hidden"
              style={{ ['--i' as string]: 1 }}
            >
              <article key={activeProjectResolved.slug} className="article-fade-in">
                {articleBody}
              </article>
            </div>
            <CustomScrollbar
              orientation="vertical"
              containerClassName="hidden lg:block lg:h-full lg:min-h-0 lg:flex-1 lg:pr-4"
              className="lg:h-full lg:min-h-0 lg:pr-2"
            >
              <article key={activeProjectResolved.slug} className="article-fade-in">
                {articleBody}
              </article>
            </CustomScrollbar>
          </div>
        </div>
      </div>
    </div>
  );
}
