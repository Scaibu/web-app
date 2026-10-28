'use client';

import React, { Suspense } from 'react';
import { TracesView } from '@/features/traces';

function TracesDashboardContent() {
  return <TracesView />;
}

export default function TracesDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trace Explorer</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Search and inspect distributed execution spans, OpenTelemetry trace trees, and latency bottlenecks.
        </p>
      </div>

      <Suspense fallback={<div className="h-10 animate-pulse bg-muted rounded" />}>
        <TracesDashboardContent />
      </Suspense>
    </div>
  );
}
