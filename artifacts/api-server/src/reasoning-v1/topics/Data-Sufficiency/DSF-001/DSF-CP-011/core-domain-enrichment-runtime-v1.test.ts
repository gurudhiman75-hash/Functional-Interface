import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP011_CORE_ENRICHMENT_SOLVE_MODES,
  generateDsfCp011CoreEnrichmentBatch,
  normalizeDsfCp011CoreEnrichmentSurface,
} from "./core-domain-enrichment-runtime-v1.ts";

const questions = generateDsfCp011CoreEnrichmentBatch(Array.from({ length: 300 }, (_, seed) => seed));
assert.equal(questions.length, 300);
assert.deepEqual(new Set(questions.map(q => q.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES));
assert.deepEqual(new Set(questions.map(q => q.solveModeId)), new Set(DSF_CP011_CORE_ENRICHMENT_SOLVE_MODES));
assert.deepEqual(new Set(questions.map(q => q.sourceChapterId)), new Set(["RAP-001", "PCT-001", "NUM-001"]));
assert.deepEqual(new Set(questions.map(q => q.sourceDomain)), new Set(["RATIO", "PERCENTAGE", "NUMBER_SYSTEM"]));
assert.deepEqual(new Set(questions.map(q => q.difficulty)), new Set(["Easy", "Medium", "Hard"]));

const expectedContexts = new Set([
  "RATIO_COMPONENT_SCALE", "DIRECT_VARIATION", "INVERSE_VARIATION", "FOURTH_PROPORTIONAL",
  "PERCENT_OF_TOTAL", "REVERSE_PERCENT", "VALUE_AS_PERCENT", "SUCCESSIVE_CHANGE",
  "LEAST_MULTIPLE_BOUND", "REMAINDER",
]);
assert.deepEqual(new Set(questions.map(q => q.contextId)), expectedContexts);

for (const question of questions) {
  assert.equal(question.packageId, "DSF-001");
  assert.equal(question.checkpointId, "DSF-CP-011");
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.answerContractId, "DS_STANDARD_5");
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter(o => o.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert(question.proof.baseWorldCount >= 25);
  assert(question.proof.statementIWorldCount > 0);
  assert(question.proof.statementIIWorldCount > 0);
  assert(question.proof.togetherWorldCount > 0);
  assert.equal(question.lifecycle.contentStatus, "CP011_EXPANSION_REVIEW_CANDIDATE");
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert(question.sourceAncestry.includes(question.sourceChapterId));
  assert(question.sourceAncestry.includes(question.sourceCapability));

  if (question.sourceChapterId === "RAP-001") {
    assert.equal(question.sourceCapability, "RAP-001/solver::solveRap001");
    assert.equal(question.proof.baseWorldCount, 64);
  } else if (question.sourceChapterId === "PCT-001") {
    assert.equal(question.sourceCapability, "PCT-001/solver::solvePct001");
    assert.equal(question.proof.baseWorldCount, 25);
  } else {
    assert.equal(question.proof.baseWorldCount, 36);
    assert([
      "NUM-001/foundation/divisibility::leastMultipleAtOrAbove",
      "NUM-001/foundation/divisibility::positiveMod",
    ].includes(question.sourceCapability));
  }
}

const modeCounts = Object.fromEntries(DSF_CP011_CORE_ENRICHMENT_SOLVE_MODES.map(mode => [mode, questions.filter(q => q.solveModeId === mode).length]));
for (const mode of DSF_CP011_CORE_ENRICHMENT_SOLVE_MODES) assert.equal(modeCounts[mode], 30, `${mode} must receive exactly 30 audit questions`);

const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map(cls => [cls, questions.filter(q => q.canonicalAnswer === cls).length]));
for (const cls of SUFFICIENCY_CLASSES) assert.equal(classCounts[cls], 60, `${cls} must receive exactly 60 audit questions`);

for (const mode of DSF_CP011_CORE_ENRICHMENT_SOLVE_MODES) {
  const classesForMode = new Set(questions.filter(q => q.solveModeId === mode).map(q => q.canonicalAnswer));
  assert.deepEqual(classesForMode, new Set(SUFFICIENCY_CLASSES), `${mode} must construct all five canonical DS classes`);
}

const identities = new Set(questions.map(q => q.generationIdentity));
assert.equal(identities.size, questions.length);

const normalizedStems = new Set(questions.map(q => normalizeDsfCp011CoreEnrichmentSurface(q.stem)));
assert(normalizedStems.size >= 36, `Expected at least 36 normalized core-enrichment stem surfaces, found ${normalizedStems.size}`);

const structural = new Set(questions.map(q => q.studentSurfaceFingerprint));
assert(structural.size >= 100, `Expected at least 100 core-enrichment structural fingerprints, found ${structural.size}`);

const counts = new Map<string, number>();
for (const q of questions) counts.set(q.studentSurfaceFingerprint, (counts.get(q.studentSurfaceFingerprint) ?? 0) + 1);
const largestCluster = Math.max(...counts.values());
assert(largestCluster <= 8, `Core-enrichment structure repeated ${largestCluster} times in 300-question audit`);

console.log(JSON.stringify({
  status: "PASS_DSF_CP011_CORE_DOMAIN_ENRICHMENT_BREADTH_AND_REALNESS_AUDIT",
  auditedQuestions: questions.length,
  modeCounts,
  classCounts,
  sourceChapters: [...new Set(questions.map(q => q.sourceChapterId))].sort(),
  contexts: [...new Set(questions.map(q => q.contextId))].sort(),
  normalizedStemCount: normalizedStems.size,
  structuralFingerprintCount: structural.size,
  largestFingerprintCluster: largestCluster,
  distinctGenerationIdentities: identities.size,
}, null, 2));
