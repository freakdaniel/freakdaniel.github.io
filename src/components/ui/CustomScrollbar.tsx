import {
  type CSSProperties,
  type RefObject,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useScrollMetrics } from '../../hooks/useScrollMetrics';

export interface CustomScrollbarProps {
  children: React.ReactNode;
  className?: string;
  /** Classes for the outer relative wrapper (flex/min-height layout). */
  containerClassName?: string;
  orientation?: 'vertical' | 'horizontal';
  hideNativeScrollbar?: boolean;
  thumbClassName?: string;
  idleMs?: number;
  showFadeMasks?: boolean;
}

/**
 * Scroll container with a hidden native scrollbar, a custom thumb on
 * the right/bottom edge, and optional top/bottom fade masks.
 */
export default function CustomScrollbar({
  children,
  className = '',
  containerClassName = '',
  orientation = 'vertical',
  hideNativeScrollbar = true,
  thumbClassName = '',
  idleMs = 900,
  showFadeMasks,
}: CustomScrollbarProps) {
  const { ref, metrics } = useScrollMetrics<HTMLDivElement>();
  const isVertical = orientation === 'vertical';
  const masks = showFadeMasks ?? isVertical;

  // Thumb is visible only while the user interacts, then fades out.
  const [active, setActive] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!metrics.hasOverflow) {
      setActive(false);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const wake = () => {
      setActive(true);
      if (idleTimerRef.current != null) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(() => {
        setActive(false);
        idleTimerRef.current = null;
      }, idleMs);
    };

    el.addEventListener('scroll', wake, { passive: true });
    el.addEventListener('pointermove', wake);
    el.addEventListener('wheel', wake, { passive: true });
    return () => {
      el.removeEventListener('scroll', wake);
      el.removeEventListener('pointermove', wake);
      el.removeEventListener('wheel', wake);
      if (idleTimerRef.current != null) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
  }, [metrics.hasOverflow, ref, idleMs]);

  const containerStyle: CSSProperties = hideNativeScrollbar
    ? {
        overflowY: isVertical ? 'auto' : 'hidden',
        overflowX: isVertical ? 'hidden' : 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }
    : {};

  const visible = metrics.hasOverflow && active;

  return (
    <div className={`relative ${containerClassName}`}>
      <div
        ref={ref as RefObject<HTMLDivElement>}
        className={`${className} ${
          hideNativeScrollbar ? 'custom-scrollbar' : ''
        }`}
        style={containerStyle}
      >
        {children}
      </div>

      {/* Top fade mask: shown when scrolled down. */}
      {masks && isVertical && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 right-0 top-0 h-32 transition-opacity duration-300 ${
            metrics.hasOverflow && metrics.canScrollUp
              ? 'opacity-100'
              : 'opacity-0'
          }`}
          style={{
            background:
              'linear-gradient(to bottom, rgb(var(--color-bg-rgb) / 1) 0%, rgb(var(--color-bg-rgb) / 0.85) 12%, rgb(var(--color-bg-rgb) / 0.5) 30%, rgb(var(--color-bg-rgb) / 0.25) 50%, rgb(var(--color-bg-rgb) / 0.1) 70%, transparent 100%)',
          }}
        />
      )}

      {/* Bottom fade mask: shown when more content is below. */}
      {masks && isVertical && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 right-0 bottom-0 h-32 transition-opacity duration-300 ${
            metrics.hasOverflow && metrics.canScrollDown
              ? 'opacity-100'
              : 'opacity-0'
          }`}
          style={{
            background:
              'linear-gradient(to top, rgb(var(--color-bg-rgb) / 1) 0%, rgb(var(--color-bg-rgb) / 0.85) 12%, rgb(var(--color-bg-rgb) / 0.5) 30%, rgb(var(--color-bg-rgb) / 0.25) 50%, rgb(var(--color-bg-rgb) / 0.1) 70%, transparent 100%)',
          }}
        />
      )}

      {/* Custom thumb. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute ${
          isVertical ? 'right-0 top-0 bottom-0 w-1' : 'left-0 right-0 bottom-0 h-1'
        }`}
      >
        <div
          className={`absolute rounded-full bg-line-strong transition-opacity duration-200 ${
            visible ? 'opacity-100' : 'opacity-0'
          } ${isVertical ? 'right-0' : 'bottom-0'} ${thumbClassName}`}
          style={
            isVertical
              ? {
                  top: `${metrics.thumbTop}px`,
                  height: `${metrics.thumbHeight}px`,
                }
              : {
                  left: `${metrics.thumbTop}px`,
                  width: `${metrics.thumbHeight}px`,
                }
          }
        />
      </div>
    </div>
  );
}
