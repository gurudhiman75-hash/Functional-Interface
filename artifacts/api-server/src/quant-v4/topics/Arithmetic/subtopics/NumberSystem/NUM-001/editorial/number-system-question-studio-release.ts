// @ts-nocheck
import {
  NUM_CP003_PERMANENT_QL_IDS,
  getNumCp003PermanentAllocation,
  type NumCp003PermanentQlId,
} from "../NUM-CP-003/permanent/allocation";
import {
  runNumCp003PermanentPipeline,
} from "../NUM-CP-003/permanent/runtime";
import {
  NUM_CP004_PERMANENT_QL_IDS,
  getNumCp004PermanentAllocation,
  type NumCp004PermanentQlId,
} from "../NUM-CP-004/permanent/allocation";
import {
  runNumCp004PermanentPipeline,
} from "../NUM-CP-004/permanent/runtime";
import {
  SIMPLE_NUMBER_SYSTEM_QL_TITLES,
  buildNumberSystemTeacherExplanation,
  renderTeacherExplanationMarkdown,
} from "./simple-teacher-voice";
import {
  NUMBER_SYSTEM_GENERATOR_EDITORIAL_PATCH,
  NUMBER_SYSTEM_GENERATOR_MODEL,
  buildExamReadyStem,
  formatStudentOptionValue,
  titleCaseDifficulty,
} from "./number-system-generator-contract";

export const NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE = Object.freeze({
  releaseId: "NUM-001-EN-QS-v1",
  editorialPatch: NUMBER_SYSTEM_GENERATOR_EDITORIAL_PATCH,
  packageId: "NUM-001",
  cpIds: ["NUM-CP-003", "NUM-CP-004"] as const,
  language: "en" as const,
  locale: "en-IN" as const,
  status: "ACTIVE_QUESTION_STUDIO" as const,
  editorialStatus: "APPROVED_WITH_V3_1_REMEDIATION" as const,
  explanationModel: NUMBER_SYSTEM_GENERATOR_MODEL,
  qlRange: "NUM-QL-001..NUM-QL-045",
  qlCount: 45,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  approvedBy: "ExamTree product-owner editorial directive",
  approvedAt: "2026-08-01",
  approvalScope:
    "English Question Studio generation for NUM-CP-003 and NUM-CP-004 after grammar, MathJax and mobile-layout remediation",
});

export type Num001QuestionStudioCpId =
  (typeof NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.cpIds)[number];
export type Num001QuestionStudioQlId =
  | NumCp003PermanentQlId
  | NumCp004PermanentQlId;
export type Num001QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";

