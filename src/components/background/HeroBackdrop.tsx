import { memo, useMemo } from 'react';
import Ferrofluid from './Ferrofluid';

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
