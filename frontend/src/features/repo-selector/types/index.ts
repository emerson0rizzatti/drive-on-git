export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
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
