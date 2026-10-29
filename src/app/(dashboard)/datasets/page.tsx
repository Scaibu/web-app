import { DatasetsDashboardUI } from '@/features/datasets';

export const metadata = {
  title: 'Golden Datasets & Fine-Tuning | LLM Observability',
  description: 'Curate verified 5-star production traces into gold fine-tuning datasets.',
};

export default function DatasetsPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <DatasetsDashboardUI />
    </div>
  );
}
