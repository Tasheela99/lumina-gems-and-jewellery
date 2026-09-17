// src/layouts/MainLayout.jsx
import { Box, Toolbar } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const MainLayout = ({ children, mode, onToggleColorMode }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar mode={mode} onToggleColorMode={onToggleColorMode} />
      {/* Matches AppBar height on other pages, but on HomePage hero video flows under the transparent navbar */}
      {!isHome && <Toolbar sx={{ minHeight: { xs: 88, md: 104 } }} />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
