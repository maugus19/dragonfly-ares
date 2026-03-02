'use client';
import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

export default function HomePage() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState({ msg: '', type: 'info' as 'error' | 'success' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/process-code', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    
    const result = await res.json();
    if (res.ok) {
      setStatus({ msg: 'Código procesado y guardado!', type: 'success' });
      setCode('');
    } else {
      setStatus({ msg: result.error, type: 'error' });
    }
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
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Procesar y Guardar
          </Button>
        </form>
        {status.msg && <Alert severity={status.type} sx={{ mt: 2 }}>{status.msg}</Alert>}
      </Box>
    </Container>
  );
}