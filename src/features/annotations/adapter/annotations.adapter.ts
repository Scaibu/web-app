/**
 * Outbound Adapter Port and Implementation for Annotations API.
 * Adheres strictly to Part III (Frontend Feature Structure: Adapter Role).
 */

import type {
  TraceAnnotation,
  AnnotationCreatePayload,
} from '../models/annotations.model';

export interface AnnotationsAdapterPort {
  listAnnotations(traceId?: string): Promise<TraceAnnotation[]>;
  createAnnotation(payload: AnnotationCreatePayload): Promise<TraceAnnotation>;
}

export class AnnotationsMockAdapter implements AnnotationsAdapterPort {
  private inMemoryDb: TraceAnnotation[] = [
    {
      id: 'ann-001',
      trace_id: 'tr-7104de49',
      span_id: 'span-summarizer-llm',
      rating: 'negative',
      tags: ['hallucination', 'bad_formatting'],
      reviewer: 'lead-evaluator',
      comment: 'Hallucinated quarterly net profit margin and omitted requested ISO table.',
      ground_truth_completion: 'According to SEC Form 10-K, Q3 net margin was 14.2% (down from 18.1%).',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ];

  async listAnnotations(traceId?: string): Promise<TraceAnnotation[]> {
    if (traceId) {
      return this.inMemoryDb.filter((a) => a.trace_id === traceId);
    }
    return [...this.inMemoryDb];
  }

  async createAnnotation(payload: AnnotationCreatePayload): Promise<TraceAnnotation> {
    const created: TraceAnnotation = {
      id: `ann-${Date.now().toString(36)}`,
      trace_id: payload.trace_id,
      span_id: payload.span_id,
      rating: payload.rating,
      tags: payload.tags,
      reviewer: 'lead-evaluator',
      comment: payload.comment,
      ground_truth_completion: payload.ground_truth_completion,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.inMemoryDb.unshift(created);
    return created;
  }
}

export const annotationsAdapter = new AnnotationsMockAdapter();
