/**
 * Central State Container for Agentic Tool Call Visualizer.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type { AgentExecutionTrace, AgentToolStep } from '../models/agents.model';
import { DUMMY_AGENT_TRACES } from '../adapter/agents.adapter';

export interface AgentsStateData {
  traces: AgentExecutionTrace[];
  selectedTrace: AgentExecutionTrace | null;
  selectedStep: AgentToolStep | null;
  statusFilter: string;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class AgentsState {
  private data: AgentsStateData;
  private listeners: Set<(state: AgentsStateData) => void> = new Set();

  constructor() {
    this.data = {
      traces: DUMMY_AGENT_TRACES,
      selectedTrace: DUMMY_AGENT_TRACES[0] ?? null,
      selectedStep: DUMMY_AGENT_TRACES[0]?.steps[0] ?? null,
      statusFilter: 'all',
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
  }

  getSnapshot(): AgentsStateData {
    return this.data;
  }

  subscribe(listener: (state: AgentsStateData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setTraces(traces: AgentExecutionTrace[]): void {
    this.data = {
      ...this.data,
      traces,
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
    this.notify();
  }

  selectTrace(trace: AgentExecutionTrace | null): void {
    this.data = {
      ...this.data,
      selectedTrace: trace,
      selectedStep: trace?.steps[0] ?? null,
    };
    this.notify();
  }

  selectStep(step: AgentToolStep | null): void {
    this.data = { ...this.data, selectedStep: step };
    this.notify();
  }

  setStatusFilter(filter: string): void {
    this.data = { ...this.data, statusFilter: filter };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const agentsStateInstance = new AgentsState();
