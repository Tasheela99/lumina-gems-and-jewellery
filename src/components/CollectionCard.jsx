import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const CollectionCard = ({ collection }) => {
  return (
    <Box
      component={Link}
      to={`/collections/${collection.slug}`}
      sx={{
        display: 'block',
        textDecoration: 'none',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: 'rgba(201,168,76,0.4)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          '& .collection-img': {
            transform: 'scale(1.05)',
          }
        }
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', paddingTop: '66%', overflow: 'hidden' }}>
        {collection.thumbnailUrl || collection.bannerUrl ? (
          <Box
            component="img"
            src={collection.thumbnailUrl || collection.bannerUrl}
            alt={collection.name}
            className="collection-img"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(255,255,255,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary">No Image</Typography>
          </Box>
        )}
        
        {collection.featured && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: 'secondary.main',
              color: '#000',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            Featured
          </Box>
        )}
      </Box>

      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Playfair Display", serif',
            color: 'text.primary',
            mb: 0.5
          }}
        >
          {collection.name}
        </Typography>
        
        <Typography
          variant="caption"
          sx={{
            color: 'secondary.main',
            display: 'block',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            mb: 1
          }}
        >
          {collection.type || 'Collection'}
        </Typography>

        {collection.shortDescription && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {collection.shortDescription}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CollectionCard;
