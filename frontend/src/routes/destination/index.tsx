import { createFileRoute, notFound } from '@tanstack/react-router';
import { Box } from '@mui/material';
import React from 'react';
import SuspenseLoader from '../../components/SuspenseLoader';

const RepoSelector = React.lazy(() => import('../../features/repo-selector/components/RepoSelector'));

type SearchParams = {
  folderId: string;
  folderName: string;
};

export const Route = createFileRoute('/destination/')({
  component: DestinationPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    if (typeof search.folderId !== 'string' || typeof search.folderName !== 'string') {
      throw notFound();
    }
    return { folderId: search.folderId, folderName: search.folderName };
  },
});

function DestinationPage() {
  const { folderId, folderName } = Route.useSearch();

  return (
    <Box sx={{ p: 2 }}>
      <React.Suspense fallback={<SuspenseLoader message="Loading GitHub repositories..." minHeight={300} />}>
        <RepoSelector folderId={folderId} folderName={folderName} />
      </React.Suspense>
    </Box>
  );
}
