import DiamondIcon from "@mui/icons-material/Diamond";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Divider, IconButton, Link, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../utils/constants";

const Footer = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: isDark ? "#080808" : "#EDE7D9",
        borderTop: "1px solid rgba(201,168,76,0.15)",
        mt: "auto",
        pt: 6,
        pb: 3,
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        ml: "-50vw",
        mr: "-50vw",
      }}
    >
      <Box className="container lumina-section-container">
        <Box className="row g-4 justify-content-between">
          <Box className="col-12 col-md-4">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <DiamondIcon sx={{ color: "#C9A84C", fontSize: 28 }} />
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: "1.2rem",
                    color: "text.primary",
                    lineHeight: 1,
                  }}
                >
                  LUMINA
                </Typography>
                <Typography
                  sx={{
                    color: "#C9A84C",
                    letterSpacing: "0.2em",
                    fontSize: "0.55rem",
                  }}
                >
                  GEMS & JEWELRY
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                color: "text.secondary",
                mb: 2,
                maxWidth: 320,
                lineHeight: 1.8,
                fontSize: "0.85rem",
              }}
            >
              Purveyors of the finest gemstones and handcrafted jewelry from the
              heart of Sri Lanka.
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              {[FacebookIcon, InstagramIcon, WhatsAppIcon].map((Icon, i) => (
                <IconButton
                  key={i}
                  size="small"
                  sx={{
                    color: "text.secondary",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      color: "#C9A84C",
                      borderColor: "#C9A84C",
                      bgcolor: "rgba(201,168,76,0.08)",
                    },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Box>

          <Box className="col-6 col-md-2">
            <Typography
              sx={{
                color: "#C9A84C",
                letterSpacing: "0.15em",
                mb: 2,
                fontSize: "0.75rem",
              }}
            >
              NAVIGATION
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {NAV_LINKS.map(({ label, path }) => (
                <Link
                  key={path}
                  component="button"
                  onClick={() => navigate(path)}
                  underline="none"
                  sx={{
                    textAlign: "left",
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    "&:hover": { color: "#C9A84C" },
                  }}
                >
                  {label}
                </Link>
              ))}
            </Box>
          </Box>

          <Box className="col-6 col-md-3">
            <Typography
              sx={{
                color: "#C9A84C",
                letterSpacing: "0.15em",
                mb: 2,
                fontSize: "0.75rem",
              }}
            >
              CONTACT
            </Typography>

            {[
              { label: "Email", value: "info@luminagems.lk" },
              { label: "Phone", value: "+94 77 123 4567" },
              { label: "Location", value: "Colombo, Sri Lanka" },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ mb: 1.5 }}>
                <Typography sx={{ color: "#C9A84C", fontSize: "0.7rem" }}>
                  {label}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box className="col-12 col-md-3">
            <Typography
              sx={{
                color: "#C9A84C",
                letterSpacing: "0.15em",
                mb: 2,
                fontSize: "0.75rem",
              }}
            >
              HOURS
            </Typography>

            {[
              { day: "Mon – Fri", hours: "9:00 AM – 6:00 PM" },
              { day: "Saturday", hours: "10:00 AM – 4:00 PM" },
              { day: "Sunday", hours: "Closed" },
            ].map(({ day, hours }) => (
              <Box
                key={day}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                  {day}
                </Typography>
                <Typography sx={{ color: "text.primary", fontSize: "0.8rem" }}>
                  {hours}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider
          sx={{
            mt: 5,
            mb: 3,
            borderColor: "rgba(255,255,255,0.06)",
            width: "100vw",
            position: "relative",
            left: "50%",
            right: "50%",
            ml: "-50vw",
            mr: "-50vw",
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
            © {year} Lumina Gems & Jewelry. All rights reserved.
          </Typography>

          <Typography sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
            Crafted with ♦ in Sri Lanka
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
