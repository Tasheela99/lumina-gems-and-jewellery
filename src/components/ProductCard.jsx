// src/components/ProductCard.jsx
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DiamondIcon from '@mui/icons-material/Diamond';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { useSnackbar } from './SnackbarAlert';

const ProductCard = ({ product, hidePrice = false, hideActions = false }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { showSnackbar } = useSnackbar();

  const inCart = isInCart(product.id);
  const outOfStock = product.stock === 0;
  const thumbnailUrl = product.images?.[0] || null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product);
    showSnackbar(`"${product.name}" added to cart`, 'success');
  };

  return (
    <Card
      className="h-100 d-flex flex-column"
      onClick={() => navigate(`/product/${product.id}`)}
      sx={(theme) => ({
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, #181818 0%, #141414 100%)'
            : 'linear-gradient(160deg, #FFFFFF 0%, #FBF6ED 60%, #F3EAD8 100%)',
        border: theme.palette.mode === 'dark'
          ? '1px solid rgba(201,168,76,0.1)'
          : '1px solid rgba(165,126,30,0.18)',
        boxShadow: theme.palette.mode === 'dark'
          ? 'none'
          : '0 2px 12px rgba(100,75,20,0.08)',
        '&:hover': {
          border: theme.palette.mode === 'dark'
            ? '1px solid rgba(201,168,76,0.4)'
            : '1px solid rgba(165,126,30,0.55)',
          boxShadow: theme.palette.mode === 'dark'
            ? 'none'
            : '0 10px 32px rgba(100,75,20,0.18)',
          '& .card-image': { transform: 'scale(1.06)' },
        },
      })}
    >
      {/* Category chip */}
      <Chip
        label={product.category}
        size="small"
        icon={<DiamondIcon sx={{ fontSize: '12px !important' }} />}
        sx={(theme) => ({
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 2,
          bgcolor: theme.palette.mode === 'dark'
            ? (product.category === 'Gem' ? 'rgba(27,67,50,0.9)' : 'rgba(201,168,76,0.2)')
            : (product.category === 'Gem' ? 'rgba(27,67,50,0.88)' : 'rgba(165,126,30,0.88)'),
          color: theme.palette.mode === 'dark'
            ? (product.category === 'Gem' ? '#6FCFA0' : 'secondary.main')
            : '#FFFFFF',
          border: '1px solid',
          borderColor: product.category === 'Gem'
            ? 'rgba(111,207,160,0.3)'
            : 'rgba(201,168,76,0.35)',
          fontSize: '0.65rem',
          letterSpacing: '0.06em',
          backdropFilter: 'blur(8px)',
          fontWeight: 600,
        })}
      />

      {/* Out of stock overlay */}
      {outOfStock && (
        <Box
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            bgcolor: 'rgba(0,0,0,0.55)',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', letterSpacing: 4, fontWeight: 600 }}
          >
            Out of Stock
          </Typography>
        </Box>
      )}

      {/* Image */}
      <Box sx={{ overflow: 'hidden', height: 240, bgcolor: 'background.default' }}>
        {thumbnailUrl ? (
          <CardMedia
            component="img"
            image={thumbnailUrl}
            alt={product.name}
            className="card-image"
            sx={{
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
          />
        ) : (
          <Box
            className="card-image"
            sx={(theme) => ({
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.5s ease',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0D2B20 0%, #1A1A1A 100%)'
                : 'linear-gradient(135deg, #D4E9DC 0%, #EDE3D0 50%, #E8D9C0 100%)',
            })}
          >
            <DiamondIcon sx={(theme) => ({ fontSize: 64, color: theme.palette.mode === 'dark' ? 'secondary.main' : '#2D6A4F', opacity: 0.35 })} />
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent className="flex-grow-1" sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.05rem',
            lineHeight: 1.3,
            color: 'text.primary',
          }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1.5,
            fontSize: '0.78rem',
          }}
        >
          {product.description}
        </Typography>
        {!hidePrice && (
        <Typography
          variant="subtitle1"
          sx={{ color: 'secondary.main', fontWeight: 600, letterSpacing: '0.02em' }}
        >
          {formatCurrency(product.price)}
        </Typography>
        )}
      </CardContent>

      {/* Actions */}
      {!hideActions && (
      <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          fullWidth
          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
          sx={(theme) => ({
            fontSize: '0.7rem',
            py: 0.8,
            ...(theme.palette.mode === 'light' ? {
              borderColor: 'rgba(45,106,79,0.45)',
              color: '#2D6A4F',
              '&:hover': {
                borderColor: '#2D6A4F',
                bgcolor: 'rgba(45,106,79,0.06)',
              },
            } : {}),
          })}
        >
          View Details
        </Button>
        <Tooltip title={inCart ? 'Already in cart' : outOfStock ? 'Out of stock' : 'Add to cart'}>
          <span>
            <IconButton
              onClick={handleAddToCart}
              disabled={outOfStock}
              size="small"
              sx={(theme) => ({
                bgcolor: inCart
                  ? 'rgba(201,168,76,0.15)'
                  : theme.palette.mode === 'dark' ? 'rgba(27,67,50,0.4)' : 'rgba(27,67,50,0.12)',
                border: '1px solid',
                borderColor: inCart ? 'secondary.main' : 'primary.main',
                color: inCart ? 'secondary.main' : 'primary.main',
                '&:hover': {
                  bgcolor: inCart
                    ? 'rgba(201,168,76,0.25)'
                    : theme.palette.mode === 'dark' ? 'rgba(27,67,50,0.7)' : 'rgba(27,67,50,0.22)',
                },
                transition: 'all 0.2s ease',
              })}
            >
              {inCart ? <CheckCircleIcon fontSize="small" /> : <ShoppingCartIcon fontSize="small" />}
            </IconButton>
          </span>
        </Tooltip>
      </CardActions>
      )}
    </Card>
  );
};

export default ProductCard;
