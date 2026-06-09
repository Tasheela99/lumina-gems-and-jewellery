// src/components/Navbar.jsx
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DiamondIcon from '@mui/icons-material/Diamond';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
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
            bgcolor:
              mode === 'dark'
                ? scrolled
                  ? 'rgba(10,10,10,0.97)'
                  : 'rgba(10,10,10,0.75)'
                : scrolled
                  ? 'rgba(246,244,238,0.97)'
                  : 'rgba(246,244,238,0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid',
            borderColor: scrolled ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.08)',
            transition: 'all 0.3s ease',
          }}
        >
          <Toolbar className="container" sx={{ px: { xs: 2, md: 4 }, minHeight: { xs: 64, md: 72 } }}>
            {/* Logo */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexGrow: 1 }}
              onClick={() => navigate('/')}
            >
              <DiamondIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1.1rem',
                    letterSpacing: '0.04em',
                    lineHeight: 1,
                    color: 'text.primary',
                  }}
                >
                  LUMINA
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'secondary.main',
                    letterSpacing: '0.22em',
                    fontSize: '0.55rem',
                    lineHeight: 1,
                    display: 'block',
                  }}
                >
                  GEMS &amp; JEWELRY
                </Typography>
              </Box>
            </Box>

            {/* Desktop nav */}
            <Box className="d-none d-md-flex" sx={{ gap: 0.5, alignItems: 'center' }}>
              {/* Home */}
              {mainLinks.slice(0, 1).map(({ label, path }) => (
                <Button
                  key={path}
                  onClick={() => handleNav(path)}
                  sx={{
                    color: isActive(path) ? 'secondary.main' : 'text.secondary',
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    fontWeight: isActive(path) ? 600 : 400,
                    px: 1.5,
                    py: 1,
                    position: 'relative',
                    textTransform: 'uppercase',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 4,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: isActive(path) ? '60%' : '0%',
                      height: '1px',
                      bgcolor: 'secondary.main',
                      transition: 'width 0.25s ease',
                    },
                    '&:hover': {
                      color: 'secondary.light',
                      bgcolor: 'transparent',
                      '&::after': { width: '60%' },
                    },
                  }}
                >
                  {label}
                </Button>
              ))}

              {/* Shop dropdown: Gems / Jewelry / Collections */}
              <Button
                onClick={handleOpenShopMenu}
                endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18, mt: '-2px' }} />}
                sx={{
                  color: isShopActive ? 'secondary.main' : 'text.secondary',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  fontWeight: isShopActive ? 600 : 400,
                  px: 1.5,
                  py: 1,
                  position: 'relative',
                  textTransform: 'uppercase',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: isShopActive ? '60%' : '0%',
                    height: '1px',
                    bgcolor: 'secondary.main',
                    transition: 'width 0.25s ease',
                  },
                  '&:hover': {
                    color: 'secondary.light',
                    bgcolor: 'transparent',
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
                    borderRadius: 2,
                    border: '1px solid rgba(201,168,76,0.16)',
                    bgcolor: theme.palette.background.paper,
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
                      '&.Mui-selected': { bgcolor: 'rgba(201,168,76,0.10)' },
                      '&.Mui-selected:hover': { bgcolor: 'rgba(201,168,76,0.14)' },
                    }}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Menu>

              {/* Remaining main links */}
              {mainLinks.slice(1).map(({ label, path }) => (
                <Button
                  key={path}
                  onClick={() => handleNav(path)}
                  sx={{
                    color: isActive(path) ? 'secondary.main' : 'text.secondary',
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    fontWeight: isActive(path) ? 600 : 400,
                    px: 1.5,
                    py: 1,
                    position: 'relative',
                    textTransform: 'uppercase',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 4,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: isActive(path) ? '60%' : '0%',
                      height: '1px',
                      bgcolor: 'secondary.main',
                      transition: 'width 0.25s ease',
                    },
                    '&:hover': {
                      color: 'secondary.light',
                      bgcolor: 'transparent',
                      '&::after': { width: '60%' },
                    },
                  }}
                >
                  {label}
                </Button>
              ))}

              {/* Cart */}
              <IconButton
                onClick={() => navigate('/cart')}
                sx={{
                  ml: 1,
                  color: isActive('/cart') ? 'secondary.main' : 'text.secondary',
                  '&:hover': { color: 'secondary.main', bgcolor: 'rgba(201,168,76,0.08)' },
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
                  color: 'text.secondary',
                  '&:hover': { color: 'secondary.main', bgcolor: 'rgba(201,168,76,0.08)' },
                }}
                aria-label="Toggle light and dark mode"
              >
                {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>
            </Box>

            {/* Mobile: cart + hamburger */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
              <IconButton onClick={onToggleColorMode} sx={{ color: 'text.secondary' }} aria-label="Toggle light and dark mode">
                {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>
              <IconButton onClick={() => navigate('/cart')} sx={{ color: 'text.secondary' }}>
                <Badge
                  badgeContent={cartCount}
                  sx={{ '& .MuiBadge-badge': { bgcolor: 'secondary.main', color: '#0A0A0A', fontWeight: 700 } }}
                >
                  <ShoppingCartIcon fontSize="small" />
                </Badge>
              </IconButton>
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'text.secondary' }}>
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
            bgcolor: mode === 'dark' ? '#0F0F0F' : '#F5F1E6',
            borderLeft: '1px solid rgba(201,168,76,0.15)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DiamondIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
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
          <ListItem
            onClick={() => handleNav('/admin')}
            sx={{ px: 3, py: 1.5, cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'secondary.light', bgcolor: 'rgba(201,168,76,0.05)' } }}
          >
            <ListItemText
              primary="Admin"
              primaryTypographyProps={{ fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
            />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
