'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SignUpForm, authController } from '../../../features/auth';
import { AUTH_DEFAULT_FIXTURES, AUTH_ROUTES } from '../../../shared/config/auth.config';

export default function SignUpPage() {
  const router = useRouter();

  const handleSubmit = async (payload: { name: string; organization_name: string; email: string; password?: string }) => {
    await authController.signUp({
      name: payload.name,
      email: payload.email,
      password: payload.password || '',
      orgName: payload.organization_name,
    });
    router.push(AUTH_ROUTES.SIGN_IN);
  };

  return (
    <div className="auth-container">
      <SignUpForm
        initialName={AUTH_DEFAULT_FIXTURES.NAME}
        initialOrgName={AUTH_DEFAULT_FIXTURES.ORG_NAME}
        initialEmail={AUTH_DEFAULT_FIXTURES.EMAIL}
        initialPassword={AUTH_DEFAULT_FIXTURES.PASSWORD}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
