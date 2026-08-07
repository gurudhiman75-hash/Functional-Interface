import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP003_FINAL_REGISTRY } from "./cp003-exam-model";
import {
  INT_CP003_QL_IDS,
  generateIntCp003ExamQuestion,
  type IntCp003ExamQuestion,
} from "./cp003-exam-runtime";
import {
  INT_CP003_ENGLISH_FREEZE_APPROVAL,
  INT_CP003_ENGLISH_FREEZE_ID,
  INT_CP003_ENGLISH_FROZEN_REGISTRY,
} from "./cp003-english-freeze-authority";
import {
  generateIntCp003EnglishFrozenQuestion,
  type IntCp003EnglishFrozenQuestion,
} from "./cp003-english-frozen-runtime";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function serializable(value: unknown): unknown {
  return JSON.parse(stable(value));
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function fail(message: string): never {
  throw new Error(message);
}

function contentProjection(
  question: IntCp003ExamQuestion | IntCp003EnglishFrozenQuestion,
): unknown {
  const record = serializable(question) as Record<string, unknown>;
  for (const key of [
    "editorialStatus",
    "approvalStatus",
    "freezeId",
    "sourceGeneratorVersion",
    "allocationStatus",
    "permanentIdentityFrozen",
    "learnerContentFrozen",
    "approval",
    "frozenRegistry",
    "lifecycle",
  ]) delete record[key];
  return record;
}

function assertDeepFrozen(
  value: unknown,
  path: string,
  seen = new WeakSet<object>(),
): number {
  if (typeof value !== "object" || value === null) return 0;
  if (seen.has(value)) return 0;
  seen.add(value);
  if (!Object.isFrozen(value)) fail(`${path}: frozen runtime contains a mutable object.`);
  let checked = 1;
  for (const key of Reflect.ownKeys(value)) {
    checked += assertDeepFrozen(
      (value as Record<PropertyKey, unknown>)[key],
      `${path}.${String(key)}`,
      seen,
    );
  }
  return checked;
}

if (INT_CP003_ENGLISH_FREEZE_APPROVAL.approvalAuthority !== "EXPLICIT_USER_EDITORIAL_SIGN_OFF") {
  fail("INT-CP-003 English freeze lacks explicit product-owner approval.");
}
if (INT_CP003_ENGLISH_FREEZE_APPROVAL.approvalCommentId !== 5211491612) {
  fail("INT-CP-003 English freeze approval comment changed.");
}
if (INT_CP003_ENGLISH_FREEZE_APPROVAL.approvedSourceHead !== "f9b48eb776b644c81f1e7ad0ff5a3707511658f1") {
  fail("INT-CP-003 approved source head changed.");
}
if (INT_CP003_QL_IDS.length !== 14 || INT_CP003_ENGLISH_FROZEN_REGISTRY.length !== 14) {
  fail("INT-CP-003 frozen QL count is not 14.");
}

const registryDigest = sha256(stable(INT_CP003_FINAL_REGISTRY));
if (registryDigest !== INT_CP003_ENGLISH_FREEZE_APPROVAL.approvedRegistrySha256) {
  fail(`Approved registry digest changed: ${registryDigest}.`);
}

let runtimeQuestions = 0;
let deterministicChecks = 0;
let contentIdentityChecks = 0;
let lifecycleChecks = 0;
let frozenObjectChecks = 0;
let mutationGuardChecks = 0;
const answerPositions = [0, 0, 0, 0];
const observedDifficulties = new Set<string>();
const observedAnswerSemantics = new Set<string>();
const observedRates = new Set<string>();
const observedRepresentations = new Set<string>();

for (const qlId of INT_CP003_QL_IDS) {
  const frozenRegistry = INT_CP003_ENGLISH_FROZEN_REGISTRY.find((entry) => entry.qlId === qlId);
  if (!frozenRegistry) fail(`${qlId}: missing frozen registry entry.`);
  if (
    frozenRegistry.freezeId !== INT_CP003_ENGLISH_FREEZE_ID
    || frozenRegistry.permanentIdentityFrozen !== true
    || frozenRegistry.learnerContentFrozen !== true
    || frozenRegistry.reviewStatus !== "APPROVED_ENGLISH_FROZEN"
    || frozenRegistry.maturity !== "ENGLISH_IMPLEMENTATION_FROZEN"
    || frozenRegistry.active
    || frozenRegistry.questionStudioDiscoverable
    || frozenRegistry.questionBankStatus !== "NOT_STORED"
    || frozenRegistry.testEligibility !== "INELIGIBLE"
    || frozenRegistry.publiclyPublishable
  ) fail(`${qlId}: frozen registry lifecycle or approval boundary changed.`);

  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const seed = `int-cp003-approved-english-freeze:${qlId}:${seedIndex}`;
    const source = generateIntCp003ExamQuestion(qlId, seed);
    const frozen = generateIntCp003EnglishFrozenQuestion(qlId, seed);
    const replay = generateIntCp003EnglishFrozenQuestion(qlId, seed);
    runtimeQuestions += 1;

    deterministicChecks += 1;
    if (stable(frozen) !== stable(replay)) fail(`${qlId}/${seed}: frozen deterministic replay changed.`);

    contentIdentityChecks += 1;
    if (stable(contentProjection(source)) !== stable(contentProjection(frozen))) {
      fail(`${qlId}/${seed}: frozen wrapper changed approved learner content or mathematics.`);
    }

    lifecycleChecks += 12;
    if (
      frozen.freezeId !== INT_CP003_ENGLISH_FREEZE_ID
      || frozen.editorialStatus !== "ENGLISH_IMPLEMENTATION_FROZEN"
      || frozen.approvalStatus !== "APPROVED_ENGLISH_FROZEN"
      || frozen.allocationStatus !== "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION"
      || frozen.permanentIdentityFrozen !== true
      || frozen.learnerContentFrozen !== true
      || frozen.enabled
      || frozen.stagingStatus !== "NOT_STAGED"
      || frozen.registrationStatus !== "NOT_REGISTERED"
      || frozen.questionStudioDiscoverable
      || frozen.questionBankStatus !== "NOT_STORED"
      || frozen.testEligibility !== "INELIGIBLE"
      || frozen.publiclyPublishable
    ) fail(`${qlId}/${seed}: frozen runtime lifecycle changed.`);
    if (frozen.approval !== INT_CP003_ENGLISH_FREEZE_APPROVAL) {
      fail(`${qlId}/${seed}: frozen runtime lost the immutable approval authority.`);
    }
    if (frozen.frozenRegistry !== frozenRegistry) {
      fail(`${qlId}/${seed}: frozen runtime does not reference the canonical frozen registry entry.`);
    }

    frozenObjectChecks += assertDeepFrozen(frozen, `${qlId}/${seed}`);
    answerPositions[frozen.correctIndex] += 1;
    observedDifficulties.add(frozen.difficulty);
    observedAnswerSemantics.add(frozen.answerSemantic);
    observedRates.add(frozen.rateProfileId);
    observedRepresentations.add(frozen.presentation.representation);

    if (runtimeQuestions === 1) {
      const originalAnswer = frozen.correctAnswer;
      let rootMutationRejected = false;
      try {
        (frozen as unknown as { correctAnswer: string }).correctAnswer = "tampered";
      } catch {
        rootMutationRejected = true;
      }
      mutationGuardChecks += 1;
      if (!rootMutationRejected || frozen.correctAnswer !== originalAnswer) {
        fail("Frozen runtime permitted root learner-content mutation.");
      }

      const originalOptionCount = frozen.options.length;
      let nestedMutationRejected = false;
      try {
        (frozen.options as unknown as unknown[]).push("tampered");
      } catch {
        nestedMutationRejected = true;
      }
      mutationGuardChecks += 1;
      if (!nestedMutationRejected || frozen.options.length !== originalOptionCount) {
        fail("Frozen runtime permitted nested learner-content mutation.");
      }
    }
  }
}

