import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CollectionCard from '../components/CollectionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCollections } from '../services/firebase';

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections({ status: 'Active' });
        setCollections(data);
      } catch (err) {
        console.error('Error fetching collections:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const featured = collections.filter(c => c.featured);
  const others = collections.filter(c => !c.featured);

  return (
    <Box>
      {/* Page header */}
      <Box
        sx={(theme) => ({
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #101018 0%, #0A0A0A 60%)'
              : 'linear-gradient(135deg, #E8E1FA 0%, #F5F1E7 60%)',
          py: { xs: 6, md: 10 },
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        })}
      >
        <Box className="container lumina-section-container">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <WorkspacePremiumIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
            <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: '0.2em' }}>
              Our Collections
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontFamily: '"Playfair Display", serif', mb: 1.5 }}>
            Curated Picks
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
            Explore signature selections crafted for gifting, milestones, and everyday elegance.
          </Typography>
        </Box>
      </Box>

      <Box className="container lumina-section-container" sx={{ py: { xs: 6, md: 8 } }}>
        {loading ? (
          <LoadingSpinner message="Loading collections..." />
        ) : collections.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" sx={{ py: 8 }}>
            No active collections found. Check back later!
          </Typography>
        ) : (
          <Box>
            {featured.length > 0 && (
              <Box sx={{ mb: 8 }}>
                <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', mb: 4 }}>
                  Featured Collections
                </Typography>
                <Box className="row g-4">
                  {featured.map(col => (
                    <Box key={col.id} className="col-12 col-md-6 col-lg-4">
                      <CollectionCard collection={col} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {others.length > 0 && (
              <Box>
                <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', mb: 4 }}>
                  All Collections
                </Typography>
                <Box className="row g-4">
                  {others.map(col => (
                    <Box key={col.id} className="col-12 col-md-6 col-lg-4">
                      <CollectionCard collection={col} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CollectionsPage;
