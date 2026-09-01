import { Button } from '@/components/ui/button';
import { AlertTriangle, Download, Zap } from 'lucide-react';

const barHeights = [
  60, 45, 70, 80, 55, 35, 25, 75, 90, 110, 85, 100, 130, 120, 95, 140, 115, 105,
  160, 145, 125, 170, 155, 180, 175, 165, 195, 185, 200, 210, 175,
];
const maxHeight = Math.max(...barHeights);

const topEndpoints = [
  { endpoint: 'GET /users/me', calls: 18193, p95: '24ms' },
  // { endpoint: 'GET /usage', calls: 12480, p95: '42ms' },
  // { endpoint: 'POST /webhooks', calls: 8210, p95: '128ms' },
  // { endpoint: 'GET /organizations/members', calls: 6045, p95: '38ms' },
  // { endpoint: 'POST /api-keys', calls: 2310, p95: '95ms' },
];

function MetricCard({
  label,
  value,
  unit,
  progress,
}: {
  label: string;
  value: string;
  unit: string;
  progress: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="mt-1 text-2xl font-semibold">
        {value}{' '}
        <span className="text-base font-normal text-muted-foreground">
          {unit}
        </span>
      </p>
      <div className="mt-2.5 h-1.5 rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function UsagePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Usage</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Period: <span className="font-mono">May 1 – May 31, 2026</span> ·
            resets in 9 days ·{' '}
            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
              Pro plan
            </span>
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <Download size={13} /> Export CSV
        </Button>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-50 dark:bg-yellow-500/10 px-4 py-3 text-sm">
        <AlertTriangle size={14} className="text-yellow-600 shrink-0 mt-0.5" />
        <p className="flex-1 text-yellow-900 dark:text-yellow-200">
          <strong>API calls at 47% of monthly limit.</strong> At current rate,
          you'll hit 100k around May 27. Consider upgrading to Enterprise for
          unlimited calls.
        </p>
        <Button variant="ghost" size="sm">
          See plans
        </Button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          label="API calls"
          value="47,238"
          unit="/ 100,000"
          progress={47}
        />
        <MetricCard
          label="Webhooks (active)"
          value="4"
          unit="/ 10"
          progress={40}
        />
        <MetricCard label="Members" value="12" unit="/ 25" progress={48} />
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border border-border bg-card">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-medium">Calls per day</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            GET /usage · Redis → Postgres sync (5m)
          </p>
        </div>
        <div className="px-4 pt-4 flex items-end gap-1 h-[220px]">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${i === 21 ? 'bg-primary' : 'bg-muted'}`}
              style={{ height: `${(h / maxHeight) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between px-4 pb-3 pt-1 text-[10.5px] text-muted-foreground font-mono">
          <span>May 1</span>
          <span>May 8</span>
          <span>May 15</span>
          <span>May 22 (today)</span>
          <span>May 31</span>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Top endpoints */}
        <div className="rounded-xl border border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-medium">Top endpoints</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-5 py-2.5 text-left font-medium">Endpoint</th>
                <th className="px-5 py-2.5 text-right font-medium">Calls</th>
                <th className="px-5 py-2.5 text-right font-medium">p95</th>
              </tr>
            </thead>
            <tbody>
              {topEndpoints?.map((row) => (
                <tr
                  key={row.endpoint}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-2.5 font-mono text-xs">
                    {row.endpoint}
                  </td>
                  <td className="px-5 py-2.5 text-right text-xs">
                    {row.calls.toLocaleString()}
                  </td>
                  <td className="px-5 py-2.5 text-right font-mono text-xs text-muted-foreground">
                    {row.p95}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-medium">Notifications</h3>
          </div>
          <div className="px-5 py-4 flex flex-col gap-3">
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input type="checkbox" className="rounded" defaultChecked />
              <span>
                Email me at <strong>80%</strong> of monthly limit
              </span>
            </label>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input type="checkbox" className="rounded" defaultChecked />
              <span>
                Email me at <strong>95%</strong> of monthly limit
              </span>
            </label>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input type="checkbox" className="rounded" />
              <span>
                Fire{' '}
                <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                  plan.limit_exceeded
                </code>{' '}
                webhook
              </span>
            </label>
            <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground mt-1">
              <Zap size={12} className="shrink-0 mt-0.5" />
              <span>
                Limit warning notifications (80% / 95%) are planned in the
                roadmap.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
