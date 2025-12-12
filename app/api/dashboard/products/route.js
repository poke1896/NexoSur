import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteProduct, getMergedArtisan, upsertProduct } from '@/lib/runtimeData';

function getUser() {
  const raw = cookies().get('nexosur_user')?.value;
  if (!raw) return null;
  try {
    const json = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
    return json;
  } catch {
    return null;
  }
}

function getSlug(request) {
  const user = getUser();
  const url = new URL(request.url);
  const slug = user?.artisanSlug || url.searchParams.get('slug');
  return slug;
}

export async function GET(request) {
  const slug = getSlug(request);
  if (!slug) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const artisan = await getMergedArtisan(slug);
  return NextResponse.json({ artisan });
}

export async function POST(request) {
  const slug = getSlug(request);
  if (!slug) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  let product = body?.product;
  if (!product) return NextResponse.json({ error: 'product required' }, { status: 400 });
  
  // Generar ID automáticamente si es nueva creación (no tiene ID o está vacío)
  if (!product.id || product.id.trim() === '') {
    product.id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  if (!product.title) return NextResponse.json({ error: 'product.title required' }, { status: 400 });
  const updated = await upsertProduct(slug, product);
  return NextResponse.json({ ok: true, products: updated.products || [] });
}

export async function PUT(request) {
  return POST(request);
}

export async function DELETE(request) {
  const slug = getSlug(request);
  if (!slug) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const updated = await deleteProduct(slug, id);
  return NextResponse.json({ ok: true, products: updated.products || [] });
}
