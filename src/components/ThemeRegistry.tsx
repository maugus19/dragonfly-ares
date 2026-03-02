'use client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ReactNode, useMemo } from 'react';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  // Detecta si el sistema del usuario está en modo oscuro
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2', // Azul estándar
          },
          background: {
            default: prefersDarkMode ? '#121212' : '#ffffff',
            paper: prefersDarkMode ? '#1e1e1e' : '#ffffff',
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline normaliza los estilos y aplica el color de fondo al body */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}