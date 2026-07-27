import assert from "node:assert/strict";
import { SeededRandom } from "../foundation/prng";
import { canonicalSetKey } from "./canonical-set";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import { verifySentenceCodeConstraintsBruteForce } from "./independent-verifier";
import { analyzeSentenceCodeRowMinimality } from "./row-minimality";
import {
  classifyTokenSetToWordsRelation,
  classifyTokenWordRelation,
  classifyWordsToTokenSetRelation,
  classifyWordTokenRelation,
  possibleMissingTokens,
  possibleMissingWords,
  possibleTokenSetsForWords,
  possibleWordSetsForTokens,
} from "./solution-space";
import {
  derivePuzzleFromHiddenMapping,
  sentenceCodeTopologyFingerprint,
  targetConnectedToAllRows,
} from "./topology";
import {
  DIRECT_INTERSECTION_PUZZLE,
  GLOBAL_BIJECTION_PUZZLE,
  PARTIAL_INFORMATION_PUZZLE,
} from "./topology-fixtures";
import type { AbstractSentenceCodePuzzle, SentenceCodeSolutionSpace } from "./types";

function solutionKeys(space: SentenceCodeSolutionSpace): string[] {
  return space.solutions.map((solution) => Object.entries(solution.wordToToken)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([wordId, token]) => `${wordId}=${token}`)
    .join("|"))
    .sort();
}

function compareSolvers(puzzle: AbstractSentenceCodePuzzle): void {
  const production = solveSentenceCodeConstraints(puzzle, { maxSolutions: 10_000 });
  const verifier = verifySentenceCodeConstraintsBruteForce(puzzle, { maxAssignments: 10_000 });
  assert.equal(production.solutionCount, verifier.solutionCount);
  assert.deepEqual(production.activeWords, verifier.activeWords);
  assert.deepEqual(production.activeTokens, verifier.activeTokens);
  assert.deepEqual(production.candidateTokensByWord, verifier.candidateTokensByWord);
  assert.deepEqual(production.candidateWordsByToken, verifier.candidateWordsByToken);
  assert.deepEqual(production.invariantPairs, verifier.invariantPairs);
  assert.deepEqual(solutionKeys(production), solutionKeys(verifier));
}

function randomPuzzle(seed: number): AbstractSentenceCodePuzzle {
  const random = new SeededRandom(`cod-cp009-differential:${seed}`);
  const wordCount = random.int(3, 7);
  const rowCount = random.int(2, Math.min(5, wordCount));
  const words = Array.from({ length: wordCount }, (_, index) => `w${index + 1}`);
  const tokens = random.shuffle(Array.from({ length: wordCount }, (_, index) => `t${index + 1}`));
  const mapping: Record<string, string> = {};
  words.forEach((wordId, index) => { mapping[wordId] = tokens[index]!; });

  const maximumMask = (1 << rowCount) - 1;
  const masks = words.map((_, index) => {
    if (index < rowCount) return (1 << index) | random.int(0, maximumMask);
    return random.int(1, maximumMask);
  });

  const rows = Array.from({ length: rowCount }, (_, rowIndex) => {
    const wordIds = words.filter((_, wordIndex) => (masks[wordIndex]! & (1 << rowIndex)) !== 0);
    const mappedTokens = wordIds.map((wordId) => mapping[wordId]!);
    return {
      rowId: `r${rowIndex + 1}`,
      wordIds,
      displayedTokenOrder: random.shuffle(mappedTokens),
    };
  });

  return derivePuzzleFromHiddenMapping(rows, mapping);
}

// Direct/common-word fixture: exact targets coexist with one unresolved pair.
const direct = solveSentenceCodeConstraints(DIRECT_INTERSECTION_PUZZLE);
assert.equal(direct.solutionCount, 2);
assert.equal(classifyWordTokenRelation(direct, "satellite", "ha"), "DEFINITE");
assert.equal(classifyWordTokenRelation(direct, "earth", "sa"), "POSSIBLE");
assert.equal(classifyWordTokenRelation(direct, "earth", "ha"), "IMPOSSIBLE");
assert.equal(classifyTokenWordRelation(direct, "ha", "satellite"), "DEFINITE");
assert.equal(classifyTokenWordRelation(direct, "sa", "has"), "POSSIBLE");
assert.equal(classifyWordsToTokenSetRelation(direct, ["earth", "has"], ["ma", "sa"]), "DEFINITE");
assert.deepEqual(possibleTokenSetsForWords(direct, ["earth", "has"]), [["ma", "sa"]]);
compareSolvers(DIRECT_INTERSECTION_PUZZLE);

