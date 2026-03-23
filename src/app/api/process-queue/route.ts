import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { scrapeComplete, ScrapeResult } from '@/utils/scrapper/scrapper'

// Processes queued scrape jobs. Expects optional JSON body: { limit?: number, delayMs?: number }
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const limit = typeof body.limit === 'number' ? body.limit : 10
  const delayMs = typeof body.delayMs === 'number' ? body.delayMs : 5000

  // Fetch queued items
  const { data: queued, error: fetchError } = await supabase
    .from('scrape_queue')
    .select('*')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(limit)

  if (fetchError) return NextResponse.json({ error: String(fetchError) }, { status: 500 })
  if (!Array.isArray(queued) || queued.length === 0) return NextResponse.json({ processed: 0 })

  let processed = 0

  for (const job of queued) {
    try {
      // mark as processing
      await supabase.from('scrape_queue').update({ status: 'processing', started_at: new Date().toISOString() }).eq('id', job.id)

      // run scrapper
      const result: ScrapeResult = await scrapeComplete(job.code)

      // upsert into codes table
      const { data: existing } = await supabase.from('codes').select('id').eq('code', job.code).maybeSingle()
      if (existing) {
        await supabase.from('codes').update({ url: result.url }).eq('id', existing.id)
      } else {
        await supabase.from('codes').insert([{ code: job.code, url: result.url, user_id: user.id, title: result.title, image_url: result.image_url }])
      }

      // mark job done
      await supabase.from('scrape_queue').update({ status: 'done', finished_at: new Date().toISOString(), result }).eq('id', job.id)
      processed++
    } catch (err) {
      // mark job failed
      await supabase.from('scrape_queue').update({ status: 'failed', finished_at: new Date().toISOString(), error: String(err) }).eq('id', job.id)
    }

    // Delay between jobs to avoid running constantly
    await new Promise((res) => setTimeout(res, delayMs))
  }

  return NextResponse.json({ processed })
}
