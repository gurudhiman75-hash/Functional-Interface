import { createSeededRandom, pickSeeded } from "./math";
import { getPnc002VariableRanges } from "./library";
import type { Pnc002GeneratedValue, Pnc002QuestionEntry } from "./types";

function factorial(argument: number): number {
  let result = 1;
  for (let factor = 2; factor <= argument; factor += 1) result *= factor;
  return result;
}
function exactGapCount(totalObjects: number, gapCount: number): number {
  return 2 * (totalObjects - gapCount - 1) * factorial(totalObjects - 2);
}
function copyState<T extends Record<string, number>>(state: T): T { return { ...state }; }

export function buildPnc002Cp008Values(
  entry: Pnc002QuestionEntry,
  seed: string,
): Record<string, Pnc002GeneratedValue> {
  if (entry.cpId !== "PNC-CP-008") throw new Error(`CP-008 parameter generator received ${entry.cpId}`);
  const pools = getPnc002VariableRanges().pools;
  const random = createSeededRandom(`${seed}:${entry.qlId}:cp008-parameters`);

  switch (entry.scenarioFamily) {
    case "personAtExactPosition":
      return copyState(pickSeeded(pools.exactPositionStates, random));
    case "personAtEitherEnd":
    case "twoPeopleAtBothEnds":
    case "personExcludedFromEnds":
      return { totalObjects: pickSeeded(pools.positionTotalObjects, random) };
    case "prescribedRelativeOrderPair":
      return { totalObjects: pickSeeded(pools.relativeOrderTotalObjects, random), chainLength: 2 };
    case "prescribedRelativeOrderTrio":
      return { totalObjects: pickSeeded(pools.relativeOrderTotalObjects, random), chainLength: 3 };
    case "prescribedRelativeOrderFour":
      return { totalObjects: pickSeeded(pools.relativeOrderTotalObjects, random), chainLength: 4 };
    case "twoIndependentOrderPairs":
      return { totalObjects: pickSeeded(pools.relativeOrderTotalObjects, random), chainLengths: [2, 2] };
    case "equalCategoriesAlternate": {
      const categoryCount = pickSeeded(pools.equalAlternationCategoryCount, random);
      return { totalObjects: 2 * categoryCount, categoryCount, largeCount: categoryCount, smallCount: categoryCount, orientationCount: 2 };
    }
    case "oneExtraCategoryAlternates": {
      const state = copyState(pickSeeded(pools.unequalAlternationStates, random));
      return { ...state, totalObjects: state.largeCount + state.smallCount, orientationCount: 1 };
    }
    case "equalCategoriesAlternateFixedStart": {
      const categoryCount = pickSeeded(pools.equalAlternationCategoryCount, random);
      return { totalObjects: 2 * categoryCount, categoryCount, largeCount: categoryCount, smallCount: categoryCount, orientationCount: 1 };
    }
    case "menWomenNoAdjacency": {
      const state = copyState(pickSeeded(pools.noAdjacencyCategoryStates, random));
      return { ...state, totalObjects: state.largeCount + state.smallCount };
    }
    case "specifiedPeopleNoAdjacency": {
      const state = copyState(pickSeeded(pools.noAdjacencySpecifiedStates, random));
      return { ...state, largeCount: state.totalObjects - state.specifiedCount, smallCount: state.specifiedCount };
    }
    case "exactGapBetweenPair":
      return copyState(pickSeeded(pools.exactGapStates, random));
    case "atLeastGapBetweenPair":
      return copyState(pickSeeded(pools.atLeastGapStates, random));
    case "allSpecifiedInEvenPositions": {
      const state = copyState(pickSeeded(pools.allEvenPositionStates, random));
      return {
        ...state,
        requiredInClass: state.specifiedCount,
        eligibleClassPositions: Math.floor(state.totalObjects / 2),
        positionClassParity: 0,
      };
    }
    case "exactSpecifiedInOddPositions": {
      const state = copyState(pickSeeded(pools.exactOddPositionStates, random));
      return {
        ...state,
        eligibleClassPositions: Math.ceil(state.totalObjects / 2),
        positionClassParity: 1,
      };
    }
    case "recoverExactGap": {
      const totalObjects = 8;
      const gapCount = pickSeeded(pools.inverseGapValues, random);
      return {
        totalObjects,
        gapCount,
        target: exactGapCount(totalObjects, gapCount),
        searchMinimum: Math.min(...pools.inverseGapValues),
        searchMaximum: Math.max(...pools.inverseGapValues),
      };
    }
  }
  throw new Error(`Unsupported PNC-002 CP-008 scenario family: ${entry.scenarioFamily}`);
}
