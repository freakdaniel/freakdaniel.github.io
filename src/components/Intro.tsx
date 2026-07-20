import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export interface IntroProps {
  onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const logo = logoRef.current;
    if (!root || !logo) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      onComplete();
    };

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(logo, { opacity: 1, scale: 1 });
        gsap.to(root, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
          onComplete: finish,
        });
        return;
      }

      gsap.set(logo, { opacity: 0, scale: 0.92 });
      gsap.set(root, { opacity: 1 });

      const tl = gsap.timeline({ onComplete: finish });
      tl.to(logo, {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: 'power3.out',
      })
        .to({}, { duration: 0.8 })
        .to(
          logo,
          {
            opacity: 0,
            scale: 1.04,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          'exit'
        )
        .to(
          root,
          {
            opacity: 0,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          'exit'
        );
    }, root);

    return () => {
      ctx.revert();
      if (!completedRef.current) {
        html.style.overflow = prevHtmlOverflow;
        body.style.overflow = prevBodyOverflow;
      }
    };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg"
      aria-hidden="true"
      role="presentation"
    >
      <img
        ref={logoRef}
        src="/logo_filled.svg"
        alt=""
        draggable={false}
        className="pointer-events-none select-none w-[min(72vw,320px)] h-auto"
      />
    </div>
  );
}
