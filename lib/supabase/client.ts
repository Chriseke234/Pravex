import { createBrowserClient } from '@supabase/ssr'

/**
 * Iron Bridge — Browser (client-side) Supabase instance.
 * Use in Client Components and hooks.
 */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
