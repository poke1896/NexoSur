import { redirect } from 'next/navigation';
import { getUserFromCookie } from '@/lib/auth-server';
import DashboardClient from '@/components/dashboard/DashboardClient';

// Demo: permite acceder vía query ?slug=... aunque no haya sesión de artesano.
export default async function DashboardPage({ searchParams }) {
  const user = getUserFromCookie();
  const slugFromQuery = searchParams?.slug;
  const artisanSlug = user?.artisanSlug || slugFromQuery;

  if (!artisanSlug) {
    redirect('/login?next=/dashboard');
  }

  return <DashboardClient artisanSlug={artisanSlug} />;
}
