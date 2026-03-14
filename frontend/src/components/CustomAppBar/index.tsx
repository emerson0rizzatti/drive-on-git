import React, { memo } from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Link } from '@tanstack/react-router';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthStatusBadge from '../AuthStatusBadge';
import { useLogout } from '../../features/auth/hooks/useLogout';
import { Tooltip, Button } from '@mui/material';

const CustomAppBar: React.FC = memo(() => {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair e desconectar suas contas?')) {
      logoutMutation.mutate();
    }
  };
  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          
          {/* Logo / Title */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              gap: 1.5,
              '&:hover': { opacity: 0.9 },
              transition: 'opacity 0.2s',
            }}
          >
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                p: 0.75,
                borderRadius: 2,
                display: 'flex',
                boxShadow: (theme) => `0 0 16px ${theme.palette.primary.main}40`,
              }}
            >
              <CloudSyncIcon />
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: -0.5 }}>
              Drive on Git
            </Typography>
          </Box>

          {/* Right Side / Badges */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box 
              component={Link} 
              to="/my-repos" 
              sx={{ 
                color: 'inherit', 
                textDecoration: 'none', 
                fontWeight: 600, 
                fontSize: 14,
                '&:hover': { color: 'primary.light' }
              }}
            >
              Meus Repositórios
            </Box>
            <AuthStatusBadge />
            
            <Tooltip title="Sair do Sistema">
              <Button
                size="small"
                color="inherit"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                startIcon={<LogoutIcon />}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600,
                  ml: 1,
                  px: 2,
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.23)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'white'
                  }
                }}
              >
                {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
              </Button>
            </Tooltip>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
});

export default CustomAppBar;
