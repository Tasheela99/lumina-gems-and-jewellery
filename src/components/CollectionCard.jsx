// src/components/CollectionCard.jsx
import DiamondIcon from '@mui/icons-material/Diamond';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CollectionCard = ({ collection }) => {
  const navigate = useNavigate();
  const imageUrl = collection.thumbnailUrl || collection.bannerUrl;

  const handleNavigate = (e) => {
    e?.stopPropagation();
    navigate(`/collections/${collection.slug || collection.id}`);
  };

  return (
    <Card
      className="h-100 d-flex flex-column"
      onClick={handleNavigate}
      sx={(theme) => {
        const isDark = theme.palette.mode === 'dark';
        return {
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          background: isDark
            ? 'linear-gradient(180deg, #161616 0%, #111111 100%)'
            : 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F4 100%)',
          border: isDark
            ? '1px solid rgba(201, 168, 76, 0.18)'
            : '1px solid rgba(27, 67, 50, 0.10)',
          boxShadow: isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.4)'
            : '0 4px 20px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-6px)',
            borderColor: isDark ? 'rgba(201, 168, 76, 0.55)' : 'rgba(27, 67, 50, 0.35)',
            boxShadow: isDark
              ? '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(201, 168, 76, 0.15)'
              : '0 16px 40px rgba(0, 0, 0, 0.09), 0 0 20px rgba(27, 67, 50, 0.06)',
            '& .card-image': {
              transform: 'scale(1.06)',
            },
          },
        };
      }}
    >
      {/* Image Container */}
      <Box
        sx={(theme) => {
          const isDark = theme.palette.mode === 'dark';
          return {
            overflow: 'hidden',
            height: 250,
            position: 'relative',
            background: isDark
              ? 'radial-gradient(circle at center, #1E1E1E 0%, #121212 100%)'
              : 'radial-gradient(circle at center, #FFFFFF 0%, #F5EFE4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          };
        }}
      >
        {imageUrl ? (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={collection.name}
            className="card-image"
            sx={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
          />
        ) : (
          <Box
            className="card-image"
            sx={(theme) => ({
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.5s ease',
            })}
          >
            <DiamondIcon
              sx={(theme) => ({
                fontSize: 64,
                color: theme.palette.mode === 'dark' ? '#C9A84C' : '#2D6A4F',
                opacity: 0.35,
              })}
            />
          </Box>
        )}
      </Box>

      {/* Content: Name only */}
      <CardContent
        sx={{
          flexGrow: 1,
          px: 2.5,
          py: 2,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h6"
          sx={(theme) => ({
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.02rem',
            fontWeight: 600,
            lineHeight: 1.35,
            color: theme.palette.mode === 'dark' ? '#F5F5F0' : '#141412',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            letterSpacing: '0.01em',
          })}
        >
          {collection.name}
        </Typography>
      </CardContent>

      {/* Actions: Show More button */}
      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        <Button
          size="small"
          fullWidth
          onClick={handleNavigate}
          sx={(theme) => {
            const isDark = theme.palette.mode === 'dark';
            return {
              fontSize: '0.74rem',
              py: 1.1,
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
          Show More
        </Button>
      </CardActions>
    </Card>
  );
};

export default CollectionCard;
