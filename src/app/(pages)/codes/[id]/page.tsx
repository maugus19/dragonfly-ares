'use client';
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { CodeRow } from "../manage/TableClient";
import Link from "next/link";
import { Box, Button } from "@mui/material";

export default function CodeProfile({ params }: { params: Promise<{ id: string }> }) {
  const [code, setCode] = useState<CodeRow | null>(null);

  useEffect(() => {
    const fetchCode = async () => {
      const codeData = await getCodeById((await params).id);
      setCode(codeData);
    };

    fetchCode();
  }, [params]);

  return (
    <div>
      <Link href={`./manage`} >
                   Atras
                </Link>
                <br/>
      <img src={code?.image_url} alt={code?.title} style={{ maxWidth: '100%', height: 'auto' }} />
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Button variant="contained" color="secondary" onClick={async () => {
          await fetch(`/api/codes/${code?.id}/update-urls`, {
            method: 'POST',
          });
          window.alert('URLs actualizadas, refresca la página para ver los cambios');
        }}>
          Update URLS
        </Button>
        
      </Box>
      <h1>{code?.title}</h1>
      <h2>{code?.code}</h2>
      <h3>Servers: </h3>
      <ul>
        {
          code?.url.map((serverUrl: {server: string, url: string}, index: number) => (
            <li key={index}><a href={serverUrl.url} target="_blank" rel="noopener noreferrer">{serverUrl.server + ' (' + serverUrl.url + ')'}</a></li>
          ))
        }
      </ul>
      <h1>Code Profile</h1>
      <p>This page will display details for a specific code based on the ID in the URL.</p>
    </div>
  );
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