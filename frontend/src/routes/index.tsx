import { createFileRoute } from '@tanstack/react-router';
import { Box, Typography, Avatar, Alert, AlertTitle } from '@mui/material';
import React from 'react';

export const Route = createFileRoute('/')({
  component: Index,
});

// Lazy load feature entries
const AuthFeature = React.lazy(() => import('../features/auth/components/AuthStatusCard'));

function Index() {
  const [deniedEmail, setDeniedEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'access_denied') {
      setDeniedEmail(params.get('email'));
    }

    // Drop the ?auth= query param to prevent weird state loops and 'message port closed' warnings
    if (window.location.search.includes('auth=')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', py: 8 }}>
      <Box textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom color="primary.main" fontWeight={700}>
          Drive on Git
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          Clone facilmente suas pastas do Google Drive para repositórios novos ou existentes do GitHub.
        </Typography>

        {/* Dedicatória */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2, 
            bgcolor: 'background.paper', 
            p: 3, 
            borderRadius: 3, 
            boxShadow: 1,
            mx: 'auto',
            maxWidth: 500,
            border: '1px solid',
            borderColor: 'divider',
            mb: 2
          }}
        >
          <Box
            component="a"
            href="https://www.instagram.com/anitarizzatti"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 0.5,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' }
            }}
          >
            <Avatar 
              src="/anita.jpg" 
              alt="Anita Rizzatti" 
              sx={{ width: 64, height: 64, border: '3px solid #1e293b' }}
            />
          </Box>
          <Typography variant="body1" color="text.primary" sx={{ fontStyle: 'italic', fontWeight: 500 }}>
            "Este sistema foi criado por Émerson Oliveira Rizzatti para sua filha Anita da Costa Rizzatti armazenar as fotos do seu trabalho como fotógrafa."
          </Typography>
          <Typography variant="body2" color="primary.main" component="a" href="https://www.instagram.com/anitarizzatti" target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Siga no Instagram @anitarizzatti
          </Typography>
        </Box>

        {deniedEmail && (
          <Alert severity="error" sx={{ mt: 2, textAlign: 'left', borderRadius: 2 }}>
            <AlertTitle>Acesso Negado</AlertTitle>
            A conta <strong>{deniedEmail}</strong> não tem permissão para acessar este sistema. 
            Entre em contato com o administrador para solicitar acesso.
          </Alert>
        )}
      </Box>
      
      <AuthFeature />
    </Box>
  );
}
