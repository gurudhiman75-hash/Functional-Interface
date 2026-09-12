import { LP_001_REVIEW_PACKAGE } from "./index.ts";
import { LP_002_REVIEW_PACKAGE } from "./lp-002.ts";
import { LP_003_REVIEW_PACKAGE } from "./lp-003.ts";
import { LP_004_REVIEW_PACKAGE } from "./lp-004.ts";
import { LP_005_REVIEW_PACKAGE } from "./lp-005.ts";
import { LP_006_REVIEW_PACKAGE } from "./lp-006.ts";
import { LP_007_REVIEW_PACKAGE } from "./lp-007.ts";
import { LP_008_REVIEW_PACKAGE } from "./lp-008.ts";
import { generateLp009Batch, LP_009_REVIEW_PACKAGE } from "./lp-009.ts";
import { generateLp009LocalizedBatchV3 } from "./lp-009-localization-v3.ts";
import { LP_009_MULTILINGUAL_QUESTION_STUDIO_V1, normalizeLp009QuestionStudioLanguage } from "./lp-009-question-studio-multilingual-v1.ts";
import { generateLp010Batch, LP_010_REVIEW_PACKAGE } from "./lp-010.ts";
import { generateLp010LocalizedBatchV6 } from "./lp-010-localization-v6.ts";
import { LP_010_MULTILINGUAL_QUESTION_STUDIO_V1, normalizeLp010QuestionStudioLanguage } from "./lp-010-question-studio-multilingual-v1.ts";
import {
  generateLp001BatchStabilizedV4_2,
  generateLp002BatchStabilizedV4_2,
  generateLp003BatchStabilizedV4_2,
  generateLp004BatchStabilizedV4_2,
  generateLp005BatchStabilizedV4_2,
  generateLp006BatchStabilizedV4_2,
  generateLp007BatchStabilizedV4_2,
  generateLp008BatchStabilizedV4_2,
} from "./lp-001-008-stabilized-english-v4-2.ts";
import { LP_001_008_LOCALIZED_GENERATORS_V4 } from "./lp-001-008-localization-v4.ts";
import {
  LP_001_008_MULTILINGUAL_QUESTION_STUDIO_V1,
  normalizeLp001008QuestionStudioLanguage,
} from "./lp-001-008-question-studio-multilingual-v1.ts";

export type LogicPuzzleQuestionStudioRequest = {
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  cpId?: string;
  canonicalProblemId?: string;
  language?: string;
  difficulty?: unknown;
  seed?: string;
  count?: number;
};

type PackageId = "LP-001" | "LP-002" | "LP-003" | "LP-004" | "LP-005" | "LP-006" | "LP-007" | "LP-008" | "LP-009" | "LP-010";
type Language = "en" | "hi" | "pa";

type Config = {
  packageId: PackageId;
  reviewPackage: any;
  englishGenerator: (seed?: string, count?: number) => any[];
  localizedGenerator?: (language: "hi" | "pa", seed?: string, count?: number) => any[];
};

const ENGLISH_001_008: Record<string, (seed?: string, count?: number) => any[]> = {
  "LP-001": generateLp001BatchStabilizedV4_2,
  "LP-002": generateLp002BatchStabilizedV4_2,
  "LP-003": generateLp003BatchStabilizedV4_2,
  "LP-004": generateLp004BatchStabilizedV4_2,
  "LP-005": generateLp005BatchStabilizedV4_2,
  "LP-006": generateLp006BatchStabilizedV4_2,
  "LP-007": generateLp007BatchStabilizedV4_2,
  "LP-008": generateLp008BatchStabilizedV4_2,
};

