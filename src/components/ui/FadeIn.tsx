import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

export interface FadeInProps {
  children: ReactNode;
  /** Rendered HTML tag (default: `div`). */
  as?: ElementType;
  className?: string;
  /** Stagger child reveal via `.reveal-stagger` and per-child `--i` index. */
  stagger?: boolean;
  /** Extra delay in ms before revealing. */
  delay?: number;
  /** Keep the element visible after the first reveal. */
  once?: boolean;
  /** IntersectionObserver threshold. */
  threshold?: number;
  /** IntersectionObserver rootMargin. */
  rootMargin?: string;
  /**
   * When provided, the reveal runs only the first time per session;
   * later mounts (e.g. returning from a detail page) render visible.
   */
  revealId?: string;
  /**
   * When false, withhold reveal.
   * Default true — existing call sites unchanged.
   */
  ready?: boolean;
  /** Any additional props (id, aria-*, data-*, etc.). */
  [key: string]: unknown;
}

const revealedIds = new Set<string>();

export default function FadeIn({
  children,
  as: Tag = 'div',
  className = '',
  stagger = false,
  delay = 0,
  once = true,
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  revealId,
  ready = true,
  ...rest
}: FadeInProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!ready) {
      el.classList.remove('is-visible');
      return;
    }

    if (revealId && revealedIds.has(revealId)) {
      el.classList.add('is-visible');
      return;
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.classList.add('is-visible');
      if (revealId) revealedIds.add(revealId);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              window.setTimeout(() => {
                el.classList.add('is-visible');
                if (revealId) revealedIds.add(revealId);
              }, delay);
            } else {
              el.classList.add('is-visible');
              if (revealId) revealedIds.add(revealId);
            }
            if (once) observer.unobserve(el);
          } else if (!once) {
            el.classList.remove('is-visible');
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, once, threshold, rootMargin, revealId, ready]);

  const base = stagger ? 'reveal-stagger' : 'reveal';

  return (
    <Tag ref={ref} className={`${base} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
