'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
// Importamos nuestro nuevo cliente personalizado
import { createClient } from '@/utils/supabase/client'; 
import { Container, Paper, Typography, Box } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClient(); // Usamos la función que creamos arriba
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/codes');
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
            Acceso al Sistema
          </Typography>
          
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#1976d2',
                    brandAccent: '#115293',
                  }
                }
              }
            }}
            providers={[]} // Puedes añadir 'google' si lo configuras en Supabase
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Correo',
                  password_label: 'Contraseña',
                  button_label: 'Iniciar Sesión',
                },
                sign_up: {
                  button_label: 'Registrarse',
                  link_text: '¿No tienes cuenta? Regístrate'
                }
              },
            }}
          />
        </Paper>
      </Box>
    </Container>
  );
}