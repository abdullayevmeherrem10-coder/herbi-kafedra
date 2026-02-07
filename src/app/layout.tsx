import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hərbi Kafedra - Təhsil İdarəetmə Sistemi",
  description:
    "Bu layihə kursantlar üçün hazırlanmış özəl təhsil platformasıdır. Platforma təhsil idarəetməsini asanlaşdırmaq məqsədilə yaradılmışdır.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
