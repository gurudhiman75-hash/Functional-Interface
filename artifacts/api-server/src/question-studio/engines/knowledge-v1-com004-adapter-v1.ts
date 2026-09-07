import { auditCom004DifficultyAuthorityV2, classifyCom004DifficultyV2, COM004_DIFFICULTY_AUTHORITY_VERSION_V2 } from "../../knowledge-v1/computer-awareness/com004-difficulty-authority-v2";
import { COM004_ENGLISH_CHAPTER_V3, COM004_ENGLISH_FREEZE_AUTHORITY_V3, COM004_LOCALIZATION_CHAPTER_V3, COM004_LOCALIZATION_FREEZE_AUTHORITY_V3, COM004_EDITORIAL_APPROVAL_V3, auditCom004EditorialCorpusV3 } from "../../knowledge-v1/computer-awareness/com004-editorial-corpus-v3";
import type {
  Com004EnglishChapterQuestionV1,
} from "../../knowledge-v1/computer-awareness/com004-english-chapter-candidate-v1";
import type {
  Com004LocalizedQuestionV1,
} from "../../knowledge-v1/computer-awareness/com004-localization-core-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V2 } from "./com004-bank-only-activation-authority-v2";

export const COM004_QUESTION_STUDIO_PACKAGE_ID_V1 = "COM-004" as const;
export const COM004_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const COM004_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;
export const COM004_CONTENT_AUTHORITY_VERSION_V1 =
  "ENGLISH-FREEZE-V3_HI-PA-LOCALIZATION-FREEZE-V3" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const supportedDifficulties = ["Easy", "Medium"] as const;
const qlIds = COM004_ENGLISH_FREEZE_AUTHORITY_V3.permanentQlIds as readonly string[];
const cpIds = ["COM-004-CP-001"] as const;

const editorialAudit = auditCom004EditorialCorpusV3();
const difficultyAudit = auditCom004DifficultyAuthorityV2();
if (!editorialAudit.valid) throw new Error(`COM-004 editorial corpus invalid: ${editorialAudit.issues.join(", ")}`);
if (!difficultyAudit.valid) throw new Error(`COM-004 difficulty authority invalid: ${difficultyAudit.issues.join(", ")}`);

type Com004CorpusRecord = {
  questionId: string;
  sourceQuestionId: string;
  qlId: string;
  cpId: (typeof cpIds)[number];
  authorityProposalId: string;
  sourceCandidateIds: readonly string[];
  surfaceFamily: string;
  language: QuestionStudioLanguage;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  difficulty: "Easy" | "Medium";
  difficultyDecision: ReturnType<typeof classifyCom004DifficultyV2>;
  sourceEnglishFrozen: true;
  sourceEnglishAuthorityId: string;
  sourceLocalizationFrozen: boolean;
};

function englishRecord(question: Com004EnglishChapterQuestionV1): Com004CorpusRecord {
  const difficultyDecision = classifyCom004DifficultyV2(question);
  return {
    questionId: question.questionId,
    sourceQuestionId: question.questionId,
    qlId: question.qlId,
    cpId: cpIds[0],
    authorityProposalId: question.authorityProposalId,
    sourceCandidateIds: Object.freeze([...question.sourceCandidateIds]),
    surfaceFamily: question.surfaceFamily,
    language: "en",
    locale: "en-IN",
    stem: question.stem,
    options: Object.freeze([...question.options]),
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation,
    difficulty: difficultyDecision.difficulty,
    difficultyDecision,
    sourceEnglishFrozen: true,
    sourceEnglishAuthorityId: COM004_ENGLISH_FREEZE_AUTHORITY_V3.authorityId,
    sourceLocalizationFrozen: true,
  };
}

