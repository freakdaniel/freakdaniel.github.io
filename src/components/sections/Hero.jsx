import FadeIn from '../ui/FadeIn';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <FadeIn stagger>
          <span
            className="reveal-child text-xs uppercase tracking-[0.25em] text-muted"
            style={{ '--i': 0 }}
          >
            Portfolio · 2026
          </span>
          <h1
            className="reveal-child mt-6 font-medium leading-[0.95] tracking-tight"
            style={{
              '--i': 1,
              fontSize: 'clamp(3rem, 11vw, 9rem)',
            }}
          >
            Daniel Freak
          </h1>
          <p
            className="reveal-child mt-6 max-w-2xl text-lg sm:text-xl text-muted leading-relaxed"
            style={{ '--i': 2 }}
          >
            Full-Stack Developer building fast, accessible, and quietly
            opinionated products on the web.
          </p>
          <div
            className="reveal-child mt-10 flex flex-wrap items-center gap-3"
            style={{ '--i': 3 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-sm text-fg">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-fg animate-pulse"
              />
              Available for new opportunities
            </span>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted hover:text-fg transition-colors"
            >
              Get in touch <span aria-hidden="true">→</span>
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
