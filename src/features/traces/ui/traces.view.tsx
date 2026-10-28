'use client';

import React, { useEffect, useSyncExternalStore } from "react";
import { tracesStateInstance, type TracesStateData } from "../state/traces.state";
import { tracesController } from "../controller/traces.controller";
import { TracesDashboardUI } from "./TracesDashboardUI";
import type { TracesFilterModel } from "../models/traces.model";

export interface TracesViewProps {
  filters?: TracesFilterModel;
}

export function TracesView({ filters = {} }: TracesViewProps) {
  const state: TracesStateData = useSyncExternalStore(
    (callback) => tracesStateInstance.subscribe(callback),
    () => tracesStateInstance.getSnapshot(),
    () => tracesStateInstance.getSnapshot()
  );

  useEffect(() => {
    tracesController.loadTraces(filters);
  }, [filters.model, filters.status, filters.service, filters.timeRange]);

  return (
    <TracesDashboardUI
      traces={state.traces}
      loading={state.isLoading}
      error={state.errorMessage}
    />
  );
}
