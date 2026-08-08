import { normalizeAngleDeg } from "./geometry";
import type {
  SpatialClockHandAngles,
  SpatialClockTime,
} from "./types";

export const WATER_CLOCK_PRESENTATION_POLICY = "DIAGRAM_ONLY" as const;

function assertValidClockTime(time: SpatialClockTime): void {
  if (
    !Number.isInteger(time.hour) ||
    time.hour < 1 ||
    time.hour > 12 ||
    !Number.isInteger(time.minute) ||
    time.minute < 0 ||
    time.minute > 59
  ) {
    throw new Error("Clock time must use hour 1..12 and minute 0..59.");
  }
}

export function clockTimeToTotalMinutes(time: SpatialClockTime): number {
  assertValidClockTime(time);
  return (time.hour % 12) * 60 + time.minute;
}

export function totalMinutesToClockTime(totalMinutes: number): SpatialClockTime {
  if (!Number.isInteger(totalMinutes)) {
    throw new Error("Clock total minutes must be an integer.");
  }

  const normalized = ((totalMinutes % 720) + 720) % 720;
  const zeroBasedHour = Math.floor(normalized / 60);
  return {
    hour: zeroBasedHour === 0 ? 12 : zeroBasedHour,
    minute: normalized % 60,
  };
}

/**
 * Angles are measured clockwise from 12 o'clock.
 * The hour hand advances continuously by 0.5 degrees per minute.
 */
export function clockTimeToHandAngles(
  time: SpatialClockTime,
): SpatialClockHandAngles {
  assertValidClockTime(time);
  return {
    hourAngleDeg: normalizeAngleDeg((time.hour % 12) * 30 + time.minute * 0.5),
    minuteAngleDeg: normalizeAngleDeg(time.minute * 6),
  };
}

export function reflectClockHandsVertically(
  angles: SpatialClockHandAngles,
): SpatialClockHandAngles {
  return {
    hourAngleDeg: normalizeAngleDeg(360 - angles.hourAngleDeg),
    minuteAngleDeg: normalizeAngleDeg(360 - angles.minuteAngleDeg),
  };
}

export function reflectClockHandsHorizontally(
  angles: SpatialClockHandAngles,
): SpatialClockHandAngles {
  return {
    hourAngleDeg: normalizeAngleDeg(180 - angles.hourAngleDeg),
    minuteAngleDeg: normalizeAngleDeg(180 - angles.minuteAngleDeg),
  };
}

function angularDistance(left: number, right: number): number {
  const difference = Math.abs(normalizeAngleDeg(left) - normalizeAngleDeg(right));
  return Math.min(difference, 360 - difference);
}

export function clockHandAnglesEquivalent(
  left: SpatialClockHandAngles,
  right: SpatialClockHandAngles,
  toleranceDeg = 1e-9,
): boolean {
  return (
    angularDistance(left.hourAngleDeg, right.hourAngleDeg) <= toleranceDeg &&
    angularDistance(left.minuteAngleDeg, right.minuteAngleDeg) <= toleranceDeg
  );
}

export function mirrorClockTimeShortcut(
  time: SpatialClockTime,
): SpatialClockTime {
  const totalMinutes = clockTimeToTotalMinutes(time);
  return totalMinutesToClockTime((720 - totalMinutes) % 720);
}

export interface MirrorClockCrossCheck {
  ok: boolean;
  sourceTime: SpatialClockTime;
  shortcutTime: SpatialClockTime;
  geometricAngles: SpatialClockHandAngles;
  shortcutAngles: SpatialClockHandAngles;
}

export function validateMirrorClockCrossCheck(
  time: SpatialClockTime,
): MirrorClockCrossCheck {
  const sourceAngles = clockTimeToHandAngles(time);
  const geometricAngles = reflectClockHandsVertically(sourceAngles);
  const shortcutTime = mirrorClockTimeShortcut(time);
  const shortcutAngles = clockTimeToHandAngles(shortcutTime);

  return {
    ok: clockHandAnglesEquivalent(geometricAngles, shortcutAngles),
    sourceTime: { ...time },
    shortcutTime,
    geometricAngles,
    shortcutAngles,
  };
}

/**
 * Returns a real minute-resolution clock time only when both supplied hand
 * angles exactly match one. Horizontal water reflection generally returns
 * null, so WAT-001 must present reflected clocks as diagrams, not stated times.
 */
export function findClockTimeMatchingHandAngles(
  angles: SpatialClockHandAngles,
  toleranceDeg = 1e-9,
): SpatialClockTime | null {
  for (let totalMinutes = 0; totalMinutes < 720; totalMinutes += 1) {
    const time = totalMinutesToClockTime(totalMinutes);
    if (
      clockHandAnglesEquivalent(
        angles,
        clockTimeToHandAngles(time),
        toleranceDeg,
      )
    ) {
      return time;
    }
  }

  return null;
}
