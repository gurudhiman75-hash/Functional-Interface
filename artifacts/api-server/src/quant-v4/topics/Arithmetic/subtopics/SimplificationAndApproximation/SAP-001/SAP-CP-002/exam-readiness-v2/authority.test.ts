import assert from "node:assert/strict";
import {
  SAP_CP002_EXAM_READINESS_V2_STATE,
} from "./runtime";
import {
  generateSapCp002FinalExamReadinessV2Sweep,
} from "./final-runtime";
import {
  generateSapCp002ExamReadinessV2ReviewPackages,
  generateSapCp002ExamReadinessV2ReviewRecords,
  SAP_CP002_V2_REVIEW_TARGETS,
} from "./review-export";

const sweep = generateSapCp002FinalExamReadinessV2Sweep(100);
assert.equal(sweep.length, 1_900);

const banned = /(?:the denominator work is kept exact throughout|quick substitution or reverse calculation|therefore the exact answer remains|greatest common factor leaves the value unchanged)/i;
const difficultyCounts = new Map<string, number>();
const difficultyByQl = new Map<string, Set<string>>();
const answerPositionsByQl = new Map<string, Set<number>>();
const diagnosisAnswers = new Set<string>();
const diagnosisFamilies = new Set<string>();
let selectionWithEquivalentUnreduced = 0;
let selectionWithoutEquivalentUnreduced = 0;
let comparisonCount = 0;
let diagnosisCount = 0;
let missingNumeratorCount = 0;
let missingDenominatorCount = 0;

