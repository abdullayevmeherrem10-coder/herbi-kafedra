import DashboardStats from "@/components/dashboard/DashboardStats";
import ActiveCourseCard from "@/components/dashboard/ActiveCourseCard";

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-[28px] font-bold text-gray-900">
          Xoş gəlmisən, Tələbənin adı, soyadı!
        </h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          Kollokviuma hazırlaşmağa davam et. 2 gündən az vaxt qaldı.
        </p>
      </div>

      <DashboardStats />

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Oxumağa davam et</h2>
        <ActiveCourseCard
          courseCode="HMH"
          category="Mühəndis Kəşfiyyatı"
          lessonTitle="Mühəndis kəşfiyyatına qoyulan tələblər"
          lessonDescription="Mühəndis kəşfiyyatı məqsədəuyğun, fasiləsiz, fəal, cəld, vaxtlı-vaxtında və gizli..."
          progress={45}
          imageUrl="/images/course-1.jpg"
          href="/dashboard/ders/muhendis-kesfiyyati-1"
        />
      </div>
    </div>
  );
}
