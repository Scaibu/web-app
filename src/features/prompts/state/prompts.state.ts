/**
 * Central State Container for Prompts feature.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type { PromptRegistryItem } from '../models/prompts.model';
import { DUMMY_PROMPTS_DATA } from '../adapter/prompts.adapter';

export interface PromptsStateData {
  items: PromptRegistryItem[];
  selectedPrompt: PromptRegistryItem | null;
  searchQuery: string;
  serviceFilter: string | null;
}

export class PromptsState {
  private data: PromptsStateData;
  private listeners: Set<(state: PromptsStateData) => void> = new Set();

  constructor() {
    this.data = {
      items: DUMMY_PROMPTS_DATA,
      selectedPrompt: DUMMY_PROMPTS_DATA[0] ?? null,
      searchQuery: '',
      serviceFilter: null,
    };
  }

  getSnapshot(): PromptsStateData {
    return this.data;
  }

  subscribe(listener: (state: PromptsStateData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  selectPrompt(prompt: PromptRegistryItem | null): void {
    this.data = { ...this.data, selectedPrompt: prompt };
    this.notify();
  }

  setSearchQuery(query: string): void {
    this.data = { ...this.data, searchQuery: query };
    this.notify();
  }

  setServiceFilter(service: string | null): void {
    this.data = { ...this.data, serviceFilter: service };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const promptsStateInstance = new PromptsState();
