import AuthBrand from '@/components/auth/AuthBrand';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '@/lib/api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }
    try {
      await forgotPassword(email);
      setSubmitted(true);
      setError('');
    } catch (error) {
      console.error('Forgot password request failed:', error);
      setError('Failed to send reset instructions. Please try again later.');
      return;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm flex flex-col gap-5">
          <AuthBrand />
          <div>
            <h1 className="text-2xl font-semibold">Check your inbox</h1>
            <p className="text-sm text-muted-foreground mt-1">
              We've sent a reset link to{' '}
              <span className="font-medium text-foreground">{email}</span>. The
              link expires in 24 hours.
            </p>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            <Link to="/login" className="text-primary font-medium">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-5">
        <AuthBrand />
        <div>
          <h1 className="text-2xl font-semibold">Reset your password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the email associated with your account and we'll send a reset
            link.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              onChange={onEmailChange}
              value={email}
              className={
                error ? 'border-destructive focus-visible:ring-destructive' : ''
              }
              aria-invalid={!!error}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
        <p className="text-sm text-center text-muted-foreground">
          <Link to="/login" className="text-primary font-medium">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
