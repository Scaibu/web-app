import { CacheDashboardUI } from '@/features/cache';

export const metadata = {
  title: 'Semantic Cache & Acceleration | LLM Observability',
  description: 'Vector-similarity semantic cache analytics and inference latency optimization.',
};

export default function CachePage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <CacheDashboardUI />
    </div>
  );
}
