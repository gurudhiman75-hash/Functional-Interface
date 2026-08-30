import { apiRequest } from "@/lib/api";

export type CurrentAffairsNotification = {
  id: string;
  type: "revision_due" | "recovery_due" | "daily_target" | "daily_pack" | "saved_review";
  urgency: "high" | "normal";
  title: string;
  body: string;
  deepLink: string;
  count: number;
  status: "unread" | "read";
  deliveredAt: string;
  readAt: string | null;
};

export type CurrentAffairsNotificationPreferences = {
  inAppNotificationsEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  dailyNotificationCap: number;
  notificationGapMinutes: number;
  notificationsMutedUntil: string | null;
};

export type CurrentAffairsNotificationInbox = {
  unreadCount: number;
  notifications: CurrentAffairsNotification[];
  preferences: CurrentAffairsNotificationPreferences;
  generatedAt: string;
};

export function getCurrentAffairsNotifications(limit = 20) {
  return apiRequest<CurrentAffairsNotificationInbox>(`/current-affairs/notifications?limit=${Math.max(1, Math.min(50, limit))}`);
}

export function updateCurrentAffairsNotificationPreferences(input: Partial<CurrentAffairsNotificationPreferences>) {
  return apiRequest<{ preferences: CurrentAffairsNotificationPreferences; updatedAt: string }>(
    "/current-affairs/notifications/preferences",
    { method: "PATCH", body: JSON.stringify(input) },
  );
}

export function updateCurrentAffairsNotificationStatus(id: string, status: "read" | "dismissed") {
  return apiRequest<{ id: string; status: string }>(`/current-affairs/notifications/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function markAllCurrentAffairsNotificationsRead() {
  return apiRequest<{ updated: number }>("/current-affairs/notifications/read-all", { method: "POST" });
}
