import { DatasetDetailUI } from '@/features/datasets';

interface DatasetPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DatasetPageProps) {
  const resolved = await params;
  return {
    title: `Dataset ${resolved.id} | LLM Observability`,
    description: `Inspect curated exemplars and fine-tuning pairs for ${resolved.id}.`,
  };
}

export default async function DatasetForensicPage({ params }: DatasetPageProps) {
  const resolved = await params;
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <DatasetDetailUI datasetId={resolved.id} />
    </div>
  );
}
