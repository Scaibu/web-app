/**
 * State store for Semantic Cache Analytics.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type { CacheEntry, CacheMetrics } from '../models/cache.model';
import { INITIAL_CACHE_ENTRIES, INITIAL_CACHE_METRICS } from '../adapter/cache.adapter';

export interface CacheStatePayload {
  metrics: CacheMetrics;
  entries: CacheEntry[];
  selectedEntryId: string | null;
  searchFilter: string;
}

export type CacheListener = () => void;

class CacheState {
  private static instance: CacheState | null = null;
  private listeners: Set<CacheListener> = new Set();

  private state: CacheStatePayload = {
    metrics: INITIAL_CACHE_METRICS,
    entries: INITIAL_CACHE_ENTRIES,
    selectedEntryId: INITIAL_CACHE_ENTRIES[0]?.id ?? null,
    searchFilter: '',
  };

  private constructor() {}

  public static getInstance(): CacheState {
    if (!CacheState.instance) {
      CacheState.instance = new CacheState();
    }
    return CacheState.instance;
  }

  public getSnapshot(): CacheStatePayload {
    return this.state;
  }

  public subscribe(listener: CacheListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public selectEntry(id: string | null): void {
    this.state = { ...this.state, selectedEntryId: id };
    this.notify();
  }

  public setSearchFilter(search: string): void {
    this.state = { ...this.state, searchFilter: search };
    this.notify();
  }

  public setSimilarityThreshold(threshold: number): void {
    this.state = {
      ...this.state,
      metrics: { ...this.state.metrics, similarityThreshold: threshold },
    };
    this.notify();
  }

  public invalidateEntry(id: string): void {
    this.state = {
      ...this.state,
      entries: this.state.entries.map((e) =>
        e.id === id ? { ...e, status: 'invalidated' as const } : e
      ),
    };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const cacheState = CacheState.getInstance();
