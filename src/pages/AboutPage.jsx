// src/pages/AboutPage.jsx
import { useEffect, useState, useRef } from 'react';
import DiamondIcon from '@mui/icons-material/Diamond';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PublicIcon from '@mui/icons-material/Public';
import { updateSEO } from '../utils/seo';
import {
    Avatar,
    Box,
    Divider,
    Typography,
} from '@mui/material';

const ValueCard = ({ icon, title, desc }) => (
  <Box
    sx={(theme) => ({
      display: 'flex',
      gap: 2.5,
      p: 3,
      borderRadius: 2,
      border: '1px solid rgba(201,168,76,0.1)',
      bgcolor: theme.palette.background.paper,
      transition: 'border-color 0.3s, transform 0.3s',
      '&:hover': { borderColor: 'rgba(201,168,76,0.35)', transform: 'translateX(4px)' },
    })}
  >
    <Avatar
      sx={{
        bgcolor: 'rgba(201,168,76,0.1)',
        border: '1px solid rgba(201,168,76,0.25)',
        width: 48,
        height: 48,
        flexShrink: 0,
      }}
    >
      <Box component={icon} sx={{ color: 'secondary.main', fontSize: 22 }} />
    </Avatar>
    <Box>
      <Typography
        variant="h6"
        sx={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem', mb: 0.5 }}
      >
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        {desc}
      </Typography>
    </Box>
  </Box>
);

// ── Showcase Videos for About Page Side-by-Side Columns ───────────────────────
const SHOWCASE_VIDEOS = [
  {
    src: '/Gemstone_product_showcase_video_20260917123302.mp4',
    title: 'Ceylon Blue Sapphire',
    tag: 'Royal Blue',
  },
  {
    src: '/Gemstone_product_showcase_video_20260917123308.mp4',
    title: 'Padparadscha Sapphire',
    tag: 'Padparadscha',
  },
  {
    src: '/Gemstone_product_showcase_video_20260917123313.mp4',
    title: 'Natural Pigeon Ruby',
    tag: 'Pigeon Ruby',
  },
  {
    src: '/Gemstone_product_showcase_video_20260917123319.mp4',
    title: 'Star Sapphire Cabochon',
    tag: 'Star Sapphire',
  },
  {
    src: '/Gemstone_product_showcase_video_20260917123322.mp4',
    title: 'Emerald Cut Columbian',
    tag: 'Fine Emerald',
  },
  {
    src: '/Gemstone_product_showcase_video_20260917141812.mp4',
    title: 'Imperial Yellow Sapphire',
    tag: 'Yellow Sapphire',
  },
];

// Reliable Autoplay Video Component
const AutoplayVideo = ({ src, isActive }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      const playVideo = () => {
        if (video) {
          video.muted = true;
          const promise = video.play();
          if (promise !== undefined) {
            promise.catch(() => {
              // Retry on first user interaction if browser restricted initially
              const resume = () => {
                if (video) {
                  video.muted = true;
                  video.play().catch(() => {});
                }
                window.removeEventListener('click', resume);
                window.removeEventListener('touchstart', resume);
              };
              window.addEventListener('click', resume, { once: true });
              window.addEventListener('touchstart', resume, { once: true });
            });
          }
        }
      };

      playVideo();
      video.addEventListener('loadeddata', playVideo);
      video.addEventListener('canplay', playVideo);

      return () => {
        video.removeEventListener('loadeddata', playVideo);
        video.removeEventListener('canplay', playVideo);
      };
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      onLoadedData={(e) => {
        e.target.muted = true;
        e.target.play().catch(() => {});
      }}
      onCanPlay={(e) => {
        e.target.muted = true;
        e.target.play().catch(() => {});
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        zIndex: 0,
        filter: isActive ? 'brightness(1.05)' : 'brightness(0.75)',
        transition: 'filter 0.4s ease, transform 0.6s ease',
        transform: isActive ? 'scale(1.04)' : 'scale(1)',
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

const VideoColumnGallery = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: { xs: 1, sm: 1.2 },
        height: { xs: 380, sm: 440, md: 480 },
        width: '100%',
        borderRadius: 3.5,
        p: { xs: 0.8, sm: 1.2 },
        bgcolor: 'rgba(10, 10, 10, 0.55)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(201, 168, 76, 0.25)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
        overflow: { xs: 'auto', sm: 'hidden' },
      }}
    >
      {SHOWCASE_VIDEOS.map((video, idx) => {
        const isActive = activeIdx === idx;
        return (
          <Box
            key={video.src}
            onMouseEnter={() => setActiveIdx(idx)}
            onClick={() => setActiveIdx(idx)}
            sx={{
              flex: isActive ? { xs: '0 0 180px', sm: 3.2, md: 3.5 } : { xs: '0 0 75px', sm: 1 },
              minWidth: { xs: 75, sm: 'auto' },
              height: '100%',
              position: 'relative',
              borderRadius: 2.5,
              overflow: 'hidden',
              cursor: 'pointer',
              border: isActive
                ? '1.5px solid rgba(201, 168, 76, 0.85)'
                : '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: isActive
                ? '0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(201, 168, 76, 0.35)'
                : 'none',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              bgcolor: '#050505',
              '&:hover': {
                borderColor: 'rgba(201, 168, 76, 0.85)',
              },
            }}
          >
            {/* Background Video with Reliable Autoplay */}
            <AutoplayVideo src={video.src} isActive={isActive} />

            {/* Gradient Overlay */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                background: isActive
                  ? 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.75) 100%)'
                  : 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 100%)',
                pointerEvents: 'none',
                transition: 'background 0.4s ease',
              }}
            />

            {/* Top Chip / Tag */}
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 2,
                px: 1,
                py: 0.3,
                borderRadius: 1.5,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(201, 168, 76, 0.45)',
                color: '#FFE082',
                fontSize: '0.62rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                opacity: isActive ? 1 : { xs: 0, sm: 0.75 },
                transition: 'opacity 0.3s ease',
              }}
            >
              {video.tag}
            </Box>

            {/* Bottom Title on Active */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                right: 12,
                zIndex: 2,
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.35s ease',
                pointerEvents: 'none',
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#FFFFFF',
                  fontFamily: '"Playfair Display", serif',
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  fontWeight: 600,
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {video.title}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

const AboutPage = () => {
  useEffect(() => {
    updateSEO({
      title: 'About Us | Lumina Gems and Jewellery',
      description: 'Learn about the heritage, craftsmanship, and ethical sourcing behind Lumina Gems and Jewellery.'
    });
  }, []);

  return (
  <Box>
    {/* Hero */}
    <Box
      sx={(theme) => ({
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0D1510 0%, #0A0A0A 70%)'
            : 'linear-gradient(135deg, #E7EFE4 0%, #F6F1E5 70%)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      })}
    >
      <Box
        sx={{
          position: 'absolute', right: -80, top: -80,
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(27,67,50,0.3) 0%, transparent 70%)',
        }}
      />
      <Box className="container lumina-section-container">
        <Typography
          variant="overline"
          sx={{ color: 'secondary.main', letterSpacing: '0.2em', display: 'block', mb: 2 }}
        >
          Our Story
        </Typography>
        <Typography
          variant="h2"
          sx={{ fontFamily: '"Playfair Display", serif', mb: 2, maxWidth: 560 }}
        >
          A Legacy of Gems & Craftsmanship
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, lineHeight: 1.9 }}>
          Born in the gem capital of the world — Ratnapura, Sri Lanka — Lumina Gems & Jewelry
          has been connecting discerning collectors and jewelry lovers with the finest natural
          gemstones and handcrafted pieces for over two decades.
        </Typography>
      </Box>
    </Box>

    {/* Story with Single-Row Side-by-Side Video Columns Gallery */}
    <Box className="container lumina-section-container" sx={{ py: { xs: 8, md: 12 } }}>
      <Box className="row g-4 g-lg-5 align-items-center">
        {/* Left: Side-by-Side Video Columns */}
        <Box className="col-12 col-lg-6">
          <VideoColumnGallery />
        </Box>

        {/* Right: Content */}
        <Box className="col-12 col-lg-6">
          <Typography
            variant="overline"
            sx={{ color: 'secondary.main', letterSpacing: '0.18em', display: 'block', mb: 2 }}
          >
            Who We Are
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontFamily: '"Playfair Display", serif', mb: 3, lineHeight: 1.3 }}
          >
            Rooted in Sri Lanka, Reaching the World
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, mb: 2 }}>
            Sri Lanka has long been celebrated as the "Island of Gems," producing some of the
            world's most coveted sapphires, rubies, and cat's eye chrysoberyls. At Lumina, we
            leverage generations of gemological expertise to bring you stones of unrivalled
            quality and provenance.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
            Each piece in our collection — from raw gemstones to finished jewelry — is personally
            selected by our master gemologists and certified through internationally recognized
            gemological laboratories.
          </Typography>
        </Box>
      </Box>
    </Box>

    {/* Values */}
    <Box
      sx={(theme) => ({
        bgcolor: theme.palette.mode === 'dark' ? '#0C0C0C' : '#EFE8DB',
        py: { xs: 8, md: 10 },
        borderTop: '1px solid rgba(255,255,255,0.04)',
      })}
    >
      <Box className="container lumina-section-container">
        <Typography
          variant="overline"
          sx={{ color: 'secondary.main', letterSpacing: '0.2em', display: 'block', mb: 1, textAlign: 'center' }}
        >
          Our Values
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontFamily: '"Playfair Display", serif', textAlign: 'center', mb: 6 }}
        >
          What We Stand For
        </Typography>
        <Box className="row g-3">
          {[
            {
              icon: EmojiEventsIcon,
              title: 'Excellence in Quality',
              desc: 'We never compromise on quality. Every gemstone and every jewelry piece is held to the highest standards before it reaches you.',
            },
            {
              icon: HandshakeIcon,
              title: 'Ethical Partnerships',
              desc: 'We work directly with miners and artisans who share our commitment to fair trade, sustainable mining, and community development.',
            },
            {
              icon: PublicIcon,
              title: 'Global Reach, Local Heart',
              desc: 'While we ship worldwide, we remain deeply connected to Sri Lanka\'s gem trade heritage and support local artisan communities.',
            },
            {
              icon: DiamondIcon,
              title: 'Transparency Always',
              desc: 'Every gemstone comes with full documentation — origin, certification, grading — so you know exactly what you\'re buying.',
            },
          ].map((v) => (
            <Box className="col-12 col-md-6" key={v.title}>
              <ValueCard {...v} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>

    {/* Team / CTA */}
    <Box
      className="container lumina-section-container"
      sx={{ py: { xs: 8, md: 12 }, textAlign: 'center', maxWidth: '880px !important' }}
    >
      <Divider sx={{ mb: 6 }} />
      <DiamondIcon sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.6, mb: 2 }} />
      <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', mb: 2 }}>
        Visit Our Showroom
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto', lineHeight: 1.9 }}>
        Experience our full collection in person at our flagship showroom in Colombo, or book a
        private consultation with one of our master gemologists.
      </Typography>
    </Box>
  </Box>
  );
};

export default AboutPage;
