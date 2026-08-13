import {
  NUM_CP001_PERMANENT_QL_IDS,
  getNumCp001PermanentAllocation,
  type NumCp001PermanentQlId,
} from "./permanent/allocation";
import { runNumCp001PermanentPipeline } from "./permanent/runtime";
import { runNumCp001LocalizedPipeline } from "./localization/runtime";

export const NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE = Object.freeze({
  releaseId: "NUM-001-CP001-MULTI-QS-REVIEW-v1",
  packageId: "NUM-001" as const,
  cpId: "NUM-CP-001" as const,
  languages: ["en", "hi", "pa"] as const,
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  qlRange: "NUM-QL-124..NUM-QL-144",
  qlCount: 21,
  maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN" as const,
  status: "ACTIVE_QUESTION_STUDIO_REVIEW" as const,
  reviewStatus: "APPROVED_MULTILINGUAL_CONTROLLED_REVIEW" as const,
  questionStudioDiscoverable: true as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export type NumCp001QuestionStudioReviewLanguage =
  (typeof NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.languages)[number];
export type NumCp001QuestionStudioReviewDifficulty = "Easy" | "Medium" | "Hard";

export interface NumCp001QuestionStudioReviewInput {
  readonly questionLanguageId?: NumCp001PermanentQlId;
  readonly difficulty?: NumCp001QuestionStudioReviewDifficulty;
  readonly language?: NumCp001QuestionStudioReviewLanguage;
  readonly seed?: string;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function numericSeed(value: string): number {
  return (hash(value) % 2_000_000_000) + 1;
}

function titleCaseDifficulty(value: unknown): NumCp001QuestionStudioReviewDifficulty {
  const normalized = String(value ?? "").toUpperCase();
  if (normalized === "EASY") return "Easy";
  if (normalized === "HARD") return "Hard";
  return "Medium";
}

function explanationLines(explanation: any, language: NumCp001QuestionStudioReviewLanguage): readonly string[] {
  const labels = language === "hi"
    ? {
        core: "मुख्य अवधारणा",
        strategy: "रणनीति",
        steps: "चरण",
        speed: "तेज़ विधि",
        traps: "सामान्य गलतियाँ",
        final: "अंतिम उत्तर",
      }
    : language === "pa"
      ? {
          core: "ਮੁੱਖ ਧਾਰਨਾ",
          strategy: "ਰਣਨੀਤੀ",
          steps: "ਕਦਮ",
          speed: "ਤੇਜ਼ ਤਰੀਕਾ",
          traps: "ਆਮ ਗਲਤੀਆਂ",
          final: "ਅੰਤਿਮ ਉੱਤਰ",
        }
      : {
          core: "Core concept",
          strategy: "Strategy",
          steps: "Steps",
          speed: "Speed method",
          traps: "Common traps",
          final: "Final answer",
        };
  const core = Array.isArray(explanation?.coreConcept) ? explanation.coreConcept : [];
  const strategy = Array.isArray(explanation?.givenDataAndStrategy) ? explanation.givenDataAndStrategy : [];
  const steps = Array.isArray(explanation?.stepByStep) ? explanation.stepByStep : [];
  const speed = Array.isArray(explanation?.examSpeedMethod) ? explanation.examSpeedMethod : [];
  const traps = Array.isArray(explanation?.commonTraps) ? explanation.commonTraps : [];
  return Object.freeze([
    `**${labels.core}:** ${core.join(" ")}`,
    `**${labels.strategy}:** ${strategy.join(" ")}`,
    ...steps.map((step: string, index: number) => `**${labels.steps} ${index + 1}:** ${step}`),
    `**${labels.speed}:** ${speed.join(" ")}`,
    ...traps.map((trap: string) => `**${labels.traps}:** ${trap}`),
    `**${labels.final}:** ${String(explanation?.finalAnswer ?? "")}`,
  ].filter((line) => !line.endsWith(":** ")));
}

function generateFrozenQuestion(
  qlId: NumCp001PermanentQlId,
  seed: number,
  language: NumCp001QuestionStudioReviewLanguage,
) {
  if (language === "en") {
    return runNumCp001PermanentPipeline({ questionLanguageId: qlId, seed, language: "en" });
  }
  return runNumCp001LocalizedPipeline({
    questionLanguageId: qlId,
    seed,
    locale: language === "hi" ? "hi-IN" : "pa-IN",
  });
}

function buildReviewQuestion(
  qlId: NumCp001PermanentQlId,
  seed: number,
  language: NumCp001QuestionStudioReviewLanguage,
) {
  const allocation = getNumCp001PermanentAllocation(qlId);
  const frozen = generateFrozenQuestion(qlId, seed, language) as any;
  const options = Object.freeze(frozen.options.map((option: any) => String(option.value)));
  const correctIndex = Number(frozen.correctIndex);
  const answer = options[correctIndex];

  if (!answer || options.length !== 4 || new Set(options).size !== 4) {
    throw new Error(`${qlId}/${language}/${seed}: invalid guarded-review option surface`);
  }
  if (String(frozen.canonicalAnswer) !== answer || String(frozen.verifierAnswer) !== answer) {
    throw new Error(`${qlId}/${language}/${seed}: guarded-review answer parity failed`);
  }
  if (
    frozen.lifecycle?.active
    || frozen.lifecycle?.questionStudioDiscoverable
    || frozen.lifecycle?.questionBankWritable
    || frozen.lifecycle?.testEligible
    || frozen.lifecycle?.publiclyPublishable
  ) {
    throw new Error(`${qlId}/${language}/${seed}: frozen source lifecycle is not closed`);
  }

  const lines = explanationLines(frozen.explanation, language);
  if (lines.length < 5) {
    throw new Error(`${qlId}/${language}/${seed}: guarded-review explanation is incomplete`);
  }

  return Object.freeze({
    ...frozen,
    packageId: "NUM-001" as const,
    archetypeId: "NUM-001" as const,
    canonicalProblemId: "NUM-CP-001" as const,
    permanentQlId: qlId,
    questionLanguageId: qlId,
    questionId: `NUM-001:${qlId}:${language}:QS-REVIEW:${seed}`,
    qlTemplateId: allocation.qlTemplateId,
    solveModeId: allocation.solveModeId,
    language,
    stem: String(frozen.stem),
    options,
    answer,
    canonicalAnswer: answer,
    verifierAnswer: answer,
    correctIndex,
    difficulty: titleCaseDifficulty(frozen.difficulty),
    difficultyBand: titleCaseDifficulty(frozen.difficulty),
    explanationId: `${qlId}-${language.toUpperCase()}-QS-REVIEW-V1`,
    explanation: Object.freeze({
      ...frozen.explanation,
      lines,
    }),
    maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN" as const,
    allocationStatus: "QUESTION_STUDIO_REVIEW_ROUTED_MULTILINGUAL_V1" as const,
    releaseStatus: "APPROVED_FOR_CONTROLLED_REVIEW" as const,
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    reviewStatus: "APPROVED_MULTILINGUAL_CONTROLLED_REVIEW" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    permanentIdentityFrozen: true as const,
    active: true as const,
    questionStudioDiscoverable: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    sourceLifecycle: Object.freeze({ ...frozen.lifecycle }),
    validation: Object.freeze({
      ok: true as const,
      valid: true as const,
      errors: Object.freeze([]),
      checks: Object.freeze([
        "permanent-identity-preserved",
        "multilingual-mathematical-authority-preserved",
        "frozen-source-lifecycle-closed",
        "question-studio-review-overlay-only",
        "question-bank-write-gate-closed",
        "test-gate-closed",
        "public-gate-closed",
      ]),
    }),
    traceability: Object.freeze({
      ...(frozen.traceability ?? {}),
      releaseId: NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.releaseId,
      releaseStatus: NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.status,
      reviewStatus: NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.reviewStatus,
      runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
      approvedLanguage: language,
      sourceMaturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN" as const,
      sourceQuestionId: frozen.questionId,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    }),
  });
}

export function getNumCp001QuestionStudioReviewQlIds(): readonly NumCp001PermanentQlId[] {
  return NUM_CP001_PERMANENT_QL_IDS;
}

export function runNumCp001QuestionStudioReview(
  input: NumCp001QuestionStudioReviewInput = {},
) {
  const language = input.language ?? "en";
  if (!NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.languages.includes(language)) {
    throw new Error(`NUM-CP-001 does not support Question Studio review language ${language}.`);
  }
  const qlId = input.questionLanguageId ?? NUM_CP001_PERMANENT_QL_IDS[0];
  if (!NUM_CP001_PERMANENT_QL_IDS.includes(qlId)) {
    throw new Error(`${qlId} is not owned by NUM-CP-001.`);
  }
  const baseSeed = input.seed ?? `num-cp001-question-studio-review:${language}:${qlId}`;
  const attempts = input.difficulty ? 120 : 1;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const seedText = attempt === 0 ? baseSeed : `${baseSeed}:difficulty-${attempt}`;
    const question = buildReviewQuestion(qlId, numericSeed(seedText), language);
    if (!input.difficulty || question.difficulty === input.difficulty) return question;
  }
  throw new Error(`${qlId}: unable to generate difficulty ${input.difficulty} within the governed retry bound.`);
}
