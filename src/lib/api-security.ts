import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "./rate-limit";
import { ZodSchema } from "zod";

// ===== Təhlükəsiz API Response yaratma =====

export function apiSuccess(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// ===== Autentifikasiya yoxlanışı =====

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  return session;
}

// ===== Rol əsaslı giriş nəzarəti =====

export async function requireRole(requiredRole: "ADMIN" | "TEACHER" | "STUDENT") {
  const session = await requireAuth();
  if (!session) return null;

  const userRole = (session.user as any).role as string;
  const roleHierarchy: Record<string, number> = { ADMIN: 3, TEACHER: 2, STUDENT: 1 };

  if ((roleHierarchy[userRole] || 0) < (roleHierarchy[requiredRole] || 0)) {
    return null;
  }

  return session;
}

// ===== Request body validasiyası =====

export async function validateBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues
        .map((e: { message: string }) => e.message)
        .join(", ");
      return { success: false, error: errors };
    }

    return { success: true, data: result.data };
  } catch {
    return { success: false, error: "Düzgün JSON formatı göndərin" };
  }
}

// ===== Rate limited API handler wrapper =====

type RateLimitType = keyof typeof RATE_LIMITS;

export function withRateLimit(
  handler: (request: Request) => Promise<NextResponse>,
  limitType: RateLimitType = "api"
) {
  return async (request: Request): Promise<NextResponse> => {
    const ip = getClientIp(request);
    const result = checkRateLimit(`${limitType}:${ip}`, RATE_LIMITS[limitType]);

    if (!result.success) {
      const retryAfter = Math.ceil(
        (result.resetTime - Date.now()) / 1000
      );
      return NextResponse.json(
        { error: "Çox sayda sorğu. Zəhmət olmasa gözləyin." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(result.resetTime),
          },
        }
      );
    }

    const response = await handler(request);
    response.headers.set(
      "X-RateLimit-Remaining",
      String(result.remaining)
    );
    return response;
  };
}

// ===== Request Method yoxlanışı =====

export function requireMethod(
  request: Request,
  allowed: string[]
): NextResponse | null {
  if (!allowed.includes(request.method)) {
    return NextResponse.json(
      { error: "Bu metod dəstəklənmir" },
      { status: 405 }
    );
  }
  return null;
}
