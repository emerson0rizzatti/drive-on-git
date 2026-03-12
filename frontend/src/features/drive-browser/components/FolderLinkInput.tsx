import React, { useState, useCallback } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';

// Helper to extract folder ID from Google Drive URL
const extractFolderId = (url: string): string | null => {
  try {
    const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return match[1];
    
    // Also handle cases like ?id=XYZ
    const parsedUrl = new URL(url);
    const id = parsedUrl.searchParams.get('id');
    if (id) return id;
    
    // Direct ID input
    if (/^[a-zA-Z0-9_-]{15,}$/.test(url)) return url;
    
    return null;
  } catch {
    return null;
  }
};

export const FolderLinkInput: React.FC = () => {
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleContinue = useCallback(() => {
    const folderId = extractFolderId(link);
    if (!folderId) {
      setError('Invalid Google Drive folder link or ID.');
      return;
    }
    setError('');
    navigate({ to: '/inspect', search: { folderId } } as any);
  }, [link, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="body1" color="text.secondary">
        Paste the Google Drive folder link below. Make sure it's a folder, not a single file.
      </Typography>
      
      <TextField
        fullWidth
        label="Google Drive Folder URL"
        variant="outlined"
        placeholder="https://drive.google.com/drive/folders/1a2b3c..."
        value={link}
        onChange={(e) => {
          setLink(e.target.value);
          if (error) setError('');
        }}
        error={!!error}
        helperText={error}
        autoFocus
      />
      
      <Button 
        variant="contained" 
        size="large" 
        onClick={handleContinue}
        disabled={!link.trim()}
      >
        Continue
      </Button>
    </Box>
  );
};

export default FolderLinkInput;
