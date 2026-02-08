"use client";

import Link from "next/link";
import { BookOpen, Menu, X, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState, useCallback } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Sərbəst işlərin mövzuları", href: "/serbest-isler" },
  { label: "Mühazirə materialları", href: "/muhazire" },
  { label: "Kollokvium vaxtları", href: "/kollokvium" },
];

// Maksimum input uzunluqları (buffer overflow / DoS qorunması)
const MAX_EMAIL_LENGTH = 255;
const MAX_PASSWORD_LENGTH = 128;

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  // Honeypot sahəsi - botlar tərəfindən doldurulur, əsl istifadəçilər görmür
  const [honeypot, setHoneypot] = useState("");

  // Client-side rate limiting (əlavə qorunma təbəqəsi)
  const isClientBlocked = loginAttempts >= 5;

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Honeypot yoxlanışı - bot aşkarlanması
    if (honeypot) {
      // Bot aşkar edildi - saxta uğurlu cavab göndər (bot-u aldatmaq üçün)
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
      return;
    }

    // Client-side rate limiting
    if (isClientBlocked) {
      setError("Çox sayda uğursuz cəhd. Zəhmət olmasa bir az gözləyin.");
      return;
    }

    // Client-side validasiya
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Email daxil edin");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Düzgün email formatı daxil edin");
      return;
    }
    if (!password) {
      setError("Şifrə daxil edin");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: trimmedEmail,
        password,
        redirect: false,
      });

      if (result?.error) {
        setLoginAttempts((prev) => prev + 1);
        setError(result.error);
        // Şifrəni təmizlə (təhlükəsizlik üçün)
        setPassword("");
      } else if (result?.ok) {
        setModalOpen(false);
        setEmail("");
        setPassword("");
        setLoginAttempts(0);
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Giriş zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  }, [email, password, isClientBlocked, honeypot, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Hərbi Kafedra
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 px-4 py-2 rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden sm:flex items-center">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-2 transition-all duration-200"
                >
                  Çıxış
                </button>
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Sistemə Giriş
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Menyu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-700" />
            ) : (
              <Menu className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg">
            <nav className="flex flex-col p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 px-4 py-3 rounded-xl transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-gray-100">
                {session?.user ? (
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl px-5 py-3 transition-all duration-200"
                  >
                    Çıxış
                  </button>
                ) : (
                  <button
                    onClick={() => { setMobileMenuOpen(false); setModalOpen(true); }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-xl px-5 py-3 transition-all duration-200"
                  >
                    Sistemə Giriş
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Təhlükəsiz Login Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2 className="text-lg font-semibold text-gray-800">Sistemə Giriş</h2>
              <button
                onClick={() => { setModalOpen(false); setError(""); }}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <form className="p-6 space-y-5" onSubmit={handleLogin} noValidate>
              {/* Honeypot sahəsi - botlar üçün tələ (CSS ilə gizlədilir) */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
                <label htmlFor="website">Veb sayt</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Xəta mesajı */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.slice(0, MAX_EMAIL_LENGTH))}
                  placeholder="nümunə@email.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Şifrə
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value.slice(0, MAX_PASSWORD_LENGTH))}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="w-full px-4 py-2.5 pr-10 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Rate limit xəbərdarlığı */}
              {loginAttempts >= 3 && (
                <p className="text-xs text-amber-600">
                  {5 - loginAttempts} cəhd qalıb. Bundan sonra müvəqqəti bloklanacaqsınız.
                </p>
              )}

              <button
                type="submit"
                disabled={loading || isClientBlocked}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Yoxlanılır...
                  </>
                ) : isClientBlocked ? (
                  "Müvəqqəti bloklanıb"
                ) : (
                  "Daxil ol"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
