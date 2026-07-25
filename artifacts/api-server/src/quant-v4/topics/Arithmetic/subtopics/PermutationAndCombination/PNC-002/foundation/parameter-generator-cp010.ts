import { createSeededRandom, factorialExact, pickSeeded, productExact } from "./math";
import { getPnc002VariableRanges } from "./library";
import type { Pnc002GeneratedValue, Pnc002QuestionEntry } from "./types";

function copyState<T extends Record<string, number>>(state: T): T { return { ...state }; }
function roundTableCount(totalObjects: number): number { return factorialExact(totalObjects - 1); }
function circularPairTogetherCount(totalObjects: number): number {
  return productExact([2, factorialExact(totalObjects - 2)]);
}

export function buildPnc002Cp010Values(
  entry: Pnc002QuestionEntry,
  seed: string,
): Record<string, Pnc002GeneratedValue> {
  if (entry.cpId !== "PNC-CP-010") throw new Error(`CP-010 parameter generator received ${entry.cpId}`);
  const pools = getPnc002VariableRanges().pools;
  const random = createSeededRandom(`${seed}:${entry.qlId}:cp010-parameters`);

  switch (entry.qlId) {
    case "PNC-QL-177":
    case "PNC-QL-178":
      return { totalObjects: pickSeeded(pools.roundTableTotals, random) };
    case "PNC-QL-179":
      return { ...copyState(pickSeeded(pools.blockStates.filter((state: { totalObjects: number; blockSize: number }) => state.blockSize === 2), random)) };
    case "PNC-QL-180":
      return { ...copyState(pickSeeded(pools.blockStates.filter((state: { totalObjects: number; blockSize: number }) => state.blockSize === 2), random)) };
    case "PNC-QL-181":
      return copyState(pickSeeded(pools.blockStates.filter((state: { totalObjects: number; blockSize: number }) => state.blockSize >= 3), random));
    case "PNC-QL-182": {
      const totalObjects = pickSeeded(pools.twoPairTotals, random);
      return { totalObjects, firstBlockSize: 2, secondBlockSize: 2, blockSizes: [2, 2] };
    }
    case "PNC-QL-183": {
      const state = copyState(pickSeeded(pools.pairGroupStates, random));
      return { ...state, blockSizes: [state.firstBlockSize, state.secondBlockSize] };
    }
    case "PNC-QL-184":
    case "PNC-QL-185":
    case "PNC-QL-186":
    case "PNC-QL-187":
      return { totalObjects: pickSeeded(pools.pairConditionTotals, random), blockSizes: [2, 2] };
    case "PNC-QL-188":
    case "PNC-QL-190":
      return { totalObjects: pickSeeded(pools.neighborTotals, random) };
    case "PNC-QL-189":
      return { totalObjects: pickSeeded(pools.oppositeTotals, random) };
    case "PNC-QL-191":
      return copyState(pickSeeded(pools.exactClockwiseGapStates, random));
    case "PNC-QL-192":
      return copyState(pickSeeded(pools.minimumClockwiseGapStates, random));
    case "PNC-QL-193":
      return copyState(pickSeeded(pools.maximumClockwiseGapStates, random));
    case "PNC-QL-194":
      return copyState(pickSeeded(pools.clockwiseOrderStates.filter((state: { totalObjects: number; orderLength: number }) => state.orderLength === 3), random));
    case "PNC-QL-195":
      return copyState(pickSeeded(pools.clockwiseOrderStates.filter((state: { totalObjects: number; orderLength: number }) => state.orderLength === 4), random));
    case "PNC-QL-196": {
      const categorySize = pickSeeded(pools.alternationCategorySizes, random);
      return { categorySize, totalObjects: 2 * categorySize, largeCount: categorySize, smallCount: categorySize };
    }
    case "PNC-QL-197": {
      const state = copyState(pickSeeded(pools.categoryNonAdjacentStates, random));
      return { ...state, totalObjects: state.largeCount + state.smallCount };
    }
    case "PNC-QL-198": {
      const state = copyState(pickSeeded(pools.specifiedNonAdjacentStates, random));
      return { ...state, smallCount: state.specifiedCount, largeCount: state.totalObjects - state.specifiedCount };
    }
    case "PNC-QL-199": {
      const totalObjects = pickSeeded(pools.inverseCircularValues, random);
      return {
        totalObjects,
        target: roundTableCount(totalObjects),
        searchMinimum: Math.min(...pools.inverseCircularValues),
        searchMaximum: Math.max(...pools.inverseCircularValues),
      };
    }
    case "PNC-QL-200": {
      const totalObjects = pickSeeded(pools.inverseCircularPairValues, random);
      return {
        totalObjects,
        blockSize: 2,
        target: circularPairTogetherCount(totalObjects),
        searchMinimum: Math.min(...pools.inverseCircularPairValues),
        searchMaximum: Math.max(...pools.inverseCircularPairValues),
      };
    }
    case "PNC-QL-201":
    case "PNC-QL-202":
    case "PNC-QL-203":
      return { totalObjects: pickSeeded(pools.ornamentTotals, random), blockSize: entry.qlId === "PNC-QL-203" ? 2 : 0 };
    default:
      throw new Error(`Unsupported PNC-002 CP-010 QL: ${entry.qlId}`);
  }
}
