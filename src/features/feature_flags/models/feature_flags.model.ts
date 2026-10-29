/**
 * Domain Models for Feature Flag Management.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export interface FeatureFlagRule {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rollout_percentage: number;
  targeting_rules_count: number;
  environment: 'production' | 'staging' | 'development';
  created_at: string;
}
