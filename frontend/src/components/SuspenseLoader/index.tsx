import React from 'react';
import { Box, CircularProgress, Typography, alpha } from '@mui/material';

interface SuspenseLoaderProps {
  message?: string;
  minHeight?: string | number;
}

export const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({ 
  message = 'Loading...', 
  minHeight = '50vh' 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        gap: 3,
        animation: 'fadeIn 0.5s ease-in',
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          sx={{ color: (theme) => alpha(theme.palette.primary.main, 0.2) }}
          size={56}
          thickness={4}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: 'primary.main',
            position: 'absolute',
            left: 0,
            animationDuration: '1000ms',
          }}
          size={56}
          thickness={4}
        />
      </Box>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ fontWeight: 500, letterSpacing: 0.5 }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default SuspenseLoader;
