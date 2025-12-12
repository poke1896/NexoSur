"use client";

import { useI18n } from '@/i18n/I18nProvider';
import { useToast } from '@/components/ui/ToastProvider';

export default function FloatingLangToggle() {
  const { lang, toggleLang } = useI18n();
  const { show } = useToast();
  const next = lang === 'es' ? 'EN' : 'ES';
  return (
    <button
      onClick={() => {
        toggleLang();
        show(lang === 'es' ? 'Language: English' : 'Idioma: Español', { type: 'info' });
      }}
      aria-label="Toggle language"
      className="fixed bottom-4 right-4 z-50 rounded-full bg-brand text-white shadow-lg hover:bg-brand-dark active:scale-95 transition-transform px-4 py-2 text-sm font-semibold"
    >
      {next}
    </button>
  );
}
