import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Qorunan route-lar (autentifikasiya tələb edən)
const protectedPaths = ["/dashboard"];

// Yalnız giriş etməmiş istifadəçilər üçün olan route-lar
const authPaths = ["/register"];

// İcazə verilən daxili callback yolları (Open Redirect qorunması)
const ALLOWED_CALLBACK_PREFIXES = ["/dashboard", "/muhazire", "/kollokvium", "/serbest-isler"];

// API rate limiting üçün in-memory store
const apiRateLimits = new Map<string, { count: number; resetTime: number }>();

// Şübhəli fəaliyyət izləmə
const suspiciousActivity = new Map<string, { count: number; firstSeen: number }>();

function getIpFromRequest(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function checkApiRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 100;

  const entry = apiRateLimits.get(ip);

  if (!entry || now > entry.resetTime) {
    apiRateLimits.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

// Open Redirect qorunması - yalnız daxili yollara icazə verir
function isValidCallbackUrl(pathname: string): boolean {
  // Yalnız "/" ilə başlayan daxili yollar
  if (!pathname.startsWith("/")) return false;
  // Protocol-relative URL-ləri blokla (//evil.com)
  if (pathname.startsWith("//")) return false;
  // Backslash ilə bypass cəhdlərini blokla
  if (pathname.includes("\\")) return false;
  // Null byte injection-u blokla
  if (pathname.includes("\0")) return false;
  // @-li URL-ləri blokla (user@host bypass)
  if (pathname.includes("@")) return false;
  // Yalnız icazə verilən prefikslərə uyğun olsun
  return ALLOWED_CALLBACK_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

// Şübhəli sorğuları aşkar et
function detectSuspiciousRequest(req: NextRequest): boolean {
  const { pathname, search } = req.nextUrl;
  const fullUrl = pathname + search;

  // Path traversal cəhdləri
  if (fullUrl.includes("..") || fullUrl.includes("%2e%2e")) return true;

  // SQL injection cəhdləri URL-də
  if (/('|--|;|\/\*|\*\/|xp_|UNION\s+SELECT)/i.test(fullUrl)) return true;

  // XSS cəhdləri URL-də
  if (/<script|javascript:|on\w+\s*=/i.test(decodeURIComponent(fullUrl))) return true;

  // Null byte injection
  if (fullUrl.includes("%00") || fullUrl.includes("\0")) return true;

  return false;
}

// Şübhəli IP-ni qeyd et
function trackSuspiciousIp(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 dəqiqə
  const maxSuspicious = 10; // 10 şübhəli cəhddən sonra blokla

  const entry = suspiciousActivity.get(ip);

  if (!entry || now - entry.firstSeen > windowMs) {
    suspiciousActivity.set(ip, { count: 1, firstSeen: now });
    return false;
  }

  entry.count++;
  return entry.count >= maxSuspicious;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getIpFromRequest(request);

  // 0. Şübhəli sorğu aşkarlanması (WAF - Web Application Firewall)
  if (detectSuspiciousRequest(request)) {
    const isBlocked = trackSuspiciousIp(ip);
    if (isBlocked) {
      return NextResponse.json(
        { error: "Şübhəli fəaliyyət aşkar edildi. Giriş bloklandı." },
        { status: 403 }
      );
    }
    // İlk cəhdlərdə sadəcə 400 qaytar
    return NextResponse.json(
      { error: "Düzgün olmayan sorğu." },
      { status: 400 }
    );
  }

  // 1. API Rate Limiting
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    const methodNotAllowed =
      pathname.startsWith("/api/register") && request.method !== "POST";
    if (methodNotAllowed) {
      return NextResponse.json(
        { error: "Bu metod dəstəklənmir" },
        { status: 405 }
      );
    }

    if (!checkApiRateLimit(ip)) {
      return NextResponse.json(
        { error: "Çox sayda sorğu göndərdiniz. Zəhmət olmasa gözləyin." },
        { status: 429 }
      );
    }
  }

  // 2. API sorğularında Content-Type yoxlanışı (POST/PUT/PATCH)
  if (
    pathname.startsWith("/api") &&
    !pathname.startsWith("/api/auth") &&
    ["POST", "PUT", "PATCH"].includes(request.method)
  ) {
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type application/json olmalıdır" },
        { status: 415 }
      );
    }
  }

  // 3. Request body ölçüsü yoxlanışı (DoS qorunması)
  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    const maxSize = 1024 * 1024; // 1MB
    if (size > maxSize) {
      return NextResponse.json(
        { error: "Sorğu həcmi çox böyükdür" },
        { status: 413 }
      );
    }
  }

  // 4. Route Protection - Dashboard və digər qorunan səhifələr
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/", request.url);
      // Open Redirect qorunması - yalnız təhlükəsiz callback URL-lər
      if (isValidCallbackUrl(pathname)) {
        loginUrl.searchParams.set("callbackUrl", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Auth route-ları - artıq giriş etmiş istifadəçini dashboard-a yönləndir
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
  if (isAuthPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 6. Təhlükəsizlik başlıqları əlavə et
  const response = NextResponse.next();

  // Cache-Control - həssas səhifələr üçün
  if (isProtected) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  // Cross-Origin izolasiya başlıqları (Spectre/Meltdown qorunması)
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  // API sorğuları üçün CORS başlıqları
  if (pathname.startsWith("/api")) {
    const origin = request.headers.get("origin");
    const allowedOrigins = [
      process.env.NEXTAUTH_URL || "http://localhost:3000",
    ];

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Max-Age", "86400");
  }

  return response;
}

export const config = {
  matcher: [
    // Statik faylları və _next-i istisna et
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
