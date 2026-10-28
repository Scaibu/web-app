'use client';

import React, { Suspense } from 'react';
import { useDashboardFilters } from '../../../shared/ui/useDashboardFilters';
import { DashboardFilterBar } from '../../../components/forms/DashboardFilterBar';
import { CostsView } from '@/features/costs';

function CostsDashboardContent() {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useDashboardFilters();

  return (
    <div className="flex flex-col gap-6">
      <DashboardFilterBar
        filters={filters}
        onFilterChange={setFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <CostsView filters={filters} />
    </div>
  );
}

export default function CostsDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cost Analytics</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Track USD spend breakdown by LLM provider, model consumption, and monthly run-rate projections.
        </p>
      </div>

      <Suspense fallback={<div className="h-10 animate-pulse bg-muted rounded" />}>
        <CostsDashboardContent />
      </Suspense>
    </div>
  );
}
