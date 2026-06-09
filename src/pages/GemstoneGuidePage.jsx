import DiamondIcon from '@mui/icons-material/Diamond';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Chip,
    InputAdornment,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import GemstoneCard from '../components/GemstoneCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getGemstones } from '../services/firebase';
import {
    BIRTHSTONES_BY_MONTH,
    GEMSTONE_CATEGORIES,
    GEMSTONE_MONTHS,
} from '../utils/constants';

const GemstoneGuidePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gemstones, setGemstones] = useState([]);

  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('lumina_gemstone_language');
    return stored === 'si' ? 'si' : 'en';
  });

  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    document.title = 'Gemstone Guide | Lumina';
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina_gemstone_language', language);
  }, [language]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getGemstones({
          status: 'Active',
          month: monthFilter || null,
          category: categoryFilter || null,
        });
        setGemstones(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load gemstones. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [monthFilter, categoryFilter]);

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

  const filteredGemstones = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return gemstones;
    return gemstones.filter((g) => String(getLocalized(g, 'name') || '').toLowerCase().includes(term));
  }, [gemstones, search, language]);

  let listContent = null;
  if (loading) {
    listContent = <LoadingSpinner message="Loading gemstones..." />;
  } else if (error) {
    listContent = <Typography color="error" textAlign="center">{error}</Typography>;
  } else if (filteredGemstones.length === 0) {
    listContent = (
      <EmptyState
        title="No gemstones found"
        description={search ? 'Try a different search or clear filters.' : 'No gemstones are available yet.'}
      />
    );
  } else {
    listContent = (
      <Box className="row g-4 align-items-stretch">
        {filteredGemstones.map((g) => (
          <Box key={g.id} className="col-12 col-sm-6 col-md-4 lumina-grid-col">
            <GemstoneCard gemstone={g} language={language} />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
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
            <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: '0.2em' }}>
              Learn
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontFamily: '"Playfair Display", serif', mb: 1.5 }}>
            Gemstone Guide
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680 }}>
            Discover gemstones, their history, symbolism, and how they are traditionally used.
            Browse by month or category, then open a gemstone to read more.
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box className="container lumina-section-container" sx={{ py: { xs: 6, md: 8 } }}>
        {/* Birthstones */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h4"
            sx={{ fontFamily: '"Playfair Display", serif', mb: 1.5 }}
          >
            Birthstones by Month
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720, mb: 2.5, lineHeight: 1.8 }}>
            Birthstones are gemstones traditionally associated with each month of the year.
            Use this as a starting point for choosing meaningful gifts or personal jewelry.
          </Typography>

          <Box className="row g-2">
            {BIRTHSTONES_BY_MONTH.map(({ month, stone }) => (
              <Box key={month} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <Chip
                  label={`${month} — ${stone}`}
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    bgcolor: 'rgba(201,168,76,0.10)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    color: 'text.primary',
                    py: 2,
                    '& .MuiChip-label': { fontSize: '0.75rem' },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Intro + Filters */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{ fontFamily: '"Playfair Display", serif', mb: 1.5 }}
          >
            Explore Gemstones
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720, lineHeight: 1.8 }}>
            Gemstones have been valued for centuries for their beauty and cultural meaning.
            Many are linked to birth months, zodiac traditions, and symbolic benefits.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <TextField
            placeholder="Search gemstones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: { xs: '100%', sm: 280 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
            <TextField
              select
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              size="small"
              sx={{ minWidth: 150, width: { xs: '100%', sm: 150 } }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="si">සිංහල</MenuItem>
            </TextField>

            <TextField
              select
              label="Month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 180, width: { xs: '100%', sm: 180 } }}
            >
              <MenuItem value="">All months</MenuItem>
              {GEMSTONE_MONTHS.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 200, width: { xs: '100%', sm: 200 } }}
            >
              <MenuItem value="">All categories</MenuItem>
              {GEMSTONE_CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        {/* List */}
        {listContent}
      </Box>
    </Box>
  );
};

export default GemstoneGuidePage;
