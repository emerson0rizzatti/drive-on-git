import React, { useState, useCallback } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Breadcrumbs, Link, Paper, Button } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from '@tanstack/react-router';
import { useRootFolders, useFolderContents } from '../hooks/useDriveFolders';
import type { DriveFolder } from '../types';

interface BreadcrumbItem {
  id: string;
  name: string;
}

const FolderContentsBrowser: React.FC<{ 
  folderId: string; 
  onSelectFolder: (f: DriveFolder) => void 
}> = ({ folderId, onSelectFolder }) => {
  const { data } = useFolderContents(folderId);

  return (
    <List disablePadding>
      {data.folders.map((folder: DriveFolder) => (
        <ListItem disablePadding key={folder.id} divider>
          <ListItemButton onClick={() => onSelectFolder(folder)}>
            <ListItemIcon>
              <FolderIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={folder.name} />
          </ListItemButton>
        </ListItem>
      ))}
      {data.files.map((file) => (
        <ListItem disablePadding key={file.id} divider>
          <ListItemButton disabled>
            <ListItemIcon>
              <InsertDriveFileIcon color="disabled" />
            </ListItemIcon>
            <ListItemText 
              primary={file.name} 
              secondary="Arquivos não podem ser navegados, apenas pastas podem ser selecionadas como origem" 
            />
          </ListItemButton>
        </ListItem>
      ))}
      {data.folders.length === 0 && data.files.length === 0 && (
        <Box p={3} textAlign="center">
          <Typography color="text.secondary">Esta pasta está vazia.</Typography>
        </Box>
      )}
    </List>
  );
};

export const DriveBrowser: React.FC = () => {
  const { data: rootFolders } = useRootFolders();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const navigate = useNavigate();

  const currentFolderId = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].id : null;

  const handleSelectFolder = useCallback((folder: DriveFolder) => {
    setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
  }, []);

  const handleBreadcrumbClick = useCallback((index: number) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  }, []);

  const handleGoRoot = useCallback(() => {
    setBreadcrumbs([]);
  }, []);

  const handleConfirmSelection = useCallback(() => {
    if (!currentFolderId) return;
    navigate({ to: '/inspect', search: { folderId: currentFolderId } } as any);
  }, [currentFolderId, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      
      {/* Breadcrumbs */}
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link 
            component="button" 
            variant="body1" 
            onClick={handleGoRoot}
            color={breadcrumbs.length === 0 ? 'text.primary' : 'inherit'}
            underline={breadcrumbs.length === 0 ? 'none' : 'hover'}
          >
            Meu Drive (Raiz)
          </Link>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <Link
                key={crumb.id}
                component="button"
                variant="body1"
                onClick={() => handleBreadcrumbClick(index)}
                color={isLast ? 'text.primary' : 'inherit'}
                underline={isLast ? 'none' : 'hover'}
              >
                {crumb.name}
              </Link>
            );
          })}
        </Breadcrumbs>

        {currentFolderId && (
          <Button variant="contained" size="small" onClick={handleConfirmSelection} color="secondary">
            Clonar esta pasta
          </Button>
        )}
      </Paper>

      {/* Folder Contents */}
      <Paper sx={{ maxHeight: '60vh', overflow: 'auto' }}>
        {currentFolderId ? (
          <React.Suspense fallback={<Box p={4} textAlign="center"><Typography>Carregando pasta...</Typography></Box>}>
            <FolderContentsBrowser folderId={currentFolderId} onSelectFolder={handleSelectFolder} />
          </React.Suspense>
        ) : (
          <List disablePadding>
            {rootFolders.map((folder) => (
              <ListItem disablePadding key={folder.id} divider>
                <ListItemButton onClick={() => handleSelectFolder(folder)}>
                  <ListItemIcon>
                    <FolderIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={folder.name} />
                </ListItemButton>
              </ListItem>
            ))}
            {rootFolders.length === 0 && (
              <Box p={3} textAlign="center">
                <Typography color="text.secondary">Nenhuma pasta encontrada na raiz.</Typography>
              </Box>
            )}
          </List>
        )}
      </Paper>

    </Box>
  );
};

export default DriveBrowser;
