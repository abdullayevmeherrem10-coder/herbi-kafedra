import { z } from "zod";

// ===== XSS/Injection qorunması üçün sanitizasiya funksiyaları =====

// HTML teqlərini təmizləyir (XSS qarşısını alır)
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// SQL injection pattern-lərini aşkar edir
function containsSqlInjection(value: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|FETCH|DECLARE|TRUNCATE)\b)/i,
    /(--|#|\/\*|\*\/)/,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
    /(';\s*(DROP|DELETE|INSERT|UPDATE))/i,
  ];
  return sqlPatterns.some((pattern) => pattern.test(value));
}

// Təhlükəsiz string validasiyası - XSS və SQL injection yoxlayır
const safeString = z.string().refine(
  (val) => !containsSqlInjection(val),
  { message: "Təhlükəli simvollar aşkar edildi" }
);

// ===== Autentifikasiya şemaları =====

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email tələb olunur")
    .email("Düzgün email formatı daxil edin")
    .max(255, "Email çox uzundur")
    .transform((val) => val.toLowerCase().trim()),
  password: z
    .string()
    .min(1, "Şifrə tələb olunur")
    .max(128, "Şifrə çox uzundur"),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email tələb olunur")
    .email("Düzgün email formatı daxil edin")
    .max(255, "Email çox uzundur")
    .transform((val) => val.toLowerCase().trim()),
  password: z
    .string()
    .min(8, "Şifrə ən azı 8 simvol olmalıdır")
    .max(128, "Şifrə çox uzundur")
    .regex(/[A-Z]/, "Şifrədə ən azı 1 böyük hərf olmalıdır")
    .regex(/[a-z]/, "Şifrədə ən azı 1 kiçik hərf olmalıdır")
    .regex(/[0-9]/, "Şifrədə ən azı 1 rəqəm olmalıdır")
    .regex(/[^A-Za-z0-9]/, "Şifrədə ən azı 1 xüsusi simvol olmalıdır"),
  firstName: safeString
    .pipe(z.string().min(2, "Ad ən azı 2 simvol olmalıdır").max(50, "Ad çox uzundur"))
    .transform((val) => sanitizeInput(val.trim())),
  lastName: safeString
    .pipe(z.string().min(2, "Soyad ən azı 2 simvol olmalıdır").max(50, "Soyad çox uzundur"))
    .transform((val) => sanitizeInput(val.trim())),
});

// ===== Kurs şemaları =====

export const courseSchema = z.object({
  title: safeString
    .pipe(z.string().min(3, "Başlıq ən azı 3 simvol olmalıdır").max(200, "Başlıq çox uzundur"))
    .transform((val) => sanitizeInput(val.trim())),
  description: safeString
    .pipe(z.string().max(2000, "Təsvir çox uzundur"))
    .optional()
    .transform((val) => val ? sanitizeInput(val.trim()) : undefined),
  code: z
    .string()
    .min(1, "Kurs kodu tələb olunur")
    .max(20, "Kurs kodu çox uzundur")
    .regex(/^[A-ZƏÜÖŞÇĞIİ0-9\-]+$/i, "Kurs kodunda yalnız hərflər, rəqəmlər və tire istifadə oluna bilər"),
  duration: z.number().int().positive("Müddət müsbət olmalıdır").max(10000),
  maxStudents: z.number().int().positive().max(1000).default(50),
  level: safeString.pipe(z.string().max(50)),
});

// ===== Dərs şemaları =====

export const lessonSchema = z.object({
  title: safeString
    .pipe(z.string().min(3, "Başlıq ən azı 3 simvol olmalıdır").max(200))
    .transform((val) => sanitizeInput(val.trim())),
  description: safeString
    .pipe(z.string().max(2000))
    .optional()
    .transform((val) => val ? sanitizeInput(val.trim()) : undefined),
  content: z.string().max(50000, "Məzmun çox uzundur").optional(),
  videoUrl: z
    .string()
    .url("Düzgün URL formatı daxil edin")
    .max(500)
    .optional()
    .or(z.literal("")),
  duration: z.number().int().positive().max(600).optional(),
  order: z.number().int().min(0).max(1000),
});

// ===== Axtarış şeması =====

export const searchSchema = z.object({
  query: safeString
    .pipe(z.string().min(1).max(100))
    .transform((val) => sanitizeInput(val.trim())),
});

// ===== ID validasiyası =====

export const idSchema = z.object({
  id: z.string().cuid("Düzgün ID formatı deyil"),
});

// ===== Tip ixracları =====

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
