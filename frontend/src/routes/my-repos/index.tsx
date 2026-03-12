import { createFileRoute } from '@tanstack/react-router';
import { Box } from '@mui/material';
import React from 'react';
import SuspenseLoader from '../../components/SuspenseLoader';

const MyReposList = React.lazy(() => import('../../features/my-repos/components/MyReposList'));

export const Route = createFileRoute('/my-repos/')({
  component: MyReposPage,
});

function MyReposPage() {
  return (
    <Box sx={{ p: 2 }}>
      <React.Suspense fallback={<SuspenseLoader message="Loading your Drive on Git repositories..." />}>
        <MyReposList />
      </React.Suspense>
    </Box>
  );
}
