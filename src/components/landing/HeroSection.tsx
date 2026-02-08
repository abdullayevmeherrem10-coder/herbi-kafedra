"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/60 px-4 py-1.5">
              <span className="text-xs text-blue-600 font-medium">
                Saytı hazırladı : Kapitan Məhərrəm Abdullayev
              </span>
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold leading-[1.1] text-gray-900">
                Asan
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold leading-[1.1] bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Təhsil
              </h1>
            </div>

            <p className="text-sm sm:text-base text-gray-500 max-w-[420px] leading-relaxed mx-auto lg:mx-0">
              Bu layihə kursantlar üçün hazırlanmış özəl təhsil platformasıdır.
              Platforma təhsil idarəetməsini asanlaşdırmaq məqsədilə
              yaradılmışdır.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
              <Link href="/hesabat">
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 sm:px-7 h-11 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-blue-500/25">
                  Həftəlik hesabat
                </button>
              </Link>
              <Link href="/ders-cedveli">
                <button className="rounded-xl px-6 sm:px-7 h-11 text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                  Dərs Cədvəli
                </button>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-3 pt-4">
              <div className="flex -space-x-2">
                {["bg-yellow-400", "bg-sky-400", "bg-orange-400", "bg-pink-400"].map(
                  (bg, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full border-2 border-white ${bg}`}
                    />
                  )
                )}
              </div>
              <span className="text-sm text-gray-400 ml-1">Versiya 1.1</span>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-students.jpg"
                alt="Tələbələr"
                width={600}
                height={420}
                className="object-cover w-full h-[280px] sm:h-[350px] lg:h-[420px] group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
