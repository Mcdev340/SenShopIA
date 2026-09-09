import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes protégées (authentification requise)
const protectedRoutes = [
  "/profile",
  "/profile/:path*",
  "/cart",
  "/checkout",
  "/checkout/:path*",
  "/orders",
  "/orders/:path*",
  "/wishlist",
  "/notifications",
  "/chat",
  "/chat/:path*",
];

// Routes dashboard
const dashboardRoutes = [
  "/dashboard",
  "/dashboard/:path*",
  "/admin",
  "/admin/:path*",
  "/delivery",
  "/delivery/:path*",
  "/advisor",
  "/advisor/:path*",
];

// Routes API publiques
const publicApiRoutes = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/products",
  "/api/products/:path*",
  "/api/categories",
  "/api/categories/:path*",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Vérifier si c'est une route API publique
  const isPublicApiRoute = publicApiRoutes.some((route) => {
    if (route.includes(":path*")) {
      const baseRoute = route.replace("/:path*", "");
      return pathname === baseRoute || pathname.startsWith(`${baseRoute}/`);
    }
    return pathname === route;
  });

  // Vérifier si c'est une route API
  const isApiRoute = pathname.startsWith("/api");

  // Vérifier si c'est une route protégée
  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route.includes(":path*")) {
      const baseRoute = route.replace("/:path*", "");
      return pathname === baseRoute || pathname.startsWith(`${baseRoute}/`);
    }
    return pathname === route;
  });

  // Vérifier si c'est une route dashboard
  const isDashboardRoute = dashboardRoutes.some((route) => {
    if (route.includes(":path*")) {
      const baseRoute = route.replace("/:path*", "");
      return pathname === baseRoute || pathname.startsWith(`${baseRoute}/`);
    }
    return pathname === route;
  });

  // Si c'est une route API publique, laisser passer
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  // Si c'est une route API (non publique), vérifier l'authentification
  if (isApiRoute && !isPublicApiRoute) {
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    // Vérifier que le token est valide (mock)
    if (!token.startsWith("mock_token_")) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Rediriger vers login si route protégée et pas de token
  if ((isProtectedRoute || isDashboardRoute) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rediriger vers dashboard si déjà authentifié et essaie d'accéder à login/register
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
