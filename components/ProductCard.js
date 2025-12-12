"use client";

import { useI18n } from '@/i18n/I18nProvider';
import Link from 'next/link';

export default function ProductCard({ product, href }) {
  const { formatPrice, lx } = useI18n();
  const inner = (
    <div className="rounded-xl overflow-hidden border bg-white">
      <div className="aspect-square w-full bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={lx(product, 'title')}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <h4 className="font-medium text-gray-900">{lx(product, 'title')}</h4>
        <p className="mt-1 text-brand font-semibold">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
  return href ? (
    <Link href={href} className="block hover:shadow-md transition-shadow">{inner}</Link>
  ) : (
    inner
  );
}
