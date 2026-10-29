/**
 * Domain Models for Evaluations and Benchmark Experiments.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export type EvaluationMetricType =
  | 'accuracy'
  | 'faithfulness'
  | 'hallucination_rate'
  | 'cost_per_1k_tokens'
  | 'latency_p95_ms'
  | 'context_precision';

export type EvalRunStatus = 'completed' | 'running' | 'failed';

export interface MetricScore {
  type: EvaluationMetricType;
  label: string;
  value: number;
  unit: string;
  benchmarkTarget: number;
  isPassing: boolean;
}

export interface EvaluationRun {
  id: string;
  name: string;
  model: string;
  prompt_version: string;
  dataset_name: string;
  total_samples: number;
  passed_samples: number;
  status: EvalRunStatus;
  metrics: MetricScore[];
  cost_usd: number;
  created_at: string;
  git_commit_sha?: string;
}

export interface EvaluationComparison {
  baseRunId: string;
  candidateRunId: string;
  metricDiffs: {
    metric: EvaluationMetricType;
    label: string;
    baseValue: number;
    candidateValue: number;
    deltaPercent: number;
    improved: boolean;
  }[];
}
