import { Box, Chip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { getCollectionBySlug, getProductById } from '../services/firebase';

const CollectionDetailPage = () => {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
        const col = await getCollectionBySlug(slug);
        if (col) {
          setCollection(col);
          if (col.productIds && col.productIds.length > 0) {
            const prods = await Promise.all(col.productIds.map(id => getProductById(id)));
            setProducts(prods.filter(Boolean));
          }
        }
      } catch (err) {
        console.error('Error fetching collection:', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchCollection();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading collection..." />;
  
  if (!collection) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" color="text.secondary">Collection not found.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Dynamic Banner Header */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '50vh', md: '70vh' },
          bgcolor: '#0a0a0a',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {collection.bannerUrl ? (
          <Box
            component="img"
            src={collection.bannerUrl}
            alt={collection.name}
            sx={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover', opacity: 0.6
            }}
          />
        ) : collection.thumbnailUrl ? (
          <Box
            component="img"
            src={collection.thumbnailUrl}
            alt={collection.name}
            sx={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover', opacity: 0.4, filter: 'blur(10px)'
            }}
          />
        ) : null}
        
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: 3, maxWidth: 800 }}>
          <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: '0.2em', display: 'block', mb: 2 }}>
            {collection.type || 'Collection'}
          </Typography>
          <Typography variant="h1" sx={{ fontFamily: '"Playfair Display", serif', color: '#fff', mb: 3, fontSize: { xs: '3rem', md: '5rem' } }}>
            {collection.name}
          </Typography>
          {collection.shortDescription && (
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
              {collection.shortDescription}
            </Typography>
          )}
        </Box>
      </Box>

      <Box className="container lumina-section-container" sx={{ py: { xs: 6, md: 10 } }}>
        <Box className="row g-5">
          {/* Detailed description side */}
          <Box className="col-12 col-md-8">
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 2, fontSize: '1.1rem', mb: 6, whiteSpace: 'pre-line' }}>
              {collection.detailedDescription || collection.shortDescription}
            </Typography>
            
            {/* Gallery */}
            {collection.galleryUrls && collection.galleryUrls.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', mb: 4 }}>
                  Inspiration
                </Typography>
                <Box className="row g-3">
                  {collection.galleryUrls.map((url, i) => (
                    <Box key={i} className="col-6 col-md-4">
                      <Box
                        component="img"
                        src={url}
                        alt={`Gallery ${i}`}
                        sx={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 2 }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
          
          {/* Details Sidebar */}
          <Box className="col-12 col-md-4">
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(201,168,76,0.15)' }}>
              <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', mb: 3, color: 'secondary.main' }}>
                Collection Details
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {collection.occasion && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Occasion</Typography>
                    <Typography variant="body2">{collection.occasion}</Typography>
                  </Box>
                )}
                {collection.style && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Style</Typography>
                    <Typography variant="body2">{collection.style}</Typography>
                  </Box>
                )}
                {collection.metalTypes && collection.metalTypes.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>Metals</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {collection.metalTypes.map(m => <Chip key={m} label={m} size="small" variant="outlined" sx={{ borderColor: 'rgba(201,168,76,0.3)', color: 'text.secondary' }} />)}
                    </Box>
                  </Box>
                )}
                {collection.primaryGemstone && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Primary Gemstone</Typography>
                    <Typography variant="body2">{collection.primaryGemstone}</Typography>
                  </Box>
                )}
                {(collection.startingPrice > 0 || collection.maxPrice > 0) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Price Range</Typography>
                    <Typography variant="body2" color="secondary.main" fontWeight={500}>
                      {collection.startingPrice ? `Rs. ${collection.startingPrice.toLocaleString()}` : ''}
                      {collection.startingPrice && collection.maxPrice ? ' - ' : ''}
                      {collection.maxPrice ? `Rs. ${collection.maxPrice.toLocaleString()}` : ''}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Assigned Products */}
        {products.length > 0 && (
          <Box sx={{ mt: 8, pt: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', textAlign: 'center', mb: 2 }}>
              The Pieces
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
              Explore the exquisite items featured in this collection.
            </Typography>
            
            <Box className="row g-4">
              {products.map(product => (
                <Box key={product.id} className="col-12 col-md-6 col-lg-3 lumina-grid-col">
                  <ProductCard product={product} hidePrice hideActions />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CollectionDetailPage;
