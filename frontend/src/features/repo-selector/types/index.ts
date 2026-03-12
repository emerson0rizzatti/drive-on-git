export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  url: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface CreateRepoPayload {
  name: string;
  description?: string;
  private: boolean;
}
