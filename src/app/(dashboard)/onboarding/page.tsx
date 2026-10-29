import { OnboardingWizardUI } from '@/features/onboarding';

export const metadata = {
  title: 'SDK Integration & Setup | LLM Observability',
  description: 'Quickstart integration guides for Python, Node.js, LangChain, and LlamaIndex.',
};

export default function OnboardingPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <OnboardingWizardUI />
    </div>
  );
}
