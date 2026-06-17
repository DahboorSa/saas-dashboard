import AuthBrand from '@/components/auth/AuthBrand';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerApi } from '@/lib/api/client';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    desc: '1k API calls/mo · 1 webhook · 2 members',
    price: '$0',
    per: 'forever',
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: '100k API calls/mo · 10 webhooks · 25 members',
    price: '$49',
    per: 'per month',
    trial: '14-day trial',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    desc: 'Unlimited · SAML · 99.99% SLA',
    price: 'Custom',
    per: '30-day trial',
  },
] as const;

type PlanId = (typeof PLANS)[number]['id'];

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro');
  const [terms, setTerms] = useState(false);

  const [error, setError] = useState({
    firstName: '',
    lastName: '',
    email: '',
    orgName: '',
    password: '',
    terms: '',
  });
  const [apiError, setAPIError] = useState('');

  const validateForm = () => {
    const e = { firstName: '', lastName: '', email: '', orgName: '', password: '', terms: '' };
    if (!firstName) e.firstName = 'First name is required';
    if (!lastName) e.lastName = 'Last name is required';
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email format';
    if (!orgName) e.orgName = 'Organization name is required';
    if (!password) e.password = 'Password is required';
    else if (password.length < 12) e.password = 'Password must be at least 12 characters';
    if (!terms) e.terms = 'You must agree to the Terms and Privacy Policy';
    setError(e);
    return Object.values(e).every((v) => v === '');
  };

  const onSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setAPIError('');
    if (!validateForm()) return;
    registerApi(email, password, orgName, firstName, lastName)
      .then(() => {
        navigate('/verify-email', { state: { email } });
      })
      .catch(() => {
        setAPIError('Registration failed. Please try again.');
      });
  };

  const slug = toSlug(orgName);

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-md flex flex-col gap-5">
        <AuthBrand />

        <div>
          <h1 className="text-2xl font-semibold">Create your organization</h1>
          <p className="text-sm text-muted-foreground mt-1">
            You'll be the OWNER of this workspace. Invite your team after
            verifying your email.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* First + Last name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="text-sm font-medium">
                First name
              </label>
              <Input
                id="firstName"
                placeholder="Sebaa"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={error.firstName ? 'border-destructive focus-visible:ring-destructive' : ''}
                aria-invalid={!!error.firstName}
              />
              {error.firstName && (
                <p className="text-sm text-destructive">{error.firstName}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last name
              </label>
              <Input
                id="lastName"
                placeholder="Dahboor"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={error.lastName ? 'border-destructive focus-visible:ring-destructive' : ''}
                aria-invalid={!!error.lastName}
              />
              {error.lastName && (
                <p className="text-sm text-destructive">{error.lastName}</p>
              )}
            </div>
          </div>

          {/* Work email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Work email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error.email ? 'border-destructive focus-visible:ring-destructive' : ''}
              aria-invalid={!!error.email}
            />
            {error.email && (
              <p className="text-sm text-destructive">{error.email}</p>
            )}
          </div>

          {/* Organization name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="orgName" className="text-sm font-medium">
              Organization name
            </label>
            <Input
              id="orgName"
              placeholder="Acme Cloud"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className={error.orgName ? 'border-destructive focus-visible:ring-destructive' : ''}
              aria-invalid={!!error.orgName}
            />
            {slug && (
              <p className="text-xs text-muted-foreground">
                Slug:{' '}
                <span className="font-mono text-foreground">{slug}</span>
                {' '}· auto-generated, editable later
              </p>
            )}
            {error.orgName && (
              <p className="text-sm text-destructive">{error.orgName}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 12 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pr-16 ${error.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                aria-invalid={!!error.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              12+ characters · hashed with Argon2
            </p>
            {error.password && (
              <p className="text-sm text-destructive">{error.password}</p>
            )}
          </div>

          {/* Plan selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Select a plan</label>
            <div className="flex flex-col gap-2">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                    selectedPlan === plan.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/40'
                  }`}
                >
                  {/* Radio dot */}
                  <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    selectedPlan === plan.id ? 'border-primary' : 'border-muted-foreground/40'
                  }`}>
                    {selectedPlan === plan.id && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {plan.name}
                      {'trial' in plan && (
                        <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                          {plan.trial}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {plan.desc}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold">{plan.price}</div>
                    <div className="text-xs text-muted-foreground">{plan.per}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 rounded"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <span className="text-muted-foreground">
              I agree to the{' '}
              <a href="#" className="text-primary font-medium">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-primary font-medium">Privacy Policy</a>.
            </span>
          </label>
          {error.terms && (
            <p className="text-sm text-destructive">{error.terms}</p>
          )}

          {apiError && <p className="text-sm text-destructive">{apiError}</p>}

          <Button type="submit" className="w-full">
            Create account →
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
