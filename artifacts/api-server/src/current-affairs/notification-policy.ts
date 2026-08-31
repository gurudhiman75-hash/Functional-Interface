export type CurrentAffairsNotificationType = "revision_due" | "recovery_due" | "daily_target" | "daily_pack" | "saved_review";
export type CurrentAffairsNotificationStatus = "unread" | "read" | "dismissed";

export const DEFAULT_CURRENT_AFFAIRS_QUIET_START = "22:00";
export const DEFAULT_CURRENT_AFFAIRS_QUIET_END = "07:00";
export const DEFAULT_CURRENT_AFFAIRS_DAILY_NOTIFICATION_CAP = 3;
export const DEFAULT_CURRENT_AFFAIRS_NOTIFICATION_GAP_MINUTES = 180;

const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function minuteOfDay(value: string): number | null {
  if (!TIME_PATTERN.test(value)) return null;
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

export function normalizeCurrentAffairsQuietTime(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return TIME_PATTERN.test(normalized) ? normalized : null;
}

export function normalizeCurrentAffairsNotificationCap(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 8 ? parsed : null;
}

export function normalizeCurrentAffairsNotificationGapMinutes(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 60 && parsed <= 720 ? parsed : null;
}

export function normalizeCurrentAffairsMuteUntil(value: unknown, now = new Date()): Date | null | undefined {
  if (value == null || value === "") return null;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return undefined;
  if (parsed.getTime() < now.getTime() - 5 * 60 * 1000) return undefined;
  if (parsed.getTime() > now.getTime() + 30 * 24 * 60 * 60 * 1000) return undefined;
  return parsed;
}

export function currentAffairsIndiaClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return {
    dayKey: `${value("year")}-${value("month")}-${value("day")}`,
    localTime: `${value("hour")}:${value("minute")}`,
  };
}

export function isCurrentAffairsQuietTime(args: { localTime: string; quietStart: string; quietEnd: string }): boolean {
  const current = minuteOfDay(args.localTime);
  const start = minuteOfDay(args.quietStart);
  const end = minuteOfDay(args.quietEnd);
  if (current == null || start == null || end == null) throw new Error("Current Affairs quiet-hour time is invalid");
  if (start === end) return false;
  if (start < end) return current >= start && current < end;
  return current >= start || current < end;
}

export type CurrentAffairsNotificationEligibility = {
  allowed: boolean;
  reason: "allowed" | "disabled" | "muted" | "quiet_hours" | "daily_cap" | "minimum_gap";
};

export function canDeliverCurrentAffairsNotification(args: {
  now: Date;
  localTime: string;
  enabled: boolean;
  muteUntil: Date | null;
  quietStart: string;
  quietEnd: string;
  deliveredToday: number;
  dailyCap: number;
  lastDeliveredAt: Date | null;
  minimumGapMinutes: number;
}): CurrentAffairsNotificationEligibility {
  if (!args.enabled) return { allowed: false, reason: "disabled" };
  if (args.muteUntil && args.muteUntil.getTime() > args.now.getTime()) return { allowed: false, reason: "muted" };
  if (isCurrentAffairsQuietTime({ localTime: args.localTime, quietStart: args.quietStart, quietEnd: args.quietEnd })) {
    return { allowed: false, reason: "quiet_hours" };
  }
  if (args.deliveredToday >= args.dailyCap) return { allowed: false, reason: "daily_cap" };
  if (args.lastDeliveredAt) {
    const gapMs = args.minimumGapMinutes * 60 * 1000;
    if (args.now.getTime() - args.lastDeliveredAt.getTime() < gapMs) return { allowed: false, reason: "minimum_gap" };
  }
  return { allowed: true, reason: "allowed" };
}
