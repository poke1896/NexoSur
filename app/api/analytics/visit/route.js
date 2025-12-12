import { NextResponse } from 'next/server';
import { incrementArtisanVisit, incrementProductVisit } from '@/lib/analytics';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { artisanSlug, productId } = body || {};
  if (!artisanSlug) return NextResponse.json({ error: 'artisanSlug required' }, { status: 400 });
  if (productId) {
    const count = await incrementProductVisit(artisanSlug, productId);
    return NextResponse.json({ ok: true, type: 'product', count });
  } else {
    const count = await incrementArtisanVisit(artisanSlug);
    return NextResponse.json({ ok: true, type: 'artisan', count });
  }
}
