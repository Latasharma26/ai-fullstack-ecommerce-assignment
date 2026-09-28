import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Shield, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export const Login: React.FC = () => {
  const { loginWithDemo, loginWithGoogle, isAuthenticated, user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [customEmail, setCustomEmail] = useState('');
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/products';

  React.useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const gWindow = window as unknown as {
      google?: {
        accounts?: {
          id?: {
            initialize: (config: { client_id: string; callback: (res: { credential: string }) => void }) => void;
            renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
          };
        };
      };
      handleGoogleCredentialResponse?: (response: { credential: string }) => void;
    };

    gWindow.handleGoogleCredentialResponse = async (response: { credential: string }) => {
      try {
        setError(null);
        await loginWithGoogle(response.credential);
        navigate(from, { replace: true });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Google verification failed');
      }
    };

    if (clientId && gWindow.google?.accounts?.id) {
      try {
        gWindow.google.accounts.id.initialize({
          client_id: clientId,
          callback: gWindow.handleGoogleCredentialResponse,
        });

        const targetEl = document.getElementById('google-signin-btn-container');
        if (targetEl) {
          gWindow.google.accounts.id.renderButton(targetEl, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'pill',
          });
        }
      } catch (err) {
        console.warn('Google Identity initialization error:', err);
      }
    }
  }, [from, loginWithGoogle, navigate]);

  const handleGoogleClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const gWindow = window as unknown as {
      google?: {
        accounts?: {
          id?: {
            prompt: () => void;
          };
        };
      };
    };

    if (clientId && gWindow.google?.accounts?.id) {
      setError(null);
      try {
        gWindow.google.accounts.id.prompt();
      } catch (err) {
        console.warn('Google prompt error:', err);
      }
    } else {
      setError(
        'Google OAuth Client ID is not configured in Vercel environment variables (VITE_GOOGLE_CLIENT_ID). To test customer access immediately, please click "Customer Demo Account" below!'
      );
    }
  };


  const handleDemoLogin = async (email: string) => {
    try {
      setError(null);
      setLoadingEmail(email);
      await loginWithDemo(email);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please verify the backend is running.';
      setError(msg);
    } finally {
      setLoadingEmail(null);
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    handleDemoLogin(customEmail.trim().toLowerCase());
  };

  return (
    <div className="max-w-md mx-auto space-y-6 py-6">
      <Card className="p-2 shadow-sm space-y-4">
        <CardHeader className="space-y-2 text-center pb-2">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <LogIn className="w-7 h-7" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Sign in to ShopAI</CardTitle>
          <CardDescription>
            Secure authentication with Google OAuth &amp; Role-Based Access Control
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isAuthenticated && user ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4 text-center">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Signed in as {user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <Badge
                  variant={user.role === 'ADMIN' ? 'warning' : 'default'}
                  className="mt-2 text-[11px] font-semibold uppercase"
                >
                  Role: {user.role}
                </Badge>
              </div>
              <div className="flex gap-2 justify-center pt-2">
                <Button
                  size="sm"
                  variant="emerald"
                  onClick={() => navigate(user.role === 'ADMIN' ? '/admin' : '/products')}
                >
                  Go to {user.role === 'ADMIN' ? 'Dashboard' : 'Store'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Google Sign In Container & Button */}
              {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                <div id="google-signin-btn-container" className="flex justify-center w-full min-h-[44px]" />
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleGoogleClick}
                  className="w-full flex items-center justify-center gap-3 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </Button>
              )}

              <div className="relative flex items-center justify-center py-2">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-xs uppercase font-medium text-slate-400 absolute">
                  Instant Interview Accounts
                </span>
              </div>

              {/* Quick Demo Accounts */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={!!loadingEmail}
                  onClick={() => handleDemoLogin('customer@shopai.com')}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 text-left transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Customer Demo Account</p>
                      <p className="text-[11px] text-slate-500 font-mono">customer@shopai.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                    <span>{loadingEmail === 'customer@shopai.com' ? 'Signing in...' : 'Sign In'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </div>
                </button>

                <button
                  type="button"
                  disabled={!!loadingEmail}
                  onClick={() => handleDemoLogin('admin@shopai.com')}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-left transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Administrator Account</p>
                      <p className="text-[11px] text-slate-500 font-mono">admin@shopai.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                    <span>{loadingEmail === 'admin@shopai.com' ? 'Signing in...' : 'Sign In'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </div>
                </button>
              </div>

              {/* Custom email login */}
              <form onSubmit={handleCustomLogin} className="pt-2 space-y-2">
                <label htmlFor="customEmail" className="block text-[11px] font-semibold uppercase text-slate-400">
                  Or sign in with any email
                </label>
                <div className="flex gap-2">
                  <Input
                    id="customEmail"
                    type="email"
                    placeholder="user@example.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={!customEmail.trim() || !!loadingEmail}
                  >
                    Enter
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>Role-Based Access Control (RBAC) enforced on backend</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