export interface Num001QuestionStudioInput {
  readonly questionLanguageId?: Num001QuestionStudioQlId;
  readonly difficulty?: Num001QuestionStudioDifficulty;
  readonly seed?: string;
  readonly language?: "en";
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function qlNumber(qlId: string): number {
  return Number(qlId.slice(-3));
}

function rawOptions(cpId: Num001QuestionStudioCpId, question: any): string[] {
  return cpId === "NUM-CP-003"
    ? question.options.map(String)
    : question.options.map((option) => String(option.value));
}

function buildReleasedQuestion(
  cpId: Num001QuestionStudioCpId,
  allocation: any,
  question: any,
) {
  const reviewIndex = qlNumber(allocation.qlId) - 1;
  const row = {
    checkpoint: cpId,
    allocation,
    title: SIMPLE_NUMBER_SYSTEM_QL_TITLES[allocation.qlId],
    question,
  };
  const teacher = buildNumberSystemTeacherExplanation(row);
  const stem = buildExamReadyStem(row, reviewIndex);
  const options = rawOptions(cpId, question).map(formatStudentOptionValue);
  const correctIndex = Number(question.correctIndex);
  const answer = options[correctIndex];
  if (!answer) throw new Error(`${allocation.qlId}: released answer is missing`);

  const validationChecks = [
    {
      name: "permanent-identity",
      passed: question.permanentQlId === allocation.qlId,
      message: "The generated item uses the requested permanent QL identity.",
    },
    {
      name: "four-tier-editorial",
      passed:
        teacher.mainRule.length > 0
        && teacher.stepByStepSolution.length > 0
        && teacher.examSpeedTrick.length > 0
        && teacher.commonTraps.length === options.length - 1,
      message: "The V3 four-tier teacher explanation is complete.",
    },
    {
      name: "option-security",
      passed: options.every((option) => !/[✓✔]/u.test(option) && !/\[x\]/iu.test(option)),
      message: "No answer marker is present inside learner options.",
    },
    {
      name: "question-studio-only-gate",
      passed:
        NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.questionStudioDiscoverable
        && !NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.questionBankWritable
        && !NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.testEligible
        && !NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.publiclyPublishable,
      message: "Only Question Studio generation is active; downstream delivery gates remain closed.",
    },
  ];
  const failures = validationChecks.filter((check) => !check.passed);
  if (failures.length > 0) {
    throw new Error(
      `${allocation.qlId}: Question Studio release validation failed: ${failures
        .map((check) => `${check.name}: ${check.message}`)
        .join("; ")}`,
    );
  }

  return Object.freeze({
    ...question,
    packageId: "NUM-001" as const,
    archetypeId: "NUM-001" as const,
    canonicalProblemId: cpId,
    permanentQlId: allocation.qlId,
    questionLanguageId: allocation.qlId,
    stem: stem.stem,
    stemFamily: stem.family,
    options: Object.freeze(options),
    answer,
    canonicalAnswer: answer,
    correctIndex,
    difficulty: titleCaseDifficulty(question.difficulty),
    difficultyBand: titleCaseDifficulty(question.difficulty),
    explanationId: `${allocation.qlId}-EN-QS-V3-1`,
    explanation: Object.freeze({
      ...teacher,
      lines: Object.freeze(renderTeacherExplanationMarkdown(teacher)),
    }),
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    releaseStatus: NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.status,
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH_V3_1" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    active: true as const,
    questionStudioDiscoverable: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    validation: Object.freeze({
      ok: true as const,
      valid: true as const,
      errors: Object.freeze([]),
      checks: Object.freeze(validationChecks),
    }),
    traceability: Object.freeze({
      ...question.traceability,
      releaseId: NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.releaseId,
      editorialPatch: NUMBER_SYSTEM_GENERATOR_EDITORIAL_PATCH,
      explanationModel: NUMBER_SYSTEM_GENERATOR_MODEL,
      runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
      reviewStatus: "APPROVED_EDITORIAL_ENGLISH_V3_1" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    }),
  });
}

function generateCp003(
  qlId: NumCp003PermanentQlId,
  seed: string,
) {
  const allocation = getNumCp003PermanentAllocation(qlId);
  const question = runNumCp003PermanentPipeline({
    questionLanguageId: qlId,
    seed,
    language: "en",
  });
  return buildReleasedQuestion("NUM-CP-003", allocation, question);
}

function generateCp004(
  qlId: NumCp004PermanentQlId,
  seed: string,
) {
  const allocation = getNumCp004PermanentAllocation(qlId);
  const numericSeed = (hash(seed) % 2_000_000_000) + 1;
  const question = runNumCp004PermanentPipeline({
    questionLanguageId: qlId,
    seed: numericSeed,
    language: "en",
  });
  return buildReleasedQuestion("NUM-CP-004", allocation, question);
}

export function getNum001QuestionStudioQlIds(
  cpId: Num001QuestionStudioCpId,
): readonly Num001QuestionStudioQlId[] {
  return cpId === "NUM-CP-003"
    ? NUM_CP003_PERMANENT_QL_IDS
    : NUM_CP004_PERMANENT_QL_IDS;
}

export function runNum001EnglishQuestionStudioRelease(
  cpId: Num001QuestionStudioCpId,
  input: Num001QuestionStudioInput = {},
) {
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(`NUM-001 supports English Question Studio generation only; received ${language}.`);
  }

  const allowedQlIds = getNum001QuestionStudioQlIds(cpId);
  const qlId = input.questionLanguageId ?? allowedQlIds[0];
  if (!allowedQlIds.includes(qlId)) {
    throw new Error(`${qlId} is not owned by ${cpId}.`);
  }

  const baseSeed = input.seed ?? `num-001-question-studio:${cpId}:${qlId}`;
  const attempts = input.difficulty ? 90 : 1;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const seed = attempt === 0 ? baseSeed : `${baseSeed}:difficulty-${attempt}`;
    const question = cpId === "NUM-CP-003"
      ? generateCp003(qlId as NumCp003PermanentQlId, seed)
      : generateCp004(qlId as NumCp004PermanentQlId, seed);
    if (!input.difficulty || question.difficulty === input.difficulty) {
      return question;
    }
  }

  throw new Error(
    `${qlId}: unable to generate difficulty ${input.difficulty} within the governed retry bound.`,
  );
}
