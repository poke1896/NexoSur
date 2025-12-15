'use client';

import { useI18n } from '@/i18n/I18nProvider';

export default function FooterClient() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-12 bg-gradient-to-r from-sky-50 to-emerald-50">
      <div className="container-tight py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="text-gray-600">
            © {currentYear} NexoSur. Zona Sur, Costa Rica.
          </div>
          <div className="text-gray-700">
            {t('developedBy')}{' '}
            <a
              href="https://pokedev-ops.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sky-600 hover:text-sky-700 transition-colors underline decoration-sky-300 hover:decoration-sky-500"
            >
              PokeDev Ops
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
