/**
 * Pure models and domain entities for LLM Trace Annotations and Feedback Loop.
 * Adheres strictly to Part III (Frontend Feature Structure: Model Role).
 */

export type FeedbackRating = 'positive' | 'negative' | 'neutral';

export type AnnotationTag =
  | 'hallucination'
  | 'factual_error'
  | 'toxicity'
  | 'context_truncation'
  | 'bad_formatting'
  | 'bad_json'
  | 'latency_spike'
  | 'prompt_leak'
  | 'incomplete_response';

export interface TraceAnnotation {
  id: string;
  trace_id: string;
  span_id?: string;
  rating: FeedbackRating;
  tags: AnnotationTag[];
  reviewer: string;
  comment: string;
  ground_truth_completion?: string;
  created_at: string;
  updated_at: string;
}

export interface AnnotationCreatePayload {
  trace_id: string;
  span_id?: string;
  rating: FeedbackRating;
  tags: AnnotationTag[];
  comment: string;
  ground_truth_completion?: string;
}

export interface AnnotationTagOption {
  value: AnnotationTag;
  label: string;
  description: string;
}
