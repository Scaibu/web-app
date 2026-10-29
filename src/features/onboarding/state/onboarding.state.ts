/**
 * State store for Onboarding Wizard.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type { FrameworkTarget, OnboardingStatePayload } from '../models/onboarding.model';

export type OnboardingListener = () => void;

class OnboardingState {
  private static instance: OnboardingState | null = null;
  private listeners: Set<OnboardingListener> = new Set();

  private state: OnboardingStatePayload = {
    selectedFramework: 'python_sdk',
    apiKey: 'obs_live_9481a8b27c109d',
    endpointUrl: 'https://llm-obs-web-app-9664.web.app',
    isListening: true,
    firstTraceReceived: false,
    receivedTraceId: null,
  };

  private constructor() {}

  public static getInstance(): OnboardingState {
    if (!OnboardingState.instance) {
      OnboardingState.instance = new OnboardingState();
    }
    return OnboardingState.instance;
  }

  public getSnapshot(): OnboardingStatePayload {
    return this.state;
  }

  public subscribe(listener: OnboardingListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public selectFramework(framework: FrameworkTarget): void {
    this.state = { ...this.state, selectedFramework: framework };
    this.notify();
  }

  public triggerMockTraceEvent(): void {
    this.state = {
      ...this.state,
      isListening: false,
      firstTraceReceived: true,
      receivedTraceId: 'trc_live_' + Math.random().toString(36).substring(2, 9),
    };
    this.notify();
  }

  public resetListener(): void {
    this.state = {
      ...this.state,
      isListening: true,
      firstTraceReceived: false,
      receivedTraceId: null,
    };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const onboardingState = OnboardingState.getInstance();
