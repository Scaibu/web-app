/**
 * State store for Integrations and Alert Sinks.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type { AlertSink, DispatchedAlertLog } from '../models/integrations.model';
import { INITIAL_SINKS, INITIAL_ALERT_LOGS } from '../adapter/integrations.adapter';

export interface IntegrationsStatePayload {
  sinks: AlertSink[];
  recentLogs: DispatchedAlertLog[];
  selectedSinkId: string | null;
  filterType: string;
}

export type IntegrationsListener = () => void;

class IntegrationsState {
  private static instance: IntegrationsState | null = null;
  private listeners: Set<IntegrationsListener> = new Set();

  private state: IntegrationsStatePayload = {
    sinks: INITIAL_SINKS,
    recentLogs: INITIAL_ALERT_LOGS,
    selectedSinkId: INITIAL_SINKS[0]?.id ?? null,
    filterType: 'all',
  };

  private constructor() {}

  public static getInstance(): IntegrationsState {
    if (!IntegrationsState.instance) {
      IntegrationsState.instance = new IntegrationsState();
    }
    return IntegrationsState.instance;
  }

  public getSnapshot(): IntegrationsStatePayload {
    return this.state;
  }

  public subscribe(listener: IntegrationsListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public toggleSink(id: string): void {
    this.state = {
      ...this.state,
      sinks: this.state.sinks.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    };
    this.notify();
  }

  public selectSink(id: string | null): void {
    this.state = { ...this.state, selectedSinkId: id };
    this.notify();
  }

  public setFilterType(filterType: string): void {
    this.state = { ...this.state, filterType };
    this.notify();
  }

  public sendTestPing(sinkId: string): void {
    const sink = this.state.sinks.find((s) => s.id === sinkId);
    if (!sink) return;

    const newLog: DispatchedAlertLog = {
      id: `log-${Date.now()}`,
      sinkId: sink.id,
      sinkName: sink.name,
      event: 'test.manual_ping',
      severity: 'info',
      dispatchedAt: new Date().toISOString(),
      httpStatus: 200,
      payloadSummary: 'Manual connectivity probe verified payload receipt and signature.',
    };

    this.state = {
      ...this.state,
      recentLogs: [newLog, ...this.state.recentLogs],
    };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const integrationsState = IntegrationsState.getInstance();
