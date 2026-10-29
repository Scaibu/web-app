/**
 * Semantic Cache Analytics Models.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export interface CacheEntry {
  id: string;
  queryHash: string;
  inputText: string;
  cachedResponse: string;
  similarityScore: number; // 0.0 - 1.0
  embeddingModel: string;
  hitCount: number;
  tokensSaved: number;
  costSavedUsd: number;
  lastHitAt: string;
  status: 'active' | 'invalidated' | 'expired';
}

export interface CacheMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRatePercent: number;
  totalCostSavedUsd: number;
  totalTokensSaved: number;
  avgHitLatencyMs: number;
  avgMissLatencyMs: number;
  similarityThreshold: number;
}