function localizedRecord(
  question: Com004LocalizedQuestionV1,
): Com004CorpusRecord {
  const source = COM004_ENGLISH_CHAPTER_V3.find(
    (candidate) => candidate.questionId === question.sourceQuestionId,
  );
  if (!source) throw new Error(`COM-004 localization has no English source ${question.sourceQuestionId}`);
  const difficultyDecision = classifyCom004DifficultyV2(source);
  return {
    questionId: question.localizationId,
    sourceQuestionId: question.sourceQuestionId,
    qlId: question.qlId,
    cpId: cpIds[0],
    authorityProposalId: question.authorityProposalId,
    sourceCandidateIds: Object.freeze([...question.sourceCandidateIds]),
    surfaceFamily: question.surfaceFamily,
    language: question.language,
    locale: question.locale,
    stem: question.stem,
    options: Object.freeze([...question.options]),
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation,
    difficulty: difficultyDecision.difficulty,
    difficultyDecision,
    sourceEnglishFrozen: true,
    sourceEnglishAuthorityId: question.sourceEnglishAuthorityId,
    sourceLocalizationFrozen: true,
  };
}

const COM004_QUESTION_STUDIO_CORPUS_V1: readonly Com004CorpusRecord[] = Object.freeze([
  ...COM004_ENGLISH_CHAPTER_V3.map(englishRecord),
  ...COM004_LOCALIZATION_CHAPTER_V3.hi.map(localizedRecord),
  ...COM004_LOCALIZATION_CHAPTER_V3.pa.map(localizedRecord),
]);

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language) return "en";
  if (supportedLanguages.includes(language)) return language;
  throw new Error(`COM-004 does not support language ${String(language)}`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("COM-004 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(
  difficulty: QuestionStudioGenerationRequest["difficulty"],
): "Easy" | "Medium" | "Mixed" {
  if (!difficulty || difficulty === "Mixed") return "Mixed";
  if (difficulty === "Easy" || difficulty === "Medium") return difficulty;
  if (difficulty === "Hard") {
    throw new Error("COM-004 Hard difficulty is not authorized for this frozen corpus");
  }
  throw new Error("COM-004 review difficulty must be Easy, Medium, or Mixed");
}

function selectorValues(request: QuestionStudioGenerationRequest) {
  return [request.questionLanguageId, request.canonicalProblemId, request.patternId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter(Boolean);
}

function normalizeQlSelector(request: QuestionStudioGenerationRequest): string | undefined {
  const candidates = selectorValues(request);
  const qlSelectors = candidates.filter((value) => qlIds.includes(value));
  const cpSelectors = candidates.filter((value) => cpIds.includes(value));
  const unknown = candidates.filter(
    (value) => value !== COM004_QUESTION_STUDIO_PACKAGE_ID_V1 && !qlIds.includes(value) && !cpIds.includes(value),
  );
  if (unknown.length) throw new Error(`Unknown COM-004 selector ${unknown[0]}`);
  if (new Set(qlSelectors).size > 1) throw new Error(`Conflicting COM-004 QL selectors ${qlSelectors.join(", ")}`);
  if (new Set(cpSelectors).size > 1) throw new Error(`Conflicting COM-004 CP selectors ${cpSelectors.join(", ")}`);
  return qlSelectors[0];
}

function normalizeCpSelector(request: QuestionStudioGenerationRequest): string | undefined {
  const candidates = [request.canonicalProblemId, request.patternId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter((value) => cpIds.includes(value as (typeof cpIds)[number]));
  return candidates[0];
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

export function isCom004QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === COM004_QUESTION_STUDIO_PACKAGE_ID_V1;
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase());
  return (
    selectors.some((value) => value.startsWith("COM-004")) ||
    (subject === "computer awareness" && subtopic === "internet, web, e-mail & digital services") ||
    topic === "internet, web, e-mail & digital services"
  );
}

export const COM004_STANDARD_BANK_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: COM004_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Computer Awareness",
  topic: "Computer Awareness",
  subtopic: "Internet, Web, E-mail & Digital Services",
  label: "Computer Awareness · Internet, Web, E-mail & Digital Services · English Freeze V3 / Hi-Pa Localization Freeze V3",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: COM004_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [COM004_QUESTION_STUDIO_RUNTIME_MODE_V1],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
  questionBankAcceptanceAuthority: COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V2.authorityId,
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
    registrationAuthorityId: COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V2.authorityId,
    questionBankAcceptanceAuthority: COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V2.authorityId,
    contentAuthorityVersion: COM004_CONTENT_AUTHORITY_VERSION_V1,
    editorialApproval: COM004_EDITORIAL_APPROVAL_V3,
    permanentQlIds: [...qlIds],
    qlCount: qlIds.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    englishQuestionCount: COM004_LOCALIZATION_FREEZE_AUTHORITY_V3.frozenEnglishQuestionCount,
    hindiQuestionCount: COM004_LOCALIZATION_FREEZE_AUTHORITY_V3.frozenHindiQuestionCount,
    punjabiQuestionCount: COM004_LOCALIZATION_FREEZE_AUTHORITY_V3.frozenPunjabiQuestionCount,
    corpusAuthorityId: COM004_LOCALIZATION_FREEZE_AUTHORITY_V3.authorityId,
    englishFreezeAuthorityId: COM004_ENGLISH_FREEZE_AUTHORITY_V3.authorityId,
    englishContentFingerprint: COM004_ENGLISH_FREEZE_AUTHORITY_V3.contentFingerprint,
    localizationFreezeAuthorityId: COM004_LOCALIZATION_FREEZE_AUTHORITY_V3.authorityId,
    localizationCombinedFingerprint: COM004_LOCALIZATION_FREEZE_AUTHORITY_V3.fingerprints.combinedFingerprint,
    revisionPolicy: COM004_REVISION_POLICY_V1,
    difficultyFilterSupported: true,
    supportedDifficulties: [...supportedDifficulties],
    hardDifficultyAuthorized: false,
    difficultyClassifierVersion: COM004_DIFFICULTY_AUTHORITY_VERSION_V2,
    productionDifficultyClaimsAuthorized: false,
  },
};

