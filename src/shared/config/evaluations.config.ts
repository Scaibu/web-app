/**
 * Centralized configurations and text constants for Evaluations feature.
 * Strictly adheres to 3.shared.code.writing.rule.md (Zero magic strings).
 */

export const EVALUATIONS_TEXT = {
  HEADER_TITLE: 'Evaluation Benchmarks & Regression Matrix',
  HEADER_SUBTITLE: 'Compare model versions, prompt iterations, and ground-truth dataset scores before deploying to production.',
  TRIGGER_RUN_BUTTON: 'Trigger New Benchmark',
  FILTER_ALL_MODELS: 'All Models',
  FILTER_ALL_STATUS: 'All Statuses',
  TABLE_RUN_NAME: 'Experiment / Run Name',
  TABLE_MODEL: 'Target Model',
  TABLE_DATASET: 'Evaluation Dataset',
  TABLE_SAMPLES: 'Passed / Total',
  TABLE_ACCURACY: 'Factual Accuracy',
  TABLE_FAITHFULNESS: 'Faithfulness',
  TABLE_HALLUCINATION: 'Hallucination Rate',
  TABLE_LATENCY: 'P95 Latency',
  TABLE_COST: 'Run Cost',
  TABLE_STATUS: 'Status',
  COMPARE_BUTTON: 'Compare with Baseline',
  COMPARISON_TITLE: 'Regression Delta Matrix',
  EMPTY_TITLE: 'No Evaluation Runs Recorded',
  EMPTY_DESCRIPTION: 'Trigger your first offline benchmark against a golden evaluation dataset to track prompt and model regressions.',
  EMPTY_ACTION: 'Run Benchmark Now',
  ERROR_TITLE: 'Failed to Load Evaluations',
  ERROR_RETRY: 'Reload Benchmarks',
} as const;
