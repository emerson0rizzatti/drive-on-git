import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { cloneService } from '../services/cloneService';
import { startCloneSchema } from '../validators/clone.schema';
import { AuthenticatedSession } from '../middleware/authGuard';

export class CloneController extends BaseController {
  startClone(req: Request, res: Response): void {
    try {
      const { googleAccessToken, githubAccessToken, githubUser } =
        req.session as AuthenticatedSession;
      const input = startCloneSchema.parse(req.body);

      const jobId = cloneService.startJob(
        input.folderId,
        input.repoOwner || githubUser!.login,
        input.repoName,
        googleAccessToken!,
        githubAccessToken!,
      );

      this.handleCreated(res, { jobId });
    } catch (error) {
      this.handleError(error, res, 'startClone');
    }
  }

  // Server-Sent Events for real-time progress
  streamStatus(req: Request, res: Response): void {
    const { jobId } = req.params as { jobId: string };
    const job = cloneService.getJob(jobId);

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendEvent = () => {
      const current = cloneService.getJob(jobId);
      if (!current) return;

      res.write(`data: ${JSON.stringify(current)}\n\n`);

      if (current.status === 'completed' || current.status === 'failed') {
        res.end();
        clearInterval(interval);
      }
    };

    sendEvent(); // Send immediately
    const interval = setInterval(sendEvent, 1000);

    req.on('close', () => clearInterval(interval));
  }
}

export const cloneController = new CloneController();
