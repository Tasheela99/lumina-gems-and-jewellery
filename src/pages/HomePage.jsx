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
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import { getProducts, getCollections } from "../services/firebase";

// ── Shared Section Title ──────────────────────────────────────────────────────
const SectionTitle = ({ overline, title, subtitle }) => {
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

const TRUST_BADGES = ["GIA Certified", "Conflict-Free", "Free Shipping"];

const WHY_US = [
  {
    title: "Certified Authenticity",
    desc: "Every gemstone comes with a certificate of authenticity from recognized gemological laboratories.",
    Icon: VerifiedIcon,
    color: "#2D6A4F",
    lightBg: "linear-gradient(135deg, #E8F5EE 0%, #D4ECDF 100%)",
    darkBg: "rgba(27,67,50,0.25)",
  },
  {
    title: "Master Craftsmanship",
    desc: "Our jewelry is handcrafted by artisans with decades of experience in the Sri Lankan gem trade.",
    Icon: EmojiEventsIcon,
    color: "#A57E1E",
    lightBg: "linear-gradient(135deg, #FFF8E6 0%, #F5EDD8 100%)",
    darkBg: "rgba(165,126,30,0.15)",
  },
  {
    title: "Ethical Sourcing",
    desc: "We partner only with responsible miners and use conflict-free sourcing across our entire supply chain.",
    Icon: NatureIcon,
    color: "#40916C",
    lightBg: "linear-gradient(135deg, #EBF5F0 0%, #D8EDDF 100%)",
    darkBg: "rgba(64,145,108,0.2)",
  },
  {
    title: "Lifetime Service",
    desc: "Every purchase includes complimentary cleaning, polishing, and service for the lifetime of your piece.",
    Icon: LocalShippingIcon,
    color: "#6B5CA5",
    lightBg: "linear-gradient(135deg, #F3F0FA 0%, #EAE4F5 100%)",
    darkBg: "rgba(107,92,165,0.2)",
  },
];

const SECTION_SPACING = { xs: 8, md: 12 };

// ── Hero background data ──────────────────────────────────────────────────────
// Negative animation-delay offsets start angle: delay = -(angle/360) × period
const ORBIT_GEMS = [
  // Outer ring CW 32 s — 4 gems at 0°/90°/180°/270°
  { r: 320, color: "#E53935", name: "Ruby",       cw: true,  dur: "32s", delay: "0s",     size: 26 },
  { r: 320, color: "#1E88E5", name: "Sapphire",   cw: true,  dur: "32s", delay: "-8s",    size: 24 },
  { r: 320, color: "#27AE60", name: "Emerald",    cw: true,  dur: "32s", delay: "-16s",   size: 22 },
  { r: 320, color: "#8E24AA", name: "Amethyst",   cw: true,  dur: "32s", delay: "-24s",   size: 24 },
  // Middle ring CCW 22 s — 3 gems at 0°/120°/240°
  { r: 210, color: "#F57C00", name: "Topaz",      cw: false, dur: "22s", delay: "0s",     size: 20 },
  { r: 210, color: "#00ACC1", name: "Aquamarine", cw: false, dur: "22s", delay: "-7.3s",  size: 18 },
  { r: 210, color: "#EC407A", name: "RoseQuartz", cw: false, dur: "22s", delay: "-14.7s", size: 20 },
  // Inner ring CW 13 s — 2 gems at 0°/180°
  { r: 110, color: "#C9A84C", name: "Gold",       cw: true,  dur: "13s", delay: "0s",     size: 15 },
  { r: 110, color: "#90CAF9", name: "Aqua",       cw: true,  dur: "13s", delay: "-6.5s",  size: 13 },
];

// Large edge-floating DiamondIcons at very low opacity
const BG_FLOATS = [
  { top: "7%",  left:  "4%",   size: 56, opacity: 0.07, delay: "0s",   dur: "9s"  },
  { top: "11%", right: "4%",   size: 40, opacity: 0.06, delay: "2.1s", dur: "11s" },
  { top: "71%", left:  "3%",   size: 68, opacity: 0.05, delay: "1.3s", dur: "8s"  },
  { top: "76%", right: "3%",   size: 46, opacity: 0.06, delay: "3.2s", dur: "10s" },
  { top: "40%", left:  "1%",   size: 30, opacity: 0.08, delay: "0.8s", dur: "12s" },
  { top: "36%", right: "1%",   size: 34, opacity: 0.07, delay: "4.0s", dur: "9s"  },
  { top: "54%", left:  "11%",  size: 22, opacity: 0.05, delay: "1.6s", dur: "7s"  },
  { top: "23%", right: "11%",  size: 28, opacity: 0.06, delay: "2.8s", dur: "13s" },
];

// AutoAwesome sparkles scattered across the hero
const SPARKLES = [
  { top: "13%",  left:  "21%",  size: 22, delay: "0s"   },
  { top: "8%",   right: "23%",  size: 17, delay: "1.5s" },
  { top: "79%",  left:  "17%",  size: 19, delay: "2.2s" },
  { top: "81%",  right: "19%",  size: 15, delay: "0.8s" },
  { top: "47%",  left:  "27%",  size: 13, delay: "3.1s" },
  { top: "51%",  right: "25%",  size: 15, delay: "1.9s" },
  { top: "29%",  left:  "45%",  size: 11, delay: "2.7s" },
  { top: "64%",  right: "43%",  size: 12, delay: "0.5s" },
];

// ── GemBackground ─────────────────────────────────────────────────────────────
// Absolutely fills the hero, sits at z-index 0 behind all text content.
const GemBackground = ({ isDark }) => {
  const gold  = isDark ? "#C9A84C" : "#A57E1E";
  const green = isDark ? "#1B4332" : "#2D6A4F";
  const ring  = isDark ? "rgba(201,168,76," : "rgba(165,126,30,";

  return (
    <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>

      {/* Pulsing radial glow */}
      <Box
        sx={{
          position: "absolute", top: "50%", left: "50%",
          width: 640, height: 640,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(201,168,76,0.10) 0%, rgba(27,67,50,0.07) 40%, transparent 70%)"
            : "radial-gradient(circle, rgba(201,168,76,0.14) 0%, rgba(45,106,79,0.07) 40%, transparent 70%)",
          animation: "gem-glow-pulse 5s ease-in-out infinite",
        }}
      />

      {/* Large central DiamondIcon — floats gently behind headline */}
      <Box sx={{ position: "absolute", top: "50%", left: "50%", animation: "gem-float 8s ease-in-out infinite" }}>
        <DiamondIcon
          sx={{
            fontSize: 380,
            color: green,
            opacity: isDark ? 0.12 : 0.09,
            display: "block",
            transform: "translate(-50%, -50%)",
            filter: `drop-shadow(0 0 48px ${gold}44)`,
          }}
        />
      </Box>

      {/* Three concentric orbit ring circles */}
      {[320, 210, 110].map((r, i) => (
        <Box
          key={r}
          sx={{
            position: "absolute", top: "50%", left: "50%",
            width: r * 2, height: r * 2,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: "1px solid",
            borderColor: `${ring}${0.07 + i * 0.05})`,
            animation: `ring-pulse ${4 + i}s ease-in-out ${i * 0.9}s infinite`,
          }}
        />
      ))}

      {/* Orbiting coloured DiamondIcons */}
      {ORBIT_GEMS.map(({ r, color, cw, dur, delay, name, size }) => (
        <Box
          key={name}
          sx={{
            position: "absolute", top: "50%", left: "50%",
            width: 0, height: 0,
            animationName: cw ? "orbit-cw" : "orbit-ccw",
            animationDuration: dur,
            animationTimingFunction: "linear",
            animationDelay: delay,
            animationIterationCount: "infinite",
            "--orbit-r": `${r}px`,
          }}
        >
          <DiamondIcon
            sx={{
              position: "absolute",
              transform: "translate(-50%, -50%)",
              fontSize: size,
              color,
              opacity: isDark ? 0.8 : 0.7,
              filter: `drop-shadow(0 0 8px ${color}CC) drop-shadow(0 0 20px ${color}55)`,
              animation: `gem-glow-dot 3.2s ease-in-out ${delay} infinite`,
            }}
          />
        </Box>
      ))}

      {/* Edge floating DiamondIcons */}
      {BG_FLOATS.map((f, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: f.top, left: f.left, right: f.right,
            animationName: "gem-float",
            animationDuration: f.dur,
            animationTimingFunction: "ease-in-out",
            animationDelay: f.delay,
            animationIterationCount: "infinite",
          }}
        >
          <DiamondIcon sx={{ fontSize: f.size, color: gold, opacity: f.opacity }} />
        </Box>
      ))}

      {/* AutoAwesome sparkles */}
      {SPARKLES.map((s, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: s.top, left: s.left, right: s.right,
            animation: `gem-sparkle 3.5s ease-in-out ${s.delay} infinite`,
            opacity: 0,
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: s.size, color: gold, display: "block" }} />
        </Box>
      ))}
    </Box>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gemCount, setGemCount] = useState(null);
  const [jewelryCount, setJewelryCount] = useState(null);
  const [collectionCount, setCollectionCount] = useState(null);
  const [totalStock, setTotalStock] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [data, cols] = await Promise.all([
          getProducts(),
          getCollections()
        ]);
        setFeatured(data.slice(0, 8));
        setGemCount(data.filter(p => p.category === 'Gem').length);
        setJewelryCount(data.filter(p => p.category === 'Jewelry').length);
        setCollectionCount(cols.length);
        setTotalStock(data.reduce((sum, p) => sum + (Number(p.stock) || 0), 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const dynamicStats = [
    { value: gemCount, suffix: "", label: "Rare Gemstones", Icon: DiamondIcon },
    { value: jewelryCount, suffix: "", label: "Jewelry Pieces", Icon: AutoAwesomeIcon },
    { value: collectionCount, suffix: "", label: "Curated Collections", Icon: EmojiEventsIcon },
    { value: totalStock, suffix: "", label: "Items In Stock", Icon: VerifiedIcon },
  ];

  const scrollToCollection = () =>
    document.getElementById("collection-section")?.scrollIntoView({ behavior: "smooth" });

  return (
    <Box>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          background: isDark
            ? "linear-gradient(180deg, #0A0A0A 0%, #0D1510 100%)"
            : "linear-gradient(135deg, #FDF8F0 0%, #F5ECD8 40%, #EDE4D0 100%)",
        }}
      >
        {/* Animated gem background layer */}
        <GemBackground isDark={isDark} />

        {/* Subtle dot-grid */}
        <Box
          sx={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage: isDark
              ? "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)"
              : "radial-gradient(circle, rgba(165,126,30,0.07) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }}
        />

        {/* Centred text content */}
        <Box
          className="container lumina-section-container"
          sx={{ position: "relative", zIndex: 1, width: "100%" }}
        >
          <Box
            sx={{
              maxWidth: 680,
              mx: "auto",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: { xs: 4, md: 0 },
            }}
          >
            {/* Badge */}
            <Chip
              icon={<DiamondIcon sx={{ fontSize: "14px !important", color: "secondary.main !important" }} />}
              label="Sri Lanka's Finest"
              sx={{
                mb: 3,
                bgcolor: isDark ? "rgba(201,168,76,0.10)" : "rgba(165,126,30,0.12)",
                border: "1px solid",
                borderColor: isDark ? "rgba(201,168,76,0.3)" : "rgba(165,126,30,0.4)",
                color: "secondary.main",
                letterSpacing: "0.1em",
                fontSize: "0.7rem",
                fontWeight: 600,
                px: 0.5,
                backdropFilter: "blur(4px)",
              }}
            />

            {/* Headline */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.8rem", md: "4.2rem", lg: "5rem" },
                lineHeight: 1.08,
                mb: 3,
                fontFamily: '"Playfair Display", serif',
                color: isDark ? "text.primary" : "#1A150A",
              }}
            >
              Where Rarity{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #E0C270 50%, #9A7B2E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
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
                mb: 4,
                maxWidth: 480,
                lineHeight: 1.9,
                fontSize: "1.05rem",
                color: isDark ? "text.secondary" : "#5C4F3A",
              }}
            >
              Discover our curated collection of rare gemstones and handcrafted jewelry, sourced
              from the famous gem mines of Sri Lanka and crafted by master artisans.
            </Typography>

            {/* CTA Buttons */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate("/gems")}
                sx={{
                  px: 4, py: 1.5,
                  ...(isDark ? {} : {
                    background: "linear-gradient(135deg, #A57E1E 0%, #C9A84C 100%)",
                    color: "#FFFFFF",
                    boxShadow: "0 6px 24px rgba(165,126,30,0.35)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #8B6A18 0%, #A57E1E 100%)",
                      boxShadow: "0 8px 32px rgba(165,126,30,0.5)",
                      transform: "translateY(-2px)",
                    },
                  }),
                }}
              >
                Explore Gems
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/jewelry")}
                sx={{
                  px: 4, py: 1.5,
                  ...(isDark ? {} : {
                    borderColor: "rgba(45,106,79,0.6)",
                    color: "#2D6A4F",
                    "&:hover": {
                      borderColor: "#2D6A4F",
                      bgcolor: "rgba(45,106,79,0.06)",
                      transform: "translateY(-2px)",
                    },
                  }),
                }}
              >
                View Jewelry
              </Button>
            </Box>

            {/* Trust badges */}
            <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
              {TRUST_BADGES.map((badge) => (
                <Box
                  key={badge}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.6,
                    px: 1.5, py: 0.5,
                    borderRadius: 2,
                    bgcolor: isDark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.55)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid",
                    borderColor: isDark ? "rgba(201,168,76,0.2)" : "rgba(45,106,79,0.18)",
                  }}
                >
                  <VerifiedIcon sx={{ fontSize: 14, color: isDark ? "secondary.main" : "#2D6A4F" }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark ? "secondary.main" : "#2D6A4F",
                      fontWeight: 600, letterSpacing: "0.05em", fontSize: "0.68rem",
                    }}
                  >
                    {badge}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Scroll indicator */}
        <Box
          onClick={scrollToCollection}
          sx={{
            position: "absolute", bottom: 32, left: "50%",
            transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 0.5, cursor: "pointer", opacity: 0.6, zIndex: 1,
            animation: "bounce 2s ease-in-out infinite",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
              "50%":       { transform: "translateX(-50%) translateY(8px)" },
            },
          }}
        >
          <Typography variant="caption" sx={{ color: isDark ? "text.secondary" : "#7A6544", letterSpacing: "0.12em" }}>
            SCROLL
          </Typography>
          <KeyboardArrowDownIcon sx={{ color: "secondary.main", fontSize: 20 }} />
        </Box>
      </Box>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          background: isDark
            ? "#0D0D0D"
            : "linear-gradient(135deg, #2D6A4F 0%, #1B4332 50%, #40916C 100%)",
          borderTop:    isDark ? "1px solid rgba(201,168,76,0.08)" : "none",
          borderBottom: isDark ? "1px solid rgba(201,168,76,0.08)" : "none",
          py: { xs: 5, md: 6 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute", inset: 0,
            backgroundImage: isDark
              ? "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)"
              : "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute", top: "-40%", right: "-5%",
            width: "35%", height: "200%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)"
              : "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box className="container lumina-section-container" sx={{ position: "relative", zIndex: 1 }}>
          <Box className="row g-0 align-items-stretch w-100">
            {dynamicStats.map(({ value, suffix, label, Icon }, i) => (
              <Box className="col-6 col-md-3" key={label}>
                <Box
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 2,
                    borderRight: {
                      md: i < 3
                        ? isDark
                          ? "1px solid rgba(255,255,255,0.05)"
                          : "1px solid rgba(255,255,255,0.15)"
                        : "none",
                    },
                  }}
                >
                  <Box
                    sx={{
                      mb: 1,
                      width: 44, height: 44,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: isDark ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.15)",
                      border: "1px solid",
                      borderColor: isDark ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.25)",
                    }}
                  >
                    <Icon sx={{ fontSize: 22, color: isDark ? "secondary.main" : "#F5D87A" }} />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      color: isDark ? "secondary.main" : "#F5D87A",
                      mb: 0.5,
                      textShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.25)",
                    }}
                  >
                    {value === null ? "..." : <CountUp end={value} suffix={suffix} />}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark ? "text.secondary" : "rgba(255,255,255,0.80)",
                      letterSpacing: "0.1em",
                      fontWeight: 500,
                    }}
                  >
                    {label.toUpperCase()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── COLLECTION ───────────────────────────────────────────────────────── */}
      <Box
        id="collection-section"
        sx={{
          py: SECTION_SPACING,
          background: isDark ? "transparent" : "linear-gradient(180deg, #FDFAF4 0%, #F7F0E2 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute", inset: 0,
            backgroundImage: isDark
              ? "radial-gradient(ellipse at 15% 50%, rgba(27,67,50,0.1) 0%, transparent 60%), radial-gradient(ellipse at 85% 50%, rgba(201,168,76,0.05) 0%, transparent 60%)"
              : "radial-gradient(ellipse at 15% 50%, rgba(201,168,76,0.07) 0%, transparent 60%), radial-gradient(ellipse at 85% 50%, rgba(45,106,79,0.06) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <Box className="container lumina-section-container" sx={{ position: "relative", zIndex: 1 }}>
          <SectionTitle
            overline="Our Collection"
            title="Featured Pieces"
            subtitle="Handpicked selections from our ever-growing catalog of rare gemstones and exquisite jewelry."
          />
          {loading ? (
            <LoadingSpinner message="Loading collection..." />
          ) : featured.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <DiamondIcon sx={{ fontSize: 64, color: "secondary.main", opacity: 0.2, mb: 2 }} />
              <Typography color="text.secondary">No products yet. Check back soon.</Typography>
            </Box>
          ) : (
            <Box className="row g-4 align-items-stretch">
              {featured.map((product) => (
                <Box key={product.id} className="col-12 col-sm-6 col-md-4 lumina-grid-col">
                  <ProductCard product={product} />
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/gems")}
              sx={{
                px: 5,
                ...(isDark ? {} : {
                  borderColor: "rgba(165,126,30,0.5)",
                  color: "#A57E1E",
                  "&:hover": { borderColor: "#A57E1E", bgcolor: "rgba(165,126,30,0.06)" },
                }),
              }}
            >
              View Full Collection
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── CATEGORY BANNERS ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          py: SECTION_SPACING,
          background: isDark ? "#0C0C0C" : "linear-gradient(180deg, #F7F0E2 0%, #EDE3D0 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute", inset: 0,
            backgroundImage: isDark
              ? "linear-gradient(45deg, rgba(201,168,76,0.02) 25%, transparent 25%, transparent 75%, rgba(201,168,76,0.02) 75%), linear-gradient(45deg, rgba(201,168,76,0.02) 25%, transparent 25%, transparent 75%, rgba(201,168,76,0.02) 75%)"
              : "linear-gradient(45deg, rgba(165,126,30,0.04) 25%, transparent 25%, transparent 75%, rgba(165,126,30,0.04) 75%), linear-gradient(45deg, rgba(165,126,30,0.04) 25%, transparent 25%, transparent 75%, rgba(165,126,30,0.04) 75%)",
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
      </Box>

      {/* ── WHY US ───────────────────────────────────────────────────────────── */}
      <Box
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
      </Box>

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
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/gems")}
              sx={{
                px: 5, py: 1.6,
                background: "linear-gradient(135deg, #C9A84C 0%, #E0C270 100%)",
                color: "#1A150A",
                fontWeight: 700,
                boxShadow: "0 6px 28px rgba(201,168,76,0.5)",
                "&:hover": {
                  background: "linear-gradient(135deg, #A57E1E 0%, #C9A84C 100%)",
                  boxShadow: "0 8px 36px rgba(201,168,76,0.65)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Shop Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/about")}
              sx={{
                px: 5, py: 1.6,
                borderColor: "rgba(255,255,255,0.45)",
                color: "rgba(255,255,255,0.9)",
                "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              Our Story
            </Button>
          </Box>
        </Box>
      </Box>

    </Box>
  );
};

export default HomePage;
