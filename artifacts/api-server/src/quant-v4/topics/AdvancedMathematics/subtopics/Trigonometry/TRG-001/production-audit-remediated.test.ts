import { exactKey } from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import {
  TRG_001_AUTHORITY_ALIGNED_IDS,
  authorityFamilyForTrg001Ql,
} from "./production-authority-runtime";
import {
  TRG_001_AUDIT_REMEDIATED_IDS,
  generateAllAuditRemediatedTrg001Questions,
  generateAuditRemediatedTrg001Question,
} from "./production-audit-remediated-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerKey(answer: any) {
  if (answer.kind === "TEXT") return `T:${answer.value}`;
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const degrees = toDegrees(answer.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

const expectedRemediated = [
  "TRG-001-QL-048",
  "TRG-001-QL-112",
  "TRG-001-QL-122",
  "TRG-001-QL-123",
  "TRG-001-QL-125",
  "TRG-001-QL-126",
  "TRG-001-QL-136",
  "TRG-001-QL-137",
  "TRG-001-QL-142",
];
assert(JSON.stringify(TRG_001_AUDIT_REMEDIATED_IDS) === JSON.stringify(expectedRemediated), "Audit remediation ID set changed unexpectedly.");

const canonicalSeeds = Array.from({ length: 12 }, (_, index) => `trg-audit-remediation-${String(index + 1).padStart(2, "0")}`);
let canonicalCases = 0;

for (const qlId of TRG_001_AUTHORITY_ALIGNED_IDS) {
  for (const seed of canonicalSeeds) {
    const question = generateAuditRemediatedTrg001Question(qlId, seed);
    assert(question.qlId === qlId, `${qlId} lost its permanent ID.`);
    assert(question.authorityAlignment?.family === authorityFamilyForTrg001Ql(qlId), `${qlId} lost its locked authority family.`);
    assert(question.validation?.valid === true, `${qlId} failed validation for ${seed}.`);
    assert(question.verification?.valid === true, `${qlId} failed independent/theorem verification for ${seed}.`);
    assert(question.options.length === 4, `${qlId} must have four options.`);
    assert(question.options.filter((option: any) => option.isCorrect).length === 1, `${qlId} must have one correct option.`);
    assert(new Set(question.options.map((option: any) => answerKey(option.value))).size === 4, `${qlId} has equivalent options.`);
    assert(question.options[question.correctIndex]?.isCorrect === true, `${qlId} correctIndex is invalid.`);
    const minimumSteps = question.difficulty === "Hard" ? 3 : question.difficulty === "Medium" ? 2 : 1;
    assert(question.explanation.steps.length >= minimumSteps, `${qlId} explanation depth is below its ${question.difficulty} floor.`);
    assert(question.reviewStatus === "UNREVIEWED", `${qlId} must remain re-review pending after remediation.`);
    assert(question.aiEditorialStatus === "PENDING", `${qlId} must remain AI-editorial pending after remediation.`);
    assert(question.humanReviewStatus === "PENDING", `${qlId} must remain human-review pending.`);
    assert(question.questionBankStatus === "NOT_STORED", `${qlId} must remain outside the question bank.`);
    assert(question.testEligibility === "INELIGIBLE", `${qlId} must remain test-ineligible.`);
    assert(!question.publiclyPublishable && !question.questionStudioDiscoverable, `${qlId} activation lock failed.`);
    canonicalCases += 1;
  }
}

// Critical blocker regression: these IDs previously failed their own Hard explanation-depth contract.
for (const seed of canonicalSeeds) {
  const q112 = generateAuditRemediatedTrg001Question("TRG-001-QL-112", seed);
  assert(q112.difficulty === "Hard" && q112.explanation.steps.length >= 3, "QL-112 Hard explanation-depth blocker regressed.");

  const q137 = generateAuditRemediatedTrg001Question("TRG-001-QL-137", seed);
  assert(q137.difficulty === "Medium" && q137.explanation.steps.length >= 2, "QL-137 difficulty/depth remediation regressed.");
}

// CP-006 family leakage regression: mixed-identity slots must no longer be angle-sum or double-angle re-labels.
for (const qlId of ["TRG-001-QL-122", "TRG-001-QL-123", "TRG-001-QL-125", "TRG-001-QL-126"]) {
  const modes = new Set(canonicalSeeds.map((seed) => generateAuditRemediatedTrg001Question(qlId, seed).solveMode));
  assert([...modes].every((mode) => !/AngleSum|AngleDifference|DoubleAngle|SeventyFive|Fifteen/i.test(mode)), `${qlId} leaked back into angle-sum/double-angle semantics.`);
  assert(modes.size >= 2, `${qlId} must expose at least two meaningful audit-remediated mathematical variants.`);
}

// Domain/comparison slot must differ semantically from the neighbouring tan90 undefined-value question.
for (const seed of canonicalSeeds) {
  const q48 = generateAuditRemediatedTrg001Question("TRG-001-QL-048", seed);
  assert(q48.solveMode === "identifyDefinedStandardDomainValue", "QL-048 must remain a definedness-comparison role.");
  assert(q48.answer === "cosec 90°", "QL-048 definedness answer changed unexpectedly.");
}

// Standard-series difficulty calibration and actual state diversity.
for (const qlId of ["TRG-001-QL-136", "TRG-001-QL-137"]) {
  const questions = canonicalSeeds.map((seed) => generateAuditRemediatedTrg001Question(qlId, seed));
  assert(questions.every((question) => question.difficulty === "Medium"), `${qlId} must remain Medium after difficulty recalibration.`);
  assert(new Set(questions.map((question) => question.solveMode)).size >= 2, `${qlId} must expose at least two mathematical variants, not wording-only diversity.`);
}

// Terminal composite slot must require multi-identity simplification, not simple formula recognition.
for (const seed of canonicalSeeds) {
  const q142 = generateAuditRemediatedTrg001Question("TRG-001-QL-142", seed);
  assert(q142.difficulty === "Hard", "QL-142 terminal composite role must remain Hard.");
  assert(q142.explanation.steps.length >= 3, "QL-142 composite explanation must be multi-step.");
  assert(/CompositeEquivalence/i.test(q142.verification.method), "QL-142 must remain a composite-equivalence verification role.");
}

const sweepSeeds = Array.from({ length: 50 }, (_, index) => `trg-audit-remediation-sweep-${String(index + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllAuditRemediatedTrg001Questions(seed);
  assert(questions.length === 144, `${seed} did not generate all 144 QLs.`);
  for (const question of questions) {
    assert(question.validation?.valid === true, `${question.qlId} failed sweep validation for ${seed}.`);
    assert(question.verification?.valid === true, `${question.qlId} failed sweep verification for ${seed}.`);
    assert(question.options.length === 4, `${question.qlId} lost four-option integrity for ${seed}.`);
    assert(new Set(question.options.map((option: any) => answerKey(option.value))).size === 4, `${question.qlId} produced equivalent options for ${seed}.`);
    assert(question.options[question.correctIndex]?.isCorrect === true, `${question.qlId} correctIndex failed for ${seed}.`);
    assert(!question.publiclyPublishable && !question.questionStudioDiscoverable && question.testEligibility === "INELIGIBLE" && question.questionBankStatus === "NOT_STORED", `${question.qlId} activation lock failed for ${seed}.`);
    sweepCases += 1;
  }
}

console.log(`TRG-001 audit-remediation gates passed: 144 QLs, ${canonicalCases} canonical cases and ${sweepCases} sweep cases; ${TRG_001_AUDIT_REMEDIATED_IDS.length} permanent IDs remediated.`);
