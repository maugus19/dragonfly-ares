import { scrapping } from '@/utils/scrapper/scrapper';
import { createClient } from '@/utils/supabase/server'; // Ajusta la ruta según tu proyecto
import { NextResponse } from "next/server";

export async function POST(req: Request,
  { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // 2. VERIFICACIÓN PREVIA: ¿Ya existe este código?
  const { data: existingEntry, error: checkError } = await supabase
    .from('codes')
    .select('id, url, code')
    .eq('id', id)
    .maybeSingle(); // Usamos maybeSingle para que no lance error si no encuentra nada

  if (checkError) {
    return NextResponse.json({ error: 'Error al verificar duplicados' }, { status: 500 });
  }

  if (!existingEntry) {
    // Si ya existe, devolvemos los datos existentes sin hacer scrapping
    return NextResponse.json({
      data: existingEntry,
      message: 'El código no existe.'
    });
  }

  // Tu lógica de procesamiento...
  const processedUrl = await scrapping(existingEntry.code, true);

  const { data, error } = await supabase
  .from('codes')
  .update({ url: processedUrl.url })
  .eq('id', id)
  .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}