// Global-bijection fixture: no pairwise singleton is enough, and every row is required for alpha.
const global = solveSentenceCodeConstraints(GLOBAL_BIJECTION_PUZZLE);
assert.equal(global.solutionCount, 1);
assert.equal(global.invariantPairs.length, 4);
assert.equal(classifyWordTokenRelation(global, "alpha", "ta"), "DEFINITE");
assert.equal(classifyTokenWordRelation(global, "na", "beta"), "DEFINITE");
assert.deepEqual(possibleMissingTokens(global, ["alpha", "beta"], ["ta"]), ["na"]);
assert.deepEqual(possibleMissingWords(global, ["ta", "na"], ["alpha"]), ["beta"]);
assert.equal(targetConnectedToAllRows(GLOBAL_BIJECTION_PUZZLE, "alpha"), true);
const globalMinimality = analyzeSentenceCodeRowMinimality(
  GLOBAL_BIJECTION_PUZZLE,
  { kind: "WORD_TO_TOKEN", wordId: "alpha" },
);
assert.equal(globalMinimality.allRowsContribute, true);
assert.equal(globalMinimality.rows.every((row) => row.contributes), true);
compareSolvers(GLOBAL_BIJECTION_PUZZLE);

// Controlled partial information: atomic relations are possible, while complete pair sets are definite.
const partial = solveSentenceCodeConstraints(PARTIAL_INFORMATION_PUZZLE);
assert.equal(partial.solutionCount, 4);
assert.deepEqual(partial.candidateTokensByWord.amber, ["ka", "mi"]);
assert.equal(classifyWordTokenRelation(partial, "amber", "ka"), "POSSIBLE");
assert.equal(classifyWordTokenRelation(partial, "amber", "zo"), "IMPOSSIBLE");
assert.equal(classifyTokenWordRelation(partial, "ka", "amber"), "POSSIBLE");
assert.equal(classifyWordsToTokenSetRelation(partial, ["amber", "blue"], ["ka", "mi"]), "DEFINITE");
assert.equal(classifyWordsToTokenSetRelation(partial, ["amber", "circle"], ["ka", "zo"]), "POSSIBLE");
assert.equal(classifyWordsToTokenSetRelation(partial, ["amber", "circle"], ["ka", "mi"]), "IMPOSSIBLE");
assert.equal(classifyTokenSetToWordsRelation(partial, ["ka", "mi"], ["amber", "blue"]), "DEFINITE");
assert.equal(classifyTokenSetToWordsRelation(partial, ["ka", "zo"], ["amber", "circle"]), "POSSIBLE");
assert.deepEqual(possibleMissingTokens(partial, ["amber", "blue"], ["ka"]), ["mi"]);
assert.deepEqual(possibleMissingWords(partial, ["ka", "mi"], ["amber"]), ["blue"]);
assert.equal(targetConnectedToAllRows(PARTIAL_INFORMATION_PUZZLE, "amber"), false);
const partialMinimality = analyzeSentenceCodeRowMinimality(
  PARTIAL_INFORMATION_PUZZLE,
  { kind: "WORD_TO_TOKEN", wordId: "amber" },
);
assert.equal(partialMinimality.allRowsContribute, false);
assert.equal(partialMinimality.rows.find((row) => row.rowId === "p1")!.contributes, true);
assert.equal(partialMinimality.rows.find((row) => row.rowId === "p2")!.contributes, false);
assert.deepEqual(possibleTokenSetsForWords(partial, ["amber", "circle"]).map(canonicalSetKey), [
  canonicalSetKey(["ka", "tu"]),
  canonicalSetKey(["ka", "zo"]),
  canonicalSetKey(["mi", "tu"]),
  canonicalSetKey(["mi", "zo"]),
].sort());
assert.deepEqual(possibleWordSetsForTokens(partial, ["ka", "zo"]).map(canonicalSetKey), [
  canonicalSetKey(["amber", "circle"]),
  canonicalSetKey(["amber", "square"]),
  canonicalSetKey(["blue", "circle"]),
  canonicalSetKey(["blue", "square"]),
].sort());
compareSolvers(PARTIAL_INFORMATION_PUZZLE);

// Statement order and code-token order must not change the solution space or topology fingerprint.
const permutedGlobal: AbstractSentenceCodePuzzle = {
  rows: [...GLOBAL_BIJECTION_PUZZLE.rows].reverse().map((row) => ({
    ...row,
    codeTokens: [...row.codeTokens].reverse(),
  })),
};
assert.deepEqual(solutionKeys(solveSentenceCodeConstraints(permutedGlobal)), solutionKeys(global));
assert.equal(
  sentenceCodeTopologyFingerprint(permutedGlobal),
  sentenceCodeTopologyFingerprint(GLOBAL_BIJECTION_PUZZLE),
);

const relabelledGlobal = derivePuzzleFromHiddenMapping(
  [
    { rowId: "x1", wordIds: ["w", "y", "z"] },
    { rowId: "x2", wordIds: ["w", "x", "z"] },
    { rowId: "x3", wordIds: ["w", "x", "y"] },
  ],
  { w: "q1", x: "q2", y: "q3", z: "q4" },
);
assert.equal(
  sentenceCodeTopologyFingerprint(relabelledGlobal),
  sentenceCodeTopologyFingerprint(GLOBAL_BIJECTION_PUZZLE),
);
assert.notEqual(
  sentenceCodeTopologyFingerprint(DIRECT_INTERSECTION_PUZZLE),
  sentenceCodeTopologyFingerprint(GLOBAL_BIJECTION_PUZZLE),
);

