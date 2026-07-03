import DodoPayments from 'dodopayments';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const dodopayments = new DodoPayments({
  environment:
    (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') ??
    'test_mode',
  bearerToken: process.env.DODOPAYMENTS_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json();

    if (!body.productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 },
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');

    const checkout = await dodopayments.checkoutSessions.create({
      product_cart: [
        {
          product_id: body.productId,
          quantity: 1,
        },
      ],
      customer: {
        name: session.user.name,
        email: session.user.email,
      },
      metadata: { organizationId },
      return_url: `${appUrl}/dashboard`,
      cancel_url: `${appUrl}/dashboard/billing?status=cancelled`,
    });

    return NextResponse.json({ url: checkout.checkout_url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
