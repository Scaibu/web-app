/**
 * Outbound Adapter & Realistic Dummy Registry Data for Prompts Catalog.
 * Adheres strictly to Part III (Frontend Feature Structure: Adapter Role).
 */

import type { PromptRegistryItem } from '../models/prompts.model';

export const DUMMY_PROMPTS_DATA: PromptRegistryItem[] = [
  {
    id: 'pr-sec-analyst',
    name: 'SEC Filing Financial Analyst',
    slug: 'sec-filing-analyst',
    description: 'Extracts GAAP financial ratios, operating margin deltas, and segment revenue breakdowns from 10-K & 10-Q filings.',
    service: 'rag-service',
    model: 'claude-3-5-sonnet',
    active_version: 'v2.4.0',
    total_invocations_24h: 18420,
    status: 'production',
    versions: [
      {
        version: 'v2.4.0',
        system_instructions: 'You are an institutional financial analyst. Output markdown tables and ISO 8601 timestamps.',
        template_text: 'Analyze the following quarterly filing excerpts for {{ticker}}:\n{{context}}\nProvide net profit margins and YoY variance.',
        token_usage_p95: 3410,
        avg_latency_ms: 540,
        avg_cost_usd: 0.024,
        deployed_at: '2026-10-24T09:30:00Z',
        is_active: true,
      },
      {
        version: 'v2.3.1',
        system_instructions: 'You are a financial assistant. Summarize earnings reports.',
        template_text: 'Read context: {{context}}\nTell me revenue for {{ticker}}.',
        token_usage_p95: 4120,
        avg_latency_ms: 790,
        avg_cost_usd: 0.038,
        deployed_at: '2026-09-12T14:15:00Z',
        is_active: false,
      },
    ],
  },
  {
    id: 'pr-support-router',
    name: 'Customer Intent & Triage Classifier',
    slug: 'support-intent-triage',
    description: 'Zero-shot classification routing customer support tickets to billing, security, or enterprise engineering escalations.',
    service: 'copilot-agent',
    model: 'gpt-4o',
    active_version: 'v1.8.2',
    total_invocations_24h: 94100,
    status: 'production',
    versions: [
      {
        version: 'v1.8.2',
        system_instructions: 'Classify user inquiry into strict JSON schema: { category: string, urgency: 1-5, pii_flag: boolean }.',
        template_text: 'Inquiry: {{user_ticket}}\nCustomer Tier: {{account_tier}}',
        token_usage_p95: 580,
        avg_latency_ms: 195,
        avg_cost_usd: 0.0035,
        deployed_at: '2026-10-18T11:00:00Z',
        is_active: true,
      },
    ],
  },
  {
    id: 'pr-code-reviewer',
    name: 'Zero-Clone PR Diff Auditor',
    slug: 'pr-diff-auditor',
    description: 'Inspects AST git diffs against architectural rules and security tripwires before merging to main.',
    service: 'policy-orchestrator',
    model: 'gpt-4o',
    active_version: 'v3.1.0-rc2',
    total_invocations_24h: 3120,
    status: 'staging',
    versions: [
      {
        version: 'v3.1.0-rc2',
        system_instructions: 'Strictly enforce Hexagonal Architecture and State-Controller-Model Triads. Flag any arbitrary tokens.',
        template_text: 'Review the following diff:\n{{git_diff}}\nCheck against rules:\n{{rule_files}}',
        token_usage_p95: 6420,
        avg_latency_ms: 1120,
        avg_cost_usd: 0.048,
        deployed_at: '2026-10-28T16:45:00Z',
        is_active: true,
      },
    ],
  },
];
