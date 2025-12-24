import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow root page (floating panel design)
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Allow access to teaser page directly
  if (pathname === '/teaser') {
    return NextResponse.next()
  }

  // Allow access to static assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // Files with extensions (fonts, images, etc.)
  ) {
    return NextResponse.next()
  }

  // Block all other pages with 403 Forbidden
  return new NextResponse('Forbidden', { status: 403 })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}