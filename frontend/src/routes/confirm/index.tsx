import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { useStartClone } from '../../features/clone-job/hooks/useCloneJob';

type SearchParams = {
  folderId: string;
  folderName: string;
  repoOwner: string;
  repoName: string;
};

export const Route = createFileRoute('/confirm/')({
  component: ConfirmPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    if (
      typeof search.folderId !== 'string' ||
      typeof search.folderName !== 'string' ||
      typeof search.repoOwner !== 'string' ||
      typeof search.repoName !== 'string'
    ) {
      throw notFound();
    }
    return {
      folderId: search.folderId,
      folderName: search.folderName,
      repoOwner: search.repoOwner,
      repoName: search.repoName,
    };
  },
});

function ConfirmPage() {
  const { folderId, folderName, repoOwner, repoName } = Route.useSearch();
  const startCloneMutation = useStartClone();
  const navigate = useNavigate();

  const handleStartProcess = () => {
    startCloneMutation.mutate(
      { folderId, repoOwner, repoName },
      {
        onSuccess: (data) => {
          navigate({ to: '/cloning/', search: { jobId: data.jobId } } as any);
        },
      }
    );
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom textAlign="center">
        4. Pronto para Clonar
      </Typography>

      <Paper sx={{ p: 4, my: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" color="primary">Origem: {folderName}</Typography>
        <Typography variant="h6" color="secondary">Destino: {repoOwner}/{repoName}</Typography>
        
        {startCloneMutation.isError && (
          <Alert severity="error">
            Falha ao iniciar o processo de clonagem. Verifique permissões e limitações.
          </Alert>
        )}

        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={startCloneMutation.isPending}
          onClick={handleStartProcess}
          sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
        >
          {startCloneMutation.isPending ? 'Iniciando Motor...' : 'Confirmar e Iniciar Clonagem'}
        </Button>
        <Button variant="outlined" onClick={() => window.history.back()}>
          Voltar
        </Button>
      </Paper>
    </Box>
  );
}
