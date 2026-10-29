/**
 * Controller for Golden Datasets.
 * Strictly adheres to Part III (Frontend Feature Structure: Controller Role).
 */

import { datasetsState } from '../state/datasets.state';
import type { DatasetItem } from '../models/datasets.model';

export class DatasetsController {
  private static instance: DatasetsController | null = null;

  private constructor() {}

  public static getInstance(): DatasetsController {
    if (!DatasetsController.instance) {
      DatasetsController.instance = new DatasetsController();
    }
    return DatasetsController.instance;
  }

  public selectActiveDataset(id: string | null): void {
    datasetsState.selectDataset(id);
  }

  public updateSearch(query: string): void {
    datasetsState.setSearchQuery(query);
  }

  public curateItemFromTrace(datasetId: string, item: DatasetItem): void {
    datasetsState.addSampleItem(datasetId, item);
  }
}

export const datasetsController = DatasetsController.getInstance();
