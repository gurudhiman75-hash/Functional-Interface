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
  NUMBER_SYSTEM_GENERATOR_MODEL,
  buildExamReadyStem,
  titleCaseDifficulty,
} from "./number-system-generator-contract";
import {
  fixStemGrammar,
  normaliseTeacherExplanation,
  safeOptions,
} from "./number-system-v3-presentation";

export const NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE = Object.freeze({
  releaseId: "NUM-001-EN-QS-v1",
  packageId: "NUM-001",
  cpIds: ["NUM-CP-003", "NUM-CP-004"] as const,
  language: "en" as const,
  locale: "en-IN" as const,
  status: "ACTIVE_QUESTION_STUDIO" as const,
  editorialStatus: "APPROVED_EDITORIAL_ENGLISH_V3" as const,
  explanationModel: NUMBER_SYSTEM_GENERATOR_MODEL,
  qlRange: "NUM-QL-001..NUM-QL-045",
  qlCount: 45,
  approvedBy: "ExamTree product-owner editorial directive",
  approvedAt: "2026-08-01",
  reviewMethod: "SENIOR_EDITORIAL_AUDIT_AND_EXECUTABLE_V3_PATCH",
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
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

function buildReleasedQuestion(
  cpId: Num001QuestionStudioCpId,
  allocation: any,
  question: any,
) {
  const row = {
    checkpoint: cpId,
    allocation,
    title: SIMPLE_NUMBER_SYSTEM_QL_TITLES[allocation.qlId],
    question,
  };
  const teacher = normaliseTeacherExplanation(
    buildNumberSystemTeacherExplanation(row),
  );
  const stem = buildExamReadyStem(row, qlNumber(allocation.qlId) - 1);
  const options = safeOptions(row);
  const correctIndex = Number(question.correctIndex);
  const answer = Object.freeze({
    label: String.fromCharCode(65 + correctIndex),
    value: options[correctIndex],
  });

  if (!answer.value) {
    throw new Error(`${allocation.qlId}: released answer is missing from the option array`);
  }

  const checks = [
    {
      name: "permanent-identity",
      passed: question.permanentQlId === allocation.qlId,
      message: "The generated item retains its frozen permanent QL identity.",
    },
    {
      name: "permanent-runtime-completion",
      passed: Boolean(question.questionId) && Number.isInteger(correctIndex),
      message: "The governed permanent runtime completed and returned a keyed question.",
    },
    {
      name: "four-tier-editorial",
      passed:
        teacher.mainRule.length > 0
        && teacher.stepByStepSolution.length > 0
        && teacher.examSpeedTrick.length > 0
        && teacher.commonTraps.length === options.length - 1,
      message: "The approved four-tier V3 explanation is complete.",
    },
    {
      name: "option-security",
      passed:
        new Set(options).size === options.length
        && options.every((option) => !/[✓✔]/u.test(option) && !/\[x\]/iu.test(option)),
      message: "Learner options are unique and contain no answer marker.",
    },
    {
      name: "question-studio-only-release",
      passed:
        NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.questionStudioDiscoverable
        && !NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.questionBankWritable
        && !NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.testEligible
        && !NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.publiclyPublishable,
      message: "Question Studio is active while all downstream delivery gates remain closed.",
    },
  ];
  const failures = checks.filter((check) => !check.passed);
  if (failures.length > 0) {
    throw new Error(
      `${allocation.qlId}: cannot apply Question Studio release: ${failures
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
    stem: fixStemGrammar(stem.stem),
    stemFamily: stem.family,
    options: Object.freeze(options),
    answer: answer.value,
    canonicalAnswer: answer.value,
    correctIndex,
    difficulty: titleCaseDifficulty(question.difficulty),
    difficultyBand: titleCaseDifficulty(question.difficulty),
    explanationId: `${allocation.qlId}-EN-QS-V3`,
    explanation: Object.freeze({
      ...teacher,
      lines: Object.freeze(renderTeacherExplanationMarkdown(teacher)),
    }),
    maturity: "FROZEN" as const,
    allocationStatus: "QUESTION_STUDIO_RELEASED_ENGLISH_V1" as const,
    releaseStatus: "APPROVED" as const,
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH_V3" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    permanentIdentityFrozen: true as const,
    active: true as const,
    questionStudioDiscoverable: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    validation: Object.freeze({
      ok: true as const,
      valid: true as const,
      errors: Object.freeze([]),
      checks: Object.freeze(checks),
    }),
    traceability: Object.freeze({
      ...(question.traceability ?? {}),
      releaseId: NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.releaseId,
      releaseStatus: NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.status,
      editorialStatus: NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.editorialStatus,
      explanationModel: NUMBER_SYSTEM_GENERATOR_MODEL,
      approvedLanguage: "en" as const,
      approvedAt: NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.approvedAt,
      runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
      reviewStatus: "APPROVED_EDITORIAL_ENGLISH_V3" as const,
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
  if (!NUM_001_ENGLISH_QUESTION_STUDIO_RELEASE.cpIds.includes(cpId)) {
    throw new Error(`Unknown canonical problem '${cpId}' for NUM-001.`);
  }

  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(`NUM-001 supports English Question Studio generation only; received ${language}.`);
  }

  const allowedQlIds = getNum001QuestionStudioQlIds(cpId);
  const qlId = input.questionLanguageId ?? allowedQlIds[0]!;
  if (!allowedQlIds.includes(qlId)) {
    throw new Error(`${qlId} is not owned by ${cpId}.`);
  }

  const baseSeed = input.seed ?? `num-001-question-studio:${cpId}:${qlId}`;
  const attempts = input.difficulty ? 120 : 1;
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
