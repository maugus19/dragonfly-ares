import { Container, Typography, Box, Button } from '@mui/material'
import { createClient } from '@/utils/supabase/server'
import UploadQueue from './UploadQueue'
import Link from 'next/link'
import GridInfinite from './GridInfinite'

export default async function ManagePage() {
  const supabase = await createClient()

  // Fetch the first page server-side to seed the client
  const { data: codes, error } = await supabase
    .from('codes')
    .select('*')
    .order('created_at', { ascending: false })
    .range(0, 11)

  if (error) {
    return (
      <Container>
        <Typography color="error">Error al cargar datos</Typography>
      </Container>
    )
  }

  return (
    <Container sx={{ my: 4, maxWidth: '100vw' }}>
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

      <UploadQueue />
      <GridInfinite initialData={(codes || []) as unknown as import('./TableClient').CodeRow[]} />
    </Container>
  )
}