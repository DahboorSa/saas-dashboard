import AuthBrand from '@/components/auth/AuthBrand';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/lib/api/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({ password: '', confirmPassword: '', token: '' });
  const navigate = useNavigate();

  const getStrength = (pw: string): { label: string; width: string; color: string } => {
    if (pw.length === 0) return { label: '', width: '0%', color: '' };
    if (pw.length < 8) return { label: 'Weak', width: '25%', color: 'bg-destructive' };
    if (pw.length < 12) return { label: 'Fair', width: '50%', color: 'bg-yellow-400' };
    if (pw.length < 16 || !/[^a-zA-Z0-9]/.test(pw)) return { label: 'Good', width: '75%', color: 'bg-primary' };
    return { label: 'Strong', width: '100%', color: 'bg-primary' };
  };

  const strength = getStrength(password);

  const onSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const errs = { password: '', confirmPassword: '', token: '' };

    if (!token) {
      errs.token = 'Invalid or missing token. Please check your email for the reset link.';
      setError(errs);
      return;
    }
    if (password.length < 12) {
      errs.password = 'Password must be at least 12 characters.';
      setError(errs);
      return;
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
      setError(errs);
      return;
    }

    resetPassword(password, token)
      .then(() => {
        navigate('/login');
      })
      .catch(() => {
        setError({ ...errs, password: 'Password reset failed. Please try again.' });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-5">
        <AuthBrand />
        <div>
          <h1 className="text-2xl font-semibold">Choose a new password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Token TTL: 24h. Pick something you haven't used before.
          </p>
        </div>

        {error.token && (
          <p className="text-sm text-destructive">{error.token}</p>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              New password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Min 12 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={
                error.password
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
              aria-invalid={!!error.password}
            />
            {password.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Strength:{' '}
                  <span className="font-medium text-foreground">
                    {strength.label}
                  </span>{' '}
                  · min 12 chars, mix of letters, numbers, symbols
                </p>
              </div>
            )}
            {error.password && (
              <p className="text-sm text-destructive">{error.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm new password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={
                error.confirmPassword
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }
              aria-invalid={!!error.confirmPassword}
            />
            {error.confirmPassword && (
              <p className="text-sm text-destructive">{error.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Update password and sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
