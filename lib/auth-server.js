import { cookies } from 'next/headers';

export function getUserFromCookie() {
  const raw = cookies().get('nexosur_user')?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}