function recordForOutput(record: Com004CorpusRecord) {
  return {
    ...lifecycle,
    questionBankAcceptanceAuthority: COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V2.authorityId,
    id: record.questionId,
    questionId: record.questionId,
    sourceQuestionId: record.sourceQuestionId,
    packageId: COM004_QUESTION_STUDIO_PACKAGE_ID_V1,
    patternId: record.qlId,
    qlId: record.qlId,
    cpId: record.cpId,
    subject: "Computer Awareness",
    topic: "Computer Awareness",
    subtopic: "Internet, Web, E-mail & Digital Services",
    language: record.language,
    locale: record.locale,
    surfaceFamily: record.surfaceFamily,
    examSurfaceFamily: record.surfaceFamily,
    stem: record.stem,
    text: record.stem,
    options: [...record.options],
    correctIndex: record.correctIndex,
    correct: record.correctIndex,
    answer: record.canonicalAnswer,
    canonicalAnswer: record.canonicalAnswer,
    explanation: record.explanation,
    authorityProposalId: record.authorityProposalId,
    sourceCandidateIds: [...record.sourceCandidateIds],
    sourceEnglishFrozen: record.sourceEnglishFrozen,
    sourceEnglishAuthorityId: record.sourceEnglishAuthorityId,
    sourceLocalizationFrozen: record.sourceLocalizationFrozen,
    difficulty: record.difficulty,
    difficultyLabel: record.difficulty,
    difficultyDecisionV1: record.difficultyDecision,
    packageRegistrationAuthority: COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V2.authorityId,
    registrationAuthorityId: COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V2.authorityId,
    registrationStatus: "REGISTERED_BANK_ONLY_INTERNAL",
    preRegistrationOnly: false,
    questionStudioDiscoverable: true,
    questionStudioGenerationEnabled: true,
    readOnly: true,
    revisionPolicy: COM004_REVISION_POLICY_V1,
    productionReleased: false,
    questionStudioReview: {
      ...lifecycle,
      questionBankAcceptanceAuthority: COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V2.authorityId,
      registrationStatus: "REGISTERED_BANK_ONLY_INTERNAL" as const,
      registrationAuthorityId: COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V2.authorityId,
      runtimeMode: COM004_QUESTION_STUDIO_RUNTIME_MODE_V1,
      contentAuthorityVersion: COM004_CONTENT_AUTHORITY_VERSION_V1,
    editorialApproval: COM004_EDITORIAL_APPROVAL_V3,
      humanReviewApproved: true,
      frozenCorpusOnly: true,
      immutableCorpus: true,
      deterministicSelection: true,
      selectionWithoutReplacement: true,
      englishFreezeAuthorityId: COM004_ENGLISH_FREEZE_AUTHORITY_V3.authorityId,
      localizationFreezeAuthorityId: COM004_LOCALIZATION_FREEZE_AUTHORITY_V3.authorityId,
      localizationCombinedFingerprint: COM004_LOCALIZATION_FREEZE_AUTHORITY_V3.fingerprints.combinedFingerprint,
      revisionPolicy: COM004_REVISION_POLICY_V1,
      difficultyClassifierVersion: COM004_DIFFICULTY_AUTHORITY_VERSION_V2,
      difficultyTopology: record.difficultyDecision.topology,
      difficultyRationale: record.difficultyDecision.rationale,
      productionDifficultyClaimAuthorized: false,
    },
  };
}

