/**
 * Adapter and Mock Data for Semantic Cache.
 * Strictly adheres to Part III (Frontend Feature Structure: Adapter Role).
 */

import type { CacheEntry, CacheMetrics } from '../models/cache.model';

export const INITIAL_CACHE_METRICS: CacheMetrics = {
  totalRequests: 184200,
  cacheHits: 72410,
  cacheMisses: 111790,
  hitRatePercent: 39.31,
  totalCostSavedUsd: 1428.50,
  totalTokensSaved: 84920000,
  avgHitLatencyMs: 14,
  avgMissLatencyMs: 820,
  similarityThreshold: 0.88,
};

export const INITIAL_CACHE_ENTRIES: CacheEntry[] = [
  {
    id: 'cache-ent-901',
    queryHash: 'sha256_88b192ca',
    inputText: 'What is our refund policy for enterprise annual contracts cancelled after 30 days?',
    cachedResponse: 'Enterprise annual contracts are subject to Section 8.2 of the Master Services Agreement: cancellations after 30 days are eligible for a pro-rated credit towards future renewals, minus a 10% administrative processing fee.',
    similarityScore: 0.94,
    embeddingModel: 'text-embedding-3-small',
    hitCount: 412,
    tokensSaved: 198000,
    costSavedUsd: 21.40,
    lastHitAt: '2026-10-29T18:02:11Z',
    status: 'active',
  },
  {
    id: 'cache-ent-902',
    queryHash: 'sha256_31a980fc',
    inputText: 'Summarize standard password complexity requirements for customer IAM.',
    cachedResponse: 'Passwords must contain minimum 14 characters including at least 1 uppercase letter, 1 lowercase letter, 1 numeric digit, and 1 approved symbol ($%#@). Password history prevents reuse of the last 12 entries.',
    similarityScore: 0.91,
    embeddingModel: 'text-embedding-3-small',
    hitCount: 890,
    tokensSaved: 420000,
    costSavedUsd: 46.20,
    lastHitAt: '2026-10-29T17:55:00Z',
    status: 'active',
  },
  {
    id: 'cache-ent-903',
    queryHash: 'sha256_10cb991e',
    inputText: 'Generate Postgres SQL schema migration adding indexes to support_tickets table.',
    cachedResponse: 'CREATE INDEX CONCURRENTLY idx_support_tickets_tenant_status ON support_tickets (tenant_id, status, created_at DESC);',
    similarityScore: 0.89,
    embeddingModel: 'text-embedding-3-small',
    hitCount: 145,
    tokensSaved: 88000,
    costSavedUsd: 11.50,
    lastHitAt: '2026-10-29T16:11:42Z',
    status: 'active',
  },
];
