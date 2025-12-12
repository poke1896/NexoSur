import { NextResponse } from 'next/server';
import { getMergedArtisans } from '@/lib/runtimeData';

export async function GET() {
  const list = await getMergedArtisans();
  return NextResponse.json(list);
}
