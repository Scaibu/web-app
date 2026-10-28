'use client';

import React from 'react';
import { ThemeProvider } from '../theme/ThemeProvider';
import { NotificationProvider } from '../components/primitives/NotificationProvider';
import { FeatureFlagProvider } from '../lib/feature-flags/feature-flags';
import '../features';

export function Providers({ children }: { readonly children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <NotificationProvider>
        <FeatureFlagProvider>
          {children}
        </FeatureFlagProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
