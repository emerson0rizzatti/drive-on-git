import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Checkbox, FormControlLabel, Button, Autocomplete, Alert } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useGithubRepos, useCreateRepo } from '../hooks/useGithubRepos';
import type { GitHubRepo } from '../types';

interface Props {
  folderId: string;
  folderName: string;
}

export const RepoSelector: React.FC<Props> = ({ folderId, folderName }) => {
  const [tab, setTab] = useState(0);
  const { data: repos } = useGithubRepos();
  const createRepoMutation = useCreateRepo();
  const navigate = useNavigate();

  // New Repo state
  const [newRepoName, setNewRepoName] = useState(folderName.replace(/\s+/g, '-').toLowerCase());
  const [newRepoDesc, setNewRepoDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  // Existing Repo state
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  const handleStartClone = (repoOwner: string, repoName: string) => {
    navigate({
      to: '/confirm',
      search: { folderId, folderName, repoOwner, repoName },
    } as any);
  };

  const handleCreateAndClone = () => {
    if (!newRepoName) return;
    createRepoMutation.mutate(
      { name: newRepoName, description: newRepoDesc, private: isPrivate },
      {
        onSuccess: (repo) => {
          handleStartClone(repo.owner.login, repo.name);
        },
      }
    );
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-in' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        3. Configuração de Destino
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Escolha onde no GitHub você deseja clonar a pasta <strong>{folderName}</strong>.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_e, v) => setTab(v)}>
          <Tab label="Criar Novo Repositório" />
          <Tab label="Usar Repositório Existente" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 500 }}>
          <TextField
            label="Nome do Repositório"
            fullWidth
            value={newRepoName}
            onChange={(e) => setNewRepoName(e.target.value.replace(/\s+/g, '-'))}
            helperText="Apenas letras, números e hífens. Espaços serão convertidos em hífens."
          />
          <TextField
            label="Descrição (opcional)"
            fullWidth
            value={newRepoDesc}
            onChange={(e) => setNewRepoDesc(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />}
            label="Repositório privado"
          />

          {createRepoMutation.isError && (
            <Alert severity="error">Falha ao criar repositório. Verifique se o nome é válido e único.</Alert>
          )}

          <Button
            variant="contained"
            size="large"
            disabled={!newRepoName || createRepoMutation.isPending}
            onClick={handleCreateAndClone}
          >
            {createRepoMutation.isPending ? 'Criando e Preparando...' : 'Criar e Prosseguir'}
          </Button>
        </Box>
      )}

      {tab === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 500 }}>
          <Autocomplete
            options={repos}
            getOptionLabel={(option) => option.fullName || option.name}
            value={selectedRepo}
            onChange={(_e, newValue) => setSelectedRepo(newValue)}
            renderInput={(params) => <TextField {...params} label="Pesquisar seus repositórios" />}
          />
          <Button
            variant="contained"
            size="large"
            disabled={!selectedRepo}
            onClick={() => {
              if (selectedRepo) handleStartClone(selectedRepo.owner.login, selectedRepo.name);
            }}
          >
            Usar Selecionado e Prosseguir
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RepoSelector;
