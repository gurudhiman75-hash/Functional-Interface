import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP002_FINAL_QL_IDS,
  INT_CP002_FINAL_REGISTRY,
  type IntCp002FinalQlId,
} from "./cp002-final-registry";
import {
  generateIntCp002FinalQuestion,
  type IntCp002FinalGeneratedQuestion,
} from "./cp002-final-runtime";
import {
  INT_CP002_ENGLISH_FREEZE_APPROVAL,
  INT_CP002_ENGLISH_FREEZE_ID,
  INT_CP002_ENGLISH_FROZEN_REGISTRY,
} from "./cp002-english-freeze-authority";
import {
  generateIntCp002EnglishFrozenQuestion,
  type IntCp002EnglishFrozenQuestion,
} from "./cp002-english-frozen-runtime";

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
  question: IntCp002FinalGeneratedQuestion | IntCp002EnglishFrozenQuestion,
): unknown {
  return {
    packageId: question.packageId,
    canonicalProblemId: question.canonicalProblemId,
    qlId: question.qlId,
    permanentQlId: question.permanentQlId,
    questionLanguageId: question.questionLanguageId,
    releaseCandidateId: question.releaseCandidateId,
    language: question.language,
    seed: question.seed,
    solveContract: question.solveContract,
    topology: question.topology,
    taskDirection: question.taskDirection,
    answerSemantic: question.answerSemantic,
    difficulty: question.difficulty,
    stem: question.stem,
    options: question.options,
    optionAudit: question.optionAudit,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    solution: question.solution,
    mathematicalFingerprint: question.mathematicalFingerprint,
    validation: question.validation,
    internalProvenance: question.internalProvenance,
    enabled: question.enabled,
    stagingStatus: question.stagingStatus,
    registrationStatus: question.registrationStatus,
    questionStudioDiscoverable: question.questionStudioDiscoverable,
    questionBankStatus: question.questionBankStatus,
    testEligibility: question.testEligibility,
    publiclyPublishable: question.publiclyPublishable,
  };
}

