"use client";

import { useI18n } from '@/i18n/I18nProvider';
import { useAuth } from '@/auth/AuthProvider';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

export default function HeaderClient() {
  const { t } = useI18n();
  const { isAuthenticated, user, logout } = useAuth();
  const { show } = useToast();
  return (
    <header className="border-b">
      <div className="container-tight py-4 flex items-center justify-between">
        <a href="/" className="font-semibold text-xl text-brand">NexoSur</a>
        <div className="flex items-center gap-4">
          <nav className="text-sm text-gray-600 hidden sm:block">{t('brandTagline')}</nav>
          {user?.artisanSlug && (
            <Link href="/dashboard">
              <Button variant="outline">{t('dashboard')}</Button>
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{user?.name}</span>
              <Button
                onClick={() => {
                  logout();
                  show(t('logout'), { type: 'success' });
                }}
                variant="neutral"
              >
                {t('logout')}
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button>{t('login')}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
