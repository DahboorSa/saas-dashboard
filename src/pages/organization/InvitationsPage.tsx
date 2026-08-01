import InviteModal from '@/components/members/InviteModal';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import type { Invitation } from '@/store/slices/invitationsSlice';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Tab = 'Pending' | 'Accepted' | 'Expired';

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
  const [modalOpen, setModalOpen] = useState(false);

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

  return (
    <div>
      <InviteModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Invitations</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Invites expire 48h after sending · daily cron cleans pending past TTL
          </p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="size-3.5" /> Send invitation
        </Button>
      </div>

      {/* Invitation list */}
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
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                  No {activeTab.toLowerCase()} invitations.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.email} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{r.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={r.role} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{r.invitedBy}</td>
                  <td className="px-4 py-3 text-gray-400">{r.createdAt}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{r.expiresAt}</td>
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
    </div>
  );
}
