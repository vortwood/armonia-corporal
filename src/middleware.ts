import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSessionFromRequest } from "@/lib/middlewareAuth";

// Rutas que requieren autenticación de admin
const protectedRoutes = ["/panel"];

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/login", "/api/login"];

export async function middleware(request: NextRequest) {
  // CVE-2025-29927 Protection: Block malicious middleware subrequest headers
  if (request.headers.get('x-middleware-subrequest')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Additional security headers protection
  const suspiciousHeaders = [
    'x-middleware-rewrite',
    'x-middleware-next', 
    'x-vercel-set-bypass-token'
  ];

  for (const header of suspiciousHeaders) {
    if (request.headers.get(header)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  const { pathname } = request.nextUrl;

  // Verificar si la ruta está protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Si es una ruta protegida, verificar autenticación
  if (isProtectedRoute) {
    const session = await getSessionFromRequest(request);

    if (!session || session.role !== "admin") {
      // Redirigir al login si no está autenticado
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si está autenticado y trata de acceder al login, redirigir al panel
  if (isPublicRoute && pathname === "/login") {
    const session = await getSessionFromRequest(request);

    if (session && session.role === "admin") {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

// Configuración del middleware - especifica qué rutas debe procesar
export const config = {
  matcher: [
    // Proteger rutas administrativas
    "/panel/:path*",
    "/login",
    // Excluir archivos estáticos y API routes que no necesitan protección
    "/((?!api/(?!login)|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
