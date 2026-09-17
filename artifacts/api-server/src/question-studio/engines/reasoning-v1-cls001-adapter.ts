import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { generateClsCp001Question } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-001/cp001-multilingual-runtime";
import { generateClsCp002Question } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-002/cp002-multilingual-runtime";
import { generateClsCp003EnglishQuestion } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-003/cp003-english-runtime";
import { generateClsCp003LocalizedQuestionV5 } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-003/cp003-localized-runtime-v5";
import { generateClsCp004EnglishQuestion } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-004/cp004-english-runtime";
import { generateClsCp004LocalizedQuestion } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-004/cp004-localized-runtime";
import { generateClsCp005EnglishQuestion } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-005/cp005-english-runtime";
import { generateClsCp005LearnerReviewV2 } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-005/cp005-learner-review-v2";
import { generateClsCp006EnglishQuestion } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-006/cp006-english-runtime";
import { generateClsCp006LearnerReviewV2 } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-006/cp006-learner-review-v2";
import { CLS_CP007_PROTOTYPES } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-007/cluster-domain";
import {
  generateClsCp007PermanentClusterPairQuestion,
  generateClsCp007PermanentClusterQuestion,
} from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-007/cp007-english-contracts";
import {
  generateClsCp007LocalizedClusterQuestionV3,
  generateClsCp007LocalizedPairQuestionV3,
} from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-007/cp007-localized-runtime-v3";

export const CLS001_QUESTION_STUDIO_PACKAGE_ID_V1 = "CLS-001" as const;
export const CLS001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const CLS001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  "CLS-001-FINAL-CHAPTER-AUDIT-20260917" as const;

type ClsQlId =
  | "CLS-QL-001" | "CLS-QL-002" | "CLS-QL-003" | "CLS-QL-004"
  | "CLS-QL-005" | "CLS-QL-006" | "CLS-QL-007" | "CLS-QL-008"
  | "CLS-QL-009" | "CLS-QL-010" | "CLS-QL-011" | "CLS-QL-012"
  | "CLS-QL-013";

type ClsCpId =
  | "CLS-CP-001" | "CLS-CP-002" | "CLS-CP-003" | "CLS-CP-004"
  | "CLS-CP-005" | "CLS-CP-006" | "CLS-CP-007";

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

export const CLS001_QUESTION_STUDIO_QL_IDS_V1: readonly ClsQlId[] = [
  "CLS-QL-001", "CLS-QL-002", "CLS-QL-003", "CLS-QL-004",
  "CLS-QL-005", "CLS-QL-006", "CLS-QL-007", "CLS-QL-008",
  "CLS-QL-009", "CLS-QL-010", "CLS-QL-011", "CLS-QL-012",
  "CLS-QL-013",
];

const QL_TO_CP: Readonly<Record<ClsQlId, ClsCpId>> = {
  "CLS-QL-001": "CLS-CP-001",
  "CLS-QL-002": "CLS-CP-001",
  "CLS-QL-003": "CLS-CP-001",
  "CLS-QL-004": "CLS-CP-002",
  "CLS-QL-005": "CLS-CP-003",
  "CLS-QL-006": "CLS-CP-003",
  "CLS-QL-007": "CLS-CP-004",
  "CLS-QL-008": "CLS-CP-005",
  "CLS-QL-009": "CLS-CP-005",
  "CLS-QL-010": "CLS-CP-006",
  "CLS-QL-011": "CLS-CP-006",
  "CLS-QL-012": "CLS-CP-007",
  "CLS-QL-013": "CLS-CP-007",
};

const cpIds = [...new Set(Object.values(QL_TO_CP))] as ClsCpId[];

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("CLS-001 review batches require count between 1 and 50");
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  const language = value ?? "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`CLS-001 does not support language ${String(value)}`);
}

