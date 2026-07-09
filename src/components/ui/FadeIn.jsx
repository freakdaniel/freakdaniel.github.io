import { useEffect, useRef } from 'react';

/**
 * Wraps children with a fade-up entrance that triggers when the element
 * enters the viewport. Uses IntersectionObserver and a CSS class
 * (`.is-visible`) toggled on a `.reveal` or `.reveal-stagger` element.
 *
 * `as` controls the rendered tag (default: div).
 * `stagger` enables staggered children animation.
 * `delay` (ms) is added on top of the IntersectionObserver reveal time.
 * `once` keeps the element visible after the first reveal (default true).
 */
export default function FadeIn({
  children,
  as: Tag = 'div',
  className = '',
  stagger = false,
  delay = 0,
  once = true,
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect user preference: skip the IO dance, just reveal.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              window.setTimeout(() => el.classList.add('is-visible'), delay);
            } else {
              el.classList.add('is-visible');
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
  }, [delay, once, threshold, rootMargin]);

  const base = stagger ? 'reveal-stagger' : 'reveal';

  return (
    <Tag ref={ref} className={`${base} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
