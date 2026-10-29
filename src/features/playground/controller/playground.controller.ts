/**
 * Controller for Prompt Playground & Diffing.
 * Adheres strictly to Part III (Frontend Feature Structure: Controller Role).
 */

import {
  playgroundStateInstance,
  PlaygroundState,
} from '../state/playground.state';
import {
  playgroundAdapter,
  type PlaygroundAdapterPort,
} from '../adapter/playground.adapter';
import type { ModelParameters } from '../models/playground.model';

export class PlaygroundController {
  constructor(
    private readonly state: PlaygroundState = playgroundStateInstance,
    private readonly adapter: PlaygroundAdapterPort = playgroundAdapter
  ) {}

  updatePrompt(
    variantKey: 'variantA' | 'variantB',
    field: 'systemPrompt' | 'userPrompt' | 'model',
    value: string
  ): void {
    this.state.updatePrompt(variantKey, field, value);
  }

  updateParameters(
    variantKey: 'variantA' | 'variantB',
    params: Partial<ModelParameters>
  ): void {
    this.state.updateParameters(variantKey, params);
  }

  async runSideBySideTest(): Promise<void> {
    const snapshot = this.state.getSnapshot();
    this.state.setExecuting(true);

    try {
      const [resA, resB] = await Promise.all([
        this.adapter.executePrompt(snapshot.variantA),
        this.adapter.executePrompt(snapshot.variantB),
      ]);
      this.state.setResults(resA, resB);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Prompt execution failed';
      this.state.setError(msg);
    }
  }
}

export const playgroundController = new PlaygroundController();
