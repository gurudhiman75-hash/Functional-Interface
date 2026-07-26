import { SeededRandom } from "../foundation/prng";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { queryDomain } from "./solution-space";
import { derivePuzzleFromHiddenMapping, sentenceCodeTopologyFingerprint } from "./topology";
import type { AbstractSentenceCodePuzzle, AbstractSentenceCodeQuery } from "./types";

export type SentenceCodeTopologyKind =
  | "DIRECT_SINGLE_INTERSECTION"
  | "CHAINED_SINGLETON_PROPAGATION"
  | "SET_DIFFERENCE_ELIMINATION"
  | "FORKED_EVIDENCE_JOIN"
  | "GLOBAL_BIJECTION_DEDUCTION"
  | "CONTROLLED_PARTIAL_INFORMATION"
  | "PHRASE_SET_COMPOSITION"
  | "MISSING_MEMBER_COMPLETION";

interface RolePattern {
  role: string;
  mask: number;
}

interface TopologyPattern {
  kind: SentenceCodeTopologyKind;
  rowCount: number;
  roles: readonly RolePattern[];
  targetRole: string;
  phraseRoles?: readonly string[];
  missing?: {
    rowId: string;
    missingRole: string;
  };
  expectedSolutionCount: number;
  expectedQueryDomainSize: number;
  requireAllRowsForQuery: boolean;
}

export interface GeneratedMissingMemberPresentation {
  rowId: string;
  wordIds: readonly string[];
  knownTokens: readonly string[];
  missingWordId: string;
  expectedMissingToken: string;
}

export interface GeneratedSentenceCodeTopology {
  kind: SentenceCodeTopologyKind;
  seed: number;
  puzzle: AbstractSentenceCodePuzzle;
  hiddenMapping: Readonly<Record<string, string>>;
  query: AbstractSentenceCodeQuery;
  targetWordId: string;
  targetToken: string;
  phraseWordIds?: readonly string[];
  phraseTokens?: readonly string[];
  missingPresentation?: GeneratedMissingMemberPresentation;
  roleWordIds: Readonly<Record<string, string>>;
  roleTokens: Readonly<Record<string, string>>;
  expectedSolutionCount: number;
  expectedQueryDomainSize: number;
  requireAllRowsForQuery: boolean;
  topologyFingerprint: string;
}

