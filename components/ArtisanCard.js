"use client";

import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

export default function ArtisanCard({ artisan }) {
  const { lx } = useI18n();
  return (
    <Link
      href={`/artisans/${artisan.slug}`}
      className="group block card card-hover overflow-hidden"
    >
      <div className="aspect-[16/9] w-full bg-gray-100 overflow-hidden img-zoom">
        <img
          src={artisan.image}
          alt={lx(artisan, 'name')}
          className="h-full w-full object-cover transition-transform"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{lx(artisan, 'name')}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{lx(artisan, 'shortDescription')}</p>
      </div>
    </Link>
  );
}
