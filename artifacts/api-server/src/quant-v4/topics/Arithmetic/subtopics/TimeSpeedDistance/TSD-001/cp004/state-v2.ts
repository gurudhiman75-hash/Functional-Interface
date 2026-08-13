import { add, divide, equals, multiply, rational } from "../foundation/rational";
import { generateCp004State } from "./generator";
import type { TsdCp004GeneratedState } from "./runtime-types";

function ordinal(seed: string): number {
  return Number(seed.match(/(\d+)$/)?.[1] ?? "0");
}

export function generateCp004StateV2(authorityKey: string, seed: string): TsdCp004GeneratedState {
  const base = generateCp004State(authorityKey, seed);
  const index = ordinal(seed);
  const directionCase = index % 2 === 0 ? "OPPOSITE" as const : "SAME" as const;
  let input = base.input;

  if (input.speedA && input.speedB && equals(input.speedA, input.speedB)) {
    input = Object.freeze({ ...input, speedA: add(input.speedA, rational(6)) });
  }

  if ((base.solveMode === "findRelativeSpeedOppositeDirections" || base.solveMode === "findRelativeSpeedSameDirection") && input.speedB) {
    input = Object.freeze({ ...input, speedA: multiply(input.speedB, rational(2)) });
  }

  if (base.solveMode === "findRelativeSpeedFromMeetingTime") {
    const knownSpeeds = [24, 30, 36, 40, 45, 48] as const;
    input = Object.freeze({ ...input, speedB: rational(knownSpeeds[index % knownSpeeds.length]), directionCase });
  }

  if (authorityKey === "requiredSpeedForTargetMeeting" && input.initialSeparation && input.targetTime) {
    const requiredRelative = divide(input.initialSeparation, input.targetTime);
    input = Object.freeze({ ...input, speedB: divide(requiredRelative, rational(3)) });
  }

  return Object.freeze({ ...base, representation: `${base.solveMode}:${index % 6}`, input });
}
