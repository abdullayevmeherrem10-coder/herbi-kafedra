"use client";

import Image from "next/image";
import { Users, Clock, Star } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  imageUrl: string;
  code: string;
  level: string;
  groups: string[];
  studentCount: number;
  duration: number;
}

export default function CourseCard({
  title,
  description,
  imageUrl,
  code,
  level,
  groups,
  studentCount,
  duration,
}: CourseCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-sm">
            {level}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-blue-50 text-blue-600 text-[11px] font-semibold px-2.5 py-1 rounded-md">
            {code}
          </span>
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-[11px] text-gray-500">{groups.join("  ")}</span>
          </div>
        </div>

        <h3 className="font-semibold text-[15px] text-gray-900 mb-2">{title}</h3>

        <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Users className="h-3.5 w-3.5" />
            <span className="text-[12px]">{studentCount} tələbə</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[12px]">{duration} saat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
