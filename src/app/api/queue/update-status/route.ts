import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, status } = body as { id: string; status: string }
    if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })

    const supabase = await createClient()
    const { data, error } = await supabase.from('scrape_queue').update({ status }).eq('id', id).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
