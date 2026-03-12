import React, { memo } from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Link } from '@tanstack/react-router';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import AuthStatusBadge from '../AuthStatusBadge';

const CustomAppBar: React.FC = memo(() => {
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
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
});

export default CustomAppBar;
