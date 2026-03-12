import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography } from '@mui/material';
import FolderLinkInput from './FolderLinkInput';
import DriveBrowser from './DriveBrowser';
import SuspenseLoader from '../../../components/SuspenseLoader';

export const OriginSelector: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        1. Select Origin
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Choose the Google Drive folder you want to clone to GitHub.
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_e, newValue) => setTab(newValue)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Paste Folder Link" />
          <Tab label="Browse My Drive" />
        </Tabs>
      </Paper>

      <Box sx={{ py: 2 }}>
        {tab === 0 && <FolderLinkInput />}
        {tab === 1 && (
          <React.Suspense fallback={<SuspenseLoader message="Loading Drive folders..." minHeight={300} />}>
            <DriveBrowser />
          </React.Suspense>
        )}
      </Box>
    </Box>
  );
};

export default OriginSelector;
