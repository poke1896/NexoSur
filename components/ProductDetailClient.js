"use client";

import { useMemo } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useEffect } from 'react';

export default function ProductDetailClient({ artisan, product }) {
  const { t, lx, formatPrice } = useI18n();
  useEffect(() => {
    fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artisanSlug: artisan.slug, productId: product.id }),
    }).catch(() => {});
  }, [artisan.slug, product.id]);

  const waLink = useMemo(() => {
    const waPhone = artisan.whatsapp || '50680000000';
    const message = encodeURIComponent(
      `${lx(product, 'title')} - ${formatPrice(product.price)}\n${t('contactWhatsApp')}: ${lx(artisan, 'name')}`
    );
    return `https://wa.me/${waPhone}?text=${message}`;
  }, [artisan, product, lx, formatPrice, t]);

  return (
    <div className="max-w-4xl mx-auto">
      <a href={`/artisans/${artisan.slug}`} className="text-sm text-brand hover:underline">{t('backToArtisan')}</a>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl overflow-hidden bg-gray-100">
          <img src={product.image} alt={lx(product, 'title')} className="w-full h-auto object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{lx(product, 'title')}</h1>
          <p className="mt-2 text-brand font-semibold text-lg">{formatPrice(product.price)}</p>
          <p className="mt-3 text-gray-700 whitespace-pre-line">{lx(product, 'description')}</p>
          <div className="mt-5 flex gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold">
              {t('contactWhatsApp')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