for (const pkg of sweep) {
  assert.equal(pkg.validation.ok, true, `${pkg.temporaryPrototypeId} seed ${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.canonicalAnswer, pkg.verifierAnswer);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.isCorrect, true);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.equal(pkg.validation.fullConditionCorrectOptionCount, 1);
  assert.equal(new Set(pkg.validation.sentenceHashes).size, pkg.validation.sentenceHashes.length);
  assert.ok(pkg.validation.explanationWordCount <= 150);
  assert.doesNotMatch([
    pkg.explanation.coreConcept,
    pkg.explanation.givenDataAndStrategy,
    ...pkg.explanation.stepByStep,
    pkg.explanation.examSpeedMethod,
    ...pkg.explanation.commonTraps,
    pkg.explanation.finalAnswer,
  ].join(" "), banned);
  assert.equal(pkg.explanation.commonTraps.length, 3);
  assert.ok(pkg.explanation.stepByStep.length >= 2);
  assert.equal(pkg.editorialStatus, "EDITORIALLY_UNFROZEN_REMODELED_V2");
  assert.equal(pkg.reviewDecision, "AUTO_VALIDATED_HUMAN_REVIEW_PENDING");
  assert.equal(pkg.humanReviewStatus, "PENDING");
  assert.equal(pkg.reviewVersion, "SAP_CP002_EXAM_READINESS_V2");
  assert.equal(pkg.lifecycle.contentStatus, "EDITORIALLY_UNFROZEN_V2_HUMAN_REVIEW_PENDING");
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);

  difficultyCounts.set(pkg.difficulty, (difficultyCounts.get(pkg.difficulty) ?? 0) + 1);
  const qlDifficulties = difficultyByQl.get(pkg.permanentQlId) ?? new Set<string>();
  qlDifficulties.add(pkg.difficulty);
  difficultyByQl.set(pkg.permanentQlId, qlDifficulties);
  const positions = answerPositionsByQl.get(pkg.permanentQlId) ?? new Set<number>();
  positions.add(pkg.correctIndex);
  answerPositionsByQl.set(pkg.permanentQlId, positions);

  if (pkg.permanentQlId === "SAP-QL-020") {
    assert.equal(pkg.solveModeLabel, "Integer with grouped fraction operation");
  }
  if (pkg.temporaryPrototypeId === "SAP-CP002-PROT-MISSING-NUMERATOR") {
    missingNumeratorCount += 1;
    assert.equal(pkg.solveModeSubtype, "MISSING_NUMERATOR");
    assert.equal(pkg.solveModeLabel, "Missing numerator");
  }
  if (pkg.temporaryPrototypeId === "SAP-CP002-PROT-MISSING-DENOMINATOR") {
    missingDenominatorCount += 1;
    assert.equal(pkg.solveModeSubtype, "MISSING_DENOMINATOR");
    assert.equal(pkg.solveModeLabel, "Missing denominator");
  }
  if (pkg.permanentQlId === "SAP-QL-031") {
    comparisonCount += 1;
    assert.doesNotMatch(pkg.stem, /\+\s*(\d+\/\d+)\s*[−-]\s*\1/);
    assert.doesNotMatch(pkg.options.map((option) => option.value).join(" "), /Cannot be determined/i);
    assert.match(pkg.canonicalAnswer, /^A [<>=] B$/);
    assert.match(pkg.explanation.finalAnswer, /^Hence, A [<>=] B\.$/);
  }
  if (pkg.permanentQlId === "SAP-QL-032") {
    assert.equal(pkg.options.filter((option) => option.satisfiesRequiredForm).length, 1);
    assert.ok(pkg.validation.numericEquivalentOptionCount === 1 || pkg.validation.numericEquivalentOptionCount === 2);
    if (pkg.validation.numericEquivalentOptionCount === 2) {
      selectionWithEquivalentUnreduced += 1;
      assert.match(pkg.explanation.stepByStep.join(" "), /lowest terms/i);
    } else {
      selectionWithoutEquivalentUnreduced += 1;
    }
  }
  if (pkg.permanentQlId === "SAP-QL-033") {
    diagnosisCount += 1;
    diagnosisAnswers.add(pkg.canonicalAnswer);
    diagnosisFamilies.add(pkg.explanation.methodId.split("_").slice(0, 2).join("_"));
    assert.match(pkg.stem, /Given:/);
    assert.doesNotMatch(pkg.stem, /^Step 1:/m);
    assert.deepEqual(new Set(pkg.options.map((option) => option.value)), new Set(["Step 1", "Step 2", "Step 3", "No error"]));
    assert.doesNotMatch(pkg.explanation.finalAnswer, /numerator and denominator|greatest common factor/i);
  }
}

assert.equal(missingNumeratorCount, 100);
assert.equal(missingDenominatorCount, 100);
assert.equal(comparisonCount, 100);
assert.equal(diagnosisCount, 100);
assert.deepEqual([...diagnosisAnswers].sort(), ["No error", "Step 1", "Step 2", "Step 3"]);
assert.ok(diagnosisFamilies.size >= 5);
assert.ok(selectionWithEquivalentUnreduced > 0);
assert.ok(selectionWithoutEquivalentUnreduced > 0);
assert.deepEqual([...difficultyCounts.keys()].sort(), ["EASY", "HARD", "MEDIUM"]);
for (const [qlId, difficulties] of difficultyByQl) {
  assert.ok(difficulties.size >= 2, `${qlId} does not demonstrate structural difficulty variation.`);
  assert.deepEqual([...answerPositionsByQl.get(qlId)!].sort(), [0, 1, 2, 3]);
}

const reviewPackages = generateSapCp002ExamReadinessV2ReviewPackages();
const reviewRecords = generateSapCp002ExamReadinessV2ReviewRecords();
assert.equal(reviewPackages.length, 300);
assert.equal(reviewRecords.length, 300);
assert.equal(new Set(reviewRecords.map((record) => record.questionId)).size, 300);
assert.equal(new Set(reviewRecords.map((record) => record.payloadFingerprint)).size, 300);
assert.ok(reviewRecords.every((record) => record.validation.ok));
assert.ok(reviewRecords.every((record) => record.humanReviewStatus === "PENDING"));

const reviewCountByQl = new Map<string, number>();
const fingerprintByQl = new Map<string, Set<string>>();
for (const record of reviewRecords) {
  reviewCountByQl.set(record.permanentQlId, (reviewCountByQl.get(record.permanentQlId) ?? 0) + 1);
  const fingerprints = fingerprintByQl.get(record.permanentQlId) ?? new Set<string>();
  fingerprints.add(record.payloadFingerprint);
  fingerprintByQl.set(record.permanentQlId, fingerprints);
}
for (const [qlId, target] of Object.entries(SAP_CP002_V2_REVIEW_TARGETS)) {
  assert.equal(reviewCountByQl.get(qlId), target);
  assert.equal(fingerprintByQl.get(qlId)?.size, target);
}

const reviewDifficultyCounts = Object.fromEntries(
  ["EASY", "MEDIUM", "HARD"].map((difficulty) => [
    difficulty,
    reviewRecords.filter((record) => record.difficulty === difficulty).length,
  ]),
);
assert.notDeepEqual(reviewDifficultyCounts, { EASY: 90, MEDIUM: 150, HARD: 60 }, "The old quota-driven split must not survive v2.");

assert.equal(SAP_CP002_EXAM_READINESS_V2_STATE.permanentIdentityPolicy, "RETAIN_SAP_QL_017_TO_033");
assert.equal(SAP_CP002_EXAM_READINESS_V2_STATE.editorialState, "UNFROZEN_REMODELED_V2_HUMAN_REVIEW_PENDING");
assert.equal(SAP_CP002_EXAM_READINESS_V2_STATE.questionStudioDiscoverable, false);
assert.equal(SAP_CP002_EXAM_READINESS_V2_STATE.questionBankWritable, false);
assert.equal(SAP_CP002_EXAM_READINESS_V2_STATE.testEligible, false);
assert.equal(SAP_CP002_EXAM_READINESS_V2_STATE.publiclyPublishable, false);

console.log(JSON.stringify({
  status: "PASS_SAP_CP002_EXAM_READINESS_V2_AUTHORITY",
  sweptPackages: sweep.length,
  reviewRecords: reviewRecords.length,
  reviewDifficultyCounts,
  sweepDifficultyCounts: Object.fromEntries(difficultyCounts),
  selectionWithEquivalentUnreduced,
  selectionWithoutEquivalentUnreduced,
  diagnosisAnswers: [...diagnosisAnswers].sort(),
  diagnosisFamilies: diagnosisFamilies.size,
  permanentRange: "SAP-QL-017..SAP-QL-033",
  humanReviewStatus: "PENDING",
  questionStudio: "DISABLED",
  questionBank: "DISABLED",
  testEligibility: "DISABLED",
  publicPublication: "DISABLED",
}, null, 2));
