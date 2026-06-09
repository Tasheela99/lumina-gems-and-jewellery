// src/pages/CartPage.jsx
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DiamondIcon from '@mui/icons-material/Diamond';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarAlert';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

// ── Single cart row ──────────────────────────────────────────────────────────
const CartItem = ({ item, onRemove, onQtyChange }) => (
  <Box
    sx={(theme) => ({
      display: 'flex',
      gap: 2,
      p: 2.5,
      borderRadius: 2,
      bgcolor: theme.palette.background.paper,
      border: '1px solid',
      borderColor: theme.palette.divider,
      alignItems: 'center',
      flexWrap: { xs: 'wrap', sm: 'nowrap' },
      transition: 'border-color 0.2s',
      '&:hover': { borderColor: 'rgba(201,168,76,0.2)' },
    })}
  >
    {/* Thumbnail */}
    <Box
      sx={{
        width: 80,
        height: 80,
        flexShrink: 0,
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'background.default',
        cursor: 'pointer',
      }}
      onClick={() => {}}
    >
      {item.images?.[0] ? (
        <Box
          component="img"
          src={item.images[0]}
          alt={item.name}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DiamondIcon sx={{ color: 'secondary.main', opacity: 0.3 }} />
        </Box>
      )}
    </Box>

    {/* Info */}
    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
      <Typography
        variant="subtitle1"
        sx={{ fontFamily: '"Playfair Display", serif', fontSize: '0.95rem', mb: 0.3 }}
        noWrap
      >
        {item.name}
      </Typography>
      <Chip
        label={item.category}
        size="small"
        sx={{
          height: 18,
          fontSize: '0.6rem',
          color: 'text.secondary',
          bgcolor: 'rgba(255,255,255,0.05)',
          letterSpacing: '0.06em',
        }}
      />
      <Typography variant="body2" sx={{ color: 'secondary.main', mt: 0.8, fontWeight: 500 }}>
        {formatCurrency(item.price)}
      </Typography>
    </Box>

    {/* Quantity stepper */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <IconButton
        size="small"
        onClick={() => onQtyChange(item.id, item.quantity - 1)}
        sx={{
          width: 28, height: 28,
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'text.secondary',
          '&:hover': { borderColor: 'secondary.main', color: 'secondary.main' },
        }}
      >
        <RemoveIcon sx={{ fontSize: 14 }} />
      </IconButton>
      <Typography
        sx={{
          width: 36,
          textAlign: 'center',
          fontWeight: 600,
          color: 'text.primary',
          fontSize: '0.9rem',
        }}
      >
        {item.quantity}
      </Typography>
      <IconButton
        size="small"
        onClick={() => onQtyChange(item.id, item.quantity + 1)}
        disabled={item.quantity >= item.stock}
        sx={{
          width: 28, height: 28,
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'text.secondary',
          '&:hover': { borderColor: 'secondary.main', color: 'secondary.main' },
          '&.Mui-disabled': { opacity: 0.3 },
        }}
      >
        <AddIcon sx={{ fontSize: 14 }} />
      </IconButton>
    </Box>

    {/* Line total */}
    <Typography
      sx={{
        minWidth: 110,
        textAlign: 'right',
        fontWeight: 600,
        color: 'text.primary',
        fontSize: '0.9rem',
        display: { xs: 'none', sm: 'block' },
      }}
    >
      {formatCurrency(item.price * item.quantity)}
    </Typography>

    {/* Remove */}
    <IconButton
      onClick={() => onRemove(item.id)}
      size="small"
      sx={{
        color: 'text.secondary',
        '&:hover': { color: 'error.main', bgcolor: 'rgba(244,67,54,0.08)' },
        transition: 'all 0.2s ease',
      }}
    >
      <DeleteOutlineIcon fontSize="small" />
    </IconButton>
  </Box>
);

// ── Order Summary ────────────────────────────────────────────────────────────
const OrderSummary = ({ subtotal, count, onCheckout, onClear }) => {
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <Box
      sx={(theme) => ({
        p: 3,
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        border: '1px solid rgba(201,168,76,0.15)',
        position: 'sticky',
        top: 100,
      })}
    >
      <Typography
        variant="h6"
        sx={{ fontFamily: '"Playfair Display", serif', mb: 3, letterSpacing: '0.02em' }}
      >
        Order Summary
      </Typography>

      {[
        { label: `Subtotal (${count} items)`, value: formatCurrency(subtotal) },
        { label: 'Shipping', value: 'Free' },
      ].map(({ label, value }) => (
        <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          <Typography variant="body2" sx={{ color: value === 'Free' ? 'success.main' : 'text.primary' }}>
            {value}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Total</Typography>
        <Typography variant="subtitle1" sx={{ color: 'secondary.main', fontWeight: 700 }}>
          {formatCurrency(total)}
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        size="large"
        endIcon={<ArrowForwardIcon />}
        onClick={onCheckout}
        sx={{ mb: 1.5, py: 1.4 }}
      >
        Proceed to Checkout
      </Button>

      <Button
        variant="text"
        fullWidth
        size="small"
        onClick={onClear}
        sx={{ color: 'text.secondary', fontSize: '0.75rem', '&:hover': { color: 'error.main' } }}
      >
        Clear Cart
      </Button>
    </Box>
  );
};

// ── Main Cart Page ───────────────────────────────────────────────────────────
const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const { showSnackbar } = useSnackbar();

  const handleRemove = (id) => {
    removeFromCart(id);
    showSnackbar('Item removed from cart', 'info');
  };

  const handleClear = () => {
    clearCart();
    showSnackbar('Cart cleared', 'warning');
  };

  const handleCheckout = () => {
    showSnackbar('Checkout coming soon!', 'info');
  };

  return (
    <Box sx={{ pb: 12 }}>
      {/* Header */}
      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.background.paper,
          borderBottom: '1px solid rgba(201,168,76,0.1)',
          py: { xs: 5, md: 8 },
        })}
      >
        <Box className="container lumina-section-container">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <ShoppingCartIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
            <Typography
              variant="overline"
              sx={{ color: 'secondary.main', letterSpacing: '0.2em' }}
            >
              My Cart
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif' }}>
            Shopping Cart
          </Typography>
        </Box>
      </Box>

      <Box className="container lumina-section-container" sx={{ pt: 5 }}>
        {cartItems.length === 0 ? (
          /* Empty state */
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
            <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', color: 'text.secondary', mb: 1 }}>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Explore our collection and add some beautiful pieces.
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Box className="row g-4">
            {/* Items list */}
            <Box className="col-12 col-md-8">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                    onQtyChange={updateQuantity}
                  />
                ))}
              </Box>
              <Button
                variant="text"
                startIcon={<ArrowForwardIcon sx={{ transform: 'rotate(180deg)' }} />}
                onClick={() => navigate('/')}
                sx={{ mt: 3, color: 'text.secondary', '&:hover': { color: 'secondary.main' }, fontSize: '0.8rem' }}
              >
                Continue Shopping
              </Button>
            </Box>

            {/* Summary */}
            <Box className="col-12 col-md-4">
              <OrderSummary
                subtotal={cartTotal}
                count={cartCount}
                onCheckout={handleCheckout}
                onClear={handleClear}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CartPage;
