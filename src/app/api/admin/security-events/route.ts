import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-security";
import {
  getRecentSecurityEvents,
  getSecurityStats,
  type SecuritySeverity,
} from "@/lib/security-logger";

// Yalnız ADMIN roluna malik istifadəçilər üçün
export async function GET(request: Request) {
  // Autentifikasiya və avtorizasiya yoxlanışı
  const session = await requireRole("ADMIN");
  if (!session) {
    return NextResponse.json(
      { error: "Bu resursa giriş icazəniz yoxdur" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
  const severity = searchParams.get("severity") as SecuritySeverity | null;

  const events = getRecentSecurityEvents(
    limit,
    severity || undefined
  );
  const stats = getSecurityStats();

  return NextResponse.json({ events, stats });
}
