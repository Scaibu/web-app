import { Metadata } from 'next';
import { SessionsDashboardUI } from '@/features/sessions';

export const metadata: Metadata = {
  title: 'Multi-Turn Conversation Sessions | LLM Observability',
  description: 'Inspect user chat threads, compounding context growth per turn, and token footprints.',
};

export default function SessionsPage() {
  return <SessionsDashboardUI />;
}
