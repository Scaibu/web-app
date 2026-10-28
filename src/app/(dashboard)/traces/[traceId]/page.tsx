'use client';

import React, { useEffect, use, useSyncExternalStore } from 'react';
import { TraceDetailWaterfallUI, tracesController, tracesStateInstance } from '@/features/traces';

export default function TraceDetailPage({ params }: { params: Promise<{ traceId: string }> }) {
  const resolvedParams = use(params);
  const state = useSyncExternalStore(
    (callback) => tracesStateInstance.subscribe(callback),
    () => tracesStateInstance.getSnapshot(),
    () => tracesStateInstance.getSnapshot()
  );

  useEffect(() => {
    if (resolvedParams.traceId) {
      tracesController.selectTrace(resolvedParams.traceId);
    }
  }, [resolvedParams.traceId]);

  return (
    <TraceDetailWaterfallUI
      trace={state.selectedTrace}
      loading={state.isLoading}
      error={state.errorMessage}
    />
  );
}


