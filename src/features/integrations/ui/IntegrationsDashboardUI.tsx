'use client';

/**
 * Enterprise Alert Sinks & Integrations Console UI.
 * Adheres strictly to good-ui.md (tokens, visual hierarchy, no arbitrary Tailwind brackets).
 */

import React, { useSyncExternalStore } from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Radio, 
  ShieldAlert, 
  Activity,
  Layers,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { integrationsState } from '../state/integrations.state';
import { integrationsController } from '../controller/integrations.controller';

export const IntegrationsDashboardUI: React.FC = () => {
  const state = useSyncExternalStore(
    (callback) => integrationsState.subscribe(callback),
    () => integrationsState.getSnapshot(),
    () => integrationsState.getSnapshot()
  );

  const selectedSink = state.sinks.find((s) => s.id === state.selectedSinkId) || state.sinks[0];

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-500/15 text-rose-500 border border-rose-500/30">CRITICAL</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/15 text-blue-500 border border-blue-500/30">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-muted text-muted-foreground">INFO</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Notification Sinks
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-500" /> Active Tripwire Dispatchers
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Alert Sinks & Incident Webhooks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Route high-priority guardrail breaches, budget kill-switches, and latency degradation to Slack, PagerDuty, and SIEM webhooks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => selectedSink && integrationsController.dispatchTestWebhook(selectedSink.id)}
            className="px-4 py-2 text-xs font-medium border border-border/50 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" /> Dispatch Test Event
          </button>
          <button 
            className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Connect Sink
          </button>
        </div>
      </div>

      {/* Main Grid: Sinks Catalog & Forensic Delivery Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sinks Catalog (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" /> Configured Sinks ({state.sinks.length})
            </h2>
            <span className="text-xs text-muted-foreground">
              {state.sinks.filter((s) => s.enabled).length} Enabled
            </span>
          </div>

          <div className="space-y-3">
            {state.sinks.map((sink) => {
              const isSelected = selectedSink?.id === sink.id;
              return (
                <div
                  key={sink.id}
                  onClick={() => integrationsController.selectActiveSink(sink.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                      : 'border-border/40 hover:border-border hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-card border border-border/40 flex items-center justify-center font-bold text-xs">
                        {sink.type === 'slack' ? '💬' : sink.type === 'pagerduty' ? '📟' : '🔌'}
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-foreground">{sink.name}</h3>
                        <p className="text-[11px] font-mono text-muted-foreground truncate max-w-[200px]">
                          {sink.targetEndpoint}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        integrationsController.toggleSinkStatus(sink.id);
                      }}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        sink.enabled ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          sink.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/30 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>{sink.deliverySuccessRate}% Delivered</span>
                    </div>
                    <div>
                      Min: {getSeverityBadge(sink.minSeverity)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sink Detail & Forensic Dispatch Logs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedSink && (
            <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">{selectedSink.name}</h3>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-primary/10 text-primary">
                      {selectedSink.type}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-1 truncate max-w-md">
                    {selectedSink.targetEndpoint}
                  </p>
                </div>
                <button
                  onClick={() => integrationsController.dispatchTestWebhook(selectedSink.id)}
                  className="px-3 py-1.5 text-xs font-medium border border-border/50 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3 w-3" /> Test Webhook
                </button>
              </div>

              {/* Subscribed Event Tripwires */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">Subscribed Event Tripwires:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSink.subscribedEvents.map((evt) => (
                    <span
                      key={evt}
                      className="px-2.5 py-1 text-xs font-mono rounded-md bg-muted/60 text-foreground border border-border/40"
                    >
                      {evt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Forensic Delivery History */}
              <div className="pt-4 border-t border-border/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-primary" /> Recent Event Dispatches
                  </h4>
                  <span className="text-[11px] text-muted-foreground">Audit Log Stream</span>
                </div>

                <div className="space-y-2.5">
                  {state.recentLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-muted/20 border border-border/40 rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(log.severity)}
                          <span className="text-xs font-mono font-semibold text-foreground">{log.event}</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-500 font-semibold">
                          HTTP {log.httpStatus} OK
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {log.payloadSummary}
                      </p>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Dispatched: {log.dispatchedAt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
