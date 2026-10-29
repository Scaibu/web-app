/**
 * Domain Models for Agentic Tool / Function Calling Visualizer.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export type ToolCallStatus = 'success' | 'failed' | 'timeout' | 'schema_violation' | 'loop_detected';

export interface AgentToolStep {
  step_number: number;
  tool_name: string;
  arguments_json: string;
  result_json?: string;
  error_message?: string;
  status: ToolCallStatus;
  latency_ms: number;
  tokens_consumed: number;
}

export interface AgentExecutionTrace {
  id: string;
  agent_name: string;
  agent_type: 'react' | 'plan_and_solve' | 'hierarchical' | 'custom_dag';
  root_objective: string;
  model: string;
  status: 'completed' | 'in_progress' | 'loop_failed' | 'interrupted';
  total_steps: number;
  total_duration_ms: number;
  total_cost_usd: number;
  steps: AgentToolStep[];
  loop_detected: boolean;
  started_at: string;
}
