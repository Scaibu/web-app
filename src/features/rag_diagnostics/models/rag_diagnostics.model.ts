/**
 * Domain Models for RAG Context & Semantic Diagnostics.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export interface RetrievedChunk {
  id: string;
  document_title: string;
  chunk_index: number;
  similarity_score: number;
  token_count: number;
  text_content: string;
  is_relevant: boolean;
}

export interface RAGDiagnosticsTrace {
  id: string;
  query: string;
  collection_name: string;
  top_k: number;
  vector_distance_metric: 'cosine' | 'dot' | 'euclidean';
  chunks: RetrievedChunk[];
  total_context_tokens: number;
  context_window_limit: number;
  retrieval_latency_ms: number;
  generation_latency_ms: number;
}
