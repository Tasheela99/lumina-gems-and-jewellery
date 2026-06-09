// src/theme/theme.js
// ─────────────────────────────────────────────
// CENTRAL THEME CONFIGURATION
// All colors, typography, and spacing are controlled HERE.
// Do not hardcode any theme values in components — import from this file.
// ─────────────────────────────────────────────

import { createTheme } from '@mui/material/styles';

// ── Font imports (loaded globally in main.jsx) ──────────────────────────────
// @fontsource/playfair-display  → headings
// @fontsource/poppins            → body text

export const createAppTheme = (mode = 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,

      primary: {
        main: isDark ? '#1B4332' : '#2D6A4F',
        light: isDark ? '#2D6A4F' : '#4F8A6F',
        dark: isDark ? '#0D2B20' : '#1B4332',
        contrastText: '#FFFFFF',
      },

      secondary: {
        main: isDark ? '#C9A84C' : '#A57E1E',
        light: isDark ? '#E0C270' : '#C9A84C',
        dark: isDark ? '#9A7B2E' : '#7D5E12',
        contrastText: isDark ? '#0A0A0A' : '#FFFFFF',
      },

      background: {
        default: isDark ? '#0A0A0A' : '#F6F4EE',
        paper: isDark ? '#141414' : '#FFFFFF',
      },

      text: {
        primary: isDark ? '#F5F5F0' : '#1F1B13',
        secondary: isDark ? '#A0A09A' : '#665F52',
      },

      divider: isDark ? 'rgba(201,168,76,0.2)' : 'rgba(165,126,30,0.25)',

      custom: {
        gold: '#C9A84C',
        goldLight: '#E0C270',
        surface: isDark ? '#1A1A1A' : '#F0ECE2',
        surfaceHover: isDark ? '#222222' : '#E7E1D3',
        border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(31,27,19,0.12)',
      },
    },

  typography: {
    fontFamily: '"Poppins", "Helvetica Neue", Arial, sans-serif',

    h1: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.04em',
    },
    subtitle2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.03em',
    },
    body1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 300,
      lineHeight: 1.75,
    },
    body2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 300,
    },
    button: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    caption: {
      fontFamily: '"Poppins", sans-serif',
      letterSpacing: '0.06em',
    },
    overline: {
      fontFamily: '"Poppins", sans-serif',
      letterSpacing: '0.12em',
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 8,
  },

  spacing: 8, // base unit = 8px

    components: {
    // ── Button ──────────────────────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          padding: '10px 28px',
          transition: 'all 0.3s ease',
        },
        containedPrimary: {
          background: isDark
            ? 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)'
            : 'linear-gradient(135deg, #2D6A4F 0%, #4F8A6F 100%)',
          '&:hover': {
            background: isDark
              ? 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)'
              : 'linear-gradient(135deg, #4F8A6F 0%, #2D6A4F 100%)',
            boxShadow: '0 4px 20px rgba(27,67,50,0.5)',
          },
        },
        containedSecondary: {
          background: isDark
            ? 'linear-gradient(135deg, #C9A84C 0%, #E0C270 100%)'
            : 'linear-gradient(135deg, #A57E1E 0%, #C9A84C 100%)',
          color: isDark ? '#0A0A0A' : '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #9A7B2E 0%, #C9A84C 100%)',
            boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
          },
        },
        outlined: {
          borderColor: 'rgba(201,168,76,0.5)',
          color: '#C9A84C',
          '&:hover': {
            borderColor: '#C9A84C',
            backgroundColor: 'rgba(201,168,76,0.08)',
          },
        },
      },
    },

    // ── Card ────────────────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? '#141414' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(31,27,19,0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.6)' : '0 10px 28px rgba(0,0,0,0.12)',
          },
        },
      },
    },

    // ── TextField ───────────────────────────────────────────────────────────
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.12)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(201,168,76,0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#C9A84C',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#C9A84C',
          },
        },
      },
    },

    // ── Chip ────────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
          letterSpacing: '0.04em',
        },
      },
    },

    // ── AppBar ──────────────────────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? 'rgba(10,10,10,0.92)' : 'rgba(246,244,238,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
        },
      },
    },

    // ── Divider ─────────────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(201,168,76,0.15)',
        },
      },
    },

    // ── Tooltip ─────────────────────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: '"Poppins", sans-serif',
          fontSize: '0.75rem',
        },
      },
    },
    },
  });
};

export default createAppTheme;
