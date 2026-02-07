"use client";

import { Copy, Clock, UserCheck } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-gray-500">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-blue-600 cursor-pointer hover:underline">{subtitle}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-blue-50/50 text-blue-500">{icon}</div>
      </div>
    </div>
  );
}

export default function DashboardStats() {
  const stats: StatCardProps[] = [
    {
      title: "Kollokviumda düşə biləcək mühazirələr",
      value: "1,2,3,4",
      subtitle: "Oxumaq üçün kliklə",
      icon: <Copy className="h-5 w-5" />,
    },
    {
      title: "Oxumağa sərf edilən vaxt",
      value: "0.5 saat",
      subtitle: "90% tələbədən daha az",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      title: "Özünü yoxlama testləri",
      value: "105 düz, 25 səhv",
      subtitle: "İlk 5-likdə",
      icon: <UserCheck className="h-5 w-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
