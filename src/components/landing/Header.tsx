"use client";

import Link from "next/link";
import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Sərbəst işlərin mövzuları", href: "/serbest-isler" },
  { label: "Mühazirə materialları", href: "/muhazire" },
  { label: "Kollokvium vaxtları", href: "/kollokvium" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100/80">
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

        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/giris"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            Giriş
          </Link>
          <Link href="/qeydiyyat">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md">
              Qeydiyyat
            </button>
          </Link>
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
            <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/giris"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 text-center"
              >
                Giriş
              </Link>
              <Link href="/qeydiyyat" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-xl px-5 py-3 transition-all duration-200">
                  Qeydiyyat
                </button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
