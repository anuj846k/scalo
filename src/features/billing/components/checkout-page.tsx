'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { TickMark } from '@/components/icons';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
  PLANS,
  type PlanConfig,
  getPlanByProductId,
} from '@/lib/billing/plans';
import useSWR from 'swr';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface SubscriptionInfo {
  subscriptionId: string | null;
  subscriptionStatus: string;
  subscriptionPlan: string | null;
  subscriptionCurrentPeriodEnd: string | null;
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 h-4 w-4 shrink-0 flex items-center justify-center">
        <TickMark className="h-[7.333px] w-[10.667px] stroke-[#0A0A0A] stroke-[1.667px]" />
      </span>
      <span className="text-[#0A0A0A] text-[13.7px] font-normal leading-5">
        {text}
      </span>
    </li>
  );
}

function PricingCard({
  plan,
  onSubscribe,
  loading,
}: {
  plan: PlanConfig;
  onSubscribe: (productId: string) => void;
  loading: string | null;
}) {
  const isThisLoading = loading === plan.productId;

  return (
    <div
      className={
        plan.highlight ? 'relative flex flex-1 self-stretch' : 'flex flex-1'
      }
    >
      {plan.highlight && (
        <div className="absolute -left-1 -top-1 -right-1 -bottom-1 rounded-[19.2px] bg-[#3a04ff]" />
      )}

      <div
        className={`flex flex-1 flex-col items-start bg-white p-8 ${
          plan.highlight
            ? 'relative rounded-2xl'
            : 'rounded-3xl border border-[#E5E5E5]'
        }`}
      >
        <h3 className="flex w-full flex-col items-start text-[#0A0A0A] text-[18.8px] font-black leading-7">
          {plan.name}
        </h3>

        <div className="flex w-full flex-col items-start pt-4">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-end gap-3">
              <span className="text-[#0A0A0A] text-[47.8px] font-bold leading-12 tracking-[-1.2px]">
                {plan.price}
              </span>
              <span className="pb-1 text-[#737373] text-[13.7px] font-normal leading-5">
                /month
              </span>
            </div>
            <p className="text-[#737373] text-[13.6px] font-normal leading-5">
              {plan.billing}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start pt-6 mt-auto">
          {plan.highlight ? (
            <Button
              onClick={() => onSubscribe(plan.productId)}
              disabled={isThisLoading}
              className="w-full rounded-2xl py-3 text-center text-[13.7px] font-[590] leading-5 h-auto bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
            >
              {isThisLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting...
                </span>
              ) : (
                'Subscribe'
              )}
            </Button>
          ) : (
            <Button
              onClick={() => onSubscribe(plan.productId)}
              disabled={isThisLoading}
              className="w-full rounded-2xl py-3 text-center text-[13.7px] font-[590] leading-5 h-auto bg-[#F5F5F5] text-[#0A0A0A] hover:bg-[#EAEAEA]"
            >
              {isThisLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting...
                </span>
              ) : (
                'Subscribe'
              )}
            </Button>
          )}
        </div>

        <div className="flex w-full flex-col items-start pt-6">
          <div className="flex flex-col items-start gap-4">
            <p className="text-[#737373] text-[13.6px] font-[510] leading-5">
              Includes:
            </p>
            <ul className="flex flex-col items-start gap-3">
              {plan.features.map((feature, i) => (
                <FeatureItem key={i} text={feature} />
              ))}
            </ul>
          </div>
        </div>

        {plan.highlight && plan.badge && (
          <div className="absolute left-[50%] -translate-x-1/2 -top-4 flex w-[132.7px] flex-col items-start">
            <div className="flex items-center justify-center w-full rounded-full bg-[#3a04ff] px-4 py-1.5 text-white text-[12px] font-[590] uppercase leading-4 tracking-[0.3px]">
              {plan.badge}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const { data: sessionData } = authClient.useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { data: subData, isLoading: subLoading } = useSWR<SubscriptionInfo>(
    '/api/billing',
    fetcher,
    {
      refreshInterval: 5000,
      dedupingInterval: 0,
      revalidateOnMount: true,
    },
  );

  const user = sessionData?.user;

  // Transient URL params — show toasts only, never used for logic
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      toast.success(
        'Payment successful! Your plan may take a moment to activate.',
      );
      window.history.replaceState({}, '', '/dashboard/billing');
    } else if (status === 'failed' || status === 'cancelled') {
      toast.error(
        status === 'cancelled'
          ? 'Payment was cancelled.'
          : 'Payment failed. Please try again.',
      );
      window.history.replaceState({}, '', '/dashboard/billing');
    }
  }, [searchParams]);

  const handleSubscribe = async (productId: string) => {
    setLoading(productId);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleManage = async () => {
    setLoading('manage');
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message || 'Could not open billing portal');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  if (subLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const subscription = subData;
  const isActive =
    subscription?.subscriptionStatus === 'active' ||
    subscription?.subscriptionStatus === 'trialing';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {user ? `Welcome back, ${user.name}` : 'Billing'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isActive
            ? 'Manage your subscription below.'
            : 'Choose a plan to get started with Scalo.'}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isActive && subscription ? (
        (() => {
          const plan =
            PLANS.find((p) => p.name === subscription.subscriptionPlan) ??
            PLANS[0];

          return (
            <div className="max-w-md">
              <div className="rounded-2xl border border-green-200 bg-white p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <h2 className="font-semibold text-lg text-green-900">
                    {plan.name} Plan
                  </h2>
                </div>

                <div className="flex items-end gap-2">
                  <span className="text-[#0A0A0A] text-[36px] font-bold leading-10 tracking-[-1px]">
                    {plan.price}
                  </span>
                  <span className="pb-1 text-[#737373] text-sm">/month</span>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 h-4 w-4 shrink-0 flex items-center justify-center">
                        <TickMark className="h-[7.333px] w-[10.667px] stroke-green-600 stroke-[1.667px]" />
                      </span>
                      <span className="text-sm text-[#0A0A0A]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {subscription.subscriptionCurrentPeriodEnd && (
                  <p className="text-xs text-[#737373]">
                    Renews{' '}
                    {new Date(
                      subscription.subscriptionCurrentPeriodEnd,
                    ).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}

                <Button
                  onClick={handleManage}
                  disabled={loading === 'manage'}
                  className="w-full rounded-xl bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
                >
                  {loading === 'manage' ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Opening portal...
                    </span>
                  ) : (
                    'Manage subscription'
                  )}
                </Button>
              </div>
            </div>
          );
        })()
      ) : subscription?.subscriptionStatus === 'past_due' ? (
        <div className="max-w-md">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <h2 className="font-semibold text-amber-900">Payment Past Due</h2>
            </div>
            <p className="text-sm text-amber-800">
              Your last payment failed. Choose a plan to reactivate your
              subscription.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-8 mt-6">
            {PLANS.map((plan, i) => (
              <PricingCard
                key={i}
                plan={plan}
                onSubscribe={handleSubscribe}
                loading={loading}
              />
            ))}
          </div>
        </div>
      ) : subscription?.subscriptionStatus === 'cancelled' ? (
        <div className="max-w-md">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-neutral-600" />
              <h2 className="font-semibold text-neutral-900">
                Subscription Cancelled
              </h2>
            </div>
            <p className="text-sm text-neutral-700">
              Your subscription has been cancelled. Choose a new plan to
              continue using Scalo.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-8 mt-6">
            {PLANS.map((plan, i) => (
              <PricingCard
                key={i}
                plan={plan}
                onSubscribe={handleSubscribe}
                loading={loading}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-8">
          {PLANS.map((plan, i) => (
            <PricingCard
              key={i}
              plan={plan}
              onSubscribe={handleSubscribe}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
