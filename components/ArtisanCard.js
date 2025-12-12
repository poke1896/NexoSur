"use client";

import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

export default function ArtisanCard({ artisan }) {
  const { lx } = useI18n();
  return (
    <Link
      href={`/artisans/${artisan.slug}`}
      className="group block card overflow-hidden border border-slate-200 hover:border-brand/40 transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden img-zoom">
        <img
          src={artisan.image}
          alt={lx(artisan, 'name')}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-gradient-to-r from-brand to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md animate-slide-down">Artesanía</div>
      </div>
      <div className="p-4 bg-white">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand transition-colors">{lx(artisan, 'name')}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{lx(artisan, 'shortDescription')}</p>
        <div className="mt-3 inline-block text-xs font-semibold text-brand bg-brand/10 px-2 py-1 rounded-md group-hover:bg-brand/20 transition-colors">Ver catálogo →</div>
      </div>
    </Link>
  );
}
