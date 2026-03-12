"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitHubController = exports.GitHubController = void 0;
const BaseController_1 = require("./BaseController");
const githubService_1 = require("../services/githubService");
const repo_schema_1 = require("../validators/repo.schema");
class GitHubController extends BaseController_1.BaseController {
    async listRepos(req, res) {
        try {
            const { githubAccessToken } = req.session;
            const repos = await githubService_1.githubService.listUserRepos(githubAccessToken);
            this.handleSuccess(res, repos);
        }
        catch (error) {
            this.handleError(error, res, 'listRepos');
        }
    }
    async listTaggedRepos(req, res) {
        try {
            const { githubAccessToken } = req.session;
            const repos = await githubService_1.githubService.listTaggedRepos(githubAccessToken);
            this.handleSuccess(res, repos);
        }
        catch (error) {
            this.handleError(error, res, 'listTaggedRepos');
        }
    }
    async createRepo(req, res) {
        try {
            const { githubAccessToken } = req.session;
            const input = repo_schema_1.createRepoSchema.parse(req.body);
            const repo = await githubService_1.githubService.createRepo(githubAccessToken, input);
            this.handleCreated(res, repo);
        }
        catch (error) {
            this.handleError(error, res, 'createRepo');
        }
    }
}
exports.GitHubController = GitHubController;
exports.gitHubController = new GitHubController();
//# sourceMappingURL=GitHubController.js.map