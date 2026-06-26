import { requireAuth } from '@/lib/auth-utils';
import { AppSidebar } from '@/features/dashboard/components/app-sidebar';
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar user={user} />
      <SidebarInset className="min-h-0 overflow-hidden">
        <DashboardHeader />
        <main className="min-h-0 flex-1 overflow-hidden p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
