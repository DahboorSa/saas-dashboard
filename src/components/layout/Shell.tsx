import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchInvitations } from '@/store/slices/invitationsSlice';
import { fetchMembers } from '@/store/slices/membersSlice';
import { fetchOrg } from '@/store/slices/orgSlice';
import { fetchPlans } from '@/store/slices/plansSlice';
import {
  BarChart2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Mail,
  Settings,
  TriangleAlert,
  Users,
} from 'lucide-react';
import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const workspaceNav = [
  { label: 'Overview', to: '/overview', icon: LayoutDashboard },
  { label: 'Usage', to: '/usage', icon: BarChart2 },
  { label: 'Audit log', to: '/audit-log', icon: FileText },
];

const orgNav = [
  { label: 'General', to: '/organization/general', icon: Settings },
  { label: 'Members', to: '/organization/members', icon: Users },
  { label: 'Invitations', to: '/organization/invitations', icon: Mail, roles: ['owner', 'admin'] },
  { label: 'Plans & billing', to: '/organization/billing', icon: CreditCard },
  { label: 'Danger zone', to: '/organization/danger', icon: TriangleAlert },
];

function NavGroup({
  label,
  items,
  userRole,
}: {
  label: string;
  items: typeof orgNav;
  userRole: string;
}) {
  const visible = items.filter((i) => !i.roles || i.roles.includes(userRole));
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10.5px] font-semibold tracking-widest uppercase text-muted-foreground px-2 mb-1">
        {label}
      </p>
      {visible.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
              isActive
                ? 'bg-muted font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`
          }
        >
          <item.icon size={14} />
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function Shell() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const orgLoaded = useAppSelector((s) => s.org.data !== null);

  useEffect(() => {
    if (orgLoaded) return;
    dispatch(fetchOrg());
    dispatch(fetchPlans());
    dispatch(fetchMembers());
    dispatch(fetchInvitations());
  }, [dispatch, orgLoaded]);

  return (
    <div className="flex min-h-screen">
      <aside className="w-52 shrink-0 border-r border-border flex flex-col gap-6 p-3">
        <NavGroup label="Workspace" items={workspaceNav} userRole={user?.role ?? ''} />
        <NavGroup label="Organization" items={orgNav} userRole={user?.role ?? ''} />
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
