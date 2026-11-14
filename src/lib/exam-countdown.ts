/** Date-only schedules use the Indian calendar day, independent of browser timezone. */
export function examCountdown(value: string | undefined, now = new Date()) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.toISOString().slice(0, 10) !== value) return null;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (name: string) => Number(today.find(item => item.type === name)?.value);
  const days = Math.round((date.getTime() - Date.UTC(part("year"), part("month") - 1, part("day"))) / 86400000);
  return { date: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date), days };
}
