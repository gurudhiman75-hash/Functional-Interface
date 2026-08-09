import assert from "node:assert/strict";
import { exactKey } from "../../foundation/exact";
import { auditMenCp009Registry, MEN_CP_009_FROZEN_QLS } from "./registry";
import { generateMenCp009Question } from "./runtime";

const registry = auditMenCp009Registry();
assert.equal(registry.qlCount, 24);
assert.equal(registry.firstQlId, "MEN-002-QL-096");
assert.equal(registry.lastQlId, "MEN-002-QL-119");
assert.equal(registry.uniqueQlIds, 24);
assert.equal(registry.uniqueFamilyIds, 24);
assert.equal(registry.contiguous, true);
assert.equal(registry.lifecycleLocked, true);

const packages = MEN_CP_009_FROZEN_QLS.flatMap((definition) =>
  Array.from({ length: 80 }, (_unused, index) =>
    generateMenCp009Question(definition.qlId, `proof-${index + 1}`),
  ),
);

assert.equal(packages.length, 1920);
assert.ok(packages.every((question) => question.validation.valid));
assert.ok(packages.every((question) => question.verification.valid));
assert.ok(packages.every((question) => question.options.length === 4));
assert.ok(packages.every((question) => new Set(question.options.map((option) => exactKey(option.value))).size === 4));
assert.ok(packages.every((question) => question.options.filter((option) => option.isCorrect).length === 1));
assert.ok(packages.every((question) => question.explanation.traps.length === 3));
assert.ok(packages.every((question) => question.diagram.responsive && question.diagram.minWidthPx === 0));
assert.ok(packages.every((question) => question.questionBankStatus === "NOT_STORED"));
assert.ok(packages.every((question) => question.testEligibility === "INELIGIBLE"));
assert.ok(packages.every((question) => !question.publiclyPublishable && !question.questionStudioDiscoverable));

for (const definition of MEN_CP_009_FROZEN_QLS) {
  const familyPackages = packages.filter((question) => question.permanentQlId === definition.qlId);
  assert.equal(familyPackages.length, 80);
  assert.deepEqual(new Set(familyPackages.map((question) => question.correctIndex)), new Set([0, 1, 2, 3]));
  assert.deepEqual(new Set(familyPackages.map((question) => question.piPolicy)), new Set(["EXACT_PI", "PI_22_OVER_7", "PI_3_14"]));
}

const deterministicA = generateMenCp009Question("MEN-002-QL-096", "deterministic-proof");
const deterministicB = generateMenCp009Question("MEN-002-QL-096", "deterministic-proof");
assert.deepEqual(deterministicA, deterministicB);

const reviewPackages = MEN_CP_009_FROZEN_QLS.flatMap((definition) =>
  ["review-a", "review-b", "review-c", "review-d"].map((seed) =>
    generateMenCp009Question(definition.qlId, seed),
  ),
);
assert.equal(reviewPackages.length, 96);
assert.equal(new Set(reviewPackages.map((question) => question.stem)).size, 96);
assert.equal(new Set(reviewPackages.map((question) => `${question.stem}|${question.options.map((option) => option.display).join("|")}`)).size, 96);

const answerPositions = reviewPackages.reduce<Record<string, number>>((counts, question) => {
  const label = question.options[question.correctIndex]!.label;
  counts[label] = (counts[label] ?? 0) + 1;
  return counts;
}, {});
assert.deepEqual(answerPositions, { D: 24, C: 24, B: 24, A: 24 });

console.log(JSON.stringify({
  authority: "MEN-CP009-ENGLISH-IMPLEMENTATION-V1",
  qlCount: registry.qlCount,
  deterministicPackages: packages.length,
  validPackages: packages.filter((question) => question.validation.valid).length,
  reviewRecords: reviewPackages.length,
  uniqueReviewStems: new Set(reviewPackages.map((question) => question.stem)).size,
  answerPositions,
  lifecycle: "ACTIVATION_LOCKED",
}, null, 2));