export const knowledgeV1Com004QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [COM004_STANDARD_BANK_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== COM004_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`knowledge-v1 COM-004 adapter cannot generate package ${request.packageId}`);
    }
    if (request.runtimeMode && request.runtimeMode !== COM004_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`COM-004 only supports ${COM004_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const requestedDifficulty = normalizeDifficulty(request.difficulty);
    const qlId = normalizeQlSelector(request);
    const cpId = normalizeCpSelector(request);
    const seed = request.seed?.trim() || "com004-question-studio-english-freeze-v2-localization-freeze-v2";

    const candidates = COM004_QUESTION_STUDIO_CORPUS_V1.filter(
      (record) =>
        record.language === language &&
        (!qlId || record.qlId === qlId) &&
        (!cpId || record.cpId === cpId) &&
        (requestedDifficulty === "Mixed" || record.difficulty === requestedDifficulty),
    );
    if (!candidates.length) {
      throw new Error(
        `COM-004 selectors produced no ${requestedDifficulty} frozen questions${qlId ? ` for ${qlId}` : ""}`,
      );
    }
    if (count > candidates.length) {
      throw new Error(
        `COM-004 cannot deterministically fill ${count} questions from a ${candidates.length}-question filtered frozen pool without repeats`,
      );
    }

    const selected = shuffled(
      candidates,
      // Keep the selector seed language-neutral so an English/Hi/Pa review run
      // chooses the same source questions and only changes the rendered copy.
      `${seed}:COM-004:${qlId ?? "ALL"}:${cpId ?? "ALL"}:${requestedDifficulty}`,
    ).slice(0, count);
    const questions = selected.map(recordForOutput);

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: COM004_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: COM004_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_BANK_ONLY_INTERNAL",
        registrationAuthorityId: COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V2.authorityId,
        reviewOnly: false,
        humanReviewApproved: true,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        contentAuthorityVersion: COM004_CONTENT_AUTHORITY_VERSION_V1,
    editorialApproval: COM004_EDITORIAL_APPROVAL_V3,
        revisionPolicy: COM004_REVISION_POLICY_V1,
        language,
        locale: `${language}-IN`,
        requestedDifficulty,
        difficultyFilterApplied: requestedDifficulty !== "Mixed",
        difficultyClassifierVersion: COM004_DIFFICULTY_AUTHORITY_VERSION_V2,
        productionDifficultyClaimAuthorized: false,
        hardDifficultyAuthorized: false,
        qlSelection: qlId ?? "DETERMINISTIC_ACROSS_PERMANENT_QLS",
        cpSelection: cpId ?? "ALL_CANONICAL_PROBLEMS",
        permanentQlIds: [...qlIds],
        cpIds: [...cpIds],
        candidatePoolSize: candidates.length,
        selectionMode: "FROZEN_COM004_DETERMINISTIC_WITHOUT_REPLACEMENT",
        seed,
        count,
        questionBankAcceptanceAuthority: COM004_BANK_ONLY_ACTIVATION_AUTHORITY_V2.authorityId,
        corpusAuthorityId: COM004_LOCALIZATION_FREEZE_AUTHORITY_V3.authorityId,
        englishFreezeAuthorityId: COM004_ENGLISH_FREEZE_AUTHORITY_V3.authorityId,
        englishContentFingerprint: COM004_ENGLISH_FREEZE_AUTHORITY_V3.contentFingerprint,
        localizationFreezeAuthorityId: COM004_LOCALIZATION_FREEZE_AUTHORITY_V3.authorityId,
        localizationCombinedFingerprint: COM004_LOCALIZATION_FREEZE_AUTHORITY_V3.fingerprints.combinedFingerprint,
      },
    };
  },
};
