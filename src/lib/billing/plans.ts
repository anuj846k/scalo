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
      'Up to 1,000 feedback items/month',
      '2 active source connectors',
      'Basic theme clustering',
      'Email support',
    ],
    productId: 'pdt_0Ni96sDy7B8dp0wUQziSv',
    highlight: false,
  },
];
export const PLAN_BY_PRODUCT_ID: Record<string, PlanConfig> =
  Object.fromEntries(PLANS.map((p) => [p.productId, p]));

export function getPlanByProductId(productId: string): PlanConfig | undefined {
  return PLAN_BY_PRODUCT_ID[productId];
}
