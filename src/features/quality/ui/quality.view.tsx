'use client';

import React, { useEffect, useSyncExternalStore } from "react";
import { qualityStateInstance, type QualityStateData } from "../state/quality.state";
import { qualityController } from "../controller/quality.controller";
import { QualityDashboardUI } from "./QualityDashboardUI";
import type { QualityFilterModel } from "../models/quality.model";

export interface QualityViewProps {
  filters?: QualityFilterModel;
}

export function QualityView({ filters = {} }: QualityViewProps) {
  const state: QualityStateData = useSyncExternalStore(
    (callback) => qualityStateInstance.subscribe(callback),
    () => qualityStateInstance.getSnapshot(),
    () => qualityStateInstance.getSnapshot()
  );

  useEffect(() => {
    qualityController.loadQualityMetrics(filters);
  }, [filters.model, filters.timeRange, filters.service, filters.environment]);

  return (
    <QualityDashboardUI
      summary={state.summary}
      trend={state.trend}
      models={state.modelBreakdown}
      flaggedAlerts={state.flaggedContent}
      loading={state.isLoading}
      error={state.errorMessage}
    />
  );
}
