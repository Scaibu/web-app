/**
 * Controller for Onboarding Wizard.
 * Strictly adheres to Part III (Frontend Feature Structure: Controller Role).
 */

import type { FrameworkTarget } from '../models/onboarding.model';
import { onboardingState } from '../state/onboarding.state';

export class OnboardingController {
  private static instance: OnboardingController | null = null;

  private constructor() {}

  public static getInstance(): OnboardingController {
    if (!OnboardingController.instance) {
      OnboardingController.instance = new OnboardingController();
    }
    return OnboardingController.instance;
  }

  public setFramework(framework: FrameworkTarget): void {
    onboardingState.selectFramework(framework);
  }

  public simulateTraceArrival(): void {
    onboardingState.triggerMockTraceEvent();
  }

  public resetRadar(): void {
    onboardingState.resetListener();
  }
}

export const onboardingController = OnboardingController.getInstance();
