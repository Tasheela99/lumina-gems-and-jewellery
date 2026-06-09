// src/components/SnackbarAlert.jsx
// Global snackbar — import useSnackbar hook and SnackbarAlert component at app root.

import { Alert, Slide, Snackbar } from '@mui/material';
import React, { createContext, useCallback, useContext, useState } from 'react';

// ── Context ──────────────────────────────────────────────────────────────────
const SnackbarContext = createContext(null);

const SlideTransition = React.forwardRef(function SlideTransition(props, ref) {
  return <Slide {...props} direction="up" ref={ref} />;
});

// ── Provider ─────────────────────────────────────────────────────────────────
export const SnackbarProvider = ({ children }) => {
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error' | 'warning' | 'info'
  });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnack({ open: true, message, severity });
  }, []);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnack((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          className="shadow-sm"
          onClose={handleClose}
          severity={snack.severity}
          variant="filled"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// ── Hook ─────────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error('useSnackbar must be used within SnackbarProvider');
  return context;
};

export default SnackbarProvider;
