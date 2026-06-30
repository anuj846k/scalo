import { requireAuth } from '@/lib/auth-utils';

export default async function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return <main className="min-h-screen p-6">{children}</main>;
}
