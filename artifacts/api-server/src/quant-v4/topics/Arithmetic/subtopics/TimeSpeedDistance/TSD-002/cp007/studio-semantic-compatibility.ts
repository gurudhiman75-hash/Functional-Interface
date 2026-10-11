import type { TsdCp007ExecutableInput } from "./executable-types";

/** Frozen wording constrains the target, event interval and endpoint convention. */
export function cp007FamilyAcceptsInput(familyId: string, input: TsdCp007ExecutableInput): boolean {
  if (/^92-[ABCF]$/.test(familyId)) return input.occupancyTarget === "DURATION";
  if (/^92-[DE]$/.test(familyId)) return input.occupancyTarget === "OBJECT_LENGTH";
  const events: Record<string, readonly [string, string]> = {
    "93-A": ["FULL_CROSSING", "FORWARD_CLOCK"],
    "93-B": ["FULL_CROSSING", "BACKWARD_CLOCK"],
    "93-C": ["POINT_CROSSING", "FORWARD_CLOCK"],
    "93-D": ["FULL_OCCUPANCY", "FORWARD_CLOCK"],
    "93-E": ["FULL_OCCUPANCY", "BACKWARD_CLOCK"],
  };
  const event = events[familyId];
  if (event) return input.timelineIntervalKind === event[0] && input.timelineTarget === event[1];
  if (familyId === "94-A") return input.spacingTarget === "POINT_COUNT" && input.includeStartingPoint === false;
  if (familyId === "94-B") return input.spacingTarget === "POINT_COUNT" && input.includeStartingPoint === true;
  if (familyId === "94-C") return input.spacingTarget === "SPACING";
  if (familyId === "94-D" || familyId === "94-F") return input.spacingTarget === "SPEED";
  if (familyId === "94-E") return input.spacingTarget === "POINT_COUNT";
  return true;
}
