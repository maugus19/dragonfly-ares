'use client';
import { Card, CardHeader, CardContent, Typography, Box, Grid, IconButton } from "@mui/material";
import { CodeRow } from "./TableClient";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';

function CodeCard(props: CodeRow) {
  const router = useRouter();
  const handleOnClick = () => {
    router.push(`/codes/${props.id}`);
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este código?')) {
      await fetch(`/api/codes/${id}`, {
        method: 'DELETE',
      });
      router.refresh();
    }
  };
  return (
    <Card variant="outlined" sx={{ mb: 2, p: 2, height:'390px' }} onClick={handleOnClick} style={{ cursor: 'pointer' }}>
      <CardHeader title={props.code} action={
        <IconButton onClick={(e) => {
          e.stopPropagation();
          handleDelete(props.id);
        }}>
          <DeleteIcon />
        </IconButton>
      } />
      <CardContent>
        <img src={props.image_url} style={{ width: '100%', height: '197px' } }  alt={props.title || props.code}/>
        <Typography variant="h6" sx={{ mt: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {props.title || props.code}
        </Typography>
      </CardContent>

    </Card>
  );
}


export default function GridTable({ initialCodes }: { initialCodes: CodeRow[] }) {

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {initialCodes.map((code) => (
          <Grid size={4} key={code.id}>
            <CodeCard key={code.id} {...code} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 