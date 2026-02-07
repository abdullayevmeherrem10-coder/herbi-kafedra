"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen } from "lucide-react";

export default function GirisPage() {
  const [rememberPassword, setRememberPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Hərbi Kafedra
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            <div className="flex-1 text-center py-3.5 text-sm font-medium text-blue-600 border-b-2 border-blue-600 cursor-pointer">
              Giriş
            </div>
            <Link
              href="/qeydiyyat"
              className="flex-1 text-center py-3.5 text-sm font-medium text-gray-400 border-b-2 border-transparent hover:text-gray-600 transition-colors cursor-pointer"
            >
              Qeydiyyat
            </Link>
          </div>

          {/* Form */}
          <form className="p-6 space-y-5">
            {/* İstifadəçi adı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                İstifadəçi adı
              </label>
              <input
                type="text"
                placeholder=""
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Şifrə */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Şifrə
              </label>
              <input
                type="password"
                placeholder=""
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Şifrəni yadda saxla */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                Şifrəni yadda saxla
              </label>
            </div>

            {/* Daxil ol button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Daxil ol
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