const CONFIGS: Record<PackageId, Config> = {
  "LP-001": { packageId: "LP-001", reviewPackage: LP_001_REVIEW_PACKAGE, englishGenerator: ENGLISH_001_008["LP-001"]!, localizedGenerator: LP_001_008_LOCALIZED_GENERATORS_V4["LP-001"] },
  "LP-002": { packageId: "LP-002", reviewPackage: LP_002_REVIEW_PACKAGE, englishGenerator: ENGLISH_001_008["LP-002"]!, localizedGenerator: LP_001_008_LOCALIZED_GENERATORS_V4["LP-002"] },
  "LP-003": { packageId: "LP-003", reviewPackage: LP_003_REVIEW_PACKAGE, englishGenerator: ENGLISH_001_008["LP-003"]!, localizedGenerator: LP_001_008_LOCALIZED_GENERATORS_V4["LP-003"] },
  "LP-004": { packageId: "LP-004", reviewPackage: LP_004_REVIEW_PACKAGE, englishGenerator: ENGLISH_001_008["LP-004"]!, localizedGenerator: LP_001_008_LOCALIZED_GENERATORS_V4["LP-004"] },
  "LP-005": { packageId: "LP-005", reviewPackage: LP_005_REVIEW_PACKAGE, englishGenerator: ENGLISH_001_008["LP-005"]!, localizedGenerator: LP_001_008_LOCALIZED_GENERATORS_V4["LP-005"] },
  "LP-006": { packageId: "LP-006", reviewPackage: LP_006_REVIEW_PACKAGE, englishGenerator: ENGLISH_001_008["LP-006"]!, localizedGenerator: LP_001_008_LOCALIZED_GENERATORS_V4["LP-006"] },
  "LP-007": { packageId: "LP-007", reviewPackage: LP_007_REVIEW_PACKAGE, englishGenerator: ENGLISH_001_008["LP-007"]!, localizedGenerator: LP_001_008_LOCALIZED_GENERATORS_V4["LP-007"] },
  "LP-008": { packageId: "LP-008", reviewPackage: LP_008_REVIEW_PACKAGE, englishGenerator: ENGLISH_001_008["LP-008"]!, localizedGenerator: LP_001_008_LOCALIZED_GENERATORS_V4["LP-008"] },
  "LP-009": { packageId: "LP-009", reviewPackage: LP_009_REVIEW_PACKAGE, englishGenerator: generateLp009Batch, localizedGenerator: generateLp009LocalizedBatchV3 as any },
  "LP-010": { packageId: "LP-010", reviewPackage: LP_010_REVIEW_PACKAGE, englishGenerator: generateLp010Batch, localizedGenerator: generateLp010LocalizedBatchV6 as any },
};

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function packageFromNumber(value: number): PackageId | null {
  if (value < 1 || value > 10) return null;
  return `LP-${String(value).padStart(3, "0")}` as PackageId;
}

function resolvePackageId(request: LogicPuzzleQuestionStudioRequest): PackageId {
  const packageToken = normalize(request.packageId ?? request.archetypeId);
  const explicit = packageToken.match(/^lp (\d{1,3})$/u);
  if (explicit) return packageFromNumber(Number(explicit[1])) ?? "LP-001";

  const selector = normalize(request.cpId ?? request.canonicalProblemId ?? request.patternId);
  const cp = selector.match(/^lp cp (\d{1,3})$/u);
  if (cp) return packageFromNumber(Number(cp[1])) ?? "LP-001";
  const ql = selector.match(/^lp ql (\d{1,3})/u);
  if (ql) {
    const qlNumber = Number(ql[1]);
    return packageFromNumber(Math.ceil(qlNumber / 4)) ?? "LP-001";
  }
  return "LP-001";
}

export function isLogicPuzzleQuestionStudioRequest(request: LogicPuzzleQuestionStudioRequest): boolean {
  const packageId = normalize(request.packageId ?? request.archetypeId);
  const topic = normalize(request.topic);
  const subtopic = normalize(request.subtopic);
  const selector = normalize(request.cpId ?? request.canonicalProblemId ?? request.patternId);
  return /^lp (?:00[1-9]|010)$/u.test(packageId)
    || packageId === "logic puzzles"
    || /^lp cp (?:00[1-9]|010)$/u.test(selector)
    || /^lp ql (?:00[1-9]|0[1-3][0-9]|040)/u.test(selector)
    || subtopic === "logic puzzles"
    || (topic === "reasoning" && subtopic === "puzzles");
}

function is001008(packageId: PackageId): packageId is Exclude<PackageId, "LP-009" | "LP-010"> {
  return Number(packageId.slice(-3)) <= 8;
}

