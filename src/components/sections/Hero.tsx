import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from '../ui/FadeIn';
import HeroBackdrop from '../background/HeroBackdrop';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-16 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <HeroBackdrop />
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-10 h-[30vh] hero-fade pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-20 mx-auto w-full max-w-6xl">
        <FadeIn stagger revealId="hero">
          <span
            className="reveal-child text-xs uppercase tracking-[0.25em] text-muted"
            style={{ '--i': 0 } as CSSProperties}
          >
            {t('hero.greeting')}
          </span>
          <h1
            className="reveal-child mt-6 font-medium leading-[0.95] tracking-tight"
            style={
              {
                '--i': 1,
                fontSize: 'clamp(3rem, 11vw, 9rem)',
              } as CSSProperties
            }
          >
            Daniel Freak
          </h1>
          <p
            className="reveal-child mt-6 max-w-2xl text-lg sm:text-xl text-muted leading-relaxed"
            style={{ '--i': 2 } as CSSProperties}
          >
            {t('hero.subtitle')}
          </p>
          <div
            className="reveal-child mt-10 flex flex-wrap items-center gap-3"
            style={{ '--i': 3 } as CSSProperties}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-sm text-fg">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-fg animate-pulse"
              />
              {t('hero.status')}
            </span>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted hover:text-fg transition-colors"
            >
              {t('hero.cta')} <span aria-hidden="true">→</span>
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
