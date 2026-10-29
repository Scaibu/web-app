import { Metadata } from 'next';
import { RAGTraceDetailUI } from '@/features/rag_diagnostics';

export const metadata: Metadata = {
  title: 'RAG Retrieval Telemetry Details | LLM Observability',
  description: 'Forensic inspection of vector distance, retrieved chunks, and token utilization.',
};

export default async function RAGDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <RAGTraceDetailUI traceId={resolvedParams.id} />;
}
