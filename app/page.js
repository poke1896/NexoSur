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
      <section className="mb-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{t('homeTitle')}</h1>
            <p className="mt-1 text-gray-600 text-sm">{t('homeSubtitle')}</p>
          </div>
          <Link href="/create-artisan">
            <Button>Crear emprendimiento</Button>
          </Link>
        </div>
      </section>

      <section>
        {loading && <p>Cargando…</p>}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((a) => (
              <ArtisanCard key={a.id} artisan={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
