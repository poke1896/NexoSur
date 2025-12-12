"use client";

import ArtisanCard from '@/components/ArtisanCard';
import { useI18n } from '@/i18n/I18nProvider';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HomePage() {
  const { t } = useI18n();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const r = await fetch('/api/public/artisans');
        const j = await r.json();
        if (active) setData(j);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <section className="mb-8 py-8 bg-gradient-to-r from-brand/5 via-emerald-50/30 to-sky-50 rounded-2xl px-6 border border-brand/10 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="animate-slide-in-left">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{t('homeTitle')}</h1>
            <p className="mt-3 text-gray-600 text-base max-w-md">{t('homeSubtitle')}</p>
          </div>
          <Link href="/create-artisan" className="animate-slide-in-right">
            <Button className="bg-gradient-to-r from-brand to-emerald-600 hover:shadow-lg hover:shadow-brand/30 animate-pulse-glow">✨ Crear emprendimiento</Button>
          </Link>
        </div>
      </section>

      <section>
        {loading && <div className="flex justify-center py-12"><div className="text-gray-500 animate-fade-in">Cargando emprendimientos…</div></div>}
        {data && data.length > 0 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 animate-slide-up">{t('discoverVentures')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((a, i) => (
              <div key={a.id} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <ArtisanCard artisan={a} />
              </div>
            ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
