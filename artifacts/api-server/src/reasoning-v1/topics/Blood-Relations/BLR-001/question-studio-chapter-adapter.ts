import { generateBlrCp001Question } from "./BLR-CP-001/cp001-runtime";
import type { BlrCp001QlId } from "./BLR-CP-001/cp001-permanent-contracts";
import { generateBlrCp002Question } from "./BLR-CP-002/cp002-runtime";
import type { BlrCp002QlId } from "./BLR-CP-002/cp002-permanent-contracts";
import { generateBlrCp003FinalApprovedBank } from "./BLR-CP-003/cp003-final-approved-bank";
import { generateBlrCp003LocalizedReviewBank } from "./BLR-CP-003/localization/cp003-localized-review-runtime";
import { BLR_CP003_HI_PA_LOCALISATION_REVIEW_CANDIDATE } from "./BLR-CP-003/localization/cp003-localizer";
import { generateBlrCp004FrozenBank } from "./BLR-CP-004/cp004-bank";
import { BLR_CP004_FREEZE_VERSION } from "./BLR-CP-004/cp004-model";
import {
  BLR_CP004_HI_PA_LOCALISATION_REVIEW_CANDIDATE,
  generateBlrCp004LocalizedReviewBank,
} from "./BLR-CP-004/localization/cp004-localizer";
import { generateBlrCp005FrozenBank } from "./BLR-CP-005/cp005-bank";
import { BLR_CP005_FREEZE_VERSION } from "./BLR-CP-005/cp005-contracts";
import {
  BLR_CP005_HI_PA_LOCALISATION_REVIEW_CANDIDATE,
  generateBlrCp005LocalizedReviewBank,
} from "./BLR-CP-005/localization/cp005-localizer";

export const BLR_CP001_QUESTION_STUDIO_PACKAGE_ID = "REASONING_V1_BLR_001_CP_001" as const;
export const BLR_CP002_QUESTION_STUDIO_PACKAGE_ID = "REASONING_V1_BLR_001_CP_002" as const;
export const BLR_CP003_QUESTION_STUDIO_PACKAGE_ID = "REASONING_V1_BLR_001_CP_003" as const;
export const BLR_CP004_QUESTION_STUDIO_PACKAGE_ID = "REASONING_V1_BLR_001_CP_004" as const;
export const BLR_CP005_QUESTION_STUDIO_PACKAGE_ID = "REASONING_V1_BLR_001_CP_005" as const;

export type BlrChapterStudioPackageId =
  | typeof BLR_CP001_QUESTION_STUDIO_PACKAGE_ID
  | typeof BLR_CP002_QUESTION_STUDIO_PACKAGE_ID
  | typeof BLR_CP003_QUESTION_STUDIO_PACKAGE_ID
  | typeof BLR_CP004_QUESTION_STUDIO_PACKAGE_ID
  | typeof BLR_CP005_QUESTION_STUDIO_PACKAGE_ID;
export type BlrChapterStudioLanguage = "en" | "hi" | "pa";
export type BlrChapterStudioDifficulty = "Easy" | "Medium" | "Hard";

const CP001_QL_IDS = ["BLR-QL-001", "BLR-QL-002", "BLR-QL-003", "BLR-QL-004", "BLR-QL-005", "BLR-QL-006", "BLR-QL-007"] as const;
const CP002_QL_IDS = ["BLR-QL-008"] as const;
const CP003_QL_IDS = ["BLR-QL-009", "BLR-QL-010", "BLR-QL-011", "BLR-QL-012"] as const;
const CP004_QL_IDS = ["BLR-QL-013", "BLR-QL-014", "BLR-QL-015", "BLR-QL-016", "BLR-QL-017"] as const;
const CP005_QL_IDS = ["BLR-QL-018", "BLR-QL-019", "BLR-QL-020", "BLR-QL-021", "BLR-QL-022", "BLR-QL-023", "BLR-QL-024", "BLR-QL-025"] as const;

