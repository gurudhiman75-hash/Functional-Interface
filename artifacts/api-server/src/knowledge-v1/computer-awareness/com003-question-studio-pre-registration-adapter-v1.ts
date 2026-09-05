import { COM003_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com003-english-freeze-v1";
import { COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1 } from "./com003-localization-chapter-freeze-v1";
import { COM003_HINDI_LOCALIZATION_WAVE1_V3, COM003_PUNJABI_LOCALIZATION_WAVE1_V3 } from "./com003-localization-wave1-v3";
import { COM003_HINDI_LOCALIZATION_WAVE2_V3, COM003_PUNJABI_LOCALIZATION_WAVE2_V3 } from "./com003-localization-wave2-v3";
import { COM003_HINDI_LOCALIZATION_WAVE3_V2, COM003_PUNJABI_LOCALIZATION_WAVE3_V2 } from "./com003-localization-wave3-v2";
import { COM003_HINDI_LOCALIZATION_WAVE4_V2, COM003_PUNJABI_LOCALIZATION_WAVE4_V2 } from "./com003-localization-wave4-v2";
import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";
import type { Com003LocalizedQuestionV1 } from "./com003-localization-wave1-v1";
import type { Com003ReviewQuestion } from "./com003-review-types";

export type Com003QuestionStudioLanguage = "en" | "hi" | "pa";

export interface Com003QuestionStudioPreRegistrationRequest {
  packageId?: string;
  chapterCode?: string;
  archetypeId?: string;
  topic?: string;
  subtopic?: string;
  patternId?: string;
  qlId?: string;
  cpId?: string;
  language?: string;
  questionLanguageId?: string;
  difficulty?: string | number;
  seed?: string;
  count?: number;
}

export type Com003QuestionStudioPreviewQuestion = {
  id: string;
  sourceQuestionId: string;
  packageId: "COM-003";
  chapterCode: "COM-003";
  subject: "Computer Awareness";
  topic: "Office & Productivity Software";
  patternId: string;
  qlId: string;
  cpId: Com003ReviewQuestion["cpId"];
  language: Com003QuestionStudioLanguage;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  surfaceMode: string;
  targetFactId: string;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  versionScoped: boolean;
  solverAuthority: "CANONICAL_FACT_RELATION";
  corpusStatus: "FROZEN";
  registrationStatus: "NOT_REGISTERED";
  preRegistrationOnly: true;
  questionStudioDiscoverable: false;
  readOnly: true;
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  productionReleased: false;
};

const QL_IDS = Object.freeze([...COM003_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds]);
const CP_IDS = Object.freeze(["COM-003-CP-001", "COM-003-CP-002", "COM-003-CP-003", "COM-003-CP-004"] as const);

const HINDI_CORPUS = Object.freeze([
  ...COM003_HINDI_LOCALIZATION_WAVE1_V3,
  ...COM003_HINDI_LOCALIZATION_WAVE2_V3,
  ...COM003_HINDI_LOCALIZATION_WAVE3_V2,
  ...COM003_HINDI_LOCALIZATION_WAVE4_V2,
]);
const PUNJABI_CORPUS = Object.freeze([
  ...COM003_PUNJABI_LOCALIZATION_WAVE1_V3,
  ...COM003_PUNJABI_LOCALIZATION_WAVE2_V3,
  ...COM003_PUNJABI_LOCALIZATION_WAVE3_V2,
  ...COM003_PUNJABI_LOCALIZATION_WAVE4_V2,
]);

const HINDI_BY_SOURCE_ID = new Map(HINDI_CORPUS.map((item) => [item.sourceQuestionId, item]));
const PUNJABI_BY_SOURCE_ID = new Map(PUNJABI_CORPUS.map((item) => [item.sourceQuestionId, item]));

export const COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V1 = Object.freeze({
  id: "COM-003" as const,
  packageId: "COM-003" as const,
  chapterCode: "COM-003" as const,
  type: "static-knowledge-frozen-corpus" as const,
  section: "General Awareness" as const,
  domain: "computer-awareness" as const,
  subject: "Computer Awareness" as const,
  topic: "Office & Productivity Software" as const,
  name: "COM-003 Office & Productivity Software" as const,
  label: "Office & Productivity Software" as const,
  qlIds: QL_IDS,
  cpIds: CP_IDS,
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  supportedLocales: Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const),
  difficultySelection: Object.freeze({
    supported: false,
    reason: "COM-003 frozen corpus has no audited difficulty classification yet." as const,
    policy: "FAIL_CLOSED" as const,
  }),
  corpus: Object.freeze({
    authorityId: COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
    englishQuestionCount: 228,
    hindiQuestionCount: 228,
    punjabiQuestionCount: 228,
    questionsPerQlPerLanguage: 12,
    qlCount: 19,
    immutable: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
  }),
  enabled: true,
  stagingStatus: "FROZEN_PRE_REGISTRATION" as const,
  registrationStatus: "NOT_REGISTERED" as const,
  questionStudioDiscoverable: false,
  preRegistrationOnly: true,
  readOnly: true,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false,
  productionReleased: false,
});

function normalizeSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeSeed(value: unknown): string {
  const seed = String(value ?? "").trim();
  if (!seed) throw new Error("COM-003 pre-registration selection requires an explicit deterministic seed.");
  return seed;
}

function normalizeLanguageValue(value: unknown): Com003QuestionStudioLanguage | undefined {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return undefined;
  if (["en", "en-in", "english"].includes(normalized)) return "en";
  if (["hi", "hi-in", "hindi"].includes(normalized)) return "hi";
  if (["pa", "pa-in", "punjabi"].includes(normalized)) return "pa";
  throw new Error(`Unsupported COM-003 language '${String(value)}'.`);
}

function resolveLanguage(request: Com003QuestionStudioPreRegistrationRequest): Com003QuestionStudioLanguage {
  const direct = normalizeLanguageValue(request.language);
  const questionLanguage = normalizeLanguageValue(request.questionLanguageId);
  if (direct && questionLanguage && direct !== questionLanguage) {
    throw new Error(`Conflicting COM-003 language selectors '${String(request.language)}' and '${String(request.questionLanguageId)}'.`);
  }
  return direct ?? questionLanguage ?? "en";
}

function assertPackageSelectors(request: Com003QuestionStudioPreRegistrationRequest): void {
  for (const selector of [request.packageId, request.chapterCode, request.archetypeId]) {
    if (selector !== undefined && String(selector).trim().toUpperCase() !== "COM-003") {
      throw new Error(`Unknown COM-003 package selector '${String(selector)}'.`);
    }
  }

  if (request.topic !== undefined) {
    const topic = normalizeSelector(request.topic);
    if (!["computer", "computer awareness", "office productivity software", "office software"].includes(topic)) {
      throw new Error(`Unsupported COM-003 topic selector '${String(request.topic)}'.`);
    }
  }

  if (request.subtopic !== undefined) {
    const subtopic = normalizeSelector(request.subtopic);
    if (!["office productivity software", "office software", "microsoft office"].includes(subtopic)) {
      throw new Error(`Unsupported COM-003 subtopic selector '${String(request.subtopic)}'.`);
    }
  }

  if (request.difficulty !== undefined && request.difficulty !== null && request.difficulty !== "") {
    throw new Error("COM-003 pre-registration difficulty filtering is not authorized because the frozen corpus has no audited difficulty classification.");
  }
}

function resolveQlId(request: Com003QuestionStudioPreRegistrationRequest): string | undefined {
  const direct = String(request.qlId ?? "").trim().toUpperCase();
  const pattern = String(request.patternId ?? "").trim().toUpperCase();
  if (direct && pattern && direct !== pattern) {
    throw new Error(`Conflicting COM-003 QL selectors '${direct}' and '${pattern}'.`);
  }
  const value = direct || pattern;
  if (!value || value === "COM-003") return undefined;
  if (!QL_IDS.includes(value)) throw new Error(`Unknown COM-003 QL '${value}'.`);
  return value;
}

function resolveCpId(value: unknown): Com003ReviewQuestion["cpId"] | undefined {
  const normalized = String(value ?? "").trim().toUpperCase();
  if (!normalized) return undefined;
  if (!(CP_IDS as readonly string[]).includes(normalized)) throw new Error(`Unknown COM-003 CP '${normalized}'.`);
  return normalized as Com003ReviewQuestion["cpId"];
}

