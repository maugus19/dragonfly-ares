'use client';
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { CodeRow } from "../manage/TableClient";
import Link from "next/link";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import EditableTable from "./urlTable";


export default function CodeProfile({ params }: { params: Promise<{ id: string }> }) {
  const [code, setCode] = useState<CodeRow | null>(null);
  const [urls, setUrls] = useState<{ server: string; url: string }[]>([]);
  
  useEffect(() => {
    const fetchCode = async () => {
      const codeData = await getCodeById((await params).id);
      setCode(codeData);
      setUrls(codeData.url);
    };

    fetchCode();
  }, [params]);

  const saveUrls = async () => {
    if (!code) return;

    const updatedCode = {
      ...code,
      url: urls,
    };

    try {
      await updateCodeUrls(updatedCode);
      setCode(updatedCode); // Actualiza el estado local con los nuevos datos
      window.alert('URLs actualizadas correctamente');
    } catch (error) {
      window.alert('Error al actualizar las URLs');
    }
  }

  return (
    <Box>
      <Grid container>
        <Grid size={6} sx={{ textAlign: 'left', p: 4 }}>
          <Link href={`./manage`} >
            Atras
          </Link>
        </Grid>
        <Grid size={6} sx={{ textAlign: 'end', p: 2 }}>
          <Button variant="contained" color="primary" onClick={async () => {
            await fetch(`/api/codes/${code?.id}/update-urls`, {
              method: 'POST',
            });
            window.alert('URLs actualizadas, refresca la página para ver los cambios');
          }}>
            Regenerate Urls
          </Button>
          &nbsp;
          <Button variant="outlined" color="secondary" onClick={() => {
            if (code) {
              saveUrls();
            }
          }}>
            Save URLs
          </Button>
        </Grid>

        <Grid size={6} sx={{ mt: 2 }}>
          <div style={{ height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={code?.image_url} alt={code?.title} style={{ maxWidth: '100%', height: 'auto' }} />

          </div>

        </Grid>
        <Grid size={6} sx={{ textAlign: 'left', mt: 2 }}>
          <Stack direction="column" spacing={2} style={{ padding: '16px' }}>
            <Typography variant="subtitle1">
              Code Profile: {code?.code}
            </Typography>
            <Typography variant="body1">
              Title: {code?.title}
            </Typography>
            <Typography variant="body1">
              Servers:
            </Typography>
            {
              code && <EditableTable initialData={urls}  handleOnChange={setUrls} />
            }
            
          </Stack>
        </Grid>
      </Grid>
    </Box >
  );
}

async function updateCodeUrls(item: CodeRow) {

  const result = await fetch(`/api/codes/${item.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: item.title, // 👈 solo lo necesario
      url: item.url, // 👈 solo lo necesario
    }),
  });

  if (!result.ok) {
    throw new Error('Error updating URLs');
  }

  return result.json();
}

async function getCodeById(id: string) {
  const supabase = await createClient();

  // Obtenemos los datos de la tabla 'codes'
  const { data: code, error } = await supabase
    .from('codes')
    .select('*')
    .eq('id', id)
    .single();

  // Placeholder for fetching code details by ID from the database
  // You would typically use your database client here to query the 'codes' table
  return code;
}