import React from 'react';
import { Box, Typography, LinearProgress, Paper, List, ListItem, ListItemText, ListItemIcon, Divider, Chip, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useCloneProgress } from '../hooks/useCloneJob';
import { Link } from '@tanstack/react-router';
import { DeleteFolderDialog } from './DeleteFolderDialog';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

export const CloneProgressLog: React.FC<{ jobId: string }> = ({ jobId }) => {
  const { status, error } = useCloneProgress(jobId);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isDeleted, setIsDeleted] = React.useState(false);

  if (error) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!status) {
    return (
      <Box p={3} textAlign="center">
        <Typography>Conectando ao servidor de clonagem...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  const { progress, status: jobStatus, errors, repoOwner, repoName } = status;
  const isDone = jobStatus === 'completed' || jobStatus === 'failed';
  
  // Prevent division by zero if totalFiles is 0 during early phases
  const safeTotalFiles = Math.max(progress.totalFiles, 1);
  const percentage = Math.round((progress.processedFiles / safeTotalFiles) * 100);

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Clonando para {repoOwner}/{repoName}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1" fontWeight={600}>
            {jobStatus === 'completed' ? 'Concluído!' : jobStatus === 'failed' ? 'Falha' : 'Clonagem em progresso...'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {progress.processedFiles} / {progress.totalFiles} arquivos
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={percentage} 
          color={jobStatus === 'failed' ? 'error' : jobStatus === 'completed' ? 'success' : 'primary'}
          sx={{ height: 10, borderRadius: 5 }}
        />
        
        {!isDone && progress.currentFile && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }} noWrap>
            Processando: {progress.currentFile}
          </Typography>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Chip icon={<CheckCircleOutlineIcon />} label={`${progress.successfulFiles} Sucesso`} color="success" variant="outlined" />
        <Chip icon={<ErrorOutlineIcon />} label={`${progress.failedFiles} Falha`} color="error" variant="outlined" />
        <Chip icon={<WarningAmberIcon />} label={`${progress.skippedFiles} Ignorados`} color="warning" variant="outlined" />
      </Box>

      {errors.length > 0 && (
        <Paper sx={{ borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid', overflow: 'hidden' }}>
          <Box sx={{ bgcolor: 'error.main', color: 'error.contrastText', p: 1, px: 2 }}>
            <Typography variant="subtitle2" fontWeight={600}>Logs de Erro</Typography>
          </Box>
          <List disablePadding sx={{ maxHeight: 200, overflow: 'auto' }}>
            {errors.map((err, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Divider />}
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}><ErrorOutlineIcon color="error" fontSize="small" /></ListItemIcon>
                  <ListItemText primary={<Typography variant="body2" color="error.main">{err}</Typography>} />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {isDone && (
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link to="/my-repos" style={{ textDecoration: 'none' }}>
              <Typography variant="button" sx={{ bgcolor: 'primary.main', color: 'white', px: 4, py: 1.5, borderRadius: 2, fontWeight: 600, cursor: 'pointer', display: 'inline-block' }}>
                Ir para Meus Repositórios
              </Typography>
            </Link>

            {jobStatus === 'completed' && status.ownedByMe && !isDeleted && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteSweepIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
              >
                Excluir Pasta Original
              </Button>
            )}
          </Box>

          {isDeleted && (
            <Typography variant="body2" color="success.main" fontWeight={600}>
              Pasta original excluída com sucesso!
            </Typography>
          )}
        </Box>
      )}

      {status && (
        <DeleteFolderDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          folderId={status.folderId}
          folderName={status.folderName}
          onSuccess={() => setIsDeleted(true)}
        />
      )}

    </Box>
  );
};

export default CloneProgressLog;
