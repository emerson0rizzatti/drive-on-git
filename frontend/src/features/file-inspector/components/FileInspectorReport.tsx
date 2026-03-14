import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useInspectFolder } from '../hooks/useInspectFolder';
import LimitWarningBanner from './LimitWarningBanner';
import SuspenseLoader from '../../../components/SuspenseLoader';

export const FileInspectorReport: React.FC<{ folderId: string }> = ({ folderId }) => {
  const { data, isLoading, isError, error } = useInspectFolder(folderId) as any;
  const navigate = useNavigate();
  const [acknowledgedLimit, setAcknowledgedLimit] = useState(false);

  if (isLoading) return <SuspenseLoader message="Analisando pasta..." />;
  
  if (isError || !data) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', border: '1px dashed red' }}>
        <Typography color="error" gutterBottom>Erro ao inspecionar pasta</Typography>
        <Typography variant="body2" mb={2}>{(error as any)?.message || 'Ocorreu um erro inesperado.'}</Typography>
        <Button variant="outlined" onClick={() => window.location.reload()}>Tentar Novamente</Button>
      </Paper>
    );
  }

  const canProceed = !data.exceedsRepoLimit || acknowledgedLimit;

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-in' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        2. Relatório de Inspeção
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Revise o conteúdo de <strong>{data.folderName}</strong> antes de selecionar o destino.
      </Typography>

      <LimitWarningBanner
        exceedsRepoLimit={data.exceedsRepoLimit}
        totalSizeMB={data.totalSizeMB}
        oversizedCount={data.oversizedFiles.length}
        acknowledged={acknowledgedLimit}
        onAcknowledge={() => setAcknowledgedLimit(true)}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main" fontWeight={700}>{data.totalFiles}</Typography>
          <Typography variant="body2" color="text.secondary">Total de Arquivos</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main" fontWeight={700}>{data.totalSizeMB} MB</Typography>
          <Typography variant="body2" color="text.secondary">Tamanho Total</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: data.oversizedFiles.length > 0 ? 'warning.dark' : 'background.paper' }}>
          <Typography variant="h4" color={data.oversizedFiles.length > 0 ? 'white' : 'primary.main'} fontWeight={700}>
            {data.oversizedFiles.length}
          </Typography>
          <Typography variant="body2" color={data.oversizedFiles.length > 0 ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
            Pulados (&gt;100MB)
          </Typography>
        </Paper>
      </Box>

      {data.oversizedFiles.length > 0 && (
        <Box mb={4}>
          <Typography variant="subtitle1" fontWeight={600} color="warning.main" mb={1}>
            Arquivos Ignorados (Maiores que 100MB)
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Caminho</TableCell>
                  <TableCell align="right">Tamanho (MB)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.oversizedFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell sx={{ opacity: 0.7 }}>{file.path}</TableCell>
                    <TableCell align="right">
                      <Chip label={`${file.sizeMB} MB`} color="error" size="small" variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate({ to: '/browse' })}>
          Cancelar e Escolher Outra
        </Button>
        <Button 
          variant="contained" 
          size="large" 
          disabled={!canProceed || data.validFiles.length === 0}
          onClick={() => navigate({ to: '/destination', search: { folderId, folderName: data.folderName } } as any)}
        >
          {data.validFiles.length === 0 ? 'Nenhum arquivo válido para clonar' : 'Prosseguir para o Destino'}
        </Button>
      </Box>

    </Box>
  );
};

export default FileInspectorReport;
