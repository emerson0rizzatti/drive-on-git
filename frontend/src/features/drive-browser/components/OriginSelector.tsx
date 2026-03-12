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
        1. Selecionar Origem
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Escolha a pasta do Google Drive que você deseja clonar para o GitHub.
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_e, newValue) => setTab(newValue)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Colar Link da Pasta" />
          <Tab label="Navegar no Meu Drive" />
        </Tabs>
      </Paper>

      <Box sx={{ py: 2 }}>
        {tab === 0 && <FolderLinkInput />}
        {tab === 1 && (
          <React.Suspense fallback={<SuspenseLoader message="Carregando pastas do Drive..." minHeight={300} />}>
            <DriveBrowser />
          </React.Suspense>
        )}
      </Box>
    </Box>
  );
};

export default OriginSelector;
