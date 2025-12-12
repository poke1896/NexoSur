import { getArtisanBySlug } from '@/data/artisans';
import ProductDetailClient from '@/components/ProductDetailClient';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export default function ProductDetailPage({ params }) {
  const { slug, productId } = params;
  const isAuth = cookies().get('nexosur_auth')?.value === '1';
  if (!isAuth) {
    const next = `/artisans/${slug}/products/${productId}`;
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  const artisan = getArtisanBySlug(slug);
  if (!artisan) return notFound();
  const product = artisan.products.find((p) => p.id === productId);
  if (!product) return notFound();

  return <ProductDetailClient artisan={artisan} product={product} />;
}
