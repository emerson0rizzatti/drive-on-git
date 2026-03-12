import React from 'react';
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

interface Props {
  exceedsRepoLimit: boolean;
  totalSizeMB: number;
  oversizedCount: number;
  onAcknowledge: () => void;
  acknowledged: boolean;
}

export const LimitWarningBanner: React.FC<Props> = ({
  exceedsRepoLimit,
  totalSizeMB,
  oversizedCount,
  onAcknowledge,
  acknowledged,
}) => {
  if (!exceedsRepoLimit && oversizedCount === 0) return null;

  return (
    <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {oversizedCount > 0 && (
        <Alert severity="warning" icon={<StorageIcon />} variant="filled">
          <AlertTitle>Files Exceeding 100 MB Limit</AlertTitle>
          {oversizedCount} files are larger than 100 MB. GitHub blocks files above this limit. 
          They will be <strong>skipped</strong> during the cloning process.
        </Alert>
      )}

      {exceedsRepoLimit && (
        <Alert severity="error" variant="filled">
          <AlertTitle>High Risk: Repository Surpasses 1 GB</AlertTitle>
          <Typography variant="body2" gutterBottom>
            The total size of valid files is {totalSizeMB.toFixed(1)} MB, which exceeds GitHub's 1 GB 
            recommended repository limit. Continuing could lead to the repository being disabled by GitHub.
          </Typography>
          {!acknowledged && (
            <Button 
              variant="contained" 
              color="inherit" 
              size="small" 
              sx={{ mt: 1, color: 'error.main' }}
              onClick={onAcknowledge}
            >
              I understand the risks, let me clone anyway
            </Button>
          )}
        </Alert>
      )}
    </Box>
  );
};

export default LimitWarningBanner;
