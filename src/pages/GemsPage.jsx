// src/pages/GemsPage.jsx
import DiamondIcon from '@mui/icons-material/Diamond';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { subscribeToProducts } from '../services/firebase';
import { updateSEO } from '../utils/seo';

const GemsPage = () => {
  useEffect(() => {
    updateSEO({
      title: 'Shop Gems | Lumina Gems and Jewellery',
      description: 'Browse our collection of ethically sourced, brilliant loose gemstones. Find the perfect sapphire, ruby, or emerald.'
    });
  }, []);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToProducts((data) => {
      setProducts(data);
      setLoading(false);
      setError(null);
    }, 'Gem');

    // We don't have a direct error callback supported in our subscribe wrapper currently,
    // so we handle the happy path. If it fails to setup, it returns a no-op function.

    return () => unsubscribe();
  }, []);

  return (
    <Box>
      {/* Page header */}
      <Box
        sx={(theme) => ({
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0D2B20 0%, #0A0A0A 60%)'
              : 'linear-gradient(135deg, #DCEADD 0%, #F5F1E7 60%)',
          py: { xs: 6, md: 10 },
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        })}
      >
        <Box className="container lumina-section-container">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <DiamondIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
            <Typography
              variant="overline"
              sx={{ color: 'secondary.main', letterSpacing: '0.2em' }}
            >
              Collection
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{ fontFamily: '"Playfair Display", serif', mb: 1.5 }}
          >
            Rare Gemstones
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 540 }}>
            Explore our curated selection of certified natural gemstones — sapphires,
            rubies, emeralds, and beyond — sourced from the legendary mines of Sri Lanka.
          </Typography>
        </Box>
      </Box>

      {/* Products */}
      <Box className="container lumina-section-container" sx={{ py: { xs: 6, md: 8 } }}>
        {error ? (
          <Typography color="error" textAlign="center">{error}</Typography>
        ) : (
          <ProductGrid
            products={products}
            loading={loading}
            emptyTitle="No gems available yet"
            emptyDescription="Our gemstone collection is being curated. Please check back soon."
          />
        )}
      </Box>
    </Box>
  );
};

export default GemsPage;
