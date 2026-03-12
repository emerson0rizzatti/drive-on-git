import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { cloneApi } from '../api/cloneApi';
import type { CloneJobStatus, StartClonePayload } from '../types';
import { env } from '../../../config/env';

export const useStartClone = () => {
  return useMutation<{ jobId: string }, Error, StartClonePayload>({
    mutationFn: cloneApi.startClone,
  });
};

export const useCloneProgress = (jobId: string | null) => {
  const [status, setStatus] = useState<CloneJobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    // Use SSE (Server-Sent Events) via native EventSource
    // Because it goes cross-origin to the backend, we setup withCredentials to send the cookie session
    const eventSource = new EventSource(`${env.API_URL}/clone/${jobId}/status`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as CloneJobStatus;
        setStatus(data);

        // Close connection if the job is done
        if (data.status === 'completed' || data.status === 'failed') {
          eventSource.close();
        }
      } catch (err) {
        console.error('Failed to parse SSE data', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      setError('Connection to status stream lost.');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [jobId]);

  return { status, error };
};
