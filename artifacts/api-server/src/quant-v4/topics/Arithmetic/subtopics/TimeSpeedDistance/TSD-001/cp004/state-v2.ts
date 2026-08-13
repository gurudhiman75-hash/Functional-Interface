import { rational } from "../foundation/rational";
import { generateCp004State } from "./generator";
import type { TsdCp004GeneratedState } from "./runtime-types";

function ordinal(seed: string): number {
  return Number(seed.match(/(\d+)$/)?.[1] ?? "0");
}

export function generateCp004StateV2(authorityKey: string, seed: string): TsdCp004GeneratedState {
  const base = generateCp004State(authorityKey, seed);
  const index = ordinal(seed);
  const directionCase = index % 2 === 0 ? "OPPOSITE" as const : "SAME" as const;

  if (base.solveMode === "findRelativeSpeedFromMeetingTime") {
    const knownSpeeds = [24, 30, 36, 40, 45, 48] as const;
    return Object.freeze({
      ...base,
      representation: `${base.solveMode}:${index % 6}`,
      input: Object.freeze({
        ...base.input,
        speedB: rational(knownSpeeds[index % knownSpeeds.length]),
        directionCase,
      }),
    });
  }

  return Object.freeze({
    ...base,
    representation: `${base.solveMode}:${index % 6}`,
  });
}
