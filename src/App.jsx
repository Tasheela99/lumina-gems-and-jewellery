// src/App.jsx
import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from './components/SnackbarAlert';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';
import createAppTheme from './theme/theme';

const App = () => {
  const [mode, setMode] = React.useState(() => {
    const saved = localStorage.getItem('lumina-color-mode');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  const theme = React.useMemo(() => createAppTheme(mode), [mode]);

  const toggleColorMode = React.useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  React.useEffect(() => {
    localStorage.setItem('lumina-color-mode', mode);
    document.body.setAttribute('data-color-mode', mode);
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <BrowserRouter>
        <CartProvider>
          <SnackbarProvider>
            <AppRoutes mode={mode} onToggleColorMode={toggleColorMode} />
          </SnackbarProvider>
        </CartProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
