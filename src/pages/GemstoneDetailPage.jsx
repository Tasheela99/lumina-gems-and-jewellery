// src/pages/GemstoneDetailPage.jsx
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DiamondIcon from '@mui/icons-material/Diamond';
import {
    Box,
    Breadcrumbs,
    Button,
    Chip,
    Divider,
    Link,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import ImageGallery from '../components/ImageGallery';
import LoadingSpinner from '../components/LoadingSpinner';
import { getGemstoneById } from '../services/firebase';
import { updateSEO } from '../utils/seo';

const GemstoneDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('lumina_gemstone_language');
    return stored === 'si' ? 'si' : 'en';
  });

  const [gemstone, setGemstone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    localStorage.setItem('lumina_gemstone_language', language);
  }, [language]);

  const getLocalized = (g, field) => {
    if (!g) return '';

    if (language === 'si') {
      if (field === 'name') return g.nameSi || g.name || '';
      if (field === 'description') return g.descriptionSi || g.description || '';
      if (field === 'benefits') return g.benefitsSi || g.benefits || '';
      return '';
    }

    if (field === 'name') return g.name || g.nameSi || '';
    if (field === 'description') return g.description || g.descriptionSi || '';
    if (field === 'benefits') return g.benefits || g.benefitsSi || '';
    return '';
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getGemstoneById(id);
        if (!data) {
          setNotFound(true);
          return;
        }
        setGemstone(data);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    const name = getLocalized(gemstone, 'name');
    const description = getLocalized(gemstone, 'description');
    if (name) {
      updateSEO({
        title: gemstone?.seoTitle || `${name} | Gemstone Guide | Lumina`,
        description: gemstone?.seoDescription || description,
        keywords: gemstone?.seoKeywords,
        ogTitle: gemstone?.ogTitle || name,
        ogDescription: gemstone?.ogDescription || description
      });
    }
  }, [gemstone, language]);

  const images = useMemo(() => {
    const list = Array.isArray(gemstone?.imageUrls) ? gemstone.imageUrls : [];
    if (list.length > 0) return list.filter(Boolean);
    if (gemstone?.imageUrl) return [gemstone.imageUrl];
    return [];
  }, [gemstone]);

  const categories = useMemo(() => {
    const list = Array.isArray(gemstone?.categories) ? gemstone.categories : [];
    return list.map((c) => String(c).trim()).filter(Boolean);
  }, [gemstone]);

  if (loading) {
    return (
      <Box sx={{ pt: 12 }}>
        <LoadingSpinner />
      </Box>
    );
  }

  if (notFound || !gemstone) {
    return (
      <Box className="container lumina-section-container" sx={{ pt: 12, textAlign: 'center' }}>
        <DiamondIcon sx={{ fontSize: 72, color: 'secondary.main', opacity: 0.3, mb: 2 }} />
        <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', mb: 2 }}>
          Gemstone Not Found
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 12 }}>
      {/* Breadcrumb */}
      <Box sx={{ bgcolor: 'background.paper', py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <Box className="container lumina-section-container">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Breadcrumbs sx={{ '& .MuiBreadcrumbs-separator': { color: 'text.secondary' } }}>
              <Link component={RouterLink} to="/" underline="hover" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                Home
              </Link>
              <Link component={RouterLink} to="/gemstone-guide" underline="hover" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                Gemstone Guide
              </Link>
              <Typography color="secondary.main" sx={{ fontSize: '0.8rem' }}>
                {getLocalized(gemstone, 'name')}
              </Typography>
            </Breadcrumbs>

            <TextField
              select
              label="Language"
              size="small"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="si">සිංහල</MenuItem>
            </TextField>
          </Box>
        </Box>
      </Box>

      <Box className="container lumina-section-container" sx={{ pt: 5 }}>
        {/* Back */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ color: 'text.secondary', mb: 4, '&:hover': { color: 'secondary.main' }, fontSize: '0.8rem' }}
        >
          Back
        </Button>

        <Box className="row g-4 g-lg-5">
          <Box className="col-12 col-md-6">
            <ImageGallery images={images} />
          </Box>

          <Box className="col-12 col-md-6">
            {/* Month/status */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {gemstone.month && (
                <Chip
                  label={String(gemstone.month)}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(201,168,76,0.12)',
                    color: 'secondary.main',
                    border: '1px solid rgba(201,168,76,0.2)',
                  }}
                />
              )}
              {gemstone.status && (
                <Chip
                  label={String(gemstone.status)}
                  size="small"
                  sx={{
                    bgcolor: gemstone.status === 'Inactive' ? 'rgba(244,67,54,0.1)' : 'rgba(102,187,106,0.1)',
                    color: gemstone.status === 'Inactive' ? 'error.main' : 'success.main',
                    border: '1px solid',
                    borderColor: gemstone.status === 'Inactive' ? 'rgba(244,67,54,0.2)' : 'rgba(102,187,106,0.2)',
                  }}
                />
              )}
            </Box>

            <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', mb: 1, lineHeight: 1.2 }}>
              {getLocalized(gemstone, 'name')}
            </Typography>

            {categories.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {categories.map((c) => (
                  <Chip
                    key={c}
                    label={c}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.7rem',
                      bgcolor: 'rgba(27,67,50,0.6)',
                      color: '#6FCFA0',
                      border: '1px solid rgba(111,207,160,0.2)',
                    }}
                  />
                ))}
              </Box>
            )}

            <Divider sx={{ mb: 3 }} />

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.9 }}>
              {getLocalized(gemstone, 'description') || 'No description provided yet.'}
            </Typography>

            <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: '0.18em' }}>
              Benefits / Symbolism
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.85 }}>
              {getLocalized(gemstone, 'benefits') || '—'}
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Button
                component={RouterLink}
                to="/gemstone-guide"
                variant="outlined"
                color="secondary"
              >
                Back to Guide
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GemstoneDetailPage;
