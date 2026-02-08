"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Xətanı logla amma təfərrüatları istifadəçiyə göstərmə (məlumat sızması qorunması)
    console.error("[APP_ERROR]", error.digest || "unknown");
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Xəta baş verdi
        </h2>
        {/* Xəta detallarını istifadəçiyə göstərmə - məlumat sızması qorunması */}
        <p className="text-sm text-gray-500 mb-6">
          Gözlənilməz xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.
        </p>
        <button
          onClick={reset}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors"
        >
          Yenidən cəhd et
        </button>
      </div>
    </div>
  );
}
