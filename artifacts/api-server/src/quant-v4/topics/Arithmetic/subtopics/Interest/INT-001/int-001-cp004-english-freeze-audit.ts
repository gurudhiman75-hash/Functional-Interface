import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP004_QL_IDS,
  INT_CP004_REGISTRY,
  generateIntCp004Question,
  type IntCp004Question,
} from "./cp004-frequency-runtime";
import {
  INT_CP004_ENGLISH_FREEZE_APPROVAL,
  INT_CP004_ENGLISH_FREEZE_ID,
  INT_CP004_ENGLISH_FROZEN_REGISTRY,
} from "./cp004-english-freeze-authority";
import {
  generateIntCp004EnglishFrozenQuestion,
  type IntCp004EnglishFrozenQuestion,
} from "./cp004-english-frozen-runtime";

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
  question: IntCp004Question | IntCp004EnglishFrozenQuestion,
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

function questionForFrame(
  qlId: typeof INT_CP004_QL_IDS[number],
  frame: number,
): IntCp004Question {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const seed = `int-cp004-review:${qlId}:frame-${frame}:attempt-${attempt}`;
    const question = generateIntCp004Question(qlId, seed);
    if (question.stemFamilyId.endsWith(`FRAME-${frame}`)) return question;
  }
  throw new Error(`${qlId}: could not regenerate approved editorial frame ${frame}.`);
}

function approvedReviewEvidence(): { markdownSha256: string; dataSha256: string; questions: number } {
  const questions = INT_CP004_QL_IDS.flatMap((qlId) => [1, 2, 3, 4].map((frame) => questionForFrame(qlId, frame)));
  if (questions.length !== 76) fail(`Approved review question count changed: ${questions.length}.`);

  const lines: string[] = [
    "# INT-CP-004 — Questions and Explanations",
    "",
    "Scope: compounding frequency, effective annual rate, explicit broken periods and mixed-frequency intervals.",
    "",
  ];
  questions.forEach((question, index) => {
    lines.push(`## Question ${index + 1} — ${question.qlId}`, "", question.stem, "");
    question.options.forEach((option) => lines.push(`**${option.id}.** ${option.text}`));
    lines.push("", `**Answer:** ${question.correctAnswer}`, "", "### Explanation", "", question.explanation.whatAsked, "");
    question.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
    lines.push("", `**Final answer:** ${question.explanation.finalAnswer}`, "", `**Common mistake:** ${question.explanation.commonMistake}`, "", "---", "");
  });

  const markdown = `${lines.join("\n")}\n`;
  const data = `${JSON.stringify(serializable(questions), null, 2)}\n`;
  return { markdownSha256: sha256(markdown), dataSha256: sha256(data), questions: questions.length };
}

if (INT_CP004_ENGLISH_FREEZE_APPROVAL.approvalAuthority !== "EXPLICIT_USER_EDITORIAL_SIGN_OFF") {
  fail("INT-CP-004 English freeze lacks explicit product-owner approval.");
}
if (INT_CP004_ENGLISH_FREEZE_APPROVAL.approvalCommentId !== 5218194545) {
  fail("INT-CP-004 English freeze approval comment changed.");
}
if (INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedSourceHead !== "9f8790d3ec0f630d37fd5e832fc5740f1c1928d9") {
  fail("INT-CP-004 approved source head changed.");
}
if (INT_CP004_QL_IDS.length !== 19 || INT_CP004_ENGLISH_FROZEN_REGISTRY.length !== 19) {
  fail("INT-CP-004 frozen QL count is not 19.");
}

const registryDigest = sha256(stable(INT_CP004_REGISTRY));
if (registryDigest !== INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedRegistrySha256) {
  fail(`Approved registry digest changed: ${registryDigest}.`);
}

