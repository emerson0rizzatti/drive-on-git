import { createFileRoute, notFound } from '@tanstack/react-router';
import { Box } from '@mui/material';
import React from 'react';
import SuspenseLoader from '../../components/SuspenseLoader';
import InspectorErrorComponent from '../../features/file-inspector/components/InspectorErrorComponent';

const FileInspectorReport = React.lazy(() => import('../../features/file-inspector/components/FileInspectorReport'));

type SearchParams = {
  folderId: string;
};

export const Route = createFileRoute('/inspect/')({
  component: InspectPage,
  errorComponent: InspectorErrorComponent,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    if (typeof search.folderId !== 'string') {
      throw notFound();
    }
    return { folderId: search.folderId };
  },
});

function InspectPage() {
  const { folderId } = Route.useSearch();

  return (
    <Box sx={{ p: 2 }}>
      <React.Suspense fallback={<SuspenseLoader message="Inspecionando pasta do Drive profundamente... Isso pode levar um minuto." minHeight={400} />}>
        <FileInspectorReport folderId={folderId} />
      </React.Suspense>
    </Box>
  );
}
