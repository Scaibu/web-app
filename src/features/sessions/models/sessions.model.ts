/**
 * Domain Models for Multi-Turn Session Conversation Viewer.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export interface ConversationTurn {
  turn_number: number;
  user_input: string;
  model_response: string;
  tokens_input: number;
  tokens_output: number;
  cumulative_context_tokens: number;
  latency_ms: number;
  sentiment_score: number;
  timestamp: string;
}

export interface ConversationSession {
  id: string;
  user_id: string;
  tenant_id: string;
  service: string;
  model: string;
  started_at: string;
  total_turns: number;
  total_duration_ms: number;
  total_cost_usd: number;
  context_compounding_rate: string;
  turns: ConversationTurn[];
}
