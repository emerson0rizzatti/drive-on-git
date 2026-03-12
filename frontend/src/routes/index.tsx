import { createFileRoute } from '@tanstack/react-router';
import { Box, Typography, Button } from '@mui/material';
import React from 'react';

export const Route = createFileRoute('/')({
  component: Index,
});

// Lazy load feature entries
const AuthFeature = React.lazy(() => import('../features/auth/components/AuthStatusCard'));

function Index() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', py: 8 }}>
      <Box textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom color="primary.main" fontWeight={700}>
          Drive on Git
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
          Clone easily your Google Drive folders into new or existing GitHub repositories.
        </Typography>
      </Box>
      
      <AuthFeature />
    </Box>
  );
}
