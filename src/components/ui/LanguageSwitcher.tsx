import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AUTODETECT,
  getLanguage,
  getStoredPreference,
  LANGUAGES,
  resolveLanguageCode,
  setStoredPreference,
  type FlagIcon,
  type Preference,
} from '../../i18n/languages';

const EXIT_DURATION_MS = 140;

/** Shared flag glyph sizing + rounding. */
function Flag({ Flag, label }: { Flag: FlagIcon; label: string }) {
  return (
    <Flag
      title={label}
      aria-label={label}
      role="img"
      className="h-3 w-[18px] shrink-0 rounded-[1px] object-cover"
    />
  );
}

/**
 * Compact language switcher rendered in the footer. The trigger shows the
 * current flag + language code (or "Auto" when following the system),
 * with no border — a quiet, inline control. Clicking opens a monochrome
 * dropdown with animated enter/exit, a custom scrollbar, and every
 * supported language listed by its own name beside its flag.
 *
 * The top option is "Auto", which follows the browser/system language.
 * Selections are persisted via the i18n storage helpers; Auto never
 * caches a concrete language, so changing the OS language keeps working.
 *
 * Keyboard: ArrowUp/Down to move, Enter/Space to select, Escape to close.
 */
export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [preference, setPreference] = useState<Preference>(
    getStoredPreference()
  );
  const [open, setOpen] = useState(false);
  // `mounted`/`closing` mirror the ProjectModal pattern: the node stays
  // mounted during the exit animation so it can fade out, then unmounts.
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const exitTimer = useRef<number | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  // The resolved concrete language, regardless of Auto vs explicit.
  const resolvedCode = i18n.language?.split('-')[0] ?? 'en';
  const isAuto = preference === AUTODETECT;

  // Options: Auto first, then every language.
  const options: Preference[] = [AUTODETECT, ...LANGUAGES.map((l) => l.code)];

  const currentIndex = Math.max(
    0,
    options.indexOf(isAuto ? AUTODETECT : resolvedCode)
  );

  // ---- mount/unmount with exit animation ----
  useEffect(() => {
    if (open) {
      if (exitTimer.current != null) {
        window.clearTimeout(exitTimer.current);
        exitTimer.current = null;
      }
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    exitTimer.current = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
      exitTimer.current = null;
    }, EXIT_DURATION_MS);
    return () => {
      if (exitTimer.current != null) {
        window.clearTimeout(exitTimer.current);
        exitTimer.current = null;
      }
    };
  }, [open, mounted]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !listRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Close on Escape and return focus to the trigger.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const focusItem = (index: number) => {
    const items = listRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="option"]'
    );
    items?.[index]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        requestAnimationFrame(() => focusItem(currentIndex));
      } else {
        focusItem(Math.min(currentIndex + 1, options.length - 1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        requestAnimationFrame(() => focusItem(currentIndex));
      } else {
        focusItem(Math.max(currentIndex - 1, 0));
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (!open) {
        e.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => focusItem(currentIndex));
      }
    }
  };

  const applyPreference = (pref: Preference) => {
    setPreference(pref);
    setStoredPreference(pref);
    void i18n.changeLanguage(resolveLanguageCode(pref));
  };

  const choose = (pref: Preference) => {
    applyPreference(pref);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const label = t('footer.language', { defaultValue: 'Language' });
  const autoLabel = t('footer.auto', { defaultValue: 'Auto' });

  // Trigger shows the resolved flag + code, prefixed with "Auto" when
  // following the system.
  const triggerLang = getLanguage(resolvedCode);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        title={label}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="inline-flex items-center gap-1.5 rounded-full px-1.5 py-1 text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-fg"
      >
        {triggerLang && (
          <Flag Flag={triggerLang.Flag} label={triggerLang.englishName} />
        )}
        <span>{resolvedCode}</span>
      </button>

      {mounted && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className={`lang-menu lang-scroll absolute bottom-full right-0 z-50 mb-2 max-h-72 w-48 overflow-y-auto rounded-2xl p-1 ${
            closing ? 'lang-menu-exit' : 'lang-menu-enter'
          }`}
        >
          {/* Auto option: follows the system language. */}
          <li>
            <button
              type="button"
              role="option"
              aria-selected={isAuto}
              onClick={() => choose(AUTODETECT)}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                isAuto
                  ? 'text-fg'
                  : 'text-muted hover:bg-[#141414] hover:text-fg'
              }`}
            >
              <span
                className="inline-flex h-3 w-[18px] shrink-0 items-center justify-center rounded-[1px] border border-line-strong text-[8px] font-semibold uppercase text-muted"
                aria-hidden="true"
              >
                A
              </span>
              <span>{autoLabel}</span>
              {isAuto && (
                <span
                  aria-hidden="true"
                  className="ml-auto text-[10px] text-muted"
                >
                  {resolvedCode}
                </span>
              )}
            </button>
          </li>

          {LANGUAGES.map((lang) => {
            const isActive = !isAuto && lang.code === resolvedCode;
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => choose(lang.code)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'text-fg'
                      : 'text-muted hover:bg-[#141414] hover:text-fg'
                  }`}
                >
                  <Flag Flag={lang.Flag} label={lang.englishName} />
                  <span className={lang.rtl ? 'text-right' : ''}>
                    {lang.endonym}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
