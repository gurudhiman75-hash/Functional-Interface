import { divide, multiply, rational } from "../foundation/rational";
import type { TsdCp003DiscoveryAuthority } from "./discovery-registry";
import { hashSeed } from "./generation-support";
import { generateCp003State } from "./parameter-factory";
import type { TsdCp003GeneratedState } from "./runtime-types";

export function generateSaturatedCp003State(authority: TsdCp003DiscoveryAuthority, seed: string): TsdCp003GeneratedState {
  const base = generateCp003State(authority, seed);
  const branch = hashSeed(`${authority.provisionalId}:${seed}:saturation`) % 2;

  if (base.input.solveMode === "timeGainLossFromSpeedChange" && branch === 1) {
    return Object.freeze({
      ...base,
      input: Object.freeze({
        ...base.input,
        originalSpeed: base.input.changedSpeed,
        changedSpeed: base.input.originalSpeed,
      }),
      representation: "SLOWER_DELAY",
    });
  }

  if (base.input.solveMode === "requiredRemainingSpeedAfterPartialRoute" && branch === 1) {
    const plannedAverage = divide(base.input.totalDistance, base.input.scheduledTotalTime);
    const fastInitialSpeed = multiply(plannedAverage, rational(4, 3));
    return Object.freeze({
      ...base,
      input: Object.freeze({ ...base.input, completedSpeed: fastInitialSpeed }),
      representation: "FAST_INITIAL_SEGMENT",
    });
  }

  return base;
}
