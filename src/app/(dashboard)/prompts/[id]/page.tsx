import { Metadata } from 'next';
import { PromptsDetailUI } from '@/features/prompts/ui/PromptsDetailUI';

export const metadata: Metadata = {
  title: 'Prompt Template Details | LLM Observability',
  description: 'Detailed inspection of prompt template, version drift, parameter configurations, and historical telemetry.',
};

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <PromptsDetailUI promptId={resolvedParams.id} />;
}
