import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()
  const codes: string[] = body.codes || []

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  if (!Array.isArray(codes) || codes.length === 0) {
    return NextResponse.json({ error: 'No codes provided' }, { status: 400 })
  }

  // Prepare rows for insertion into a queue table. You must create the table `scrape_queue` in your DB.
  const rows = codes.map((code) => ({ code, status: 'queued', user_id: user.id }))

  const res = await supabase.from('scrape_queue').insert(rows)
  const { data, error } = res as { data: unknown[] | null; error: unknown | null }

  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })

  const inserted = Array.isArray(data) ? data.length : 0
  return NextResponse.json({ inserted, data })
}
