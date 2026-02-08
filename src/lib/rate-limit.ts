// Rate Limiting - Brute Force və DDoS hücumlarının qarşısını alır
// Hər IP üçün müəyyən vaxt ərzində icazə verilən sorğu sayını məhdudlaşdırır

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Köhnə girişləri vaxtaşırı təmizlə (memory leak qarşısını alır)
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((_entry, key) => {
    const entry = rateLimitStore.get(key);
    if (entry && now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  });
}, 60 * 1000); // Hər dəqiqə təmizlə

interface RateLimitConfig {
  // Pəncərə müddəti (millisaniyə)
  windowMs: number;
  // Pəncərə ərzində icazə verilən maksimum sorğu sayı
  maxRequests: number;
}

// Əvvəlcədən təyin edilmiş limitlər
export const RATE_LIMITS = {
  // Login cəhdləri - 15 dəqiqədə 5 cəhd
  login: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  // Qeydiyyat - 1 saatda 3 cəhd
  register: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  // Ümumi API sorğuları - 1 dəqiqədə 60 sorğu
  api: { windowMs: 60 * 1000, maxRequests: 60 },
  // Şifrə sıfırlama - 1 saatda 3 cəhd
  passwordReset: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
} as const;

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const entry = rateLimitStore.get(key);

  // Əgər giriş yoxdursa və ya vaxtı keçibsə, yeni giriş yarat
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Limit aşılıbsa
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Sayğacı artır
  entry.count++;
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

// IP ünvanını request-dən çıxar
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}
