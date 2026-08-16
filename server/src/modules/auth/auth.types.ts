export interface RegisterInput {
  username: string;
  displayName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  status: string;
}