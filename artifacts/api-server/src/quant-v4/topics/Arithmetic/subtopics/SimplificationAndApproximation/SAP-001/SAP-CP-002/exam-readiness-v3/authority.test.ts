import assert from "node:assert/strict";
import {
  SAP_CP002_EXAM_READINESS_V3_STATE,
  generateSapCp002ExamReadinessV3Sweep,
} from "./runtime";
import {
  SAP_CP002_V3_REVIEW_TARGETS,
  generateSapCp002ExamReadinessV3ReviewPackages,
  generateSapCp002ExamReadinessV3ReviewRecords,
} from "./review-export";

function hasPerfectPeriod(sequence: readonly number[], maxPeriod = 8): boolean {
  for (let period = 1; period <= Math.min(maxPeriod, Math.floor(sequence.length / 3)); period += 1) {
    let matches = true;
    for (let index = period; index < sequence.length; index += 1) {
      if (sequence[index] !== sequence[index % period]) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  return false;
}

function repeatedNgramRatio(sequence: readonly number[], size: number): number {
  if (sequence.length < size) return 0;
  const counts = new Map<string, number>();
  for (let index = 0; index <= sequence.length - size; index += 1) {
    const key = sequence.slice(index, index + size).join("-");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const repeated = [...counts.values()].filter((count) => count > 1)
    .reduce((sum, count) => sum + count - 1, 0);
  return repeated / Math.max(1, sequence.length - size + 1);
}

const sweep = generateSapCp002ExamReadinessV3Sweep(100);
assert.equal(sweep.length, 1_900);

const identities = new Set<string>();
const positionsByQl = new Map<string, number[]>();
const positionsByPrototype = new Map<string, number[]>();
const difficultyByCanonical = new Map<string, { score: number; difficulty: string }>();
const ql020Subtypes = new Map<string, number>();
const diagnosisAnswers = new Set<string>();
let ql017Distractors = 0;
let ql018Packages = 0;
let canonicalRepeats = 0;

for (const pkg of sweep) {
  assert.equal(pkg.validation.ok, true, `${pkg.temporaryPrototypeId}/${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.isCorrect, true);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.options.every((option, index) => option.displayIndex === index + 1));
  assert.ok(pkg.options.filter((option) => !option.isCorrect).every((option) => option.reproducibleFromVisibleStem));
  assert.equal(pkg.explanation.provenanceStatus, "VISIBLE_OPERANDS_ONLY");
  assert.ok(pkg.explanation.visibleOperandSet.every((operand) => pkg.stem.includes(operand)));
  assert.equal(pkg.editorialStatus, "EDITORIALLY_UNFROZEN_REMODELED_V3");
  assert.equal(pkg.reviewDecision, "AUTO_VALIDATED_HUMAN_REVIEW_PENDING");
  assert.equal(pkg.humanReviewStatus, "PENDING");
  assert.equal(pkg.reviewVersion, "SAP_CP002_EXAM_READINESS_V3");
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);
  assert.ok(!identities.has(pkg.generationIdentity), `Duplicate generation identity: ${pkg.generationIdentity}`);
  identities.add(pkg.generationIdentity);

  if (pkg.permanentQlId === "SAP-QL-031") {
    assert.equal(pkg.answerSemanticValue, pkg.sourceCanonicalAnswer);
    assert.ok(pkg.options.every((option) => /because/i.test(option.value)));
    assert.doesNotMatch(pkg.options.map((option) => option.value).join(" "), /cannot be determined/i);
  } else {
    assert.equal(pkg.canonicalAnswer, pkg.sourceCanonicalAnswer);
  }

  const oldDifficulty = difficultyByCanonical.get(pkg.canonicalPayloadKey);
  if (oldDifficulty) {
    canonicalRepeats += 1;
    assert.deepEqual(
      { score: pkg.difficultyScore, difficulty: pkg.difficulty },
      oldDifficulty,
      `${pkg.canonicalPayloadKey} has unstable semantic difficulty.`,
    );
  } else {
    difficultyByCanonical.set(pkg.canonicalPayloadKey, {
      score: pkg.difficultyScore,
      difficulty: pkg.difficulty,
    });
  }

  const qlPositions = positionsByQl.get(pkg.permanentQlId) ?? [];
  qlPositions.push(pkg.correctIndex);
  positionsByQl.set(pkg.permanentQlId, qlPositions);
  const prototypePositions = positionsByPrototype.get(pkg.temporaryPrototypeId) ?? [];
  prototypePositions.push(pkg.correctIndex);
  positionsByPrototype.set(pkg.temporaryPrototypeId, prototypePositions);

  if (pkg.permanentQlId === "SAP-QL-017") {
    const visibleFractionOccurrences = pkg.stem.match(/[−-]?\d+\s+\d+\/\d+|[−-]?\d+\/\d+/g) ?? [];
    assert.ok(visibleFractionOccurrences.length >= 2, `${pkg.generationIdentity} lacks two visible operand occurrences.`);
    for (const option of pkg.options.filter((option) => !option.isCorrect)) {
      ql017Distractors += 1;
      assert.ok(option.routeOperands.length >= 1);
      assert.ok(option.routeOperands.every((operand) => pkg.stem.includes(operand)));
      assert.ok(option.misconceptionId !== null);
    }
  }
  if (pkg.permanentQlId === "SAP-QL-018") {
    ql018Packages += 1;
    assert.equal(pkg.explanation.methodId, "VISIBLE_CROSS_CANCELLATION_V3");
    assert.match(pkg.explanation.stepByStep.join(" "), /×/);
    assert.doesNotMatch(pkg.explanation.stepByStep.join(" "), /numbers? (?:absent|not shown)|unintroduced/i);
  }
  if (pkg.permanentQlId === "SAP-QL-020") {
    ql020Subtypes.set(pkg.solveModeSubtype, (ql020Subtypes.get(pkg.solveModeSubtype) ?? 0) + 1);
  }
  if (pkg.permanentQlId === "SAP-QL-032") {
    assert.equal(pkg.validation.fullConditionCorrectOptionCount, 1);
  }
  if (pkg.permanentQlId === "SAP-QL-033") {
    diagnosisAnswers.add(pkg.canonicalAnswer);
    assert.match(pkg.stem, /Given:/);
    assert.deepEqual(new Set(pkg.options.map((option) => option.value)), new Set(["Step 1", "Step 2", "Step 3", "No error"]));
  }
}

assert.equal(identities.size, 1_900);
assert.equal(ql017Distractors, 300);
assert.equal(ql018Packages, 100);
assert.equal(ql020Subtypes.get("FRACTION_OPERATION_CHAIN"), 100);
assert.equal(ql020Subtypes.get("INTEGER_WITH_FRACTIONAL_PRODUCT"), 100);
assert.deepEqual([...diagnosisAnswers].sort(), ["No error", "Step 1", "Step 2", "Step 3"]);
assert.ok(canonicalRepeats > 0, "The sweep should exercise difficulty invariance across repeated semantic payloads.");

for (const [qlId, sequence] of positionsByQl) {
  assert.deepEqual([...new Set(sequence)].sort(), [0, 1, 2, 3], `${qlId} does not use all four answer positions.`);
  assert.equal(hasPerfectPeriod(sequence), false, `${qlId} exposes a perfect answer-position period.`);
  assert.ok(repeatedNgramRatio(sequence, 4) < 0.55, `${qlId} repeats too many answer-position 4-grams.`);
}
for (const [prototypeId, sequence] of positionsByPrototype) {
  assert.deepEqual([...new Set(sequence)].sort(), [0, 1, 2, 3], `${prototypeId} does not use all four answer positions.`);
  assert.equal(hasPerfectPeriod(sequence), false, `${prototypeId} exposes a perfect answer-position period.`);
}

const reviewPackages = generateSapCp002ExamReadinessV3ReviewPackages();
const reviewRecords = generateSapCp002ExamReadinessV3ReviewRecords();
assert.equal(reviewPackages.length, 300);
assert.equal(reviewRecords.length, 300);
assert.equal(new Set(reviewRecords.map((record) => record.questionId)).size, 300);
assert.equal(new Set(reviewRecords.map((record) => record.canonicalPayloadKey)).size, 300);
assert.equal(new Set(reviewRecords.map((record) => record.payloadFingerprint)).size, 300);
assert.equal(new Set(reviewRecords.map((record) => record.generationIdentity)).size, 300);
assert.ok(reviewRecords.every((record) => record.validation.ok));
assert.ok(reviewRecords.every((record) => record.humanReviewStatus === "PENDING"));
assert.equal(hasPerfectPeriod(reviewRecords.map((record) => record.correctIndex)), false);

const reviewCountByQl = new Map<string, number>();
const subtypeByQl = new Map<string, Set<string>>();
for (const record of reviewRecords) {
  reviewCountByQl.set(record.permanentQlId, (reviewCountByQl.get(record.permanentQlId) ?? 0) + 1);
  const subtypes = subtypeByQl.get(record.permanentQlId) ?? new Set<string>();
  subtypes.add(record.solveModeSubtype);
  subtypeByQl.set(record.permanentQlId, subtypes);
}
for (const [qlId, target] of Object.entries(SAP_CP002_V3_REVIEW_TARGETS)) {
  assert.equal(reviewCountByQl.get(qlId), target);
}
assert.deepEqual(
  [...(subtypeByQl.get("SAP-QL-020") ?? new Set())].sort(),
  ["FRACTION_OPERATION_CHAIN", "INTEGER_WITH_FRACTIONAL_PRODUCT"],
);

assert.equal(SAP_CP002_EXAM_READINESS_V3_STATE.permanentIdentityPolicy, "RETAIN_SAP_QL_017_TO_033");
assert.equal(SAP_CP002_EXAM_READINESS_V3_STATE.questionStudioDiscoverable, false);
assert.equal(SAP_CP002_EXAM_READINESS_V3_STATE.questionBankWritable, false);
assert.equal(SAP_CP002_EXAM_READINESS_V3_STATE.testEligible, false);
assert.equal(SAP_CP002_EXAM_READINESS_V3_STATE.publiclyPublishable, false);

const difficultyCounts = Object.fromEntries(["EASY", "MEDIUM", "HARD"].map((difficulty) => [
  difficulty,
  reviewRecords.filter((record) => record.difficulty === difficulty).length,
]));
console.log(JSON.stringify({
  status: "PASS_SAP_CP002_EXAM_READINESS_V3_AUTHORITY",
  sweptPackages: sweep.length,
  distinctCanonicalPayloads: difficultyByCanonical.size,
  canonicalRepeats,
  generationIdentities: identities.size,
  ql017DistractorsReexecuted: ql017Distractors,
  reviewRecords: reviewRecords.length,
  reviewDifficultyCounts: difficultyCounts,
  ql020Subtypes: Object.fromEntries(ql020Subtypes),
  lifecycle: "INACTIVE_HUMAN_REVIEW_PENDING",
}, null, 2));
