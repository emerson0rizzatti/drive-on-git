import React from 'react';
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

interface Props {
  exceedsRepoLimit: boolean;
  totalSizeMB: number;
  oversizedCount: number;
  onAcknowledge: () => void;
  acknowledged: boolean;
}

export const LimitWarningBanner: React.FC<Props> = ({
  exceedsRepoLimit,
  totalSizeMB,
  oversizedCount,
  onAcknowledge,
  acknowledged,
}) => {
  if (!exceedsRepoLimit && oversizedCount === 0) return null;

  return (
    <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {oversizedCount > 0 && (
        <Alert severity="warning" icon={<StorageIcon />} variant="filled">
          <AlertTitle>Arquivos Excedendo o Limite de 100 MB</AlertTitle>
          {oversizedCount} arquivos são maiores que 100 MB. O GitHub bloqueia arquivos acima deste limite. 
          Eles serão <strong>ignorados</strong> durante o processo de clonagem.
        </Alert>
      )}

      {exceedsRepoLimit && (
        <Alert severity="error" variant="filled">
          <AlertTitle>Alto Risco: Repositório Ultrapassa 1 GB</AlertTitle>
          <Typography variant="body2" gutterBottom>
            O tamanho total dos arquivos válidos é {totalSizeMB.toFixed(1)} MB, o que excede o limite recomendado de 1 GB do GitHub para 
            repositórios. Continuar pode levar o repositório a ser desativado pelo GitHub.
          </Typography>
          {!acknowledged && (
            <Button 
              variant="contained" 
              color="inherit" 
              size="small" 
              sx={{ mt: 1, color: 'error.main' }}
              onClick={onAcknowledge}
            >
              Compreendo os riscos, desejo clonar assim mesmo
            </Button>
          )}
        </Alert>
      )}
    </Box>
  );
};

export default LimitWarningBanner;
