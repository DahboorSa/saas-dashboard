import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import {
  CheckCircle2,
  Filter,
  MinusCircle,
  MoreVertical,
  Plus,
  Search,
} from 'lucide-react';
import { useState } from 'react';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  role: string;
  email: string;
  isVerified: boolean;
  isActive: boolean;
}

const AVATAR_HUES = [50, 280, 160, 30, 220, 110, 200, 340, 80, 260];

function avatarColor(id: string): string {
  const hue = AVATAR_HUES[id.charCodeAt(0) % AVATAR_HUES.length];
  return `oklch(0.55 0.13 ${hue})`;
}

function getInitials(m: Member): string {
  const f = m.firstName?.trim();
  const l = m.lastName?.trim();
  if (f && l) return `${f[0]}${l[0]}`.toUpperCase();
  return m.userName.slice(0, 2).toUpperCase();
}

function getDisplayName(m: Member): string {
  const f = m.firstName?.trim();
  const l = m.lastName?.trim();
  if (f || l) return `${f} ${l}`.trim();
  return m.userName;
}

function RoleBadge({ role }: { role: string }) {
  const base =
    'inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-semibold font-mono tracking-wide uppercase';
  const r = role.toUpperCase();
  if (r === 'OWNER')
    return (
      <span
        className={`${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`}
      >
        {r}
      </span>
    );
  if (r === 'ADMIN')
    return (
      <span className={`${base} bg-blue-50 text-blue-700 ring-1 ring-blue-200`}>
        {r}
      </span>
    );
  return (
    <span className={`${base} bg-gray-100 text-gray-600 ring-1 ring-gray-200`}>
      {r}
    </span>
  );
}

function VerifiedIcon({ isVerified }: { isVerified: boolean }) {
  if (isVerified) return <CheckCircle2 className="size-4 text-emerald-500" />;
  return <MinusCircle className="size-4 text-gray-300" />;
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  const base =
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium';
  if (isActive)
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`}>
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  return (
    <span className={`${base} bg-red-50 text-red-600`}>
      <span className="size-1.5 rounded-full bg-red-500" />
      Suspended
    </span>
  );
}

export default function MembersPage() {
  const { data: members } = useAppSelector((s) => s.members);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All roles');
  const [selectedStatus, setSelectedStatus] = useState('All statuses');

  const filtered = members.filter((m) => {
    const name = getDisplayName(m).toLowerCase();
    const matchSearch =
      !search ||
      name.includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchRole =
      selectedRole === 'All roles' || m.role.toUpperCase() === selectedRole;
    const matchStatus =
      selectedStatus === 'All statuses' ||
      (selectedStatus === 'Active' ? m.isActive : !m.isActive);
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Members</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {loading
              ? 'Loading…'
              : `${members.length} member${members.length !== 1 ? 's' : ''}`}
            {' · '}
            <span className="font-mono text-xs">
              GET /organizations/members
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="size-3.5" /> Filter
          </Button>
          <Button size="sm">
            <Plus className="size-3.5" /> Invite member
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs">
        {/* Search + filters */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              className="rounded-lg border border-gray-200 bg-white py-1.5 pl-2.5 pr-7 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/10 appearance-none cursor-pointer"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {['All roles', 'OWNER', 'ADMIN', 'MEMBER'].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <select
              className="rounded-lg border border-gray-200 bg-white py-1.5 pl-2.5 pr-7 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/10 appearance-none cursor-pointer"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {['All statuses', 'Active', 'Suspended'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wide">
              <th className="w-10 px-4 py-3 text-left">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Verified</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  Loading members…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  No members match your filters.
                </td>
              </tr>
            )}
            {filtered.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-gray-50/60 transition-colors"
              >
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="size-8 rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0"
                      style={{ background: avatarColor(member.id) }}
                    >
                      {getInitials(member)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {getDisplayName(member)}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <RoleBadge role={member.role} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge isActive={member.isActive} />
                </td>
                <td className="px-4 py-3">
                  <VerifiedIcon isVerified={member.isVerified} />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                  {member.userName}
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical className="size-4 text-gray-400" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          <span>
            Showing {filtered.length} of {members.length} members
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="xs">
              ← Prev
            </Button>
            <Button variant="ghost" size="xs">
              Next →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
