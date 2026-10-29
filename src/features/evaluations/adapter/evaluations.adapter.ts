/**
 * Outbound Adapter Port & Implementation for Evaluations API.
 * Adheres strictly to Part III (Frontend Feature Structure: Adapter Role).
 */

import type { EvaluationRun } from '../models/evaluations.model';

export interface EvaluationsAdapterPort {
  listRuns(): Promise<EvaluationRun[]>;
  getRunDetail(id: string): Promise<EvaluationRun>;
}

export class EvaluationsMockAdapter implements EvaluationsAdapterPort {
  private inMemoryRuns: EvaluationRun[] = [
    {
      id: 'eval-run-901',
      name: 'RAG Faithfulness & Retrieval Q4',
      model: 'gpt-4o',
      prompt_version: 'v2.4.0',
      dataset_name: 'sec-filings-qa-gold',
      total_samples: 500,
      passed_samples: 472,
      status: 'completed',
      cost_usd: 14.85,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      git_commit_sha: 'a4fbbe5',
      metrics: [
        {
          type: 'accuracy',
          label: 'Factual Accuracy',
          value: 94.4,
          unit: '%',
          benchmarkTarget: 90.0,
          isPassing: true,
        },
        {
          type: 'faithfulness',
          label: 'RAG Context Faithfulness',
          value: 96.1,
          unit: '%',
          benchmarkTarget: 95.0,
          isPassing: true,
        },
        {
          type: 'hallucination_rate',
          label: 'Hallucination Rate',
          value: 3.2,
          unit: '%',
          benchmarkTarget: 5.0,
          isPassing: true,
        },
        {
          type: 'latency_p95_ms',
          label: 'P95 Latency',
          value: 620,
          unit: 'ms',
          benchmarkTarget: 800,
          isPassing: true,
        },
      ],
    },
    {
      id: 'eval-run-902',
      name: 'Claude 3.5 Sonnet Benchmark Baseline',
      model: 'claude-3-5-sonnet',
      prompt_version: 'v2.4.0',
      dataset_name: 'sec-filings-qa-gold',
      total_samples: 500,
      passed_samples: 488,
      status: 'completed',
      cost_usd: 18.2,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      git_commit_sha: '8392bc1',
      metrics: [
        {
          type: 'accuracy',
          label: 'Factual Accuracy',
          value: 97.6,
          unit: '%',
          benchmarkTarget: 90.0,
          isPassing: true,
        },
        {
          type: 'faithfulness',
          label: 'RAG Context Faithfulness',
          value: 98.4,
          unit: '%',
          benchmarkTarget: 95.0,
          isPassing: true,
        },
        {
          type: 'hallucination_rate',
          label: 'Hallucination Rate',
          value: 1.4,
          unit: '%',
          benchmarkTarget: 5.0,
          isPassing: true,
        },
        {
          type: 'latency_p95_ms',
          label: 'P95 Latency',
          value: 710,
          unit: 'ms',
          benchmarkTarget: 800,
          isPassing: true,
        },
      ],
    },
    {
      id: 'eval-run-903',
      name: 'Llama-3-70B Self-Hosted Evaluation',
      model: 'meta-llama-3-70b',
      prompt_version: 'v2.3.1',
      dataset_name: 'customer-support-intent-v3',
      total_samples: 1200,
      passed_samples: 1010,
      status: 'completed',
      cost_usd: 3.4,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      git_commit_sha: 'e519c23',
      metrics: [
        {
          type: 'accuracy',
          label: 'Factual Accuracy',
          value: 84.1,
          unit: '%',
          benchmarkTarget: 90.0,
          isPassing: false,
        },
        {
          type: 'faithfulness',
          label: 'RAG Context Faithfulness',
          value: 88.5,
          unit: '%',
          benchmarkTarget: 95.0,
          isPassing: false,
        },
        {
          type: 'hallucination_rate',
          label: 'Hallucination Rate',
          value: 8.9,
          unit: '%',
          benchmarkTarget: 5.0,
          isPassing: false,
        },
        {
          type: 'latency_p95_ms',
          label: 'P95 Latency',
          value: 940,
          unit: 'ms',
          benchmarkTarget: 800,
          isPassing: false,
        },
      ],
    },
  ];

  async listRuns(): Promise<EvaluationRun[]> {
    return [...this.inMemoryRuns];
  }

  async getRunDetail(id: string): Promise<EvaluationRun> {
    const run = this.inMemoryRuns.find((r) => r.id === id);
    if (!run) {
      throw new Error(`Evaluation run ${id} not found`);
    }
    return run;
  }
}

export const evaluationsAdapter = new EvaluationsMockAdapter();
