import type { AuthUserModel, OrgMemberModel } from "../models/auth.model";

export interface AuthStateData {
  user: AuthUserModel | null;
  members: OrgMemberModel[];
  isAuthenticated: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class AuthState {
  private data: AuthStateData;
  private listeners: Set<(state: AuthStateData) => void> = new Set();

  constructor(initialData?: Partial<AuthStateData>) {
    this.data = {
      user: initialData?.user ?? {
        id: "usr-01",
        name: "Jaydeep",
        email: "jaydeep@gmail.com",
        role: "admin",
        orgId: "org-scaibu",
      },
      members: initialData?.members ?? [],
      isAuthenticated: initialData?.isAuthenticated ?? true,
      isLoading: initialData?.isLoading ?? false,
      hasError: initialData?.hasError ?? false,
      errorMessage: initialData?.errorMessage ?? null,
    };
  }

  getSnapshot(): AuthStateData {
    return this.data;
  }

  subscribe(listener: (state: AuthStateData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setLoading(isLoading: boolean): void {
    this.data = { ...this.data, isLoading };
    this.notify();
  }

  setError(errorMessage: string): void {
    this.data = {
      ...this.data,
      hasError: true,
      errorMessage,
      isLoading: false,
    };
    this.notify();
  }

  setUser(user: AuthUserModel | null): void {
    this.data = {
      ...this.data,
      user,
      isAuthenticated: user !== null,
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
    this.notify();
  }

  setMembers(members: OrgMemberModel[]): void {
    this.data = {
      ...this.data,
      members,
      isLoading: false,
      hasError: false,
    };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const authStateInstance = new AuthState();
