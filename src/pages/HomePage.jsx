// src/pages/HomePage.jsx
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DiamondIcon from "@mui/icons-material/Diamond";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NatureIcon from "@mui/icons-material/Nature";
import PublicIcon from "@mui/icons-material/Public";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Box, Button, Chip, Typography, useTheme } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CategoryBanner from "../components/CategoryBanner";
import CollectionCard from "../components/CollectionCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import { subscribeToProducts, subscribeToCollections } from "../services/firebase";
import { updateSEO } from '../utils/seo';

// ── Shared Section Title ──────────────────────────────────────────────────────
const SectionTitle = ({ overline, title, subtitle }) => {
  useEffect(() => {
    updateSEO({
      title: 'Lumina Gems and Jewellery | Home',
      description: 'Welcome to Lumina Gems and Jewellery. Discover our exclusive collection of luxury gems and fine jewelry.'
    });
  }, []);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Box sx={{ textAlign: "center", mb: { xs: 5, md: 6 } }}>
      {overline && (
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Box sx={{ width: 24, height: 1, bgcolor: "secondary.main", opacity: 0.7 }} />
          <Typography
            variant="overline"
            sx={{ color: "secondary.main", letterSpacing: "0.22em", fontWeight: 600 }}
          >
            {overline}
          </Typography>
          <Box sx={{ width: 24, height: 1, bgcolor: "secondary.main", opacity: 0.7 }} />
        </Box>
      )}
      <Typography
        variant="h3"
        sx={{
          fontFamily: '"Playfair Display", serif',
          mb: 1.5,
          color: isDark ? "text.primary" : "#1A150A",
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 540, mx: "auto" }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

// ── CountUp Component ─────────────────────────────────────────────────────────
const CountUp = ({ end, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (end === null || end === undefined || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          let startTimestamp = null;
          const duration = 2000;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

const AutoplayBackgroundVideo = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.75;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const playVideo = () => {
      if (video) {
        video.playbackRate = 0.75;
        video.muted = true;
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch(() => {
            const resume = () => {
              if (video) {
                video.playbackRate = 0.75;
                video.muted = true;
                video.play().catch(() => { });
              }
              window.removeEventListener('click', resume);
              window.removeEventListener('touchstart', resume);
              window.removeEventListener('scroll', resume);
            };
            window.addEventListener('click', resume, { once: true });
            window.addEventListener('touchstart', resume, { once: true });
            window.addEventListener('scroll', resume, { once: true });
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
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      onLoadedData={(e) => {
        e.target.playbackRate = 0.75;
        e.target.muted = true;
        e.target.play().catch(() => { });
      }}
      onCanPlay={(e) => {
        e.target.playbackRate = 0.75;
        e.target.muted = true;
        e.target.play().catch(() => { });
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
        transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

const WHY_US = [
  {
    title: "Certified Authenticity",
    desc: "Every gemstone comes with a certificate of authenticity from recognized gemological laboratories.",
    Icon: VerifiedIcon,
    color: "#2D6A4F",
    video: "/Gemstone_product_showcase_video_20260917123302.mp4",
  },
  {
    title: "Master Craftsmanship",
    desc: "Our jewelry is handcrafted by artisans with decades of experience in the Sri Lankan gem trade.",
    Icon: EmojiEventsIcon,
    color: "#A57E1E",
    video: "/Gemstone_product_showcase_video_20260917123308.mp4",
  },
  {
    title: "Ethical Sourcing",
    desc: "We partner only with responsible miners and use conflict-free sourcing across our entire supply chain.",
    Icon: NatureIcon,
    color: "#40916C",
    video: "/Gemstone_product_showcase_video_20260917123313.mp4",
  },
  {
    title: "Lifetime Service",
    desc: "Every purchase includes complimentary cleaning, polishing, and service for the lifetime of your piece.",
    Icon: LocalShippingIcon,
    color: "#6B5CA5",
    video: "/Gemstone_product_showcase_video_20260917123322.mp4",
  },
];

const SECTION_SPACING = { xs: 8, md: 12 };

// ── Hero Video Background ──────────────────────────────────────────────────────
const HeroVideoBackground = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.55;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => { });
      }
    }
  }, []);

  return (
    <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0, bgcolor: "#000000" }}>
      {/* Video element with slow motion 0.55x playback */}
      <Box
        component="video"
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        src="/hero_video.mp4"
        onLoadedMetadata={(e) => {
          e.target.playbackRate = 0.55;
          e.target.muted = true;
          e.target.play().catch(() => { });
        }}
        onCanPlay={(e) => {
          e.target.playbackRate = 0.55;
          e.target.muted = true;
          e.target.play().catch(() => { });
        }}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
          objectFit: "cover",
          zIndex: 0,
          opacity: 0.85,
        }}
      />
      {/* Deep black backdrop overlay in both dark & light modes */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "linear-gradient(180deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.88) 100%)",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [gems, setGems] = useState([]);
  const [jewelry, setJewelry] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gemCount, setGemCount] = useState(null);
  const [jewelryCount, setJewelryCount] = useState(null);
  const [collectionCount, setCollectionCount] = useState(null);
  const [totalStock, setTotalStock] = useState(null);

  useEffect(() => {
    let unmounted = false;
    let unsubProducts = () => { };
    let unsubCollections = () => { };

    unsubProducts = subscribeToProducts((data) => {
      if (unmounted) return;
      const gemItems = data.filter((p) => p.category === 'Gem');
      const jewelryItems = data.filter((p) => p.category === 'Jewelry');
      setGems(gemItems.slice(0, 8));
      setJewelry(jewelryItems.slice(0, 8));
      setGemCount(gemItems.length);
      setJewelryCount(jewelryItems.length);
      setTotalStock(data.reduce((sum, p) => sum + (Number(p.stock) || 0), 0));
      setLoading(false);
    });

    unsubCollections = subscribeToCollections((cols) => {
      if (unmounted) return;
      setCollections(cols.slice(0, 8));
      setCollectionCount(cols.length);
    }, { status: 'Active' });

    return () => {
      unmounted = true;
      unsubProducts();
      unsubCollections();
    };
  }, []);

  const dynamicStats = [
    { value: gemCount, suffix: "", label: "Rare Gemstones", Icon: DiamondIcon },
    { value: jewelryCount, suffix: "", label: "Jewelry Pieces", Icon: AutoAwesomeIcon },
    { value: collectionCount, suffix: "", label: "Curated Collections", Icon: EmojiEventsIcon },
    { value: totalStock, suffix: "", label: "Certified Masterpieces", Icon: VerifiedIcon },
  ];

  const scrollToCollection = () =>
    document.getElementById("gems-section")?.scrollIntoView({ behavior: "smooth" });

  return (
    <Box>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          minHeight: { xs: 580, sm: 680, md: 760, lg: 800 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          bgcolor: "#000000",
          pt: { xs: 13, md: 15 },
          pb: { xs: 8, md: 10 },
        }}
      >
        {/* Background video layer without any white overlays */}
        <HeroVideoBackground />

        {/* Centred text content */}
        <Box
          className="container lumina-section-container"
          sx={{ position: "relative", zIndex: 1, width: "100%" }}
        >
          <Box
            sx={{
              maxWidth: 760,
              mx: "auto",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: { xs: 3, md: 2 },
            }}
          >
            {/* Badge */}
            <Chip
              icon={<DiamondIcon sx={{ fontSize: "14px !important", color: "#FFE082 !important" }} />}
              label="Sri Lanka's Finest"
              sx={{
                mb: 2.5,
                bgcolor: "rgba(255, 255, 255, 0.16)",
                border: "none",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.35)",
                color: "#FFFFFF",
                letterSpacing: "0.12em",
                fontSize: "0.74rem",
                fontWeight: 600,
                px: 1.2,
                py: 1.8,
                borderRadius: 3,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            />

            {/* Headline */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.6rem", sm: "3.6rem", md: "4.3rem", lg: "4.8rem" },
                lineHeight: 1.12,
                mb: 2.2,
                fontFamily: '"Playfair Display", serif',
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
                textShadow: "0 4px 24px rgba(0,0,0,0.85), 0 1px 8px rgba(0,0,0,0.9)",
              }}
            >
              Where Rarity{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(135deg, #FFE082 0%, #FFCA28 50%, #FFB300 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 16px rgba(255, 193, 7, 0.4))",
                }}
              >
                Meets
              </Box>{" "}
              Artistry
            </Typography>

            {/* Sub-headline */}
            <Typography
              variant="body1"
              sx={{
                mb: 3.5,
                maxWidth: 540,
                lineHeight: 1.8,
                fontSize: { xs: "0.95rem", md: "1.02rem" },
                color: "rgba(255, 255, 255, 0.92)",
                fontWeight: 400,
                textShadow: "0 2px 16px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.95)",
              }}
            >
              Discover our curated collection of rare gemstones and handcrafted jewelry, sourced
              from the famous gem mines of Sri Lanka and crafted by master artisans.
            </Typography>

            {/* CTA Buttons */}
            <Box sx={{ display: "flex", gap: { xs: 1.8, sm: 2.2 }, flexWrap: "wrap", justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<DiamondIcon sx={{ fontSize: "18px !important", color: "#FFE082 !important" }} />}
                onClick={() => navigate("/gems")}
                sx={{
                  px: { xs: 3.2, sm: 4.4 },
                  py: { xs: 1.2, sm: 1.4 },
                  border: "1.5px solid rgba(255, 224, 130, 0.5) !important",
                  borderRadius: "30px !important",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #1B4332 100%) !important",
                  color: "#FFFFFF !important",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  fontSize: "0.85rem",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(45, 106, 79, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.35) !important",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    border: "1.5px solid rgba(255, 224, 130, 0.85) !important",
                    background: "linear-gradient(135deg, #2D6A4F 0%, #40916C 60%, #2D6A4F 100%) !important",
                    color: "#FFFFFF !important",
                    boxShadow: "0 14px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(64, 145, 108, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.5) !important",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                Explore Gems
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<AutoAwesomeIcon sx={{ fontSize: "18px !important", color: "#FFD54F !important" }} />}
                onClick={() => navigate("/jewelry")}
                sx={{
                  px: { xs: 3.2, sm: 4.4 },
                  py: { xs: 1.2, sm: 1.4 },
                  border: "1.5px solid rgba(255, 255, 255, 0.6) !important",
                  borderRadius: "30px !important",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  background: "rgba(255, 255, 255, 0.18) !important",
                  color: "#FFFFFF !important",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  fontSize: "0.85rem",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.5) !important",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    border: "1.5px solid rgba(255, 255, 255, 0.95) !important",
                    background: "rgba(255, 255, 255, 0.35) !important",
                    color: "#FFFFFF !important",
                    boxShadow: "0 14px 40px rgba(0, 0, 0, 0.65), inset 0 1px 3px rgba(255, 255, 255, 0.8) !important",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                View Jewelry
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Scroll indicator */}
        <Box
          onClick={scrollToCollection}
          sx={{
            position: "absolute", bottom: 18, left: "50%",
            transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 0.5, cursor: "pointer", opacity: 0.85, zIndex: 2,
            animation: "bounce 2s ease-in-out infinite",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
              "50%": { transform: "translateX(-50%) translateY(6px)" },
            },
          }}
        >
          <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.85)", letterSpacing: "0.12em", fontWeight: 600 }}>
            SCROLL
          </Typography>
          <KeyboardArrowDownIcon sx={{ color: "#FFE082", fontSize: 20 }} />
        </Box>
      </Box>

      {/* ── THE LUMINA HERITAGE VIDEO PILLARS ───────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: isDark
            ? "linear-gradient(180deg, #0A0A0A 0%, #121212 100%)"
            : "linear-gradient(180deg, #FAF8F5 0%, #FFFFFF 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box className="container lumina-section-container">
          <Box className="row g-3 g-lg-4 align-items-stretch">
            {WHY_US.map(({ title, desc, Icon, color, video }) => (
              <Box className="col-12 col-sm-6 col-lg-3" key={title}>
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    height: "100%",
                    minHeight: { xs: 380, sm: 420, md: 460 },
                    p: { xs: 3, md: 3.5 },
                    borderRadius: 3.5,
                    border: isDark
                      ? "1px solid rgba(201, 168, 76, 0.35)"
                      : "1px solid rgba(201, 168, 76, 0.4)",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.35)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    cursor: "default",
                    bgcolor: "#080808",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: "rgba(255, 224, 130, 0.9)",
                      boxShadow: "0 20px 48px rgba(0, 0, 0, 0.55), 0 0 28px rgba(201, 168, 76, 0.35)",
                      "& video": {
                        transform: "scale(1.08)",
                      },
                      "& .pillar-video-overlay": {
                        background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(4,12,8,0.3) 35%, rgba(4,12,8,0.94) 100%)",
                      },
                      "& .pillar-icon-box": {
                        transform: "scale(1.1) rotate(6deg)",
                        bgcolor: "rgba(201, 168, 76, 0.3)",
                        borderColor: "#FFE082",
                        boxShadow: "0 6px 20px rgba(255, 224, 130, 0.45)",
                      },
                    },
                  }}
                >
                  {/* Background Video */}
                  <AutoplayBackgroundVideo src={video} />

                  {/* Dark Glass Vignette Overlay - crystal clear video at top, dark readable base */}
                  <Box
                    className="pillar-video-overlay"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 1,
                      background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.2) 30%, rgba(6,14,10,0.65) 65%, rgba(6,14,10,0.96) 100%)",
                      transition: "all 0.4s ease",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Card Content */}
                  <Box sx={{ position: "relative", zIndex: 2, width: "100%" }}>
                    <Box
                      className="pillar-icon-box"
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(10, 20, 15, 0.65)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 224, 130, 0.45)",
                        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.45)",
                        mb: 2,
                        transition: "all 0.35s ease",
                      }}
                    >
                      <Icon sx={{ color: "#FFE082", fontSize: 24 }} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        mb: 1,
                        color: "#FFFFFF",
                        textShadow: "0 2px 10px rgba(0,0,0,0.95)",
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: 1.7,
                        fontSize: "0.86rem",
                        color: "rgba(255, 255, 255, 0.92)",
                        textShadow: "0 1px 8px rgba(0,0,0,0.95)",
                      }}
                    >
                      {desc}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── 1. GEMS SECTION ──────────────────────────────────────────────────── */}
      <Box
        id="gems-section"
        sx={{
          py: SECTION_SPACING,
          background: isDark ? "transparent" : "linear-gradient(180deg, #F8F7F4 0%, #FFFFFF 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute", inset: 0,
            backgroundImage: isDark
              ? "radial-gradient(ellipse at 15% 50%, rgba(27,67,50,0.12) 0%, transparent 60%), radial-gradient(ellipse at 85% 50%, rgba(201,168,76,0.05) 0%, transparent 60%)"
              : "radial-gradient(ellipse at 15% 50%, rgba(201,168,76,0.05) 0%, transparent 60%), radial-gradient(ellipse at 85% 50%, rgba(45,106,79,0.04) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <Box className="container lumina-section-container" sx={{ position: "relative", zIndex: 1 }}>
          <SectionTitle
            overline="Natural Brilliance"
            title="Rare Gemstones"
            subtitle="Handpicked natural Ceylon sapphires, rubies, and precious gemstones directly from Sri Lanka's legendary mines."
          />
          {loading ? (
            <LoadingSpinner message="Loading gemstones..." />
          ) : gems.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <DiamondIcon sx={{ fontSize: 56, color: "secondary.main", opacity: 0.2, mb: 2 }} />
              <Typography color="text.secondary">No gemstones available yet. Check back soon.</Typography>
            </Box>
          ) : (
            <Box className="row g-4 align-items-stretch">
              {gems.map((product) => (
                <Box key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 lumina-grid-col">
                  <ProductCard product={product} />
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/gems")}
              sx={{
                px: 5,
                py: 1.4,
                borderRadius: "30px !important",
                border: isDark ? "1px solid rgba(201, 168, 76, 0.35) !important" : "1px solid rgba(27, 67, 50, 0.25) !important",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                background: isDark
                  ? "rgba(201, 168, 76, 0.15) !important"
                  : "rgba(27, 67, 50, 0.08) !important",
                color: isDark ? "#F5D87A !important" : "#1B4332 !important",
                fontWeight: 700,
                letterSpacing: "0.08em",
                boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 16px rgba(27, 67, 50, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  border: isDark ? "1px solid rgba(201, 168, 76, 0.6) !important" : "1px solid #1B4332 !important",
                  background: isDark
                    ? "rgba(201, 168, 76, 0.32) !important"
                    : "#1B4332 !important",
                  color: "#FFFFFF !important",
                  boxShadow: isDark
                    ? "0 8px 24px rgba(201, 168, 76, 0.25)"
                    : "0 8px 24px rgba(27, 67, 50, 0.28)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Show More Gems
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── 2. JEWELLERY SECTION ──────────────────────────────────────────────── */}
      <Box
        id="jewelry-section"
        sx={{
          py: SECTION_SPACING,
          background: isDark ? "#0A0A0A" : "linear-gradient(180deg, #F5F7F5 0%, #FAF9F6 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute", inset: 0,
            backgroundImage: isDark
              ? "radial-gradient(ellipse at 85% 40%, rgba(201,168,76,0.08) 0%, transparent 60%), radial-gradient(ellipse at 15% 60%, rgba(27,67,50,0.08) 0%, transparent 60%)"
              : "radial-gradient(ellipse at 85% 40%, rgba(165,126,30,0.05) 0%, transparent 60%), radial-gradient(ellipse at 15% 60%, rgba(45,106,79,0.04) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <Box className="container lumina-section-container" sx={{ position: "relative", zIndex: 1 }}>
          <SectionTitle
            overline="Artisanal Luxury"
            title="Exquisite Jewellery"
            subtitle="From delicate necklaces to statement rings — handcrafted with exceptional brilliance and master artistry."
          />
          {loading ? (
            <LoadingSpinner message="Loading jewelry..." />
          ) : jewelry.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <AutoAwesomeIcon sx={{ fontSize: 56, color: "secondary.main", opacity: 0.2, mb: 2 }} />
              <Typography color="text.secondary">No jewelry pieces available yet. Check back soon.</Typography>
            </Box>
          ) : (
            <Box className="row g-4 align-items-stretch">
              {jewelry.map((product) => (
                <Box key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 lumina-grid-col">
                  <ProductCard product={product} />
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/jewelry")}
              sx={{
                px: 5,
                py: 1.4,
                borderRadius: "30px !important",
                border: isDark ? "1px solid rgba(201, 168, 76, 0.35) !important" : "1px solid rgba(27, 67, 50, 0.25) !important",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                background: isDark
                  ? "rgba(201, 168, 76, 0.15) !important"
                  : "rgba(27, 67, 50, 0.08) !important",
                color: isDark ? "#F5D87A !important" : "#1B4332 !important",
                fontWeight: 700,
                letterSpacing: "0.08em",
                boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 16px rgba(27, 67, 50, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  border: isDark ? "1px solid rgba(201, 168, 76, 0.6) !important" : "1px solid #1B4332 !important",
                  background: isDark
                    ? "rgba(201, 168, 76, 0.32) !important"
                    : "#1B4332 !important",
                  color: "#FFFFFF !important",
                  boxShadow: isDark
                    ? "0 8px 24px rgba(201, 168, 76, 0.25)"
                    : "0 8px 24px rgba(27, 67, 50, 0.28)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Show More Jewellery
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── 3. COLLECTIONS SECTION ────────────────────────────────────────────── */}
      <Box
        id="collections-section"
        sx={{
          py: SECTION_SPACING,
          background: isDark ? "transparent" : "linear-gradient(180deg, #FAF9F6 0%, #FFFFFF 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute", inset: 0,
            backgroundImage: isDark
              ? "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)"
              : "radial-gradient(ellipse at 50% 50%, rgba(165,126,30,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box className="container lumina-section-container" sx={{ position: "relative", zIndex: 1 }}>
          <SectionTitle
            overline="Signature Series"
            title="Curated Collections"
            subtitle="Themed luxury selections crafted for milestones, bridal splendor, and timeless moments."
          />
          {loading ? (
            <LoadingSpinner message="Loading collections..." />
          ) : collections.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <EmojiEventsIcon sx={{ fontSize: 56, color: "secondary.main", opacity: 0.2, mb: 2 }} />
              <Typography color="text.secondary">No collections available yet. Check back soon.</Typography>
            </Box>
          ) : (
            <Box className="row g-4 align-items-stretch">
              {collections.map((col) => (
                <Box key={col.id} className="col-12 col-sm-6 col-md-4 col-lg-3 lumina-grid-col">
                  <CollectionCard collection={col} />
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/collections")}
              sx={{
                px: 5,
                py: 1.4,
                borderRadius: "30px !important",
                border: isDark ? "1px solid rgba(201, 168, 76, 0.35) !important" : "1px solid rgba(27, 67, 50, 0.25) !important",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                background: isDark
                  ? "rgba(201, 168, 76, 0.15) !important"
                  : "rgba(27, 67, 50, 0.08) !important",
                color: isDark ? "#F5D87A !important" : "#1B4332 !important",
                fontWeight: 700,
                letterSpacing: "0.08em",
                boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 16px rgba(27, 67, 50, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  border: isDark ? "1px solid rgba(201, 168, 76, 0.6) !important" : "1px solid #1B4332 !important",
                  background: isDark
                    ? "rgba(201, 168, 76, 0.32) !important"
                    : "#1B4332 !important",
                  color: "#FFFFFF !important",
                  boxShadow: isDark
                    ? "0 8px 24px rgba(201, 168, 76, 0.25)"
                    : "0 8px 24px rgba(27, 67, 50, 0.28)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Show More Collections
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── CATEGORY BANNERS ─────────────────────────────────────────────────── */}
      {/* <Box
        sx={{
          py: SECTION_SPACING,
          background: isDark ? "#0C0C0C" : "linear-gradient(180deg, #FFFFFF 0%, #F5F4F0 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute", inset: 0,
            backgroundImage: isDark
              ? "linear-gradient(45deg, rgba(201,168,76,0.02) 25%, transparent 25%, transparent 75%, rgba(201,168,76,0.02) 75%), linear-gradient(45deg, rgba(201,168,76,0.02) 25%, transparent 25%, transparent 75%, rgba(201,168,76,0.02) 75%)"
              : "linear-gradient(45deg, rgba(165,126,30,0.03) 25%, transparent 25%, transparent 75%, rgba(165,126,30,0.03) 75%), linear-gradient(45deg, rgba(165,126,30,0.03) 25%, transparent 25%, transparent 75%, rgba(165,126,30,0.03) 75%)",
            backgroundSize: "60px 60px",
            backgroundPosition: "0 0, 30px 30px",
            pointerEvents: "none",
          }}
        />
        <Box className="container px-0 px-sm-3 px-md-4" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ px: { xs: 2.5, sm: 0 } }}>
            <SectionTitle
              overline="Categories"
              title="Explore by Type"
              subtitle="Browse our carefully curated categories of gems and jewelry."
            />
          </Box>
          <CategoryBanner />
        </Box>
      </Box> */}

      {/* ── WHY US ───────────────────────────────────────────────────────────── */}
      {/* <Box
        sx={{
          py: SECTION_SPACING,
          background: isDark ? "transparent" : "linear-gradient(180deg, #EDE3D0 0%, #F7F2E6 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)"
              : "linear-gradient(90deg, transparent, rgba(165,126,30,0.35), transparent)",
          }}
        />
        <Box
          sx={{
            position: "absolute", inset: 0,
            backgroundImage: isDark
              ? "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)"
              : "radial-gradient(circle, rgba(165,126,30,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />
        <Box className="container lumina-section-container" sx={{ position: "relative", zIndex: 1 }}>
          <SectionTitle overline="Why Lumina" title="The Lumina Promise" />
          <Box className="row g-3 align-items-stretch">
            {WHY_US.map(({ title, desc, Icon, color, lightBg, darkBg }) => (
              <Box className="col-12 col-sm-6 lumina-grid-col" key={title}>
                <Box
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    borderRadius: 3,
                    border: isDark ? "1px solid rgba(201,168,76,0.14)" : `1px solid ${color}22`,
                    background: isDark ? darkBg : lightBg,
                    width: "100%", height: "100%",
                    display: "flex", gap: 2.5, alignItems: "flex-start",
                    transition: "all 0.3s ease",
                    position: "relative", overflow: "hidden",
                    "&:hover": {
                      borderColor: isDark ? "rgba(201,168,76,0.35)" : `${color}55`,
                      transform: "translateY(-4px)",
                      boxShadow: isDark ? "0 18px 50px rgba(0,0,0,0.45)" : `0 16px 40px ${color}20`,
                    },
                    ...(isDark ? { bgcolor: "background.paper" } : {}),
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute", right: -16, bottom: -16,
                      opacity: isDark ? 0.04 : 0.06,
                      color: isDark ? "#C9A84C" : color,
                    }}
                  >
                    <Icon sx={{ fontSize: 120 }} />
                  </Box>
                  <Box
                    sx={{
                      width: 54, height: 54, borderRadius: 2.5,
                      display: "grid", placeItems: "center",
                      bgcolor: isDark ? "rgba(201,168,76,0.10)" : `${color}15`,
                      border: "1px solid",
                      borderColor: isDark ? "rgba(201,168,76,0.22)" : `${color}30`,
                      flex: "0 0 auto", mt: 0.25,
                      boxShadow: isDark ? "none" : `0 4px 16px ${color}18`,
                    }}
                  >
                    <Icon sx={{ fontSize: "1.55rem", color: isDark ? "secondary.main" : color }} />
                  </Box>
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: '"Playfair Display", serif',
                        mb: 0.75, fontSize: "1.08rem",
                        color: isDark ? "text.primary" : "#1A150A",
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography sx={{ color: isDark ? "text.secondary" : "#5C4F3A", lineHeight: 1.85, fontSize: "0.87rem" }}>
                      {desc}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box> */}

      {/* ── CTA BANNER ───────────────────────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: isDark
            ? "linear-gradient(135deg, #0D1F18 0%, #1B4332 50%, #0A1A14 100%)"
            : "linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #40916C 100%)",
          position: "relative", overflow: "hidden", textAlign: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: "60%", height: "60%",
            background: "radial-gradient(ellipse, rgba(201,168,76,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box className="container lumina-section-container" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="overline"
            sx={{ color: "rgba(201,168,76,0.9)", letterSpacing: "0.25em", display: "block", mb: 1.5, fontWeight: 600 }}
          >
            Exclusive Access
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontFamily: '"Playfair Display", serif', color: "#FFFFFF", mb: 2, maxWidth: 560, mx: "auto" }}
          >
            Begin Your Journey with Lumina
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255,255,255,0.75)", mb: 4, maxWidth: 440, mx: "auto", lineHeight: 1.8 }}
          >
            Explore a world of certified gemstones and bespoke jewelry crafted exclusively for
            the discerning collector.
          </Typography>
          <Box sx={{ display: "flex", gap: 2.5, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/gems")}
              sx={{
                px: { xs: 4, sm: 5 },
                py: 1.6,
                borderRadius: "30px !important",
                border: "1.5px solid rgba(255, 224, 130, 0.6) !important",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #1B4332 100%) !important",
                color: "#FFFFFF !important",
                fontWeight: 700,
                letterSpacing: "0.08em",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(45, 106, 79, 0.45) !important",
                transition: "all 0.3s ease",
                "&:hover": {
                  border: "1.5px solid rgba(255, 224, 130, 0.9) !important",
                  background: "linear-gradient(135deg, #2D6A4F 0%, #40916C 60%, #2D6A4F 100%) !important",
                  color: "#FFFFFF !important",
                  boxShadow: "0 14px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(64, 145, 108, 0.6) !important",
                  transform: "translateY(-3px)",
                },
              }}
            >
              Shop Now
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/about")}
              sx={{
                px: { xs: 4, sm: 5 },
                py: 1.6,
                borderRadius: "30px !important",
                border: "1.5px solid rgba(255, 255, 255, 0.6) !important",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                background: "rgba(255, 255, 255, 0.18) !important",
                color: "#FFFFFF !important",
                fontWeight: 700,
                letterSpacing: "0.08em",
                boxShadow: "0 8px 28px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.5) !important",
                transition: "all 0.3s ease",
                "&:hover": {
                  border: "1.5px solid rgba(255, 255, 255, 0.95) !important",
                  background: "rgba(255, 255, 255, 0.35) !important",
                  color: "#FFFFFF !important",
                  boxShadow: "0 12px 36px rgba(0, 0, 0, 0.55), inset 0 1px 3px rgba(255, 255, 255, 0.8) !important",
                  transform: "translateY(-3px)",
                },
              }}
            >
              About Our Heritage
            </Button>
          </Box>
        </Box>
      </Box>

    </Box>
  );
};

export default HomePage;
