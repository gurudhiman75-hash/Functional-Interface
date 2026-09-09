import {
  COM003_OFFICE_TABS_AUTHORITY_V1,
  COM003_OFFICE_TABS_COMPLETION_AUDIT_V1,
  COM003_OFFICE_TABS_ENGLISH_REVIEW,
  COM003_OFFICE_TABS_HINDI_REVIEW,
  COM003_OFFICE_TABS_PUNJABI_REVIEW,
  COM003_OFFICE_TABS_QLS,
  type Com003OfficeTabsQuestion,
} from "../../knowledge-v1/computer-awareness/com003-office-tabs-completion-v1";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";

export const COM003_OFFICE_TABS_PACKAGE_ID_V1 = "COM-003-OFFICE-TABS" as const;
export const COM003_OFFICE_TABS_RUNTIME_MODE_V1 = "review-only" as const;
export const COM003_OFFICE_TABS_CONTENT_AUTHORITY_VERSION_V1 = "COM-003-OFFICE-TABS-COMPLETION-V1" as const;
export const COM003_OFFICE_TABS_REVISION_POLICY_V1 = "SOURCE_GENERATOR_ONLY" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const supportedDifficulties = ["Easy", "Medium"] as const;
const qlIds = COM003_OFFICE_TABS_QLS.map((item) => item.qlId);
const cpIds = ["COM-003-CP-002"] as const;

if (!COM003_OFFICE_TABS_COMPLETION_AUDIT_V1.valid) {
  throw new Error(`COM-003 Office tabs adapter requires a valid completion corpus: ${COM003_OFFICE_TABS_COMPLETION_AUDIT_V1.issues.join(", ")}`);
}

export const COM003_OFFICE_TABS_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: COM003_OFFICE_TABS_PACKAGE_ID_V1,
  subject: "Computer Awareness",
  topic: "Office & Productivity Software",
  subtopic: "Microsoft Excel and PowerPoint",
  label: "Computer Awareness · Excel & PowerPoint · Ribbon Tabs V1",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: COM003_OFFICE_TABS_RUNTIME_MODE_V1,
  supportedRuntimeModes: [COM003_OFFICE_TABS_RUNTIME_MODE_V1],
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
    reviewOnly: true,
    humanReviewApproved: false,
    frozenCorpusOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    contentAuthorityVersion: COM003_OFFICE_TABS_CONTENT_AUTHORITY_VERSION_V1,
    permanentQlIds: qlIds,
    qlCount: qlIds.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    englishQuestionCount: COM003_OFFICE_TABS_AUTHORITY_V1.englishQuestionCount,
    hindiQuestionCount: COM003_OFFICE_TABS_AUTHORITY_V1.hindiQuestionCount,
    punjabiQuestionCount: COM003_OFFICE_TABS_AUTHORITY_V1.punjabiQuestionCount,
    totalQuestionLanguageArtifacts: COM003_OFFICE_TABS_AUTHORITY_V1.totalQuestionLanguageArtifacts,
    revisionPolicy: COM003_OFFICE_TABS_REVISION_POLICY_V1,
    versionScoped: true,
    hardDifficultyAuthorized: false,
    questionBankWritesAuthorized: false,
    questionStudioRuntimeAuthorized: true,
    productionDifficultyClaimsAuthorized: false,
  },
};

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language) return "en";
  if (supportedLanguages.includes(language)) return language;
  throw new Error(`COM-003 Excel and PowerPoint tabs do not support language ${String(language)}`);
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]): "Easy" | "Medium" | "Mixed" {
  if (!difficulty || difficulty === "Mixed") return "Mixed";
  if (difficulty === "Easy" || difficulty === "Medium") return difficulty;
  if (difficulty === "Hard") throw new Error("COM-003 Excel and PowerPoint tabs Hard difficulty is not authorized");
  throw new Error("COM-003 Excel and PowerPoint tabs difficulty must be Easy, Medium or Mixed");
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) throw new Error("COM-003 Excel and PowerPoint tab review batches require count between 1 and 50");
  return count;
}

function selectorValues(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter(Boolean);
}

