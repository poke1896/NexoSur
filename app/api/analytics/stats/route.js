import { NextResponse } from 'next/server';
import { getArtisanStats } from '@/lib/analytics';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });
  const stats = await getArtisanStats(slug);
  return NextResponse.json(stats);
}
