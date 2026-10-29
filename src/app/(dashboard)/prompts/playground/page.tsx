import { Metadata } from 'next';
import { PlaygroundUI } from '@/features/playground';

export const metadata: Metadata = {
  title: 'Prompt Playground & Side-by-Side Diffing | LLM Observability',
  description: 'Replay live traces, adjust parameters, and compare completions side-by-side with latency and token cost diffs.',
};

export default function PlaygroundPage() {
  return <PlaygroundUI />;
}
