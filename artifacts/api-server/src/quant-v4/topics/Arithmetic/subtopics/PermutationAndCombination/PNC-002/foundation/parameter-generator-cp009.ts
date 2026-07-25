import { combinationExact, createSeededRandom, pickSeeded } from "./math";
import { getPnc002VariableRanges } from "./library";
import type { Pnc002GeneratedValue, Pnc002QuestionEntry } from "./types";

function copyState<T extends Record<string, number>>(state: T): T { return { ...state }; }

export function buildPnc002Cp009Values(
  entry: Pnc002QuestionEntry,
  seed: string,
): Record<string, Pnc002GeneratedValue> {
  if (entry.cpId !== "PNC-CP-009") throw new Error(`CP-009 parameter generator received ${entry.cpId}`);
  const pools = getPnc002VariableRanges().pools;
  const random = createSeededRandom(`${seed}:${entry.qlId}:cp009-parameters`);

  switch (entry.qlId) {
    case "PNC-QL-148": return copyState(pickSeeded(pools.compulsoryOneStates, random));
    case "PNC-QL-149": return copyState(pickSeeded(pools.compulsoryTwoStates, random));
    case "PNC-QL-150": return copyState(pickSeeded(pools.excludedOneStates, random));
    case "PNC-QL-151": return copyState(pickSeeded(pools.excludedTwoStates, random));
    case "PNC-QL-152": return copyState(pickSeeded(pools.compulsoryExcludedStates, random));
    case "PNC-QL-153": {
      const state = copyState(pickSeeded(pools.exactTwoCategoryStates, random));
      return { ...state, totalObjects: state.categoryA + state.categoryB, requiredFromB: state.committeeSize - state.requiredFromA };
    }
    case "PNC-QL-154": {
      const state = copyState(pickSeeded(pools.equalTwoCategoryStates, random));
      return { ...state, totalObjects: state.categoryA + state.categoryB, requiredFromB: state.requiredFromA };
    }
    case "PNC-QL-155": {
      const state = copyState(pickSeeded(pools.majorityCategoryStates, random));
      return { ...state, totalObjects: state.categoryA + state.categoryB };
    }
    case "PNC-QL-156": {
      const state = copyState(pickSeeded(pools.atLeastCategoryStates, random));
      return { ...state, totalObjects: state.categoryA + state.categoryB };
    }
    case "PNC-QL-157": {
      const state = copyState(pickSeeded(pools.atMostCategoryStates, random));
      return { ...state, totalObjects: state.categoryA + state.categoryB };
    }
    case "PNC-QL-158":
    case "PNC-QL-159": {
      const pool = entry.qlId === "PNC-QL-158" ? pools.atLeastOneCategoryStates : pools.atLeastOneEachTwoStates;
      const state = copyState(pickSeeded(pool, random));
      return { ...state, totalObjects: state.categoryA + state.categoryB };
    }
    case "PNC-QL-160": {
      const state = copyState(pickSeeded(pools.exactThreeCategoryStates, random));
      return {
        ...state,
        totalObjects: state.categoryA + state.categoryB + state.categoryC,
        committeeSize: state.requiredA + state.requiredB + state.requiredC,
      };
    }
    case "PNC-QL-161": {
      const state = copyState(pickSeeded(pools.atLeastOneEachThreeStates, random));
      return { ...state, totalObjects: state.categoryA + state.categoryB + state.categoryC };
    }
    case "PNC-QL-162": {
      const state = copyState(pickSeeded(pools.specifiedPairStates, random));
      return { ...state, requiredSpecified: 1 };
    }
    case "PNC-QL-163":
    case "PNC-QL-164":
    case "PNC-QL-165":
      return copyState(pickSeeded(pools.specifiedPairStates, random));
    case "PNC-QL-166":
      return { ...copyState(pickSeeded(pools.memberImplicationStates, random)), specifiedCount: 2 };
    case "PNC-QL-167":
      return copyState(pickSeeded(pools.atMostSpecifiedStates, random));
    case "PNC-QL-168":
      return copyState(pickSeeded(pools.exactSpecifiedStates, random));
    case "PNC-QL-169": {
      const state = copyState(pickSeeded(pools.namedCompulsoryQuotaStates, random));
      return {
        ...state,
        totalObjects: state.categoryA + state.categoryB,
        requiredFromB: state.committeeSize - state.requiredFromA,
        remainingCategoryASelection: state.requiredFromA - 1,
      };
    }
    case "PNC-QL-170": {
      const state = copyState(pickSeeded(pools.namedExcludedQuotaStates, random));
      return {
        ...state,
        totalObjects: state.categoryA + state.categoryB,
        requiredFromB: state.committeeSize - state.requiredFromA,
      };
    }
    case "PNC-QL-171": {
      const totalObjects = pickSeeded(pools.inverseTotalObjectValues, random);
      const committeeSize = 4;
      return {
        totalObjects,
        committeeSize,
        compulsoryCount: 1,
        target: combinationExact(totalObjects - 1, committeeSize - 1),
        searchMinimum: Math.min(...pools.inverseTotalObjectValues),
        searchMaximum: Math.max(...pools.inverseTotalObjectValues),
      };
    }
    case "PNC-QL-172": {
      const categoryA = pickSeeded(pools.inverseCategoryAValues, random);
      const categoryB = 6;
      const committeeSize = 4;
      const requiredFromA = 2;
      return {
        categoryA,
        categoryB,
        totalObjects: categoryA + categoryB,
        committeeSize,
        requiredFromA,
        requiredFromB: committeeSize - requiredFromA,
        target: combinationExact(categoryA, requiredFromA) * combinationExact(categoryB, committeeSize - requiredFromA),
        searchMinimum: Math.min(...pools.inverseCategoryAValues),
        searchMaximum: Math.max(...pools.inverseCategoryAValues),
      };
    }
    default:
      throw new Error(`Unsupported PNC-002 CP-009 QL: ${entry.qlId}`);
  }
}
