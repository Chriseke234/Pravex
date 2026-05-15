import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './config/i18n'

export async function middleware(request: NextRequest) {
  // Start with a standard response
  const response = NextResponse.next()

  // Initialize Supabase client
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
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes logic
  const path = request.nextUrl.pathname
  const isDashboardPage = path.startsWith('/dashboard')
  const isAdminPage = path.startsWith('/admin')
  const isLoginPage = path.startsWith('/login') || path.startsWith('/signup')

  if ((isDashboardPage || isAdminPage) && !user) {
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
