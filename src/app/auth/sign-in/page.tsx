'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignInForm, authActions, type AuthState, AUTH_DEFAULT_FIXTURES, AUTH_ROUTES } from '../../../features/auth';

function getClientCookieToken(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(?:^|; )authjs\\.session-token=([^;]*)'));
  const token = match && match[1] ? decodeURIComponent(match[1]) : undefined;
  if (!token || token.trim() === '' || token === 'null' || token === 'undefined') return undefined;
  return token;
}

export default function SignInPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? AUTH_ROUTES.DASHBOARD;

  const { status, error } = useSelector((state: any) => (state.auth || {}) as AuthState);

  useEffect(() => {
    const token = getClientCookieToken();
    if (token) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, router]);

  useEffect(() => {
    if (status === 'success') {
      dispatch(authActions.resetAuthStatus());
      router.push(callbackUrl);
      router.refresh();
    }
  }, [status, router, callbackUrl, dispatch]);

  const handleSubmit = (payload: { email: string; password?: string }) => {
    dispatch(authActions.signInSubmitted(payload as any));
  };

  return (
    <div className="auth-container">
      <SignInForm
        initialEmail={AUTH_DEFAULT_FIXTURES.EMAIL}
        initialPassword={AUTH_DEFAULT_FIXTURES.PASSWORD}
        loading={status === 'loading'}
        errorMsg={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
