'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';
import AuthGuard from '@/components/AuthGuard';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (user && !loading) {
      router.push('/home');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 pt-12">
        <button className="p-2">
          <ArrowLeft className="w-6 h-6 text-text-primary" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-8">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">
            Go ahead and set up your account
          </h1>
          <p className="text-text-secondary mb-8">
            Sign in-up to enjoy the best managing experience
          </p>

          {/* Login Card */}
          <div className="bg-surface rounded-xl p-6 shadow-md">
            {/* OAuth Only - No Email/Password */}
            <div className="space-y-4">
              <p className="text-center text-text-secondary mb-6">
                Continue with
              </p>

              {/* Social Login Buttons */}
              {supabase ? (
                <Auth
                  supabaseClient={supabase}
                  view="sign_in"
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: '#A8D4A0',
                          brandAccent: '#8BB882',
                          brandButtonText: '#3A4A32',
                          defaultButtonBackground: '#FEFCF9',
                          defaultButtonBackgroundHover: '#F0EDE6',
                          defaultButtonBorder: '#D8D3C8',
                          defaultButtonText: '#3A4A32',
                          dividerBackground: '#E5E0D5',
                          inputBackground: '#FEFCF9',
                          inputBorder: '#D8D3C8',
                          inputBorderHover: '#A8D4A0',
                          inputBorderFocus: '#8BB882',
                          inputText: '#3A4A32',
                          inputLabelText: '#6B7A5E',
                          inputPlaceholder: '#8A9580',
                          messageText: '#6B7A5E',
                          messageTextDanger: '#C85A5A',
                          anchorTextColor: '#7FA876',
                          anchorTextHoverColor: '#8BB882',
                        },
                        space: {
                          spaceSmall: '4px',
                          spaceMedium: '8px',
                          spaceLarge: '16px',
                          labelBottomMargin: '8px',
                          anchorBottomMargin: '4px',
                          emailInputSpacing: '4px',
                          socialAuthSpacing: '4px',
                          buttonPadding: '10px 15px',
                          inputPadding: '10px 15px',
                        },
                        fontSizes: {
                          baseBodySize: '14px',
                          baseInputSize: '16px',
                          baseLabelSize: '14px',
                          baseButtonSize: '16px',
                        },
                        fonts: {
                          bodyFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                          buttonFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                          inputFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                          labelFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                        },
                        borderWidths: {
                          buttonBorderWidth: '1px',
                          inputBorderWidth: '1px',
                        },
                        radii: {
                          borderRadiusButton: '8px',
                          buttonBorderRadius: '8px',
                          inputBorderRadius: '8px',
                        },
                      },
                    },
                  }}
                  providers={['google', 'apple']}
                  onlyThirdPartyProviders={true}
                  socialLayout="horizontal"
                  redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/home` : undefined}
                />
              ) : (
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-surface border border-border rounded-lg font-medium text-text-primary hover:bg-hover transition-colors">
                    <div className="w-5 h-5 bg-blue-500 rounded"></div>
                    Continue with Google
                  </button>
                  <button className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-surface border border-border rounded-lg font-medium text-text-primary hover:bg-hover transition-colors">
                    <div className="w-5 h-5 bg-black rounded"></div>
                    Continue with Apple
                  </button>
                  <p className="text-center text-xs text-text-tertiary mt-4">
                    Demo mode - Supabase not configured
                  </p>
                  <button 
                    onClick={() => window.location.href = '/home'}
                    className="w-full py-3 px-4 bg-accent text-surface rounded-lg font-medium hover:bg-accent-light transition-colors"
                  >
                    Continue to Demo
                  </button>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}