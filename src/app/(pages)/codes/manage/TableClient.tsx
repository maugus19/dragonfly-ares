"use client";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Checkbox, IconButton, Link, TableFooter, TablePagination
} from '@mui/material';
// theme-aware styling is applied via sx callbacks; no explicit hook needed here
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type CodeRow = {
  id: string;
  code: string;
  url: string;
  viewed: boolean;
  // add other fields present in your API if needed
}

export default function TableClient({ initialCodes }: { initialCodes: CodeRow[] }) {
  const router = useRouter();
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este código?')) {
      await fetch(`/api/codes/${id}`, {
        method: 'DELETE',
      });
      router.refresh();
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3 }}>
      <Table aria-label="tabla de códigos">
        <TableHead sx={(theme) => ({ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#f5f5f5' })}>
          <TableRow>
            <TableCell sx={{ color: 'text.primary' }}><strong>Code</strong></TableCell>
            <TableCell sx={{ color: 'text.primary' }}><strong>URL</strong></TableCell>
            <TableCell align="center" sx={{ color: 'text.primary' }}><strong>Viewed</strong></TableCell>
            <TableCell align="center" sx={{ color: 'text.primary' }}><strong>Acciones</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {initialCodes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
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
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={4}
              count={initialCodes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10))
                setPage(0)
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}