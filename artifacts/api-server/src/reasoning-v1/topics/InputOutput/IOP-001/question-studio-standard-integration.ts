import { IOP_001_ENGLISH_FREEZE_AUTHORITY } from "./english-freeze-authority.ts";
import { generateIopEnglishReviewCaselet } from "./english-review-generator.ts";
import { getIopEnglishSourceModes, IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import {
  generateIopFrozenLocalizedReviewCaselet,
  IOP_001_LOCALIZATION_FREEZE_AUTHORITY,
  type IopFrozenLocalizedCaselet,
} from "./localization-freeze-authority.ts";
import type { IopEnglishProductionCaselet } from "./english-production-types.ts";
import {
  getIopPermanentAuthority,
  IOP_001_PERMANENT_QL_AUTHORITIES,
  type IopPermanentQlId,
  type IopPermanentSolveMode,
} from "./permanent-authorities.ts";

export const IOP_001_QUESTION_STUDIO_PACKAGE_ID = "IOP-001" as const;
export const IOP_001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export type Iop001QuestionStudioLanguage = (typeof IOP_001_QUESTION_STUDIO_LANGUAGES)[number];
export type Iop001QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";

export type Iop001QuestionStudioRequest = Readonly<{
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  canonicalProblemId?: string;
  cpId?: string;
  qlId?: string;
  sourceModeId?: string;
  solveMode?: IopPermanentSolveMode | string;
  difficulty?: Iop001QuestionStudioDifficulty | string | number;
  language?: Iop001QuestionStudioLanguage;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
}>;

type SourceCaselet = IopEnglishProductionCaselet | IopFrozenLocalizedCaselet;

const QL_IDS = IOP_001_PERMANENT_QL_AUTHORITIES.map((authority) => authority.qlId) as readonly IopPermanentQlId[];
const SOLVE_MODES: readonly IopPermanentSolveMode[] = [
  "STEP_OUTPUT",
  "FINAL_OUTPUT",
  "ELEMENT_AT_POSITION",
  "POSITION_OF_ELEMENT",
  "STEP_NUMBER",
  "PREVIOUS_STEP",
  "MISSING_STEP",
  "REMAINING_STEP_COUNT",
] as const;

const QL001_MEDIUM_SOURCE_MODES = new Set([
  "QL001_WORD_LENGTH_ASC_LEFT",
  "QL001_NUMBER_DIGIT_SUM_ASC_LEFT",
  "QL001_WORD_LENGTH_DESC_RIGHT",
]);

export function getIop001SourceModeDifficulty(sourceModeId: string): Iop001QuestionStudioDifficulty {
  if (sourceModeId.startsWith("QL001_")) {
    return QL001_MEDIUM_SOURCE_MODES.has(sourceModeId) ? "Medium" : "Easy";
  }
  if (/^QL00[234]_/.test(sourceModeId)) return "Medium";
  return "Hard";
}

function supportedDifficultiesForQl(qlId: IopPermanentQlId): readonly Iop001QuestionStudioDifficulty[] {
  return [...new Set(getIopEnglishSourceModes(qlId).map((mode) => getIop001SourceModeDifficulty(mode.sourceModeId)))];
}

export const IOP_001_QUESTION_STUDIO_PACKAGE = Object.freeze({
  id: IOP_001_QUESTION_STUDIO_PACKAGE_ID,
  packageId: IOP_001_QUESTION_STUDIO_PACKAGE_ID,
  type: "reasoning-v1",
  section: "Reasoning",
  domain: "reasoning",
  topic: "Reasoning",
  subtopic: "Input Output",
  chapterId: "REAS-INP",
  name: "IOP-001 Machine Input–Output",
  label: "Input–Output — 8 Frozen Machine Families",
  generationDomain: "reasoning-v1",
  cpIds: [...QL_IDS],
  qlIds: [...QL_IDS],
  canonicalProblems: IOP_001_PERMANENT_QL_AUTHORITIES.map((authority) => ({
    id: authority.qlId,
    label: `${authority.qlId} — ${authority.title}`,
    supportedDifficulties: supportedDifficultiesForQl(authority.qlId),
  })),
  sourceModes: IOP_ENGLISH_SOURCE_MODES.map((mode) => ({
    id: mode.sourceModeId,
    qlId: mode.qlId,
    label: mode.title,
    difficulty: getIop001SourceModeDifficulty(mode.sourceModeId),
    solveModes: [...mode.supportedSolveModes],
  })),
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  supportedLanguages: [...IOP_001_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  runtimeMode: "STANDARD_QUESTION_STUDIO",
  supportedRuntimeModes: ["STANDARD_QUESTION_STUDIO"],
  freezeStatus: "ENGLISH_HINDI_PUNJABI_FROZEN",
  reviewStatus: "REVIEW_REQUIRED",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  mockTestEligible: false,
  manualApprovalRequired: true,
  automaticStudentPublication: false,
} as const);

function hashSeed(value: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash || 0x9e3779b9;
}

function normalizeSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeDifficulty(value: unknown): Iop001QuestionStudioDifficulty | undefined {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "easy") return "Easy";
    if (normalized === "medium" || normalized === "moderate") return "Medium";
    if (normalized === "hard") return "Hard";
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 6) return "Hard";
    if (value >= 3) return "Medium";
    return "Easy";
  }
  return undefined;
}

