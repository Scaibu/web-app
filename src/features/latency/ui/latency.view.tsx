'use client';

import React, { useEffect, useSyncExternalStore } from "react";
import { latencyStateInstance, type LatencyStateData } from "../state/latency.state";
import { latencyController } from "../controller/latency.controller";
import { LatencyDashboardUI } from "./LatencyDashboardUI";
import type { LatencyFilterModel } from "../models/latency.model";

export interface LatencyViewProps {
  filters?: LatencyFilterModel;
}

export function LatencyView({ filters = {} }: LatencyViewProps) {
  const state: LatencyStateData = useSyncExternalStore(
    (callback) => latencyStateInstance.subscribe(callback),
    () => latencyStateInstance.getSnapshot(),
    () => latencyStateInstance.getSnapshot()
  );

  useEffect(() => {
    latencyController.loadLatencyMetrics(filters);
  }, [filters.model, filters.timeRange, filters.service, filters.environment]);

  return (
    <LatencyDashboardUI
      percentiles={state.percentiles}
      slo={state.slo}
      attribution={state.attribution}
      baseline={state.baseline}
      loading={state.isLoading}
      error={state.errorMessage}
    />
  );
}
