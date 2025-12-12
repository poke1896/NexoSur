import { NextResponse } from 'next/server';
import { getMergedArtisan } from '@/lib/runtimeData';

export async function GET(_req, { params }) {
  const artisan = await getMergedArtisan(params.slug);
  if (!artisan) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(artisan);
}
