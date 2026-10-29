/**
 * Controller for Semantic Cache Analytics.
 * Strictly adheres to Part III (Frontend Feature Structure: Controller Role).
 */

import { cacheState } from '../state/cache.state';

export class CacheController {
  private static instance: CacheController | null = null;

  private constructor() {}

  public static getInstance(): CacheController {
    if (!CacheController.instance) {
      CacheController.instance = new CacheController();
    }
    return CacheController.instance;
  }

  public selectActiveEntry(id: string | null): void {
    cacheState.selectEntry(id);
  }

  public setFilter(query: string): void {
    cacheState.setSearchFilter(query);
  }

  public updateThreshold(threshold: number): void {
    cacheState.setSimilarityThreshold(threshold);
  }

  public purgeCacheEntry(id: string): void {
    cacheState.invalidateEntry(id);
  }
}

export const cacheController = CacheController.getInstance();
