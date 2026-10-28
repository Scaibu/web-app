'use client';

import React, { useEffect, useSyncExternalStore } from "react";
import { costsStateInstance, type CostsStateData } from "../state/costs.state";
import { costsController } from "../controller/costs.controller";
import { CostsDashboardUI } from "./CostsDashboardUI";
import type { CostsFilterModel } from "../models/costs.model";

export interface CostsViewProps {
  filters?: CostsFilterModel;
}

export function CostsView({ filters = {} }: CostsViewProps) {
  const state: CostsStateData = useSyncExternalStore(
    (callback) => costsStateInstance.subscribe(callback),
    () => costsStateInstance.getSnapshot(),
    () => costsStateInstance.getSnapshot()
  );

  useEffect(() => {
    costsController.loadCostMetrics(filters);
  }, [filters.timeRange, filters.model, filters.service, filters.environment]);

  return (
    <CostsDashboardUI
      summary={state.summary}
      providers={state.providers}
      loading={state.isLoading}
      error={state.errorMessage}
    />
  );
}
