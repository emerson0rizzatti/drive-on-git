import React from 'react';
import { Box, Typography, Button, Chip, Card, CardContent } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import FolderIcon from '@mui/icons-material/Folder';
import { useMyRepos } from '../hooks/useMyRepos';
import { Link } from '@tanstack/react-router';

export const MyReposList: React.FC = () => {
  const { data: repos } = useMyRepos();

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Meus Repositórios Drive on Git
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Clonar Nova Pasta
        </Button>
      </Box>

      {repos.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <FolderIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            Nenhum repositório clonado encontrado
          </Typography>
          <Typography color="text.secondary">
            Repositórios criados usando o Drive on Git aparecerão aqui.
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          {repos.map((repo) => (
            <Card key={repo.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box display="flex" gap={1} alignItems="center">
                    <GitHubIcon color="inherit" />
                    <Typography variant="h6" fontWeight={600} noWrap>
                      {repo.name}
                    </Typography>
                  </Box>
                  {repo.private ? (
                    <Chip label="Privado" size="small" variant="outlined" />
                  ) : (
                    <Chip label="Público" size="small" variant="outlined" color="success" />
                  )}
                </Box>
                <Button 
                  href={repo.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  fullWidth 
                  variant="outlined"
                  size="small"
                >
                  Ver no GitHub
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MyReposList;
