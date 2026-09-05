import {
  COM003_DIFFICULTY_AUTHORITY_VERSION_V1,
  COM003_HARD_DIFFICULTY_STATUS_V1,
  classifyCom003DifficultyV1,
  type Com003DifficultyV1,
} from "./com003-difficulty-authority-v1";
import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "./com003-english-freeze-v2";
import {
  COM003_HINDI_LOCALIZATION_V2_CHAPTER,
  COM003_PUNJABI_LOCALIZATION_V2_CHAPTER,
} from "./com003-localization-v2-chapter";
import { COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1 } from "./com003-localization-v2-chapter-freeze-v1";
import type { Com003LocalizedQuestionV2 } from "./com003-localization-v2-wave1";
import {
  COM003_ENGLISH_REVIEW_CORPUS_V16_2,
  type Com003ReviewQuestionV162,
} from "./com003-review-synthesis-v16-2";

export type Com003QuestionStudioLanguageV2 = "en" | "hi" | "pa";
export type Com003QuestionStudioDifficultyV2 = Exclude<Com003DifficultyV1, "Hard">;
export type Com003QuestionStudioDifficultyRequestV2 = Com003QuestionStudioDifficultyV2 | "Mixed";

export interface Com003QuestionStudioPreRegistrationRequestV2 {
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

export type Com003QuestionStudioPreviewQuestionV2 = {
  id: string;
  sourceQuestionId: string;
  packageId: "COM-003";
  chapterCode: "COM-003";
  subject: "Computer Awareness";
  topic: "Office & Productivity Software";
  patternId: string;
  qlId: string;
  cpId: Com003ReviewQuestionV162["cpId"];
  language: Com003QuestionStudioLanguageV2;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  examSurfaceFamily: Com003ReviewQuestionV162["examSurfaceFamily"];
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
  difficulty: Com003QuestionStudioDifficultyV2;
  difficultyLabel: Com003QuestionStudioDifficultyV2;
  difficultyDecisionV1: ReturnType<typeof classifyCom003DifficultyV1>;
  corpusStatus: "FROZEN_V2";
  registrationStatus: "NOT_REGISTERED_V2";
  preRegistrationOnly: true;
  questionStudioDiscoverable: false;
  readOnly: true;
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  productionReleased: false;
};

const QL_IDS = Object.freeze([...COM003_ENGLISH_FREEZE_AUTHORITY_V2.permanentQlIds]);
const CP_IDS = Object.freeze([
  "COM-003-CP-001",
  "COM-003-CP-002",
  "COM-003-CP-003",
  "COM-003-CP-004",
] as const);
const SUPPORTED_DIFFICULTIES = Object.freeze(["Easy", "Medium"] as const);

const HINDI_BY_SOURCE_ID = new Map<string, Com003LocalizedQuestionV2>(
  COM003_HINDI_LOCALIZATION_V2_CHAPTER.map((item) => [item.sourceQuestionId, item]),
);
const PUNJABI_BY_SOURCE_ID = new Map<string, Com003LocalizedQuestionV2>(
  COM003_PUNJABI_LOCALIZATION_V2_CHAPTER.map((item) => [item.sourceQuestionId, item]),
);

export const COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V2 = Object.freeze({
  id: "COM-003" as const,
  packageId: "COM-003" as const,
  chapterCode: "COM-003" as const,
  type: "static-knowledge-frozen-corpus-v2" as const,
  section: "General Awareness" as const,
  domain: "computer-awareness" as const,
  subject: "Computer Awareness" as const,
  topic: "Office & Productivity Software" as const,
  name: "COM-003 Office & Productivity Software V16.2 / Localization V2" as const,
  label: "Office & Productivity Software" as const,
  qlIds: QL_IDS,
  cpIds: CP_IDS,
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  supportedLocales: Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const),
  difficultySelection: Object.freeze({
    supported: true,
    supportedDifficulties: SUPPORTED_DIFFICULTIES,
    hardAuthorized: false,
    hardReason: COM003_HARD_DIFFICULTY_STATUS_V1.reason,
    classifierVersion: COM003_DIFFICULTY_AUTHORITY_VERSION_V1,
    productionDifficultyClaimsAuthorized: false,
    policy: "AUDITED_REVIEW_ROUTING_FAIL_CLOSED" as const,
  }),
  corpus: Object.freeze({
    authorityId: COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
    englishAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
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
  stagingStatus: "FROZEN_V2_PRE_REGISTRATION" as const,
  registrationStatus: "NOT_REGISTERED_V2" as const,
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
  if (!seed) throw new Error("COM-003 V2 selection requires an explicit deterministic seed.");
  return seed;
}

function normalizeLanguageValue(value: unknown): Com003QuestionStudioLanguageV2 | undefined {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return undefined;
  if (["en", "en-in", "english"].includes(normalized)) return "en";
  if (["hi", "hi-in", "hindi"].includes(normalized)) return "hi";
  if (["pa", "pa-in", "punjabi"].includes(normalized)) return "pa";
  throw new Error(`Unsupported COM-003 language '${String(value)}'.`);
}

function resolveLanguage(request: Com003QuestionStudioPreRegistrationRequestV2): Com003QuestionStudioLanguageV2 {
  const direct = normalizeLanguageValue(request.language);
  const questionLanguage = normalizeLanguageValue(request.questionLanguageId);
  if (direct && questionLanguage && direct !== questionLanguage) {
    throw new Error(
      `Conflicting COM-003 language selectors '${String(request.language)}' and '${String(request.questionLanguageId)}'.`,
    );
  }
  return direct ?? questionLanguage ?? "en";
}

function normalizeDifficulty(value: unknown): Com003QuestionStudioDifficultyRequestV2 {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized || normalized === "mixed") return "Mixed";
  if (normalized === "easy") return "Easy";
  if (normalized === "medium") return "Medium";
  if (normalized === "hard") {
    throw new Error(`COM-003 Hard difficulty is not authorized: ${COM003_HARD_DIFFICULTY_STATUS_V1.reason}`);
  }
  throw new Error("COM-003 review difficulty must be Easy, Medium, or Mixed; Hard is not authorized for this frozen corpus.");
}

function assertPackageSelectors(request: Com003QuestionStudioPreRegistrationRequestV2): void {
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
}

function resolveQlId(request: Com003QuestionStudioPreRegistrationRequestV2): string | undefined {
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

function resolveCpId(value: unknown): Com003ReviewQuestionV162["cpId"] | undefined {
  const normalized = String(value ?? "").trim().toUpperCase();
  if (!normalized) return undefined;
  if (!(CP_IDS as readonly string[]).includes(normalized)) throw new Error(`Unknown COM-003 CP '${normalized}'.`);
  return normalized as Com003ReviewQuestionV162["cpId"];
}

function normalizeCount(value: unknown, maximum: number): number {
  if (value === undefined) return 1;
  const count = Number(value);
  if (!Number.isInteger(count) || count < 1) throw new Error("COM-003 V2 count must be a positive integer.");
  if (count > maximum) {
    throw new Error(
      `COM-003 V2 count ${count} exceeds the ${maximum}-question filtered frozen candidate pool; duplicate frozen questions are not emitted.`,
    );
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

function localizedFor(sourceQuestionId: string, language: "hi" | "pa"): Com003LocalizedQuestionV2 {
  const item = language === "hi"
    ? HINDI_BY_SOURCE_ID.get(sourceQuestionId)
    : PUNJABI_BY_SOURCE_ID.get(sourceQuestionId);
  if (!item) throw new Error(`COM-003 frozen V2 ${language} localization missing for '${sourceQuestionId}'.`);
  return item;
}

function toPreview(
  english: Com003ReviewQuestionV162,
  language: Com003QuestionStudioLanguageV2,
): Com003QuestionStudioPreviewQuestionV2 {
  const localized = language === "en" ? undefined : localizedFor(english.questionId, language);
  const content = localized ?? english;
  const locale = language === "en" ? "en-IN" : localized!.locale;
  const difficultyDecision = classifyCom003DifficultyV1(english);
  if (difficultyDecision.difficulty === "Hard") {
    throw new Error(`COM-003 frozen V16.2 question ${english.questionId} unexpectedly classified Hard.`);
  }

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
    examSurfaceFamily: english.examSurfaceFamily,
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
    difficulty: difficultyDecision.difficulty,
    difficultyLabel: difficultyDecision.difficulty,
    difficultyDecisionV1: difficultyDecision,
    corpusStatus: "FROZEN_V2",
    registrationStatus: "NOT_REGISTERED_V2",
    preRegistrationOnly: true,
    questionStudioDiscoverable: false,
    readOnly: true,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    productionReleased: false,
  };
}

export function runCom003QuestionStudioPreRegistrationV2(
  request: Com003QuestionStudioPreRegistrationRequestV2,
) {
  assertPackageSelectors(request);
  const qlId = resolveQlId(request);
  const cpId = resolveCpId(request.cpId);
  const language = resolveLanguage(request);
  const requestedDifficulty = normalizeDifficulty(request.difficulty);
  const seed = normalizeSeed(request.seed);

  const candidates = COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((question) =>
    (!qlId || question.qlId === qlId) &&
    (!cpId || question.cpId === cpId) &&
    (requestedDifficulty === "Mixed" || classifyCom003DifficultyV1(question).difficulty === requestedDifficulty),
  );
  if (!candidates.length) {
    throw new Error(
      `COM-003 V2 selectors produced no ${requestedDifficulty} frozen questions${qlId ? ` for ${qlId}` : ""}${cpId ? ` in ${cpId}` : ""}.`,
    );
  }

  const count = normalizeCount(request.count, candidates.length);
  const ordered = shuffled(
    candidates,
    `${seed}:COM-003-V2:${qlId ?? "ALL"}:${cpId ?? "ALL"}:${requestedDifficulty}`,
  );
  const selected = ordered.slice(0, count);
  const questions = selected.map((question) => toPreview(question, language));

  return {
    capability: COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V2,
    generationContext: {
      corpusAuthorityId: COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1.authorityId,
      englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
      packageId: "COM-003" as const,
      chapterCode: "COM-003" as const,
      requestedQlId: qlId ?? null,
      requestedCpId: cpId ?? null,
      requestedDifficulty,
      difficultyFilterApplied: requestedDifficulty !== "Mixed",
      difficultyClassifierVersion: COM003_DIFFICULTY_AUTHORITY_VERSION_V1,
      productionDifficultyClaimAuthorized: false,
      seed,
      count,
      candidatePoolSize: candidates.length,
      selectionMode: "FROZEN_V16_2_LOCALIZATION_V2_DETERMINISTIC_WITHOUT_REPLACEMENT" as const,
      language,
      stagingStatus: "FROZEN_V2_PRE_REGISTRATION" as const,
      registrationStatus: "NOT_REGISTERED_V2" as const,
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
      difficulty: question.difficulty,
      difficultyTopology: question.difficultyDecisionV1.topology,
      targetFactId: question.targetFactId,
      sourceFactIds: question.sourceFactIds,
      sourceIds: question.sourceIds,
      versionScoped: question.versionScoped,
      correctIndex: question.correctIndex,
      solverAuthority: question.solverAuthority,
    })),
  };
}
