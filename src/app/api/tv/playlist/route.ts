import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Obtener el usuario (Asegúrate que la TV envíe la cookie de sesión o un Auth Header)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Traer los códigos del usuario
    const { data: codes, error: dbError } = await supabase
      .from('codes')
      .select('id, code, url, time')
      .eq('user_id', user.id)
      .order('time', { ascending: false });

    if (dbError) throw dbError;

    // 3. Formatear para la TV
    // Transformamos el string JSON de 'url' (que guardamos del scrapper) 
    // en un objeto real para que la TV no tenga que hacer JSON.parse()
    const playlist = codes.map(item => {
      let videoData = [];
      try {
        videoData = JSON.parse(item.url); // Intentamos parsear la lista de videos
      } catch (e) {
        videoData = [{ server: 'Default', url: item.url }]; // Si era un string simple
      }

      return {
        id: item.id,
        title: `Code: ${item.code}`,
        date: new Date(item.time).toLocaleDateString(),
        servers: videoData, // Array de {server, url}
        thumbnail: "https://via.placeholder.com/300x169?text=Video" // Opcional para la UI de TV
      };
    });

    return NextResponse.json({
      success: true,
      count: playlist.length,
      data: playlist
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}