function normalizeCount(value: unknown, maximum: number): number {
  if (value === undefined) return 1;
  const count = Number(value);
  if (!Number.isInteger(count) || count < 1) throw new Error("COM-003 pre-registration count must be a positive integer.");
  if (count > maximum) {
    throw new Error(`COM-003 pre-registration count ${count} exceeds the ${maximum}-question frozen candidate pool; duplicate frozen questions are not emitted.`);
  }
  return count;
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

function localizedFor(sourceQuestionId: string, language: "hi" | "pa"): Com003LocalizedQuestionV1 {
  const item = language === "hi" ? HINDI_BY_SOURCE_ID.get(sourceQuestionId) : PUNJABI_BY_SOURCE_ID.get(sourceQuestionId);
  if (!item) throw new Error(`COM-003 frozen ${language} localization missing for source question '${sourceQuestionId}'.`);
  return item;
}

function toPreview(
  english: Com003ReviewQuestion,
  language: Com003QuestionStudioLanguage,
): Com003QuestionStudioPreviewQuestion {
  const localized = language === "en" ? undefined : localizedFor(english.questionId, language);
  const content = localized ?? english;
  const locale = language === "en" ? "en-IN" : localized!.locale;
  return {
    id: language === "en" ? english.questionId : localized!.localizationId,
    sourceQuestionId: english.questionId,
    packageId: "COM-003",
    chapterCode: "COM-003",
    subject: "Computer Awareness",
    topic: "Office & Productivity Software",
    patternId: english.qlId,
    qlId: english.qlId,
    cpId: english.cpId,
    language,
    locale,
    surfaceMode: english.surfaceMode,
    targetFactId: english.targetFactId,
    stem: content.stem,
    options: [...content.options],
    correctIndex: english.correctIndex,
    answer: content.canonicalAnswer,
    canonicalAnswer: content.canonicalAnswer,
    explanation: content.explanation,
    sourceIds: [...english.sourceIds],
    sourceFactIds: [...english.sourceFactIds],
    versionScoped: english.versionScoped,
    solverAuthority: english.solverAuthority,
    corpusStatus: "FROZEN",
    registrationStatus: "NOT_REGISTERED",
    preRegistrationOnly: true,
    questionStudioDiscoverable: false,
    readOnly: true,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    productionReleased: false,
  };
}

export function runCom003QuestionStudioPreRegistration(request: Com003QuestionStudioPreRegistrationRequest) {
  assertPackageSelectors(request);
  const qlId = resolveQlId(request);
  const cpId = resolveCpId(request.cpId);
  const language = resolveLanguage(request);
  const seed = normalizeSeed(request.seed);

  const candidates = COM003_ENGLISH_REVIEW_CORPUS_V4.filter((question) =>
    (!qlId || question.qlId === qlId) && (!cpId || question.cpId === cpId),
  );
  if (!candidates.length) {
    throw new Error(`COM-003 selectors produced no frozen questions${qlId ? ` for ${qlId}` : ""}${cpId ? ` in ${cpId}` : ""}.`);
  }
  const count = normalizeCount(request.count, candidates.length);
  const ordered = shuffled(candidates, `${seed}:COM-003:${qlId ?? "ALL"}:${cpId ?? "ALL"}`);
  const selected = ordered.slice(0, count);
  const questions = selected.map((question) => toPreview(question, language));

  return {
    capability: COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V1,
    generationContext: {
      corpusAuthorityId: COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
      packageId: "COM-003" as const,
      chapterCode: "COM-003" as const,
      requestedQlId: qlId ?? null,
      requestedCpId: cpId ?? null,
      seed,
      count,
      candidatePoolSize: candidates.length,
      selectionMode: "FROZEN_CORPUS_DETERMINISTIC_WITHOUT_REPLACEMENT" as const,
      language,
      stagingStatus: "FROZEN_PRE_REGISTRATION" as const,
      registrationStatus: "NOT_REGISTERED" as const,
      questionStudioDiscoverable: false,
      preRegistrationOnly: true,
      readOnly: true,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false,
      productionReleased: false,
    },
    questions,
    trace: questions.map((question, index) => ({
      questionIndex: index + 1,
      sourceQuestionId: question.sourceQuestionId,
      localizedArtifactId: question.id,
      qlId: question.qlId,
      cpId: question.cpId,
      language: question.language,
      targetFactId: question.targetFactId,
      sourceFactIds: question.sourceFactIds,
      sourceIds: question.sourceIds,
      versionScoped: question.versionScoped,
      correctIndex: question.correctIndex,
      solverAuthority: question.solverAuthority,
    })),
  };
}
