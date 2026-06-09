// src/components/ImageGallery.jsx
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import DiamondIcon from '@mui/icons-material/Diamond';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import {
    Backdrop,
    Box,
    Fade,
    IconButton,
    Modal,
} from '@mui/material';
import { useState } from 'react';

const ImageGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <Box
        className="d-flex align-items-center justify-content-center"
        sx={{
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <DiamondIcon sx={{ fontSize: 80, color: 'secondary.main', opacity: 0.2 }} />
      </Box>
    );
  }

  const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <Box>
      {/* Main image */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: '1px solid rgba(201,168,76,0.1)',
          cursor: 'zoom-in',
          '&:hover .zoom-icon': { opacity: 1 },
        }}
        onClick={() => openLightbox(activeIndex)}
      >
        <Box
          component="img"
          src={images[activeIndex]}
          alt={`Product image ${activeIndex + 1}`}
          sx={{
            width: '100%',
            height: { xs: 300, md: 420 },
            objectFit: 'cover',
            display: 'block',
            transition: 'opacity 0.3s ease',
          }}
        />
        {/* Zoom hint */}
        <Box
          className="zoom-icon"
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            bgcolor: 'rgba(0,0,0,0.6)',
            borderRadius: '50%',
            p: 0.5,
            opacity: 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <ZoomInIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
        </Box>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              sx={{
                position: 'absolute', left: 8, top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'secondary.main',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
              }}
              size="small"
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              sx={{
                position: 'absolute', right: 8, top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'secondary.main',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
              }}
              size="small"
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <Box className="d-flex gap-2 mt-3 overflow-auto pb-2" sx={{ overflowX: 'auto' }}>
          {images.map((img, idx) => (
            <Box
              key={idx}
              component="img"
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              sx={{
                width: 72,
                height: 72,
                objectFit: 'cover',
                borderRadius: 1,
                cursor: 'pointer',
                flexShrink: 0,
                border: '2px solid',
                borderColor: idx === activeIndex ? 'secondary.main' : 'transparent',
                opacity: idx === activeIndex ? 1 : 0.55,
                transition: 'all 0.2s ease',
                '&:hover': { opacity: 1 },
              }}
            />
          ))}
        </Box>
      )}

      {/* Lightbox */}
      <Modal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300, sx: { bgcolor: 'rgba(0,0,0,0.92)' } } }}
      >
        <Fade in={lightboxOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '90vw',
              maxHeight: '90vh',
              outline: 'none',
            }}
          >
            <IconButton
              onClick={() => setLightboxOpen(false)}
              sx={{
                position: 'absolute', top: -40, right: 0,
                color: 'secondary.main',
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={images[lightboxIndex]}
              alt="Full size"
              sx={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 2,
              }}
            />
            {images.length > 1 && (
              <>
                <IconButton
                  onClick={() => setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)}
                  sx={{
                    position: 'absolute', left: -48, top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'secondary.main',
                  }}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
                <IconButton
                  onClick={() => setLightboxIndex((prev) => (prev + 1) % images.length)}
                  sx={{
                    position: 'absolute', right: -48, top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'secondary.main',
                  }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ImageGallery;
