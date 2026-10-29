/**
 * Outbound Adapter & Realistic Telemetry Data for Agentic Tool Executions.
 * Adheres strictly to Part III (Frontend Feature Structure: Adapter Role).
 */

import type { AgentExecutionTrace } from '../models/agents.model';

export const DUMMY_AGENT_TRACES: AgentExecutionTrace[] = [
  {
    id: 'ag-exec-101',
    agent_name: 'Autonomous Git Policy Enforcer',
    agent_type: 'react',
    root_objective: 'Inspect PR #492 diff against Hexagonal Architecture rules and post summary audit comment.',
    model: 'gpt-4o',
    status: 'completed',
    total_steps: 4,
    total_duration_ms: 1840,
    total_cost_usd: 0.042,
    loop_detected: false,
    started_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    steps: [
      {
        step_number: 1,
        tool_name: 'github_fetch_pr_diff',
        arguments_json: '{\n  "repo": "llm-obs-node-packages",\n  "pr_number": 492\n}',
        result_json: '{\n  "files_changed": 4,\n  "additions": 142,\n  "deletions": 18\n}',
        status: 'success',
        latency_ms: 220,
        tokens_consumed: 410,
      },
      {
        step_number: 2,
        tool_name: 'parse_ast_dependencies',
        arguments_json: '{\n  "target_file": "src/features/git_remote_mutator/service/mutator.service.py"\n}',
        result_json: '{\n  "illegal_imports": [],\n  "hexagonal_boundary_valid": true\n}',
        status: 'success',
        latency_ms: 310,
        tokens_consumed: 680,
      },
      {
        step_number: 3,
        tool_name: 'evaluate_policy_rules',
        arguments_json: '{\n  "rule_scope": "feature_triad",\n  "ast_tree_hash": "c841e2a"\n}',
        result_json: '{\n  "passed_rules": 14,\n  "violations": 0\n}',
        status: 'success',
        latency_ms: 450,
        tokens_consumed: 820,
      },
      {
        step_number: 4,
        tool_name: 'github_post_pr_comment',
        arguments_json: '{\n  "pr_number": 492,\n  "body": "✅ Automated AST Policy Review passed with 0 violations."\n}',
        result_json: '{\n  "comment_id": 98412,\n  "status": "created"\n}',
        status: 'success',
        latency_ms: 860,
        tokens_consumed: 320,
      },
    ],
  },
  {
    id: 'ag-exec-102',
    agent_name: 'Recursive Financial Web Scraper Agent',
    agent_type: 'plan_and_solve',
    root_objective: 'Traverse Edgar filings and scrape 10-K tables for 12 corporate peers.',
    model: 'gpt-4o',
    status: 'loop_failed',
    total_steps: 6,
    total_duration_ms: 4820,
    total_cost_usd: 0.115,
    loop_detected: true,
    started_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    steps: [
      {
        step_number: 1,
        tool_name: 'edgar_search_sec_filings',
        arguments_json: '{\n  "query": "NVDA 2026 Q3 10-K",\n  "limit": 1\n}',
        result_json: '{\n  "accession_no": "0001045810-26-000041"\n}',
        status: 'success',
        latency_ms: 380,
        tokens_consumed: 540,
      },
      {
        step_number: 2,
        tool_name: 'download_edgar_html',
        arguments_json: '{\n  "url": "https://sec.gov/edgar/NVDA-10k.htm"\n}',
        result_json: '{\n  "http_status": 403,\n  "body": "Blocked by rate-limit"\n}',
        status: 'failed',
        error_message: 'HTTP 403 Forbidden: SEC rate limiter activated',
        latency_ms: 190,
        tokens_consumed: 180,
      },
      {
        step_number: 3,
        tool_name: 'download_edgar_html',
        arguments_json: '{\n  "url": "https://sec.gov/edgar/NVDA-10k.htm"\n}',
        status: 'loop_detected',
        error_message: 'Infinite tool execution loop detected: Repeated failed call without backoff parameter mutation.',
        latency_ms: 180,
        tokens_consumed: 180,
      },
    ],
  },
];

export interface AgentsAdapterPort {
  listAgentTraces(): Promise<AgentExecutionTrace[]>;
}

export class AgentsMockAdapter implements AgentsAdapterPort {
  async listAgentTraces(): Promise<AgentExecutionTrace[]> {
    return [...DUMMY_AGENT_TRACES];
  }
}

export const agentsAdapter = new AgentsMockAdapter();
