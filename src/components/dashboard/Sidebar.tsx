"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Settings,
  PlusCircle,
  BookOpen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { label: "Əsas Səhifə", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kollokvium qiymətlərim", href: "/dashboard/kollokvium", icon: ClipboardList },
  { label: "Mühazirə müzakirəsi", href: "/dashboard/muzakire", icon: MessageSquare },
  { label: "Tənzimləmələr", href: "/dashboard/tenzimleme", icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-[260px] border-r border-gray-100 bg-white flex flex-col transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Hərbi Kafedra
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="px-4 pt-5 pb-2">
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl h-10 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md">
            <PlusCircle className="h-4 w-4" />
            Müəllimə müraciət et
          </button>
        </div>

        <nav className="flex-1 px-3 pt-4 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Platform
          </p>
          <ul className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <link.icon className={cn("h-[18px] w-[18px]", isActive ? "text-blue-600" : "text-gray-400")} />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
