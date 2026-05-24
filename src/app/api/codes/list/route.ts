import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
  const page = Number(url.searchParams.get('page') || '1')
  const limit = Number(url.searchParams.get('limit') || '12')
  const q = url.searchParams.get('q') || undefined
  const offset = (Math.max(1, page) - 1) * limit

    const supabase = await createClient()
  let query = supabase.from('codes').select('*').order('created_at', { ascending: false }).range(offset, offset + limit - 1)
  if (q) query = query.ilike('code', `%${q}%`)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
