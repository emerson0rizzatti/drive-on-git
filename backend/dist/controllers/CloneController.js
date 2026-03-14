"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneController = exports.CloneController = void 0;
const BaseController_1 = require("./BaseController");
const cloneService_1 = require("../services/cloneService");
const clone_schema_1 = require("../validators/clone.schema");
class CloneController extends BaseController_1.BaseController {
    startClone(req, res) {
        try {
            const { googleAccessToken, githubAccessToken, githubUser } = req.session;
            const input = clone_schema_1.startCloneSchema.parse(req.body);
            const jobId = cloneService_1.cloneService.startJob(input.folderId, input.repoOwner || githubUser.login, input.repoName, googleAccessToken, githubAccessToken);
            this.handleCreated(res, { jobId });
        }
        catch (error) {
            this.handleError(error, res, 'startClone');
        }
    }
    // Server-Sent Events for real-time progress
    streamStatus(req, res) {
        const { jobId } = req.params;
        const job = cloneService_1.cloneService.getJob(jobId);
        if (!job) {
            res.status(404).json({ error: 'Job not found' });
            return;
        }
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        const sendEvent = () => {
            const job = cloneService_1.cloneService.getJob(jobId);
            if (!job)
                return;
            const successfulFiles = job.files.filter(f => f.status === 'done').length;
            const failedFiles = job.files.filter(f => f.status === 'error').length;
            const skippedFiles = job.files.filter(f => f.status === 'skipped').length;
            const currentFile = job.files.find(f => f.status === 'uploading')?.filePath;
            // Map backend status to frontend status
            let frontendStatus = 'pending';
            if (job.status === 'running') {
                frontendStatus = job.total === 0 ? 'inspecting' : 'processing';
            }
            else if (job.status === 'completed') {
                frontendStatus = 'completed';
            }
            else if (job.status === 'failed') {
                frontendStatus = 'failed';
            }
            const formattedStatus = {
                jobId: job.jobId,
                folderId: job.folderId,
                repoOwner: job.repoOwner,
                repoName: job.repoName,
                status: frontendStatus,
                progress: {
                    totalFiles: job.total,
                    processedFiles: job.current,
                    successfulFiles,
                    failedFiles,
                    skippedFiles,
                    currentFile,
                },
                errors: job.files.filter(f => f.error).map(f => `${f.filePath}: ${f.error}`),
                createdAt: job.startedAt.toISOString(),
            };
            res.write(`data: ${JSON.stringify(formattedStatus)}\n\n`);
            if (job.status === 'completed' || job.status === 'failed') {
                res.end();
                clearInterval(interval);
            }
        };
        sendEvent(); // Send immediately
        const interval = setInterval(sendEvent, 1000);
        req.on('close', () => clearInterval(interval));
    }
}
exports.CloneController = CloneController;
exports.cloneController = new CloneController();
//# sourceMappingURL=CloneController.js.map