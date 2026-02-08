import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { loginSchema } from "./validations";
import { checkRateLimit, RATE_LIMITS } from "./rate-limit";
import { logSecurityEvent } from "./security-logger";

// Şifrə hash-ləmə funksiyaları
export async function hashPassword(password: string): Promise<string> {
  // Salt rounds: 12 - brute force hücumlarını çətinləşdirir
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifrə", type: "password" },
      },
      async authorize(credentials, req) {
        const clientIp =
          (req?.headers?.["x-forwarded-for"] as string) || "unknown";
        const userAgent =
          (req?.headers?.["user-agent"] as string) || "unknown";

        try {
          // 1. Input validasiyası
          const result = loginSchema.safeParse(credentials);
          if (!result.success) {
            logSecurityEvent("INVALID_INPUT", {
              ip: clientIp,
              userAgent,
              path: "/api/auth/signin",
              details: "Login formu validasiya xətası",
            });
            throw new Error("Düzgün email və şifrə daxil edin");
          }

          const { email, password } = result.data;

          // 2. Rate limiting - brute force qorunması
          const rateLimit = checkRateLimit(
            `login:${clientIp}`,
            RATE_LIMITS.login
          );

          if (!rateLimit.success) {
            logSecurityEvent("LOGIN_BLOCKED", {
              ip: clientIp,
              userAgent,
              email,
              path: "/api/auth/signin",
              details: `Rate limit aşıldı. ${RATE_LIMITS.login.maxRequests} cəhd ${RATE_LIMITS.login.windowMs / 60000} dəqiqədə`,
            });
            throw new Error(
              "Çox sayda uğursuz cəhd. Zəhmət olmasa 15 dəqiqə gözləyin"
            );
          }

          // 3. İstifadəçini tap
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              password: true,
              firstName: true,
              lastName: true,
              role: true,
              avatarUrl: true,
            },
          });

          // Timing attack qarşısını almaq üçün - istifadəçi tapılmasa da hash müqayisəsi edir
          if (!user) {
            await bcrypt.hash(password, 12);
            logSecurityEvent("LOGIN_FAILED", {
              ip: clientIp,
              userAgent,
              email,
              path: "/api/auth/signin",
              details: "İstifadəçi tapılmadı",
            });
            throw new Error("Email və ya şifrə yanlışdır");
          }

          // 4. Şifrəni yoxla
          const isPasswordValid = await verifyPassword(
            password,
            user.password
          );
          if (!isPasswordValid) {
            logSecurityEvent("LOGIN_FAILED", {
              ip: clientIp,
              userAgent,
              email,
              userId: user.id,
              path: "/api/auth/signin",
              details: "Yanlış şifrə",
            });
            throw new Error("Email və ya şifrə yanlışdır");
          }

          // 5. Uğurlu giriş
          logSecurityEvent("LOGIN_SUCCESS", {
            ip: clientIp,
            userAgent,
            email,
            userId: user.id,
            path: "/api/auth/signin",
            details: `Rol: ${user.role}`,
          });

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            avatarUrl: user.avatarUrl,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Giriş zamanı xəta baş verdi");
        }
      },
    }),
  ],

  // Session konfiqurasiyası - gücləndirilmiş
  session: {
    strategy: "jwt",
    // Session müddəti: 8 saat (təhsil platforması üçün optimal)
    maxAge: 8 * 60 * 60,
    // Session yenilənmə müddəti: 30 dəqiqə
    updateAge: 30 * 60,
  },

  // JWT konfiqurasiyası
  jwt: {
    maxAge: 8 * 60 * 60,
  },

  // Callback-lər
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.avatarUrl = (user as any).avatarUrl;
        // Token yaradılma vaxtını qeyd et (session hijacking aşkarlanması)
        token.iat = Math.floor(Date.now() / 1000);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).avatarUrl = token.avatarUrl;
      }
      return session;
    },
  },

  // Səhifə yönlənmələri
  pages: {
    signIn: "/",
    error: "/",
  },

  // Təhlükəsizlik cookie parametrləri
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-next-auth.csrf-token"
          : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  // Debug rejimi yalnız development-də
  debug: process.env.NODE_ENV === "development",
};
