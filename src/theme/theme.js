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
        main: isDark ? '#1B4332' : '#1B4332',
        light: isDark ? '#2D6A4F' : '#2D6A4F',
        dark: isDark ? '#0D2B20' : '#0F291E',
        contrastText: '#FFFFFF',
      },

      secondary: {
        main: isDark ? '#C9A84C' : '#9E7718',
        light: isDark ? '#E0C270' : '#B88E28',
        dark: isDark ? '#9A7B2E' : '#7A5B0F',
        contrastText: isDark ? '#0A0A0A' : '#FFFFFF',
      },

      background: {
        default: isDark ? '#0A0A0A' : '#F8F7F4',
        paper: isDark ? '#141414' : '#FFFFFF',
      },

      text: {
        primary: isDark ? '#F5F5F0' : '#141412',
        secondary: isDark ? '#A0A09A' : '#4E4E49',
      },

      divider: isDark ? 'rgba(201,168,76,0.2)' : 'rgba(158,119,24,0.18)',

      custom: {
        gold: isDark ? '#C9A84C' : '#9E7718',
        goldLight: isDark ? '#E0C270' : '#B88E28',
        surface: isDark ? '#1A1A1A' : '#F2EFEB',
        surfaceHover: isDark ? '#222222' : '#E8E4DD',
        border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(20,20,18,0.08)',
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
      defaultProps: {
        disableElevation: false,
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          outline: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus': { outline: 'none' },
        },
        containedPrimary: {
          background: isDark
            ? 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)'
            : 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 20px rgba(27, 67, 50, 0.4)',
          '&:hover': {
            background: isDark
              ? 'linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)'
              : 'linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)',
            boxShadow: '0 8px 30px rgba(27, 67, 50, 0.55)',
          },
        },
        containedSecondary: {
          background: isDark
            ? 'rgba(201, 168, 76, 0.28)'
            : 'rgba(165, 126, 30, 0.22)',
          color: isDark ? '#F5D87A' : '#7D5E12',
          border: 'none',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: isDark
            ? '0 4px 20px rgba(201, 168, 76, 0.15)'
            : '0 4px 16px rgba(165, 126, 30, 0.12)',
          '&:hover': {
            background: isDark
              ? 'rgba(201, 168, 76, 0.45)'
              : 'rgba(165, 126, 30, 0.38)',
            color: isDark ? '#FFFFFF' : '#0A0A0A',
            boxShadow: '0 8px 30px rgba(201, 168, 76, 0.35)',
          },
        },
        outlined: {
          border: isDark ? '1px solid rgba(201, 168, 76, 0.4)' : '1px solid rgba(165, 126, 30, 0.4)',
          background: isDark
            ? 'rgba(201, 168, 76, 0.12)'
            : 'rgba(165, 126, 30, 0.10)',
          color: isDark ? '#E0C270' : '#8C6710',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          '&:hover': {
            background: isDark
              ? 'rgba(201, 168, 76, 0.28)'
              : 'rgba(165, 126, 30, 0.22)',
            color: isDark ? '#FFFFFF' : '#1A150A',
            boxShadow: '0 8px 24px rgba(201, 168, 76, 0.25)',
          },
        },
        text: {
          background: 'transparent',
          '&:hover': {
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },

    // ── Card ────────────────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? 'rgba(20, 20, 20, 0.7)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(31,27,19,0.06)',
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
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          border: 'none !important',
          boxShadow: 'none',
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
