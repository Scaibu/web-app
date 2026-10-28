import type {
  AuthUserModel,
  SignInCredentialsModel,
  SignUpModel,
  OrgMemberModel,
} from "../models/auth.model";

export interface AuthAdapterPort {
  signIn(credentials: SignInCredentialsModel): Promise<AuthUserModel>;
  signUp(data: SignUpModel): Promise<AuthUserModel>;
  getMembers(): Promise<OrgMemberModel[]>;
}

export class AuthMockAdapter implements AuthAdapterPort {
  async signIn(credentials: SignInCredentialsModel): Promise<AuthUserModel> {
    return {
      id: "usr-01",
      name: "Jaydeep",
      email: credentials.email,
      role: "admin",
      orgId: "org-scaibu",
    };
  }

  async signUp(data: SignUpModel): Promise<AuthUserModel> {
    return {
      id: "usr-02",
      name: data.name,
      email: data.email,
      role: "admin",
      orgId: "org-new",
    };
  }

  async getMembers(): Promise<OrgMemberModel[]> {
    return [
      {
        id: "usr-01",
        name: "Jaydeep",
        email: "jaydeep@gmail.com",
        role: "admin",
        status: "active",
        joinedAt: "2025-01-15",
      },
      {
        id: "usr-02",
        name: "Sarah Chen",
        email: "sarah@scaibu.com",
        role: "member",
        status: "active",
        joinedAt: "2025-02-10",
      },
      {
        id: "usr-03",
        name: "Alex Rivera",
        email: "alex@scaibu.com",
        role: "viewer",
        status: "invited",
        joinedAt: "2025-03-01",
      },
    ];
  }
}

export const authAdapter: AuthAdapterPort = new AuthMockAdapter();
