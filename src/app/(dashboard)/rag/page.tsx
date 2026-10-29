import { Metadata } from 'next';
import { RAGDiagnosticsUI } from '@/features/rag_diagnostics';

export const metadata: Metadata = {
  title: 'RAG Context & Chunk Diagnostics | LLM Observability',
  description: 'Inspect vector distance, chunk relevance scores, and token window utilization across RAG pipelines.',
};

export default function RAGPage() {
  return <RAGDiagnosticsUI />;
}
