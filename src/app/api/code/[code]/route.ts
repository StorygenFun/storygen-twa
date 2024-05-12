import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function GET(req: NextRequest): Promise<Response> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or key is missing.')
  }
  const supabase = createClient(supabaseUrl, supabaseKey)

  const code = req.url.split('/').pop()

  if (!code) {
    throw new Error('Code is missing.')
  }

  try {
    let { data: codes, error } = await supabase.from('codes').select('*').eq('code', code)

    if (error) {
      throw new Error(error.message)
    }

    return Response.json(codes)
  } catch (error: any) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
