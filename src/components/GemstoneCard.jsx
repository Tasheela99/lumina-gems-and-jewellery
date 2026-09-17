import DiamondIcon from '@mui/icons-material/Diamond';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const GemstoneCard = ({ gemstone, language = 'en' }) => {
  const categories = useMemo(() => {
    const list = Array.isArray(gemstone?.categories) ? gemstone.categories : [];
    return list.filter(Boolean);
  }, [gemstone]);

  const monthLabel = gemstone?.month ? String(gemstone.month) : null;
  const imageUrl = gemstone?.imageUrls?.[0] || gemstone?.imageUrl || null;

  const displayName =
    language === 'si'
      ? (gemstone?.nameSi || gemstone?.name || 'Untitled Gem')
      : (gemstone?.name || gemstone?.nameSi || 'Untitled Gem');

  const displayDescription =
    language === 'si'
      ? (gemstone?.descriptionSi || gemstone?.description || '')
      : (gemstone?.description || gemstone?.descriptionSi || '');

  return (
    <Card
      className="h-100 d-flex flex-column"
      sx={(theme) => ({
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, #181818 0%, #141414 100%)'
            : 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F4 100%)',
        border:
          theme.palette.mode === 'dark'
            ? '1px solid rgba(201,168,76,0.1)'
            : '1px solid rgba(27, 67, 50, 0.10)',
        boxShadow:
          theme.palette.mode === 'dark'
            ? 'none'
            : '0 4px 20px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          border:
            theme.palette.mode === 'dark'
              ? '1px solid rgba(201,168,76,0.35)'
              : '1px solid rgba(27, 67, 50, 0.35)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 16px 40px rgba(0, 0, 0, 0.7)'
              : '0 16px 40px rgba(0, 0, 0, 0.09)',
        },
      })}
    >
      {/* Image */}
      <Box sx={{ overflow: 'hidden', height: 220, bgcolor: 'background.default' }}>
        {imageUrl ? (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={displayName || 'Gemstone'}
            sx={{ height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={(theme) => ({
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #0D2B20 0%, #1A1A1A 100%)'
                  : 'radial-gradient(circle at center, #FFFFFF 0%, #F5EFE4 100%)',
            })}
          >
            <DiamondIcon sx={{ fontSize: 64, color: theme.palette.mode === 'dark' ? '#C9A84C' : '#2D6A4F', opacity: 0.35 }} />
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.05rem',
              lineHeight: 1.25,
              color: theme.palette.mode === 'dark' ? '#F5F5F0' : '#141412',
            }}
          >
            {displayName}
          </Typography>
          {monthLabel && (
            <Chip
              label={monthLabel}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: 'rgba(201,168,76,0.12)',
                color: 'secondary.main',
                border: '1px solid rgba(201,168,76,0.2)',
              }}
            />
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '0.8rem',
            lineHeight: 1.7,
          }}
        >
          {displayDescription || 'No description provided yet.'}
        </Typography>

        {categories.length > 0 && (
          <Box sx={{ mt: 1.5, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {categories.slice(0, 3).map((c) => (
              <Chip
                key={c}
                label={c}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(27,67,50,0.35)' : 'rgba(27,67,50,0.10)',
                  color: theme.palette.mode === 'dark' ? '#6FCFA0' : '#1B4332',
                  border: '1px solid rgba(27,67,50,0.18)',
                }}
              />
            ))}
          </Box>
        )}

      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        <Button
          size="small"
          fullWidth
          component={RouterLink}
          to={gemstone?.id ? `/gemstone-guide/${gemstone.slug || gemstone.id}` : '/gemstone-guide'}
          sx={(theme) => {
            const isDark = theme.palette.mode === 'dark';
            return {
              fontSize: '0.74rem',
              py: 1,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
              borderRadius: 2,
              border: 'none !important',
              outline: 'none',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              color: isDark ? '#F5D87A' : '#1B4332',
              backgroundColor: isDark ? 'rgba(201, 168, 76, 0.14)' : 'rgba(27, 67, 50, 0.08)',
              boxShadow: isDark ? 'none' : '0 2px 10px rgba(27, 67, 50, 0.05)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                border: 'none !important',
                backgroundColor: isDark ? 'rgba(201, 168, 76, 0.32)' : '#1B4332',
                color: '#FFFFFF',
                boxShadow: isDark
                  ? '0 6px 22px rgba(201, 168, 76, 0.30)'
                  : '0 6px 22px rgba(27, 67, 50, 0.25)',
                transform: 'translateY(-1px)',
              },
            };
          }}
        >
          View More
        </Button>
      </CardActions>
    </Card>
  );
};

export default GemstoneCard;
