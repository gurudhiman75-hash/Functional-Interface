import { exactKey } from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import {
  TRG_001_AUTHORITY_ALIGNED_IDS,
  authorityFamilyForTrg001Ql,
} from "./production-authority-runtime";
import {
  authorityCandidateFingerprint,
  generateAllAuthorityCandidateTrg001Questions,
  generateAuthorityCandidateTrg001Question,
} from "./production-authority-candidate-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerKey(answer: any) {
  if (answer.kind === "TEXT") return `T:${answer.value}`;
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const degrees = toDegrees(answer.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

assert(TRG_001_AUTHORITY_ALIGNED_IDS.length === 144, "Authority candidate must contain exactly 144 QL IDs.");
assert(new Set(TRG_001_AUTHORITY_ALIGNED_IDS).size === 144, "Authority candidate QL IDs must be unique.");
assert(TRG_001_AUTHORITY_ALIGNED_IDS[0] === "TRG-001-QL-001", "Authority IDs must begin at QL-001.");
assert(TRG_001_AUTHORITY_ALIGNED_IDS[143] === "TRG-001-QL-144", "Authority IDs must end at QL-144.");

const expectedFamilyCounts: Record<string, number> = {
  SIDE_ROLE_RECOGNITION: 4,
  DIRECT_SIDE_RATIO: 4,
  PYTHAGOREAN_THEN_RATIO: 4,
  SIDE_RECOVERY_FROM_RATIO: 4,
  DERIVED_RATIOS_FROM_ONE_RATIO: 6,
  RECIPROCAL_COMPARISON: 2,
  SINGLE_STANDARD_VALUE: 4,
  RECIPROCAL_STANDARD_VALUE: 4,
  STANDARD_PRODUCTS_QUOTIENTS: 5,
  STANDARD_POWERS: 3,
  STANDARD_SUMS_DIFFERENCES: 4,
  MIXED_STANDARD_EXPRESSION: 2,
  STANDARD_DOMAIN_COMPARISON: 2,
  DEGREE_RADIAN_CONVERSION: 4,
  COMPLEMENTARY_RELATIONS: 6,
  NINETY_ONEEIGHTY_REDUCTION: 5,
  TWOSEVENTY_THREESIXTY_REDUCTION: 3,
  QUADRANT_REFERENCE_SIGN: 3,
  MIXED_PERIODIC_REDUCTION: 3,
  PYTHAGOREAN_SIN_COS_IDENTITY: 4,
  SEC_TAN_IDENTITY: 3,
  COSEC_COT_IDENTITY: 3,
  RECIPROCAL_QUOTIENT_IDENTITY: 4,
  RATIONAL_IDENTITY_SIMPLIFICATION: 5,
  EXPRESSION_FROM_GIVEN_RATIO: 4,
  IDENTITY_EQUIVALENCE: 1,
  DERIVED_RATIO_EXPRESSION: 4,
  SEC_TAN_CONJUGATE: 4,
  COSEC_COT_CONJUGATE: 4,
  SIN_COS_SUM_DIFFERENCE: 4,
  LINEAR_SIN_COS_RELATION: 4,
  CONTROLLED_STANDARD_EQUATION: 4,
  MIXED_IDENTITY_EXPRESSION: 6,
  ANGLE_SUM_DIFFERENCE: 4,
  DOUBLE_ANGLE: 3,
  STANDARD_SERIES_PRODUCTS: 4,
  MAXIMUM_MINIMUM: 2,
  TRIANGLE_AREA_SINE: 2,
  EQUIVALENCE_VERIFICATION_COMPOSITE: 3,
};

const actualFamilyCounts: Record<string, number> = {};
for (const id of TRG_001_AUTHORITY_ALIGNED_IDS) {
  const family = authorityFamilyForTrg001Ql(id);
  actualFamilyCounts[family] = (actualFamilyCounts[family] ?? 0) + 1;
}
for (const [family, count] of Object.entries(expectedFamilyCounts)) {
  assert(actualFamilyCounts[family] === count, `${family} must contain exactly ${count} QLs.`);
}
assert(Object.keys(actualFamilyCounts).length === Object.keys(expectedFamilyCounts).length, "Unexpected authority family detected.");

const canonicalSeeds = Array.from({ length: 12 }, (_, index) => `trg-authority-canonical-${String(index + 1).padStart(2, "0")}`);
let canonicalCases = 0;
const sourceIds = new Set<string>();
const customIds = new Set<string>();
const solveModes = new Set<string>();
const cpCounts = new Map<string, number>();

for (const qlId of TRG_001_AUTHORITY_ALIGNED_IDS) {
  const stems = new Set<string>();
  for (const seed of canonicalSeeds) {
    const first = generateAuthorityCandidateTrg001Question(qlId, seed);
    const second = generateAuthorityCandidateTrg001Question(qlId, seed);

    assert(authorityCandidateFingerprint(first) === authorityCandidateFingerprint(second), `${qlId} is not deterministic for ${seed}.`);
    assert(first.qlId === qlId, `${qlId} lost its permanent QL ID.`);
    assert(first.authorityAlignment?.status === "ALIGNED", `${qlId} is not marked authority-aligned.`);
    assert(first.authorityAlignment?.family === authorityFamilyForTrg001Ql(qlId), `${qlId} carries the wrong Phase 0 family tag.`);
    assert(first.validation.valid, `${qlId} failed authority candidate validation.`);
    assert(first.verification.valid, `${qlId} failed independent/theorem verification.`);
    assert(first.options.length === 4, `${qlId} must have exactly four options.`);
    assert(first.options.filter((option: any) => option.isCorrect).length === 1, `${qlId} must have exactly one correct option.`);
    assert(new Set(first.options.map((option: any) => answerKey(option.value))).size === 4, `${qlId} has mathematically equivalent option duplicates.`);
    assert(new Set(first.options.map((option: any) => option.display)).size === 4, `${qlId} has duplicate rendered options.`);
    assert(first.correctIndex >= 0 && first.correctIndex < 4 && first.options[first.correctIndex]?.isCorrect === true, `${qlId} correctIndex is invalid.`);
    assert(first.reviewStatus === "UNREVIEWED", `${qlId} must be re-reviewed after authority reconciliation.`);
    assert(first.aiEditorialStatus === "PENDING", `${qlId} must remain AI-editorial pending after authority reconciliation.`);
    assert(first.humanReviewStatus === "PENDING", `${qlId} must remain human-review pending.`);
    assert(first.questionBankStatus === "NOT_STORED", `${qlId} must remain outside the question bank.`);
    assert(first.testEligibility === "INELIGIBLE", `${qlId} must remain test-ineligible.`);
    assert(!first.publiclyPublishable, `${qlId} must remain non-public.`);
    assert(!first.questionStudioDiscoverable, `${qlId} must remain hidden from Question Studio.`);
    assert(!/[{}]\\w+|\\{\\{/.test(first.stem), `${qlId} contains an unresolved placeholder.`);
    assert(!/\b(opposite|adjacent)\s*=/.test(first.stem), `${qlId} exposes internal assignment-style prose.`);

    const minimumSteps = first.difficulty === "Hard" ? 3 : first.difficulty === "Medium" ? 2 : 1;
    assert(first.explanation.steps.length >= minimumSteps, `${qlId} explanation is too shallow for ${first.difficulty}.`);
    assert(first.explanation.keyRule.length >= 10, `${qlId} key rule is too weak.`);

    stems.add(first.stem);
    solveModes.add(first.solveMode);
    cpCounts.set(first.cpId, (cpCounts.get(first.cpId) ?? 0) + (seed === canonicalSeeds[0] ? 1 : 0));
    if (seed === canonicalSeeds[0]) {
      if (String(first.authorityAlignment.source).startsWith("CUSTOM")) customIds.add(qlId);
      else {
        assert(typeof first.sourceQlId === "string", `${qlId} must retain its trace source QL.`);
        assert(!sourceIds.has(first.sourceQlId), `${qlId} reuses source template ${first.sourceQlId}; source reuse would create semantic duplication risk.`);
        sourceIds.add(first.sourceQlId);
      }
    }
    canonicalCases += 1;
  }
  assert(stems.size >= 2, `${qlId} did not produce at least two distinct stems across canonical seeds.`);
}

assert(customIds.size === 32, `Authority reconciliation must contain exactly 32 custom/missing-role QLs, found ${customIds.size}.`);
assert(sourceIds.size === 112, `Authority reconciliation must reuse exactly 112 unique trace templates, found ${sourceIds.size}.`);
assert(customIds.size + sourceIds.size === 144, "Every permanent QL must be either a unique trace reuse or a custom authority role.");
assert(solveModes.size === 144, `Authority candidate must expose 144 distinct solve modes, found ${solveModes.size}.`);
for (const cpId of ["TRG-CP-001","TRG-CP-002","TRG-CP-003","TRG-CP-004","TRG-CP-005","TRG-CP-006"]) {
  assert(cpCounts.get(cpId) === 24, `${cpId} must contain exactly 24 authority-aligned QLs.`);
}

const sweepSeeds = Array.from({ length: 50 }, (_, index) => `trg-authority-sweep-${String(index + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllAuthorityCandidateTrg001Questions(seed);
  assert(questions.length === 144, `Seed ${seed} did not generate all 144 authority-aligned QLs.`);
  for (const question of questions) {
    assert(question.validation.valid, `${question.qlId} failed authority sweep validation for ${seed}.`);
    assert(question.verification.valid, `${question.qlId} failed authority sweep verification for ${seed}.`);
    assert(question.options.length === 4, `${question.qlId} lost the four-option contract for ${seed}.`);
    assert(new Set(question.options.map((option: any) => answerKey(option.value))).size === 4, `${question.qlId} produced an equivalent option collision for ${seed}.`);
    assert(question.options[question.correctIndex]?.isCorrect === true, `${question.qlId} correctIndex failed for ${seed}.`);
    assert(question.authorityAlignment?.family === authorityFamilyForTrg001Ql(question.qlId), `${question.qlId} lost its authority family during sweep.`);
    assert(!question.publiclyPublishable && !question.questionStudioDiscoverable && question.testEligibility === "INELIGIBLE" && question.questionBankStatus === "NOT_STORED", `${question.qlId} activation lock failed for ${seed}.`);
    sweepCases += 1;
  }
}

console.log(`TRG-001 authority gates passed: 144 QLs, ${canonicalCases} canonical deterministic cases, ${sweepCases} sweep cases, 112 unique trace-template reuses and 32 custom authority roles.`);