function normalizeLanguage(packageId: PackageId, value: unknown): Language {
  if (is001008(packageId)) return normalizeLp001008QuestionStudioLanguage(value);
  if (packageId === "LP-009") return normalizeLp009QuestionStudioLanguage(value);
  return normalizeLp010QuestionStudioLanguage(value);
}

function packageQlIds(packageId: PackageId): readonly string[] {
  if (is001008(packageId)) return LP_001_008_MULTILINGUAL_QUESTION_STUDIO_V1.packageQlIds[packageId];
  if (packageId === "LP-009") return LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.permanentQlIds;
  return LP_010_MULTILINGUAL_QUESTION_STUDIO_V1.permanentQlIds;
}

function localizationFreezeStatus(packageId: PackageId): string {
  if (is001008(packageId)) return LP_001_008_MULTILINGUAL_QUESTION_STUDIO_V1.localizationFreezeStatus;
  if (packageId === "LP-009") return LP_009_MULTILINGUAL_QUESTION_STUDIO_V1.localizationFreezeStatus;
  return LP_010_MULTILINGUAL_QUESTION_STUDIO_V1.localizationFreezeStatus;
}

function localizationAuthorityId(packageId: PackageId, language: Language): string {
  if (is001008(packageId)) return language === "en" ? "LP_001_008_ENGLISH_FREEZE_V1" : "LP_001_008_HI_PA_LOCALIZATION_FREEZE_V4";
  if (packageId === "LP-009") return language === "en" ? "LP_009_ENGLISH_FREEZE_V1" : "LP_009_HI_PA_LOCALIZATION_FREEZE_V3";
  return language === "en" ? "LP_010_ENGLISH_FREEZE_V1" : "LP_010_HI_PA_LOCALIZATION_FREEZE_V6";
}

function frozenSourceStatus(packageId: PackageId): string {
  if (is001008(packageId)) return "FROZEN_LOCALIZATION_V4";
  if (packageId === "LP-009") return "FROZEN_LOCALIZATION_V3";
  return "FROZEN_LOCALIZATION_V6";
}

function standaloneText(packageId: PackageId, caselet: any, child: any): string {
  if (!is001008(packageId)) return child.stem;
  const source = caselet.englishCaselet ?? caselet;
  const clues: readonly string[] = caselet.learnerFacingClues
    ?? source.learnerFacingClues
    ?? (source.clues ?? []).map((clue: any) => clue.text);
  return `${caselet.scenario}\n\nClues:\n${clues.map((clue) => `- ${clue}`).join("\n")}\n\n${child.stem}`;
}

function logicPayload(packageId: PackageId, caselet: any): Record<string, unknown> {
  const source = caselet.englishCaselet ?? caselet;
  const common = { clues: source.clues, assignment: source.assignment };
  if (packageId === "LP-001") return { ...common, people: source.people, groups: source.groups, groupLabels: source.groupLabels };
  if (packageId === "LP-002") return { ...common, people: source.people, days: source.days, locations: source.locations, labels: source.labels };
  if (packageId === "LP-003") return { ...common, boxes: source.boxes, positions: source.positions, boxLabels: source.boxLabels };
  if (packageId === "LP-004") return { ...common, candidates: source.candidates, committeeSize: source.committeeSize, candidateLabels: source.candidateLabels };
  if (packageId === "LP-005") return { ...common, people: source.people, duties: source.duties, places: source.places, labels: source.labels };
  if (packageId === "LP-006") return { ...common, people: source.people, days: source.days, subjects: source.subjects, cities: source.cities, labels: source.labels };
  if (packageId === "LP-007") return { ...common, people: source.people, values: source.values, labels: source.labels };
  if (packageId === "LP-008") return { ...common, people: source.people, months: source.months, slots: source.slots, labels: source.labels };
  if (packageId === "LP-009") return { ...common, mode: source.mode, people: source.people, values: source.values, labels: source.labels };
  return { ...common, people: source.people, slots: source.slots, labels: source.labels };
}