if (runtimeQuestions !== 1400) fail(`Frozen runtime question count changed: ${runtimeQuestions}.`);
if (answerPositions.some((count) => count === 0)) fail(`Frozen runtime missed an answer position: ${answerPositions.join("/")}.`);
for (const difficulty of ["Easy", "Medium", "Hard"]) {
  if (!observedDifficulties.has(difficulty)) fail(`Frozen runtime missed difficulty ${difficulty}.`);
}
for (const semantic of ["MONEY", "PRINCIPAL", "RATE_PERCENT", "TIME_YEARS"]) {
  if (!observedAnswerSemantics.has(semantic)) fail(`Frozen runtime missed answer semantic ${semantic}.`);
}
if (observedRates.size !== 16) fail(`Frozen runtime rate coverage changed: ${observedRates.size}/16.`);
if (observedRepresentations.size !== 6) fail(`Frozen runtime representation coverage changed: ${observedRepresentations.size}/6.`);

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp003-approved-english-freeze");
mkdirSync(outputDirectory, { recursive: true });

const summary = {
  freezeId: INT_CP003_ENGLISH_FREEZE_ID,
  approval: INT_CP003_ENGLISH_FREEZE_APPROVAL,
  qlRange: `${INT_CP003_QL_IDS[0]}..${INT_CP003_QL_IDS.at(-1)}`,
  qlCount: INT_CP003_QL_IDS.length,
  approvedRegistrySha256: registryDigest,
  approvedReviewMarkdownSha256: INT_CP003_ENGLISH_FREEZE_APPROVAL.approvedReviewMarkdownSha256,
  approvedReviewDataSha256: INT_CP003_ENGLISH_FREEZE_APPROVAL.approvedReviewDataSha256,
  runtimeQuestions,
  deterministicChecks,
  contentIdentityChecks,
  lifecycleChecks,
  frozenObjectChecks,
  mutationGuardChecks,
  answerPositions,
  difficulties: [...observedDifficulties].sort(),
  answerSemantics: [...observedAnswerSemantics].sort(),
  rates: [...observedRates].sort(),
  representations: [...observedRepresentations].sort(),
  lifecycle: {
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN",
    reviewStatus: "APPROVED_ENGLISH_FROZEN",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};

writeFileSync(
  join(outputDirectory, "int-cp003-approved-english-freeze-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
writeFileSync(
  join(outputDirectory, "int-cp003-approved-english-frozen-registry.json"),
  `${JSON.stringify(serializable(INT_CP003_ENGLISH_FROZEN_REGISTRY), null, 2)}\n`,
);

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP003_APPROVED_ENGLISH_FREEZE");
