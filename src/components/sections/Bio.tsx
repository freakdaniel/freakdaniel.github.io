import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from '../ui/FadeIn';
import SectionHeader from '../ui/SectionHeader';
import FaultyTerminal from '../background/FaultyTerminal';
import BioTerminal, {
  type BioTerminalFrame,
} from './BioTerminal';

export default function Bio() {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [terminalActive, setTerminalActive] = useState(false);
  const [frame, setFrame] = useState<BioTerminalFrame>({
    content: '',
    contentAlign: 'start',
    showCaret: false,
    ariaText: '',
  });

  const handleFrame = useCallback((next: BioTerminalFrame) => {
    setFrame(next);
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          setTerminalActive(true);
        } else {
          setInView(false);
        }
      },
      { threshold: 0.28, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" className="px-6 sm:px-10 lg:px-16 py-14 sm:py-16">
      <div className="mx-auto w-full max-w-6xl space-y-10 sm:space-y-12">
        <FadeIn revealId="bio-header">
          <SectionHeader
            label={t('bio.sectionLabel')}
            title={t('bio.title')}
          />
        </FadeIn>

        <FadeIn revealId="bio-card" threshold={0.1}>
          <div ref={cardRef} className="bio-card">
            <FaultyTerminal
              mode="text"
              content={frame.content}
              contentAlign={frame.contentAlign}
              showCaret={frame.showCaret}
              scale={1.4}
              gridMul={[2, 1]}
              digitSize={1.4}
              timeScale={0.95}
              pause={!inView}
              scanlineIntensity={0.5}
              glitchAmount={0.3}
              flickerAmount={1}
              noiseAmp={0.45}
              chromaticAberration={0.7}
              dither={0.25}
              curvature={0.05}
              tint="#ffffff"
              mouseReact={false}
              mouseStrength={0.55}
              pageLoadAnimation={false}
              brightness={1.2}
              className="bio-card-faulty"
            />
            <BioTerminal active={terminalActive} onFrame={handleFrame} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
