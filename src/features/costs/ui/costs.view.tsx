'use client';

import React, { useEffect, useSyncExternalStore, useState, useMemo } from "react";
import { costsStateInstance, type CostsStateData } from "../state/costs.state";
import { costsController } from "../controller/costs.controller";
import { CostsDashboardUI } from "./CostsDashboardUI";
import { buildDonutSlices } from "./CostsProviderChart";
import {
  filterProviders,
  computeCalculatorResult,
  trendPointsToUplotData,
  computeComparisonDelta,
} from "./costs-ui.utils";
import type { CostsFilterModel, CostByProvider, CostTrendPoint } from "../models/costs.model";
import type { CostsTrendChartMode } from "./CostsTrendChart";

export interface CostsViewProps {
  filters?: CostsFilterModel;
}

const MOCK_TREND: CostTrendPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0] ?? '',
  cost_usd: 400 + Math.sin(i / 3) * 80 + (i * 5),
  token_count: 1500000 + Math.floor(Math.sin(i / 4) * 200000),
}));

const [defaultTimestamps, defaultCosts, defaultTokens] = trendPointsToUplotData(MOCK_TREND);

export function CostsView({ filters = {} }: CostsViewProps) {
  const state: CostsStateData = useSyncExternalStore(
    (callback) => costsStateInstance.subscribe(callback),
    () => costsStateInstance.getSnapshot(),
    () => costsStateInstance.getSnapshot()
  );

  useEffect(() => {
    costsController.loadCostMetrics(filters);
  }, [filters.timeRange, filters.model, filters.service, filters.environment]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState<CostByProvider | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [trendMode, setTrendMode] = useState<CostsTrendChartMode>("cost");

  const [calcTokens, setCalcTokens] = useState(500000);
  const [calcCostPer1k, setCalcCostPer1k] = useState(0.005);
  const [calcBudget, setCalcBudget] = useState(1500);
  const [calcModel, setCalcModel] = useState("gpt-4o");

  const [compModelA, setCompModelA] = useState("gpt-4o");
  const [compModelB, setCompModelB] = useState("claude-3-5-sonnet");

  const filteredProviders = useMemo(
    () => filterProviders(state.providers, searchQuery),
    [state.providers, searchQuery]
  );

  const donutSlices = useMemo(() => {
    return state.providers.length > 0
      ? buildDonutSlices(state.providers)
      : [];
  }, [state.providers]);

  const calculatorResult = useMemo(
    () => computeCalculatorResult(calcTokens, calcCostPer1k, calcBudget),
    [calcTokens, calcCostPer1k, calcBudget]
  );

  const rowA = useMemo(
    () => state.providers.find((p) => p.model === compModelA) ?? null,
    [state.providers, compModelA]
  );
  const rowB = useMemo(
    () => state.providers.find((p) => p.model === compModelB) ?? null,
    [state.providers, compModelB]
  );
  const compDelta = useMemo(
    () => (rowA && rowB ? computeComparisonDelta(rowA, rowB) : null),
    [rowA, rowB]
  );

  const modelOptions = useMemo(
    () => state.providers.map((p) => p.model),
    [state.providers]
  );

  return (
    <CostsDashboardUI
      summary={state.summary}
      providers={state.providers}
      filteredProviders={filteredProviders}
      loading={state.isLoading}
      error={state.errorMessage}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedRow={selectedRow}
      detailOpen={detailOpen}
      onRowClick={(row) => {
        setSelectedRow(row);
        setDetailOpen(true);
      }}
      onDetailOpenChange={setDetailOpen}
      trendChartTimestamps={defaultTimestamps}
      trendChartCosts={defaultCosts}
      trendChartTokens={defaultTokens}
      trendMode={trendMode}
      onTrendModeChange={setTrendMode}
      donutSlices={donutSlices}
      calculatorTokensPerDay={calcTokens}
      calculatorCostPer1k={calcCostPer1k}
      calculatorBudgetUsd={calcBudget}
      calculatorSelectedModel={calcModel}
      calculatorResult={calculatorResult}
      calculatorModelOptions={modelOptions}
      onCalculatorTokensChange={setCalcTokens}
      onCalculatorCostPer1kChange={setCalcCostPer1k}
      onCalculatorBudgetChange={setCalcBudget}
      onCalculatorModelChange={setCalcModel}
      comparisonModelA={compModelA}
      comparisonModelB={compModelB}
      comparisonRowA={rowA}
      comparisonRowB={rowB}
      comparisonDelta={compDelta}
      onComparisonModelAChange={setCompModelA}
      onComparisonModelBChange={setCompModelB}
    />
  );
}
