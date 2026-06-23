import { Button } from '@/components/ui/button';
import { sendInvitation } from '@/lib/api/client';
import { useAppSelector } from '@/store/hooks';
import type { Invitation } from '@/store/slices/invitationsSlice';
import { ChevronDown, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Tab = 'Pending' | 'Accepted' | 'Expired';
type Role = 'member' | 'admin';
type Recipient = { email: string; role: Role };


function RoleBadge({ role }: { role: string }) {
  const base =
    'inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-semibold font-mono tracking-wide uppercase';
  if (role === 'ADMIN')
    return (
      <span className={`${base} bg-blue-50 text-blue-700 ring-1 ring-blue-200`}>
        {role}
      </span>
    );
  return (
    <span className={`${base} bg-gray-100 text-gray-600 ring-1 ring-gray-200`}>
      {role}
    </span>
  );
}

export default function InvitationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Pending');
  const [recipients, setRecipients] = useState<Recipient[]>([
    { email: '', role: 'member' },
  ]);

  const { data: invitations } = useAppSelector((s) => s.invitations);

  const ROWS_BY_TAB: Record<Tab, Invitation[]> = {
    Pending: invitations.filter((i) => i.status === 'pending') as Invitation[],
    Accepted: invitations.filter((i) => i.status === 'accepted') as Invitation[],
    Expired: invitations.filter((i) => i.status === 'expired') as Invitation[],
  };
  const COUNTS: Record<Tab, number> = {
    Pending: ROWS_BY_TAB.Pending.length,
    Accepted: ROWS_BY_TAB.Accepted.length,
    Expired: ROWS_BY_TAB.Expired.length,
  };

  const rows = ROWS_BY_TAB[activeTab];
  const filledCount = recipients.filter((r) => r.email.trim()).length;

  function updateRecipient(
    index: number,
    field: keyof Recipient,
    value: string,
  ) {
    setRecipients((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  }

  function removeRecipient(index: number) {
    setRecipients((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
    );
  }

  function addRecipient() {
    if (recipients.length >= 10) return;
    setRecipients((prev) => [...prev, { email: '', role: 'member' }]);
  }

  function onSubmit() {
    sendInvitation(recipients)
      .then((res) => {
        console.log('Invitations sent successfully:', res.data);
        // Update local state based on results (setPendingMembers)
      })
      .catch((err) => {
        console.error('Failed to send invitations:', err);
      });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Invitations</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Invites expire 48h after sending · daily cron cleans pending past
            TTL
          </p>
        </div>
        <Button size="sm">
          <Plus className="size-3.5" /> Send invitation
        </Button>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-4">
        {/* Left: invitation list */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-xs">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 py-3 border-b border-gray-100">
            {(['Pending', 'Accepted', 'Expired'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab} ({COUNTS[tab]})
              </button>
            ))}
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Invited by</th>
                <th className="px-4 py-3 text-left">Sent</th>
                <th className="px-4 py-3 text-left">Expires</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-gray-400"
                  >
                    No {activeTab.toLowerCase()} invitations.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.email}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">
                      {r.email}
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={r.role} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">{r.invitedBy}</td>
                    <td className="px-4 py-3 text-gray-400">{r.createdAt}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">
                      {r.expiresAt}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" title="Resend">
                          <RefreshCw className="size-3.5 text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" title="Cancel">
                          <Trash2 className="size-3.5 text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Right: send invitation form */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-xs">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Send invitation
            </h3>
          </div>
          <div className="px-4 py-4 flex flex-col gap-4">
            {/* Recipients */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700">
                Recipients
              </label>
              <div className="flex flex-col gap-2">
                {recipients.map((r, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      type="email"
                      className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 font-mono text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                      placeholder="name@company.com"
                      value={r.email}
                      onChange={(e) =>
                        updateRecipient(i, 'email', e.target.value)
                      }
                    />
                    <div className="relative shrink-0 w-25">
                      <select
                        className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-2.5 pr-6 font-mono text-[11.5px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 cursor-pointer"
                        value={r.role}
                        onChange={(e) =>
                          updateRecipient(i, 'role', e.target.value)
                        }
                      >
                        <option value="member">MEMBER</option>
                        <option value="admin">ADMIN</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeRecipient(i)}
                      title="Remove"
                      className="shrink-0 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              {recipients.length < 10 && (
                <button
                  onClick={addRecipient}
                  className="mt-1 flex items-center gap-1 self-start text-[12px] text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Plus className="size-3" /> Add another
                </button>
              )}
              <p className="text-[11px] text-gray-400">
                Up to 10 per batch · only OWNER can promote to OWNER later.
              </p>
            </div>

            {/* Submit */}
            <Button
              className="w-full"
              disabled={filledCount === 0}
              onClick={onSubmit}
            >
              {filledCount > 0
                ? `Send ${filledCount} invitation${filledCount !== 1 ? 's' : ''}`
                : 'Send invitation'}
            </Button>
            <p className="text-center text-[11px] text-gray-400">
              Triggers <span className="font-mono">member.invited</span> webhook
              per recipient
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