const PACKAGE_SPECS = [
  { packageId: BLR_CP001_QUESTION_STUDIO_PACKAGE_ID, checkpointId: "BLR-CP-001", label: "Named Blood Relations", subtopic: "Named Blood Relations", qlIds: CP001_QL_IDS, supportedLanguages: ["en"] as const },
  { packageId: BLR_CP002_QUESTION_STUDIO_PACKAGE_ID, checkpointId: "BLR-CP-002", label: "Pointing & Introduction Relations", subtopic: "Pointing & Introduction Relations", qlIds: CP002_QL_IDS, supportedLanguages: ["en"] as const },
  { packageId: BLR_CP003_QUESTION_STUDIO_PACKAGE_ID, checkpointId: "BLR-CP-003", label: "Family Sets, Status & Lineage", subtopic: "Family Sets, Status & Lineage", qlIds: CP003_QL_IDS, supportedLanguages: ["en", "hi", "pa"] as const },
  { packageId: BLR_CP004_QUESTION_STUDIO_PACKAGE_ID, checkpointId: "BLR-CP-004", label: "Family Counting & Composition", subtopic: "Family Counting & Composition", qlIds: CP004_QL_IDS, supportedLanguages: ["en", "hi", "pa"] as const },
  { packageId: BLR_CP005_QUESTION_STUDIO_PACKAGE_ID, checkpointId: "BLR-CP-005", label: "Possibility & Uncertainty", subtopic: "Possibility & Uncertainty", qlIds: CP005_QL_IDS, supportedLanguages: ["en", "hi", "pa"] as const },
] as const;

export const BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGES = PACKAGE_SPECS.map((spec) => ({
  id: spec.packageId,
  packageId: spec.packageId,
  type: "reasoning-v1",
  section: "Reasoning",
  domain: "reasoning",
  topic: "Blood Relations",
  subtopic: spec.subtopic,
  chapterId: "BLR-001",
  checkpointId: spec.checkpointId,
  name: `${spec.label} — Question Studio`,
  label: spec.label,
  generationDomain: "reasoning-v1",
  qlIds: [...spec.qlIds],
  supportedDifficulties: ["Easy", "Medium", "Hard"] as const,
  supportedLanguages: [...spec.supportedLanguages],
  enabled: false,
  reviewPreviewAvailable: true,
  runtimeMode: "CHAPTER_RUNTIME_REVIEW",
  supportedRuntimeModes: ["CHAPTER_RUNTIME_REVIEW"],
  integrationStatus: "QUESTION_STUDIO_GENERATION_READY",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  persistenceAllowed: false,
  publiclyPublishable: false,
  questionStudioVisible: false,
  questionBankEligible: false,
  mockTestEligible: false,
})) as readonly Record<string, unknown>[];

export type BlrChapterStudioRequest = Readonly<{
  packageId: BlrChapterStudioPackageId;
  language?: BlrChapterStudioLanguage;
  qlId?: string;
  difficulty?: BlrChapterStudioDifficulty;
  canonicalItemId?: string;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
}>;

type RawQuestion = Record<string, any>;
const rawCache = new Map<string, readonly RawQuestion[]>();

function packageSpec(packageId: string) {
  const spec = PACKAGE_SPECS.find((entry) => entry.packageId === packageId);
  if (!spec) throw new Error(`Unknown Blood Relations chapter package '${packageId}'.`);
  return spec;
}

export function isBlrChapterStudioPackageId(value: unknown): value is BlrChapterStudioPackageId {
  return typeof value === "string" && PACKAGE_SPECS.some((entry) => entry.packageId === value);
}

function difficultyOf(record: RawQuestion): BlrChapterStudioDifficulty {
  const raw = String(record.metadata?.difficulty ?? record.metadata?.difficultyTier ?? record.difficulty ?? "MEDIUM").toUpperCase();
  if (raw.includes("EASY") || raw.includes("FOUNDATIONAL")) return "Easy";
  if (raw.includes("HARD") || raw.includes("ADVANCED")) return "Hard";
  return "Medium";
}

function shortLanguage(locale: string): BlrChapterStudioLanguage {
  if (locale === "hi-IN") return "hi";
  if (locale === "pa-IN") return "pa";
  return "en";
}

function optionText(option: RawQuestion): string {
  return String(option?.text ?? option?.value ?? option?.answerKey ?? option?.semanticKey ?? "");
}

function optionCorrect(option: RawQuestion): boolean {
  return option?.isCorrect === true || option?.isCorrectAnswerForTask === true;
}

function sourceAuthority(record: RawQuestion): string {
  return String(
    record.metadata?.localizationAuthority
      ?? record.metadata?.freezeVersion
      ?? record.metadata?.runtimeVersion
      ?? record.metadata?.canonicalRuntimeVersion
      ?? "BLR_001_REVIEW_RUNTIME",
  );
}

function canonicalId(record: RawQuestion): string {
  if (record.canonicalItemId) return String(record.canonicalItemId);
  if (record.itemId) return String(record.itemId);
  const fingerprint = String(record.metadata?.hiddenFingerprint ?? record.metadata?.semanticFingerprint ?? record.metadata?.sourceSemanticFingerprint ?? "runtime");
  const prototype = String(record.metadata?.sourcePrototypeId ?? record.sourcePrototypeId ?? record.prototypeId ?? "source");
  return `${record.checkpointId}:${record.qlId}:${prototype}:${record.seed ?? record.metadata?.sourceSeed ?? 0}:${fingerprint}`;
}

