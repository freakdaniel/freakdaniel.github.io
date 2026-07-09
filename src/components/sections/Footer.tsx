import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="px-6 sm:px-10 lg:px-16 py-10 border-t border-line">
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-muted">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span>MIT License</span>
          <span className="hidden sm:inline text-line-strong">·</span>
          <span>{t('footer.builtWith')}</span>
        </div>
        <LanguageSwitcher />
      </div>
    </footer>
  );
}
