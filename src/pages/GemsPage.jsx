// src/pages/GemsPage.jsx
import DiamondIcon from '@mui/icons-material/Diamond';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { getProducts } from '../services/firebase';

const GemsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts('Gem');
        setProducts(data);
      } catch (err) {
        setError('Failed to load gems. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
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
