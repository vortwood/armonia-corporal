import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Secret key for JWT - must be defined in environment variables
const secretKey = process.env.JWT_SECRET_KEY;
if (!secretKey) {
  throw new Error("JWT_SECRET_KEY must be defined in environment variables");
}

const key = new TextEncoder().encode(secretKey);

// Cookie configuration
export const COOKIE_NAME = "admin-session";

// Interfaz para el payload del JWT
interface SessionPayload {
  userId: string;
  role: "admin";
  iat: number;
  exp: number;
}

/**
 * Verifica y decodifica un token JWT (Edge Runtime compatible)
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
 * Obtiene la sesión desde una request (para middleware - Edge Runtime compatible)
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