/**
 * Central State Container for Annotations feature.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 * Exactly ONE state file centralizing all reactive variables, flags, and payloads.
 */

import type {
  TraceAnnotation,
  AnnotationCreatePayload,
  FeedbackRating,
  AnnotationTag,
} from '../models/annotations.model';

export interface AnnotationsStateData {
  isOpen: boolean;
  activeTraceId: string | null;
  activeSpanId: string | null;
  annotations: TraceAnnotation[];
  rating: FeedbackRating;
  selectedTags: AnnotationTag[];
  comment: string;
  groundTruthCompletion: string;
  reviewer: string;
  isLoading: boolean;
  isSubmitting: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class AnnotationsState {
  private data: AnnotationsStateData;
  private listeners: Set<(state: AnnotationsStateData) => void> = new Set();

  constructor(initialData?: Partial<AnnotationsStateData>) {
    this.data = {
      isOpen: initialData?.isOpen ?? false,
      activeTraceId: initialData?.activeTraceId ?? null,
      activeSpanId: initialData?.activeSpanId ?? null,
      annotations: initialData?.annotations ?? [],
      rating: initialData?.rating ?? 'positive',
      selectedTags: initialData?.selectedTags ?? [],
      comment: initialData?.comment ?? '',
      groundTruthCompletion: initialData?.groundTruthCompletion ?? '',
      reviewer: initialData?.reviewer ?? 'engineer',
      isLoading: initialData?.isLoading ?? false,
      isSubmitting: initialData?.isSubmitting ?? false,
      hasError: initialData?.hasError ?? false,
      errorMessage: initialData?.errorMessage ?? null,
    };
  }

  getSnapshot(): AnnotationsStateData {
    return this.data;
  }

  subscribe(listener: (state: AnnotationsStateData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  openDrawer(traceId: string, spanId?: string, defaultCompletion?: string): void {
    this.data = {
      ...this.data,
      isOpen: true,
      activeTraceId: traceId,
      activeSpanId: spanId ?? null,
      rating: 'positive',
      selectedTags: [],
      comment: '',
      groundTruthCompletion: defaultCompletion ?? '',
      hasError: false,
      errorMessage: null,
    };
    this.notify();
  }

  closeDrawer(): void {
    this.data = {
      ...this.data,
      isOpen: false,
      hasError: false,
      errorMessage: null,
    };
    this.notify();
  }

  setRating(rating: FeedbackRating): void {
    this.data = { ...this.data, rating };
    this.notify();
  }

  toggleTag(tag: AnnotationTag): void {
    const exists = this.data.selectedTags.includes(tag);
    const updated = exists
      ? this.data.selectedTags.filter((t) => t !== tag)
      : [...this.data.selectedTags, tag];

    this.data = { ...this.data, selectedTags: updated };
    this.notify();
  }

  setComment(comment: string): void {
    this.data = { ...this.data, comment };
    this.notify();
  }

  setGroundTruthCompletion(groundTruthCompletion: string): void {
    this.data = { ...this.data, groundTruthCompletion };
    this.notify();
  }

  setReviewer(reviewer: string): void {
    this.data = { ...this.data, reviewer };
    this.notify();
  }

  setLoading(isLoading: boolean): void {
    this.data = { ...this.data, isLoading };
    this.notify();
  }

  setSubmitting(isSubmitting: boolean): void {
    this.data = { ...this.data, isSubmitting };
    this.notify();
  }

  setError(errorMessage: string): void {
    this.data = {
      ...this.data,
      hasError: true,
      errorMessage,
      isLoading: false,
      isSubmitting: false,
    };
    this.notify();
  }

  setAnnotations(annotations: TraceAnnotation[]): void {
    this.data = {
      ...this.data,
      annotations,
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
    this.notify();
  }

  addAnnotation(annotation: TraceAnnotation): void {
    this.data = {
      ...this.data,
      annotations: [annotation, ...this.data.annotations],
      isSubmitting: false,
      hasError: false,
      errorMessage: null,
    };
    this.notify();
  }

  getPayload(): AnnotationCreatePayload | null {
    if (!this.data.activeTraceId) return null;
    return {
      trace_id: this.data.activeTraceId,
      span_id: this.data.activeSpanId ?? undefined,
      rating: this.data.rating,
      tags: this.data.selectedTags,
      comment: this.data.comment,
      ground_truth_completion: this.data.groundTruthCompletion.trim() || undefined,
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const annotationsStateInstance = new AnnotationsState();