const PATTERNS: Readonly<Record<SentenceCodeTopologyKind, TopologyPattern>> = {
  DIRECT_SINGLE_INTERSECTION: {
    kind: "DIRECT_SINGLE_INTERSECTION",
    rowCount: 2,
    roles: [
      { role: "TARGET", mask: 0b11 },
      { role: "LEFT_ONLY", mask: 0b01 },
      { role: "RIGHT_ONLY", mask: 0b10 },
    ],
    targetRole: "TARGET",
    expectedSolutionCount: 1,
    expectedQueryDomainSize: 1,
    requireAllRowsForQuery: true,
  },
  CHAINED_SINGLETON_PROPAGATION: {
    kind: "CHAINED_SINGLETON_PROPAGATION",
    rowCount: 3,
    roles: [
      { role: "TARGET", mask: 0b011 },
      { role: "HELPER", mask: 0b111 },
      { role: "ROW_1_ONLY", mask: 0b001 },
      { role: "ROW_2_ONLY", mask: 0b010 },
      { role: "ROW_3_ONLY", mask: 0b100 },
    ],
    targetRole: "TARGET",
    expectedSolutionCount: 1,
    expectedQueryDomainSize: 1,
    requireAllRowsForQuery: true,
  },
  SET_DIFFERENCE_ELIMINATION: {
    kind: "SET_DIFFERENCE_ELIMINATION",
    rowCount: 3,
    roles: [
      { role: "TARGET", mask: 0b011 },
      { role: "SHARED_A", mask: 0b111 },
      { role: "SHARED_B", mask: 0b111 },
      { role: "ROW_1_ONLY", mask: 0b001 },
      { role: "ROW_2_ONLY", mask: 0b010 },
      { role: "ROW_3_ONLY", mask: 0b100 },
    ],
    targetRole: "TARGET",
    expectedSolutionCount: 2,
    expectedQueryDomainSize: 1,
    requireAllRowsForQuery: true,
  },
  FORKED_EVIDENCE_JOIN: {
    kind: "FORKED_EVIDENCE_JOIN",
    rowCount: 4,
    roles: [
      { role: "TARGET", mask: 0b1111 },
      { role: "MISSING_ROW_1", mask: 0b1110 },
      { role: "MISSING_ROW_2", mask: 0b1101 },
      { role: "MISSING_ROW_3", mask: 0b1011 },
      { role: "MISSING_ROW_4", mask: 0b0111 },
    ],
    targetRole: "TARGET",
    expectedSolutionCount: 1,
    expectedQueryDomainSize: 1,
    requireAllRowsForQuery: true,
  },
  GLOBAL_BIJECTION_DEDUCTION: {
    kind: "GLOBAL_BIJECTION_DEDUCTION",
    rowCount: 3,
    roles: [
      { role: "TARGET", mask: 0b111 },
      { role: "MISSING_ROW_1", mask: 0b110 },
      { role: "MISSING_ROW_2", mask: 0b101 },
      { role: "MISSING_ROW_3", mask: 0b011 },
    ],
    targetRole: "TARGET",
    expectedSolutionCount: 1,
    expectedQueryDomainSize: 1,
    requireAllRowsForQuery: true,
  },
  CONTROLLED_PARTIAL_INFORMATION: {
    kind: "CONTROLLED_PARTIAL_INFORMATION",
    rowCount: 3,
    roles: [
      { role: "TARGET", mask: 0b111 },
      { role: "TARGET_PARTNER", mask: 0b111 },
      { role: "MISSING_ROW_1", mask: 0b110 },
      { role: "MISSING_ROW_2", mask: 0b101 },
      { role: "MISSING_ROW_3", mask: 0b011 },
    ],
    targetRole: "TARGET",
    expectedSolutionCount: 2,
    expectedQueryDomainSize: 2,
    requireAllRowsForQuery: true,
  },
  PHRASE_SET_COMPOSITION: {
    kind: "PHRASE_SET_COMPOSITION",
    rowCount: 3,
    roles: [
      { role: "PHRASE_A", mask: 0b111 },
      { role: "PHRASE_B", mask: 0b111 },
      { role: "MISSING_ROW_1", mask: 0b110 },
      { role: "MISSING_ROW_2", mask: 0b101 },
      { role: "MISSING_ROW_3", mask: 0b011 },
    ],
    targetRole: "PHRASE_A",
    phraseRoles: ["PHRASE_A", "PHRASE_B"],
    expectedSolutionCount: 2,
    expectedQueryDomainSize: 1,
    requireAllRowsForQuery: true,
  },
  MISSING_MEMBER_COMPLETION: {
    kind: "MISSING_MEMBER_COMPLETION",
    rowCount: 3,
    roles: [
      { role: "TARGET", mask: 0b011 },
      { role: "HELPER", mask: 0b111 },
      { role: "ROW_1_ONLY", mask: 0b001 },
      { role: "ROW_2_ONLY", mask: 0b010 },
      { role: "ROW_3_ONLY", mask: 0b100 },
    ],
    targetRole: "HELPER",
    missing: { rowId: "r1", missingRole: "HELPER" },
    expectedSolutionCount: 1,
    expectedQueryDomainSize: 1,
    requireAllRowsForQuery: false,
  },
};

const TOKEN_POOL = ["ka", "mi", "zo", "tu", "la", "pe", "ri", "no", "sa", "ve", "du", "fi"] as const;

function roleWordMap(pattern: TopologyPattern, random: SeededRandom): Record<string, string> {
  const labels = random.shuffle(pattern.roles.map((_, index) => `w${index + 1}`));
  const output: Record<string, string> = {};
  pattern.roles.forEach((entry, index) => { output[entry.role] = labels[index]!; });
  return output;
}