function answerText(record: RawQuestion): string {
  const options = Array.isArray(record.options) ? record.options : [];
  return optionText(options[Number(record.correctIndex)] ?? {});
}

function sharedPrompt(record: RawQuestion): string {
  if (typeof record.sharedPrompt === "string") return record.sharedPrompt;
  const clues = record.explanation?.normalizedClues;
  return Array.isArray(clues) ? clues.join("\n") : "";
}

function explanationParts(record: RawQuestion) {
  const explanation = record.explanation ?? {};
  const editorial = record.editorial ?? {};
  const steps = [
    ...(Array.isArray(editorial.coreConcept) ? editorial.coreConcept : []),
    ...(Array.isArray(editorial.stepByStepSolution) ? editorial.stepByStepSolution : []),
    ...(Array.isArray(explanation.coreConcept) ? explanation.coreConcept : []),
    ...(Array.isArray(explanation.queryPath) ? explanation.queryPath : []),
    ...(Array.isArray(explanation.generationAnalysis) ? explanation.generationAnalysis : []),
    ...(Array.isArray(explanation.working) ? explanation.working : []),
    ...(Array.isArray(explanation.modelAudit) ? explanation.modelAudit : []),
  ].map(String);
  if (!steps.length && explanation.ruleStatement) steps.push(String(explanation.ruleStatement));
  const optionAnalysis = Array.isArray(editorial.optionAnalysis)
    ? editorial.optionAnalysis
    : Array.isArray(explanation.optionAnalysis)
      ? explanation.optionAnalysis
      : [];
  const distractors = Array.isArray(explanation.distractorAnalysis) ? explanation.distractorAnalysis : [];
  const traps = Array.isArray(editorial.commonTraps)
    ? editorial.commonTraps.map(String)
    : explanation.closestTrapRejection
      ? [String(explanation.closestTrapRejection)]
      : distractors.map((entry: RawQuestion) => String(entry.studentWarning ?? "")).filter(Boolean);
  return {
    steps,
    conclusion: String(editorial.conclusion ?? explanation.conclusion ?? answerText(record)),
    shortcut: String(editorial.examShortcut ?? explanation.examShortcut ?? ""),
    commonTrap: traps.join(" "),
    optionAnalysis,
    familyTree: explanation.familyTree ?? explanation.familyTrees ?? record.proceduralLogic ?? record.structuredPrompt?.familyGraph ?? null,
    diagramProof: record.proceduralLogic ?? record.structuredPrompt ?? record.modelSpace ?? null,
  };
}

function normalizedOptionDetails(record: RawQuestion) {
  const explanation = explanationParts(record);
  const options = Array.isArray(record.options) ? record.options : [];
  return options.map((option: RawQuestion, index: number) => {
    const text = optionText(option);
    const analysis = explanation.optionAnalysis[index];
    const distractor = Array.isArray(record.explanation?.distractorAnalysis)
      ? record.explanation.distractorAnalysis.find((entry: RawQuestion) => entry.optionValue === text)
      : undefined;
    return {
      label: ["A", "B", "C", "D"][index],
      text,
      studentExplanation: String(analysis?.explanation ?? distractor?.studentWarning ?? (optionCorrect(option) ? explanation.conclusion : "This option does not satisfy the reviewed relation proof.")),
      isCorrect: optionCorrect(option),
      semanticKey: String(option.semanticKey ?? option.answerId ?? option.answerKey ?? option.value ?? text),
    };
  });
}

