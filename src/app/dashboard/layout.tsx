import {
  requireAuth,
  ensureActiveOrg,
  // requireActiveSubscription,
} from '@/lib/auth-utils';
import { AppSidebar } from '@/features/dashboard/components/app-sidebar';
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  await ensureActiveOrg(session);
  // Payment gating disabled for now.
  // await requireActiveSubscription(orgId);

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar user={session.user} />
      <SidebarInset className="min-h-0 overflow-hidden">
        <DashboardHeader />
        <main className="min-h-0 flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
