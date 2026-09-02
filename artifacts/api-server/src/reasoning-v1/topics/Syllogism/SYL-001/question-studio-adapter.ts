import type { SylDifficulty, SylLocale } from "./foundation/types";
import { generateSylQuestionV5 } from "./runtime/generator-v5";
import {
  SYL_LEARNER_V5_APPROVAL_AUTHORITY,
  SYL_LEARNER_V5_APPROVED_CONTENT_COMMIT,
  SYL_LEARNER_V5_APPROVED_ON,
  type GeneratedSylQuestionV5,
} from "./runtime/learner-v5-types";
import type { SylQlId } from "./runtime/types";

export const SYL_001_QUESTION_STUDIO_PACKAGE_ID = "REASONING_V1_SYL_001" as const;
export const SYL_001_QUESTION_STUDIO_RUNTIME_MODE = "SYL_001_GENERATOR_V5_STUDIO" as const;
export const SYL_001_QUESTION_STUDIO_CLOSEOUT_AUTHORITY = "SYL_001_QUESTION_STUDIO_CLOSEOUT_V1" as const;
export const SYL_001_QUESTION_STUDIO_INTEGRATION_STATUS = "QUESTION_STUDIO_ACTIVE__QUESTION_BANK_TEST_PUBLIC_LOCKED" as const;

export const SYL_001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const SYL_001_QUESTION_STUDIO_QL_IDS = Array.from(
  { length: 18 },
  (_, index) => `SYL-QL-${String(index + 1).padStart(3, "0")}` as SylQlId,
);

export type Syl001QuestionStudioLanguage = (typeof SYL_001_QUESTION_STUDIO_LANGUAGES)[number];
export type Syl001QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";

export type Syl001QuestionStudioRequest = Readonly<{
  language?: Syl001QuestionStudioLanguage;
  qlId?: SylQlId;
  difficulty?: Syl001QuestionStudioDifficulty;
  seed?: number | string;
  count?: number;
}>;

