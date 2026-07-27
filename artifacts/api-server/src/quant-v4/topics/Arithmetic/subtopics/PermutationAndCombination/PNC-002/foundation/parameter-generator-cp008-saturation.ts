import { createSeededRandom, pickSeeded } from "./math";
import { getPnc002VariableRanges } from "./library";
import type {
  Pnc002GeneratedValue,
  Pnc002QuestionEntry,
  Pnc002SolveMode,
} from "./types";

const SATURATION_MODES = new Set<Pnc002SolveMode>([
  "countObjectsAtPrescribedPositions",
  "countSpecifiedSetInPositionSet",
  "countAtMostGapBetweenPair",
  "countDirectionalExactGapBetweenPair",
  "countAtLeastSpecifiedObjectsInPositionClass",
]);

export function isPnc002Cp008SaturationScenario(entry: Pnc002QuestionEntry): boolean {
  return entry.cpId === "PNC-CP-008" && SATURATION_MODES.has(entry.solveMode);
}

function copyState<T extends Record<string, number>>(state: T): T {
  return { ...state };
}

export function buildPnc002Cp008SaturationValues(
  entry: Pnc002QuestionEntry,
  seed: string,
): Record<string, Pnc002GeneratedValue> {
  if (!isPnc002Cp008SaturationScenario(entry)) {
    throw new Error(`CP-008 saturation parameter generator received ${entry.solveMode}`);
  }

  const pools = getPnc002VariableRanges().pools;
  const random = createSeededRandom(`${seed}:${entry.qlId}:cp008-saturation-parameters`);

  switch (entry.scenarioFamily) {
    case "threeObjectsAtPrescribedPositions":
    case "threeObjectsInPositionSet":
      return {
        totalObjects: pickSeeded(pools.multiPositionTotalObjects, random),
        prescribedObjectCount: 3,
      };
    case "atMostGapBetweenPair":
      return copyState(pickSeeded(pools.atMostGapStates, random));
    case "directionalExactGap": {
      const state = copyState(pickSeeded(pools.directionalGapStates, random));
      return { ...state, positionDistance: state.gapCount + 1 };
    }
    case "atLeastSpecifiedInOddPositions": {
      const state = copyState(pickSeeded(pools.atLeastOddPositionStates, random));
      return {
        ...state,
        eligibleClassPositions: Math.ceil(state.totalObjects / 2),
        positionClassParity: 1,
      };
    }
    default:
      throw new Error(`Unsupported CP-008 saturation scenario family: ${entry.scenarioFamily}`);
  }
}
