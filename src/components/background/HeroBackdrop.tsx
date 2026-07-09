import { memo, useMemo } from 'react';
import Ferrofluid from './Ferrofluid';

/**
 * Page-wide animated background used in the Hero section.
 * Wraps the raw `<Ferrofluid />` component with the site's monochrome palette
 * and a DPR cap so the WebGL surface stays performant on high-density
 * mobile screens.
 *
 * The `colors` array is memoized so it has a stable identity across
 * re-renders. Without that, every parent re-render would pass a new
 * array reference, which would re-trigger Ferrofluid's useEffect --
 * and that effect creates and tears down a WebGL context, so doing
 * it unnecessarily is exactly the kind of churn that leaks GPU
 * resources over time.
 */
function HeroBackdrop() {
  const colors = useMemo(
    () => ['#fafafa', '#fafafa', '#fafafa'],
    []
  );
  const dpr = useMemo(
    () => Math.min(
      typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
      2
    ),
    []
  );

  return (
    <Ferrofluid
      colors={colors}
      flowDirection="down"
      mouseInteraction={false}
      speed={0.15}
      glow={1}
      opacity={0.7}
      dpr={dpr}
    />
  );
}

export default memo(HeroBackdrop);
