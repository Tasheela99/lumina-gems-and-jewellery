// src/components/CategoryBanner.jsx
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DiamondIcon from "@mui/icons-material/Diamond";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BANNERS = [
  {
    label: "Gems",
    path: "/gems",
    icon: DiamondIcon,
    headline: "Rare Gemstones",
    sub: "Sourced from the finest mines of Sri Lanka",
    gradient: (mode) => mode === 'dark'
      ? "linear-gradient(135deg, #0D2B20 0%, #1B4332 50%, #0A1A14 100%)"
      : "linear-gradient(145deg, #EBF6F0 0%, #DCF0E5 50%, #CAE8D7 100%)",
    accent: (mode) => mode === 'dark' ? "#2D6A4F" : "#1B4332",
    iconColor: (mode) => mode === 'dark' ? "#6FCFA0" : "#1B4332",
  },
  {
    label: "Jewelry",
    path: "/jewelry",
    icon: AutoAwesomeIcon,
    headline: "Exquisite Jewelry",
    sub: "Handcrafted pieces for every occasion",
    gradient: (mode) => mode === 'dark'
      ? "linear-gradient(135deg, #1A1200 0%, #3D2B00 50%, #1A0F00 100%)"
      : "linear-gradient(145deg, #FFF9EB 0%, #FCF1D2 50%, #F7E4B2 100%)",
    accent: (mode) => mode === 'dark' ? "#9A7B2E" : "#8A6712",
    iconColor: (mode) => mode === 'dark' ? "#C9A84C" : "#7A5B0F",
  },
  {
    label: "Collections",
    path: "/collections",
    icon: WorkspacePremiumIcon,
    headline: "Curated Collections",
    sub: "Signature picks for gifting and milestones",
    gradient: (mode) => mode === 'dark'
      ? "linear-gradient(135deg, #101018 0%, #1A1A2A 50%, #0B0B12 100%)"
      : "linear-gradient(145deg, #F4F0FD 0%, #EAE2FB 50%, #DDD2F7 100%)",
    accent: (mode) => mode === 'dark' ? "#6B5CA5" : "#5A4997",
    iconColor: (mode) => mode === 'dark' ? "#B9A7FF" : "#43327E",
  },
];

const CategoryBanner = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Box className="row g-4 w-100 mx-0 align-items-stretch">
      {BANNERS.map(
        ({
          label,
          path,
          icon,
          headline,
          sub,
          gradient,
          accent,
          iconColor,
        }) => {
          const resolvedGradient = typeof gradient === 'function' ? gradient(mode) : gradient;
          const resolvedAccent = typeof accent === 'function' ? accent(mode) : accent;
          const resolvedIconColor = typeof iconColor === 'function' ? iconColor(mode) : iconColor;

          return (
            <Box key={label} className="col-12 col-md-4 lumina-grid-col">
              <Box
                onClick={() => navigate(path)}
                sx={{
                  background: resolvedGradient,
                  borderRadius: 3,
                  p: { xs: 4, md: 4 },
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: mode === 'dark' ? `${resolvedAccent}55` : `${resolvedAccent}40`,
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.35s ease, box-shadow 0.35s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: mode === 'dark'
                      ? `0 20px 60px ${resolvedAccent}33`
                      : `0 20px 50px ${resolvedAccent}44`,
                    borderColor: `${resolvedAccent}88`,
                    "& .banner-icon": {
                      transform: "scale(1.15) rotate(10deg)",
                      opacity: mode === 'dark' ? 0.25 : 0.18,
                    },
                  },
                }}
              >
                {/* Decorative background icon */}
                <Box
                  component={icon}
                  className="banner-icon"
                  sx={{
                    position: "absolute",
                    right: -20,
                    bottom: -20,
                    fontSize: 160,
                    color: resolvedIconColor,
                    opacity: 0.12,
                    transition: "transform 0.4s ease, opacity 0.4s ease",
                  }}
                />

                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Box component={icon} sx={{ color: resolvedIconColor, fontSize: 28 }} />
                    <Typography
                      variant="overline"
                      sx={{
                        color: resolvedIconColor,
                        letterSpacing: "0.18em",
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      color: "text.primary",
                      mb: 1,
                      lineHeight: 1.2,
                    }}
                  >
                    {headline}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {sub}
                  </Typography>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(path);
                    }}
                    sx={{
                      mt: "auto",
                      alignSelf: "flex-start",
                      border: "none !important",
                      outline: "none",
                      color: resolvedIconColor,
                      bgcolor: mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.45)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      borderRadius: 2,
                      px: 2.2,
                      py: 0.9,
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      boxShadow: "none",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        border: "none !important",
                        bgcolor: mode === 'dark' ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.75)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Explore {label}
                  </Button>
                </Box>
              </Box>
            </Box>
        );
        }
      )}
    </Box>
  );
};

export default CategoryBanner;
