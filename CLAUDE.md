# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # start Vite dev server (http://localhost:5173)
yarn build        # tsc type-check + Vite production build
yarn lint         # ESLint
yarn preview      # serve the production build locally
```

No test suite is configured yet.

## Environment

Copy `.env` and set:
```
VITE_NEST_API_URL=http://localhost:3000   # NestJS backend
```

Only variables prefixed `VITE_` are exposed to the browser (Vite convention).

## Architecture

**Stack:** React 19 · TypeScript 6 · Vite 8 · Tailwind CSS v4 · shadcn/ui (Radix, Nova preset) · React Router v7 · Axios

### Routing (`src/routes/`)

- `index.tsx` — single `<BrowserRouter>` with all routes. Public routes (`/login`, `/register`, `/forgot-password`, `/verify-email`, `/reset-password`) are declared directly under `<Routes>`. Protected routes (`/`, `/dashboard`) are wrapped in `<Route element={<ProtectedRoute />}>`.
- `ProtectedRoute.tsx` — reads `localStorage.getItem('accessToken')`; renders `<Outlet />` if present, otherwise `<Navigate to="/login" replace />`.

### API (`src/lib/api/client.ts`)

All backend calls use Axios against `VITE_NEST_API_URL`. Functions exported: `loginApi`, `registerApi`, `verifyEmail`, `resetPassword`, `forgotPassword`. Auth tokens (`accessToken`, `refreshToken`) are stored in `localStorage` after login.

### Pages (`src/pages/`)

Each page owns its own state and validation logic inline — no shared form library. Error display uses shadcn `destructive` color tokens. Form submission handlers accept `React.BaseSyntheticEvent` (not the deprecated `React.FormEvent`).

### Styling

Tailwind v4 — no `tailwind.config.js`. Theme tokens (colors, radius, sidebar palette) are defined as CSS custom properties in `src/index.css` using `@theme inline`. Dark mode uses the `.dark` class strategy (`@custom-variant dark (&:is(.dark *))`). The `cn()` helper (`src/lib/utils.ts`) merges Tailwind classes via `clsx` + `tailwind-merge`.

### Components

`src/components/ui/` — shadcn primitives (Button, Input, Card). `src/components/auth/` — shared auth components (currently being built out). Feature directories (`dashboard/`, `members/`, `settings/`, etc.) exist but are empty — to be populated as the app grows.

## Planned UI Design

The visual design for all screens is defined in Claude Design mockup files (`auth-screens.jsx`, `dashboard-screens.jsx`, `screens-org.jsx`, `screens-dev.jsx`, `screens-account.jsx`). These use a custom CSS class system (`auth-card`, `btn-accent`, `Shell`, `AuthShell`, etc.) that is specific to the design preview and does **not** map to the codebase. When implementing a screen, cherry-pick only the layout structure and visual hierarchy — translate classes to Tailwind + shadcn equivalents and keep all existing state/validation/API logic untouched.

### Design Files Reference

| File | Screens |
|---|---|
| `auth-screens.jsx` | Register, Login, VerifyEmail, ForgotPassword, ResetPassword, AcceptInvite |
| `dashboard-screens.jsx` | Overview, UsageDetail, OrgGeneral |
| `screens-org.jsx` | Members, Invitations, Plans & Billing |
| `screens-dev.jsx` | ApiKeys, Webhooks, WebhookDeliveries |
| `screens-account.jsx` | Profile, Security |
| `shell.jsx` | Shared: Icon, Sidebar, Topbar, Shell, AuthShell, AuthBrand (+ full nav structure) |

### Shell / Layout (to build in `src/components/layout/`)

- **Sidebar** — brand mark, org switcher, nav groups, user footer
- **Topbar** — breadcrumbs, global search (⌘K), bell, help
- **Shell** — wraps all protected pages: `<Sidebar /> + <content><Topbar /><page /></content>`
- **AuthShell** — centered layout for public auth pages

Nav groups from `shell.jsx`:

| Group | Nav Items |
|---|---|
| Workspace | Overview, Usage, Audit log |
| Organization | General, Members, Invitations, Plans & billing |
| Developers | API keys, Webhooks, API reference |
| Account | Profile, Security |

## Backend API Reference

Backend: [NestJS SaaS Starter](https://github.com/DahboorSa/nestjs-saas-starter) · base URL: `VITE_NEST_API_URL`

**Auth** — `/auth/*`

| Method | Path | Purpose | Page |
|---|---|---|---|
| POST | `/auth/register` | Create org + user, returns tokens | RegisterPage |
| POST | `/auth/login` | Returns accessToken + refreshToken | LoginPage |
| POST | `/auth/logout` | Blacklist tokens | (global) |
| POST | `/auth/refresh` | Exchange refresh token | (interceptor) |
| POST | `/auth/verify-email?token=` | Verify email token | VerifyEmailPage |
| POST | `/auth/resend-verification` | Resend email | VerifyEmailPage |
| POST | `/auth/forgot-password` | Send reset link | ForgotPasswordPage |
| POST | `/auth/reset-password` | Set new password with token | ResetPasswordPage |
| POST | `/auth/change-password` | Update password (JWT required) | SecurityPage |

**Users** — `/users/*`

| Method | Path | Purpose | Page |
|---|---|---|---|
| GET | `/users/me` | Current user profile | ProfilePage |
| PATCH | `/users/me` | Update name/display name | ProfilePage |
| POST | `/users/me/email` | Request email change | SecurityPage |

**Organizations** — `/organizations/*`

| Method | Path | Purpose | Page |
|---|---|---|---|
| GET | `/organizations/me` | Org details + plan status | OrgGeneralPage, Overview |
| PUT | `/organizations/me` | Update org name, contact email | OrgGeneralPage |
| GET | `/organizations/members` | List members (paginated) | MembersPage |
| PATCH | `/organizations/members/:userId` | Update member role | MembersPage |
| DELETE | `/organizations/members/:userId` | Remove member | MembersPage |

**Invitations** — `/invitations/*`

| Method | Path | Purpose | Page |
|---|---|---|---|
| POST | `/invitations` | Create invitations (bulk, up to 10) | InvitationsPage |
| GET | `/invitations` | List (pending/accepted/expired) | InvitationsPage |
| DELETE | `/invitations/:id` | Cancel invitation | InvitationsPage |
| POST | `/invitations/:id/resend` | Resend invitation | InvitationsPage |
| POST | `/invitations/accept?token=` | Accept invite (creates account) | AcceptInvitePage |

**API Keys** — `/api-keys/*`

| Method | Path | Purpose | Page |
|---|---|---|---|
| GET | `/api-keys` | List org API keys | ApiKeysPage |
| POST | `/api-keys` | Create key (full key shown once) | ApiKeysPage |
| DELETE | `/api-keys/:id` | Revoke key | ApiKeysPage |

**Webhooks** — `/webhooks/*`

| Method | Path | Purpose | Page |
|---|---|---|---|
| GET | `/webhooks` | List endpoints | WebhooksPage |
| POST | `/webhooks` | Create endpoint | WebhooksPage |
| PATCH | `/webhooks/:id` | Update URL/events/active | WebhooksPage |
| DELETE | `/webhooks/:id` | Remove endpoint | WebhooksPage |
| GET | `/webhooks/:id/deliveries` | Delivery history | WebhookDeliveriesPage |
| POST | `/webhooks/:id/deliveries/:dId/resend` | Resend delivery | WebhookDeliveriesPage |

**Usage & Payments**

| Method | Path | Purpose | Page |
|---|---|---|---|
| GET | `/usage` | Current period usage | UsagePage, Overview |
| POST | `/payments/subscription` | Subscribe / change plan | PlansPage |
| GET | `/payments/portal` | Stripe customer portal URL | PlansPage |
| GET | `/payments/invoices` | List invoices | PlansPage |

### Auth Token Pattern

```ts
// After login — store tokens
localStorage.setItem('accessToken', res.accessToken);
localStorage.setItem('refreshToken', res.refreshToken);

// Axios request header (interceptor to add)
Authorization: Bearer <accessToken>

// On 401 — call POST /auth/refresh with refreshToken, retry, or redirect /login
```

### RBAC Roles

- `OWNER` — full access; only one per org; can transfer
- `ADMIN` — can manage members, invitations, API keys, webhooks
- `MEMBER` — read-only access to org resources

### Key Backend Behaviours

- API keys cached in Redis for 5 minutes — revoked keys invalidated within that window
- Webhooks: HMAC-SHA256 signed, 3 retries with exponential backoff, 5s timeout per attempt
- Usage counters reset monthly via cron; Redis → Postgres sync every 5 minutes
- Invitations expire 48h after sending; daily cron cleans expired ones
- All significant actions are audit-logged (accessible at `GET /audit-logs`)