// Structural validation and bounded-search failures.
assert.throws(() => solveSentenceCodeConstraints({ rows: [] }), /at least one row/);
assert.throws(() => solveSentenceCodeConstraints({ rows: [
  { rowId: "bad", wordIds: ["a", "b"], codeTokens: ["x"] },
] }), /equal word and code-token cardinality/);
assert.throws(() => solveSentenceCodeConstraints({ rows: [
  { rowId: "bad", wordIds: ["a", "a"], codeTokens: ["x", "y"] },
] }), /must not contain duplicates/);
assert.throws(() => solveSentenceCodeConstraints({ rows: [
  { rowId: "r1", wordIds: ["a", "b"], codeTokens: ["x", "y"] },
  { rowId: "r2", wordIds: ["a"], codeTokens: ["y"] },
  { rowId: "r3", wordIds: ["b"], codeTokens: ["y"] },
] }), /No consistent bijection/);
assert.throws(() => verifySentenceCodeConstraintsBruteForce({ rows: [
  { rowId: "r1", wordIds: ["a", "b"], codeTokens: ["x", "y"] },
  { rowId: "r2", wordIds: ["a"], codeTokens: ["y"] },
  { rowId: "r3", wordIds: ["b"], codeTokens: ["y"] },
] }), /No consistent sentence-code bijection/);
assert.throws(() => derivePuzzleFromHiddenMapping(
  [{ rowId: "r", wordIds: ["a", "b"], displayedTokenOrder: ["x", "z"] }],
  { a: "x", b: "y" },
), /do not match/);

const eightWordPuzzle = derivePuzzleFromHiddenMapping(
  [{ rowId: "all", wordIds: ["a", "b", "c", "d", "e", "f", "g", "h"] }],
  { a: "t1", b: "t2", c: "t3", d: "t4", e: "t5", f: "t6", g: "t7", h: "t8" },
);
assert.throws(() => solveSentenceCodeConstraints(eightWordPuzzle), /exceeds configured limit/);
assert.throws(() => verifySentenceCodeConstraintsBruteForce(eightWordPuzzle, { maxAssignments: 10_000 }), /exceeds configured limit/);
assert.throws(() => possibleTokenSetsForWords(partial, ["amber", "amber"]), /must not contain duplicates/);
assert.throws(() => possibleMissingTokens(partial, ["amber", "blue"], ["ka", "ka"]), /must not contain duplicates/);

// Random differential proof: signature solver versus independent full-permutation verifier.
let randomCases = 0;
let totalSolutions = 0;
let maximumSolutions = 0;
for (let seed = 1; seed <= 160; seed += 1) {
  const puzzle = randomPuzzle(seed);
  const production = solveSentenceCodeConstraints(puzzle, { maxSolutions: 10_000 });
  const verifier = verifySentenceCodeConstraintsBruteForce(puzzle, { maxAssignments: 10_000 });
  assert.equal(production.solutionCount, verifier.solutionCount, `solution-count mismatch at seed ${seed}`);
  assert.deepEqual(production.candidateTokensByWord, verifier.candidateTokensByWord, `word candidates mismatch at seed ${seed}`);
  assert.deepEqual(production.candidateWordsByToken, verifier.candidateWordsByToken, `token candidates mismatch at seed ${seed}`);
  assert.deepEqual(production.invariantPairs, verifier.invariantPairs, `invariants mismatch at seed ${seed}`);
  assert.deepEqual(solutionKeys(production), solutionKeys(verifier), `solution mappings mismatch at seed ${seed}`);
  randomCases += 1;
  totalSolutions += production.solutionCount;
  maximumSolutions = Math.max(maximumSolutions, production.solutionCount);
}

console.log(JSON.stringify({
  checkpoint: "COD-CP-009",
  maturity: "CONSTRAINT_FOUNDATION_PROOF",
  permanentQlsCreated: 0,
  fixedTopologies: 3,
  randomDifferentialCases: randomCases,
  totalRandomSolutionsVerified: totalSolutions,
  maximumRandomSolutionSpace: maximumSolutions,
  exactAtomicProof: "PASS",
  inverseProof: "PASS",
  exactSetProof: "PASS",
  possibleRelationProof: "PASS",
  impossibleRelationProof: "PASS",
  missingMemberProof: "PASS",
  rowMinimalityProof: "PASS",
  statementOrderInvariance: "PASS",
  tokenOrderInvariance: "PASS",
  topologyFingerprintInvariance: "PASS",
  verdict: "PASS — ABSTRACT SENTENCE-CODE CONSTRAINT FOUNDATION",
}, null, 2));
