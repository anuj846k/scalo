import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db/drizzle';
import { invitation, organization, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ invitations: [] });
  }

  const invitations = await db
    .select({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
      organizationId: invitation.organizationId,
      organizationName: organization.name,
      inviterId: invitation.inviterId,
      inviterName: user.name,
      inviterEmail: user.email,
    })
    .from(invitation)
    .where(
      and(
        eq(invitation.email, session.user.email),
        eq(invitation.status, 'pending'),
      ),
    )
    .leftJoin(organization, eq(invitation.organizationId, organization.id))
    .leftJoin(user, eq(invitation.inviterId, user.id));

  const result = invitations.map((inv) => ({
    id: inv.id,
    email: inv.email,
    role: inv.role,
    status: inv.status,
    expiresAt: inv.expiresAt,
    createdAt: inv.createdAt,
    organization: inv.organizationName
      ? { name: inv.organizationName, id: inv.organizationId }
      : null,
    inviter: inv.inviterName
      ? { name: inv.inviterName, email: inv.inviterEmail }
      : null,
  }));

  return NextResponse.json({ invitations: result });
}