function normalize(record: RawQuestion, packageId: BlrChapterStudioPackageId) {
  const language = shortLanguage(String(record.locale ?? "en-IN"));
  const canonicalItemId = canonicalId(record);
  const questionLanguageId = String(record.questionLanguageId ?? `${canonicalItemId}:${language}`);
  const explanation = explanationParts(record);
  const optionDetails = normalizedOptionDetails(record);
  const correctIndex = Number(record.correctIndex);
  const authority = sourceAuthority(record);
  const valid = optionDetails.length === 4
    && correctIndex >= 0
    && correctIndex < 4
    && optionDetails.filter((option) => option.isCorrect).length === 1
    && optionDetails[correctIndex]?.isCorrect === true;
  const spec = packageSpec(packageId);
  return {
    archetypeId: packageId,
    packageId,
    canonicalProblemId: spec.checkpointId,
    qlId: String(record.qlId),
    questionId: `${questionLanguageId}:question-studio-review`,
    canonicalItemId,
    questionLanguageId,
    explanationId: `${questionLanguageId}:EXPLANATION`,
    language,
    locale: String(record.locale ?? "en-IN"),
    difficultyBand: difficultyOf(record),
    useMode: "PRACTICE",
    sharedPrompt: sharedPrompt(record),
    stem: String(record.stem ?? ""),
    options: optionDetails.map((option) => option.text),
    optionDetails,
    correctIndex,
    answer: answerText(record),
    decodedStatements: Array.isArray(record.decodedStatements) ? record.decodedStatements.map(String) : [],
    explanation: {
      explanationId: `${questionLanguageId}:EXPLANATION`,
      ...explanation,
    },
    reasoningGraph: record.graph ?? record.structuredPrompt?.familyGraph ?? record.proceduralLogic ?? record.explanation?.familyTree ?? record.explanation?.familyTrees ?? null,
    renderer: {
      kind: String(record.renderer ?? "RELATION_GRAPH"),
      familyTreeAvailable: explanation.familyTree != null,
      diagramProofAvailable: explanation.diagramProof != null,
      textFallbackAvailable: true,
    },
    parameters: {
      chapterId: "BLR-001",
      checkpointId: spec.checkpointId,
      qlId: String(record.qlId),
      seed: String(record.seed ?? record.metadata?.sourceSeed ?? "0"),
      runtimeMode: "CHAPTER_RUNTIME_REVIEW",
      reviewStatus: String(record.metadata?.reviewStatus ?? (language === "en" ? "ENGLISH_RUNTIME_AUTHORITY" : "LOCALIZED_REVIEW_REQUIRED")),
      recordAuthority: authority,
      corpusAuthority: authority,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      persistenceAllowed: false,
    },
    traceability: {
      itemId: String(record.itemId ?? canonicalItemId),
      sourcePrototypeId: String(record.sourcePrototypeId ?? record.metadata?.sourcePrototypeId ?? record.prototypeId ?? ""),
      scenarioId: String(record.scenarioId ?? record.metadata?.sourceScenarioId ?? record.metadata?.scenarioId ?? ""),
      topologyId: String(record.topologyId ?? ""),
      semanticFingerprint: String(record.metadata?.semanticFingerprint ?? record.metadata?.hiddenFingerprint ?? record.metadata?.canonicalSemanticFingerprint ?? ""),
      solveAuthority: String(record.solveAuthority ?? record.finalAuthority ?? record.metadata?.solveAuthority ?? ""),
      recordAuthority: authority,
    },
    safety: {
      integrationStatus: "QUESTION_STUDIO_GENERATION_READY",
      reviewOnly: true,
      questionStudioVisible: false,
      persistenceAllowed: false,
      questionBankEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    },
    validation: {
      valid,
      checks: [
        { name: "four-options", passed: optionDetails.length === 4, message: "Four options are present." },
        { name: "single-reviewed-answer", passed: valid, message: "Exactly one reviewed answer is retained at the canonical index." },
        { name: "runtime-authority", passed: Boolean(authority), message: "Question is traceable to its current checkpoint authority." },
      ],
    },
  } as const;
}

function englishRuntimeBank(packageId: BlrChapterStudioPackageId): readonly RawQuestion[] {
  if (packageId === BLR_CP001_QUESTION_STUDIO_PACKAGE_ID) {
    return CP001_QL_IDS.flatMap((qlId, qlIndex) =>
      Array.from({ length: 128 }, (_, index) => generateBlrCp001Question(qlId as BlrCp001QlId, qlIndex * 1000 + index)),
    ) as readonly RawQuestion[];
  }
  if (packageId === BLR_CP002_QUESTION_STUDIO_PACKAGE_ID) {
    return Array.from({ length: 256 }, (_, index) => generateBlrCp002Question("BLR-QL-008" as BlrCp002QlId, index)) as readonly RawQuestion[];
  }
  if (packageId === BLR_CP003_QUESTION_STUDIO_PACKAGE_ID) return generateBlrCp003FinalApprovedBank() as unknown as readonly RawQuestion[];
  if (packageId === BLR_CP004_QUESTION_STUDIO_PACKAGE_ID) return generateBlrCp004FrozenBank() as unknown as readonly RawQuestion[];
  return generateBlrCp005FrozenBank() as unknown as readonly RawQuestion[];
}

