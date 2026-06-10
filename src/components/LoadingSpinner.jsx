import { Box, Typography } from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300,
      gap: 3,
    }}
  >
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 64,
        height: 64,
        borderRadius: '50%',
        bgcolor: 'rgba(201,168,76,0.05)',
        // The spinning ring
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -2,
          left: -2,
          right: -2,
          bottom: -2,
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: 'secondary.main',
          borderRightColor: 'rgba(201,168,76,0.2)',
          borderBottomColor: 'rgba(201,168,76,0.2)',
          borderLeftColor: 'rgba(201,168,76,0.2)',
          opacity: 0.8,
          animation: 'spinRing 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
        },
        // A subtle static outer glow
        boxShadow: '0 0 20px rgba(201,168,76,0.15)',
        '@keyframes spinRing': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    >
      {/* The stationary gem */}
      <DiamondIcon 
        sx={{ 
          color: 'secondary.main', 
          fontSize: 28,
          animation: 'pulseOpacity 2s ease-in-out infinite',
          '@keyframes pulseOpacity': {
            '0%': { opacity: 0.6, transform: 'scale(0.95)' },
            '50%': { opacity: 1, transform: 'scale(1.05)', filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.6))' },
            '100%': { opacity: 0.6, transform: 'scale(0.95)' },
          }
        }} 
      />
    </Box>
    <Typography 
      variant="body2" 
      sx={{ 
        color: 'secondary.main',
        fontFamily: '"Playfair Display", serif',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        opacity: 0.8,
        animation: 'pulseText 2s ease-in-out infinite',
        '@keyframes pulseText': {
          '0%': { opacity: 0.5 },
          '50%': { opacity: 0.9 },
          '100%': { opacity: 0.5 },
        }
      }}
    >
      {message}
    </Typography>
  </Box>
);

export default LoadingSpinner;