export function listLogicPuzzleQuestionStudioPackages() {
  return (Object.values(CONFIGS) as Config[]).map((config) => {
    const pkg = config.reviewPackage;
    const qlIds = packageQlIds(config.packageId);
    const freeze = localizationFreezeStatus(config.packageId);
    return {
      id: pkg.packageId,
      packageId: pkg.packageId,
      type: "reasoning-v1",
      section: "Reasoning",
      domain: "reasoning",
      subject: "Reasoning",
      topic: "Puzzles",
      subtopic: "Logic Puzzles",
      name: pkg.label,
      label: pkg.label,
      generationDomain: "reasoning-v1",
      cpIds: [pkg.checkpointId],
      canonicalProblems: qlIds.map((id) => ({ id, label: id, checkpointId: pkg.checkpointId })),
      patternIds: [...qlIds],
      supportedDifficulties: [...pkg.supportedDifficulties],
      supportedLanguages: ["en", "hi", "pa"] as Language[],
      enabled: true,
      runtimeMode: "REVIEW_ONLY",
      supportedRuntimeModes: ["REVIEW_ONLY"],
      reviewStatus: "REVIEW_ONLY",
      releaseFreezeStatus: `LOCALIZATION_${freeze}`,
      localizationFreezeStatus: freeze,
      questionStudioLanguageActivation: "ACTIVE_REVIEW_ONLY",
      reviewOnly: true,
      permanentQlCount: qlIds.length,
      permanentQlIds: [...qlIds],
      permanentQlAllocationStatus: "ALLOCATED",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    };
  });
}

export async function generateLogicPuzzleQuestionStudioBatch(request: LogicPuzzleQuestionStudioRequest = {}) {
  const packageId = resolvePackageId(request);
  const config = CONFIGS[packageId];
  const language = normalizeLanguage(packageId, request.language);
  const count = Math.min(12, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = String(request.seed || `question-studio:${packageId}`);
  const caselets = language === "en"
    ? config.englishGenerator(seed, count)
    : config.localizedGenerator!(language, seed, count);
  const qlIds = packageQlIds(packageId);
  const freeze = localizationFreezeStatus(packageId);
  const pkg = config.reviewPackage;
  const questions = caselets.flatMap((caselet: any, caseletIndex: number) => caselet.children.map((child: any, childIndex: number) => ({
    text: standaloneText(packageId, caselet, child),
    options: child.options,
    correct: child.correctIndex,
    correctIndex: child.correctIndex,
    answer: child.answer,
    explanation: child.explanation.lines.join("\n\n"),
    packageExplanation: child.explanation,
    difficulty: child.difficultyBand,
    difficultyLabel: child.difficultyBand,
    patternId: child.qlId,
    section: "Reasoning",
    topic: "Puzzles",
    subtopic: "Logic Puzzles",
    generationBackend: "reasoning-v1",
    packageId,
    canonicalProblemId: child.qlId,
    questionLanguageId: `${child.qlId}-${language.toUpperCase()}`,
    questionId: child.questionId,
    language,
    seed,
    questionIndex: caseletIndex * caselet.children.length + childIndex,
    questionCount: caselets.length * 4,
    runtimeMode: "REVIEW_ONLY",
    reviewStatus: "REVIEW_ONLY",
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    traceability: { checkpointId: pkg.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, sourceStatus: frozenSourceStatus(packageId) },
    metadata: { packageId, checkpointId: pkg.checkpointId, qlId: child.qlId, caseletId: caselet.caseletId, language, localizationAuthorityId: localizationAuthorityId(packageId, language) },
    logic: logicPayload(packageId, caselet),
  })));

  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId,
      chapterId: "REAS-PUZ",
      seed,
      runtimeMode: "REVIEW_ONLY",
      lifecycleStatus: "REVIEW_ONLY",
      permanentQlCount: qlIds.length,
      permanentQlIds: [...qlIds],
      permanentQlAllocationStatus: "ALLOCATED",
      localizationFreezeStatus: freeze,
      questionStudioLanguageActivation: "ACTIVE_REVIEW_ONLY",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      language,
      checkpointId: pkg.checkpointId,
    },
    questionPackages: questions,
    questions,
  };
}
