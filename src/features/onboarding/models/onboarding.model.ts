/**
 * Domain Models for SDK Onboarding & Integration Wizard.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export type FrameworkTarget = 'python_sdk' | 'nodejs_sdk' | 'langchain' | 'llamaindex' | 'openai_wrapper';

export interface FrameworkSetupGuide {
  id: FrameworkTarget;
  name: string;
  installCommand: string;
  snippetCode: string;
  envSnippet: string;
}

export interface OnboardingStatePayload {
  selectedFramework: FrameworkTarget;
  apiKey: string;
  endpointUrl: string;
  isListening: boolean;
  firstTraceReceived: boolean;
  receivedTraceId: string | null;
}
