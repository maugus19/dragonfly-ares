import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, participation, details } = body as { id: string; participation?: number | null; details?: string | null }

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const supabase = await createClient()

  const updates: Record<string, unknown> = {}
    if (typeof participation !== 'undefined') updates.participation = participation
    if (typeof details !== 'undefined') updates.details = details

    const { data, error } = await supabase.from('class_records').update(updates).eq('id', id).select().maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
