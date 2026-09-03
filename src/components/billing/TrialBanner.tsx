import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { Bolt } from 'lucide-react';

type Props = {
  /** Extra classes for the outer container (e.g. page-level spacing). */
  className?: string;
};

const DAY_MS = 1000 * 60 * 60 * 24;

/** Whole days from now until `iso`, floored at 0. */
function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / DAY_MS));
}

/** e.g. "Sep 17" */
function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Trial reminder, shown identically wherever it appears. Renders only while the
 * org is on a paid plan AND the backend still reports a `trialEndsAt` — that
 * field is cleared once the trial lapses, so a null value means there is no
 * active trial. The countdown and end date are derived from `trialEndsAt`.
 */
export default function TrialBanner({ className }: Props) {
  const org = useAppSelector((s) => s.org.data);

  const planName = org?.plan?.name;
  const isPaidPlan = (org?.plan?.price ?? 0) > 0;
  const trialEndsAt = org?.trialEndsAt ?? null;

  if (!isPaidPlan || !trialEndsAt) return null;

  const daysLeft = daysUntil(trialEndsAt);
  const dayLabel = daysLeft === 1 ? 'day' : 'days';
  const endsOn = formatShortDate(trialEndsAt);

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900',
        className,
      )}
    >
      <Bolt className="size-4 shrink-0 text-amber-500" />
      <p className="flex-1">
        <strong>
          Your {planName} trial ends in {daysLeft} {dayLabel}
        </strong>{' '}
        ({endsOn}). Add a payment method to continue uninterrupted.
      </p>
      <Button
        size="sm"
        className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white border-0"
      >
        Add payment method
      </Button>
    </div>
  );
}
