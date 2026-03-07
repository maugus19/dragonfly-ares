'use client';
import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  const [code, setCode] = useState<string>('');
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState({ msg: '', type: 'info' as 'error' | 'success' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    const res = await fetch('/api/process-code', {
      method: 'POST',
      body: JSON.stringify({ code: code.trim().toUpperCase() }),
    });

    const result = await res.json();
    if (res.ok) {
      setStatus({ msg: 'Código procesado y guardado!', type: 'success' });
      setCode('');
    } else {
      setStatus({ msg: result.error, type: 'error' });
    }
    setDisabled(false)
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Subir Nuevo Código</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Ingresa tu código"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            margin="normal"
            disabled={disabled}
            required
          />

          <Button type="submit" disabled={disabled} variant="contained" fullWidth sx={{ mt: 2 }} loadingPosition="end" loading={disabled}>
            Procesar y Guardar
          </Button>
        </form>
        {status.msg && <Alert severity={status.type} sx={{ mt: 2 }} >{status.msg}</Alert>}
      </Box>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Link href="/codes/manage" passHref style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="secondary">
            Manage
          </Button>
        </Link>
      </Box>
    </Container>
  );
}