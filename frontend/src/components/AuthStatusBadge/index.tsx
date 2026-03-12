import React from 'react';
import { Box, Chip, Tooltip, keyframes } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAuthStatus } from '../../features/auth/hooks/useAuthStatus';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
`;

export const AuthStatusBadge: React.FC = () => {
  // Using Suspense-first data fetching via useSuspenseQuery in the hook
  const { data: status } = useAuthStatus();

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title={status.google ? `Conectado à API do Drive como ${status.googleUser?.email}` : 'Google desconectado'}>
        <Chip
          icon={<GoogleIcon fontSize="small" />}
          label={status.googleUser?.displayName || 'Google'}
          color={status.google ? 'success' : 'default'}
          variant={status.google ? 'filled' : 'outlined'}
          size="small"
          sx={{
            fontWeight: 600,
            animation: status.google ? `${pulse} 2s infinite` : 'none',
          }}
        />
      </Tooltip>
      
      <Tooltip title={status.github ? `Conectado ao GitHub como ${status.githubUser?.login}` : 'GitHub desconectado'}>
        <Chip
          icon={<GitHubIcon fontSize="small" />}
          label={status.githubUser?.login || 'GitHub'}
          color={status.github ? 'success' : 'default'}
          variant={status.github ? 'filled' : 'outlined'}
          size="small"
          sx={{
            fontWeight: 600,
            animation: status.github ? `${pulse} 2s infinite 1s` : 'none', // delayed pulse
          }}
        />
      </Tooltip>
    </Box>
  );
};

export default AuthStatusBadge;
