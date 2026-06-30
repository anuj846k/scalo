import { Suspense } from 'react';
import CheckoutPage from '@/features/billing/components/checkout-page';

export default function BillingPage() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}
