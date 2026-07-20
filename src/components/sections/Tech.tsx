import { useTranslation } from 'react-i18next';
import FadeIn from '../ui/FadeIn';
import SectionHeader from '../ui/SectionHeader';
import TechShowcase from './TechShowcase';

export default function Tech() {
  const { t } = useTranslation();
  return (
    <section id="tech" className="px-6 sm:px-10 lg:px-16 py-14 sm:py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl space-y-8 sm:space-y-12">
        <FadeIn revealId="tech-header">
          <SectionHeader
            label={t('tech.sectionLabel')}
            title={t('tech.title')}
          />
        </FadeIn>

        <FadeIn revealId="tech-showcase" threshold={0.12}>
          <TechShowcase />
        </FadeIn>
      </div>
    </section>
  );
}
