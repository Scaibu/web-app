'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignInForm, authController } from '../../../features/auth';
import { AUTH_DEFAULT_FIXTURES, AUTH_ROUTES } from '../../../shared/config/auth.config';

function getClientCookieToken(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(?:^|; )authjs\\.session-token=([^;]*)'));
  const token = match && match[1] ? decodeURIComponent(match[1]) : undefined;
  if (!token || token.trim() === '' || token === 'null' || token === 'undefined') return undefined;
  return token;
}

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? AUTH_ROUTES.DASHBOARD;

  const handleSubmit = async (payload: { email: string; password?: string }) => {
    if (payload.email) {
      await authController.signIn({
        email: payload.email,
        password: payload.password || '',
      });
      router.push(callbackUrl);
    }
  };

  return (
    <div className="auth-container">
      <SignInForm
        initialEmail={AUTH_DEFAULT_FIXTURES.EMAIL}
        initialPassword={AUTH_DEFAULT_FIXTURES.PASSWORD}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
