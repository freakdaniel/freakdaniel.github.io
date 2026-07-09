import { useEffect, useRef, useState, type RefObject } from 'react';

export interface ScrollMetrics {
  hasOverflow: boolean;
  thumbTop: number;
  thumbHeight: number;
  progress: number;
  canScrollUp: boolean;
  canScrollDown: boolean;
}

export function useScrollMetrics<T extends HTMLElement>(): {
  ref: RefObject<T | null>;
  metrics: ScrollMetrics;
} {
  const ref = useRef<T | null>(null);
  const [metrics, setMetrics] = useState<ScrollMetrics>({
    hasOverflow: false,
    thumbTop: 0,
    thumbHeight: 0,
    progress: 0,
    canScrollUp: false,
    canScrollDown: false,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      const hasOverflow = el.scrollHeight > el.clientHeight + 1;
      if (!hasOverflow) {
        setMetrics({
          hasOverflow: false,
          thumbTop: 0,
          thumbHeight: 0,
          progress: 0,
          canScrollUp: false,
          canScrollDown: false,
        });
        return;
      }
      const maxScroll = el.scrollHeight - el.clientHeight;
      const progress = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
      const trackHeight = el.clientHeight;
      const ratio = el.clientHeight / el.scrollHeight;
      const thumbHeight = Math.max(24, trackHeight * ratio);
      const thumbTop = (trackHeight - thumbHeight) * progress;
      setMetrics({
        hasOverflow: true,
        thumbTop,
        thumbHeight,
        progress,
        canScrollUp: el.scrollTop > 1,
        canScrollDown: el.scrollTop < maxScroll - 1,
      });
    };

    compute();

    const ro = new ResizeObserver(() => compute());
    ro.observe(el);

    el.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);

    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, []);

  return { ref, metrics };
}
