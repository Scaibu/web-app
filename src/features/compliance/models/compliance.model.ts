/**
 * Domain Models for Admin Compliance & Data Residency.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export interface CompliancePolicyRule {
  id: string;
  name: string;
  standard: 'HIPAA' | 'GDPR' | 'SOC2_TYPE_II' | 'EU_AI_ACT';
  enforcement_scope: string;
  data_residency_region: string;
  zero_retention_logging: boolean;
  pii_masking_status: 'enforced' | 'partial' | 'disabled';
  last_cryptographic_audit: string;
  compliance_score_pct: number;
}
