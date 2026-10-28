import type { TracesFilterModel } from "../models/traces.model";
import { tracesAdapter, type TracesAdapterPort } from "../adapter/traces.adapter";
import { tracesStateInstance, TracesState } from "../state/traces.state";

export class TracesController {
  constructor(
    private readonly state: TracesState = tracesStateInstance,
    private readonly adapter: TracesAdapterPort = tracesAdapter
  ) {}

  async loadTraces(filter: TracesFilterModel = {}): Promise<void> {
    this.state.setLoading(true);
    try {
      const traces = await this.adapter.listTraces(filter);
      this.state.setTraces(traces);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load traces";
      this.state.setError(msg);
    }
  }

  async selectTrace(traceId: string): Promise<void> {
    this.state.setLoading(true);
    try {
      const trace = await this.adapter.getTraceDetail(traceId);
      this.state.setSelectedTrace(trace);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load trace detail";
      this.state.setError(msg);
    } finally {
      this.state.setLoading(false);
    }
  }

  clearSelectedTrace(): void {
    this.state.setSelectedTrace(null);
  }
}

export const tracesController = new TracesController();
