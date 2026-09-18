import {
  generateClsCp001Question,
} from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-001";
import {
  generateClsCp002Question,
} from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-002";
import { generateClsCp003EnglishQuestion } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-003/cp003-english-runtime";
import { generateClsCp003LocalizedQuestionV5 } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-003/cp003-localized-runtime-v5";
import { generateClsCp004EnglishQuestion } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-004/cp004-english-runtime";
import { generateClsCp004LocalizedReviewQuestion } from "../../reasoning-v1/topics/Classification/CLS-001/CLS-CP-004/cp004-localized-review-runtime";
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
import type {
  QuestionStudioDifficulty,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const CLS001_QUESTION_STUDIO_PACKAGE_ID_V1 = "CLS-001" as const;
export const CLS001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const CLS001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  "CLS-001-FINAL-CHAPTER-CLOSURE-20260918" as const;

export const CLS001_PERMANENT_QL_IDS_V1 = [
  "CLS-QL-001",
  "CLS-QL-002",
  "CLS-QL-003",
  "CLS-QL-004",
  "CLS-QL-005",
  "CLS-QL-006",
  "CLS-QL-007",
  "CLS-QL-008",
  "CLS-QL-009",
  "CLS-QL-010",
  "CLS-QL-011",
  "CLS-QL-012",
  "CLS-QL-013",
] as const;

export type Cls001PermanentQlId = typeof CLS001_PERMANENT_QL_IDS_V1[number];

export const CLS001_GENERATIVE_CP_IDS_V1 = [
  "CLS-CP-001",
  "CLS-CP-002",
  "CLS-CP-003",
  "CLS-CP-004",
  "CLS-CP-005",
  "CLS-CP-006",
  "CLS-CP-007",
] as const;

export type Cls001GenerativeCpId = typeof CLS001_GENERATIVE_CP_IDS_V1[number];

const QL_TO_CP: Readonly<Record<Cls001PermanentQlId, Cls001GenerativeCpId>> = {
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

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

type ApprovedLocale = "en-IN" | "hi-IN" | "pa-IN";
type GeneratedRecord = Record<string, unknown>;

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

function localeFor(language: QuestionStudioLanguage): ApprovedLocale {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
}

function normalizeRequestedDifficulty(value: unknown): QuestionStudioDifficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  throw new Error(`CLS-001 difficulty must be Easy, Medium, Hard or Mixed; received ${String(value)}`);
}

function normalizedDifficulty(value: unknown): QuestionStudioDifficulty {
  const normalized = text(value).toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "hard") return "Hard";
  return "Medium";
}

function isQlId(value: string): value is Cls001PermanentQlId {
  return CLS001_PERMANENT_QL_IDS_V1.includes(value as Cls001PermanentQlId);
}

function isCpId(value: string): value is Cls001GenerativeCpId {
  return CLS001_GENERATIVE_CP_IDS_V1.includes(value as Cls001GenerativeCpId);
}

