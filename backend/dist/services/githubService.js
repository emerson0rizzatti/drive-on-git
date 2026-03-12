"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubService = void 0;
const axios_1 = __importDefault(require("axios"));
const GITHUB_API = 'https://api.github.com';
const DRIVE_ON_GIT_TOPIC = 'drive-on-git';
function authHeader(token) {
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    };
}
class githubService {
    static async listUserRepos(accessToken) {
        const { data } = await axios_1.default.get(`${GITHUB_API}/user/repos`, {
            params: { type: 'owner', sort: 'updated', per_page: 100 },
            headers: authHeader(accessToken),
        });
        return data;
    }
    static async listTaggedRepos(accessToken) {
        // GitHub Search API for repos with topic drive-on-git belonging to the authenticated user
        const { data: userInfo } = await axios_1.default.get(`${GITHUB_API}/user`, {
            headers: authHeader(accessToken),
        });
        const login = userInfo.login;
        const { data } = await axios_1.default.get(`${GITHUB_API}/search/repositories`, {
            params: { q: `user:${login} topic:${DRIVE_ON_GIT_TOPIC}`, per_page: 100 },
            headers: authHeader(accessToken),
        });
        return data.items;
    }
    static async createRepo(accessToken, payload) {
        const { data } = await axios_1.default.post(`${GITHUB_API}/user/repos`, {
            name: payload.name,
            description: payload.description ?? '',
            private: payload.private,
            auto_init: true, // Creates initial commit so we can push files
        }, { headers: authHeader(accessToken) });
        const repo = data;
        // Apply drive-on-git topic
        await axios_1.default.put(`${GITHUB_API}/repos/${repo.owner.login}/${repo.name}/topics`, { names: [DRIVE_ON_GIT_TOPIC] }, {
            headers: {
                ...authHeader(accessToken),
                Accept: 'application/vnd.github.mercy-preview+json',
            },
        });
        return repo;
    }
    static async getRepo(accessToken, owner, repo) {
        const { data } = await axios_1.default.get(`${GITHUB_API}/repos/${owner}/${repo}`, {
            headers: authHeader(accessToken),
        });
        return data;
    }
    // Upload a single file to GitHub via Contents API (base64 encoded)
    static async uploadFile(accessToken, owner, repo, path, content, message, sha) {
        const body = {
            message,
            content: content.toString('base64'),
        };
        if (sha)
            body.sha = sha;
        await axios_1.default.put(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, body, {
            headers: authHeader(accessToken),
        });
    }
    // Get file SHA (needed for updates)
    static async getFileSha(accessToken, owner, repo, path) {
        try {
            const { data } = await axios_1.default.get(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
                headers: authHeader(accessToken),
            });
            return data.sha;
        }
        catch {
            return undefined;
        }
    }
}
exports.githubService = githubService;
//# sourceMappingURL=githubService.js.map