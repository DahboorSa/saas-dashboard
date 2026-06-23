import { Button } from '@/components/ui/button';
import { FALLBACK_PLANS, type Plan } from '@/lib/plans';
import { useAppSelector } from '@/store/hooks';
import { Bolt, Check, CreditCard, Download, ExternalLink } from 'lucide-react';
import { useState } from 'react';

type Invoice = {
  date: string;
  amount: string;
  status: 'paid' | 'unpaid' | 'overdue';
};

function formatPrice(plan: Plan) {
  if (plan.name === 'Enterprise') return 'Custom';
  return plan.price === 0 ? '$0' : `$${plan.price}`;
}

function formatPer(plan: Plan) {
  if (plan.name === 'Enterprise') return 'contact sales';
  return plan.price === 0 ? 'forever' : 'per month';
}

function getFeatureList(plan: Plan): string[] {
  const { limits, features, trialDays } = plan;
  const list: string[] = [];

  list.push(
    limits.apiCallsPerMonth === -1
      ? 'Unlimited API calls/mo'
      : `${limits.apiCallsPerMonth.toLocaleString()} API calls/mo`,
  );
  list.push(
    limits.maxWebhooks === -1
      ? 'Unlimited webhook endpoints'
      : `${limits.maxWebhooks} webhook endpoint${limits.maxWebhooks !== 1 ? 's' : ''}`,
  );
  list.push(
    limits.maxMembers === -1
      ? 'Unlimited members'
      : `${limits.maxMembers} members`,
  );
  list.push(
    limits.maxApiKeys === -1
      ? 'Unlimited API keys'
      : `${limits.maxApiKeys} API keys`,
  );

  if (features.analytics) list.push('Analytics');
  if (features.export) list.push('Audit log export');
  if (features.customDomain) list.push('SAML SSO · custom domain');
  if (trialDays > 0) list.push(`${trialDays}-day free trial`);

  return list;
}

export default function BillingPage() {
  const { data: organization } = useAppSelector((s) => s.org);
  const { data: dataPlans } = useAppSelector((s) => s.plans);
  const plans = dataPlans.length > 0 ? dataPlans : FALLBACK_PLANS;
  const currentPlanId = organization?.plan?.id ?? 1;
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Plans &amp; billing
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Choose the plan that fits your usage. Changes take effect
            immediately, prorated.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <ExternalLink className="size-3.5" /> Open Stripe portal
        </Button>
      </div>

      {/* Trial banner */}
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <Bolt className="size-4 shrink-0 text-amber-500" />
        <p className="flex-1">
          You're on the <strong>Pro trial</strong>. Trial ends{' '}
          <strong>May 26</strong> · 4 days remaining. Add a payment method to
          continue uninterrupted.
        </p>
        <Button
          size="sm"
          className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white border-0"
        >
          Add payment method
        </Button>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isHighlighted = isCurrent;
          return (
            <div
              key={plan.id}
              className={`relative rounded-xl bg-white shadow-xs flex flex-col overflow-hidden ${
                isHighlighted
                  ? 'border-[1.5px] border-gray-900 bg-linear-to-b from-gray-50 to-white'
                  : 'border border-gray-200'
              }`}
            >
              {isCurrent && (
                <span className="absolute top-3.5 right-3.5 inline-flex items-center rounded-md bg-gray-900 px-2 py-0.5 text-[10px] font-semibold font-mono uppercase tracking-wide text-white">
                  CURRENT
                </span>
              )}

              <div className="p-5 pb-4">
                <div className="text-[11px] font-semibold font-mono uppercase tracking-widest text-gray-400">
                  {plan.name}
                </div>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-3xl font-semibold tracking-tight text-gray-900">
                    {formatPrice(plan)}
                  </span>
                  <span className="font-mono text-xs text-gray-400">
                    {formatPer(plan)}
                  </span>
                </div>
                {plan.trialDays > 0 && (
                  <div className="mt-1 text-xs text-gray-400">
                    {plan.trialDays}-day trial included
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 px-5 py-4 flex-1">
                {getFeatureList(plan).map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 py-1 text-sm text-gray-700"
                  >
                    <Check
                      className="size-3.5 shrink-0 text-gray-900"
                      strokeWidth={2.2}
                    />
                    {f}
                  </div>
                ))}
              </div>

              <div className="px-5 pb-5 pt-3">
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current plan
                  </Button>
                ) : plan.name === 'Enterprise' ? (
                  <Button variant="outline" className="w-full">
                    Contact sales
                  </Button>
                ) : plan.id < currentPlanId ? (
                  <Button variant="outline" className="w-full">
                    Downgrade to {plan.name}
                  </Button>
                ) : (
                  <Button className="w-full">Upgrade to {plan.name}</Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment method + Invoices */}
      <div className="grid grid-cols-2 gap-4">
        {/* Payment method */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-xs">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Payment method
            </h3>
            <p className="mt-0.5 text-xs text-gray-400">
              Stored on Stripe ·{' '}
              <span className="font-mono">cus_QkX9···m2</span>
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
              <CreditCard className="size-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                No payment method on file
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                Add a card to keep your subscription active after the trial.
              </p>
            </div>
            <Button size="sm" className="mt-1">
              Add card
            </Button>
          </div>
        </div>

        {/* Invoices */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-xs">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Invoices</h3>
            <p className="mt-0.5 text-xs text-gray-400">Last 12 months</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <tr
                  key={inv.date}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    {inv.date}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{inv.amount}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-green-50 px-2 py-0.5 text-[10.5px] font-semibold font-mono uppercase tracking-wide text-green-700 ring-1 ring-green-200">
                      <span className="size-1.5 rounded-full bg-green-500" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon-sm" title="Download">
                        <Download className="size-3.5 text-gray-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
