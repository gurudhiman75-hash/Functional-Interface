import assert from "node:assert/strict";
import {
  THREE_STATEMENT_NONEMPTY_SUBSETS,
  evaluateFiniteDomainTriple,
  evaluateThreeStatementSufficiency,
  threeStatementSemanticKey,
  threeStatementSubsetKey,
  type ThreeStatementId,
  type ThreeStatementSubset,
} from "./three-statement-foundation.ts";
import {
  DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS,
  buildThreeStatementAnswerOptions,
  renderThreeStatementSemanticLabel,
  type DsfCp015ThreeStatementSemanticKey,
} from "./three-statement-answer-profile.ts";
import { SufficiencyInvariantError } from "../foundation/types.ts";

const STATEMENTS = ["I", "II", "III"] as const;
type World = Readonly<{ truth: Readonly<Record<ThreeStatementId, boolean>>; target: "A" | "B" }>;

function parseMinimalSets(key: DsfCp015ThreeStatementSemanticKey): readonly ThreeStatementSubset[] {
  if (key === "NONE") return [];
  return key.split("|").map((subset) => Object.freeze(subset.split("+") as ThreeStatementId[]));
}

function isSubset(left: readonly ThreeStatementId[], right: readonly ThreeStatementId[]): boolean {
  return left.every((id) => right.includes(id));
}

function allSubsetsIncludingEmpty(): readonly ThreeStatementSubset[] {
  const output: ThreeStatementSubset[] = [Object.freeze([] as ThreeStatementId[])];
  output.push(...THREE_STATEMENT_NONEMPTY_SUBSETS);
  return output;
}

function expectedSufficient(minimalSets: readonly ThreeStatementSubset[], subset: readonly ThreeStatementId[]): boolean {
  return minimalSets.some((minimal) => isSubset(minimal, subset));
}

function maximalInsufficientSets(minimalSets: readonly ThreeStatementSubset[]): readonly ThreeStatementSubset[] {
  const all = allSubsetsIncludingEmpty();
  const insufficient = all.filter((subset) => !expectedSufficient(minimalSets, subset));
  return insufficient.filter((candidate) => !insufficient.some((other) => candidate.length < other.length && isSubset(candidate, other)));
}

function truthFor(subset: readonly ThreeStatementId[]): Readonly<Record<ThreeStatementId, boolean>> {
  return Object.freeze({
    I: subset.includes("I"),
    II: subset.includes("II"),
    III: subset.includes("III"),
  });
}

function worldsForSemanticKey(key: DsfCp015ThreeStatementSemanticKey): readonly World[] {
  const minimalSets = parseMinimalSets(key);
  const worlds: World[] = [
    Object.freeze({ truth: truthFor(STATEMENTS), target: "A" as const }),
  ];

  if (key === "NONE") {
    worlds.push(Object.freeze({ truth: truthFor(STATEMENTS), target: "B" as const }));
    return Object.freeze(worlds);
  }

  for (const maximalInsufficient of maximalInsufficientSets(minimalSets)) {
    worlds.push(Object.freeze({ truth: truthFor(maximalInsufficient), target: "B" as const }));
  }
  return Object.freeze(worlds);
}

function evaluateKey(key: DsfCp015ThreeStatementSemanticKey) {
  const worlds = worldsForSemanticKey(key);
  return evaluateThreeStatementSufficiency({
    baseWorlds: worlds,
    statementI: (world) => world.truth.I,
    statementII: (world) => world.truth.II,
    statementIII: (world) => world.truth.III,
    evaluateTarget: (world) => world.target,
    normalizeAnswer: (answer) => answer,
  });
}

assert.equal(DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS.length, 19, "three-statement contract must expose exactly 19 valid semantic states");
assert.equal(new Set(DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS).size, 19, "semantic keys must be unique");
assert.equal(THREE_STATEMENT_NONEMPTY_SUBSETS.length, 7, "three statements have seven non-empty subsets");

