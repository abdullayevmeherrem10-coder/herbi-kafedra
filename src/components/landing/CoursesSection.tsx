"use client";

import CourseCard from "./CourseCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    title: "Hərbi Mühəndis Hazırlığı",
    description: "«Hərbi mühəndis hazırlığı» fənninin tədrisinin əsas məqsədi - bölmələr üçün hərbi mühəndis işini bilən, döyüşün bütün növlərində bölmələrin mühəndis təminatını təşkil etməyi və yerinə yetirməyi bacaran zabitlər hazırlamaqdır.",
    imageUrl: "/images/course-1.jpg",
    code: "HMH",
    level: "IV kurslar",
    groups: ["YT22A1", "YT22A2"],
    studentCount: 50,
    duration: 45,
  },
  {
    title: "Hərbi Mühəndis Texnikası",
    description: "«Hərbi mühəndis texnikası» fənninin tədrisinin əsas məqsədi - kursantlara Mühəndis maşınlarının mühəndis təminatı tapşırıqlarının yerinə yetirilməsində rolunu öyrətməkdir.",
    imageUrl: "/images/course-2.jpg",
    code: "HMT",
    level: "II kurslar",
    groups: ["YT24A1", "YT24A2"],
    studentCount: 50,
    duration: 60,
  },
  {
    title: "Ümumqoşun Hazırlığı-2",
    description: "«Ümumqoşun hazırlığı-2» fənninin əsas məqsədi kursantlara döyüş hazırlığının əsas prinsiplərini öyrətmək və silahlı qüvvələrdə xidmət üçün zəruri olan nəzəri-praktiki bilikləri aşılamaqdır.",
    imageUrl: "/images/course-3.jpg",
    code: "ÜH-2",
    level: "I kurslar",
    groups: ["HFT25A1", "HFT25A2"],
    studentCount: 50,
    duration: 30,
  },
];

export default function CoursesSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-4">
          <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-gray-900 italic leading-tight">
            Tədris edilən fənlər
          </h2>
          <Link
            href="/fennler"
            className="hidden md:inline-flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:gap-2.5 transition-all duration-200"
          >
            Bütün fənlərə bax
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mb-8 sm:mb-10">
          Yanğın Təhlükəsizliyi Fakültəsinin II və IV kursları, eləcə də Həyat
          Fəaliyyətin Təhlükəsizliyi Fakültəsinin I kursları üçün
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course) => (
            <CourseCard key={course.code} {...course} />
          ))}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link
            href="/fennler"
            className="inline-flex items-center gap-1.5 text-blue-600 text-sm font-medium bg-blue-50 px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
          >
            Bütün fənlərə bax
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
