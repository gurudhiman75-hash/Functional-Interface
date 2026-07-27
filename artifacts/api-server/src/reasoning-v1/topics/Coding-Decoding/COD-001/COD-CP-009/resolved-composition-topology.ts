import { SeededRandom } from "../foundation/prng";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { possibleTokenSetsForWords } from "./solution-space";
import { derivePuzzleFromHiddenMapping, sentenceCodeTopologyFingerprint } from "./topology";
import type { AbstractSentenceCodePuzzle } from "./types";

export interface GeneratedResolvedCompositionTopology {
  kind: "RESOLVED_COMPONENT_COMPOSITION";
  seed: number;
  puzzle: AbstractSentenceCodePuzzle;
  hiddenMapping: Readonly<Record<string, string>>;
  roleWordIds: Readonly<Record<string, string>>;
  roleTokens: Readonly<Record<string, string>>;
  targetWordIds: readonly [string, string];
  targetTokens: readonly [string, string];
  topologyFingerprint: string;
}

const ROLES = [
  "COMPONENT_A",
  "A_ROW_1_ONLY",
  "A_ROW_2_ONLY",
  "COMPONENT_B",
  "B_ROW_3_ONLY",
  "B_ROW_4_ONLY",
] as const;

const INTERNAL_TOKEN_POOL = ["ka", "mi", "zo", "tu", "la", "pe", "ri", "sa"] as const;

export function generateResolvedCompositionTopology(seed: number): GeneratedResolvedCompositionTopology {
  const random = new SeededRandom(`cod-cp009-resolved-composition:${seed}:v1`);
  const shuffledWordIds = random.shuffle(ROLES.map((_, index) => `w${index + 1}`));
  const shuffledTokens = random.shuffle(INTERNAL_TOKEN_POOL).slice(0, ROLES.length);
  const roleWordIds: Record<string, string> = {};
  const roleTokens: Record<string, string> = {};
  const hiddenMapping: Record<string, string> = {};

  ROLES.forEach((role, index) => {
    const wordId = shuffledWordIds[index]!;
    const token = shuffledTokens[index]!;
    roleWordIds[role] = wordId;
    roleTokens[role] = token;
    hiddenMapping[wordId] = token;
  });

  const rowRoles = [
    ["COMPONENT_A", "A_ROW_1_ONLY"],
    ["COMPONENT_A", "A_ROW_2_ONLY"],
    ["B_ROW_3_ONLY", "COMPONENT_B"],
    ["B_ROW_4_ONLY", "COMPONENT_B"],
  ] as const;
  const rowInputs = rowRoles.map((roles, index) => {
    const wordIds = roles.map((role) => roleWordIds[role]!);
    return {
      rowId: `r${index + 1}`,
      wordIds: random.shuffle(wordIds),
      displayedTokenOrder: random.shuffle(wordIds.map((wordId) => hiddenMapping[wordId]!)),
    };
  });

  const puzzle = derivePuzzleFromHiddenMapping(random.shuffle(rowInputs), hiddenMapping);
  const targetWordIds: [string, string] = [roleWordIds.COMPONENT_A!, roleWordIds.COMPONENT_B!];
  const targetTokens: [string, string] = [roleTokens.COMPONENT_A!, roleTokens.COMPONENT_B!];
  const space = solveSentenceCodeConstraints(puzzle);
  if (space.solutionCount !== 1) throw new Error(`Resolved composition ${seed} expected one mapping`);
  const possibleSets = possibleTokenSetsForWords(space, targetWordIds);
  if (possibleSets.length !== 1) throw new Error(`Resolved composition ${seed} target set is not invariant`);
  if (puzzle.rows.some((row) => targetWordIds.every((wordId) => row.wordIds.includes(wordId)))) {
    throw new Error(`Resolved composition ${seed} accidentally displays the queried pair`);
  }

  return {
    kind: "RESOLVED_COMPONENT_COMPOSITION",
    seed,
    puzzle,
    hiddenMapping,
    roleWordIds,
    roleTokens,
    targetWordIds,
    targetTokens,
    topologyFingerprint: sentenceCodeTopologyFingerprint(puzzle),
  };
}