function selectApprovedReviewRows(): IntCp002FinalGeneratedQuestion[] {
  const globallySelectedStems = new Set<string>();
  const rows: IntCp002FinalGeneratedQuestion[] = [];

  for (const qlId of INT_CP002_FINAL_QL_IDS) {
    const byAnswerPosition = new Map<number, IntCp002FinalGeneratedQuestion>();
    for (let candidateIndex = 0; candidateIndex < 256 && byAnswerPosition.size < 4; candidateIndex += 1) {
      const seed = `int-cp002-final-review:${qlId}:${candidateIndex}`;
      const question = generateIntCp002FinalQuestion(qlId, seed);
      if (byAnswerPosition.has(question.correctIndex) || globallySelectedStems.has(question.stem)) continue;
      byAnswerPosition.set(question.correctIndex, question);
      globallySelectedStems.add(question.stem);
    }
    if (byAnswerPosition.size !== 4) {
      fail(`${qlId}: approved review selection no longer reaches four distinct answer-position rows.`);
    }
    rows.push(...[0, 1, 2, 3].map((position) => byAnswerPosition.get(position)!));
  }

  return rows;
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

if (INT_CP002_ENGLISH_FREEZE_APPROVAL.approvalAuthority !== "EXPLICIT_USER_EDITORIAL_SIGN_OFF") {
  fail("INT-CP-002 English freeze lacks explicit product-owner approval.");
}
if (INT_CP002_ENGLISH_FREEZE_APPROVAL.approvalCommentId !== 5158690713) {
  fail("INT-CP-002 English freeze approval comment changed.");
}
if (INT_CP002_ENGLISH_FREEZE_APPROVAL.approvedSourceHead !== "1f66170f1ed34c49a1d51397adc5710f98722bb1") {
  fail("INT-CP-002 approved source head changed.");
}
if (INT_CP002_FINAL_QL_IDS.length !== 31 || INT_CP002_ENGLISH_FROZEN_REGISTRY.length !== 31) {
  fail("INT-CP-002 frozen QL count is not 31.");
}

const registryDigest = sha256(stable(INT_CP002_FINAL_REGISTRY));
if (registryDigest !== INT_CP002_ENGLISH_FREEZE_APPROVAL.approvedRegistrySha256) {
  fail(`Approved registry digest changed: ${registryDigest}.`);
}

const approvedReviewRows = selectApprovedReviewRows();
const approvedReviewDigest = sha256(stable(approvedReviewRows));
if (approvedReviewDigest !== INT_CP002_ENGLISH_FREEZE_APPROVAL.approvedReviewProjectionSha256) {
  fail(`Approved 124-row learner projection changed: ${approvedReviewDigest}.`);
}
if (approvedReviewRows.length !== 124) fail(`Approved review row count changed: ${approvedReviewRows.length}.`);
if (new Set(approvedReviewRows.map((question) => question.stem)).size !== 124) {
  fail("Approved review projection no longer has 124 distinct stems.");
}
const approvedReviewAnswerPositions = [0, 1, 2, 3].map(
  (position) => approvedReviewRows.filter((question) => question.correctIndex === position).length,
);
if (approvedReviewAnswerPositions.some((count) => count !== 31)) {
  fail(`Approved review answer positions changed: ${approvedReviewAnswerPositions.join("/")}.`);
}

let runtimeQuestions = 0;
let deterministicChecks = 0;
let contentIdentityChecks = 0;
let lifecycleChecks = 0;
let frozenObjectChecks = 0;
let mutationGuardChecks = 0;
const runtimeAnswerPositions = [0, 0, 0, 0];
const observedDifficulties = new Set<string>();
const observedAnswerSemantics = new Set<string>();
const observedSourceKinds = new Set<string>();

for (const qlId of INT_CP002_FINAL_QL_IDS) {
  const frozenRegistry = INT_CP002_ENGLISH_FROZEN_REGISTRY.find((entry) => entry.qlId === qlId);
  if (!frozenRegistry) fail(`${qlId}: missing frozen registry entry.`);
  if (
    frozenRegistry.freezeId !== INT_CP002_ENGLISH_FREEZE_ID
    || frozenRegistry.permanentIdentityFrozen !== true
    || frozenRegistry.learnerContentFrozen !== true
    || frozenRegistry.reviewStatus !== "APPROVED_ENGLISH_FROZEN"
    || frozenRegistry.maturity !== "ENGLISH_IMPLEMENTATION_FROZEN"
    || frozenRegistry.active
    || frozenRegistry.questionStudioDiscoverable
    || frozenRegistry.questionBankStatus !== "NOT_STORED"
    || frozenRegistry.testEligibility !== "INELIGIBLE"
    || frozenRegistry.publiclyPublishable
  ) {
    fail(`${qlId}: frozen registry lifecycle or approval boundary changed.`);
  }

  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const seed = `int-cp002-approved-english-freeze:${qlId}:${seedIndex}`;
    const source = generateIntCp002FinalQuestion(qlId, seed);
    const frozen = generateIntCp002EnglishFrozenQuestion(qlId, seed);
    const replay = generateIntCp002EnglishFrozenQuestion(qlId, seed);
    runtimeQuestions += 1;

    deterministicChecks += 1;
    if (stable(frozen) !== stable(replay)) fail(`${qlId}/${seed}: frozen deterministic replay changed.`);

    contentIdentityChecks += 1;
    if (stable(contentProjection(source)) !== stable(contentProjection(frozen))) {
      fail(`${qlId}/${seed}: frozen wrapper changed approved learner content or mathematics.`);
    }

    lifecycleChecks += 12;
    if (
      frozen.freezeId !== INT_CP002_ENGLISH_FREEZE_ID
      || frozen.sourceReleaseCandidateId !== INT_CP002_ENGLISH_FREEZE_APPROVAL.approvedReleaseCandidateId
      || frozen.maturity !== "ENGLISH_IMPLEMENTATION_FROZEN"
      || frozen.reviewStatus !== "APPROVED_ENGLISH_FROZEN"
      || frozen.allocationStatus !== "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION"
      || frozen.permanentIdentityFrozen !== true
      || frozen.learnerContentFrozen !== true
      || frozen.enabled
      || frozen.questionStudioDiscoverable
      || frozen.questionBankStatus !== "NOT_STORED"
      || frozen.testEligibility !== "INELIGIBLE"
      || frozen.publiclyPublishable
    ) {
      fail(`${qlId}/${seed}: frozen runtime lifecycle changed.`);
    }
    if (frozen.approval !== INT_CP002_ENGLISH_FREEZE_APPROVAL) {
      fail(`${qlId}/${seed}: frozen runtime lost the immutable approval authority.`);
    }
    if (frozen.frozenRegistry !== frozenRegistry) {
      fail(`${qlId}/${seed}: frozen runtime does not reference the canonical frozen registry entry.`);
    }

    frozenObjectChecks += assertDeepFrozen(frozen, `${qlId}/${seed}`);
    runtimeAnswerPositions[frozen.correctIndex] += 1;
    observedDifficulties.add(frozen.difficulty);
    observedAnswerSemantics.add(frozen.answerSemantic);
    observedSourceKinds.add(frozen.internalProvenance.sourceKind);

    if (runtimeQuestions === 1) {
      const originalStem = frozen.stem;
      let rootMutationRejected = false;
      try {
        (frozen as unknown as { stem: string }).stem = "tampered";
      } catch {
        rootMutationRejected = true;
      }
      mutationGuardChecks += 1;
      if (!rootMutationRejected || frozen.stem !== originalStem) {
        fail("Frozen runtime permitted root learner-content mutation.");
      }

      const originalOptionCount = frozen.options.length;
      let nestedMutationRejected = false;
      try {
        (frozen.options as unknown as string[]).push("tampered");
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

if (runtimeAnswerPositions.some((count) => count === 0)) {
  fail(`Frozen runtime missed an answer position: ${runtimeAnswerPositions.join("/")}.`);
}
for (const difficulty of ["Easy", "Medium", "Hard"]) {
  if (!observedDifficulties.has(difficulty)) fail(`Frozen runtime missed difficulty ${difficulty}.`);
}
for (const semantic of ["MONEY", "PRINCIPAL", "RATE_PERCENT", "TIME_YEARS", "DAYS", "RATIO"]) {
  if (!observedAnswerSemantics.has(semantic)) fail(`Frozen runtime missed answer semantic ${semantic}.`);
}
for (const sourceKind of ["WAVE01", "WAVE02", "CLOSURE"]) {
  if (!observedSourceKinds.has(sourceKind)) fail(`Frozen runtime missed source kind ${sourceKind}.`);
}

const frozenReviewRows = approvedReviewRows.map((source) => {
  const frozen = generateIntCp002EnglishFrozenQuestion(source.qlId, source.seed);
  if (stable(contentProjection(source)) !== stable(contentProjection(frozen))) {
    fail(`${source.qlId}/${source.seed}: approved review row changed in frozen projection.`);
  }
  return frozen;
});

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp002-approved-english-freeze");
mkdirSync(outputDirectory, { recursive: true });

const summary = {
  freezeId: INT_CP002_ENGLISH_FREEZE_ID,
  approval: INT_CP002_ENGLISH_FREEZE_APPROVAL,
  qlRange: `${INT_CP002_FINAL_QL_IDS[0]}..${INT_CP002_FINAL_QL_IDS.at(-1)}`,
  qlCount: INT_CP002_FINAL_QL_IDS.length,
  approvedRegistrySha256: registryDigest,
  approvedReviewProjectionSha256: approvedReviewDigest,
  approvedReviewRows: approvedReviewRows.length,
  approvedReviewAnswerPositions,
  runtimeQuestions,
  deterministicChecks,
  contentIdentityChecks,
  lifecycleChecks,
  frozenObjectChecks,
  mutationGuardChecks,
  runtimeAnswerPositions,
  difficulties: [...observedDifficulties].sort(),
  answerSemantics: [...observedAnswerSemantics].sort(),
  sourceKinds: [...observedSourceKinds].sort(),
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
  join(outputDirectory, "int-cp002-approved-english-freeze-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
writeFileSync(
  join(outputDirectory, "int-cp002-approved-english-frozen-registry.json"),
  `${JSON.stringify(serializable(INT_CP002_ENGLISH_FROZEN_REGISTRY), null, 2)}\n`,
);
writeFileSync(
  join(outputDirectory, "int-cp002-approved-english-frozen-review-data.json"),
  `${JSON.stringify(serializable(frozenReviewRows), null, 2)}\n`,
);

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP002_APPROVED_ENGLISH_FREEZE");
