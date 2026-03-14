import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import WarningIcon from '@mui/icons-material/Warning';
import { inspectorApi } from '../../file-inspector/api/inspectorApi';

interface DeleteFolderDialogProps {
  open: boolean;
  onClose: () => void;
  folderId: string;
  folderName: string;
  onSuccess: () => void;
}

export const DeleteFolderDialog: React.FC<DeleteFolderDialogProps> = ({
  open,
  onClose,
  folderId,
  folderName,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await inspectorApi.deleteFolder(folderId);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to delete folder:', err);
      setError(err?.response?.data?.error || 'Falha ao excluir a pasta. Verifique se você ainda tem permissões.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
        <DeleteForeverIcon />
        Excluir pasta original?
      </DialogTitle>
      <DialogContent>
        <DialogContentText mb={2}>
          Você está prestes a excluir permanentemente a pasta <strong>{folderName}</strong> do seu Google Drive para liberar espaço.
        </DialogContentText>
        
        <Box sx={{ bgcolor: 'error.light', p: 1.5, borderRadius: 1, display: 'flex', gap: 1.5, mb: 2 }}>
          <WarningIcon sx={{ color: 'error.dark' }} />
          <Typography variant="body2" color="error.dark" fontWeight={600}>
            Esta ação é irreversível. Certifique-se de que a clonagem para o GitHub foi concluída corretamente.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          disabled={loading}
          variant="contained"
          color="error"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteForeverIcon />}
        >
          {loading ? 'Excluindo...' : 'Sim, Excluir Agora'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
