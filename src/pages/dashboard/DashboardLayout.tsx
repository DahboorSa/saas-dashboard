import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { label: 'Overview', to: '/dashboard/overview' },
  { label: 'Usage', to: '/dashboard/usage' },
  { label: 'Audit log', to: '/dashboard/audit-log' },
];

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <nav className="w-48 shrink-0 border-r border-border flex flex-col gap-0.5 p-3">
        <p className="text-[10.5px] font-semibold tracking-widest uppercase text-muted-foreground px-2 mb-2">
          Workspace
        </p>
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `block px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-muted font-medium text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
