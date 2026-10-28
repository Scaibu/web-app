'use client';

import { useState, useCallback } from 'react';

export interface DashboardFilters {
  timeRange: string;
  model: string;
  service: string;
  environment: string;
}

export type TimeRangeOption = '1h' | '24h' | '7d' | '30d';

export const DEFAULT_DASHBOARD_FILTERS: DashboardFilters = {
  timeRange: '24h',
  model: 'all',
  service: 'all',
  environment: 'all',
};

export function useDashboardFilters() {
  const [filters, setFiltersState] = useState<DashboardFilters>(DEFAULT_DASHBOARD_FILTERS);

  const setFilter = useCallback((key: keyof DashboardFilters, value: string | null) => {
    setFiltersState((prev) => ({
      ...prev,
      [key]: value ?? 'all',
    }));
  }, []);

  const setFilters = useCallback((patch: Partial<DashboardFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...patch,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_DASHBOARD_FILTERS);
  }, []);

  const hasActiveFilters =
    filters.timeRange !== DEFAULT_DASHBOARD_FILTERS.timeRange ||
    filters.model !== DEFAULT_DASHBOARD_FILTERS.model ||
    filters.service !== DEFAULT_DASHBOARD_FILTERS.service ||
    filters.environment !== DEFAULT_DASHBOARD_FILTERS.environment;

  return { filters, setFilter, setFilters, resetFilters, hasActiveFilters };
}
