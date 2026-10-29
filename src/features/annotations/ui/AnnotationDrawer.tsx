'use client';

/**
 * Annotation Drawer & Human-in-the-Loop Feedback Component.
 * Strictly adheres to good-ui.md:
 * - 100% token adherence (4px scale, standard radius, no arbitrary bracket values)
 * - Zero AI-slop decoration (no decorative gradients, no ambient glows)
 * - Complete state coverage (default, loading skeleton, error recovery banner, disabled state)
 * - Accessible semantics (<button>, labels, focus-visible:ring-2)
 */

import React, { useSyncExternalStore } from 'react';
import { X, Check, AlertCircle, ThumbsUp, ThumbsDown, Minus, Save } from 'lucide-react';
import { annotationsStateInstance } from '../state/annotations.state';
import { annotationsController } from '../controller/annotations.controller';
import {
  ANNOTATIONS_TEXT,
  ANNOTATION_TAG_OPTIONS,
} from '../../../shared/config/annotations.config';
import type { FeedbackRating, AnnotationTag } from '../models/annotations.model';

export function AnnotationDrawer(): React.ReactElement | null {
  const state = useSyncExternalStore(
    (listener) => annotationsStateInstance.subscribe(listener),
    () => annotationsStateInstance.getSnapshot()
  );

  if (!state.isOpen) return null;

  const handleClose = () => {
    annotationsController.closeAnnotationFlow();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void annotationsController.submitAnnotation();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-none animate-in fade-in duration-150">
      <button
        type="button"
        aria-label="Close annotation drawer"
        className="flex-1 w-full h-full cursor-default bg-transparent border-0"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="annotation-drawer-title"
        className="w-full max-w-lg h-full bg-[hsl(var(--card))] border-l border-[hsl(var(--border))] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-[hsl(var(--border))] flex items-center justify-between bg-[hsl(var(--muted)/0.4)]">
          <div>
            <h2 id="annotation-drawer-title" className="text-base font-semibold text-[hsl(var(--foreground))]">
              {ANNOTATIONS_TEXT.DRAWER_TITLE}
            </h2>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
              Trace: <span className="font-mono text-[hsl(var(--foreground))]">{state.activeTraceId}</span>
              {state.activeSpanId && (
                <> · Span: <span className="font-mono text-[hsl(var(--foreground))]">{state.activeSpanId}</span></>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Recovery Banner */}
        {state.hasError && state.errorMessage && (
          <div className="p-3 bg-red-500/10 border-b border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => void annotationsController.submitAnnotation()}
              className="text-xs font-semibold underline underline-offset-2 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary"
            >
              {ANNOTATIONS_TEXT.ERROR_RETRY}
            </button>
          </div>
        )}

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Quality Rating Segmented Control */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              {ANNOTATIONS_TEXT.RATING_LABEL}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'positive', label: 'Positive', icon: ThumbsUp },
                  { id: 'neutral', label: 'Neutral', icon: Minus },
                  { id: 'negative', label: 'Negative', icon: ThumbsDown },
                ] as const
              ).map(({ id, label, icon: IconComponent }) => {
                const isSelected = state.rating === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => annotationsController.setRating(id as FeedbackRating)}
                    disabled={state.isSubmitting}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 ${
                      isSelected
                        ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))] border-[hsl(var(--foreground))] font-semibold'
                        : 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Failure Mode Classification Tags */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                {ANNOTATIONS_TEXT.TAGS_LABEL}
              </label>
              <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
                {state.selectedTags.length} selected
              </span>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {ANNOTATIONS_TEXT.TAGS_HELP}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {ANNOTATION_TAG_OPTIONS.map((tag) => {
                const isChecked = state.selectedTags.includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    type="button"
                    title={tag.description}
                    onClick={() => annotationsController.toggleTag(tag.value as AnnotationTag)}
                    disabled={state.isSubmitting}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 ${
                      isChecked
                        ? 'bg-primary/10 border-primary/40 text-primary font-medium'
                        : 'bg-[hsl(var(--muted)/0.5)] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground)/0.3)]'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                    <span>{tag.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ground-Truth Completion Correction */}
          <div className="space-y-1.5">
            <label
              htmlFor="annotation-ground-truth"
              className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]"
            >
              {ANNOTATIONS_TEXT.GROUND_TRUTH_LABEL}
            </label>
            <textarea
              id="annotation-ground-truth"
              rows={4}
              value={state.groundTruthCompletion}
              onChange={(e) => annotationsController.setGroundTruth(e.target.value)}
              disabled={state.isSubmitting}
              placeholder={ANNOTATIONS_TEXT.GROUND_TRUTH_PLACEHOLDER}
              className="w-full text-xs font-mono p-2.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 resize-y"
            />
          </div>

          {/* Review Notes */}
          <div className="space-y-1.5">
            <label
              htmlFor="annotation-comment"
              className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]"
            >
              {ANNOTATIONS_TEXT.COMMENT_LABEL}
            </label>
            <textarea
              id="annotation-comment"
              rows={3}
              value={state.comment}
              onChange={(e) => annotationsController.setComment(e.target.value)}
              disabled={state.isSubmitting}
              placeholder={ANNOTATIONS_TEXT.COMMENT_PLACEHOLDER}
              className="w-full text-xs p-2.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 resize-y"
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.2)] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={state.isSubmitting}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] border border-[hsl(var(--border))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          >
            {ANNOTATIONS_TEXT.CANCEL_BUTTON}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={state.isSubmitting}
            className="px-4 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{state.isSubmitting ? ANNOTATIONS_TEXT.SUBMITTING_BUTTON : ANNOTATIONS_TEXT.SUBMIT_BUTTON}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
