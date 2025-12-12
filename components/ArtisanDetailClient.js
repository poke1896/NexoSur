"use client";

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useI18n } from '@/i18n/I18nProvider';
import { useAuth } from '@/auth/AuthProvider';
import Button from '@/components/ui/Button';
import { useEffect } from 'react';

export default function ArtisanDetailClient({ artisan }) {
  const { t, lx } = useI18n();
  const { user } = useAuth();
  useEffect(() => {
    fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artisanSlug: artisan.slug }),
    }).catch(() => {});
  }, [artisan.slug]);
  return (
    <div>
      <Link href="/" className="text-sm text-brand hover:underline">{t('back')}</Link>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row">
        <div className="sm:w-2/5">
          <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-100">
            <img src={artisan.image} alt={lx(artisan, 'name')} className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="sm:w-3/5">
          <h1 className="text-2xl font-semibold">{lx(artisan, 'name')}</h1>
          <p className="mt-2 text-gray-700">{lx(artisan, 'description')}</p>
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <Link href={`/dashboard?slug=${artisan.slug}`}>
              <Button variant="outline">{t('monitorVenture')}</Button>
            </Link>
            <Link href={`/dashboard?slug=${artisan.slug}`}>
              <Button>{t('manageProducts')}</Button>
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">{t('catalog')}</h2>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {artisan.products.map((p) => (
            <ProductCard key={p.id} product={p} href={`/artisans/${artisan.slug}/products/${p.id}`} />
          ))}
        </div>
      </section>
    </div>
  );
}
