'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ReactNode, useMemo, createContext, useState, useEffect } from 'react';

type ThemePreference = 'light' | 'dark' | 'system';

export const ThemePreferenceContext = createContext<{
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
}>({ preference: 'system', setPreference: () => {} });

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  // Detect system preference
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Persisted user preference: 'light' | 'dark' | 'system'
  // Initialize from localStorage synchronously (ThemeRegistry is a client component)
  const [preference, setPreference] = useState<ThemePreference>(() => {
    try {
      const stored = localStorage.getItem('theme-preference') as ThemePreference | null;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // ignore (no localStorage)
    }
    return 'system';
  });

  // Persist when preference changes
  useEffect(() => {
    try {
      localStorage.setItem('theme-preference', preference);
    } catch {
      // ignore
    }
  }, [preference]);

  const effectiveDark = preference === 'system' ? prefersDarkMode : preference === 'dark';

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: effectiveDark ? 'dark' : 'light',
          primary: {
            main: '#1976d2', // Azul estándar
          },
          background: {
            default: effectiveDark ? '#121212' : '#ffffff',
            paper: effectiveDark ? '#1e1e1e' : '#ffffff',
          },
        },
      }),
    [effectiveDark]
  );

  return (
    <ThemePreferenceContext.Provider value={{ preference, setPreference }}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline normaliza los estilos y aplica el color de fondo al body */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemePreferenceContext.Provider>
  );
}