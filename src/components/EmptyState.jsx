// src/components/EmptyState.jsx
import DiamondIcon from '@mui/icons-material/Diamond';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({
  title = 'Nothing here yet',
  description = 'Check back soon for new arrivals.',
  actionLabel = 'Browse Collection',
  actionPath = '/',
  icon = DiamondIcon,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      className="d-flex flex-column align-items-center justify-content-center text-center"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 2,
        textAlign: 'center',
        py: 8,
      }}
    >
      <Box component={icon} sx={{ fontSize: 72, color: 'secondary.main', opacity: 0.4 }} />
      <Typography variant="h5" color="text.secondary" sx={{ fontFamily: '"Playfair Display", serif' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" maxWidth={360}>
        {description}
      </Typography>
      {actionLabel && (
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => navigate(actionPath)}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
