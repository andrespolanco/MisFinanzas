import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware ejecutado en:", req.nextUrl.pathname); // 👈 Verifica que esto se imprime

  const token = req.cookies.get("token")?.value;

  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("Usuario NO autenticado, redirigiendo a /login"); // 👈 Confirma si aparece en la terminal
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("Usuario autenticado, permitiendo acceso");
  return NextResponse.next();
}

// 🔥 IMPORTANTE: Define bien las rutas protegidas
export const config = {
  matcher: ["/dashboard/:path*"], // Aplica el middleware a todas las rutas dentro de /dashboard
};