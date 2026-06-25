import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSelector } from '@/store/hooks';
import {
  type LucideIcon,
  AlertTriangle,
  Building2,
  Download,
  Key,
  Mail,
  Plus,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserMinus,
  Users,
  Webhook,
} from 'lucide-react';

type ActionMeta = { icon: LucideIcon; title: string };

const ACTION_MAP: Record<string, ActionMeta> = {
  'org.updated': { icon: Building2, title: 'Organization updated' },
  'member.invited': { icon: Mail, title: 'Invitation sent' },
  'member.invite_accepted': { icon: UserCheck, title: 'Invite accepted' },
  'member.role_updated': { icon: Users, title: 'Member role updated' },
  'member.updated': { icon: Users, title: 'Member updated' },
  'member.email_updated': { icon: Mail, title: 'Member email updated' },
  'member.removed': { icon: UserMinus, title: 'Member removed' },
  'apikey.created': { icon: Key, title: 'API key created' },
  'apikey.revoked': { icon: Key, title: 'API key revoked' },
  'plan.limit_exceeded': { icon: AlertTriangle, title: 'Plan limit exceeded' },
  'plan.upgraded': { icon: TrendingUp, title: 'Plan upgraded' },
  'plan.downgraded': { icon: TrendingDown, title: 'Plan downgraded' },
  'api.limit_exceeded': { icon: AlertTriangle, title: 'API limit exceeded' },
  'webhook.created': { icon: Webhook, title: 'Webhook created' },
  'webhook.delivered': { icon: Webhook, title: 'Webhook delivered' },
  'webhook.deleted': { icon: Webhook, title: 'Webhook deleted' },
};

const DEFAULT_ACTION: ActionMeta = {
  icon: Building2,
  title: 'Action performed',
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'yesterday' : `${days}d ago`;
}

function MetricCard({
  label,
  value,
  unit,
  progress,
  progressVariant = 'default',
  delta,
  deltaVariant,
}: {
  label: string;
  value: string;
  unit: string;
  progress: number;
  progressVariant?: 'default' | 'warn';
  delta: string;
  deltaVariant?: 'up' | 'down' | 'neutral';
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
          className={`h-full rounded-full ${progressVariant === 'warn' ? 'bg-yellow-500' : 'bg-primary'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p
        className={`mt-2 text-xs ${
          deltaVariant === 'up'
            ? 'text-emerald-600'
            : deltaVariant === 'down'
              ? 'text-red-500'
              : 'text-muted-foreground'
        }`}
      >
        {delta}
      </p>
    </div>
  );
}

export default function OverviewPage() {
  const { user } = useAuth();
  const name = user?.email.split('@')[0] ?? 'there';
  const { data: organization } = useAppSelector((s) => s.org);
  const { data: members } = useAppSelector((s) => s.members);
  const { data: invitations } = useAppSelector((s) => s.invitations);
  const { data: usage } = useAppSelector((s) => s.usage);
  const { maxApiKeys, maxMembers, maxProjects, maxWebhooks, apiCallsPerMonth } =
    organization?.plan?.limits || {};
  const activeMembers = members?.filter((m) => m.isActive).length ?? 0;
  const pendingInvites =
    invitations?.filter((i) => i.status === 'pending').length ?? 0;
  const { data: staticActivity } = useAppSelector((s) => s.auditLogs);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Good morning, {name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening in{' '}
            <strong className="text-foreground">{organization?.name}</strong>{' '}
            today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Download size={13} /> Export
          </Button>
          <Button size="sm">
            <Plus size={13} /> Invite member
          </Button>
        </div>
      </div>

      {/* Trial banner */}
      <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
        <Sparkles size={14} className="text-primary shrink-0" />
        <p className="flex-1">
          <strong>Your Pro trial ends in 4 days.</strong> Add a payment method
          to keep your webhooks and API keys active after Apr 18.
        </p>
        <Button size="sm">Add payment</Button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          label="API calls · this month"
          value={usage?.apiCalls?.current?.toString() ?? '?'}
          unit={`/ ${apiCallsPerMonth ?? '?'}`}
          progress={
            apiCallsPerMonth
              ? Math.min(
                  100,
                  ((usage?.apiCalls?.current ?? 0) / apiCallsPerMonth) * 100,
                )
              : 0
          }
          delta="▲ 12.4% vs last month"
          deltaVariant="up"
        />
        <MetricCard
          label="Active members"
          value={activeMembers.toString()}
          unit={`/ ${maxMembers ?? '?'}`}
          progress={(activeMembers / (maxMembers ?? 1)) * 100}
          delta={`${pendingInvites} pending invites`}
          deltaVariant="neutral"
        />
        <MetricCard
          label="Webhook delivery rate"
          value="99.4"
          unit="%"
          progress={99}
          progressVariant="warn"
          delta="▼ 0.3% · 14 retries last 24h"
          deltaVariant="down"
        />
      </div>

      {/* Charts row */}
      <div
        className="grid gap-4"
        style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}
      >
        {/* Recent activity */}
        <div className="rounded-xl border border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-medium">Recent activity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Audit log · last 24h
            </p>
          </div>
          <div>
            {staticActivity.map((entry, i) => {
              const { icon: Icon, title } =
                ACTION_MAP[entry.action] ?? DEFAULT_ACTION;
              const sub =
                (entry.metadata.email as string) ??
                (entry.metadata.name as string) ??
                `${entry.resourceType} #${entry.resourceId}`;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 px-4 py-3 ${i > 0 ? 'border-t border-border' : ''}`}
                >
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {sub}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                    {relativeTime(entry.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
