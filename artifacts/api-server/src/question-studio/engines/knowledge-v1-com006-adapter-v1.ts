import {
  COM006_ENGLISH_FREEZE_AUTHORITY_V1,
  COM006_ENGLISH_FROZEN,
  COM006_HINDI_FROZEN,
  COM006_LOCALIZATION_FREEZE_AUTHORITY_V1,
  COM006_PUNJABI_FROZEN,
  auditCom006FreezeV1,
  type Com006FrozenQuestion,
} from "../../knowledge-v1/computer-awareness/com006-cyber-security-freeze-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const COM006_QUESTION_STUDIO_PACKAGE_ID_V1 = "COM-006" as const;
export const COM006_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const COM006_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;
export const COM006_CONTENT_AUTHORITY_VERSION_V1 =
  "COM-006-ENGLISH-FREEZE-V1_HI-PA-LOCALIZATION-FREEZE-V1" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const supportedDifficulties = ["Easy", "Medium"] as const;
const qlIds = COM006_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds as readonly string[];
const cpIds = ["COM-006-CP-001"] as const;
const freezeAudit = auditCom006FreezeV1();

if (!freezeAudit.valid) {
  throw new Error(`COM-006 freeze invalid: ${freezeAudit.issues.join(", ")}`);
}

type Com006CorpusRecord = Com006FrozenQuestion & {
  cpId: (typeof cpIds)[number];
};

function corpusFor(language: QuestionStudioLanguage): readonly Com006FrozenQuestion[] {
  if (language === "en") return COM006_ENGLISH_FROZEN;
  if (language === "hi") return COM006_HINDI_FROZEN;
  return COM006_PUNJABI_FROZEN;
}

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language) return "en";
  if (supportedLanguages.includes(language)) return language;
  throw new Error(`COM-006 does not support language ${String(language)}`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("COM-006 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Easy" || difficulty === "Medium") return difficulty;
  if (difficulty === "Hard") throw new Error("COM-006 Hard difficulty is not authorized");
  throw new Error("COM-006 difficulty must be Easy, Medium or Mixed");
}

function selectorValues(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter(Boolean);
}

function normalizeQlSelector(request: QuestionStudioGenerationRequest): string | undefined {
  const selectors = selectorValues(request).filter((value) => qlIds.includes(value));
  if (new Set(selectors).size > 1) {
    throw new Error(`Conflicting COM-006 QL selectors ${selectors.join(", ")}`);
  }
  return selectors[0];
}

