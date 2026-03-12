import axios from 'axios';
import { GitHubRepo, CreateRepoPayload } from '../types/GitHubRepo';

const GITHUB_API = 'https://api.github.com';
const DRIVE_ON_GIT_TOPIC = 'drive-on-git';

function authHeader(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export class githubService {
  static async listUserRepos(accessToken: string): Promise<GitHubRepo[]> {
    const { data } = await axios.get(`${GITHUB_API}/user/repos`, {
      params: { type: 'owner', sort: 'updated', per_page: 100 },
      headers: authHeader(accessToken),
    });
    return data as GitHubRepo[];
  }

  static async listTaggedRepos(accessToken: string): Promise<GitHubRepo[]> {
    // GitHub Search API for repos with topic drive-on-git belonging to the authenticated user
    const { data: userInfo } = await axios.get(`${GITHUB_API}/user`, {
      headers: authHeader(accessToken),
    });
    const login = userInfo.login as string;
    const { data } = await axios.get(`${GITHUB_API}/search/repositories`, {
      params: { q: `user:${login} topic:${DRIVE_ON_GIT_TOPIC}`, per_page: 100 },
      headers: authHeader(accessToken),
    });
    return data.items as GitHubRepo[];
  }

  static async createRepo(accessToken: string, payload: CreateRepoPayload): Promise<GitHubRepo> {
    const { data } = await axios.post(
      `${GITHUB_API}/user/repos`,
      {
        name: payload.name,
        description: payload.description ?? '',
        private: payload.private,
        auto_init: true, // Creates initial commit so we can push files
      },
      { headers: authHeader(accessToken) },
    );

    const repo = data as GitHubRepo;

    // Apply drive-on-git topic
    await axios.put(
      `${GITHUB_API}/repos/${repo.owner.login}/${repo.name}/topics`,
      { names: [DRIVE_ON_GIT_TOPIC] },
      {
        headers: {
          ...authHeader(accessToken),
          Accept: 'application/vnd.github.mercy-preview+json',
        },
      },
    );

    return repo;
  }

  static async getRepo(accessToken: string, owner: string, repo: string): Promise<GitHubRepo> {
    const { data } = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}`, {
      headers: authHeader(accessToken),
    });
    return data as GitHubRepo;
  }

  // Upload a single file to GitHub via Contents API (base64 encoded)
  static async uploadFile(
    accessToken: string,
    owner: string,
    repo: string,
    path: string,
    content: Buffer,
    message: string,
    sha?: string, // required if file already exists
  ): Promise<void> {
    const body: Record<string, string> = {
      message,
      content: content.toString('base64'),
    };
    if (sha) body.sha = sha;

    await axios.put(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, body, {
      headers: authHeader(accessToken),
    });
  }

  // Get file SHA (needed for updates)
  static async getFileSha(
    accessToken: string,
    owner: string,
    repo: string,
    path: string,
  ): Promise<string | undefined> {
    try {
      const { data } = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
        headers: authHeader(accessToken),
      });
      return (data as { sha: string }).sha;
    } catch {
      return undefined;
    }
  }
}
