import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface InspectorErrorComponentProps {
  error: Error;
  reset: () => void;
}

const InspectorErrorComponent: React.FC<InspectorErrorComponentProps> = ({ error, reset }) => {
  const navigate = useNavigate();
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
          <Button variant="contained" color="error" onClick={() => reset()}>
            Tentar Novamente
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default InspectorErrorComponent;
