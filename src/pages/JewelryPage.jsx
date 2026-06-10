// src/pages/JewelryPage.jsx
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { subscribeToProducts } from '../services/firebase';
import { updateSEO } from '../utils/seo';

const JewelryPage = () => {
  useEffect(() => {
    updateSEO({
      title: 'Shop Jewelry | Lumina Gems and Jewellery',
      description: 'Explore handcrafted fine jewelry from Lumina. Elegant necklaces, rings, and earrings designed for brilliance.'
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
    }, 'Jewelry');

    return () => unsubscribe();
  }, []);

  return (
    <Box>
      {/* Page header */}
      <Box
        sx={(theme) => ({
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1A1200 0%, #0A0A0A 60%)'
              : 'linear-gradient(135deg, #F3EAD4 0%, #F9F5E9 60%)',
          py: { xs: 6, md: 10 },
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        })}
      >
        <Box className="container lumina-section-container">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <AutoAwesomeIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
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
            Exquisite Jewelry
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 540 }}>
            From delicate necklaces to statement rings — every piece in our jewelry collection
            is handcrafted by master artisans using ethically sourced gemstones and precious metals.
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
            emptyTitle="No jewelry available yet"
            emptyDescription="Our jewelry collection is being crafted. Please check back soon."
          />
        )}
      </Box>
    </Box>
  );
};

export default JewelryPage;
