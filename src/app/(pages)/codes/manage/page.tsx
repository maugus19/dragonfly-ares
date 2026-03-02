import { Container, Typography, Box, Button } from '@mui/material';
import { createClient } from '@/utils/supabase/server';
import TableClient from './TableClient';
import Link from 'next/link';

export default async function ManagePage() {
  const supabase = await createClient();

  // Obtenemos los datos de la tabla 'codes'
  const { data: codes, error } = await supabase
    .from('codes')
    .select('*')
    .order('time', { ascending: false });

  if (error) {
    return <Container><Typography color="error">Error al cargar datos</Typography></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Gestión de Codes
        </Typography>
        <Link href="/codes" passHref style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="secondary">
            Nuevo Código
          </Button>
        </Link>
      </Box>

      {/* Pasamos los datos al componente de cliente */}
      <TableClient initialCodes={codes || []} />
    </Container>
  );
}