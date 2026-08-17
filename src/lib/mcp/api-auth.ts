import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { db } from '@/db/drizzle';
import { member } from '@/db/schema';
import { auth } from '@/lib/auth';

export async function getMcpApiIdentity() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { error: 'Unauthorized', status: 401 } as const;
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return { error: 'No active organization', status: 400 } as const;
  }

  const [membership] = await db
    .select({ id: member.id })
    .from(member)
    .where(
      and(
        eq(member.organizationId, organizationId),
        eq(member.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!membership) {
    return { error: 'Forbidden', status: 403 } as const;
  }

  return {
    organizationId,
    userId: session.user.id,
  } as const;
}
