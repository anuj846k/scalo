export interface PlanConfig {
  name: string;
  price: string;
  billing: string;
  features: string[];
  productId: string;
  highlight: boolean;
  badge?: string;
}
export const PLANS: PlanConfig[] = [
  {
    name: 'Scalo',
    price: '$20',
    billing: 'Billed monthly',
    features: [
      'Up to 2,000 feedback items/month',
      'Unlimited active source connectors',
      'Basic theme clustering',
      'Email support',
    ],
    productId: 'pdt_0NjRVz8C3SdvgAy2X8osA',
    highlight: false,
  },
];
export const PLAN_BY_PRODUCT_ID: Record<string, PlanConfig> =
  Object.fromEntries(PLANS.map((p) => [p.productId, p]));

export function getPlanByProductId(productId: string): PlanConfig | undefined {
  return PLAN_BY_PRODUCT_ID[productId];
}
