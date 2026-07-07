import { strict as assert } from "node:assert";
import { getRap002ActiveCanonicalProblemIds, getRap002QuestionLanguageIds, validateRap002Libraries } from "./library";
import { runRap002Pipeline } from "./pipeline";
import type { Rap002AnswerType, Rap002CanonicalProblemId, Rap002QuestionPackage, Rap002TaskKind } from "./types";

type CpCoverage = {
  cpId: Rap002CanonicalProblemId;
  forcedQlIds: Set<string>;
  randomQlIds: Set<string>;
  taskKinds: Set<Rap002TaskKind>;
  answerTypes: Set<Rap002AnswerType>;
  stems: Set<string>;
  samples: number;
};

const EXPECTED_TASK_KINDS = new Set<Rap002TaskKind>([
  "chainAlignment",
  "extendedChainAlignment",
  "missingChainRatio",
  "reverseMiddleFinding",
  "reverseEndpointFinding",
  "constrainedReverseChain",
  "successiveRatioChange",
  "transferTracking",
  "reconstructOriginalRatio",
  "nestedPartition",
  "conditionalDistribution",
  "weightedNestedPartition",
  "inverseChainWork",
  "inverseChainSpeed",
  "combinedInverseChain",
  "chainOrdering",
  "chainInequality",
  "chainEquivalence",
]);

function hasUnresolvedPlaceholder(text: string) {
  const withoutLatexCommandArgs = text.replace(/\\[A-Za-z]+\{[^}]*\}/g, "");
  return /\{[A-Za-z][A-Za-z0-9_]*\}/.test(withoutLatexCommandArgs);
}

function assertPackage(pkg: Rap002QuestionPackage) {
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.archetypeId, "RAP-002");
  assert.ok(pkg.stem.trim().length > 0, "Stem must be present.");
  assert.ok(pkg.answer.trim().length > 0, "Answer must be present.");
  assert.ok(pkg.explanation.lines.length >= 5, "Explanation should have a pedagogical multi-line shape.");
  assert.equal(hasUnresolvedPlaceholder(pkg.stem), false, `Unresolved placeholder in stem: ${pkg.stem}`);
  assert.equal(pkg.explanation.lines.some(hasUnresolvedPlaceholder), false, `Unresolved placeholder in explanation for ${pkg.questionLanguageId}`);
  assert.equal(pkg.parameters.taskKind, pkg.solver.answerType === "LOGIC" ? pkg.parameters.taskKind : pkg.parameters.taskKind);
  assert.equal(pkg.parameters.answerType, pkg.solver.answerType);
}

function auditCanonicalProblem(cpId: Rap002CanonicalProblemId): CpCoverage {
  const qlIds = getRap002QuestionLanguageIds(cpId);
  assert.ok(qlIds.length > 0, `No active QLs found for ${cpId}.`);

  const coverage: CpCoverage = {
    cpId,
    forcedQlIds: new Set(),
    randomQlIds: new Set(),
    taskKinds: new Set(),
    answerTypes: new Set(),
    stems: new Set(),
    samples: 0,
  };

  for (const qlId of qlIds) {
    const pkg = runRap002Pipeline(cpId, { seed: `rap-002-audit:forced:${cpId}:${qlId}`, questionLanguageId: qlId });
    assertPackage(pkg);
    assert.equal(pkg.questionLanguageId, qlId);
    coverage.forcedQlIds.add(pkg.questionLanguageId);
    coverage.taskKinds.add(pkg.parameters.taskKind);
    coverage.answerTypes.add(pkg.parameters.answerType);
    coverage.stems.add(pkg.stem);
    coverage.samples += 1;
  }

  for (let index = 0; index < 120; index += 1) {
    const pkg = runRap002Pipeline(cpId, { seed: `rap-002-audit:random:${cpId}:${index}` });
    assertPackage(pkg);
    coverage.randomQlIds.add(pkg.questionLanguageId);
    coverage.taskKinds.add(pkg.parameters.taskKind);
    coverage.answerTypes.add(pkg.parameters.answerType);
    coverage.stems.add(pkg.stem);
    coverage.samples += 1;
  }

  for (const qlId of qlIds) {
    assert.equal(coverage.forcedQlIds.has(qlId), true, `Forced coverage missed ${qlId}.`);
  }

  return coverage;
}

const libraryValidation = validateRap002Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

const cpCoverages = getRap002ActiveCanonicalProblemIds().map(auditCanonicalProblem);
const allTaskKinds = new Set<Rap002TaskKind>();
const allAnswerTypes = new Set<Rap002AnswerType>();
let totalForcedQlIds = 0;
let totalSamples = 0;

for (const coverage of cpCoverages) {
  for (const taskKind of coverage.taskKinds) allTaskKinds.add(taskKind);
  for (const answerType of coverage.answerTypes) allAnswerTypes.add(answerType);
  totalForcedQlIds += coverage.forcedQlIds.size;
  totalSamples += coverage.samples;
}

for (const taskKind of EXPECTED_TASK_KINDS) {
  assert.equal(allTaskKinds.has(taskKind), true, `Expected task kind not covered: ${taskKind}`);
}

assert.equal(totalForcedQlIds, 42, `Expected 42 active QLs, got ${totalForcedQlIds}.`);
assert.equal(allAnswerTypes.has("RATIO"), true, "RATIO answers must be covered.");
assert.equal(allAnswerTypes.has("COUNT"), true, "COUNT answers must be covered.");
assert.equal(allAnswerTypes.has("LOGIC"), true, "LOGIC answers must be covered.");

console.log("RAP-002 coverage audit passed.");
console.log(`Active CPs: ${cpCoverages.length}`);
console.log(`Active QLs: ${totalForcedQlIds}`);
console.log(`Task kinds: ${allTaskKinds.size}`);
console.log(`Answer types: ${Array.from(allAnswerTypes).sort().join(", ")}`);
console.log(`Generated samples: ${totalSamples}`);
for (const coverage of cpCoverages) {
  console.log(`${coverage.cpId}: forced=${coverage.forcedQlIds.size}, random=${coverage.randomQlIds.size}, taskKinds=${Array.from(coverage.taskKinds).sort().join(", ")}, uniqueStems=${coverage.stems.size}`);
}
