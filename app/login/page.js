"use client";

import { useI18n } from '@/i18n/I18nProvider';
import { useAuth } from '@/auth/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import { getArtisans } from '@/data/artisans';

export default function LoginPage() {
  const { t } = useI18n();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [artisanSlug, setArtisanSlug] = useState('');
  const artisans = useMemo(() => getArtisans(), []);
  const { show } = useToast();

  async function onSubmit(e) {
    e.preventDefault();
    await login({ name, artisanSlug: artisanSlug || null });
    show(`${t('login')}: ${name || 'Usuario'}`, { type: 'success' });
    router.push(next);
  }

  if (isAuthenticated) {
    router.push(next);
    return <p className="text-sm text-gray-600">{t('redirecting')}</p>;
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{t('login')}</h1>
      {next !== '/' && (
        <Alert variant="info" className="mb-4">{t('mustLogin')}</Alert>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">{t('username')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">{t('password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Emprendimiento (opcional)</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={artisanSlug}
            onChange={(e) => setArtisanSlug(e.target.value)}
          >
            <option value="">Solo comprador</option>
            {artisans.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" className="w-full">{t('signIn')}</Button>
      </form>
    </div>
  );
}
