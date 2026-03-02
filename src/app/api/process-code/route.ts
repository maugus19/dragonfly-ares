import { createClient } from '@/utils/supabase/server'; // Ajusta la ruta según tu proyecto
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { code } = await req.json();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  // Tu lógica de procesamiento...
  const processedUrl = `https://mi-app.com/v/${Buffer.from(code).toString('base64')}`;

  const { data, error } = await supabase
    .from('codes')
    .insert([{ code, url: processedUrl, 
    user_id: user.id }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}