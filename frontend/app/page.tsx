'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-context';
import { Loader2, Moon, Sun } from 'lucide-react';
import { useAppTheme } from '@/components/theme-provider';

export default function LoginPage() {
  const router = useRouter();
  const { theme, setTheme } = useAppTheme();
  const { loginAsGuest, loginWithGoogleUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const googleScriptLoadedRef = useRef(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/tasks');
    }
  }, [isAuthenticated, router]);

  // Load Google GIS SDK script immediately on page mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scriptId = 'google-gsi-sdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        googleScriptLoadedRef.current = true;
      };
      document.body.appendChild(script);
    } else {
      googleScriptLoadedRef.current = true;
    }
  }, []);

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await loginAsGuest();
      router.push('/tasks');
    } catch (error: any) {
      console.error('Guest login error:', error);
      setErrorMessage('Failed to login as guest. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Wait briefly for Google GIS script if user clicks immediately on page load
    if (typeof window !== 'undefined' && !(window as any).google?.accounts?.oauth2) {
      setIsLoading(true);
      let attempts = 0;
      while (!(window as any).google?.accounts?.oauth2 && attempts < 20) {
        await new Promise(res => setTimeout(res, 100));
        attempts++;
      }
      setIsLoading(false);
    }

    // Trigger official Google OAuth 2.0 Token Client Popup
    if (googleClientId && (window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'openid email profile',
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              setIsLoading(true);
              try {
                await loginWithGoogleUser({ accessToken: tokenResponse.access_token });
                router.push('/tasks');
              } catch (err: any) {
                setErrorMessage(err.message || 'Google login failed.');
              } finally {
                setIsLoading(false);
              }
            }
          },
        });
        client.requestAccessToken();
        return;
      } catch (err) {
        console.warn('Google token client popup error:', err);
      }
    }

    // Fallback: Prompt for email if NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured in environment
    const enteredEmail = prompt('Google Client ID (NEXT_PUBLIC_GOOGLE_CLIENT_ID) is not set in env.\nEnter your Google email to log in:');
    if (enteredEmail) {
      setIsLoading(true);
      const name = enteredEmail.split('@')[0];
      loginWithGoogleUser({
        email: enteredEmail.trim(),
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      })
        .then(() => router.push('/tasks'))
        .catch(err => setErrorMessage(err.message))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-background px-4 overflow-hidden">
      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Center Auth Wrapper */}
      <div className="z-10 w-full max-w-[420px] flex flex-col items-center gap-6">
        {/* Pyramid Logo Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.186 16.202l3.615 5.313c.265 .39 .754 .57 1.215 .447l10.166 -2.718a1.086 1.086 0 0 0 .713 -1.511l-7.505 -15.483a.448 .448 0 0 0 -.787 -.033l-7.453 12.838a1.07 1.07 0 0 0 .037 1.147l-.001 0" />
              <path d="M8.5 22l3.5 -20" />
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">Pyramid</span>
        </div>

        {/* Main Card Container */}
        <Card className="w-full p-6 sm:p-8 bg-card border-border/80 shadow-xs rounded-[32px]">
          <CardHeader className="text-center pb-5 pt-1 px-0 space-y-1.5">
            <CardTitle className="text-2xl sm:text-[26px] font-bold tracking-tight text-foreground">
              Let&apos;s get back on track
            </CardTitle>
            <CardDescription className="text-sm font-normal text-muted-foreground">
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3.5 px-0 pb-0">
            {errorMessage && (
              <div className="p-3 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 text-center">
                {errorMessage}
              </div>
            )}

            {/* Continue as Guest Button */}
            <Button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-[#18181b] hover:bg-black text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 font-semibold text-sm cursor-pointer transition-all active:scale-[0.98] shadow-xs"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Logging in...</span>
                </span>
              ) : (
                'Continue as Guest'
              )}
            </Button>

            {/* Login with Google Button */}
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 rounded-full border border-gray-200 dark:border-zinc-800 bg-background text-foreground font-semibold text-sm hover:bg-muted/50 transition-all active:scale-[0.98] shadow-xs flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Login with Google</span>
            </Button>
          </CardContent>
        </Card>

        {/* Legal Terms Footer */}
        <div className="text-center text-xs text-muted-foreground/80 leading-relaxed max-w-[280px] font-normal">
          <span>By clicking continue, you agree to</span>
          <br />
          <span>our </span>
          <a href="#" className="underline underline-offset-2 hover:text-foreground">
            Terms of Service
          </a>
          <span> and </span>
          <a href="#" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </a>
        </div>
      </div>
    </main>
  );
}