function normalizeQlSelector(request: QuestionStudioGenerationRequest): string | undefined {
  const values = selectorValues(request);
  const selected = values.filter((value) => qlIds.includes(value));
  const unknown = values.filter((value) => value !== COM003_OFFICE_TABS_PACKAGE_ID_V1 && value !== "COM-003" && value !== "COM-003-CP-002" && !qlIds.includes(value));
  if (unknown.length) throw new Error(`Unknown COM-003 Office tabs selector ${unknown[0]}`);
  if (new Set(selected).size > 1) throw new Error(`Conflicting COM-003 Office tabs QL selectors ${selected.join(", ")}`);
  return selected[0];
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
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

function corpusFor(language: QuestionStudioLanguage): readonly Com003OfficeTabsQuestion[] {
  if (language === "en") return COM003_OFFICE_TABS_ENGLISH_REVIEW;
  if (language === "hi") return COM003_OFFICE_TABS_HINDI_REVIEW;
  return COM003_OFFICE_TABS_PUNJABI_REVIEW;
}

function toOutput(question: Com003OfficeTabsQuestion) {
  const difficulty = question.difficulty === "EASY" ? "Easy" : "Medium";
  return {
    ...lifecycle,
    id: question.localizationId,
    questionId: question.localizationId,
    sourceQuestionId: question.sourceQuestionId,
    packageId: COM003_OFFICE_TABS_PACKAGE_ID_V1,
    chapterCode: "COM-003",
    patternId: question.qlId,
    qlId: question.qlId,
    cpId: question.cpId,
    subject: "Computer Awareness",
    topic: "Office & Productivity Software",
    subtopic: "Microsoft Excel and PowerPoint",
    language: question.language,
    locale: question.locale,
    surfaceMode: question.surfaceMode,
    examSurfaceFamily: question.examSurfaceFamily,
    targetFactId: question.targetFactId,
    stem: question.stem,
    text: question.stem,
    options: [...question.options],
    correctIndex: question.correctIndex,
    correct: question.correctIndex,
    answer: question.canonicalAnswer,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation,
    sourceIds: [...question.sourceIds],
    sourceFactIds: [...question.sourceFactIds],
    versionScoped: question.versionScoped,
    difficulty,
    difficultyLabel: difficulty,
    registrationStatus: "REVIEW_ONLY_CANDIDATE",
    registrationAuthorityId: COM003_OFFICE_TABS_AUTHORITY_V1.authorityId,
    questionStudioDiscoverable: true,
    questionStudioGenerationEnabled: true,
    readOnly: true,
    preRegistrationOnly: false,
    productionReleased: false,
    questionStudioReview: {
      ...lifecycle,
      registrationStatus: "REVIEW_ONLY_CANDIDATE",
      registrationAuthorityId: COM003_OFFICE_TABS_AUTHORITY_V1.authorityId,
      runtimeMode: COM003_OFFICE_TABS_RUNTIME_MODE_V1,
      reviewOnly: true,
      humanReviewApproved: false,
      frozenCorpusOnly: true,
      immutableCorpus: true,
      deterministicSelection: true,
      selectionWithoutReplacement: true,
      contentAuthorityVersion: COM003_OFFICE_TABS_CONTENT_AUTHORITY_VERSION_V1,
      revisionPolicy: COM003_OFFICE_TABS_REVISION_POLICY_V1,
      versionScoped: true,
      sourceEnglishAuthorityId: COM003_OFFICE_TABS_AUTHORITY_V1.authorityId,
      localizationAuthorityId: COM003_OFFICE_TABS_AUTHORITY_V1.authorityId,
      hardDifficultyAuthorized: false,
      productionDifficultyClaimAuthorized: false,
    },
  };
}

export function isCom003OfficeTabsQuestionStudioRequest(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId === COM003_OFFICE_TABS_PACKAGE_ID_V1) return true;
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId].map((value) => String(value ?? "").trim().toUpperCase());
  if (selectors.some((value) => qlIds.includes(value))) return true;
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return (
    packageId === "COM-003" && (subtopic.includes("microsoft excel") || subtopic.includes("microsoft powerpoint") || topic.includes("microsoft excel") || topic.includes("microsoft powerpoint"))
  ) || (subject === "computer awareness" && (subtopic.includes("microsoft excel") || subtopic.includes("microsoft powerpoint")));
}

export const knowledgeV1Com003OfficeTabsQuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [COM003_OFFICE_TABS_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== COM003_OFFICE_TABS_PACKAGE_ID_V1 && packageId !== "COM-003") throw new Error(`knowledge-v1 Office tabs adapter cannot generate package ${request.packageId}`);
    if (request.runtimeMode && request.runtimeMode !== COM003_OFFICE_TABS_RUNTIME_MODE_V1) throw new Error(`COM-003 Office tabs only supports ${COM003_OFFICE_TABS_RUNTIME_MODE_V1} runtime`);
    const language = normalizeLanguage(request.language);
    const difficulty = normalizeDifficulty(request.difficulty);
    const count = normalizeCount(request.count);
    const qlId = normalizeQlSelector(request);
    const seed = request.seed?.trim() || "com003-office-tabs-question-studio-review-v1";
    const candidates = corpusFor(language).filter((question) => (!qlId || question.qlId === qlId) && (difficulty === "Mixed" || (difficulty === "Easy" && question.difficulty === "EASY") || (difficulty === "Medium" && question.difficulty === "MEDIUM")));
    if (!candidates.length) throw new Error(`COM-003 Office tabs selectors produced no ${difficulty} questions`);
    if (count > candidates.length) throw new Error(`COM-003 Office tabs cannot fill ${count} questions from a ${candidates.length}-question pool without repeats`);
    const selected = shuffled(candidates, `${seed}:COM-003-OFFICE-TABS:${qlId ?? "ALL"}:${difficulty}`).slice(0, count);
    return {
      questions: selected.map(toOutput),
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: COM003_OFFICE_TABS_PACKAGE_ID_V1,
        chapterCode: "COM-003",
        runtimeMode: COM003_OFFICE_TABS_RUNTIME_MODE_V1,
        registrationStatus: "REVIEW_ONLY_CANDIDATE",
        registrationAuthorityId: COM003_OFFICE_TABS_AUTHORITY_V1.authorityId,
        reviewOnly: true,
        humanReviewApproved: false,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        contentAuthorityVersion: COM003_OFFICE_TABS_CONTENT_AUTHORITY_VERSION_V1,
        revisionPolicy: COM003_OFFICE_TABS_REVISION_POLICY_V1,
        language,
        locale: `${language}-IN`,
        requestedDifficulty: difficulty,
        difficultyFilterApplied: difficulty !== "Mixed",
        hardDifficultyAuthorized: false,
        productionDifficultyClaimAuthorized: false,
        qlSelection: qlId ?? "DETERMINISTIC_ACROSS_EXCEL_POWERPOINT_QLS",
        permanentQlIds: qlIds,
        cpIds: [...cpIds],
        candidatePoolSize: candidates.length,
        seed,
        count,
        totalQuestionLanguageArtifacts: COM003_OFFICE_TABS_AUTHORITY_V1.totalQuestionLanguageArtifacts,
        questionStudioRuntimeAuthorized: true,
        questionBankWritesAuthorized: false,
      },
    };
  },
};
