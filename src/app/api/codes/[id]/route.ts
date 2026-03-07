import { createClient } from '@/utils/supabase/server'; // Ajusta la ruta según tu proyecto
import { NextResponse } from "next/server";

export async function DELETE(req: Request,
  { params }: { params: Promise<{ id: string }>}) {
  const supabase = await createClient();
  const { id } = await params;
  console.log(id)
  const { data: { user } } = await supabase.auth.getUser();
  console.log(user?.id)

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('codes')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ data });
}