import Ferrofluid from './Ferrofluid';

/**
 * Page-wide animated background used in the Hero section.
 * Wraps the raw `<Ferrofluid />` component with the site's monochrome palette
 * and a DPR cap so the WebGL surface stays performant on high-density
 * mobile screens.
 */
export default function HeroBackdrop() {
  return (
    <Ferrofluid
      colors={['#fafafa', '#a3a3a3', '#525252']}
      flowDirection="down"
      mouseInteraction
      dpr={Math.min(
        typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
        2
      )}
    />
  );
}
