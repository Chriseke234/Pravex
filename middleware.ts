import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './config/i18n'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
})

export async function middleware(request: NextRequest) {
  // 1. Get the intl response
  const response = intlMiddleware(request)

  // 2. Initialize Supabase client, modifying the intl response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Note: We don't overwrite the entire response here.
          // We update the existing intl response with new cookies.
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Refresh session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. Protected routes logic
  // Since we use next-intl with locale prefixes (default), 
  // we check if the pathname contains the segment.
  const path = request.nextUrl.pathname
  const isDashboardPage = path.includes('/dashboard')
  const isAdminPage = path.includes('/admin')
  const isLoginPage = path.includes('/login') || path.includes('/signup')

  if ((isDashboardPage || isAdminPage) && !user) {
    // Redirect to login, preserving the current URL as a redirect parameter if needed
    // Note: We should probably use a localized URL here if needed, 
    // but next-intl middleware handles root redirects.
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginPage && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they contain a dot (e.g. `favicon.ico`)
    // - /api/*
    // - /_next/*
    // - /_vercel/*
    // - /static/*
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
