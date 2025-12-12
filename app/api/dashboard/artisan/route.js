import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getMergedArtisan, upsertArtisanMeta } from '@/lib/runtimeData';

function getUser() {
  const raw = cookies().get('nexosur_user')?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

export async function GET() {
  const user = getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const slug = user.artisanSlug;
  if (!slug) return NextResponse.json({ artisan: null });
  const artisan = await getMergedArtisan(slug);
  return NextResponse.json({ artisan });
}

export async function POST(request) {
  const user = getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const { slug, name, name_en, shortDescription, shortDescription_en, description, description_en, image, whatsapp } = body || {};
  if (!slug || !name) return NextResponse.json({ error: 'slug and name required' }, { status: 400 });
  const saved = await upsertArtisanMeta(slug, { name, name_en, shortDescription, shortDescription_en, description, description_en, image, whatsapp });
  const res = NextResponse.json({ ok: true, artisan: saved });
  if (!user.artisanSlug) {
    try {
      const newUser = { ...user, role: 'artisan', artisanSlug: slug };
      const b64 = Buffer.from(JSON.stringify(newUser), 'utf8').toString('base64');
      res.cookies.set('nexosur_user', b64, { path: '/', httpOnly: false });
    } catch {}
  }
  return res;
}
