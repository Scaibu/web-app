/**
 * Domain Models for Prompts Catalog and Version Registry.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export interface PromptTemplateVersion {
  version: string;
  template_text: string;
  system_instructions: string;
  token_usage_p95: number;
  avg_latency_ms: number;
  avg_cost_usd: number;
  deployed_at: string;
  is_active: boolean;
}

export interface PromptRegistryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  service: string;
  model: string;
  active_version: string;
  versions: PromptTemplateVersion[];
  total_invocations_24h: number;
  status: 'production' | 'staging' | 'deprecated';
}
