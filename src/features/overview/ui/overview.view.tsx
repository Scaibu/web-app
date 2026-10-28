'use client';

import React, { useEffect, useSyncExternalStore } from "react";
import { overviewStateInstance, type OverviewStateData } from "../state/overview.state";
import { overviewController } from "../controller/overview.controller";
import { OverviewDashboardUI } from "./OverviewDashboardUI";
import type { OverviewFilterModel } from "../models/overview.model";

export interface OverviewViewProps {
  filters?: OverviewFilterModel;
}

export function OverviewView({ filters = {} }: OverviewViewProps) {
  const state: OverviewStateData = useSyncExternalStore(
    (callback) => overviewStateInstance.subscribe(callback),
    () => overviewStateInstance.getSnapshot(),
    () => overviewStateInstance.getSnapshot()
  );

  useEffect(() => {
    overviewController.loadOverviewData(filters);
  }, [filters.timeRange, filters.environment]);

  return (
    <OverviewDashboardUI
      kpi={state.kpis}
      health={state.health}
      recentTraces={state.recentTraces}
      loading={state.isLoading}
      error={state.errorMessage}
    />
  );
}
