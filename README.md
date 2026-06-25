# NestJS SaaS Dashboard — React Frontend

Frontend for the [NestJS SaaS Starter](https://github.com/DahboorSa/nestjs-saas-starter) backend. Multi-tenant SaaS dashboard covering organization management, member invitations, API keys, webhooks, usage tracking, and Stripe billing.

## Stack

React 19 · TypeScript 6 · Vite 8 · Tailwind CSS v4 · shadcn/ui (Radix) · React Router v7 · Axios · Redux Toolkit

## Setup

```bash
cp .env.example .env.local   # fill in VITE_NEST_API_URL
yarn install
yarn dev                     # http://localhost:5173
```

**.env variables:**

```
VITE_NEST_API_URL=http://localhost:3000   # NestJS backend base URL
```

## Commands

```bash
yarn dev      # Vite dev server with HMR
yarn build    # TypeScript type-check + Vite production build
yarn lint     # ESLint
yarn preview  # Serve the production build locally
```

## Auth & Token Storage

Tokens are never stored in `localStorage`.

- **`accessToken`** — held in a JS module-level variable (`src/lib/tokenStore.ts`). In-memory only; lost on page refresh by design (it is short-lived).
- **`refreshToken`** — stored as an `httpOnly; Secure; SameSite=Strict` cookie set by the backend. JS cannot read it; the browser sends it automatically on every request to the same origin.

**Silent session restore** — on every page load `AuthProvider` calls `POST /auth/refresh-token`. The browser attaches the httpOnly cookie; if valid, a new `accessToken` is returned and the session is restored without a login prompt. If the cookie is missing or expired the user is redirected to `/login`.

**401 handling** — the Axios response interceptor catches 401s, calls `POST /auth/refresh-token` once, retries the original request transparently. Concurrent 401s are queued; only one refresh call fires. If the refresh fails, the user is redirected to `/login`.

## Screen Map

| Design File | Screen | Route | Page | Status |
|---|---|---|---|---|
| `auth-screens.jsx` | Register | `/register` | `pages/auth/RegisterPage.tsx` | ✅ |
| `auth-screens.jsx` | Login | `/login` | `pages/auth/LoginPage.tsx` | ✅ |
| `auth-screens.jsx` | VerifyEmail | `/verify-email` | `pages/auth/VerifyEmailPage.tsx` | ✅ |
| `auth-screens.jsx` | ForgotPassword | `/forgot-password` | `pages/auth/ForgotPasswordPage.tsx` | ✅ |
| `auth-screens.jsx` | ResetPassword | `/reset-password` | `pages/auth/ResetPasswordPage.tsx` | ✅ |
| `auth-screens.jsx` | AcceptInvite | `/invitations/accept` | `pages/auth/AcceptInvitePage.tsx` | 🔲 |
| `shell.jsx` | Shell layout | (layout wrapper) | `components/layout/Shell.tsx` | ✅ |
| `dashboard-screens.jsx` | Overview | `/overview` | `pages/dashboard/OverviewPage.tsx` | ✅ |
| `dashboard-screens.jsx` | Usage | `/usage` | `pages/dashboard/UsagePage.tsx` | ✅ |
| `dashboard-screens.jsx` | Audit Log | `/audit-log` | `pages/dashboard/AuditLogPage.tsx` | ✅ |
| `screens-org.jsx` | Org General | `/organization/general` | `pages/organization/OrgGeneralPage.tsx` | ✅ |
| `screens-org.jsx` | Members | `/organization/members` | `pages/organization/MembersPage.tsx` | ✅ |
| `screens-org.jsx` | Invitations | `/organization/invitations` | `pages/organization/InvitationsPage.tsx` | ✅ |
| `screens-org.jsx` | Plans & Billing | `/organization/billing` | `pages/organization/BillingPage.tsx` | ✅ |
| — | Danger Zone | `/organization/danger` | `pages/organization/DangerZonePage.tsx` | ✅ |
| `screens-dev.jsx` | API Keys | `/api-keys` | `pages/dev/ApiKeysPage.tsx` | 🔲 |
| `screens-dev.jsx` | Webhooks | `/webhooks` | `pages/dev/WebhooksPage.tsx` | 🔲 |
| `screens-dev.jsx` | Webhook Deliveries | `/webhooks/:id/deliveries` | `pages/dev/WebhookDeliveriesPage.tsx` | 🔲 |
| `screens-account.jsx` | Profile | `/profile` | `pages/account/ProfilePage.tsx` | 🔲 |
| `screens-account.jsx` | Security | `/security` | `pages/account/SecurityPage.tsx` | 🔲 |

## Project Structure

```
src/
├── routes/
│   ├── index.tsx          # BrowserRouter + full route tree
│   ├── ProtectedRoute.tsx # auth guard (respects isLoading for silent restore)
│   └── RoleRoute.tsx      # RBAC guard — allowed: string[], fallback route
├── contexts/
│   └── AuthContext.tsx    # user, isLoading, login(accessToken), logout()
├── pages/
│   ├── auth/              # Login, Register, ForgotPassword, VerifyEmail, ResetPassword, ChangePassword
│   ├── dashboard/         # Overview, Usage, AuditLog
│   └── organization/      # General, Members, Invitations, Billing, DangerZone
├── components/
│   ├── ui/                # shadcn primitives: Button, Input, Card
│   ├── auth/              # AuthBrand
│   └── layout/            # Shell (Sidebar + Topbar)
├── store/
│   ├── index.ts           # configureStore
│   ├── hooks.ts           # useAppDispatch, useAppSelector
│   └── slices/            # org, plans, members, invitations, auditLogs, usage
└── lib/
    ├── api/
    │   └── client.ts      # Axios instance, request/response interceptors, all API functions
    ├── tokenStore.ts      # in-memory accessToken store (never localStorage)
    ├── plans.ts           # plan type definitions
    └── utils.ts           # cn() helper
```
