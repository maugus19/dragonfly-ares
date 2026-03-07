'use client';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Checkbox, IconButton, Link, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';

export default function TableClient({ initialCodes }: { initialCodes: any[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este código?')) {
      await fetch(`/api/codes/${id}`, {
        method: 'DELETE',
      });
      router.refresh(); // Refresca los datos del servidor
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3 }}>
      <Table aria-label="tabla de códigos">
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell><strong>Code</strong></TableCell>
            <TableCell><strong>URL</strong></TableCell>
            <TableCell align="center"><strong>Viewed</strong></TableCell>
            <TableCell align="center"><strong>Acciones</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {initialCodes.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.code}</TableCell>
              <TableCell>
                <Link href={row.url} target="_blank" rel="noopener">
                  {JSON.stringify(row.url)}
                </Link>
              </TableCell>
              <TableCell align="center">
                <Checkbox checked={row.viewed} disabled />
              </TableCell>
              <TableCell align="center">
                <IconButton color="primary" size="small">
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(row.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {initialCodes.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">No hay códigos registrados.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}