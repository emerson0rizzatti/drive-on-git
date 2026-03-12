import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

// Lazy load
const OriginSelector = React.lazy(() => import('../../features/drive-browser/components/OriginSelector'));

export const Route = createFileRoute('/browse/')({
  component: BrowsePage,
});

function BrowsePage() {
  return (
    <React.Suspense fallback={null}>
      <OriginSelector />
    </React.Suspense>
  );
}
