import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'standardwebhooks';
import { eq, asc } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { organization, user as userTable, member } from '@/db/schema';
import { getPlanByProductId } from '@/lib/billing/plans';

const webhookSecret = process.env.DODOPAYMENTS_WEBHOOK_SECRET!;

async function findOrgByCustomerEmail(email: string) {
  const [orgUser] = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

  if (!orgUser) return null;

  const [org] = await db
    .select({ id: organization.id })
    .from(organization)
    .innerJoin(member, eq(member.organizationId, organization.id))
    .where(eq(member.userId, orgUser.id))
    .orderBy(asc(organization.createdAt))
    .limit(1);

  return org ?? null;
}

async function updateOrgSubscription(
  orgId: string,
  data: {
    subscriptionId?: string;
    status?: string;
    plan?: string;
    currentPeriodEnd?: Date;
    dodoCustomerId?: string;
  },
) {
  const updates: Record<string, unknown> = {};
  if (data.subscriptionId !== undefined)
    updates.subscriptionId = data.subscriptionId;
  if (data.status !== undefined) updates.subscriptionStatus = data.status;
  if (data.plan !== undefined) updates.subscriptionPlan = data.plan;
  if (data.currentPeriodEnd !== undefined)
    updates.subscriptionCurrentPeriodEnd = data.currentPeriodEnd;
  if (data.dodoCustomerId !== undefined)
    updates.dodoCustomerId = data.dodoCustomerId;

  if (Object.keys(updates).length === 0) return;

  await db.update(organization).set(updates).where(eq(organization.id, orgId));

  console.log(`[webhook] Updated org ${orgId}:`, updates);
}

export async function POST(req: NextRequest) {
  try {
    const webhookId = req.headers.get('webhook-id');
    const webhookSignature = req.headers.get('webhook-signature');
    const webhookTimestamp = req.headers.get('webhook-timestamp');

    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      return NextResponse.json(
        { error: 'Missing webhook headers' },
        { status: 400 },
      );
    }

    const body = await req.text();

    const webhook = new Webhook(webhookSecret);
    try {
      await webhook.verify(body, {
        'webhook-id': webhookId,
        'webhook-signature': webhookSignature,
        'webhook-timestamp': webhookTimestamp,
      });
    } catch {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 },
      );
    }

    const payload = JSON.parse(body);
    const eventType = payload.type as string;
    const data = payload.data as Record<string, unknown>;
    const metadata = (data.metadata as Record<string, string>) || {};

    console.log(`[webhook] ${eventType}:`, {
      paymentId: data.payment_id,
      subscriptionId: data.subscription_id,
      status: data.status,
      metadata,
    });

    let orgId: string | undefined = metadata.organizationId;

    if (!orgId && data.customer) {
      const customer = data.customer as { email: string };
      console.warn(
        `[webhook] metadata.organizationId missing, falling back to email lookup for ${customer.email}`,
      );
      const found = await findOrgByCustomerEmail(customer.email);
      orgId = found?.id;
    }

    if (!orgId) {
      console.warn(
        `[webhook] Could not resolve organizationId for event ${eventType}`,
      );
      return NextResponse.json(
        { received: true, type: eventType, warning: 'org not resolved' },
        { status: 200 },
      );
    }

    switch (eventType) {
      case 'payment.succeeded': {
        const productCart = data.product_cart as
          | Array<{ product_id: string }>
          | undefined;
        const planName = productCart?.[0]?.product_id
          ? getPlanByProductId(productCart[0].product_id)?.name
          : undefined;
        const customer = data.customer as { customer_id: string } | undefined;

        await updateOrgSubscription(orgId, {
          subscriptionId: data.subscription_id as string,
          status: 'active',
          plan: planName,
          currentPeriodEnd: data.current_period_end
            ? new Date(data.current_period_end as string)
            : undefined,
          dodoCustomerId: customer?.customer_id,
        });
        break;
      }

      case 'payment.failed':
        await updateOrgSubscription(orgId, { status: 'past_due' });
        break;

      case 'subscription.created': {
        const productCart = data.product_cart as
          | Array<{ product_id: string }>
          | undefined;
        const planName = productCart?.[0]?.product_id
          ? getPlanByProductId(productCart[0].product_id)?.name
          : undefined;
        const customer = data.customer as { customer_id: string } | undefined;

        await updateOrgSubscription(orgId, {
          subscriptionId: data.subscription_id as string,
          status: data.status as string,
          plan: planName,
          currentPeriodEnd: data.current_period_end
            ? new Date(data.current_period_end as string)
            : undefined,
          dodoCustomerId: customer?.customer_id,
        });
        break;
      }

      case 'subscription.cancelled':
        await updateOrgSubscription(orgId, { status: 'cancelled' });
        break;

      case 'subscription.updated':
        await updateOrgSubscription(orgId, {
          status: data.status as string,
          currentPeriodEnd: data.current_period_end
            ? new Date(data.current_period_end as string)
            : undefined,
        });
        break;

      default:
        console.log(`[webhook] Unhandled event: ${eventType}`);
    }

    return NextResponse.json(
      { received: true, type: eventType },
      { status: 200 },
    );
  } catch (error) {
    console.error('[webhook] Processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    );
  }
}
