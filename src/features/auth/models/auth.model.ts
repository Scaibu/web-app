export interface AuthUserModel {
  id: string;
  name: string;
  email: string;
  role: string;
  orgId: string;
}

export interface SignInCredentialsModel {
  email: string;
  password: string;
}

export interface SignUpModel {
  name: string;
  email: string;
  password: string;
  orgName?: string;
}

export interface OrgMemberModel {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "blocked";
  joinedAt: string;
}
