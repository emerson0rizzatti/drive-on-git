export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    html_url: string;
    updated_at: string;
    owner: {
        login: string;
        avatar_url: string;
    };
    topics?: string[];
}
export interface CreateRepoPayload {
    name: string;
    description?: string;
    private: boolean;
}
//# sourceMappingURL=GitHubRepo.d.ts.map