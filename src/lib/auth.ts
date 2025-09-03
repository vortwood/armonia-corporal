import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { jwtVerify, SignJWT } from "jose";

// Secret key para JWT - debe estar en .env
const secretKey = process.env.JWT_SECRET_KEY;
if (!secretKey) {
  throw new Error("JWT_SECRET_KEY must be defined in environment variables");
}

const key = new TextEncoder().encode(secretKey);

// Configuración de cookies seguras
export const COOKIE_NAME = "admin-session";
export const COOKIE_OPTIONS = {
  name: COOKIE_NAME,
  value: "",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24, // 24 horas
  path: "/",
};

// Interfaz para el payload del JWT
interface SessionPayload {
  userId: string;
  role: "admin";
  iat: number;
  exp: number;
}

/**
 * Crea un token JWT seguro
 */
export async function createSession(userId: string): Promise<string> {
  const payload: Omit<SessionPayload, "iat" | "exp"> = {
    userId,
    role: "admin",
  };

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);

  return session;
}

/**
 * Verifica y decodifica un token JWT
 */
export async function verifySession(
  session: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });

    return payload as unknown as SessionPayload;
  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
}

/**
 * Obtiene la sesión actual desde las cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  return await verifySession(sessionCookie.value);
}

/**
 * Verifica si el usuario actual es admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === "admin";
}

/**
 * Obtiene la sesión desde una request (para middleware)
 */
export async function getSessionFromRequest(
  request: NextRequest,
): Promise<SessionPayload | null> {
  const sessionCookie = request.cookies.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  return await verifySession(sessionCookie.value);
}

/**
 * Valida la contraseña de admin
 */
export function validateAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_ACCESS_PASSWORD;

  if (!adminPassword) {
    throw new Error(
      "ADMIN_ACCESS_PASSWORD must be defined in environment variables",
    );
  }

  return password === adminPassword;
}

// Rate limiting is now handled by the production-ready rate limiter
// Import from rateLimiter.ts
export { loginRateLimiter } from './rateLimiter';
