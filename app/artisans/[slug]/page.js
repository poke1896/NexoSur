import { getMergedArtisan } from '@/lib/runtimeData';
import { notFound } from 'next/navigation';
import ArtisanDetailClient from '@/components/ArtisanDetailClient';

export async function generateMetadata({ params }) {
  const artisan = await getMergedArtisan(params.slug);
  if (!artisan) return { title: 'Artesano no encontrado - NexoSur' };
  return { title: `${artisan.name} - NexoSur` };
}

export default function ArtisanPage({ params }) {
  const artisan = getMergedArtisan(params.slug);
  return Promise.resolve(artisan).then((a) => {
    if (!a) return notFound();
    return <ArtisanDetailClient artisan={a} />;
  });
}
