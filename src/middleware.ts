import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect auth routes - redirect to dashboard if already logged in
  if (request.nextUrl.pathname.startsWith('/auth') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // TEMPORARILY DISABLED - Protect dashboard and app routes - redirect to login if not logged in
  // if (request.nextUrl.pathname.startsWith('/dashboard') ||
  //     request.nextUrl.pathname.startsWith('/log') ||
  //     request.nextUrl.pathname.startsWith('/progress') ||
  //     request.nextUrl.pathname.startsWith('/photos') ||
  //     request.nextUrl.pathname.startsWith('/vision-board') ||
  //     request.nextUrl.pathname.startsWith('/settings')) {
  //   if (!user) {
  //     console.log('Middleware - Redirecting to login, user not authenticated')
  //     return NextResponse.redirect(new URL('/auth/login', request.url))
  //   } else {
  //     console.log('Middleware - User authenticated, allowing access to:', request.nextUrl.pathname)
  //   }
  // }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
