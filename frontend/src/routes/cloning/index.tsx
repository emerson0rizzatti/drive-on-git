import { createFileRoute, notFound } from '@tanstack/react-router';
import { Box } from '@mui/material';
import React from 'react';

const CloneProgressLog = React.lazy(() => import('../../features/clone-job/components/CloneProgressLog'));

type SearchParams = {
  jobId: string;
};

export const Route = createFileRoute('/cloning/')({
  component: CloningPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    if (typeof search.jobId !== 'string') {
      throw notFound();
    }
    return { jobId: search.jobId };
  },
});

function CloningPage() {
  const { jobId } = Route.useSearch();

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <React.Suspense fallback={null}>
        <CloneProgressLog jobId={jobId} />
      </React.Suspense>
    </Box>
  );
}
