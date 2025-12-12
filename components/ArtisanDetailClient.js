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
    <div className="animate-fade-in">
      <Link href="/" className="text-sm text-brand hover:underline font-medium animate-slide-down">{t('back')}</Link>
      <div className="mt-6 flex flex-col gap-6 sm:flex-row">
        <div className="sm:w-2/5 animate-slide-in-left">
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 shadow-lg hover:shadow-2xl transition-shadow">
            <img src={artisan.image} alt={lx(artisan, 'name')} className="h-full w-full object-cover transition-transform hover:scale-105" />
          </div>
        </div>
        <div className="sm:w-3/5 animate-slide-in-right">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{lx(artisan, 'name')}</h1>
          <p className="mt-3 text-gray-700 text-base leading-relaxed">{lx(artisan, 'description')}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href={`/dashboard?slug=${artisan.slug}`} className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <Button variant="outline">{t('monitorVenture')}</Button>
            </Link>
            <Link href={`/dashboard?slug=${artisan.slug}`} className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button className="bg-gradient-to-r from-brand to-emerald-600 hover:shadow-lg hover:shadow-brand/30">{t('manageProducts')}</Button>
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-10 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('catalog')}</h2>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {artisan.products.map((p, i) => (
            <div key={p.id} className="animate-slide-up" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
              <ProductCard product={p} href={`/artisans/${artisan.slug}/products/${p.id}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
