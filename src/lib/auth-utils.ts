import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { auth } from './auth';
import { db } from '@/db/drizzle';
import { member, session as sessionTable, organization } from '@/db/schema';

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function ensureActiveOrg(
  session: Awaited<ReturnType<typeof requireAuth>>,
) {
  if (session.session.activeOrganizationId) {
    return session.session.activeOrganizationId;
  }

  const [firstMember] = await db
    .select({ organizationId: member.organizationId })
    .from(member)
    .where(eq(member.userId, session.user.id))
    .limit(1);

  if (!firstMember) {
    redirect('/setup');
  }

  await db
    .update(sessionTable)
    .set({ activeOrganizationId: firstMember.organizationId })
    .where(eq(sessionTable.id, session.session.id));

  return firstMember.organizationId;
}

export async function requireActiveSubscription(organizationId: string) {
  const [org] = await db
    .select({
      subscriptionStatus: organization.subscriptionStatus,
    })
    .from(organization)
    .where(eq(organization.id, organizationId))
    .limit(1);

  const status = org?.subscriptionStatus ?? 'inactive';
  const isActive = status === 'active' || status === 'trialing';

  if (!isActive) {
    redirect('/subscribe');
  }
}

export async function requireUnauth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect('/dashboard');
  }
}

export async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session ? session.user : null;
}
