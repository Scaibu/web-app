/**
 * State store for Golden Datasets.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type { GoldenDataset, DatasetItem } from '../models/datasets.model';
import { INITIAL_DATASETS } from '../adapter/datasets.adapter';

export interface DatasetsStatePayload {
  datasets: GoldenDataset[];
  selectedDatasetId: string | null;
  searchQuery: string;
}

export type DatasetsListener = () => void;

class DatasetsState {
  private static instance: DatasetsState | null = null;
  private listeners: Set<DatasetsListener> = new Set();

  private state: DatasetsStatePayload = {
    datasets: INITIAL_DATASETS,
    selectedDatasetId: INITIAL_DATASETS[0]?.id ?? null,
    searchQuery: '',
  };

  private constructor() {}

  public static getInstance(): DatasetsState {
    if (!DatasetsState.instance) {
      DatasetsState.instance = new DatasetsState();
    }
    return DatasetsState.instance;
  }

  public getSnapshot(): DatasetsStatePayload {
    return this.state;
  }

  public subscribe(listener: DatasetsListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public selectDataset(id: string | null): void {
    this.state = { ...this.state, selectedDatasetId: id };
    this.notify();
  }

  public setSearchQuery(query: string): void {
    this.state = { ...this.state, searchQuery: query };
    this.notify();
  }

  public addSampleItem(datasetId: string, item: DatasetItem): void {
    this.state = {
      ...this.state,
      datasets: this.state.datasets.map((ds) =>
        ds.id === datasetId
          ? {
              ...ds,
              itemCount: ds.itemCount + 1,
              items: [item, ...ds.items],
              lastUpdatedAt: new Date().toISOString(),
            }
          : ds
      ),
    };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const datasetsState = DatasetsState.getInstance();
