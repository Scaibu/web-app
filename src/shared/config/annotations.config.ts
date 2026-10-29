/**
 * Centralized configurations and tokens for Annotations & Human-in-the-Loop feature.
 * Strictly adheres to 3.shared.code.writing.rule.md (Zero magic strings).
 */

import type { AnnotationTagOption } from '../../features/annotations/models/annotations.model';

export const ANNOTATIONS_ENDPOINTS = {
  LIST: '/api/v1/annotations',
  CREATE: '/api/v1/annotations',
  UPDATE: '/api/v1/annotations',
} as const;

export const ANNOTATION_TAG_OPTIONS: readonly AnnotationTagOption[] = [
  {
    value: 'hallucination',
    label: 'Hallucination',
    description: 'Model generated false or unverifiable facts',
  },
  {
    value: 'factual_error',
    label: 'Factual Error',
    description: 'Output directly contradicts provided reference data',
  },
  {
    value: 'toxicity',
    label: 'Toxicity',
    description: 'Output contains inappropriate or offensive content',
  },
  {
    value: 'context_truncation',
    label: 'Context Truncated',
    description: 'Important prompt context was cut off before generation',
  },
  {
    value: 'bad_formatting',
    label: 'Bad Formatting',
    description: 'Output violates expected markdown or visual formatting',
  },
  {
    value: 'bad_json',
    label: 'Malformed JSON',
    description: 'Generated structured data failed JSON parsing or schema validation',
  },
  {
    value: 'latency_spike',
    label: 'Latency Spike',
    description: 'Completion took unacceptably long to stream or finish',
  },
  {
    value: 'prompt_leak',
    label: 'Prompt Leakage',
    description: 'System instructions or hidden guardrails were leaked in completion',
  },
  {
    value: 'incomplete_response',
    label: 'Incomplete Output',
    description: 'Generation abruptly stopped mid-sentence or mid-token',
  },
] as const;

export const ANNOTATIONS_TEXT = {
  DRAWER_TITLE: 'Human Feedback & Annotation',
  DRAWER_SUBTITLE: 'Assign ground-truth review to this LLM execution span for evaluation datasets.',
  RATING_LABEL: 'Output Quality Rating',
  RATING_POSITIVE: 'Positive (Accurate & Useful)',
  RATING_NEUTRAL: 'Neutral (Minor Flaws)',
  RATING_NEGATIVE: 'Negative (Unusable / Error)',
  TAGS_LABEL: 'Failure Mode Classification',
  TAGS_HELP: 'Select all tags that describe the defects in this generation.',
  GROUND_TRUTH_LABEL: 'Ground-Truth Correction (Target Completion)',
  GROUND_TRUTH_PLACEHOLDER: 'Provide the ideal, human-verified completion text that the LLM should have produced...',
  REVIEWER_LABEL: 'Reviewer ID / Team',
  COMMENT_LABEL: 'Review Notes & Rationale',
  COMMENT_PLACEHOLDER: 'Explain why this generation passed or failed domain criteria...',
  SUBMIT_BUTTON: 'Save Annotation',
  SUBMITTING_BUTTON: 'Saving Feedback...',
  CANCEL_BUTTON: 'Discard',
  SUCCESS_TOAST: 'Annotation recorded successfully',
  EMPTY_TITLE: 'No Annotations Recorded',
  EMPTY_DESCRIPTION: 'This trace has not been reviewed yet. Annotations create gold-standard evaluation datasets.',
  ERROR_TITLE: 'Failed to Save Annotation',
  ERROR_RETRY: 'Retry Submission',
} as const;
