import type { Caselet } from "./index.ts";
import type { Lp002Caselet } from "./lp-002.ts";
import type { Lp003Caselet } from "./lp-003.ts";
import type { Lp004Caselet } from "./lp-004.ts";
import type { Lp005Caselet } from "./lp-005.ts";
import type { Lp006Caselet } from "./lp-006.ts";
import type { Lp007Caselet } from "./lp-007.ts";
import type { Lp008Caselet } from "./lp-008.ts";
import {
  generateLp001BatchStabilizedV3,
  generateLp002BatchStabilizedV3,
  generateLp003BatchStabilizedV3,
  generateLp004BatchStabilizedV3,
  generateLp005BatchStabilizedV3,
  generateLp006BatchStabilizedV3,
  generateLp007BatchStabilizedV3,
  generateLp008BatchStabilizedV3,
} from "./lp-001-008-stabilized-english-v3.ts";

export const LP_001_008_STABILIZED_ENGLISH_V3_1 = Object.freeze({
  authorityId: "LP_001_008_STABILIZED_ENGLISH_V3_1" as const,
  parentAuthority: "LP_001_008_STABILIZED_ENGLISH_V3" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  change: "SIMPLER_EXPLANATION_WORDING_AND_CASE_GRAMMAR" as const,
  changesPuzzleSemantics: false as const,
  changesOptions: false as const,
});

type ExplanationCaselet = {
  children: readonly {
    explanation: { summary: string; lines: string[] };
    [key: string]: unknown;
  }[];
  [key: string]: unknown;
};

function polishLine(line: string, packageId: string): string {
  let result = line
    .replaceAll("Combining this with the earlier clues, we can now fix ", "Using this clue with the earlier clues, we get: ")
    .replaceAll("This clue does not fix a complete entry by itself. Keep it with the earlier clues.", "This clue alone does not fix an entry. Keep it for the next step.")
    .replaceAll("Two cases are worth checking for ", "Now check two cases for ")
    .replaceAll("Now test the two cases with this clue. Case 2 does not satisfy it, so Case 2 is rejected. Case 1 remains, and the rest of the arrangement is fixed.", "Check both cases with this clue. Case 2 breaks the clue, so reject it. Keep Case 1. The remaining entries are then fixed.");

  if (packageId === "LP-003") {
    result = result
      .replace(/(\*\*Case 1:\*\* )(.+?) is at position (\d+) from the bottom\./u, "$1$2 → position $3 from the bottom.")
      .replace(/(\*\*Case 2:\*\* )(.+?) is at position (\d+) from the bottom\./u, "$1$2 → position $3 from the bottom.");
  }
  return result;
}

function polish<T extends ExplanationCaselet>(caselet: T, packageId: string): T {
  return {
    ...caselet,
    children: caselet.children.map((child) => ({
      ...child,
      explanation: {
        ...child.explanation,
        lines: child.explanation.lines.map((line) => polishLine(line, packageId)),
      },
    })),
  } as T;
}

export function generateLp001BatchStabilizedV3_1(seed = "lp-001-stabilized-v3-1", count = 8): Caselet[] { return generateLp001BatchStabilizedV3(seed, count).map((caselet) => polish(caselet, "LP-001")); }
export function generateLp002BatchStabilizedV3_1(seed = "lp-002-stabilized-v3-1", count = 8): Lp002Caselet[] { return generateLp002BatchStabilizedV3(seed, count).map((caselet) => polish(caselet, "LP-002")); }
export function generateLp003BatchStabilizedV3_1(seed = "lp-003-stabilized-v3-1", count = 8): Lp003Caselet[] { return generateLp003BatchStabilizedV3(seed, count).map((caselet) => polish(caselet, "LP-003")); }
export function generateLp004BatchStabilizedV3_1(seed = "lp-004-stabilized-v3-1", count = 8): Lp004Caselet[] { return generateLp004BatchStabilizedV3(seed, count).map((caselet) => polish(caselet, "LP-004")); }
export function generateLp005BatchStabilizedV3_1(seed = "lp-005-stabilized-v3-1", count = 8): Lp005Caselet[] { return generateLp005BatchStabilizedV3(seed, count).map((caselet) => polish(caselet, "LP-005")); }
export function generateLp006BatchStabilizedV3_1(seed = "lp-006-stabilized-v3-1", count = 8): Lp006Caselet[] { return generateLp006BatchStabilizedV3(seed, count).map((caselet) => polish(caselet, "LP-006")); }
export function generateLp007BatchStabilizedV3_1(seed = "lp-007-stabilized-v3-1", count = 8): Lp007Caselet[] { return generateLp007BatchStabilizedV3(seed, count).map((caselet) => polish(caselet, "LP-007")); }
export function generateLp008BatchStabilizedV3_1(seed = "lp-008-stabilized-v3-1", count = 8): Lp008Caselet[] { return generateLp008BatchStabilizedV3(seed, count).map((caselet) => polish(caselet, "LP-008")); }
