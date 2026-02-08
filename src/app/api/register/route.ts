import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-logger";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    // 1. Rate Limiting - spam qeydiyyatların qarşısını alır
    const rateLimit = checkRateLimit(`register:${ip}`, RATE_LIMITS.register);
    if (!rateLimit.success) {
      logSecurityEvent("RATE_LIMIT_HIT", {
        ip,
        userAgent,
        path: "/api/register",
        details: "Qeydiyyat rate limit aşıldı",
      });
      return NextResponse.json(
        { error: "Çox sayda qeydiyyat cəhdi. Zəhmət olmasa 1 saat gözləyin." },
        { status: 429 }
      );
    }

    // 2. Input validasiyası - Zod schema ilə
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      logSecurityEvent("INVALID_INPUT", {
        ip,
        userAgent,
        path: "/api/register",
        details: "Qeydiyyat formu validasiya xətası",
      });
      const errors = result.error.issues.map((e: { message: string }) => e.message).join(", ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { email, password, firstName, lastName } = result.data;

    // 3. Email unikallığını yoxla
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Timing attack qarşısını almaq üçün eyni cavab vaxtı saxlanılır
      await hashPassword(password);
      logSecurityEvent("REGISTER_FAILED", {
        ip,
        userAgent,
        email,
        path: "/api/register",
        details: "Email artıq mövcuddur",
      });
      return NextResponse.json(
        { error: "Bu email artıq qeydiyyatdan keçib" },
        { status: 409 }
      );
    }

    // 4. Şifrəni hash-lə (bcrypt, 12 rounds)
    const hashedPassword = await hashPassword(password);

    // 5. İstifadəçini yarat
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "STUDENT",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    logSecurityEvent("REGISTER_SUCCESS", {
      ip,
      userAgent,
      email,
      userId: user.id,
      path: "/api/register",
    });

    return NextResponse.json(
      { message: "Qeydiyyat uğurla tamamlandı", user },
      { status: 201 }
    );
  } catch {
    // Xəta detallarını client-ə göndərmə (məlumat sızması qorunması)
    logSecurityEvent("REGISTER_FAILED", {
      ip,
      userAgent,
      path: "/api/register",
      details: "Server xətası",
    });
    return NextResponse.json(
      { error: "Serverdə xəta baş verdi" },
      { status: 500 }
    );
  }
}
