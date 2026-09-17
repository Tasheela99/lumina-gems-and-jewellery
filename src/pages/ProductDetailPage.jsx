// src/pages/ProductDetailPage.jsx
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DiamondIcon from '@mui/icons-material/Diamond';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  Link,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import ImageGallery from '../components/ImageGallery';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSnackbar } from '../components/SnackbarAlert';
import { useCart } from '../context/CartContext';
import { getProductBySlugOrId } from '../services/firebase';
import { updateSEO } from '../utils/seo';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { showSnackbar } = useSnackbar();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProductBySlugOrId(slug);
        if (!data) { setNotFound(true); return; }
        setProduct(data);
        
        // Update SEO
        updateSEO({
          title: data.seoTitle || `${data.name} - Lumina Gems`,
          description: data.seoDescription || data.description,
          keywords: data.seoKeywords,
          ogTitle: data.ogTitle || data.name,
          ogDescription: data.ogDescription || data.description
        });
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <Box sx={{ pt: 12 }}><LoadingSpinner /></Box>;

  if (notFound) {
    return (
      <Box className="container lumina-section-container" sx={{ pt: 12, textAlign: 'center' }}>
        <DiamondIcon sx={{ fontSize: 72, color: 'secondary.main', opacity: 0.3, mb: 2 }} />
        <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', mb: 2 }}>
          Product Not Found
        </Typography>
        <Button
          onClick={() => navigate(-1)}
          sx={{
            border: 'none !important',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            background: 'rgba(201, 168, 76, 0.14)',
            color: 'secondary.main',
            px: 3,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              border: 'none !important',
              background: 'rgba(201, 168, 76, 0.28)',
            },
          }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    showSnackbar(`"${product.name}" added to cart`, 'success');
  };

  return (
    <Box sx={{ pb: 12 }}>
      {/* Breadcrumb */}
      <Box sx={{ bgcolor: 'background.paper', py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <Box className="container lumina-section-container">
          <Breadcrumbs sx={{ '& .MuiBreadcrumbs-separator': { color: 'text.secondary' } }}>
            <Link component={RouterLink} to="/" underline="hover" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              Home
            </Link>
            <Link
              component={RouterLink}
              to={product.category === 'Gem' ? '/gems' : '/jewelry'}
              underline="hover"
              sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
            >
              {product.category === 'Gem' ? 'Gems' : 'Jewelry'}
            </Link>
            <Typography color="secondary.main" sx={{ fontSize: '0.8rem' }}>
              {product.name}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Box className="container lumina-section-container" sx={{ pt: 5 }}>
        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            color: 'text.secondary',
            mb: 4,
            border: 'none !important',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 2,
            px: 2,
            py: 0.8,
            '&:hover': {
              color: 'secondary.main',
              background: 'rgba(201,168,76,0.12)',
              border: 'none !important',
            },
            fontSize: '0.8rem',
          }}
        >
          Back
        </Button>

        <Box className="row g-4 g-lg-5">
          {/* ── Image gallery ─────────────────────────────────────────────── */}
          <Box className="col-12 col-md-6">
            <ImageGallery images={product.images || []} />
          </Box>

          {/* ── Details ───────────────────────────────────────────────────── */}
          <Box className="col-12 col-md-6">
            {/* Category chip */}
            <Chip
              icon={<DiamondIcon sx={{ fontSize: '13px !important' }} />}
              label={product.category}
              size="small"
              sx={{
                mb: 2,
                bgcolor: product.category === 'Gem'
                  ? 'rgba(27,67,50,0.7)'
                  : 'rgba(201,168,76,0.15)',
                color: product.category === 'Gem' ? '#6FCFA0' : 'secondary.main',
                border: '1px solid',
                borderColor: product.category === 'Gem'
                  ? 'rgba(111,207,160,0.3)'
                  : 'rgba(201,168,76,0.3)',
              }}
            />

            {/* Name */}
            <Typography
              variant="h3"
              sx={{ fontFamily: '"Playfair Display", serif', mb: 3, lineHeight: 1.2 }}
            >
              {product.name}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* Description */}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.9 }}>
              {product.description}
            </Typography>

            {/* CTA */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4, mt: 2 }}>
              <Button
                color={inCart ? 'success' : 'secondary'}
                size="large"
                startIcon={inCart ? <CheckCircleIcon /> : <ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{
                  flex: 1,
                  minWidth: 180,
                  py: 1.5,
                  border: 'none !important',
                  borderRadius: 2.5,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  background: inCart
                    ? 'rgba(45, 106, 79, 0.75)'
                    : 'rgba(201, 168, 76, 0.30)',
                  color: inCart ? '#FFFFFF' : '#F5D87A',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                  '&:hover': {
                    border: 'none !important',
                    background: inCart
                      ? 'rgba(45, 106, 79, 0.90)'
                      : 'rgba(201, 168, 76, 0.55)',
                    color: '#FFFFFF',
                    boxShadow: '0 12px 36px rgba(201, 168, 76, 0.35)',
                  },
                }}
              >
                {inCart ? 'Added to Cart' : 'Add to Cart'}
              </Button>
              <Button
                size="large"
                onClick={() => navigate('/cart')}
                sx={{
                  px: 4,
                  py: 1.5,
                  border: 'none !important',
                  borderRadius: 2.5,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'text.primary',
                  '&:hover': {
                    border: 'none !important',
                    background: 'rgba(255, 255, 255, 0.18)',
                  },
                }}
              >
                View Cart
              </Button>
            </Box>

            {/* Trust badges */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {[
                { icon: <VerifiedIcon sx={{ fontSize: 18, color: 'secondary.main' }} />, text: 'Certified Authentic' },
                { icon: <LocalShippingIcon sx={{ fontSize: 18, color: 'secondary.main' }} />, text: 'Secure Delivery' },
              ].map(({ icon, text }) => (
                <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  {icon}
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.04em' }}>
                    {text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetailPage;
