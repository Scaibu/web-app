/**
 * Outbound Adapter & Telemetry Data for Compliance Controls.
 * Adheres strictly to Part III (Frontend Feature Structure: Adapter Role).
 */

import type { CompliancePolicyRule } from '../models/compliance.model';

export const DUMMY_COMPLIANCE_RULES: CompliancePolicyRule[] = [
  {
    id: 'cmp-hipaa-phi',
    name: 'HIPAA Safe Harbor PHI Masker & De-identifier',
    standard: 'HIPAA',
    enforcement_scope: 'health-assistant-service',
    data_residency_region: 'AWS us-east-1 (BAA Verified)',
    zero_retention_logging: true,
    pii_masking_status: 'enforced',
    last_cryptographic_audit: '2026-10-28T14:00:00Z',
    compliance_score_pct: 100,
  },
  {
    id: 'cmp-gdpr-eu',
    name: 'EU Citizen Zero-Cloud Data Residency & GDPR',
    standard: 'GDPR',
    enforcement_scope: 'tenant:acme-eu-customers',
    data_residency_region: 'AWS eu-central-1 (Frankfurt)',
    zero_retention_logging: true,
    pii_masking_status: 'enforced',
    last_cryptographic_audit: '2026-10-26T18:30:00Z',
    compliance_score_pct: 98.4,
  },
  {
    id: 'cmp-eu-ai-act-high-risk',
    name: 'EU AI Act High-Risk Model Explainability Registry',
    standard: 'EU_AI_ACT',
    enforcement_scope: 'credit-scoring-llm',
    data_residency_region: 'Self-Hosted Sovereign Cluster (GCP europe-west3)',
    zero_retention_logging: false,
    pii_masking_status: 'enforced',
    last_cryptographic_audit: '2026-10-24T10:15:00Z',
    compliance_score_pct: 95.0,
  },
];

export interface ComplianceAdapterPort {
  listRules(): Promise<CompliancePolicyRule[]>;
}

export class ComplianceMockAdapter implements ComplianceAdapterPort {
  async listRules(): Promise<CompliancePolicyRule[]> {
    return [...DUMMY_COMPLIANCE_RULES];
  }
}

export const complianceAdapter = new ComplianceMockAdapter();
