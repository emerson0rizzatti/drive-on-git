export interface AuthUser {
  id: string;
  email?: string;
  displayName?: string;
  login?: string; // GitHub
  name?: string;  // GitHub
  photo?: string;
  avatar_url?: string;
}

export interface AuthStatusResponse {
  google: boolean;
  github: boolean;
  googleUser?: AuthUser;
  githubUser?: AuthUser;
}
