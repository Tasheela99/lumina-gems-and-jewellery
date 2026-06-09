// src/pages/AboutPage.jsx
import { useEffect } from 'react';
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

    {/* Story */}
    <Box className="container lumina-section-container" sx={{ py: { xs: 8, md: 12 } }}>
      <Box className="row g-4 g-lg-5 align-items-center">
        <Box className="col-12 col-md-6">
          <Box
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              height: 420,
              background: 'linear-gradient(135deg, #0D2B20 0%, #1B4332 40%, #2D6A4F 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(201,168,76,0.15)',
            }}
          >
            <DiamondIcon sx={{ fontSize: 120, color: 'secondary.main', opacity: 0.15 }} />
          </Box>
        </Box>
        <Box className="col-12 col-md-6">
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
