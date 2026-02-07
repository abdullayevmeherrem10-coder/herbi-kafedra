"use client";

import { Search, Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-lg px-4 sm:px-6 gap-4">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Menyu"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Axtar..."
            className="w-full pl-10 pr-4 h-10 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200">
          <AvatarImage src="/images/avatar.jpg" alt="Profil" />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
            MA
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
