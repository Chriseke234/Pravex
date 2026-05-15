import { NextResponse } from 'next/server'
import { createClient } from '@/services/supabase'
import { verifyApiKey } from '@/lib/api-auth'

export async function GET(request: Request) {
  const auth = await verifyApiKey(request)
  
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('vaults')
    .select('*')
    .eq('owner_id', auth.userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const auth = await verifyApiKey(request)
  
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  if (!auth.scopes.includes('write')) {
    return NextResponse.json({ error: 'Insufficient permissions (scope: write required)' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('vaults')
      .insert([{
        ...body,
        owner_id: auth.userId
      }])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
