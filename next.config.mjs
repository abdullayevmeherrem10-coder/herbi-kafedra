/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Yalnız etibarlı domain-lərdən şəkil yükləməyə icazə ver (SSRF qorunması)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
      },
    ],
    // Şəkil ölçüsü limiti
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Şəkil formatları
    formats: ["image/webp"],
  },

  // Təhlükəsizlik başlıqları (Security Headers)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // MIME type sniffing hücumlarının qarşısını alır
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Clickjacking hücumlarının qarşısını alır
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // XSS filtrini aktivləşdirir
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // HTTPS məcburi edir (HSTS) - 2 il, preload
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Referrer məlumatını məhdudlaşdırır
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Browser feature-lərini məhdudlaşdırır (Permissions Policy)
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
          },
          // Content Security Policy - XSS, data injection hücumlarının qarşısını alır
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js üçün unsafe-inline lazımdır, amma unsafe-eval silindi
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // data: və blob: silindi - şəkil exfiltrasiyanın qarşısını alır
              "img-src 'self' https://*.supabase.co https://*.supabase.in",
              "connect-src 'self' https://*.supabase.co",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
              // Object və media mənbələrini məhdudlaşdır
              "object-src 'none'",
              "media-src 'self'",
              // Worker-ləri məhdudlaşdır
              "worker-src 'self'",
              // Manifest
              "manifest-src 'self'",
            ].join("; "),
          },
          // Spectre/Meltdown yan-kanal hücumlarına qarşı
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          // DNS prefetch-i məhdudlaşdır (data sızması qorunması)
          {
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },
          // Download-ları qorunma (IE)
          {
            key: "X-Download-Options",
            value: "noopen",
          },
          // Adobe cross-domain policy
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
        ],
      },
      // API route-lar üçün əlavə cache qorunması
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
        ],
      },
    ];
  },

  // Powered-by başlığını gizlədir (server fingerprinting qarşısını alır)
  poweredByHeader: false,

  // Server-side source map-ları deaktiv et (production-da kod ifşasının qarşısını alır)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
