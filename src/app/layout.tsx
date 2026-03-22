import ThemeRegistry from '@/components/ThemeRegistry';
import ThemeToggle from '@/components/ThemeToggle';
import { Grid, Typography } from '@mui/material';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ThemeRegistry>
          <header>
            <Grid container padding={1}>
              <Grid size={2} spacing={2}>
                <Typography variant="h5" component="h1" fontWeight="bold">
                  <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>

                    Dragonfly Ares
                  </Link>
                </Typography>
              </Grid>
              <Grid size={'grow'}>
              </Grid>
              <Grid size={2} >
                <div style={{display: 'flex', justifyContent: 'flex-end' }}>
              <ThemeToggle />

                </div>
              </Grid>
            </Grid>
          </header>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}