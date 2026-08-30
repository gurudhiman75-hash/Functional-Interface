import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, CheckCheck, Clock3, Settings2, X } from "lucide-react";
import { useLocation } from "wouter";

import {
  getCurrentAffairsNotifications,
  markAllCurrentAffairsNotificationsRead,
  updateCurrentAffairsNotificationPreferences,
  updateCurrentAffairsNotificationStatus,
} from "@/lib/current-affairs-notifications";
import { getUser } from "@/lib/storage";

function shortTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(date);
}

export default function CurrentAffairsNotificationBell() {
  const user = getUser();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const query = useQuery({
    queryKey: ["current-affairs-notifications", user?.id],
    queryFn: () => getCurrentAffairsNotifications(20),
    enabled: Boolean(user),
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
    retry: false,
  });
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("07:00");
  const [dailyCap, setDailyCap] = useState("3");
  const [gapMinutes, setGapMinutes] = useState("180");

  useEffect(() => {
    const preferences = query.data?.preferences;
    if (!preferences) return;
    setQuietStart(preferences.quietHoursStart);
    setQuietEnd(preferences.quietHoursEnd);
    setDailyCap(String(preferences.dailyNotificationCap));
    setGapMinutes(String(preferences.notificationGapMinutes));
  }, [query.data?.preferences]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["current-affairs-notifications"] });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "read" | "dismissed" }) => updateCurrentAffairsNotificationStatus(id, status),
    onSuccess: invalidate,
  });
  const readAllMutation = useMutation({ mutationFn: markAllCurrentAffairsNotificationsRead, onSuccess: invalidate });
  const preferenceMutation = useMutation({
    mutationFn: updateCurrentAffairsNotificationPreferences,
    onSuccess: invalidate,
  });

  if (!user) return null;
  const data = query.data;
  const preferences = data?.preferences;
  const muted = preferences?.notificationsMutedUntil
    ? new Date(preferences.notificationsMutedUntil).getTime() > Date.now()
    : false;

  function openNotification(id: string, status: string, deepLink: string) {
    if (status === "unread") statusMutation.mutate({ id, status: "read" });
    setOpen(false);
    setLocation(deepLink);
  }

  function saveSchedule() {
    preferenceMutation.mutate({
      quietHoursStart: quietStart,
      quietHoursEnd: quietEnd,
      dailyNotificationCap: Number(dailyCap),
      notificationGapMinutes: Number(gapMinutes),
    });
  }

  function toggleMute() {
    const notificationsMutedUntil = muted ? null : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    preferenceMutation.mutate({ notificationsMutedUntil });
  }

  return (
    <div className="relative" data-testid="current-affairs-notification-center">
      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value);
          if (!open) void query.refetch();
        }}
        className="et-interactive relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm hover:bg-muted hover:text-primary"
        aria-label={data?.unreadCount ? `${data.unreadCount} unread Current Affairs notifications` : "Current Affairs notifications"}
        aria-expanded={open}
        title="Current Affairs notifications"
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {data?.unreadCount ? (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-background">
            {data.unreadCount > 9 ? "9+" : data.unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="et-popover absolute right-0 top-full z-[70] mt-3 w-[min(390px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">Current Affairs</p>
              <h2 className="mt-0.5 text-sm font-semibold text-foreground">Notifications</h2>
            </div>
            <div className="flex items-center gap-1">
              {data?.unreadCount ? (
                <button type="button" onClick={() => readAllMutation.mutate()} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-primary" aria-label="Mark all notifications read" title="Mark all read">
                  <CheckCheck className="h-4 w-4" />
                </button>
              ) : null}
              <button type="button" onClick={() => setSettingsOpen((value) => !value)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-primary" aria-label="Notification settings" title="Notification settings">
                <Settings2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {settingsOpen && preferences ? (
            <div className="border-b border-border bg-muted/25 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-foreground">In-app CA notifications</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">No push, email or SMS delivery.</p>
                </div>
                <button
                  type="button"
                  onClick={() => preferenceMutation.mutate({ inAppNotificationsEnabled: !preferences.inAppNotificationsEnabled })}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${preferences.inAppNotificationsEnabled ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}
                >
                  {preferences.inAppNotificationsEnabled ? "On" : "Off"}
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="text-[10px] font-semibold text-muted-foreground">Quiet from<input type="time" value={quietStart} onChange={(event) => setQuietStart(event.target.value)} className="mt-1 block h-9 w-full rounded-lg border border-border bg-background px-2 text-xs text-foreground" /></label>
                <label className="text-[10px] font-semibold text-muted-foreground">Quiet until<input type="time" value={quietEnd} onChange={(event) => setQuietEnd(event.target.value)} className="mt-1 block h-9 w-full rounded-lg border border-border bg-background px-2 text-xs text-foreground" /></label>
                <label className="text-[10px] font-semibold text-muted-foreground">Daily cap<select value={dailyCap} onChange={(event) => setDailyCap(event.target.value)} className="mt-1 block h-9 w-full rounded-lg border border-border bg-background px-2 text-xs text-foreground">{[1,2,3,4,5,6,7,8].map((value) => <option key={value} value={value}>{value}/day</option>)}</select></label>
                <label className="text-[10px] font-semibold text-muted-foreground">Minimum gap<select value={gapMinutes} onChange={(event) => setGapMinutes(event.target.value)} className="mt-1 block h-9 w-full rounded-lg border border-border bg-background px-2 text-xs text-foreground">{[60,120,180,240,360,480,720].map((value) => <option key={value} value={value}>{value < 60 ? `${value}m` : `${value / 60}h`}</option>)}</select></label>
              </div>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={saveSchedule} disabled={preferenceMutation.isPending} className="min-h-9 flex-1 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-60">Save schedule</button>
                <button type="button" onClick={toggleMute} disabled={preferenceMutation.isPending} className="min-h-9 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-muted-foreground hover:bg-muted">{muted ? "Unmute" : "Mute 24h"}</button>
              </div>
              {muted && preferences.notificationsMutedUntil ? <p className="mt-2 text-[10px] text-amber-600">Muted until {shortTime(preferences.notificationsMutedUntil)}</p> : null}
            </div>
          ) : null}

          <div className="max-h-[420px] overflow-y-auto">
            {query.isLoading ? <div className="p-5 text-sm text-muted-foreground">Loading notifications…</div> : data?.notifications.length ? data.notifications.map((notification) => (
              <div key={notification.id} className={`group border-b border-border/70 px-4 py-3 last:border-0 ${notification.status === "unread" ? "bg-primary/[0.035]" : "bg-card"}`}>
                <div className="flex items-start gap-3">
                  <button type="button" onClick={() => openNotification(notification.id, notification.status, notification.deepLink)} className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-2">
                      {notification.status === "unread" ? <span className="h-2 w-2 shrink-0 rounded-full bg-primary" /> : null}
                      <p className="truncate text-xs font-semibold text-foreground">{notification.title}</p>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-muted-foreground">{notification.body}</p>
                    <p className="mt-1.5 flex items-center gap-1 text-[9px] text-muted-foreground/70"><Clock3 className="h-3 w-3" />{shortTime(notification.deliveredAt)}</p>
                  </button>
                  <button type="button" onClick={() => statusMutation.mutate({ id: notification.id, status: "dismissed" })} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground/60 opacity-70 hover:bg-muted hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100" aria-label="Dismiss notification">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-7 text-center">
                {preferences?.inAppNotificationsEnabled === false ? <BellOff className="mx-auto h-6 w-6 text-muted-foreground/50" /> : <Bell className="mx-auto h-6 w-6 text-muted-foreground/50" />}
                <p className="mt-2 text-sm font-semibold text-foreground">{preferences?.inAppNotificationsEnabled === false ? "Notifications are off" : "You’re all caught up"}</p>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{preferences?.inAppNotificationsEnabled === false ? "Turn them back on from settings whenever you want." : "Due revision and fresh Current Affairs will appear here without nagging."}</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
