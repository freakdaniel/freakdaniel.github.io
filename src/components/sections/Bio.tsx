import { useTranslation } from 'react-i18next';
import FadeIn from '../ui/FadeIn';
import SectionHeader from '../ui/SectionHeader';

export default function Bio() {
  const { t } = useTranslation();

  const stats = [
    { value: '5+', label: t('bio.stats.years') },
    { value: '15+', label: t('bio.stats.projects') },
    { value: '12+', label: t('bio.stats.tools') },
  ];

  return (
    <section id="about" className="px-6 sm:px-10 lg:px-16 py-32">
      <div className="mx-auto w-full max-w-6xl grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        <FadeIn revealId="bio-header">
          <SectionHeader
            label={t('bio.sectionLabel')}
            title={t('bio.title')}
          />
        </FadeIn>

        <FadeIn delay={120} revealId="bio-body">
          <div className="space-y-6 text-lg leading-relaxed text-muted">
            <p>{t('bio.p1')}</p>
            <p>{t('bio.p2')}</p>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dt className="text-2xl sm:text-3xl font-medium tracking-tight text-fg">
                  {s.value}
                </dt>
                <dd className="text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}
