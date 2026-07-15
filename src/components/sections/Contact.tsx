import type { ComponentType, CSSProperties, SVGProps } from 'react';
import { useTranslation } from 'react-i18next';
import { SiGithub, SiTelegram, SiX } from '@icons-pack/react-simple-icons';
import { FaLinkedin } from 'react-icons/fa';
import FadeIn from '../ui/FadeIn';
import SectionHeader from '../ui/SectionHeader';

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;

interface Channel {
  name: string;
  handle: string;
  href: string;
  Icon: IconComponent;
}

const channels: Channel[] = [
  {
    name: 'GitHub',
    handle: 'github.com/freakdaniel',
    href: 'https://github.com/freakdaniel',
    Icon: SiGithub,
  },
  {
    name: 'Telegram',
    handle: 't.me/freakgroup',
    href: 'https://t.me/freakgroup',
    Icon: SiTelegram,
  },
  {
    name: 'X',
    handle: 'x.com/whoisfreak',
    href: 'https://x.com/whoisfreak',
    Icon: SiX,
  },
  {
    name: 'LinkedIn',
    handle: 'linkedin.com/in/freakdaniel',
    href: 'https://linkedin.com/in/freakdaniel',
    Icon: FaLinkedin,
  }
];

export default function Contact() {
  const { t } = useTranslation();
  return (
    <section id="contact" className="px-6 sm:px-10 lg:px-16 py-32">
      <div className="mx-auto w-full max-w-6xl space-y-16">
        <FadeIn revealId="contact-header">
          <SectionHeader
            label={t('contact.sectionLabel')}
            title={t('contact.title')}
          />
          <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
            {t('contact.intro')}
          </p>
        </FadeIn>

        <FadeIn stagger revealId="contact-list">
          <ul className="reveal-stagger grid gap-px bg-line border border-line rounded-2xl overflow-hidden">
            {channels.map((c, i) => (
              <li key={c.name} className="bg-bg" style={{ '--i': i } as CSSProperties}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="reveal-child group flex items-center justify-between gap-6 p-6 sm:p-8 transition-colors hover:bg-[#0f0f0f]"
                >
                  <div className="flex items-center gap-5">
                    <c.Icon
                      className="h-6 w-6 text-fg opacity-80 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                    <div className="flex flex-col">
                      <span className="text-base sm:text-lg text-fg">
                        {c.name}
                      </span>
                      <span className="text-sm text-muted">{c.handle}</span>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className="text-muted text-xl translate-x-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-fg"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