const reviewEvidence = approvedReviewEvidence();
if (reviewEvidence.markdownSha256 !== INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedReviewMarkdownSha256) {
  fail(`Approved review Markdown digest changed: ${reviewEvidence.markdownSha256}.`);
}
if (reviewEvidence.dataSha256 !== INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedReviewDataSha256) {
  fail(`Approved review data digest changed: ${reviewEvidence.dataSha256}.`);
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
const observedFrequencies = new Set<number>();
const observedRepresentations = new Set<string>();
const observedDomains = new Set<string>();

for (const qlId of INT_CP004_QL_IDS) {
  const frozenRegistry = INT_CP004_ENGLISH_FROZEN_REGISTRY.find((entry) => entry.qlId === qlId);
  if (!frozenRegistry) fail(`${qlId}: missing frozen registry entry.`);
  if (
    frozenRegistry.freezeId !== INT_CP004_ENGLISH_FREEZE_ID
    || frozenRegistry.permanentIdentityFrozen !== true
    || frozenRegistry.learnerContentFrozen !== true
    || frozenRegistry.reviewStatus !== "APPROVED_ENGLISH_FROZEN"
    || frozenRegistry.maturity !== "ENGLISH_IMPLEMENTATION_FROZEN"
    || frozenRegistry.enabled
    || frozenRegistry.stagingStatus !== "NOT_STAGED"
    || frozenRegistry.registrationStatus !== "NOT_REGISTERED"
    || frozenRegistry.questionStudioDiscoverable
    || frozenRegistry.questionBankStatus !== "NOT_STORED"
    || frozenRegistry.testEligibility !== "INELIGIBLE"
    || frozenRegistry.publiclyPublishable
  ) fail(`${qlId}: frozen registry lifecycle or approval boundary changed.`);

  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const seed = `int-cp004-approved-english-freeze:${qlId}:${seedIndex}`;
    const source = generateIntCp004Question(qlId, seed);
    const frozen = generateIntCp004EnglishFrozenQuestion(qlId, seed);
    const replay = generateIntCp004EnglishFrozenQuestion(qlId, seed);
    runtimeQuestions += 1;

    deterministicChecks += 1;
    if (stable(frozen) !== stable(replay)) fail(`${qlId}/${seed}: frozen deterministic replay changed.`);

    contentIdentityChecks += 1;
    if (stable(contentProjection(source)) !== stable(contentProjection(frozen))) {
      fail(`${qlId}/${seed}: frozen wrapper changed approved learner content or mathematics.`);
    }

    lifecycleChecks += 13;
    if (
      frozen.freezeId !== INT_CP004_ENGLISH_FREEZE_ID
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
    if (frozen.approval !== INT_CP004_ENGLISH_FREEZE_APPROVAL) {
      fail(`${qlId}/${seed}: frozen runtime lost the immutable approval authority.`);
    }
    if (frozen.frozenRegistry !== frozenRegistry) {
      fail(`${qlId}/${seed}: frozen runtime does not reference the canonical frozen registry entry.`);
    }

    frozenObjectChecks += assertDeepFrozen(frozen, `${qlId}/${seed}`);
    answerPositions[frozen.correctIndex] += 1;
    observedDifficulties.add(frozen.difficulty);
    observedAnswerSemantics.add(frozen.answerSemantic);
    observedFrequencies.add(frozen.mathematicalState.frequency);
    observedFrequencies.add(frozen.mathematicalState.firstFrequency);
    observedFrequencies.add(frozen.mathematicalState.secondFrequency);
    observedRepresentations.add(frozen.representation);
    observedDomains.add(frozenRegistry.domain);

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

if (runtimeQuestions !== 1900) fail(`Frozen runtime question count changed: ${runtimeQuestions}.`);
if (answerPositions.some((count) => count === 0)) fail(`Frozen runtime missed an answer position: ${answerPositions.join("/")}.`);
for (const difficulty of ["Easy", "Medium", "Hard"]) {
  if (!observedDifficulties.has(difficulty)) fail(`Frozen runtime missed difficulty ${difficulty}.`);
}
for (const semantic of ["MONEY", "RATE_PERCENT", "DURATION", "FREQUENCY"]) {
  if (!observedAnswerSemantics.has(semantic)) fail(`Frozen runtime missed answer semantic ${semantic}.`);
}
if (observedFrequencies.size !== 4) fail(`Frozen runtime frequency coverage changed: ${observedFrequencies.size}/4.`);
if (observedRepresentations.size !== 4) fail(`Frozen runtime representation coverage changed: ${observedRepresentations.size}/4.`);
if (observedDomains.size !== 5) fail(`Frozen runtime domain coverage changed: ${observedDomains.size}/5.`);

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-approved-english-freeze");
mkdirSync(outputDirectory, { recursive: true });

const summary = {
  freezeId: INT_CP004_ENGLISH_FREEZE_ID,
  approval: INT_CP004_ENGLISH_FREEZE_APPROVAL,
  qlRange: `${INT_CP004_QL_IDS[0]}..${INT_CP004_QL_IDS.at(-1)}`,
  qlCount: INT_CP004_QL_IDS.length,
  approvedRegistrySha256: registryDigest,
  approvedReviewMarkdownSha256: reviewEvidence.markdownSha256,
  approvedReviewDataSha256: reviewEvidence.dataSha256,
  reviewQuestionCount: reviewEvidence.questions,
  runtimeQuestions,
  deterministicChecks,
  contentIdentityChecks,
  lifecycleChecks,
  frozenObjectChecks,
  mutationGuardChecks,
  answerPositions,
  difficulties: [...observedDifficulties].sort(),
  answerSemantics: [...observedAnswerSemantics].sort(),
  frequencies: [...observedFrequencies].sort((left, right) => left - right),
  representations: [...observedRepresentations].sort(),
  domains: [...observedDomains].sort(),
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
  join(outputDirectory, "int-cp004-approved-english-freeze-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
writeFileSync(
  join(outputDirectory, "int-cp004-approved-english-frozen-registry.json"),
  `${JSON.stringify(serializable(INT_CP004_ENGLISH_FROZEN_REGISTRY), null, 2)}\n`,
);

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_APPROVED_ENGLISH_FREEZE");
