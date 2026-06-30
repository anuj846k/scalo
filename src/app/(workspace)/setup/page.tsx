import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/db/drizzle';
import { member } from '@/db/schema';
import WorkspaceSetupForm from '@/features/workspace/components/workspace-setup-form';

export default async function WorkspaceSetupPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect('/login');
  }

  const [existing] = await db
    .select({ id: member.id })
    .from(member)
    .where(eq(member.userId, session.user.id))
    .limit(1);

  if (existing) {
    redirect('/dashboard');
  }

  return <WorkspaceSetupForm />;
}
