import { compare, divide, rational } from "../foundation/rational";
import { TSD_CP006_AUTHORITY_APPROVAL, TSD_CP006_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";
import { TSD_CP006_PERMANENT_QL_ALLOCATIONS, TSD_CP006_NEXT_PERMANENT_QL_ID } from "./ql-allocation";
import { generateCp006EnglishReviewSetV1 } from "./english-review-runtime-v1";
import { independentlyVerifyCp006 } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateCp006EnglishReviewSetV1(6);

assert(TSD_CP006_AUTHORITY_APPROVAL.status === "PRODUCT_OWNER_APPROVED_AUTHORITY_BOUNDARY", "CP006 authority approval missing");
assert(TSD_CP006_AUTHORITY_APPROVAL.approvedSourceHead === "040099d1e03f3f484a7d0c14d25d76bcab5f2274", "CP006 authority approval source head drifted");
assert(TSD_CP006_APPROVED_LEARNER_AUTHORITIES.length === 13, "CP006 approved learner authority count must remain 13");
assert(TSD_CP006_PERMANENT_QL_ALLOCATIONS.length === 13, "CP006 QL allocation count must remain 13");
assert(TSD_CP006_PERMANENT_QL_ALLOCATIONS[0]?.permanentQlId === "TSD-QL-071", "CP006 QL range must start at TSD-QL-071");
assert(TSD_CP006_PERMANENT_QL_ALLOCATIONS[12]?.permanentQlId === "TSD-QL-083", "CP006 QL range must end at TSD-QL-083");
assert(TSD_CP006_NEXT_PERMANENT_QL_ID === "TSD-QL-084", "CP006 next QL must be TSD-QL-084");
assert(rows.length === 78, `CP006 English V1 expected 78 rows, found ${rows.length}`);

const qls = new Set(rows.map((row) => row.permanentQlId));
assert(qls.size === 13, `CP006 English V1 expected 13 QLs, found ${qls.size}`);

for (const allocation of TSD_CP006_PERMANENT_QL_ALLOCATIONS) {
  const subset = rows.filter((row) => row.permanentQlId === allocation.permanentQlId);
  assert(subset.length === 6, `${allocation.permanentQlId}: expected six learner rows`);
  assert(new Set(subset.map((row) => row.stem)).size === 6, `${allocation.permanentQlId}: stems must be unique within the six-row review set`);
  assert(subset.every((row) => row.authorityKey === allocation.authorityKey), `${allocation.permanentQlId}: authority mapping drifted`);
}

let independentChecks = 0;
for (const row of rows) {
  assert(row.options.length === 4, `${row.permanentQlId}/${row.seed}: expected four options`);
  assert(new Set(row.options).size === 4, `${row.permanentQlId}/${row.seed}: duplicate options`);
  assert(row.correctIndex >= 0 && row.correctIndex < 4, `${row.permanentQlId}/${row.seed}: invalid correct index`);
  assert(row.options[row.correctIndex] === row.answerText, `${row.permanentQlId}/${row.seed}: correct option identity mismatch`);
  assert(row.explanation.steps.length === 2, `${row.permanentQlId}/${row.seed}: explanation must have exactly two steps`);
  assert(row.explanation.steps.every((step) => step.trim().length >= 25), `${row.permanentQlId}/${row.seed}: explanation step is too thin`);
  assert(row.validation.valid === true && row.validation.errors.length === 0, `${row.permanentQlId}/${row.seed}: learner validation must be clean`);
  const verified = independentlyVerifyCp006(row.solveMode, row.input, row.solution);
  assert(verified.valid, `${row.permanentQlId}/${row.seed}: independent verifier rejected learner row: ${verified.errors.join("; ")}`);
  independentChecks += 1;
  assert(row.lifecycle.englishFreezeStatus === "UNFROZEN", `${row.permanentQlId}: English freeze must remain UNFROZEN`);
  assert(row.lifecycle.questionStudioEnabled === false, `${row.permanentQlId}: CP006 must not be Studio-enabled`);
  assert(row.lifecycle.questionBankStatus === "NOT_STORED", `${row.permanentQlId}: CP006 must not be stored in Question Bank`);
  assert(row.lifecycle.testEligibility === "INELIGIBLE", `${row.permanentQlId}: CP006 must remain test-ineligible`);
  assert(row.lifecycle.publiclyPublishable === false, `${row.permanentQlId}: CP006 must remain unpublished`);
}

const ql081 = rows.filter((row) => row.permanentQlId === "TSD-QL-081");
assert(ql081.length === 6, "QL081 review set missing");
for (const row of ql081) {
  const L = row.input.trackLength!;
  const gap = row.input.startPositionB!;
  assert(compare(gap, divide(L, rational(2))) > 0, `${row.seed}: QL081 must use a wrap-sensitive arc exceeding half a lap`);
  assert(row.stem.toLowerCase().includes("full lap") || row.stem.toLowerCase().includes("wrap"), `${row.seed}: QL081 learner wording must signal the circular wrap state`);
}

const ql082 = rows.filter((row) => row.permanentQlId === "TSD-QL-082");
assert(ql082.length === 6, "QL082 review set missing");
for (const row of ql082) {
  const lapTimeEarly = divide(row.input.trackLength!, row.input.speedA!);
  assert(compare(row.input.startDelayB!, lapTimeEarly) > 0, `${row.seed}: QL082 early vehicle must complete at least one lap before B starts`);
  assert(row.stem.toLowerCase().includes("at least one lap"), `${row.seed}: QL082 learner wording must make the completed-lap state explicit`);
}

const difficultyCounts = rows.reduce((acc, row) => {
  acc[row.difficulty] = (acc[row.difficulty] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);
assert((difficultyCounts.EASY ?? 0) >= 14, "CP006 English V1 needs meaningful EASY coverage");
assert((difficultyCounts.MEDIUM ?? 0) >= 30, "CP006 English V1 needs meaningful MEDIUM coverage");
assert((difficultyCounts.HARD ?? 0) >= 18, "CP006 English V1 needs meaningful HARD coverage");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_ENGLISH_REVIEW_CANDIDATE_V1",
  authorityApprovalHead: TSD_CP006_AUTHORITY_APPROVAL.approvedSourceHead,
  permanentQlRange: "TSD-QL-071..TSD-QL-083",
  nextPermanentQl: TSD_CP006_NEXT_PERMANENT_QL_ID,
  reviewRows: rows.length,
  rowsPerQl: 6,
  independentVerifierChecks: independentChecks,
  difficultyCounts,
  ql081WrapSensitiveRows: ql081.length,
  ql082PostLapDelayedStartRows: ql082.length,
  explanationStepsPerQuestion: 2,
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  nextGate: "LEARNER_EDITORIAL_AND_DISTRACTOR_AUDIT_BEFORE_ENGLISH_APPROVAL",
}, null, 2));
