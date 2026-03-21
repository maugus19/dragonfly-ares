import ThemeRegistry from '@/components/ThemeRegistry';
import ThemeToggle from '@/components/ThemeToggle';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ThemeRegistry>
          <header style={{ display: 'flex', justifyContent: 'flex-end', padding: 12 }}>
            <ThemeToggle />
          </header>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}