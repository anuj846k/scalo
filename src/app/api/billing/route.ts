import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/db/drizzle';
import { organization } from '@/db/schema';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return NextResponse.json(
      { error: 'No active organization' },
      { status: 400 },
    );
  }

  const [org] = await db
    .select({
      subscriptionId: organization.subscriptionId,
      subscriptionStatus: organization.subscriptionStatus,
      subscriptionPlan: organization.subscriptionPlan,
      subscriptionCurrentPeriodEnd: organization.subscriptionCurrentPeriodEnd,
    })
    .from(organization)
    .where(eq(organization.id, organizationId))
    .limit(1);

  return NextResponse.json(
    {
      subscriptionId: org?.subscriptionId ?? null,
      subscriptionStatus: org?.subscriptionStatus ?? 'inactive',
      subscriptionPlan: org?.subscriptionPlan ?? null,
      subscriptionCurrentPeriodEnd: org?.subscriptionCurrentPeriodEnd ?? null,
    },
    {
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
