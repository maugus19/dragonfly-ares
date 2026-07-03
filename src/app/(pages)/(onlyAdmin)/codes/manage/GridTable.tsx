'use client';
import { Card, CardHeader, CardContent, Typography, Box, Grid, IconButton, Paper, Stack } from "@mui/material";
import { CodeRow } from "./TableClient";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LinkIcon from '@mui/icons-material/Link';
import './styles.css';

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

  const handleOpenExternal = (code: string) => {
    window.open(`${process.env.NEXT_PUBLIC_SCRAPPER_BASE_URL}${code}`, '_blank');
  }
  return (
    <Paper elevation={3} sx={{ mb: 2, p: 0, height: '390px' }} className="card" onClick={handleOnClick} >
      <Card variant="outlined" sx={{ mb: 2, p: 2, height: '390px' }} onClick={handleOnClick} >
        <CardHeader title={`${props.code}  [${props.url.length}] urls`} action={
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton  disabled>
              {props.viewed ? <VisibilityIcon color="disabled" /> : <VisibilityOffIcon color="disabled" />}
            </IconButton>
            <div>
            </div>
            <IconButton onClick={(e) => {
              e.stopPropagation();
              handleOpenExternal(props.code);
            }}>
              <LinkIcon />
            </IconButton>
            <IconButton onClick={(e) => {
              e.stopPropagation();
              handleDelete(props.id);
            }}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        } />
        <CardContent>
          <img src={props.image_url} style={{ width: '100%', height: '197px' }} alt={props.title || props.code} />
          <Typography variant="h6" sx={{ mt: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {props.title || props.code}
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );
}


export default function GridTable({ initialCodes }: { initialCodes: CodeRow[] }) {

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {initialCodes.map((code) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={code.id}>
            <CodeCard key={code.id} {...code} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 