const seenSemanticKeys = new Set<string>();
for (const key of DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS) {
  const evaluation = evaluateKey(key);
  seenSemanticKeys.add(evaluation.semanticKey);
  assert.equal(evaluation.semanticKey, key, `constructive finite domain must reproduce semantic state ${key}`);
  assert.equal(evaluation.base.sufficient, false, `${key}: base problem must not already determine the target`);
  assert.equal(evaluation.subsetEvaluations.length, 7, `${key}: all seven non-empty subsets must be evaluated`);
  assert.equal(evaluation.allThree.consistent, true, `${key}: all statements together must remain consistent`);

  const minimalSets = parseMinimalSets(key);
  assert.equal(
    threeStatementSemanticKey(evaluation.minimalSufficientSets),
    key,
    `${key}: canonical minimal-set serialization must be stable`,
  );

  for (const entry of evaluation.subsetEvaluations) {
    const subset = entry.statementIds as ThreeStatementSubset;
    assert.equal(
      entry.result.sufficient,
      expectedSufficient(minimalSets, subset),
      `${key}: sufficiency mismatch for ${threeStatementSubsetKey(subset)}`,
    );
    assert.equal(entry.result.consistent, true, `${key}: ${threeStatementSubsetKey(subset)} must remain consistent`);
  }

  const allOptions = Array.from({ length: 5 }, (_, seed) => buildThreeStatementAnswerOptions(key, seed));
  for (const options of allOptions) {
    assert.equal(options.length, 5, `${key}: answer profile must contain five options`);
    assert.equal(options.filter((option) => option.isCorrect).length, 1, `${key}: exactly one option must be correct`);
    assert.equal(new Set(options.map((option) => option.semanticKey)).size, 5, `${key}: option semantic keys must be unique`);
    assert.equal(new Set(options.map((option) => option.text)).size, 5, `${key}: option text must be unique`);
  }
  assert.deepEqual(
    allOptions.map((options) => options.findIndex((option) => option.isCorrect)).sort((a, b) => a - b),
    [0, 1, 2, 3, 4],
    `${key}: deterministic seed rotation must expose the correct answer at every option position`,
  );
}

assert.deepEqual(seenSemanticKeys, new Set(DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS), "constructive audit must realize all 19 semantic states");
assert.equal(new Set(DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS.map(renderThreeStatementSemanticLabel)).size, 19, "all semantic states need distinct human-readable labels");

const bridgeWorlds = worldsForSemanticKey("I+II|I+III");
const bridgeAdapter = {
  adapterId: "CP015-TEST-ADAPTER",
  domainFamily: "REASONING" as const,
  enumerateBaseWorlds: () => bridgeWorlds,
  statementHolds: (_problem: null, world: World, statement: ThreeStatementId) => world.truth[statement],
  evaluateTarget: (_problem: null, world: World) => world.target,
  normalizeAnswer: (answer: "A" | "B") => answer,
};
assert.equal(evaluateFiniteDomainTriple(bridgeAdapter, null, "I", "II", "III").semanticKey, "I+II|I+III");

assert.throws(
  () => evaluateThreeStatementSufficiency({
    baseWorlds: [Object.freeze({ truth: truthFor([]), target: "A" as const })],
    statementI: () => true,
    statementII: () => true,
    statementIII: () => true,
    evaluateTarget: (world) => world.target,
    normalizeAnswer: (answer) => answer,
  }),
  (error: unknown) => error instanceof SufficiencyInvariantError && error.code === "DSF_BASE_ALREADY_SUFFICIENT",
  "already-sufficient base problems must be rejected",
);

assert.throws(
  () => evaluateThreeStatementSufficiency({
    baseWorlds: [
      Object.freeze({ truth: Object.freeze({ I: true, II: true, III: false }), target: "A" as const }),
      Object.freeze({ truth: Object.freeze({ I: false, II: false, III: true }), target: "B" as const }),
    ],
    statementI: (world) => world.truth.I,
    statementII: (world) => world.truth.II,
    statementIII: (world) => world.truth.III,
    evaluateTarget: (world) => world.target,
    normalizeAnswer: (answer) => answer,
  }),
  (error: unknown) => error instanceof SufficiencyInvariantError && error.code === "DSF_INCONSISTENT_THREE_STATEMENT_SET",
  "jointly inconsistent three-statement sets must be rejected",
);

console.log(JSON.stringify({
  status: "PASS_DSF_CP015_THREE_STATEMENT_SUBSET_LATTICE_FOUNDATION",
  semanticStateCount: DSF_CP015_THREE_STATEMENT_SEMANTIC_KEYS.length,
  evaluatedSubsetsPerState: THREE_STATEMENT_NONEMPTY_SUBSETS.length,
  answerOptionsPerState: 5,
  correctOptionPositionsVerified: [0, 1, 2, 3, 4],
  finiteDomainBridgeVerified: true,
}, null, 2));
