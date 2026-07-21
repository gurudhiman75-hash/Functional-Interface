const LOCAL_DATETIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function isoToLocalDateTimeInput(value?: string, offsetMinutes?: number): string {
  if (!value) return '';
  const instant = new Date(value);
  if (Number.isNaN(instant.getTime())) return '';
  const offset = offsetMinutes ?? instant.getTimezoneOffset();
  const localClock = new Date(instant.getTime() - offset * 60_000);
  return `${localClock.getUTCFullYear()}-${pad(localClock.getUTCMonth() + 1)}-${pad(localClock.getUTCDate())}T${pad(localClock.getUTCHours())}:${pad(localClock.getUTCMinutes())}`;
}

export function localDateTimeInputToIso(value: string, offsetMinutes?: number): string | undefined {
  if (!value) return undefined;
  const match = LOCAL_DATETIME_PATTERN.exec(value);
  if (!match) return undefined;
  const [, year, month, day, hour, minute] = match;
  const numeric = [year, month, day, hour, minute].map(Number);
  const localDate = new Date(numeric[0], numeric[1] - 1, numeric[2], numeric[3], numeric[4], 0, 0);
  if (
    localDate.getFullYear() !== numeric[0]
    || localDate.getMonth() !== numeric[1] - 1
    || localDate.getDate() !== numeric[2]
    || localDate.getHours() !== numeric[3]
    || localDate.getMinutes() !== numeric[4]
  ) return undefined;
  const offset = offsetMinutes ?? localDate.getTimezoneOffset();
  const utcMillis = Date.UTC(numeric[0], numeric[1] - 1, numeric[2], numeric[3], numeric[4]) + offset * 60_000;
  return new Date(utcMillis).toISOString();
}
