import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    // `createClient` is wired to the Next.js cookie store, so the session should be persisted automatically.
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