export const SYL_001_QUESTION_STUDIO_PACKAGE = Object.freeze({
  id: SYL_001_QUESTION_STUDIO_PACKAGE_ID,
  packageId: SYL_001_QUESTION_STUDIO_PACKAGE_ID,
  type: "reasoning-v1",
  section: "Reasoning",
  domain: "reasoning",
  topic: "Syllogism",
  subtopic: "Syllogism",
  chapterId: "SYL-001",
  checkpointId: "SYL-CP-001..SYL-CP-007",
  name: "SYL-001 Syllogism — Question Studio V5",
  label: "Syllogism",
  generationDomain: "reasoning-v1",
  qlIds: [...SYL_001_QUESTION_STUDIO_QL_IDS],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  supportedLanguages: [...SYL_001_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  reviewPreviewAvailable: true,
  questionStudioGenerationEnabled: true,
  questionStudioWriteEnabled: false,
  runtimeMode: SYL_001_QUESTION_STUDIO_RUNTIME_MODE,
  supportedRuntimeModes: [SYL_001_QUESTION_STUDIO_RUNTIME_MODE],
  integrationStatus: SYL_001_QUESTION_STUDIO_INTEGRATION_STATUS,
  corpusAuthority: "SYL_001_EXAM_READINESS_REMEDIATION_V5",
  closeoutAuthority: SYL_001_QUESTION_STUDIO_CLOSEOUT_AUTHORITY,
  approvalAuthority: SYL_LEARNER_V5_APPROVAL_AUTHORITY,
  approvedContentCommit: SYL_LEARNER_V5_APPROVED_CONTENT_COMMIT,
  approvedOn: SYL_LEARNER_V5_APPROVED_ON,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  persistenceAllowed: false,
  publiclyPublishable: false,
  questionStudioVisible: true,
  questionBankEligible: false,
  mockTestEligible: false,
} as const);

function localeFor(language: Syl001QuestionStudioLanguage): SylLocale {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
}

function studioDifficulty(value: SylDifficulty): Syl001QuestionStudioDifficulty {
  if (value === "EASY") return "Easy";
  if (value === "HARD") return "Hard";
  return "Medium";
}

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function normalizeSeed(seed: number | string | undefined) {
  if (typeof seed === "number" && Number.isFinite(seed)) return Math.abs(Math.trunc(seed));
  if (typeof seed === "string" && seed.length > 0) return hashSeed(seed);
  return hashSeed(SYL_001_QUESTION_STUDIO_PACKAGE_ID);
}

function generateMatchingQuestion(
  qlId: SylQlId,
  startSeed: number,
  locale: SylLocale,
  difficulty?: Syl001QuestionStudioDifficulty,
): GeneratedSylQuestionV5 {
  for (let offset = 0; offset < 512; offset += 1) {
    const question = generateSylQuestionV5(qlId, startSeed + offset, locale);
    if (!difficulty || studioDifficulty(question.difficulty) === difficulty) return question;
  }
  throw new Error(`Unable to generate ${difficulty ?? "requested"} ${qlId} candidate within the audited seed window.`);
}

export function toSyl001QuestionStudioPreview(question: GeneratedSylQuestionV5) {
  const learner = question.learnerPresentationV5;
  const identity = question.structuredProofV3.identity;
  const validationChecks = [
    {
      name: "v5-editorial-approval",
      passed:
        learner.remediationEvidence.nativeEnglishEditorialStatus === "APPROVED_BY_PRODUCT_OWNER" &&
        learner.remediationEvidence.nativeHindiEditorialStatus === "APPROVED_BY_PRODUCT_OWNER" &&
        learner.remediationEvidence.nativePunjabiEditorialStatus === "APPROVED_BY_PRODUCT_OWNER" &&
        learner.remediationEvidence.humanViewportStatus === "APPROVED" &&
        learner.remediationEvidence.approvalAuthority === SYL_LEARNER_V5_APPROVAL_AUTHORITY &&
        learner.remediationEvidence.approvedContentCommit === SYL_LEARNER_V5_APPROVED_CONTENT_COMMIT &&
        learner.remediationEvidence.approvedOn === SYL_LEARNER_V5_APPROVED_ON,
      message: "V5 learner/editorial and viewport approvals are bound to the reviewed content authority.",
    },
    {
      name: "single-reviewed-answer",
      passed:
        question.correctIndex >= 0 &&
        question.correctIndex < question.options.length &&
        question.options.filter((option) => option.isCorrect).length === 1 &&
        question.options[question.correctIndex]?.isCorrect === true,
      message: "Candidate retains exactly one reviewed keyed answer.",
    },
    {
      name: "delivery-lock",
      passed:
        SYL_001_QUESTION_STUDIO_PACKAGE.questionStudioVisible === true &&
        SYL_001_QUESTION_STUDIO_PACKAGE.persistenceAllowed === false &&
        SYL_001_QUESTION_STUDIO_PACKAGE.questionBankEligible === false &&
        SYL_001_QUESTION_STUDIO_PACKAGE.mockTestEligible === false &&
        SYL_001_QUESTION_STUDIO_PACKAGE.publiclyPublishable === false,
      message: "Question Studio generation is enabled while storage, tests and publication remain locked.",
    },
  ] as const;

  return {
    archetypeId: SYL_001_QUESTION_STUDIO_PACKAGE_ID,
    packageId: SYL_001_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: "SYL-001",
    qlId: question.qlId,
    questionId: identity.questionId,
    questionLanguageId: identity.questionLanguageId,
    language: question.locale === "hi-IN" ? "hi" : question.locale === "pa-IN" ? "pa" : "en",
    locale: question.locale,
    difficultyBand: studioDifficulty(question.difficulty),
    stem: question.stem,
    statements: question.statements,
    conclusions: question.conclusions,
    options: question.options.map((option) => option.text),
    optionDetails: question.options.map((option, index) => ({
      label: String.fromCharCode(65 + index),
      text: option.text,
      semanticValue: option.semanticValue,
      isCorrect: option.isCorrect,
      errorLabel: option.errorLabel,
    })),
    correctIndex: question.correctIndex,
    answer: learner.answer,
    explanation: {
      preTestDirection: learner.preTestDirection,
      shortReasoning: learner.learnerExplanation.shortReasoning,
      conclusion: learner.learnerExplanation.conclusion,
      conclusionResults: learner.learnerExplanation.conclusionResults,
      shortcut: learner.learnerExplanation.shortcut,
      optionAnalysis: learner.optionAnalysis,
    },
    renderer: {
      kind: question.renderer,
      diagramAvailable: learner.diagram.enabled,
      diagramSvg: learner.diagram.svg,
      diagramCaption: learner.diagram.caption,
      accessibleDescription: learner.diagram.accessibleDescription,
      textFallbackAvailable: true,
    },
    parameters: {
      chapterId: "SYL-001",
      checkpointId: question.checkpointId,
      qlId: question.qlId,
      seed: question.seed,
      runtimeMode: SYL_001_QUESTION_STUDIO_RUNTIME_MODE,
      closeoutAuthority: SYL_001_QUESTION_STUDIO_CLOSEOUT_AUTHORITY,
      corpusAuthority: SYL_001_QUESTION_STUDIO_PACKAGE.corpusAuthority,
      approvalAuthority: learner.remediationEvidence.approvalAuthority,
      approvedContentCommit: learner.remediationEvidence.approvedContentCommit,
      approvedOn: learner.remediationEvidence.approvedOn,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      persistenceAllowed: false,
    },
    traceability: {
      sourcePatternId: question.sourcePatternId,
      scenarioId: question.scenarioId,
      taskKind: question.metadata.taskKind,
      semanticsProfileId: question.semanticsProfileId,
      logicContentId: identity.logicContentId,
      localizedRecordId: identity.localizedRecordId,
      reviewVersionId: identity.reviewVersionId,
    },
    safety: {
      integrationStatus: SYL_001_QUESTION_STUDIO_INTEGRATION_STATUS,
      questionStudioVisible: true,
      questionStudioGenerationEnabled: true,
      persistenceAllowed: false,
      questionBankEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    },
    validation: {
      valid: validationChecks.every((check) => check.passed),
      checks: validationChecks,
    },
  } as const;
}

export function previewSyl001QuestionStudio(request: Syl001QuestionStudioRequest = {}) {
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const language = request.language ?? "en";
  const locale = localeFor(language);
  const seed = normalizeSeed(request.seed);
  const qlIds = request.qlId ? [request.qlId] : SYL_001_QUESTION_STUDIO_QL_IDS;
  const questions = Array.from({ length: count }, (_, index) => {
    const qlId = qlIds[index % qlIds.length]!;
    return generateMatchingQuestion(qlId, seed + index * 1009, locale, request.difficulty);
  });

  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: SYL_001_QUESTION_STUDIO_PACKAGE_ID,
      seed,
      runtimeMode: SYL_001_QUESTION_STUDIO_RUNTIME_MODE,
      integrationStatus: SYL_001_QUESTION_STUDIO_INTEGRATION_STATUS,
      reviewStatus: "CLOSED_FOR_QUESTION_STUDIO",
      approvalAuthority: SYL_LEARNER_V5_APPROVAL_AUTHORITY,
      approvedContentCommit: SYL_LEARNER_V5_APPROVED_CONTENT_COMMIT,
      approvedOn: SYL_LEARNER_V5_APPROVED_ON,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      persistenceAllowed: false,
    },
    questions: questions.map(toSyl001QuestionStudioPreview),
  } as const;
}

export function assertSyl001QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "SYL-001 is closed for Question Studio candidate generation only; Question Bank persistence, test eligibility and publication require a separate explicit activation gate.",
  );
}
