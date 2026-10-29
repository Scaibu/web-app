/**
 * Controller for Policy Enforcement & Guardrail Violations.
 * Adheres strictly to Part III (Frontend Feature Structure: Controller Role).
 */

import {
  policiesStateInstance,
  PoliciesState,
} from '../state/policies.state';
import {
  policiesAdapter,
  type PoliciesAdapterPort,
} from '../adapter/policies.adapter';
import type {
  PolicyViolation,
  ViolationSeverity,
  GuardrailType,
} from '../models/policies.model';

export class PoliciesController {
  constructor(
    private readonly state: PoliciesState = policiesStateInstance,
    private readonly adapter: PoliciesAdapterPort = policiesAdapter
  ) {}

  async loadViolations(): Promise<void> {
    this.state.setLoading(true);
    try {
      const { violations, stats } = await this.adapter.listViolations();
      this.state.setViolations(violations, stats);
      if (violations.length > 0 && !this.state.getSnapshot().selectedViolation) {
        this.state.selectViolation(violations[0]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load policy violations';
      this.state.setError(msg);
    } finally {
      this.state.setLoading(false);
    }
  }

  selectViolation(violation: PolicyViolation | null): void {
    this.state.selectViolation(violation);
  }

  setSeverityFilter(severity: ViolationSeverity | 'all'): void {
    this.state.setSeverityFilter(severity);
  }

  setTypeFilter(type: GuardrailType | 'all'): void {
    this.state.setTypeFilter(type);
  }

  async triageViolation(id: string, status: PolicyViolation['status']): Promise<void> {
    this.state.updateViolationStatus(id, status);
    try {
      await this.adapter.updateStatus(id, status);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update violation status';
      this.state.setError(msg);
    }
  }
}

export const policiesController = new PoliciesController();
