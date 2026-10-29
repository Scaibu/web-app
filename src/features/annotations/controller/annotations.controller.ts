/**
 * Controller for Annotations and Human Feedback.
 * Adheres strictly to Part III (Frontend Feature Structure: Controller Role).
 * Dedicated controller class with try/catch, mutates State, invokes Adapter.
 */

import {
  annotationsStateInstance,
  AnnotationsState,
} from '../state/annotations.state';
import {
  annotationsAdapter,
  type AnnotationsAdapterPort,
} from '../adapter/annotations.adapter';
import type { FeedbackRating, AnnotationTag } from '../models/annotations.model';

export class AnnotationsController {
  constructor(
    private readonly state: AnnotationsState = annotationsStateInstance,
    private readonly adapter: AnnotationsAdapterPort = annotationsAdapter
  ) {}

  openAnnotationFlow(traceId: string, spanId?: string, defaultCompletion?: string): void {
    this.state.openDrawer(traceId, spanId, defaultCompletion);
    void this.loadAnnotationsForTrace(traceId);
  }

  closeAnnotationFlow(): void {
    this.state.closeDrawer();
  }

  setRating(rating: FeedbackRating): void {
    this.state.setRating(rating);
  }

  toggleTag(tag: AnnotationTag): void {
    this.state.toggleTag(tag);
  }

  setComment(comment: string): void {
    this.state.setComment(comment);
  }

  setGroundTruth(groundTruth: string): void {
    this.state.setGroundTruthCompletion(groundTruth);
  }

  async loadAnnotationsForTrace(traceId: string): Promise<void> {
    this.state.setLoading(true);
    try {
      const records = await this.adapter.listAnnotations(traceId);
      this.state.setAnnotations(records);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load annotations';
      this.state.setError(msg);
    } finally {
      this.state.setLoading(false);
    }
  }

  async submitAnnotation(): Promise<boolean> {
    const payload = this.state.getPayload();
    if (!payload) {
      this.state.setError('Missing active trace ID for annotation submission');
      return false;
    }

    this.state.setSubmitting(true);
    try {
      const saved = await this.adapter.createAnnotation(payload);
      this.state.addAnnotation(saved);
      this.state.closeDrawer();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit annotation';
      this.state.setError(msg);
      return false;
    } finally {
      this.state.setSubmitting(false);
    }
  }
}

export const annotationsController = new AnnotationsController();
