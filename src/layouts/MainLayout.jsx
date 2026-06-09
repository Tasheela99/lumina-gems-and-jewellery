// src/layouts/MainLayout.jsx
import { Box, Toolbar } from '@mui/material';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const MainLayout = ({ children, mode, onToggleColorMode }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar mode={mode} onToggleColorMode={onToggleColorMode} />
    {/* Matches AppBar/Toolbar height so content never hides under the fixed navbar */}
    <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }} />
    <Box component="main" sx={{ flexGrow: 1 }}>
      {children}
    </Box>
    <Footer />
  </Box>
);

export default MainLayout;
