import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Iron Bridge Banking — Server-side Supabase instance.
 * Use in Server Components, Route Handlers, and Server Actions.
 */
export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component cookie mutations can be safely ignored
            // when middleware is refreshing user sessions.
          }
        },
      },
    }
  )
}
