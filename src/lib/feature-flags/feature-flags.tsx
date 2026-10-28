'use client';

import React, { createContext, useContext, useState } from 'react';

interface FeatureFlagContextValue {
  readonly flags: Record<string, boolean>;
  readonly isEnabled: (flagName: string) => boolean;
}

const DEFAULT_FLAGS: Record<string, boolean> = {
  'experimental-dashboard': true,
  'hipaa-redaction': true,
  'live-streaming': true,
};

const FeatureFlagContext = createContext<FeatureFlagContextValue>({
  flags: DEFAULT_FLAGS,
  isEnabled: () => true,
});

export function FeatureFlagProvider({ children }: { readonly children: React.ReactNode }) {
  const [flags] = useState<Record<string, boolean>>(DEFAULT_FLAGS);

  const isEnabled = (flagName: string) => flags[flagName] ?? true;

  return (
    <FeatureFlagContext.Provider value={{ flags, isEnabled }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag(flagName: string): boolean {
  const { isEnabled } = useContext(FeatureFlagContext);
  return isEnabled(flagName);
}
