import AuthBrand from '@/components/auth/AuthBrand';
import { Button } from '@/components/ui/button';
import { verifyEmail, resendVerificationEmail } from '@/lib/api/client';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const location = useLocation();
  const navigate = useNavigate();
  const email: string = location.state?.email ?? '';

  const [verifyError, setVerifyError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendError, setResendError] = useState('');
  const [resendSent, setResendSent] = useState(false);

  const verifyCalledRef = useRef(false);

  // Auto-verify when token is present in URL
  useEffect(() => {
    if (!token || verifyCalledRef.current) return;
    verifyCalledRef.current = true;
    verifyEmail(token)
      .then(() => {
        navigate('/login');
      })
      .catch(() => {
        setVerifyError(
          'This link is invalid or has expired. Request a new one below.',
        );
      });
  }, [token, navigate]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown === 0) return;
    const id = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const onResend = async () => {
    if (!email) return;
    try {
      await resendVerificationEmail(email);
      setResendSent(true);
      setResendError('');
      setResendCooldown(60);
    } catch (err) {
      console.error('Resend failed:', err);
      setResendError('Failed to resend. Please try again.');
    }
  };

  // Token present: show verifying / error state
  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm flex flex-col gap-5">
          <AuthBrand />
          {verifyError ? (
            <>
              <div>
                <h1 className="text-2xl font-semibold">Link expired</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {verifyError}
                </p>
              </div>
              {email && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onResend}
                  disabled={resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend verification email'}
                </Button>
              )}
              {resendError && (
                <p className="text-sm text-destructive">{resendError}</p>
              )}
              {resendSent && (
                <p className="text-sm text-muted-foreground">
                  A new link has been sent — check your inbox.
                </p>
              )}
              <p className="text-sm text-center text-muted-foreground">
                Already verified?{' '}
                <Link to="/login" className="text-primary font-medium">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Verifying your email…
            </p>
          )}
        </div>
      </div>
    );
  }

  // No token: "check your inbox" waiting screen
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-5">
        <AuthBrand />

        {/* Mail icon */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary grid place-items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">Check your inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">
            We sent a verification link
            {email && (
              <>
                {' '}
                to <span className="font-medium text-foreground">{email}</span>
              </>
            )}
            . The link expires in 24 hours.
          </p>
        </div>

        {/* Info banner */}
        <div className="flex gap-3 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
          <svg
            className="mt-0.5 shrink-0 text-primary"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
          </svg>
          <div>
            <p className="font-medium mb-0.5">Didn't get an email?</p>
            <p className="text-muted-foreground">
              Check spam, or wait 60s and resend below.
            </p>
          </div>
        </div>

        {resendSent && (
          <p className="text-sm text-muted-foreground">
            A new link has been sent — check your inbox.
          </p>
        )}
        {resendError && (
          <p className="text-sm text-destructive">{resendError}</p>
        )}

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={onResend}
            disabled={!email || resendCooldown > 0}
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : 'Resend verification email'}
          </Button>
          <Button variant="ghost" className="w-full text-sm" asChild>
            <Link to="/register">Change email address</Link>
          </Button>
        </div>

        <p className="text-sm text-center text-muted-foreground">
          Already verified?{' '}
          <Link to="/login" className="text-primary font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
