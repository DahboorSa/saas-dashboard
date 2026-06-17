import AuthBrand from '@/components/auth/AuthBrand';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginApi } from '@/lib/api/client';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({
    email: '',
    password: '',
  });
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const validateForm = (email: string, password: string) => {
    const errs = { email: '', password: '' };
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    setError(errs);
    return !errs.email && !errs.password;
  };

  const onSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm(email, password)) return;
    loginApi(email, password)
      .then((response) => {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        navigate('/dashboard');
      })
      .catch(() => {
        setApiError('Invalid email or password.');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-5">
        <AuthBrand />
        <div>
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back. Access tokens expire in 15 minutes.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              onChange={onEmailChange}
            />
            {error.email && (
              <p className="text-sm text-destructive">{error.email}</p>
            )}
          </div>
          {/* Password — "Forgot?" inline with label */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary font-medium"
              >
                Forgot?
              </Link>
            </div>
            <Input id="password" type="password" onChange={onPasswordChange} />
            {error.password && (
              <p className="text-sm text-destructive">{error.password}</p>
            )}
          </div>
          {apiError && (
            <p className="text-sm text-destructive">{apiError}</p>
          )}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        {/* Footer */}
        <p className="text-sm text-center text-muted-foreground">
          New here?{' '}
          <Link to="/register" className="text-primary font-medium">
            Create an organization
          </Link>
        </p>
      </div>
    </div>
  );
}
