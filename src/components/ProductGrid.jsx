// src/components/ProductGrid.jsx
import { Box } from '@mui/material';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, emptyTitle, emptyDescription }) => {
  if (loading) return <LoadingSpinner message="Loading collection..." />;

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No products found'}
        description={emptyDescription || 'Check back soon for new arrivals.'}
      />
    );
  }

  return (
    <Box className="row g-4 align-items-stretch">
      {products.map((product) => (
        <Box key={product.id} className="col-12 col-sm-6 col-md-4 lumina-grid-col">
          <ProductCard product={product} />
        </Box>
      ))}
    </Box>
  );
};

export default ProductGrid;
