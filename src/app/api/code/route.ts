import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function PATCH(req: NextRequest): Promise<Response> {
  const { code, amount } = await req.json()

  if (!code || !amount) {
    throw new Error('Code or amount is missing.')
  }

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or key is missing.')
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    let { data: targetCodes, error: targetError } = await supabase
      .from('codes')
      .select('*')
      .eq('code', code)

    if (targetError) {
      throw new Error(targetError.message)
    }

    const targetCodeTons = targetCodes?.[0].tons

    if (!targetCodeTons) {
      throw new Error('Invalid code')
    }

    const newAmount = targetCodeTons - amount

    if (newAmount < 0) {
      throw new Error('Not enough balance')
    }

    const { data: codes, error } = await supabase
      .from('codes')
      .update({ tons: newAmount })
      .eq('code', code)
      .select()

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
