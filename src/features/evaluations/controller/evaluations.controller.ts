/**
 * Controller for Evaluations and Benchmark Experiments.
 * Adheres strictly to Part III (Frontend Feature Structure: Controller Role).
 */

import {
  evaluationsStateInstance,
  EvaluationsState,
} from '../state/evaluations.state';
import {
  evaluationsAdapter,
  type EvaluationsAdapterPort,
} from '../adapter/evaluations.adapter';
import type { EvaluationRun, EvaluationComparison, EvalRunStatus } from '../models/evaluations.model';

export class EvaluationsController {
  constructor(
    private readonly state: EvaluationsState = evaluationsStateInstance,
    private readonly adapter: EvaluationsAdapterPort = evaluationsAdapter
  ) {}

  async loadRuns(): Promise<void> {
    this.state.setLoading(true);
    try {
      const runs = await this.adapter.listRuns();
      this.state.setRuns(runs);
      if (runs.length > 0 && !this.state.getSnapshot().selectedRun) {
        this.state.selectRun(runs[0]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load evaluation runs';
      this.state.setError(msg);
    } finally {
      this.state.setLoading(false);
    }
  }

  selectRun(run: EvaluationRun | null): void {
    this.state.selectRun(run);
  }

  compareRuns(baseRunId: string, candidateRunId: string): void {
    const runs = this.state.getSnapshot().runs;
    const base = runs.find((r) => r.id === baseRunId);
    const candidate = runs.find((r) => r.id === candidateRunId);

    if (!base || !candidate) return;

    const diffs = base.metrics.map((baseMetric) => {
      const candMetric = candidate.metrics.find((m) => m.type === baseMetric.type);
      const candVal = candMetric ? candMetric.value : 0;
      const delta = baseMetric.value !== 0 ? ((candVal - baseMetric.value) / baseMetric.value) * 100 : 0;
      
      const isHigherBetter = !['hallucination_rate', 'latency_p95_ms', 'cost_per_1k_tokens'].includes(baseMetric.type);
      const improved = isHigherBetter ? delta > 0 : delta < 0;

      return {
        metric: baseMetric.type,
        label: baseMetric.label,
        baseValue: baseMetric.value,
        candidateValue: candVal,
        deltaPercent: Number(delta.toFixed(1)),
        improved,
      };
    });

    const comparison: EvaluationComparison = {
      baseRunId,
      candidateRunId,
      metricDiffs: diffs,
    };

    this.state.setComparison(comparison);
  }

  setModelFilter(model: string | null): void {
    this.state.setModelFilter(model);
  }

  setStatusFilter(status: EvalRunStatus | 'all'): void {
    this.state.setStatusFilter(status);
  }
}

export const evaluationsController = new EvaluationsController();
