import type { SignInCredentialsModel, SignUpModel } from "../models/auth.model";
import { authAdapter, type AuthAdapterPort } from "../adapter/auth.adapter";
import { authStateInstance, AuthState } from "../state/auth.state";

export class AuthController {
  constructor(
    private readonly state: AuthState = authStateInstance,
    private readonly adapter: AuthAdapterPort = authAdapter
  ) {}

  async signIn(credentials: SignInCredentialsModel): Promise<boolean> {
    this.state.setLoading(true);
    try {
      const user = await this.adapter.signIn(credentials);
      this.state.setUser(user);
      if (typeof document !== "undefined") {
        document.cookie = "authjs.session-token=demo-token-active; path=/; max-age=86400";
      }
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in";
      this.state.setError(msg);
      return false;
    }
  }

  async signUp(data: SignUpModel): Promise<boolean> {
    this.state.setLoading(true);
    try {
      const user = await this.adapter.signUp(data);
      this.state.setUser(user);
      if (typeof document !== "undefined") {
        document.cookie = "authjs.session-token=demo-token-active; path=/; max-age=86400";
      }
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign up";
      this.state.setError(msg);
      return false;
    }
  }

  async loadMembers(): Promise<void> {
    this.state.setLoading(true);
    try {
      const members = await this.adapter.getMembers();
      this.state.setMembers(members);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load members";
      this.state.setError(msg);
    }
  }

  signOut(): void {
    this.state.setUser(null);
    if (typeof document !== "undefined") {
      document.cookie = "authjs.session-token=; path=/; max-age=0";
    }
  }
}

export const authController = new AuthController();
