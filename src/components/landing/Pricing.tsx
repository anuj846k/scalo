'use client';

import React from 'react';
import { TickMark } from '../icons';
import Link from 'next/link';

type Plan = {
  name: string;
  price?: string;
  billing?: string;
  features?: string[];
  highlight: boolean;
  badge?: string;
  comingSoon?: boolean;
};

const plans: Plan[] = [
  {
    name: 'Scalo',
    price: '$20',
    billing: 'Billed monthly',
    features: [
      'Up to 2,000 feedback items/month',
      'unlimited active source connectors ( ltd time)',
      'Basic theme clustering',
      'Email support',
    ],
    highlight: true,
    badge: 'Available Now',
  },
  {
    name: 'Pro',
    comingSoon: true,
    highlight: false,
  },
  {
    name: 'Enterprise',
    comingSoon: true,
    highlight: false,
  },
];

type FeatureItemProps = {
  text: string;
};

const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => {
  return (
    <li className="flex items-start gap-3 self-stretch">
      <span className="h-4 w-4 shrink-0 flex items-center justify-center">
        <TickMark className="h-[7.333px] w-[10.667px] stroke-[#0A0A0A] stroke-[1.667px] opacity-100" />
      </span>

      <span className="flex flex-col items-start text-[#0A0A0A] text-[13.7px] font-normal leading-5">
        {text}
      </span>
    </li>
  );
};

type PricingCardProps = {
  plan: Plan;
};

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  const cardBase = 'flex flex-1 flex-col items-start self-stretch bg-white p-8';

  if (plan.comingSoon) {
    return (
      <div className="flex flex-1">
        <div
          className={`${cardBase} relative flex w-full rounded-3xl border border-dashed border-[#E5E5E5] opacity-70`}
        >
          <h3 className="flex w-full md:w-63.5 flex-col items-start text-[#0A0A0A] text-[18.8px] font-black leading-7">
            {plan.name}
          </h3>

          <div className="flex flex-1 flex-col items-center justify-center self-stretch pt-10 pb-6 text-center">
            <span className="rounded-full bg-[#F5F5F5] px-3 py-1 text-[11.6px] font-[590] uppercase tracking-[0.3px] text-[#737373]">
              Coming Soon
            </span>
            <p className="mt-3 max-w-[200px] text-[13.6px] font-normal leading-5 text-[#737373]">
              More plans launching soon.
            </p>
          </div>

          <div className="flex w-full md:w-63.5 flex-col items-start pt-6">
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed flex-col items-center justify-center rounded-2xl bg-[#F5F5F5] py-3 text-center text-[13.7px] font-[590] leading-5 text-[#737373]"
            >
              Coming Soon
            </button>
          </div>

          <div className="flex w-full md:w-63.5 flex-col items-start pt-6 opacity-50">
            <div className="flex flex-col items-start gap-4 self-stretch">
              <p className="flex flex-col items-start self-stretch text-[#737373] text-[13.6px] font-[510] leading-5">
                Includes:
              </p>
              <ul className="flex flex-col items-start gap-3 self-stretch">
                <li className="h-4 w-3/4 rounded bg-[#F5F5F5]" />
                <li className="h-4 w-2/3 rounded bg-[#F5F5F5]" />
                <li className="h-4 w-1/2 rounded bg-[#F5F5F5]" />
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cardStyle = plan.highlight
    ? 'relative rounded-2xl'
    : 'rounded-3xl border border-[#E5E5E5]';

  return (
    <div
      className={
        plan.highlight ? 'relative flex flex-1 self-stretch' : 'flex flex-1'
      }
    >
      {plan.highlight && (
        <div className="absolute -left-1 -top-1 -right-1 -bottom-1 rounded-[19.2px] bg-[#3a04ff]" />
      )}

      <div className={`${cardBase} ${cardStyle}`}>
        <h3 className="flex w-full md:w-63.5 flex-col items-start text-[#0A0A0A] text-[18.8px] font-black leading-7">
          {plan.name}
        </h3>

        <div className="flex w-full md:w-63.5 flex-col items-start pt-4">
          <div className="flex flex-col items-start gap-2 self-stretch">
            <div className="flex items-end gap-3 self-stretch">
              <div className="flex flex-col items-start text-[#0A0A0A] text-[47.8px] font-bold leading-12 tracking-[-1.2px]">
                {plan.price}
              </div>

              <div className="flex flex-col items-start pb-1 text-[#737373] text-[13.7px] font-normal leading-5">
                /month
              </div>
            </div>

            <p className="flex flex-col items-start self-stretch text-[#737373] text-[13.6px] font-normal leading-5 font-normal">
              {plan.billing}
            </p>
          </div>
        </div>

        <div className="flex w-full md:w-63.5 flex-col items-start pt-6 mt-auto">
          <Link
            href="/signup"
            className={`flex flex-col items-center justify-center w-full rounded-2xl py-3 text-center text-[13.7px] font-[590] leading-5 ${
              plan.highlight
                ? 'bg-[#0A0A0A] text-white hover:opacity-90'
                : 'bg-[#F5F5F5] text-[#0A0A0A] hover:bg-[#EAEAEA]'
            }`}
          >
            Get Started
          </Link>
        </div>

        <div className="flex w-full md:w-63.5 flex-col items-start pt-6">
          <div className="flex flex-col items-start gap-4 self-stretch">
            <p className="flex flex-col items-start self-stretch text-[#737373] text-[13.6px] font-[510] leading-5">
              Includes:
            </p>

            <ul className="flex flex-col items-start gap-3 self-stretch">
              {plan.features?.map((feature: string, index: number) => (
                <FeatureItem key={index} text={feature} />
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
};

const Pricing: React.FC = () => {
  return (
    <section
      id="pricing"
      className="flex w-full flex-col items-center bg-[#F5F5F5] px-4 md:px-12 lg:px-[223px] py-16 md:py-28"
    >
      <div className="flex w-full max-w-5xl flex-col items-center lg:items-start gap-12 md:gap-16 self-stretch mx-auto">
        <div className="flex flex-col items-center gap-[13.3px] self-stretch pt-[2.75px]">
          <h2 className="self-stretch text-center text-primary text-[48px] leading-12 font-semibold">
            Simple, transparent pricing
          </h2>

          <p className="w-full max-w-2xl pt-[2.7px] text-center text-[#737373] text-[16.9px] font-normal leading-7 px-4">
            Choose the plan that works best for your business.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-8 self-stretch px-4 lg:px-0">
          {plans.map((plan: Plan, index: number) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
