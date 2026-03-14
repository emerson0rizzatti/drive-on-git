import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useInspectFolder } from '../hooks/useInspectFolder';
import LimitWarningBanner from './LimitWarningBanner';
import SuspenseLoader from '../../../components/SuspenseLoader';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const FileInspectorReport: React.FC<{ folderId: string }> = ({ folderId }) => {
  const { data, isLoading, isError, error, refetch } = useInspectFolder(folderId);
  const navigate = useNavigate();
  const [acknowledgedLimit, setAcknowledgedLimit] = useState(false);

  if (isLoading) {
    return <SuspenseLoader message="Inspecionando pastas do Drive... Isso pode levar um minuto." minHeight={400} />;
  }

  if (isError || !data) {
    const isNotFound = (error as any)?.response?.status === 404;
    return (
      <Box sx={{ py: 8, textAlign: 'center', animation: 'fadeIn 0.4s ease-in' }}>
        <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', bgcolor: 'rgba(211, 47, 47, 0.05)', border: '1px solid', borderColor: 'error.light' }}>
          <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom color="error.main">
            {isNotFound ? 'Pasta Não Encontrada' : 'Erro na Inspeção'}
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            {isNotFound 
              ? 'A pasta solicitada não existe ou você não tem permissão para acessá-la. Verifique se o ID está correto e se a pasta foi compartilhada com você.' 
              : 'Ocorreu um problema ao tentar ler o conteúdo desta pasta no Google Drive.'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => navigate({ to: '/browse' })}>
              Voltar para Seleção
            </Button>
            <Button variant="contained" color="error" onClick={() => refetch()}>
              Tentar Novamente
            </Button>
          </Box>
        </Paper>
      </Box>
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
