// src/components/LoadingSpinner.jsx
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <Box
    className="d-flex flex-column align-items-center justify-content-center"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300,
      gap: 2,
    }}
  >
    <CircularProgress sx={{ color: 'secondary.main' }} size={48} thickness={3} />
    <Typography variant="body2" color="text.secondary" letterSpacing={2}>
      {message.toUpperCase()}
    </Typography>
  </Box>
);

export default LoadingSpinner;
