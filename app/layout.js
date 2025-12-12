export const metadata = {
  title: 'NexoSur',
  description: 'Marketplace de artesanos y microempresas del sur de Costa Rica',
};

import './globals.css';
import { I18nProvider } from '@/i18n/I18nProvider';
import FloatingLangToggle from '@/components/FloatingLangToggle';
import HeaderClient from '@/components/HeaderClient';
import { AuthProvider } from '@/auth/AuthProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <I18nProvider>
          <AuthProvider>
            <ToastProvider>
              <HeaderClient />
              <main className="container-tight py-6">{children}</main>
              <footer className="border-t mt-8">
                <div className="container-tight py-6 text-sm text-gray-500">
                  © {new Date().getFullYear()} NexoSur. Zona Sur, CR.
                </div>
              </footer>
              <FloatingLangToggle />
            </ToastProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
