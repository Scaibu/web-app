/**
 * Outbound Adapter & Realistic Telemetry Data for Multi-Turn Sessions.
 * Adheres strictly to Part III (Frontend Feature Structure: Adapter Role).
 */

import type { ConversationSession } from '../models/sessions.model';

export const DUMMY_SESSIONS_DATA: ConversationSession[] = [
  {
    id: 'sess-8491-enterprise',
    user_id: 'usr_cfo_enterprise',
    tenant_id: 'acme-corp',
    service: 'copilot-agent',
    model: 'claude-3-5-sonnet',
    started_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    total_turns: 3,
    total_duration_ms: 2450,
    total_cost_usd: 0.054,
    context_compounding_rate: '+180% per turn',
    turns: [
      {
        turn_number: 1,
        user_input: 'Can you show me total revenue in Q3?',
        model_response: 'Consolidated revenue for Q3 2026 was $48.2 million, a 14.2% YoY increase.',
        tokens_input: 120,
        tokens_output: 65,
        cumulative_context_tokens: 185,
        latency_ms: 320,
        sentiment_score: 0.85,
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      },
      {
        turn_number: 2,
        user_input: 'Break that down by operating segment.',
        model_response: 'Sure. Core Platform was $37.6M (+12%) and Enterprise Add-ons were $10.6M (+23.1%).',
        tokens_input: 240,
        tokens_output: 110,
        cumulative_context_tokens: 535,
        latency_ms: 590,
        sentiment_score: 0.92,
        timestamp: new Date(Date.now() - 1000 * 60 * 33).toISOString(),
      },
      {
        turn_number: 3,
        user_input: 'Compare our gross margin to 2025 numbers.',
        model_response: 'Gross margin expanded 140 basis points to 68.2%, up from 66.8% in 2025.',
        tokens_input: 680,
        tokens_output: 95,
        cumulative_context_tokens: 1310,
        latency_ms: 720,
        sentiment_score: 0.88,
        timestamp: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
      },
    ],
  },
];

export interface SessionsAdapterPort {
  listSessions(): Promise<ConversationSession[]>;
}

export class SessionsMockAdapter implements SessionsAdapterPort {
  async listSessions(): Promise<ConversationSession[]> {
    return [...DUMMY_SESSIONS_DATA];
  }
}

export const sessionsAdapter = new SessionsMockAdapter();
