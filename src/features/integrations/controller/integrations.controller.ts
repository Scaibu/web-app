/**
 * Controller for Integrations and Alert Sinks.
 * Strictly adheres to Part III (Frontend Feature Structure: Controller Role).
 */

import { integrationsState } from '../state/integrations.state';

export class IntegrationsController {
  private static instance: IntegrationsController | null = null;

  private constructor() {}

  public static getInstance(): IntegrationsController {
    if (!IntegrationsController.instance) {
      IntegrationsController.instance = new IntegrationsController();
    }
    return IntegrationsController.instance;
  }

  public toggleSinkStatus(id: string): void {
    integrationsState.toggleSink(id);
  }

  public selectActiveSink(id: string | null): void {
    integrationsState.selectSink(id);
  }

  public setFilter(type: string): void {
    integrationsState.setFilterType(type);
  }

  public dispatchTestWebhook(sinkId: string): void {
    integrationsState.sendTestPing(sinkId);
  }
}

export const integrationsController = IntegrationsController.getInstance();
