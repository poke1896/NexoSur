export const metadata = {
  title: 'NexoSur',
  description: 'Marketplace de artesanos y microempresas del sur de Costa Rica',
};

import './globals.css';
import { I18nProvider } from '@/i18n/I18nProvider';
import FloatingLangToggle from '@/components/FloatingLangToggle';
import HeaderClient from '@/components/HeaderClient';
import FooterClient from '@/components/FooterClient';
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
              <FooterClient />
              <FloatingLangToggle />
            </ToastProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
