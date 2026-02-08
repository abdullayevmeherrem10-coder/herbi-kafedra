import { createClient } from "@supabase/supabase-js";

// Supabase konfiqurasiyası
// XƏBƏRDARLIQ: Bu client yalnız server-side istifadə olunmalıdır.
// Client-side-da birbaşa verilənlər bazasına giriş edilməməlidir.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Yalnız konfiqurasiya mövcuddursa client yarat
function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  // URL validasiyası - SSRF qorunması
  try {
    const url = new URL(supabaseUrl);
    if (
      !url.hostname.endsWith(".supabase.co") &&
      !url.hostname.endsWith(".supabase.in")
    ) {
      console.warn("[SECURITY] Supabase URL etibarlı domain-ə aid deyil");
      return null;
    }
  } catch {
    console.warn("[SECURITY] Supabase URL formatı düzgün deyil");
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Auto refresh session-u söndür (NextAuth istifadə olunur)
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        "X-Client-Info": "herbi-kafedra-server",
      },
    },
  });
}

export const supabase = createSupabaseClient();
