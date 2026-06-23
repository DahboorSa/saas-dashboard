export type Plan = {
  id: number;
  name: string;
  price: number;
  stripePriceId: string | null;
  trialDays: number;
  limits: {
    maxApiKeys: number;
    maxMembers: number;
    maxProjects: number;
    maxWebhooks: number;
    apiCallsPerMonth: number;
  };
  features: {
    export: boolean;
    webhooks: boolean;
    analytics: boolean;
    customDomain: boolean;
  };
  isActive: boolean;
  isDefault: boolean;
};

export const FALLBACK_PLANS: Plan[] = [
  {
    id: 1,
    name: 'Free',
    price: 0,
    stripePriceId: null,
    trialDays: 0,
    limits: { maxApiKeys: 2, maxMembers: 5, maxProjects: 10, maxWebhooks: 0, apiCallsPerMonth: 100 },
    features: { export: false, webhooks: false, analytics: false, customDomain: false },
    isActive: true,
    isDefault: true,
  },
  {
    id: 2,
    name: 'Pro',
    price: 19,
    stripePriceId: null,
    trialDays: 14,
    limits: { maxApiKeys: 10, maxMembers: 25, maxProjects: 100, maxWebhooks: 100, apiCallsPerMonth: 50000 },
    features: { export: false, webhooks: true, analytics: true, customDomain: false },
    isActive: true,
    isDefault: false,
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 99,
    stripePriceId: null,
    trialDays: 30,
    limits: { maxApiKeys: -1, maxMembers: -1, maxProjects: -1, maxWebhooks: -1, apiCallsPerMonth: -1 },
    features: { export: true, webhooks: true, analytics: true, customDomain: true },
    isActive: true,
    isDefault: false,
  },
];
