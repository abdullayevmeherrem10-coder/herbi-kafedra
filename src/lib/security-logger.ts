// Təhlükəsizlik Hadisələri Audit Log Sistemi
// Bütün təhlükəsizlik hadisələrini qeyd edir və izləyir

export type SecurityEventType =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGIN_BLOCKED"
  | "REGISTER_SUCCESS"
  | "REGISTER_FAILED"
  | "RATE_LIMIT_HIT"
  | "SUSPICIOUS_REQUEST"
  | "UNAUTHORIZED_ACCESS"
  | "INVALID_INPUT"
  | "SESSION_EXPIRED"
  | "PASSWORD_CHANGED"
  | "CSRF_VIOLATION"
  | "XSS_ATTEMPT"
  | "SQL_INJECTION_ATTEMPT"
  | "PATH_TRAVERSAL_ATTEMPT"
  | "BOT_DETECTED";

export type SecuritySeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface SecurityEvent {
  timestamp: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  ip: string;
  userAgent?: string;
  userId?: string;
  email?: string;
  path?: string;
  details?: string;
}

// Son hadisələri in-memory saxla (monitoring üçün)
const recentEvents: SecurityEvent[] = [];
const MAX_RECENT_EVENTS = 1000;

// Hadisə ciddilik dərəcəsi mapping
const eventSeverityMap: Record<SecurityEventType, SecuritySeverity> = {
  LOGIN_SUCCESS: "LOW",
  LOGIN_FAILED: "MEDIUM",
  LOGIN_BLOCKED: "HIGH",
  REGISTER_SUCCESS: "LOW",
  REGISTER_FAILED: "MEDIUM",
  RATE_LIMIT_HIT: "MEDIUM",
  SUSPICIOUS_REQUEST: "HIGH",
  UNAUTHORIZED_ACCESS: "MEDIUM",
  INVALID_INPUT: "LOW",
  SESSION_EXPIRED: "LOW",
  PASSWORD_CHANGED: "MEDIUM",
  CSRF_VIOLATION: "HIGH",
  XSS_ATTEMPT: "CRITICAL",
  SQL_INJECTION_ATTEMPT: "CRITICAL",
  PATH_TRAVERSAL_ATTEMPT: "CRITICAL",
  BOT_DETECTED: "MEDIUM",
};

export function logSecurityEvent(
  type: SecurityEventType,
  data: {
    ip: string;
    userAgent?: string;
    userId?: string;
    email?: string;
    path?: string;
    details?: string;
  }
): void {
  const severity = eventSeverityMap[type];

  const event: SecurityEvent = {
    timestamp: new Date().toISOString(),
    type,
    severity,
    ...data,
  };

  // In-memory saxla
  recentEvents.push(event);
  if (recentEvents.length > MAX_RECENT_EVENTS) {
    recentEvents.shift();
  }

  // Server console-a yaz (production-da log aggregator-a göndərilə bilər)
  const logPrefix = `[SECURITY][${severity}]`;
  const logMessage = `${logPrefix} ${type} | IP: ${data.ip} | ${data.path || ""} | ${data.details || ""}`;

  if (severity === "CRITICAL" || severity === "HIGH") {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }
}

// Son hadisələri oxu (admin panel üçün)
export function getRecentSecurityEvents(
  limit = 50,
  severity?: SecuritySeverity
): SecurityEvent[] {
  let events = [...recentEvents];

  if (severity) {
    events = events.filter((e) => e.severity === severity);
  }

  return events.slice(-limit).reverse();
}

// Müəyyən IP üçün uğursuz cəhdləri say
export function getFailedAttemptsForIp(ip: string, minutes = 60): number {
  const cutoff = new Date(Date.now() - minutes * 60 * 1000).toISOString();

  return recentEvents.filter(
    (e) =>
      e.ip === ip &&
      e.timestamp > cutoff &&
      (e.type === "LOGIN_FAILED" ||
        e.type === "SUSPICIOUS_REQUEST" ||
        e.type === "XSS_ATTEMPT" ||
        e.type === "SQL_INJECTION_ATTEMPT")
  ).length;
}

// Təhlükəsizlik statistikası
export function getSecurityStats(): {
  totalEvents: number;
  criticalEvents: number;
  highEvents: number;
  last24h: number;
} {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  return {
    totalEvents: recentEvents.length,
    criticalEvents: recentEvents.filter((e) => e.severity === "CRITICAL").length,
    highEvents: recentEvents.filter((e) => e.severity === "HIGH").length,
    last24h: recentEvents.filter((e) => e.timestamp > oneDayAgo).length,
  };
}