function normalizeSolveMode(value: unknown): IopPermanentSolveMode | undefined {
  const normalized = String(value ?? "").trim().toUpperCase().replace(/[\s-]+/g, "_");
  return SOLVE_MODES.find((mode) => mode === normalized);
}

function requestedSourceMode(request: Iop001QuestionStudioRequest): string | undefined {
  const explicit = String(request.sourceModeId ?? "").trim();
  if (explicit) return explicit;
  const pattern = String(request.patternId ?? "").trim();
  return IOP_ENGLISH_SOURCE_MODES.some((mode) => mode.sourceModeId === pattern) ? pattern : undefined;
}

function requestedQl(request: Iop001QuestionStudioRequest): IopPermanentQlId | undefined {
  const explicit = String(request.qlId ?? request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (explicit) {
    if (!(QL_IDS as readonly string[]).includes(explicit)) throw new Error(`Unknown IOP Question Studio QL '${explicit}'.`);
    return explicit as IopPermanentQlId;
  }
  const sourceModeId = requestedSourceMode(request);
  if (!sourceModeId) return undefined;
  const mode = IOP_ENGLISH_SOURCE_MODES.find((candidate) => candidate.sourceModeId === sourceModeId);
  if (!mode) throw new Error(`Unknown IOP source mode '${sourceModeId}'.`);
  return mode.qlId;
}

function modeMatches(
  mode: (typeof IOP_ENGLISH_SOURCE_MODES)[number],
  difficulty?: Iop001QuestionStudioDifficulty,
  solveMode?: IopPermanentSolveMode,
): boolean {
  if (difficulty && getIop001SourceModeDifficulty(mode.sourceModeId) !== difficulty) return false;
  if (solveMode && !mode.supportedSolveModes.includes(solveMode)) return false;
  return true;
}

function qlCandidates(request: Iop001QuestionStudioRequest): readonly IopPermanentQlId[] {
  const explicit = requestedQl(request);
  const difficulty = normalizeDifficulty(request.difficulty);
  const solveMode = normalizeSolveMode(request.solveMode);
  if (request.solveMode && !solveMode) throw new Error(`Unknown IOP solve mode '${String(request.solveMode)}'.`);

  let candidates = explicit ? [explicit] : [...QL_IDS];
  if (difficulty || solveMode) {
    candidates = candidates.filter((qlId) =>
      getIopEnglishSourceModes(qlId).some((mode) => modeMatches(mode, difficulty, solveMode)),
    );
  }
  if (candidates.length === 0) {
    throw new Error("No IOP Question Studio machine family matches the requested QL, difficulty and solve mode.");
  }
  return candidates;
}

function modeFor(
  qlId: IopPermanentQlId,
  seed: string,
  requested?: string,
  solveMode?: IopPermanentSolveMode,
  difficulty?: Iop001QuestionStudioDifficulty,
) {
  const modes = getIopEnglishSourceModes(qlId).filter((mode) => modeMatches(mode, difficulty, solveMode));
  if (requested) {
    const exact = modes.find((mode) => mode.sourceModeId === requested);
    if (!exact) {
      const qualifiers = [difficulty, solveMode].filter(Boolean).join(" / ");
      throw new Error(`${requested} is not available for ${qlId}${qualifiers ? ` / ${qualifiers}` : ""}.`);
    }
    return exact;
  }
  if (modes.length === 0) throw new Error(`No source mode available for ${qlId}.`);
  return modes[hashSeed(`${seed}|MODE`) % modes.length]!;
}

function localeFor(language: Iop001QuestionStudioLanguage): "hi-IN" | "pa-IN" | "en-IN" {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
}

function sourceCaselet(
  seed: string,
  qlId: IopPermanentQlId,
  sourceModeId: string,
  language: Iop001QuestionStudioLanguage,
): SourceCaselet {
  if (language === "en") return generateIopEnglishReviewCaselet(seed, qlId, sourceModeId);
  return generateIopFrozenLocalizedReviewCaselet(seed, qlId, sourceModeId, localeFor(language) as "hi-IN" | "pa-IN");
}

function row(values: readonly string[]): string {
  return values.join("  ");
}

function contextLabels(language: Iop001QuestionStudioLanguage) {
  if (language === "hi") {
    return { illustration: "उदाहरण", input: "इनपुट", step: "चरण", newInput: "नया इनपुट" } as const;
  }
  if (language === "pa") {
    return { illustration: "ਉਦਾਹਰਨ", input: "ਇਨਪੁੱਟ", step: "ਪੜਾਅ", newInput: "ਨਵਾਂ ਇਨਪੁੱਟ" } as const;
  }
  return { illustration: "Illustration", input: "Input", step: "Step", newInput: "New Input" } as const;
}

function sharedPrompt(caselet: SourceCaselet, language: Iop001QuestionStudioLanguage): string {
  const labels = contextLabels(language);
  const illustration = [
    `${labels.illustration}:`,
    `${labels.input}: ${row(caselet.demonstration.input)}`,
    ...caselet.demonstration.steps.map((values, index) => `${labels.step} ${index + 1}: ${row(values)}`),
  ].join("\n");
  return `${caselet.directions}\n\n${illustration}\n\n${labels.newInput}: ${row(caselet.target.input)}`;
}

function standardQuestion(
  caselet: SourceCaselet,
  child: SourceCaselet["children"][number],
  language: Iop001QuestionStudioLanguage,
  sequence: number,
) {
  const authority = getIopPermanentAuthority(caselet.qlId);
  const prompt = sharedPrompt(caselet, language);
  const questionId = `${caselet.caseletId}-Q${child.questionOrder}`;
  return {
    text: `${prompt}\n\n${child.text}`,
    stem: child.text,
    originalStem: child.text,
    sharedPrompt: prompt,
    options: child.options.map((option) => option.display),
    correct: child.answerIndex,
    correctIndex: child.answerIndex,
    answer: child.answerDisplay,
    canonicalAnswer: child.answerDisplay,
    explanation: child.explanation,
    richExplanation: {
      rule: caselet.ruleExplanation,
      working: child.explanation,
      conclusion: child.answerDisplay,
    },
    difficulty: caselet.difficulty,
    difficultyLabel: caselet.difficulty,
    patternId: caselet.sourceModeId,
    packageId: IOP_001_QUESTION_STUDIO_PACKAGE_ID,
    section: "Reasoning",
    topic: "Reasoning",
    subtopic: "Input Output",
    chapterId: "REAS-INP",
    checkpointId: authority.checkpoints[0],
    qlId: caselet.qlId,
    canonicalProblemId: caselet.qlId,
    solveMode: child.kind,
    language,
    locale: localeFor(language),
    generationBackend: "reasoning-v1",
    debugSource: "reasoning-v1-iop-001-standard-question-studio",
    questionId,
    localizedQuestionId: `${questionId}:${language}`,
    canonicalItemId: `${caselet.caseletId}:Q${child.questionOrder}`,
    questionLanguageId: `${caselet.caseletId}:Q${child.questionOrder}:${language}`,
    explanationId: `${caselet.caseletId}:Q${child.questionOrder}:EXPL:${language}`,
    seed: caselet.seed,
    sourceModeId: caselet.sourceModeId,
    sourceEvidenceIds: [...caselet.sourceEvidenceIds],
    machineTrace: {
      demonstration: caselet.demonstration,
      target: caselet.target,
    },
    runtimeMode: "STANDARD_QUESTION_STUDIO",
    reviewStatus: "REVIEW_REQUIRED",
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    questionBankEligible: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    publicReleaseStatus: "LOCKED",
    reviewOnly: true,
    manualApprovalRequired: true,
    releaseFreezeStatus: "MULTILINGUAL_FROZEN_QS_REVIEW_ONLY",
    integrationAuthority: "IOP_001_MULTILINGUAL_FROZEN_QUESTION_STUDIO_V1",
    sequence,
    traceability: {
      packageId: IOP_001_QUESTION_STUDIO_PACKAGE_ID,
      qlId: caselet.qlId,
      sourceModeId: caselet.sourceModeId,
      caseletId: caselet.caseletId,
      solveMode: child.kind,
      sourceEvidenceIds: [...caselet.sourceEvidenceIds],
      englishFreezeSha256: IOP_001_ENGLISH_FREEZE_AUTHORITY.approvedLearnerContentSha256,
      localizationFreezeSha256: IOP_001_LOCALIZATION_FREEZE_AUTHORITY.canonicalLocalizedLearnerContentSha256,
    },
    validation: {
      sourceWhitelisted: caselet.safeguards.sourceWhitelisted,
      ruleIdentifiable: caselet.safeguards.ruleIdentifiable,
      oracleParity: caselet.safeguards.oracleParity,
      queryOracleParity: caselet.safeguards.queryOracleParity,
      englishFrozen: true,
      localizationFrozen: true,
      optionCount: child.options.length,
      exactlyOneCorrectOption: child.options.filter((option) => option.isCorrect).length === 1,
    },
  } as const;
}

export function isIop001StandardQuestionStudioRequest(request: Iop001QuestionStudioRequest): boolean {
  const explicitPackage = String(request.packageId ?? request.archetypeId ?? "").trim().toUpperCase();
  if (explicitPackage === IOP_001_QUESTION_STUDIO_PACKAGE_ID) return true;
  const ql = String(request.qlId ?? request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if ((QL_IDS as readonly string[]).includes(ql)) return true;
  const mode = requestedSourceMode(request);
  if (mode && IOP_ENGLISH_SOURCE_MODES.some((candidate) => candidate.sourceModeId === mode)) return true;
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  return [topic, subtopic].some((value) => value === "input output" || value === "machine input output" || value === "input output reasoning");
}

export function listIop001StandardQuestionStudioPackages() {
  return [IOP_001_QUESTION_STUDIO_PACKAGE];
}

export function generateIop001StandardQuestionStudioBatch(
  request: Iop001QuestionStudioRequest = {},
) {
  if (!isIop001StandardQuestionStudioRequest({ ...request, packageId: request.packageId ?? IOP_001_QUESTION_STUDIO_PACKAGE_ID })) {
    throw new Error("An IOP-001 Question Studio request is required.");
  }
  const language = request.language ?? "en";
  if (!(IOP_001_QUESTION_STUDIO_LANGUAGES as readonly string[]).includes(language)) {
    throw new Error(`IOP-001 does not support Question Studio language '${String(language)}'.`);
  }
  const count = Math.max(1, Math.min(100, Math.floor(Number(request.count ?? 10) || 10)));
  const requestedMode = requestedSourceMode(request);
  const solveMode = normalizeSolveMode(request.solveMode);
  const difficulty = normalizeDifficulty(request.difficulty);
  const candidates = qlCandidates(request);
  const baseSeed = String(request.seed ?? "IOP-001:QUESTION-STUDIO");
  const questions: ReturnType<typeof standardQuestion>[] = [];
  const usedCaselets: Array<{ qlId: IopPermanentQlId; sourceModeId: string; seed: string }> = [];

  for (let attempt = 0; questions.length < count && attempt < count * 12 + 64; attempt += 1) {
    const qlId = candidates[hashSeed(`${baseSeed}|QL|${attempt}`) % candidates.length]!;
    const caseletSeed = `${baseSeed}|${language}|${qlId}|${attempt}`;
    const mode = modeFor(qlId, caseletSeed, requestedMode, solveMode, difficulty);
    const caselet = sourceCaselet(caseletSeed, qlId, mode.sourceModeId, language);
    usedCaselets.push({ qlId, sourceModeId: mode.sourceModeId, seed: caseletSeed });
    for (const child of caselet.children) {
      if (solveMode && child.kind !== solveMode) continue;
      questions.push(standardQuestion(caselet, child, language, questions.length + 1));
      if (questions.length >= count) break;
    }
  }

  if (questions.length !== count) {
    throw new Error(`IOP-001 could generate only ${questions.length} of ${count} requested Question Studio questions.`);
  }

  return {
    generationContext: {
      generationDomain: "reasoning-v1" as const,
      packageId: IOP_001_QUESTION_STUDIO_PACKAGE_ID,
      chapterId: "REAS-INP" as const,
      qlId: requestedQl(request),
      sourceModeId: requestedMode,
      solveMode,
      difficulty,
      language,
      locale: localeFor(language),
      requestedCount: count,
      generatedCount: questions.length,
      runtimeMode: "STANDARD_QUESTION_STUDIO" as const,
      questionStudioRegistrationStatus: "REGISTERED_STANDARD" as const,
      questionStudioStagingStatus: "MULTILINGUAL_FROZEN_REVIEW_QUEUE" as const,
      questionStudioDiscoverable: true as const,
      questionStudioGeneratable: true as const,
      persistenceAllowed: false as const,
      reviewStatus: "REVIEW_REQUIRED" as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      manualApprovalRequired: true as const,
      englishFreezeSha256: IOP_001_ENGLISH_FREEZE_AUTHORITY.approvedLearnerContentSha256,
      localizationFreezeSha256: IOP_001_LOCALIZATION_FREEZE_AUTHORITY.canonicalLocalizedLearnerContentSha256,
      caselets: usedCaselets,
    },
    questionPackages: [],
    questions,
  };
}
