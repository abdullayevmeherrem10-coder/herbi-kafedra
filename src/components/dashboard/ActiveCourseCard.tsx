"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import Link from "next/link";

interface ActiveCourseCardProps {
  courseCode: string;
  category: string;
  lessonTitle: string;
  lessonDescription: string;
  progress: number;
  imageUrl: string;
  href: string;
}

export default function ActiveCourseCard({
  courseCode,
  category,
  lessonTitle,
  lessonDescription,
  progress,
  imageUrl,
  href,
}: ActiveCourseCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-[280px] md:w-[340px] h-[200px] sm:h-auto flex-shrink-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt={lessonTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg cursor-pointer hover:bg-white hover:scale-110 transition-all duration-200">
              <Play className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 ml-0.5" />
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-blue-50 text-blue-600 text-[11px] font-semibold px-2.5 py-1 rounded-md">
              {courseCode}
            </span>
            <span className="text-sm text-gray-400">{category}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{lessonTitle}</h3>

          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {lessonDescription}
          </p>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Proqres</span>
              <span className="text-sm font-bold text-gray-900">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-blue-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Link href={href}>
            <button className="mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 h-10 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md">
              Davam et
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
