# NestJS SaaS Dashboard — React Frontend

Frontend for the [NestJS SaaS Starter](https://github.com/DahboorSa/nestjs-saas-starter) backend. Multi-tenant SaaS dashboard covering organization management, member invitations, API keys, webhooks, usage tracking, and Stripe billing.

## Stack

React 19 · TypeScript 6 · Vite 8 · Tailwind CSS v4 · shadcn/ui (Radix) · React Router v7 · Axios

## Setup

```bash
cp .env .env.local          # copy and fill in VITE_NEST_API_URL
yarn install
yarn dev                    # http://localhost:5173
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

## Backend Integration

All API calls target the NestJS SaaS Starter REST API via `VITE_NEST_API_URL`.

**Auth flow:**
- JWT access tokens (15 min TTL) stored in `localStorage` as `accessToken`
- Refresh tokens (7 days) stored as `refreshToken` — used for "keep me signed in"
- Org-scoped API keys use `Authorization: Bearer <key>` header
- Axios interceptor (planned) will auto-refresh on 401 and redirect to `/login` on failure

## Screen Map

| Design File | Screen | Route | Page | Status |
|---|---|---|---|---|
| `auth-screens.jsx` | Register | `/register` | `pages/auth/RegisterPage.tsx` | ✅ |
| `auth-screens.jsx` | Login | `/login` | `pages/auth/LoginPage.tsx` | ✅ |
| `auth-screens.jsx` | VerifyEmail | `/verify-email` | `pages/auth/VerifyEmailPage.tsx` | ✅ |
| `auth-screens.jsx` | ForgotPassword | `/forgot-password` | `pages/auth/ForgotPasswordPage.tsx` | ✅ |
| `auth-screens.jsx` | ResetPassword | `/reset-password` | `pages/auth/ResetPasswordPage.tsx` | ✅ |
| `auth-screens.jsx` | AcceptInvite | `/invitations/accept` | `pages/auth/AcceptInvitePage.tsx` | 🔲 |
| `shell.jsx` | Shell layout | (layout wrapper) | `components/layout/` | 🔲 |
| `dashboard-screens.jsx` | Overview | `/` | `pages/dashboard/OverviewPage.tsx` | 🔲 |
| `dashboard-screens.jsx` | Usage | `/usage` | `pages/usage/UsagePage.tsx` | 🔲 |
| `dashboard-screens.jsx` | Org General | `/organization` | `pages/org/OrgGeneralPage.tsx` | 🔲 |
| `screens-org.jsx` | Members | `/members` | `pages/org/MembersPage.tsx` | 🔲 |
| `screens-org.jsx` | Invitations | `/invitations` | `pages/org/InvitationsPage.tsx` | 🔲 |
| `screens-org.jsx` | Plans & Billing | `/plans` | `pages/org/PlansPage.tsx` | 🔲 |
| `screens-dev.jsx` | API Keys | `/api-keys` | `pages/dev/ApiKeysPage.tsx` | 🔲 |
| `screens-dev.jsx` | Webhooks | `/webhooks` | `pages/dev/WebhooksPage.tsx` | 🔲 |
| `screens-dev.jsx` | Webhook Deliveries | `/webhooks/:id/deliveries` | `pages/dev/WebhookDeliveriesPage.tsx` | 🔲 |
| `screens-account.jsx` | Profile | `/profile` | `pages/account/ProfilePage.tsx` | 🔲 |
| `screens-account.jsx` | Security | `/security` | `pages/account/SecurityPage.tsx` | 🔲 |

## Project Structure

```
src/
├── routes/          # BrowserRouter + ProtectedRoute
├── pages/
│   ├── auth/        # Login, Register, ForgotPassword, VerifyEmail, ResetPassword
│   ├── dashboard/   # Overview (placeholder)
│   ├── usage/       # planned
│   ├── org/         # planned: General, Members, Invitations, Plans
│   ├── dev/         # planned: API Keys, Webhooks, Deliveries
│   └── account/     # planned: Profile, Security
├── components/
│   ├── ui/          # shadcn primitives: Button, Input, Card
│   ├── auth/        # AuthBrand
│   ├── layout/      # planned: Sidebar, Topbar, Shell
│   ├── dashboard/   # planned
│   ├── members/     # planned
│   ├── api-keys/    # planned
│   ├── webhooks/    # planned
│   └── shared/      # planned
└── lib/
    ├── api/         # Axios client + endpoint functions
    ├── hooks/       # planned: custom hooks
    ├── store/       # planned: state management
    ├── validations/ # planned: Zod schemas
    └── utils.ts     # cn() helper
```
