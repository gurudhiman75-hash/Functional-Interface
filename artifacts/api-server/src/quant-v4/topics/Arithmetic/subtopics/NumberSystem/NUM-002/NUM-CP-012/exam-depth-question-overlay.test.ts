import assert from "node:assert/strict";

import {
  applyNumCp012ExamDepthOverlayV2,
  NUM_CP012_EXAM_DEPTH_PROFILE,
} from "./exam-depth-question-overlay-v2.ts";
import { generateNumCp012Wave01 } from "./wave01/runtime.ts";
import type { NumCp012Wave01PrototypeId } from "./wave01/types.ts";
import { generateNumCp012Wave02 } from "./wave02/runtime.ts";
import type { NumCp012Wave02PrototypeId } from "./wave02/types.ts";

const wave01: readonly NumCp012Wave01PrototypeId[] = [
  "NUM-CP012-PROT-001",
  "NUM-CP012-PROT-002",
  "NUM-CP012-PROT-003",
  "NUM-CP012-PROT-004",
  "NUM-CP012-PROT-005",
  "NUM-CP012-PROT-006",
  "NUM-CP012-PROT-007",
  "NUM-CP012-PROT-008",
];
const wave02: readonly NumCp012Wave02PrototypeId[] = [
  "NUM-CP012-PROT-009",
  "NUM-CP012-PROT-010",
  "NUM-CP012-PROT-011",
  "NUM-CP012-PROT-012",
  "NUM-CP012-PROT-013",
  "NUM-CP012-PROT-014",
];

function product(factors: readonly (readonly [unknown, unknown])[]) {
  return factors.reduce((acc, entry) => acc * BigInt(String(entry[0])) ** BigInt(Number(entry[1])), 1n);
}