function rawBank(packageId: BlrChapterStudioPackageId, language: BlrChapterStudioLanguage): readonly RawQuestion[] {
  const key = `${packageId}:${language}`;
  const cached = rawCache.get(key);
  if (cached) return cached;
  let records: readonly RawQuestion[];
  if (language === "en") {
    records = englishRuntimeBank(packageId);
  } else if (packageId === BLR_CP003_QUESTION_STUDIO_PACKAGE_ID) {
    records = generateBlrCp003LocalizedReviewBank(generateBlrCp003FinalApprovedBank(), language === "hi" ? "hi-IN" : "pa-IN") as unknown as readonly RawQuestion[];
  } else if (packageId === BLR_CP004_QUESTION_STUDIO_PACKAGE_ID) {
    records = generateBlrCp004LocalizedReviewBank(language === "hi" ? "hi-IN" : "pa-IN") as unknown as readonly RawQuestion[];
  } else if (packageId === BLR_CP005_QUESTION_STUDIO_PACKAGE_ID) {
    records = generateBlrCp005LocalizedReviewBank(language === "hi" ? "hi-IN" : "pa-IN") as unknown as readonly RawQuestion[];
  } else {
    throw new Error(`${packageSpec(packageId).checkpointId} currently supports English generation only.`);
  }
  rawCache.set(key, records);
  return records;
}

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableOrder<T>(items: readonly T[], seed: string): T[] {
  return [...items]
    .map((item, index) => ({ item, score: hashSeed(`${seed}:${index}`) }))
    .sort((left, right) => left.score - right.score)
    .map(({ item }) => item);
}

export function previewBlrChapterQuestionStudio(request: BlrChapterStudioRequest) {
  const spec = packageSpec(request.packageId);
  const language = request.language ?? "en";
  if (!(spec.supportedLanguages as readonly string[]).includes(language)) {
    throw new Error(`${spec.checkpointId} does not support '${language}' generation yet.`);
  }
  if (request.qlId && !(spec.qlIds as readonly string[]).includes(request.qlId)) {
    throw new Error(`${request.qlId} does not belong to ${spec.checkpointId}.`);
  }
  const normalized = rawBank(request.packageId, language).map((record) => normalize(record, request.packageId));
  let eligible = normalized.filter((question) =>
    (!request.qlId || question.qlId === request.qlId)
    && (!request.difficulty || question.difficultyBand === request.difficulty),
  );
  if (request.canonicalItemId || request.questionLanguageId) {
    eligible = eligible.filter((question) => request.canonicalItemId
      ? question.canonicalItemId === request.canonicalItemId
      : question.questionLanguageId === request.questionLanguageId);
  }
  if (!eligible.length) throw new Error(`No ${spec.checkpointId} questions match the selected filters.`);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = request.seed ?? `${request.packageId}:${language}:${request.qlId ?? "all"}:${request.difficulty ?? "all"}`;
  const ordered = stableOrder(eligible, seed);
  const questions = Array.from({ length: count }, (_, index) => ordered[index % ordered.length]!);
  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: request.packageId,
      seed,
      runtimeMode: "CHAPTER_RUNTIME_REVIEW",
      integrationStatus: "QUESTION_STUDIO_GENERATION_READY",
      reviewStatus: language === "en" ? "CURRENT_ENGLISH_AUTHORITY" : "LOCALIZED_REVIEW_REQUIRED",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      persistenceAllowed: false,
    },
    questions,
  } as const;
}

export function releaseAuthorityForBlrChapterPackage(packageId: BlrChapterStudioPackageId, language: BlrChapterStudioLanguage): string {
  if (packageId === BLR_CP001_QUESTION_STUDIO_PACKAGE_ID) return "BLR_CP001_ENGLISH_RUNTIME_PROOF";
  if (packageId === BLR_CP002_QUESTION_STUDIO_PACKAGE_ID) return "BLR_CP002_ENGLISH_RUNTIME_PROOF";
  if (packageId === BLR_CP003_QUESTION_STUDIO_PACKAGE_ID) return language === "en" ? "BLR_CP003_ENGLISH_DISCOVERY_FROZEN" : BLR_CP003_HI_PA_LOCALISATION_REVIEW_CANDIDATE;
  if (packageId === BLR_CP004_QUESTION_STUDIO_PACKAGE_ID) return language === "en" ? BLR_CP004_FREEZE_VERSION : BLR_CP004_HI_PA_LOCALISATION_REVIEW_CANDIDATE;
  return language === "en" ? BLR_CP005_FREEZE_VERSION : BLR_CP005_HI_PA_LOCALISATION_REVIEW_CANDIDATE;
}
