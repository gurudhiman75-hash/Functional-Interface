import type { TsdCp001DiscoveryAuthority } from "./discovery-registry";
import type { GeneratedState } from "./runtime-types";
import { SeededRng } from "./runtime-support";
import { clockState, conversionState, directState, mixedUnitState } from "./parameter-core";
import { comparisonState, proportionState, ratioState } from "./parameter-relational";
import { claimState, classificationState, deadlineState, paceState } from "./parameter-advanced";
import { applyProportionRepresentation } from "./proportion-representation";

function generateRawState(authority: TsdCp001DiscoveryAuthority, seed: string): GeneratedState {
  const rng = new SeededRng(`${authority.provisionalId}:${seed}`);
  switch (authority.solveMode) {
    case "distanceFromSpeedAndTime":
    case "speedFromDistanceAndTime":
    case "timeFromDistanceAndSpeed":
      return directState(authority.solveMode, rng);
    case "convertSpeedUnit":
    case "convertDistanceUnit":
    case "convertTimeUnit":
      return conversionState(authority.solveMode, rng);
    case "speedFromMixedUnits":
      return mixedUnitState(rng);
    case "arrivalClockTime":
    case "departureClockTime":
    case "elapsedClockTime":
      return clockState(authority.solveMode, rng);
    case "compareDistancesAtEqualTime":
    case "compareTimesAtEqualDistance":
    case "compareSpeedsAtEqualTime":
      return comparisonState(authority.solveMode, rng);
    case "distanceRatioFromSpeedAndTimeRatios":
    case "speedRatioFromDistanceAndTimeRatios":
    case "timeRatioFromDistanceAndSpeedRatios":
      return ratioState(authority.solveMode, rng);
    case "distanceByProportion":
    case "timeByProportion":
    case "speedByProportion":
      return proportionState(authority.solveMode, rng);
    case "speedFromPace":
    case "paceFromSpeed":
    case "distanceFromPaceAndTime":
      return paceState(authority.solveMode, rng);
    case "requiredUniformSpeedForDeadline":
      return deadlineState(rng);
    case "classifyUniformMotionState":
      return classificationState(rng);
    case "verifyUniformMotionClaim":
      return claimState(rng);
  }
}

export function generateState(authority: TsdCp001DiscoveryAuthority, seed: string): GeneratedState {
  return applyProportionRepresentation(seed, generateRawState(authority, seed));
}