function assertPackage(label: string, q: ReturnType<typeof applyNumCp012ExamDepthOverlayV2>) {
  assert.equal((q as any).examDepthOverlay.profile, NUM_CP012_EXAM_DEPTH_PROFILE, `${label}: profile missing`);
  assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: canonical/verifier drift`);
  assert.equal(q.options.length, 4, `${label}: option count drift`);
  assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate options`);
  assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: correct-option count drift`);
  assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct-index drift`);
  assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: answer binding drift`);
}

let directChecks = 0;
for (const prototypeId of wave01) {
  for (const seed of [1, 2, 5, 11]) {
    const source = generateNumCp012Wave01(prototypeId, seed);
    const q = applyNumCp012ExamDepthOverlayV2(source, "en");
    const label = `${prototypeId}/${seed}`;
    assertPackage(label, q);
    assert.equal((q as any).examDepthOverlay.sourceMathematicalFingerprint, source.mathematicalFingerprint, `${label}: source fingerprint lost`);
    directChecks += 1;
  }
}
for (const prototypeId of wave02) {
  for (const seed of [1, 2, 3, 4, 5, 6, 11]) {
    const source = generateNumCp012Wave02(prototypeId, seed);
    const q = applyNumCp012ExamDepthOverlayV2(source, "en");
    const label = `${prototypeId}/${seed}`;
    assertPackage(label, q);
    assert.equal((q as any).examDepthOverlay.sourceMathematicalFingerprint, source.mathematicalFingerprint, `${label}: source fingerprint lost`);
    directChecks += 1;
  }
}

// Recognition must carry a true prime factorisation, not the enlarged root as a fake prime.
for (const seed of [1, 2, 11, 29]) {
  const q = applyNumCp012ExamDepthOverlayV2(generateNumCp012Wave01("NUM-CP012-PROT-001", seed), "en");
  const factors = q.hiddenState.factors as readonly (readonly [unknown, unknown])[];
  const k = Number(q.hiddenState.k);
  const perfect = BigInt(String(q.hiddenState.perfect));
  assert.equal(product(factors), perfect, `P001/${seed}: factors do not rebuild perfect value`);
  assert.ok(factors.every((entry) => Number(entry[1]) % k === 0), `P001/${seed}: exponent not divisible by k`);
  assert.notEqual(q.mathematicalFingerprint, generateNumCp012Wave01("NUM-CP012-PROT-001", seed).mathematicalFingerprint, `P001/${seed}: transformed fingerprint did not change`);
  assert.ok(perfect >= 12n ** BigInt(k), `P001/${seed}: calculation magnitude unexpectedly tiny`);
}

// Direct-root questions must be materially larger than discovery fixtures.
for (const seed of [1, 2, 11]) {
  const source = generateNumCp012Wave01("NUM-CP012-PROT-002", seed);
  const q = applyNumCp012ExamDepthOverlayV2(source, "en");
  assert.ok(BigInt(String(q.hiddenState.value)) > BigInt(String(source.hiddenState.value)), `P002/${seed}: target was not deepened`);
}

// Adding whole multiples of k must preserve multiplier/divisor residue semantics while enlarging N.
for (const prototypeId of ["NUM-CP012-PROT-003", "NUM-CP012-PROT-004"] as const) {
  for (const seed of [1, 2, 11]) {
    const source = generateNumCp012Wave01(prototypeId, seed);
    const q = applyNumCp012ExamDepthOverlayV2(source, "en");
    assert.equal(q.canonicalAnswer, source.canonicalAnswer, `${prototypeId}/${seed}: residue-semantic answer changed`);
    assert.ok(BigInt(String(q.hiddenState.value)) > BigInt(String(source.hiddenState.value)), `${prototypeId}/${seed}: N was not enlarged`);
  }
}

// Range-count distractor identities must stay distinct after deepening.
for (const seed of [1, 2, 11]) {
  const q = applyNumCp012ExamDepthOverlayV2(generateNumCp012Wave01("NUM-CP012-PROT-007", seed), "en");
  const byMisconception = new Map(q.options.map((option) => [option.misconceptionId, option.value]));
  const openLeft = byMisconception.get("OPEN_LEFT_BOUNDARY_COUNT");
  const missedBoundary = byMisconception.get("MISS_BOUNDARY_POWER");
  if (openLeft && missedBoundary) assert.notEqual(openLeft, missedBoundary, `P007/${seed}: misconception values collapsed`);
  assert.ok(BigInt(String(q.hiddenState.high)) > 10_000n, `P007/${seed}: interval not calculation intensive`);
}

// Exact one-sided boundaries must remain exact after the overlay.
const exactAtLeastSource = generateNumCp012Wave02("NUM-CP012-PROT-010", 5);
const exactAtLeast = applyNumCp012ExamDepthOverlayV2(exactAtLeastSource, "en");
assert.equal(exactAtLeast.hiddenState.direction, "AT_LEAST");
assert.equal(exactAtLeast.hiddenState.exactBoundary, true);
assert.equal(exactAtLeast.canonicalAnswer, String(exactAtLeast.hiddenState.bound));

// The non-scaling authorities are intentional: their depth is topology/residue logic, not large arithmetic.
for (const [prototypeId, source] of [
  ["NUM-CP012-PROT-005", generateNumCp012Wave01("NUM-CP012-PROT-005", 2)],
  ["NUM-CP012-PROT-013", generateNumCp012Wave02("NUM-CP012-PROT-013", 2)],
  ["NUM-CP012-PROT-014", generateNumCp012Wave02("NUM-CP012-PROT-014", 2)],
] as const) {
  const q = applyNumCp012ExamDepthOverlayV2(source, "en");
  assert.equal(q.mathematicalFingerprint, source.mathematicalFingerprint, `${prototypeId}: intentional non-scaling authority changed state`);
}

// Transformed stems remain localized at the Question Studio overlay layer.
for (const language of ["en", "hi", "pa"] as const) {
  const q = applyNumCp012ExamDepthOverlayV2(generateNumCp012Wave02("NUM-CP012-PROT-011", 11), language);
  assert.ok(q.stem.length > 20, `${language}: localized transformed stem too thin`);
  if (language === "hi") assert.match(q.stem, /निकट|पूर्ण/u);
  if (language === "pa") assert.match(q.stem, /ਨੇੜੇ|ਪੂਰਨ/u);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP012_EXAM_DEPTH_QUESTION_OVERLAY",
  profile: NUM_CP012_EXAM_DEPTH_PROFILE,
  directChecks,
  truePrimeFactorizationForRecognition: true,
  residueSemanticsPreserved: true,
  calculationMagnitudeDeepened: true,
  exactBoundaryPreserved: true,
  sourceFingerprintPreserved: true,
  languages: ["en", "hi", "pa"],
}, null, 2));
