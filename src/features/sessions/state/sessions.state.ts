/**
 * Central State Container for Multi-Turn Session Conversation Viewer.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type { ConversationSession } from '../models/sessions.model';
import { DUMMY_SESSIONS_DATA } from '../adapter/sessions.adapter';

export interface SessionsStateData {
  sessions: ConversationSession[];
  selectedSession: ConversationSession | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class SessionsState {
  private data: SessionsStateData;
  private listeners: Set<(state: SessionsStateData) => void> = new Set();

  constructor() {
    this.data = {
      sessions: DUMMY_SESSIONS_DATA,
      selectedSession: DUMMY_SESSIONS_DATA[0] ?? null,
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
  }

  getSnapshot(): SessionsStateData {
    return this.data;
  }

  subscribe(listener: (state: SessionsStateData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  selectSession(session: ConversationSession | null): void {
    this.data = { ...this.data, selectedSession: session };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const sessionsStateInstance = new SessionsState();