function hash(seed: string): number {
  let value = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function shuffled<T>(items: readonly T[], seed: string): T[] {
  const result = [...items];
  let state = hash(seed) || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function toRecord(question: Com006FrozenQuestion): Com006CorpusRecord {
  return { ...question, cpId: cpIds[0] };
}

function recordForOutput(record: Com006CorpusRecord) {
  return {
    ...lifecycle,
    questionBankAcceptanceAuthority: lifecycle.questionBankAcceptanceAuthority,
    id: record.questionId,
    questionId: record.questionId,
    sourceQuestionId: record.sourceQuestionId,
    packageId: COM006_QUESTION_STUDIO_PACKAGE_ID_V1,
    patternId: record.qlId,
    qlId: record.qlId,
    cpId: record.cpId,
    subject: "Computer Awareness",
    topic: "Computer Awareness",
    subtopic: "Cyber Security",
    language: record.language,
    locale: record.locale,
    stem: record.stem,
    text: record.stem,
    options: [...record.options],
    correctIndex: record.correctIndex,
    correct: record.correctIndex,
    answer: record.canonicalAnswer,
    canonicalAnswer: record.canonicalAnswer,
    explanation: record.explanation,
    sourceFactIds: [...record.sourceFactIds],
    sourceEnglishFrozen: record.sourceEnglishFrozen,
    sourceEnglishAuthorityId: record.sourceEnglishAuthorityId,
    sourceLocalizationFrozen: record.sourceLocalizationFrozen,
    difficulty: record.difficulty === "EASY" ? "Easy" : "Medium",
    difficultyLabel: record.difficulty === "EASY" ? "Easy" : "Medium",
    registrationStatus: "REGISTERED_BANK_ONLY_INTERNAL",
    registrationAuthorityId: COM006_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
    questionStudioDiscoverable: true,
    questionStudioGenerationEnabled: true,
    readOnly: true,
    revisionPolicy: COM006_REVISION_POLICY_V1,
    productionReleased: false,
    questionStudioReview: {
      ...lifecycle,
      registrationStatus: "REGISTERED_BANK_ONLY_INTERNAL",
      registrationAuthorityId: COM006_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      runtimeMode: COM006_QUESTION_STUDIO_RUNTIME_MODE_V1,
      contentAuthorityVersion: COM006_CONTENT_AUTHORITY_VERSION_V1,
      humanReviewApproved: true,
      frozenCorpusOnly: true,
      immutableCorpus: true,
      deterministicSelection: true,
      selectionWithoutReplacement: true,
      sourceEnglishAuthorityId: COM006_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      localizationFreezeAuthorityId: COM006_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
      revisionPolicy: COM006_REVISION_POLICY_V1,
      hardDifficultyAuthorized: false,
      productionDifficultyClaimAuthorized: false,
    },
  };
}

export const COM006_STANDARD_BANK_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: COM006_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Computer Awareness",
  topic: "Computer Awareness",
  subtopic: "Cyber Security",
  label: "Computer Awareness · Cyber Security · English Freeze V1 / Hi-Pa Localization Freeze V1",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: COM006_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [COM006_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    ...lifecycle,
    reviewOnly: false,
    humanReviewApproved: true,
    frozenCorpusOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    registrationAuthorityId: COM006_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
    contentAuthorityVersion: COM006_CONTENT_AUTHORITY_VERSION_V1,
    permanentQlIds: [...qlIds],
    qlCount: qlIds.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    englishQuestionCount: COM006_ENGLISH_FROZEN.length,
    hindiQuestionCount: COM006_HINDI_FROZEN.length,
    punjabiQuestionCount: COM006_PUNJABI_FROZEN.length,
    englishFreezeAuthorityId: COM006_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    localizationFreezeAuthorityId: COM006_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
    localizationCombinedFingerprint: COM006_LOCALIZATION_FREEZE_AUTHORITY_V1.combinedFingerprint,
    revisionPolicy: COM006_REVISION_POLICY_V1,
    difficultyFilterSupported: true,
    supportedDifficulties: [...supportedDifficulties],
    hardDifficultyAuthorized: false,
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isCom006QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === COM006_QUESTION_STUDIO_PACKAGE_ID_V1;
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase());
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return selectors.some((value) => value.startsWith("COM-006"))
    || (subject === "computer awareness" && subtopic === "cyber security")
    || topic === "cyber security";
}

export const knowledgeV1Com006QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [COM006_STANDARD_BANK_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== COM006_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`knowledge-v1 COM-006 adapter cannot generate package ${request.packageId}`);
    }
    if (request.runtimeMode && request.runtimeMode !== COM006_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`COM-006 only supports ${COM006_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const requestedDifficulty = normalizeDifficulty(request.difficulty);
    const qlId = normalizeQlSelector(request);
    const seed = request.seed?.trim() || "com006-question-studio-cyber-security-v1";
    const candidates = corpusFor(language)
      .map(toRecord)
      .filter((record) => (!qlId || record.qlId === qlId)
        && (requestedDifficulty === "Mixed"
          || (requestedDifficulty === "Easy" && record.difficulty === "EASY")
          || (requestedDifficulty === "Medium" && record.difficulty === "MEDIUM")));

    if (!candidates.length) {
      throw new Error(`COM-006 selectors produced no ${requestedDifficulty} frozen questions`);
    }
    if (count > candidates.length) {
      throw new Error(`COM-006 cannot fill ${count} questions from a ${candidates.length}-question frozen pool without repeats`);
    }

    const selected = shuffled(
      candidates,
      `${seed}:COM-006:${qlId ?? "ALL"}:${requestedDifficulty}`,
    ).slice(0, count);
    const questions = selected.map(recordForOutput);

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: COM006_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: COM006_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_BANK_ONLY_INTERNAL",
        registrationAuthorityId: COM006_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
        reviewOnly: false,
        humanReviewApproved: true,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        contentAuthorityVersion: COM006_CONTENT_AUTHORITY_VERSION_V1,
        revisionPolicy: COM006_REVISION_POLICY_V1,
        language,
        locale: `${language}-IN`,
        requestedDifficulty,
        difficultyFilterApplied: requestedDifficulty !== "Mixed",
        productionDifficultyClaimAuthorized: false,
        hardDifficultyAuthorized: false,
        qlSelection: qlId ?? "DETERMINISTIC_ACROSS_PERMANENT_QLS",
        permanentQlIds: [...qlIds],
        cpIds: [...cpIds],
        candidatePoolSize: candidates.length,
        selectionMode: "FROZEN_COM006_DETERMINISTIC_WITHOUT_REPLACEMENT",
        seed,
        count,
        englishFreezeAuthorityId: COM006_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
        localizationFreezeAuthorityId: COM006_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
        localizationCombinedFingerprint: COM006_LOCALIZATION_FREEZE_AUTHORITY_V1.combinedFingerprint,
      },
    };
  },
};
