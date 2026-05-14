import { createServerClient, type NextCookieInputChange } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  /* 
  // Skipping middleware protection for now as per user request
  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes logic
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isEngineerRoute = request.nextUrl.pathname.startsWith('/engineer')

  if (!user && (isAdminRoute || isEngineerRoute)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isLoginPage) {
    // We would need to fetch the role here to redirect correctly, 
    // but for middleware, just letting them through to the page 
    // where client-side redirect happens is fine for MVP.
    return response
  }
  */

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
