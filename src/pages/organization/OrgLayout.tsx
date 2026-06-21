import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { label: 'General', to: '/organization/general' },
  { label: 'Members', to: '/organization/members' },
  { label: 'Invitations', to: '/organization/invitations' },
  { label: 'Plans & billing', to: '/organization/billing' },
  { label: 'Danger zone', to: '/organization/danger' },
];

export default function OrgLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav
        style={{
          width: 200,
          flexShrink: 0,
          borderRight: '1px solid var(--line, #e5e7eb)',
          padding: '24px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <p
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#9ca3af',
            padding: '0 8px',
            marginBottom: 8,
          }}
        >
          Organization
        </p>
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            style={({ isActive }) => ({
              display: 'block',
              padding: '7px 10px',
              borderRadius: 7,
              fontSize: 13.5,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? '#111827' : '#6b7280',
              background: isActive ? '#f3f4f6' : 'transparent',
              textDecoration: 'none',
            })}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <main style={{ flex: 1, padding: 32 }}>
        <Outlet />
      </main>
    </div>
  );
}