function localeFor(language: QuestionStudioLanguage): "en-IN" | "hi-IN" | "pa-IN" {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

function isQlId(value: string): value is ClsQlId {
  return CLS001_QUESTION_STUDIO_QL_IDS_V1.includes(value as ClsQlId);
}

function isCpId(value: string): value is ClsCpId {
  return cpIds.includes(value as ClsCpId);
}

function resolveQlPool(request: QuestionStudioGenerationRequest): ClsQlId[] {
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
  const qlMatches = [...new Set(selectors.filter(isQlId))];
  const cpMatches = [...new Set(selectors.filter(isCpId))];
  const allowed = new Set<string>([CLS001_QUESTION_STUDIO_PACKAGE_ID_V1, ...CLS001_QUESTION_STUDIO_QL_IDS_V1, ...cpIds]);
  const unknown = selectors.find((selector) => selector.startsWith("CLS-") && !allowed.has(selector));
  if (unknown) throw new Error(`Unknown CLS-001 selector ${unknown}`);
  if (qlMatches.length > 1) throw new Error(`Conflicting CLS-001 QL selectors ${qlMatches.join(", ")}`);
  if (cpMatches.length > 1) throw new Error(`Conflicting CLS-001 checkpoint selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const cpId = cpMatches[0];
  if (qlId && cpId && QL_TO_CP[qlId] !== cpId) {
    throw new Error(`${qlId} is owned by ${QL_TO_CP[qlId]}, not ${cpId}`);
  }
  if (qlId) return [qlId];
  if (cpId) return CLS001_QUESTION_STUDIO_QL_IDS_V1.filter((candidate) => QL_TO_CP[candidate] === cpId);
  return [...CLS001_QUESTION_STUDIO_QL_IDS_V1];
}

export function isCls001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === CLS001_QUESTION_STUDIO_PACKAGE_ID_V1;
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.some((selector) => selector.startsWith("CLS-QL-") || selector.startsWith("CLS-CP-"))) return true;
  const topic = text(request.topic).toLowerCase();
  return topic === "classification" || topic === "classification / odd one out" || topic === "odd one out";
}

function requestedOptionCount(seed: number): 4 | 5 {
  return seed % 4 === 0 ? 5 : 4;
}

function generateCanonicalQuestion(qlId: ClsQlId, language: QuestionStudioLanguage, numericSeed: number): Record<string, unknown> {
  const locale = localeFor(language);
  const optionCount = requestedOptionCount(numericSeed);

  if (qlId === "CLS-QL-001" || qlId === "CLS-QL-002" || qlId === "CLS-QL-003") {
    return generateClsCp001Question(qlId, locale, numericSeed) as unknown as Record<string, unknown>;
  }
  if (qlId === "CLS-QL-004") {
    return generateClsCp002Question(qlId, locale, numericSeed) as unknown as Record<string, unknown>;
  }
  if (qlId === "CLS-QL-005" || qlId === "CLS-QL-006") {
    return (language === "en"
      ? generateClsCp003EnglishQuestion(qlId, numericSeed, optionCount)
      : generateClsCp003LocalizedQuestionV5(qlId, locale, numericSeed, optionCount)) as unknown as Record<string, unknown>;
  }
  if (qlId === "CLS-QL-007") {
    return (language === "en"
      ? generateClsCp004EnglishQuestion(qlId, numericSeed, optionCount)
      : generateClsCp004LocalizedQuestion(locale, numericSeed, optionCount)) as unknown as Record<string, unknown>;
  }
  if (qlId === "CLS-QL-008" || qlId === "CLS-QL-009") {
    return (language === "en"
      ? generateClsCp005EnglishQuestion(qlId, numericSeed, optionCount)
      : generateClsCp005LearnerReviewV2(qlId, locale, numericSeed, optionCount)) as unknown as Record<string, unknown>;
  }
  if (qlId === "CLS-QL-010" || qlId === "CLS-QL-011") {
    return (language === "en"
      ? generateClsCp006EnglishQuestion(qlId, numericSeed, optionCount)
      : generateClsCp006LearnerReviewV2(qlId, locale, numericSeed, optionCount)) as unknown as Record<string, unknown>;
  }
  if (qlId === "CLS-QL-012") {
    const prototype = CLS_CP007_PROTOTYPES[numericSeed % CLS_CP007_PROTOTYPES.length]!;
    return (language === "en"
      ? generateClsCp007PermanentClusterQuestion(prototype.prototypeId, numericSeed, optionCount)
      : generateClsCp007LocalizedClusterQuestionV3(locale, prototype.prototypeId, numericSeed, optionCount)) as unknown as Record<string, unknown>;
  }
  return (language === "en"
    ? generateClsCp007PermanentClusterPairQuestion(numericSeed, optionCount)
    : generateClsCp007LocalizedPairQuestionV3(locale, numericSeed, optionCount)) as unknown as Record<string, unknown>;
}

function displayOption(option: unknown): unknown {
  if (typeof option === "string" || typeof option === "number") return option;
  if (option && typeof option === "object") {
    const record = option as Record<string, unknown>;
    if (record.value != null) return record.value;
    if (record.text != null) return record.text;
    if (record.label != null) return record.label;
  }
  return option;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function explanationText(question: Record<string, unknown>): string {
  const explanation = question.explanation;
  if (typeof explanation === "string") return explanation;
  if (!explanation || typeof explanation !== "object") return "";
  const record = explanation as Record<string, unknown>;
  const parts = [
    ...stringList(record.coreConcept),
    ...stringList(record.stepByStep),
  ];
  if (typeof record.ruleStatement === "string") parts.unshift(record.ruleStatement);
  if (typeof record.conclusion === "string") parts.push(record.conclusion);
  return parts.join("\n\n");
}

function normalizeDifficulty(question: Record<string, unknown>): string {
  const direct = question.difficulty;
  if (typeof direct === "string") return direct;
  const metadata = question.metadata;
  if (metadata && typeof metadata === "object") {
    const value = (metadata as Record<string, unknown>).difficulty;
    if (typeof value === "string") return value;
  }
  return "Mixed";
}

export const CLS001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Reasoning",
  topic: "Classification / Odd One Out",
  subtopic: "Classification",
  label: "Reasoning · Classification / Odd One Out · CLS-001",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: false,
  runtimeMode: CLS001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [CLS001_QUESTION_STUDIO_RUNTIME_MODE_V1],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode ?? undefined,
  questionBankAcceptanceAuthority: lifecycle.questionBankAcceptanceAuthority,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    registrationAuthorityId: CLS001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    permanentQlRange: "CLS-QL-001..CLS-QL-013",
    permanentQlCount: CLS001_QUESTION_STUDIO_QL_IDS_V1.length,
    multilingualReviewAuthority: true,
    deterministicGeneration: true,
    reviewOnly: true,
    difficultySelectionStatus: "NOT_UNIFIED_ACROSS_CHECKPOINTS",
    cp008Status: "CLOSED_ZERO_NEW_QL",
  },
};

export const cls001QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "reasoning-v1",

  listPackages() {
    return [CLS001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (!isCls001QuestionStudioRequest(request)) {
      throw new Error(`CLS-001 cannot resolve package ${String(request.packageId ?? request.topic ?? "unknown")}`);
    }
    if (request.runtimeMode && request.runtimeMode !== CLS001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`CLS-001 only supports ${CLS001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime during review`);
    }
    if (request.difficulty && text(request.difficulty).toLowerCase() !== "mixed") {
      throw new Error("CLS-001 Studio difficulty filtering is intentionally disabled until a chapter-wide calibrated selector is implemented");
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const pool = resolveQlPool(request);
    const baseSeed = text(request.seed) || "cls001-question-studio-review-v1";
    const start = hash(`${baseSeed}:ql-start`) % pool.length;
    const questions: Record<string, unknown>[] = [];

    for (let index = 0; index < count; index += 1) {
      const qlId = pool[(start + index) % pool.length]!;
      const itemSeed = `${baseSeed}:${qlId}:${index}`;
      const numericSeed = hash(itemSeed);
      const generated = generateCanonicalQuestion(qlId, language, numericSeed);
      const rawOptions = Array.isArray(generated.options) ? generated.options : [];
      const options = rawOptions.map(displayOption);
      const correctIndex = typeof generated.correctIndex === "number"
        ? generated.correctIndex
        : typeof generated.correct === "number"
          ? generated.correct
          : 0;
      const stem = typeof generated.stem === "string"
        ? generated.stem
        : typeof generated.text === "string"
          ? generated.text
          : "";
      const answer = generated.answer ?? options[correctIndex];
      const cpId = QL_TO_CP[qlId];
      const questionId = `CLS-001:${qlId}:${numericSeed}:${language}`;

      questions.push({
        ...lifecycle,
        id: questionId,
        questionId,
        packageId: CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: qlId,
        qlId,
        cpId,
        checkpointId: cpId,
        subject: "Reasoning",
        topic: "Classification / Odd One Out",
        subtopic: "Classification",
        language,
        locale: localeFor(language),
        stem,
        text: stem,
        options,
        correctIndex,
        correct: correctIndex,
        answer,
        canonicalAnswer: options[correctIndex],
        explanation: explanationText(generated),
        packageExplanation: generated.explanation,
        packageMetadata: generated.metadata,
        sourceLifecycle: generated.lifecycle,
        difficulty: normalizeDifficulty(generated),
        difficultyLabel: normalizeDifficulty(generated),
        generationSeed: itemSeed,
        numericSeed,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: CLS001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        reviewOnly: true,
        readOnly: true,
        productionReleased: false,
      });
    }

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "reasoning-v1",
        packageId: CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: CLS001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: CLS001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        permanentQlCount: CLS001_QUESTION_STUDIO_QL_IDS_V1.length,
        permanentQlIds: [...CLS001_QUESTION_STUDIO_QL_IDS_V1],
        cpIds: [...cpIds],
        language,
        difficultyFilterApplied: false,
        difficultySelectionStatus: "NOT_UNIFIED_ACROSS_CHECKPOINTS",
        seed: baseSeed,
        count,
      },
    };
  },
};