function resolveQlPool(request: QuestionStudioGenerationRequest): Cls001PermanentQlId[] {
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);

  if (selectors.includes("CLS-CP-008")) {
    throw new Error("CLS-CP-008 is a closed zero-allocation ownership checkpoint and has no generative QL.");
  }

  const qlMatches = [...new Set(selectors.filter(isQlId))];
  const cpMatches = [...new Set(selectors.filter(isCpId))];
  const allowed = new Set<string>([
    CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
    "CLS-CP-008",
    ...CLS001_PERMANENT_QL_IDS_V1,
    ...CLS001_GENERATIVE_CP_IDS_V1,
  ]);
  const unknownSelector = selectors.find((selector) => selector.startsWith("CLS-") && !allowed.has(selector));
  if (unknownSelector) throw new Error(`Unknown CLS-001 selector ${unknownSelector}`);
  if (qlMatches.length > 1) throw new Error(`Conflicting CLS-001 QL selectors ${qlMatches.join(", ")}`);
  if (cpMatches.length > 1) throw new Error(`Conflicting CLS-001 checkpoint selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const cpId = cpMatches[0];
  if (qlId && cpId && QL_TO_CP[qlId] !== cpId) {
    throw new Error(`${qlId} is owned by ${QL_TO_CP[qlId]}, not ${cpId}`);
  }
  if (qlId) return [qlId];
  if (cpId) return CLS001_PERMANENT_QL_IDS_V1.filter((candidate) => QL_TO_CP[candidate] === cpId);
  return [...CLS001_PERMANENT_QL_IDS_V1];
}

function optionText(option: unknown): string {
  if (typeof option === "string" || typeof option === "number") return String(option);
  if (option && typeof option === "object") {
    const value = option as Record<string, unknown>;
    for (const key of ["value", "text", "label", "answer"]) {
      if (typeof value[key] === "string" || typeof value[key] === "number") return String(value[key]);
    }
  }
  return String(option ?? "");
}

function arrayOfStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.map((entry) => String(entry)) : [];
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function removeInlineMathContaining(value: string, token: string): string {
  let next = value;
  while (true) {
    const tokenIndex = next.indexOf(token);
    if (tokenIndex < 0) break;
    const start = next.lastIndexOf("\\(", tokenIndex);
    const end = next.indexOf("\\)", tokenIndex);
    if (start < 0 || end < 0) break;
    next = `${next.slice(0, start)}${next.slice(end + 2)}`;
  }
  return next;
}

function cleanLearnerText(value: string): string {
  let next = value
    .replace(/[✅❌]/gu, "")
    .replaceAll("\\operatorname{GCD}", "HCF")
    .replaceAll("\\operatorname{gcd}", "HCF")
    .replaceAll("\\operatorname{LCM}", "LCM")
    .replace(/\\operatorname\{reverse\}\((\d+)\)\s*=\s*(\d+)/gu, "$1 → $2")
    .replace(/\\operatorname\{digits\}\((\d+)\)\s*=\s*\\\{([^}]*)\\\}/gu, "$1 → {$2}")
    .replaceAll("विषम (अलग)", "अलग")
    .replaceAll("ਇੱਕੋ ਅੰਦਰੂਨੀ ਨਿਯਮ", "ਇੱਕੋ ਨਿਯਮ")
    .replace(/\s+—\s*$/u, "");

  for (const token of ["\\mathbb", "D_"]) {
    next = removeInlineMathContaining(next, token);
  }
  return next.replace(/\s{2,}/gu, " ").trim();
}

function conclusion(language: QuestionStudioLanguage, answer: string): string {
  if (language === "hi") return `इसलिए सही उत्तर ${answer} है।`;
  if (language === "pa") return `ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${answer} ਹੈ।`;
  return `Therefore, the correct answer is ${answer}.`;
}

function learnerExplanation(
  generated: GeneratedRecord,
  language: QuestionStudioLanguage,
  qlId: Cls001PermanentQlId,
  correctIndex: number,
  answer: string,
): { readonly text: string; readonly coreConcept: readonly string[]; readonly steps: readonly string[] } {
  const explanation = record(generated.explanation);
  const coreConcept = arrayOfStrings(explanation.coreConcept).map(cleanLearnerText).filter(Boolean);
  const sourceSteps = arrayOfStrings(explanation.stepByStep).map(cleanLearnerText).filter(Boolean);
  const evidence = arrayOfStrings(generated.evidenceByOption).map(cleanLearnerText);
  const representativeIndex = evidence.findIndex((_, index) => index !== correctIndex);

  let steps: string[];
  if (evidence.length > correctIndex && representativeIndex >= 0) {
    if (qlId === "CLS-QL-009" && sourceSteps[0]) {
      steps = [sourceSteps[0], evidence[correctIndex]!, conclusion(language, answer)];
    } else {
      steps = [evidence[representativeIndex]!, evidence[correctIndex]!, conclusion(language, answer)];
    }
  } else {
    steps = [...sourceSteps.slice(0, 3)];
    if (!steps.some((step) => step.includes(answer))) steps.push(conclusion(language, answer));
  }

  const cleanedSteps = steps.map(cleanLearnerText).filter(Boolean);
  return {
    text: [...coreConcept, ...cleanedSteps].join("\n\n"),
    coreConcept,
    steps: cleanedSteps,
  };
}

function cp007Prototype(seed: number) {
  return CLS_CP007_PROTOTYPES[seed % CLS_CP007_PROTOTYPES.length]!.prototypeId;
}

function generateApprovedQuestion(
  qlId: Cls001PermanentQlId,
  language: QuestionStudioLanguage,
  numericSeed: number,
  optionCount: 4 | 5,
): GeneratedRecord {
  const locale = localeFor(language);
  switch (qlId) {
    case "CLS-QL-001":
    case "CLS-QL-002":
    case "CLS-QL-003":
      return generateClsCp001Question(qlId, locale, numericSeed) as unknown as GeneratedRecord;
    case "CLS-QL-004":
      return generateClsCp002Question("CLS-QL-004", locale, numericSeed) as unknown as GeneratedRecord;
    case "CLS-QL-005":
    case "CLS-QL-006":
      return language === "en"
        ? generateClsCp003EnglishQuestion(qlId, numericSeed, optionCount) as unknown as GeneratedRecord
        : generateClsCp003LocalizedQuestionV5(qlId, locale, numericSeed, optionCount) as unknown as GeneratedRecord;
    case "CLS-QL-007":
      return language === "en"
        ? generateClsCp004EnglishQuestion("CLS-QL-007", numericSeed, optionCount) as unknown as GeneratedRecord
        : generateClsCp004LocalizedReviewQuestion(locale, numericSeed, optionCount) as unknown as GeneratedRecord;
    case "CLS-QL-008":
    case "CLS-QL-009":
      return language === "en"
        ? generateClsCp005EnglishQuestion(qlId, numericSeed, optionCount) as unknown as GeneratedRecord
        : generateClsCp005LearnerReviewV2(qlId, locale, numericSeed, optionCount) as unknown as GeneratedRecord;
    case "CLS-QL-010":
    case "CLS-QL-011":
      return language === "en"
        ? generateClsCp006EnglishQuestion(qlId, numericSeed, optionCount) as unknown as GeneratedRecord
        : generateClsCp006LearnerReviewV2(qlId, locale, numericSeed, optionCount) as unknown as GeneratedRecord;
    case "CLS-QL-012": {
      const prototypeId = cp007Prototype(numericSeed);
      return language === "en"
        ? generateClsCp007PermanentClusterQuestion(prototypeId, numericSeed, optionCount) as unknown as GeneratedRecord
        : generateClsCp007LocalizedClusterQuestionV3(locale, prototypeId, numericSeed, optionCount) as unknown as GeneratedRecord;
    }
    case "CLS-QL-013":
      return language === "en"
        ? generateClsCp007PermanentClusterPairQuestion(numericSeed, optionCount) as unknown as GeneratedRecord
        : generateClsCp007LocalizedPairQuestionV3(locale, numericSeed, optionCount) as unknown as GeneratedRecord;
  }
}

function sourceDifficulty(generated: GeneratedRecord): QuestionStudioDifficulty {
  const metadata = record(generated.metadata);
  const difficulty = generated.difficulty ?? generated.difficultyLabel ?? metadata.difficulty;
  return normalizedDifficulty(difficulty);
}

function resolveInstance(
  preferredQl: Cls001PermanentQlId,
  pool: readonly Cls001PermanentQlId[],
  language: QuestionStudioLanguage,
  baseSeed: string,
  index: number,
  requestedDifficulty: QuestionStudioDifficulty | undefined,
) {
  const qlCandidates = [preferredQl, ...pool.filter((qlId) => qlId !== preferredQl)];
  const attemptsPerQl = requestedDifficulty ? 120 : 12;

  for (const qlId of qlCandidates) {
    for (let attempt = 0; attempt < attemptsPerQl; attempt += 1) {
      const itemSeed = `${baseSeed}:${qlId}:${index}:attempt:${attempt}`;
      const numericSeed = hash(itemSeed);
      const optionCount = hash(`${itemSeed}:option-count`) % 4 === 0 ? 5 : 4;
      try {
        const generated = generateApprovedQuestion(qlId, language, numericSeed, optionCount);
        const difficulty = sourceDifficulty(generated);
        if (!requestedDifficulty || difficulty === requestedDifficulty) {
          return { qlId, generated, difficulty, itemSeed, numericSeed, optionCount, attempt };
        }
      } catch {
        continue;
      }
    }
  }

  throw new Error(
    requestedDifficulty
      ? `CLS-001 could not produce a ${requestedDifficulty} instance for the requested QL/checkpoint scope without relabelling difficulty.`
      : "CLS-001 could not produce a valid deterministic instance for the requested scope.",
  );
}

export function isCls001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === CLS001_QUESTION_STUDIO_PACKAGE_ID_V1;
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.some((selector) => selector.startsWith("CLS-QL-") || selector.startsWith("CLS-CP-"))) return true;
  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === "classification"
    || topic === "odd one out"
    || subtopic === "classification"
    || subtopic === "odd one out";
}

export const CLS001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Reasoning",
  topic: "Classification",
  subtopic: "Odd One Out",
  label: "Reasoning · Classification / Odd One Out · CLS-001",
  enabled: true,
  cpIds: [...CLS001_GENERATIVE_CP_IDS_V1],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: CLS001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [CLS001_QUESTION_STUDIO_RUNTIME_MODE_V1],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
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
    qlCount: CLS001_PERMANENT_QL_IDS_V1.length,
    generativeCheckpointCount: CLS001_GENERATIVE_CP_IDS_V1.length,
    ownershipClosureCheckpointId: "CLS-CP-008",
    ownershipClosureAllocatedQlCount: 0,
    deterministicGeneration: true,
    reviewOnly: true,
    localeAuthority: "APPROVED_MULTILINGUAL_REVIEW_SURFACES",
    learnerPresentationPolicy: "COMPACT_NO_FORCED_SHORTCUT_TRAP_NO_ROUTINE_OPTION_ANALYSIS",
    sourceStateAuthorityPreserved: true,
    productionReleaseAuthorized: false,
  },
};

export async function generateCls001QuestionStudioQuestions(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (!isCls001QuestionStudioRequest(request)) {
    throw new Error(`CLS-001 cannot resolve request ${String(request.packageId ?? request.topic ?? "unknown")}`);
  }
  if (request.runtimeMode && request.runtimeMode !== CLS001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
    throw new Error(`CLS-001 only supports ${CLS001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime during review`);
  }

  const language = normalizeLanguage(request.language);
  const count = normalizeCount(request.count);
  const requestedDifficulty = normalizeRequestedDifficulty(request.difficulty);
  const pool = resolveQlPool(request);
  const baseSeed = text(request.seed) || "cls001-question-studio-review-v1";
  const start = hash(`${baseSeed}:ql-start`) % pool.length;
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const preferredQl = pool[(start + index) % pool.length]!;
    const resolved = resolveInstance(
      preferredQl,
      pool,
      language,
      baseSeed,
      index,
      requestedDifficulty,
    );
    const { qlId, generated, difficulty, itemSeed, numericSeed, optionCount, attempt } = resolved;
    const cpId = QL_TO_CP[qlId];
    const options = Array.isArray(generated.options)
      ? generated.options.map(optionText)
      : [];
    const correctIndex = Number(generated.correctIndex);
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      throw new Error(`${qlId}/${numericSeed} returned invalid correctIndex ${String(generated.correctIndex)}`);
    }
    const answer = text(generated.answer) || options[correctIndex]!;
    const explanation = learnerExplanation(generated, language, qlId, correctIndex, answer);
    const sourceMetadata = record(generated.metadata);
    const questionId = `CLS-001:${qlId}:${numericSeed}:${language}`;

    questions.push({
      ...lifecycle,
      id: questionId,
      questionId,
      packageId: CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: qlId,
      qlId,
      permanentQlId: qlId,
      cpId,
      checkpointId: cpId,
      subject: "Reasoning",
      topic: "Classification",
      subtopic: "Odd One Out",
      language,
      locale: localeFor(language),
      stem: cleanLearnerText(text(generated.stem)),
      text: cleanLearnerText(text(generated.stem)),
      options,
      correctIndex,
      correct: correctIndex,
      answer,
      canonicalAnswer: options[correctIndex],
      explanation: explanation.text,
      reviewExplanation: {
        coreConcept: explanation.coreConcept,
        stepByStep: explanation.steps,
        examSpeedShortcut: [],
        commonTrapWarning: [],
      },
      difficulty,
      difficultyLabel: difficulty,
      requestedDifficulty: request.difficulty ?? null,
      requestedDifficultyApplied: requestedDifficulty ? difficulty === requestedDifficulty : false,
      difficultySearchAttempts: attempt + 1,
      requestedExam: request.exam ?? null,
      examProfileApplied: false,
      optionCount,
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
      sourceStateAuthorityPreserved: true,
      traceability: {
        packageId: CLS001_QUESTION_STUDIO_PACKAGE_ID_V1,
        qlId,
        checkpointId: cpId,
        sourceRuntimeVersion: sourceMetadata.runtimeVersion ?? null,
        sourcePrototypeId: generated.prototypeId ?? sourceMetadata.sourcePrototypeId ?? null,
        intendedRuleId: generated.intendedRuleId ?? null,
        sourceReviewStatus: record(generated.lifecycle).reviewStatus ?? null,
      },
      validation: {
        correctAnswerMatchesOption: options[correctIndex] === answer || options[correctIndex] === text(generated.canonicalAnswer),
        optionCount: options.length,
        optionValuesUnique: new Set(options).size === options.length,
        learnerShortcutBlockEmpty: true,
        learnerTrapBlockEmpty: true,
        routineOptionAnalysisSuppressed: explanation.steps.length <= 4,
        sourceDifficultyPreserved: true,
      },
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
      permanentQlCount: CLS001_PERMANENT_QL_IDS_V1.length,
      permanentQlIds: [...CLS001_PERMANENT_QL_IDS_V1],
      generativeCpIds: [...CLS001_GENERATIVE_CP_IDS_V1],
      ownershipClosureCheckpointId: "CLS-CP-008",
      ownershipClosureAllocatedQlCount: 0,
      language,
      requestedDifficulty: requestedDifficulty ?? "Mixed",
      difficultyFilterApplied: Boolean(requestedDifficulty),
      requestedExam: request.exam ?? null,
      examProfileApplied: false,
      seed: baseSeed,
      count,
    },
  };
}
