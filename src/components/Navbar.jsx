// src/components/Navbar.jsx
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DiamondIcon from '@mui/icons-material/Diamond';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { NAV_LINKS } from '../utils/constants';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Hide AppBar on scroll down
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger({ threshold: 100 });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = ({ mode, onToggleColorMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopMenuAnchorEl, setShopMenuAnchorEl] = useState(null);
  const [shopDrawerExpanded, setShopDrawerExpanded] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const shopLinks = NAV_LINKS.filter(({ label }) =>
    label === 'Gems' || label === 'Jewelry' || label === 'Collections'
  );
  const mainLinks = NAV_LINKS.filter(
    ({ label }) => label !== 'Gems' && label !== 'Jewelry' && label !== 'Collections'
  );
  const isShopActive = shopLinks.some(({ path }) => isActive(path));

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleOpenShopMenu = (event) => setShopMenuAnchorEl(event.currentTarget);
  const handleCloseShopMenu = () => setShopMenuAnchorEl(null);

  const handleShopNav = (path) => {
    handleCloseShopMenu();
    handleNav(path);
  };

  return (
    <>
      {/* HideOnScroll wraps ONLY the AppBar — Slide must have a single child */}
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: scrolled
              ? (mode === 'dark' ? 'rgba(10, 10, 10, 0.75) !important' : 'rgba(255, 255, 255, 0.75) !important')
              : 'rgba(255, 255, 255, 0.04) !important',
            backgroundImage: 'none !important',
            backdropFilter: scrolled
              ? 'blur(24px) saturate(190%) !important'
              : 'blur(14px) saturate(160%) !important',
            WebkitBackdropFilter: scrolled
              ? 'blur(24px) saturate(190%) !important'
              : 'blur(14px) saturate(160%) !important',
            border: 'none !important',
            borderBottom: scrolled
              ? (mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.10) !important' : '1px solid rgba(0, 0, 0, 0.06) !important')
              : '1px solid rgba(255, 255, 255, 0.15) !important',
            boxShadow: scrolled
              ? (mode === 'dark' ? '0 16px 40px rgba(0, 0, 0, 0.50)' : '0 10px 30px rgba(0, 0, 0, 0.06)')
              : 'none !important',
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Toolbar className="container" sx={{ px: { xs: 2.5, md: 4.5 }, minHeight: { xs: 88, md: 104 }, py: { xs: 1, md: 1.5 } }}>
            {/* Logo */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexGrow: 1 }}
              onClick={() => navigate('/')}
            >
              <img src="/favicon.png" alt="Lumina Logo" style={{ width: 84, height: 84, objectFit: 'contain' }} />
            </Box>

            {/* Desktop nav */}
            <Box className="d-none d-md-flex" sx={{ gap: 0.5, alignItems: 'center' }}>
              {/* Home */}
              {mainLinks.slice(0, 1).map(({ label, path }) => {
                const isOverHero = location.pathname === '/' && !scrolled;
                const linkColor = isOverHero
                  ? (isActive(path) ? '#FFD54F' : '#FFFFFF')
                  : mode === 'dark'
                    ? (isActive(path) ? 'secondary.main' : 'rgba(255,255,255,0.85)')
                    : (isActive(path) ? '#9E7718' : '#141412');

                return (
                  <Button
                    key={path}
                    onClick={() => handleNav(path)}
                    sx={{
                      color: linkColor,
                      fontSize: '0.78rem',
                      letterSpacing: '0.1em',
                      fontWeight: isActive(path) ? 700 : 500,
                      px: 1.8,
                      py: 1.2,
                      border: 'none !important',
                      background: 'transparent !important',
                      backgroundColor: 'transparent !important',
                      backdropFilter: 'none !important',
                      WebkitBackdropFilter: 'none !important',
                      boxShadow: 'none !important',
                      position: 'relative',
                      textTransform: 'uppercase',
                      textShadow: isOverHero ? '0 2px 12px rgba(0,0,0,0.85)' : 'none',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 4,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: isActive(path) ? '60%' : '0%',
                        height: '1.5px',
                        bgcolor: isOverHero ? '#FFD54F' : 'secondary.main',
                        transition: 'width 0.25s ease',
                      },
                      '&:hover': {
                        color: isOverHero ? '#FFE082' : (mode === 'dark' ? 'secondary.light' : '#9E7718'),
                        background: 'transparent !important',
                        backgroundColor: 'transparent !important',
                        border: 'none !important',
                        '&::after': { width: '60%' },
                      },
                    }}
                  >
                    {label}
                  </Button>
                );
              })}

              {/* Shop dropdown: Gems / Jewelry / Collections */}
              {(() => {
                const isOverHero = location.pathname === '/' && !scrolled;
                const shopColor = isOverHero
                  ? (isShopActive ? '#FFD54F' : '#FFFFFF')
                  : mode === 'dark'
                    ? (isShopActive ? 'secondary.main' : 'rgba(255,255,255,0.85)')
                    : (isShopActive ? '#9E7718' : '#141412');

                return (
                  <Button
                    onClick={handleOpenShopMenu}
                    endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18, mt: '-2px' }} />}
                    sx={{
                      color: shopColor,
                      fontSize: '0.78rem',
                      letterSpacing: '0.1em',
                      fontWeight: isShopActive ? 700 : 500,
                      px: 1.8,
                      py: 1.2,
                      border: 'none !important',
                      background: 'transparent !important',
                      backgroundColor: 'transparent !important',
                      backdropFilter: 'none !important',
                      WebkitBackdropFilter: 'none !important',
                      boxShadow: 'none !important',
                      position: 'relative',
                      textTransform: 'uppercase',
                      textShadow: isOverHero ? '0 2px 12px rgba(0,0,0,0.85)' : 'none',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 4,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: isShopActive ? '60%' : '0%',
                        height: '1.5px',
                        bgcolor: isOverHero ? '#FFD54F' : 'secondary.main',
                        transition: 'width 0.25s ease',
                      },
                      '&:hover': {
                        color: isOverHero ? '#FFE082' : (mode === 'dark' ? 'secondary.light' : '#9E7718'),
                        background: 'transparent !important',
                        backgroundColor: 'transparent !important',
                        border: 'none !important',
                        '&::after': { width: '60%' },
                      },
                    }}
                    aria-label="Open shop menu"
                    aria-controls={shopMenuAnchorEl ? 'shop-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={shopMenuAnchorEl ? 'true' : undefined}
                  >
                    Shop
                  </Button>
                );
              })()}
              <Menu
                id="shop-menu"
                anchorEl={shopMenuAnchorEl}
                open={Boolean(shopMenuAnchorEl)}
                onClose={handleCloseShopMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                MenuListProps={{ dense: true }}
                PaperProps={{
                  sx: (theme) => ({
                    mt: 1,
                    minWidth: 200,
                    borderRadius: 2.5,
                    border: 'none',
                    bgcolor: mode === 'dark' ? 'rgba(18, 18, 18, 0.90)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: mode === 'dark' ? '0 16px 40px rgba(0,0,0,0.6)' : '0 14px 36px rgba(0,0,0,0.12)',
                  }),
                }}
              >
                {shopLinks.map(({ label, path }) => (
                  <MenuItem
                    key={path}
                    selected={isActive(path)}
                    onClick={() => handleShopNav(path)}
                    sx={{
                      fontSize: '0.8rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: mode === 'dark' ? 'text.primary' : '#141412',
                      '&.Mui-selected': { bgcolor: mode === 'dark' ? 'rgba(201,168,76,0.15)' : 'rgba(27,67,50,0.10)', color: mode === 'dark' ? 'secondary.main' : '#1B4332' },
                      '&.Mui-selected:hover': { bgcolor: mode === 'dark' ? 'rgba(201,168,76,0.22)' : 'rgba(27,67,50,0.18)' },
                    }}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Menu>

              {/* Remaining main links */}
              {mainLinks.slice(1).map(({ label, path }) => {
                const isOverHero = location.pathname === '/' && !scrolled;
                const linkColor = isOverHero
                  ? (isActive(path) ? '#FFD54F' : '#FFFFFF')
                  : mode === 'dark'
                    ? (isActive(path) ? 'secondary.main' : 'rgba(255,255,255,0.85)')
                    : (isActive(path) ? '#9E7718' : '#141412');

                return (
                  <Button
                    key={path}
                    onClick={() => handleNav(path)}
                    sx={{
                      color: linkColor,
                      fontSize: '0.78rem',
                      letterSpacing: '0.1em',
                      fontWeight: isActive(path) ? 700 : 500,
                      px: 1.8,
                      py: 1.2,
                      border: 'none !important',
                      background: 'transparent !important',
                      backgroundColor: 'transparent !important',
                      backdropFilter: 'none !important',
                      WebkitBackdropFilter: 'none !important',
                      boxShadow: 'none !important',
                      position: 'relative',
                      textTransform: 'uppercase',
                      textShadow: isOverHero ? '0 2px 12px rgba(0,0,0,0.85)' : 'none',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 4,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: isActive(path) ? '60%' : '0%',
                        height: '1.5px',
                        bgcolor: isOverHero ? '#FFD54F' : 'secondary.main',
                        transition: 'width 0.25s ease',
                      },
                      '&:hover': {
                        color: isOverHero ? '#FFE082' : (mode === 'dark' ? 'secondary.light' : '#9E7718'),
                        background: 'transparent !important',
                        backgroundColor: 'transparent !important',
                        border: 'none !important',
                        '&::after': { width: '60%' },
                      },
                    }}
                  >
                    {label}
                  </Button>
                );
              })}

              {/* Cart */}
              <IconButton
                onClick={() => navigate('/cart')}
                sx={{
                  ml: 1,
                  color: (location.pathname === '/' && !scrolled)
                    ? '#FFFFFF'
                    : mode === 'dark'
                      ? (isActive('/cart') ? 'secondary.main' : 'rgba(255,255,255,0.85)')
                      : (isActive('/cart') ? '#9E7718' : '#141412'),
                  border: 'none !important',
                  background: 'transparent !important',
                  backgroundColor: 'transparent !important',
                  filter: (location.pathname === '/' && !scrolled) ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))' : 'none',
                  '&:hover': { color: 'secondary.main', background: 'transparent !important' },
                }}
              >
                <Badge
                  badgeContent={cartCount}
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: 'secondary.main',
                      color: '#0A0A0A',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      minWidth: 18,
                      height: 18,
                    },
                  }}
                >
                  <ShoppingCartIcon fontSize="small" />
                </Badge>
              </IconButton>

              <IconButton
                onClick={onToggleColorMode}
                sx={{
                  ml: 0.5,
                  color: (location.pathname === '/' && !scrolled)
                    ? '#FFFFFF'
                    : mode === 'dark' ? 'rgba(255,255,255,0.85)' : '#141412',
                  border: 'none !important',
                  background: 'transparent !important',
                  backgroundColor: 'transparent !important',
                  filter: (location.pathname === '/' && !scrolled) ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))' : 'none',
                  '&:hover': { color: 'secondary.main', background: 'transparent !important' },
                }}
                aria-label="Toggle light and dark mode"
              >
                {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>

              {/* Login Button - Borderless Glass */}
              <Button
                size="small"
                startIcon={<PersonOutlineIcon sx={{ fontSize: '15px !important' }} />}
                onClick={() => navigate('/admin')}
                sx={{
                  ml: 1.5,
                  fontSize: '0.74rem',
                  py: 0.8,
                  px: 2,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  borderRadius: 2,
                  border: 'none !important',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  color: (location.pathname === '/' && !scrolled)
                    ? '#FFFFFF'
                    : user
                      ? (mode === 'dark' ? '#6FCFA0' : '#1B4332')
                      : (mode === 'dark' ? '#F5D87A' : '#1B4332'),
                  backgroundColor: (location.pathname === '/' && !scrolled)
                    ? 'rgba(255, 255, 255, 0.18)'
                    : user
                      ? (mode === 'dark' ? 'rgba(27, 67, 50, 0.45)' : 'rgba(27, 67, 50, 0.10)')
                      : (mode === 'dark' ? 'rgba(201, 168, 76, 0.16)' : 'rgba(27, 67, 50, 0.08)'),
                  boxShadow: (location.pathname === '/' && !scrolled)
                    ? '0 4px 16px rgba(0, 0, 0, 0.4)'
                    : mode === 'dark' ? 'none' : '0 2px 8px rgba(27, 67, 50, 0.05)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    border: 'none !important',
                    backgroundColor: (location.pathname === '/' && !scrolled)
                      ? 'rgba(255, 255, 255, 0.35)'
                      : user
                        ? (mode === 'dark' ? 'rgba(27, 67, 50, 0.75)' : '#1B4332')
                        : (mode === 'dark' ? 'rgba(201, 168, 76, 0.32)' : '#1B4332'),
                    color: '#FFFFFF',
                    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
                  },
                }}
              >
                {user ? (user.displayName ? user.displayName.split(' ')[0] : 'Admin') : 'Login'}
              </Button>
            </Box>

            {/* Mobile: login + theme + cart + hamburger */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 0.5 }}>
              <IconButton onClick={() => navigate('/admin')} sx={{ color: user ? 'secondary.main' : 'text.secondary', border: 'none !important', background: 'transparent !important' }} aria-label="Login">
                <PersonOutlineIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={onToggleColorMode} sx={{ color: 'text.secondary', border: 'none !important', background: 'transparent !important' }} aria-label="Toggle light and dark mode">
                {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>
              <IconButton onClick={() => navigate('/cart')} sx={{ color: 'text.secondary', border: 'none !important', background: 'transparent !important' }}>
                <Badge
                  badgeContent={cartCount}
                  sx={{ '& .MuiBadge-badge': { bgcolor: 'secondary.main', color: '#0A0A0A', fontWeight: 700 } }}
                >
                  <ShoppingCartIcon fontSize="small" />
                </Badge>
              </IconButton>
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'text.secondary', border: 'none !important', background: 'transparent !important' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer — outside HideOnScroll so Slide has exactly one child */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: mode === 'dark' ? 'rgba(14, 14, 14, 0.90)' : 'rgba(246, 242, 234, 0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: 'none',
            borderLeft: 'none',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src="/favicon.png" alt="Lumina Logo" style={{ width: 24, height: 24 }} />
            <Typography
              sx={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem', color: 'text.primary' }}
            >
              LUMINA
            </Typography>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: 'rgba(201,168,76,0.1)' }} />

        <List sx={{ pt: 2 }}>
          <ListItem
            onClick={onToggleColorMode}
            sx={{
              px: 3,
              py: 1.5,
              cursor: 'pointer',
              color: 'text.secondary',
              '&:hover': { color: 'secondary.light', bgcolor: 'rgba(201,168,76,0.05)' },
            }}
          >
            <ListItemText
              primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
              primaryTypographyProps={{ fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
            />
          </ListItem>

          {/* Home */}
          {mainLinks.slice(0, 1).map(({ label, path }) => (
            <ListItem
              key={path}
              onClick={() => handleNav(path)}
              sx={{
                px: 3,
                py: 1.5,
                cursor: 'pointer',
                color: isActive(path) ? 'secondary.main' : 'text.secondary',
                borderLeft: isActive(path) ? '2px solid' : '2px solid transparent',
                borderColor: isActive(path) ? 'secondary.main' : 'transparent',
                '&:hover': { color: 'secondary.light', bgcolor: 'rgba(201,168,76,0.05)' },
              }}
            >
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: '0.85rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: isActive(path) ? 600 : 400,
                }}
              />
            </ListItem>
          ))}

          {/* Shop collapsible */}
          <ListItemButton
            onClick={() => setShopDrawerExpanded((prev) => !prev)}
            sx={{
              px: 3,
              py: 1.5,
              color: isShopActive ? 'secondary.main' : 'text.secondary',
              borderLeft: isShopActive ? '2px solid' : '2px solid transparent',
              borderColor: isShopActive ? 'secondary.main' : 'transparent',
              '&:hover': { color: 'secondary.light', bgcolor: 'rgba(201,168,76,0.05)' },
            }}
          >
            <ListItemText
              primary="Shop"
              primaryTypographyProps={{
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: isShopActive ? 600 : 400,
              }}
            />
            {shopDrawerExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </ListItemButton>
          <Collapse in={shopDrawerExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {shopLinks.map(({ label, path }) => (
                <ListItem
                  key={path}
                  onClick={() => handleNav(path)}
                  sx={{
                    pl: 5,
                    pr: 3,
                    py: 1.25,
                    cursor: 'pointer',
                    color: isActive(path) ? 'secondary.main' : 'text.secondary',
                    '&:hover': { color: 'secondary.light', bgcolor: 'rgba(201,168,76,0.04)' },
                  }}
                >
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      letterSpacing: '0.10em',
                      textTransform: 'uppercase',
                      fontWeight: isActive(path) ? 600 : 400,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>

          {/* Remaining main links */}
          {mainLinks.slice(1).map(({ label, path }) => (
            <ListItem
              key={path}
              onClick={() => handleNav(path)}
              sx={{
                px: 3,
                py: 1.5,
                cursor: 'pointer',
                color: isActive(path) ? 'secondary.main' : 'text.secondary',
                borderLeft: isActive(path) ? '2px solid' : '2px solid transparent',
                borderColor: isActive(path) ? 'secondary.main' : 'transparent',
                '&:hover': { color: 'secondary.light', bgcolor: 'rgba(201,168,76,0.05)' },
              }}
            >
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: '0.85rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: isActive(path) ? 600 : 400,
                }}
              />
            </ListItem>
          ))}
          <Divider sx={{ my: 1, borderColor: 'rgba(201,168,76,0.12)' }} />
          <ListItem
            onClick={() => handleNav('/admin')}
            sx={{
              px: 3,
              py: 1.5,
              cursor: 'pointer',
              color: isActive('/admin') ? 'secondary.main' : 'text.secondary',
              borderLeft: isActive('/admin') ? '2px solid' : '2px solid transparent',
              borderColor: isActive('/admin') ? 'secondary.main' : 'transparent',
              '&:hover': { color: 'secondary.light', bgcolor: 'rgba(201,168,76,0.05)' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PersonOutlineIcon fontSize="small" sx={{ color: 'secondary.main' }} />
              <ListItemText
                primary={user ? (user.displayName || 'Admin Portal') : 'Login'}
                primaryTypographyProps={{
                  fontSize: '0.85rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              />
            </Box>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
