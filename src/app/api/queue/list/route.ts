import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
  const page = Number(url.searchParams.get('page') || '1')
  const limit = Number(url.searchParams.get('limit') || '12')
  const status = url.searchParams.get('status') || undefined
  const q = url.searchParams.get('q') || undefined
  const sortBy = url.searchParams.get('sort_by') || undefined
  const sortDir = url.searchParams.get('sort_dir') || 'desc'
  const offset = (Math.max(1, page) - 1) * limit

    const supabase = await createClient()

  // validate sort column to avoid injection
  const allowedSort = ['created_at', 'started_at', 'finished_at', 'status', 'code']
  const orderColumn = sortBy && allowedSort.includes(sortBy) ? sortBy : 'created_at'
  const ascending = sortDir === 'asc'

  let query = supabase.from('scrape_queue').select('*', { count: 'exact' }).order(orderColumn, { ascending }).range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)
  if (q) query = query.ilike('code', `%${q}%`)

  const { data, count, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data, count })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
