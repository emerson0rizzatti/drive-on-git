import React, { useCallback } from 'react';
import { Box, Button, Card, CardContent, Typography, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStatus, authQueryKeys } from '../hooks/useAuthStatus';
import { authApi } from '../api/authApi';

export const AuthStatusCard: React.FC = () => {
  const { data: status } = useAuthStatus();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleGoogleLogin = useCallback(() => {
    window.location.href = authApi.getGoogleLoginUrl();
  }, []);

  const handleGitHubLogin = useCallback(() => {
    window.location.href = authApi.getGithubLoginUrl();
  }, []);

  const handleLogout = useCallback(async () => {
    await authApi.logout();
    queryClient.invalidateQueries({ queryKey: authQueryKeys.status });
  }, [queryClient]);

  const bothConnected = status.google && status.github;

  return (
    <Card sx={{ maxWidth: 500, width: '100%', mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
          Autenticação Necessária
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" mb={4}>
          Você deve vincular suas contas do Google Drive e GitHub para continuar.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Status da Autenticação Google */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <GoogleIcon color={status.google ? 'success' : 'action'} />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Google Drive
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {status.google ? status.googleUser?.email || 'Conectado' : 'Não conectado'}
                </Typography>
              </Box>
            </Box>
            {status.google ? (
              <CheckCircleIcon color="success" />
            ) : (
              <Button variant="contained" size="small" onClick={handleGoogleLogin}>
                Conectar
              </Button>
            )}
          </Box>

          <Divider />

          {/* Status da Autenticação GitHub */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <GitHubIcon color={status.github ? 'success' : 'action'} />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  GitHub
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {status.github ? status.githubUser?.login || 'Conectado' : 'Não conectado'}
                </Typography>
              </Box>
            </Box>
            {status.github ? (
              <CheckCircleIcon color="success" />
            ) : (
              <Button variant="contained" size="small" onClick={handleGitHubLogin} color="secondary">
                Conectar
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 5, textAlign: 'center' }}>
          {bothConnected ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={() => navigate({ to: '/browse' })}
              sx={{ py: 1.5, fontSize: '1.1rem' }}
            >
              Começar Clonagem
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleLogout}
              sx={{ opacity: 0.7 }}
            >
              Reiniciar / Sair
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AuthStatusCard;
