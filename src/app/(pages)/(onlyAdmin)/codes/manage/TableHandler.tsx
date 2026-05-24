'use client';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import GridTable from './GridTable';
import TableClient, { CodeRow } from './TableClient';

export function TableHandler({ initialCodes }: { initialCodes: CodeRow[] }) {
  const [isGridView, setIsGridView] = useState(true);
  
  return (    
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="outlined" onClick={() => setIsGridView(!isGridView)}>
          {isGridView ? 'Vista de Tabla' : 'Vista de Cuadrícula'}
        </Button>
      </Box>
      {isGridView ? <GridTable initialCodes={initialCodes} /> : <TableClient initialCodes={initialCodes} />}
    </>
  );
}
