import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP011_ALGEBRA_ENRICHMENT_SOLVE_MODES,
  generateDsfCp011AlgebraEnrichmentBatch,
  normalizeDsfCp011AlgebraSurface,
} from "./algebra-enrichment-runtime-v1.ts";

const questions = generateDsfCp011AlgebraEnrichmentBatch(Array.from({ length: 200 }, (_, seed) => seed));
assert.equal(questions.length, 200);
assert.deepEqual(new Set(questions.map(q => q.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES));
assert.deepEqual(new Set(questions.map(q => q.solveModeId)), new Set(DSF_CP011_ALGEBRA_ENRICHMENT_SOLVE_MODES));
assert.deepEqual(new Set(questions.map(q => q.contextId)), new Set(["LINEAR_EQUATION", "SIMULTANEOUS_EQUATIONS"]));
assert.deepEqual(new Set(questions.map(q => q.difficulty)), new Set(["Easy", "Medium", "Hard"]));

for (const q of questions) {
  assert.equal(q.packageId, "DSF-001");
  assert.equal(q.checkpointId, "DSF-CP-011");
  assert.equal(q.qlId, "DSF-QL-001");
  assert.equal(q.sourceDomain, "ALGEBRA");
  assert.equal(q.sourceChapterId, "ALG-001/ALG-002");
  assert.equal(q.sourceFreezeAuthority, "ALG-EN-review-v3");
  assert(q.sourceAncestry.includes("ALG-EN-v3-frozen"));
  assert(q.sourceAncestry.includes(q.sourceCapability));
  assert.equal(q.options.length, 5);
  assert.equal(q.options.filter(o => o.isCorrect).length, 1);
  assert.equal(q.options[q.correctIndex]?.semanticClass, q.canonicalAnswer);
  assert(q.proof.statementIWorldCount > 0);
  assert(q.proof.statementIIWorldCount > 0);
  assert(q.proof.togetherWorldCount > 0);
  assert.equal(q.lifecycle.questionStudioDiscoverable, false);
  assert.equal(q.lifecycle.questionBankWritable, false);
  assert.equal(q.lifecycle.testEligible, false);
  assert.equal(q.lifecycle.publiclyPublishable, false);
  if (q.solveModeId === "DSF-SM-ALG-LINEAR-EQUATION-X") {
    assert.equal(q.proof.baseWorldCount, 100);
    assert.equal(q.sourceCapability, "quant-v4/shared/algebra::solveLinearEquation");
  } else {
    assert.equal(q.proof.baseWorldCount, 25);
    assert.equal(q.sourceCapability, "quant-v4/shared/algebra::solveLinearSystem2V");
  }
}

const modeCounts = Object.fromEntries(DSF_CP011_ALGEBRA_ENRICHMENT_SOLVE_MODES.map(mode => [mode, questions.filter(q => q.solveModeId === mode).length]));
for (const mode of DSF_CP011_ALGEBRA_ENRICHMENT_SOLVE_MODES) assert.equal(modeCounts[mode], 100);
const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map(cls => [cls, questions.filter(q => q.canonicalAnswer === cls).length]));
for (const cls of SUFFICIENCY_CLASSES) assert.equal(classCounts[cls], 40);
for (const mode of DSF_CP011_ALGEBRA_ENRICHMENT_SOLVE_MODES) {
  assert.deepEqual(new Set(questions.filter(q => q.solveModeId === mode).map(q => q.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES));
}

const identities = new Set(questions.map(q => q.generationIdentity));
assert.equal(identities.size, 200);
const stems = new Set(questions.map(q => normalizeDsfCp011AlgebraSurface(q.stem)));
assert(stems.size >= 8, `Expected all 8 Algebra intro/prompt surfaces, found ${stems.size}`);
const fingerprints = new Set(questions.map(q => q.studentSurfaceFingerprint));
assert(fingerprints.size >= 30, `Expected at least 30 Algebra structural fingerprints, found ${fingerprints.size}`);
const counts = new Map<string, number>();
for (const q of questions) counts.set(q.studentSurfaceFingerprint, (counts.get(q.studentSurfaceFingerprint) ?? 0) + 1);
const largestCluster = Math.max(...counts.values());
assert(largestCluster <= 12, `Algebra structure repeated ${largestCluster} times in 200-question audit`);

console.log(JSON.stringify({
  status: "PASS_DSF_CP011_ALGEBRA_ENRICHMENT_BREADTH_AND_REALNESS_AUDIT",
  auditedQuestions: questions.length,
  modeCounts,
  classCounts,
  normalizedStemCount: stems.size,
  structuralFingerprintCount: fingerprints.size,
  largestFingerprintCluster: largestCluster,
  distinctGenerationIdentities: identities.size,
}, null, 2));
