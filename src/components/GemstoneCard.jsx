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
            : 'linear-gradient(160deg, #FFFFFF 0%, #FBF6ED 60%, #F3EAD8 100%)',
        border:
          theme.palette.mode === 'dark'
            ? '1px solid rgba(201,168,76,0.1)'
            : '1px solid rgba(165,126,30,0.18)',
        boxShadow:
          theme.palette.mode === 'dark'
            ? 'none'
            : '0 2px 12px rgba(100,75,20,0.08)',
        '&:hover': {
          border:
            theme.palette.mode === 'dark'
              ? '1px solid rgba(201,168,76,0.35)'
              : '1px solid rgba(165,126,30,0.5)',
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
                  : 'linear-gradient(135deg, #D4E9DC 0%, #EDE3D0 50%, #E8D9C0 100%)',
            })}
          >
            <DiamondIcon sx={{ fontSize: 64, color: 'secondary.main', opacity: 0.35 }} />
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
                  bgcolor: 'rgba(27,67,50,0.35)',
                  color: '#6FCFA0',
                  border: '1px solid rgba(111,207,160,0.18)',
                }}
              />
            ))}
          </Box>
        )}

      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
        <Button
          size="small"
          component={RouterLink}
          to={gemstone?.id ? `/gemstone-guide/${gemstone.id}` : '/gemstone-guide'}
          sx={{
            fontSize: '0.72rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'secondary.main',
          }}
        >
          View More
        </Button>
      </CardActions>
    </Card>
  );
};

export default GemstoneCard;