export function generateAbstractSentenceCodeTopology(
  kind: SentenceCodeTopologyKind,
  seed: number,
): GeneratedSentenceCodeTopology {
  const pattern = PATTERNS[kind];
  const random = new SeededRandom(`cod-cp009-topology:${kind}:${seed}:v1`);
  const roleWordIds = roleWordMap(pattern, random);
  const roleTokens: Record<string, string> = {};
  const hiddenMapping: Record<string, string> = {};
  const tokens = random.shuffle(TOKEN_POOL).slice(0, pattern.roles.length);

  pattern.roles.forEach((entry, index) => {
    const wordId = roleWordIds[entry.role]!;
    const token = tokens[index]!;
    roleTokens[entry.role] = token;
    hiddenMapping[wordId] = token;
  });

  const rowInputs = Array.from({ length: pattern.rowCount }, (_, rowIndex) => {
    const wordIds = pattern.roles
      .filter((entry) => (entry.mask & (1 << rowIndex)) !== 0)
      .map((entry) => roleWordIds[entry.role]!);
    const mappedTokens = wordIds.map((wordId) => hiddenMapping[wordId]!);
    return {
      rowId: `r${rowIndex + 1}`,
      wordIds: random.shuffle(wordIds),
      displayedTokenOrder: random.shuffle(mappedTokens),
    };
  });

  const puzzle = derivePuzzleFromHiddenMapping(random.shuffle(rowInputs), hiddenMapping);
  const targetWordId = roleWordIds[pattern.targetRole]!;
  const targetToken = roleTokens[pattern.targetRole]!;
  const phraseWordIds = pattern.phraseRoles?.map((role) => roleWordIds[role]!);
  const phraseTokens = pattern.phraseRoles?.map((role) => roleTokens[role]!);
  const query: AbstractSentenceCodeQuery = phraseWordIds
    ? { kind: "WORDS_TO_TOKEN_SET", wordIds: phraseWordIds }
    : { kind: "WORD_TO_TOKEN", wordId: targetWordId };

  let missingPresentation: GeneratedMissingMemberPresentation | undefined;
  if (pattern.missing) {
    const row = puzzle.rows.find((candidate) => candidate.rowId === pattern.missing!.rowId)!;
    const missingWordId = roleWordIds[pattern.missing.missingRole]!;
    const expectedMissingToken = hiddenMapping[missingWordId]!;
    missingPresentation = {
      rowId: row.rowId,
      wordIds: [...row.wordIds],
      knownTokens: row.codeTokens.filter((token) => token !== expectedMissingToken),
      missingWordId,
      expectedMissingToken,
    };
  }

  const space = solveSentenceCodeConstraints(puzzle);
  const domain = queryDomain(space, query);
  if (space.solutionCount !== pattern.expectedSolutionCount) {
    throw new Error(`${kind}/${seed} expected ${pattern.expectedSolutionCount} solutions but received ${space.solutionCount}`);
  }
  if (domain.length !== pattern.expectedQueryDomainSize) {
    throw new Error(`${kind}/${seed} expected query-domain size ${pattern.expectedQueryDomainSize} but received ${domain.length}`);
  }

  return {
    kind,
    seed,
    puzzle,
    hiddenMapping,
    query,
    targetWordId,
    targetToken,
    phraseWordIds,
    phraseTokens,
    missingPresentation,
    roleWordIds,
    roleTokens,
    expectedSolutionCount: pattern.expectedSolutionCount,
    expectedQueryDomainSize: pattern.expectedQueryDomainSize,
    requireAllRowsForQuery: pattern.requireAllRowsForQuery,
    topologyFingerprint: sentenceCodeTopologyFingerprint(puzzle),
  };
}

export const SENTENCE_CODE_TOPOLOGY_KINDS = Object.keys(PATTERNS) as SentenceCodeTopologyKind[];
