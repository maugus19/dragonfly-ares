import { scrapeChapters } from '@/utils/scrapper/scrapper-shangri-la';
import { createClient } from '@/utils/supabase/server'; // Ajusta la ruta según tu proyecto
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  await scrapeChapters();

  

  return NextResponse.json({  });
}