import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  COOKIE_OPTIONS,
  createSession,
  loginRateLimiter,
  validateAdminPassword,
  verifySession,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Obtener IP para rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";

    // Verificar rate limiting
    const isAllowed = await loginRateLimiter.isAllowed(ip);
    if (!isAllowed) {
      const timeUntilReset = await loginRateLimiter.getTimeUntilReset(ip);
      const minutes = Math.ceil(timeUntilReset / 60);
      
      return NextResponse.json(
        {
          success: false,
          message: `Too many login attempts. Please try again in ${minutes} minutes.`,
          retryAfter: timeUntilReset,
        },
        { status: 429 },
      );
    }

    // Validar Content-Type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, message: "Invalid content type" },
        { status: 400 },
      );
    }

    // Parsear y validar el body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json(
        { success: false, message: "Invalid JSON format" },
        { status: 400 },
      );
    }

    const { password } = body;

    // Validar que se proporcione password
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 },
      );
    }

    // Validar longitud mínima (prevenir ataques de fuerza bruta básicos)
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Validar contraseña
    try {
      if (!validateAdminPassword(password)) {
        return NextResponse.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 },
        );
      }
    } catch (error) {
      console.error("Error validating password:", error);
      return NextResponse.json(
        { success: false, message: "Authentication error" },
        { status: 500 },
      );
    }

    // Crear sesión JWT
    const sessionToken = await createSession("admin");

    // Crear respuesta exitosa
    const response = NextResponse.json(
      { success: true, message: "Authentication successful" },
      { status: 200 },
    );

    // Configurar cookie segura
    response.cookies.set({
      ...COOKIE_OPTIONS,
      value: sessionToken,
    });

    // Reset rate limiting en login exitoso
    await loginRateLimiter.reset(ip);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// Ruta para logout
export async function DELETE() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 },
    );

    // Eliminar cookie de sesión
    response.cookies.set({
      ...COOKIE_OPTIONS,
      value: "",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Logout error" },
      { status: 500 },
    );
  }
}

// Verificar sesión actual
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin-session");

    if (!sessionCookie?.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verificar el token JWT
    const session = await verifySession(sessionCookie.value);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
