import { scrapping } from '@/utils/scrapper/scrapper';
import { createClient } from '@/utils/supabase/server'; // Ajusta la ruta según tu proyecto
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { code } = await req.json();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // 2. VERIFICACIÓN PREVIA: ¿Ya existe este código?
  const { data: existingEntry, error: checkError } = await supabase
    .from('codes')
    .select('id, url')
    .eq('code', code)
    .maybeSingle(); // Usamos maybeSingle para que no lance error si no encuentra nada

  if (checkError) {
    return NextResponse.json({ error: 'Error al verificar duplicados' }, { status: 500 });
  }

  if (existingEntry) {
    // Si ya existe, devolvemos los datos existentes sin hacer scrapping
    return NextResponse.json({
      data: existingEntry,
      message: 'El código ya había sido procesado anteriormente.'
    });
  }

  // Tu lógica de procesamiento...
  const processedUrl = await scrapping(code);

  const { data, error } = await supabase
    .from('codes')
    .insert([{
      code, url: processedUrl,
      user_id: user.id
    }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}