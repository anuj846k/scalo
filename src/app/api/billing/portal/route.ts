import DodoPayments from 'dodopayments';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/db/drizzle';
import { organization } from '@/db/schema';

const dodopayments = new DodoPayments({
  environment:
    (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') ??
    'test_mode',
  bearerToken: process.env.DODOPAYMENTS_API_KEY!,
});

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return NextResponse.json(
      { message: 'No active organization' },
      { status: 400 },
    );
  }

  const [org] = await db
    .select({
      dodoCustomerId: organization.dodoCustomerId,
    })
    .from(organization)
    .where(eq(organization.id, organizationId))
    .limit(1);

  if (!org?.dodoCustomerId) {
    return NextResponse.json(
      { message: 'No billing customer found' },
      { status: 400 },
    );
  }

  try {
    const portal = await dodopayments.customers.customerPortal.create(
      org.dodoCustomerId,
      {
        return_url:
          (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') +
          '/dashboard/billing',
      },
    );

    return NextResponse.json({ url: portal.link });
  } catch (err) {
    console.error('Error creating portal session:', err);
    return NextResponse.json(
      { message: 'Failed to create portal session' },
      { status: 500 },
    );
  }
}
