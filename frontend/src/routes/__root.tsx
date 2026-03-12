import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { Suspense } from 'react';
import { appTheme } from '../theme';
import SuspenseLoader from '../components/SuspenseLoader';
import CustomAppBar from '../components/CustomAppBar';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CustomAppBar />
        <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 4, display: 'flex', flexDirection: 'column' }}>
          <Suspense fallback={<SuspenseLoader message="Loading Drive on Git..." />}>
            <Outlet />
          </Suspense>
        </Container>
      </Box>
      <Suspense fallback={null}>
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      </Suspense>
    </ThemeProvider>
  );
}
