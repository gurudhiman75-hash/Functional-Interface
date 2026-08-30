import { createHash } from "node:crypto";

import {
  generateDsfQuestionStudioBatch,
  type DsfStudioDomainId,
} from "../DSF-CP-002/question-studio-integration-v1.ts";
import { generateDsfCp011AverageBatch } from "../DSF-CP-011/average-runtime-v1.ts";
import { generateDsfCp011AgesEditorialBatch } from "../DSF-CP-011/ages-editorial-runtime-v1.ts";
import { generateDsfCp011PnlBatch } from "../DSF-CP-011/pnl-runtime-v1.ts";
import { generateDsfCp011InterestBatch } from "../DSF-CP-011/interest-runtime-v1.ts";
import { generateDsfCp011TmwBatch } from "../DSF-CP-011/time-work-pipes-runtime-v1.ts";
import { generateDsfCp011TsdBatch } from "../DSF-CP-011/tsd-runtime-v2.ts";
import { generateDsfCp011MixtureBatch } from "../DSF-CP-011/mixture-runtime-v1.ts";
import { generateDsfCp011MensurationBatch } from "../DSF-CP-011/mensuration-runtime-v1.ts";
import { generateDsfCp011CoreEnrichmentBatch } from "../DSF-CP-011/core-domain-enrichment-runtime-v1.ts";
import { generateDsfCp011AlgebraEnrichmentBatch } from "../DSF-CP-011/algebra-enrichment-runtime-v1.ts";
import { generateDsfCp012RankingBatch } from "../DSF-CP-012/ranking-runtime-v1.ts";
import { generateDsfCp012DirectionBatch } from "../DSF-CP-012/direction-runtime-v1.ts";
import { generateDsfCp012BloodQuestion } from "../DSF-CP-012/blood-relations-runtime-v2.ts";
import { generateDsfCp012InequalityBatch } from "../DSF-CP-012/inequality-runtime-v1.ts";
import { generateDsfCp013SeatingBatch } from "../DSF-CP-013/seating-runtime-v1.ts";
import { generateDsfCp013CodingBatch } from "../DSF-CP-013/coding-runtime-v1.ts";
import { generateDsfCp013CalendarBatch } from "../DSF-CP-013/calendar-runtime-v1.ts";
import {
  DSF_REASONING_COMMON_BASE_EDITORIAL_VERSION,
  reasoningEditorialLead,
  reasoningExplanationLead,
  type DsfReasoningEditorialLane,
} from "../DSF-CP-014/reasoning-common-base-editorial-overlay.ts";
import {
  DSF_CURRENT_NEXT_AVAILABLE_QL_ID,
  DSF_CURRENT_PERMANENT_QL_REGISTRY,
} from "../foundation/current-permanent-ql-registry.ts";

export const DSF_CP017_QUESTION_STUDIO_AUTHORITY = "DSF_CP017_NORMAL_QUESTION_STUDIO_REVIEW_V1" as const;
export const DSF_CP017_CHECKPOINT_ID = "DSF-CP-017" as const;
export const DSF_CP017_PACKAGE_ID = "DSF-001" as const;
export const DSF_CP017_GENERATABLE_QL_IDS = ["DSF-QL-001"] as const;
export const DSF_CP017_RUNTIME_DEFERRED_QL_IDS = ["DSF-QL-002"] as const;
export const DSF_CP017_SUPPORTED_LANGUAGES = ["en"] as const;
export const DSF_CP017_SUPPORTED_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export const DSF_CP017_LANES = Object.freeze([
  { laneId: "DSF-QS-LEGACY-NUMBER-SYSTEM", label: "Number System · frozen core", checkpointId: "DSF-CP-002", domainFamily: "QUANT", sourceChapter: "NUM-001" },
  { laneId: "DSF-QS-LEGACY-RATIO", label: "Ratio & Proportion · frozen core", checkpointId: "DSF-CP-002", domainFamily: "QUANT", sourceChapter: "RAP-001" },
  { laneId: "DSF-QS-LEGACY-PERCENTAGE", label: "Percentage · frozen core", checkpointId: "DSF-CP-002", domainFamily: "QUANT", sourceChapter: "PCT-001" },
  { laneId: "DSF-QS-LEGACY-ALGEBRA", label: "Algebra · frozen core", checkpointId: "DSF-CP-002", domainFamily: "QUANT", sourceChapter: "ALG-002" },
  { laneId: "DSF-QS-AVERAGE", label: "Average", checkpointId: "DSF-CP-011", domainFamily: "QUANT", sourceChapter: "AVG-001" },
  { laneId: "DSF-QS-AGES", label: "Ages", checkpointId: "DSF-CP-011", domainFamily: "QUANT", sourceChapter: "RAP-003" },
  { laneId: "DSF-QS-PROFIT-LOSS-DISCOUNT", label: "Profit, Loss & Discount", checkpointId: "DSF-CP-011", domainFamily: "QUANT", sourceChapter: "PNL-001" },
  { laneId: "DSF-QS-INTEREST", label: "Simple & Compound Interest", checkpointId: "DSF-CP-011", domainFamily: "QUANT", sourceChapter: "INT-001" },
  { laneId: "DSF-QS-TIME-WORK-PIPES", label: "Time & Work / Pipes & Cisterns", checkpointId: "DSF-CP-011", domainFamily: "QUANT", sourceChapter: "TMW-001" },
  { laneId: "DSF-QS-TSD-TRAINS-BOATS", label: "Time, Speed & Distance / Trains / Boats", checkpointId: "DSF-CP-011", domainFamily: "QUANT", sourceChapter: "TSD-001" },
  { laneId: "DSF-QS-MIXTURE-ALLIGATION", label: "Mixture & Alligation", checkpointId: "DSF-CP-011", domainFamily: "QUANT", sourceChapter: "MAL-001" },
  { laneId: "DSF-QS-MENSURATION", label: "Mensuration 2D & 3D", checkpointId: "DSF-CP-011", domainFamily: "QUANT", sourceChapter: "MEN-001/MEN-002" },
  { laneId: "DSF-QS-CORE-ENRICHMENT", label: "Ratio / Percentage / Number System enrichment", checkpointId: "DSF-CP-011", domainFamily: "QUANT", sourceChapter: "RAP-001/PCT-001/NUM-001" },
  { laneId: "DSF-QS-ALGEBRA-ENRICHMENT", label: "Algebra enrichment", checkpointId: "DSF-CP-011", domainFamily: "QUANT", sourceChapter: "ALG" },
  { laneId: "DSF-QS-RANKING", label: "Ranking & Order", checkpointId: "DSF-CP-012", domainFamily: "REASONING", sourceChapter: "RNK-001", editorialLane: "RANKING" },
  { laneId: "DSF-QS-DIRECTION", label: "Direction Sense", checkpointId: "DSF-CP-012", domainFamily: "REASONING", sourceChapter: "SPA/DIR", editorialLane: "DIRECTION" },
  { laneId: "DSF-QS-BLOOD-RELATIONS", label: "Blood Relations", checkpointId: "DSF-CP-012", domainFamily: "REASONING", sourceChapter: "BLR-001", editorialLane: "BLOOD_RELATIONS" },
  { laneId: "DSF-QS-INEQUALITY", label: "Inequality", checkpointId: "DSF-CP-012", domainFamily: "REASONING", sourceChapter: "INEQUALITY", editorialLane: "INEQUALITY" },
  { laneId: "DSF-QS-SEATING", label: "Seating Arrangement", checkpointId: "DSF-CP-013", domainFamily: "REASONING", sourceChapter: "SEA-001", editorialLane: "SEATING" },
  { laneId: "DSF-QS-CODING", label: "Coding-Decoding", checkpointId: "DSF-CP-013", domainFamily: "REASONING", sourceChapter: "COD-CP-001", editorialLane: "CODING" },
  { laneId: "DSF-QS-CALENDAR", label: "Calendar", checkpointId: "DSF-CP-013", domainFamily: "REASONING", sourceChapter: "CAL-001", editorialLane: "CALENDAR" },
] as const);

export type DsfCp017LaneId = (typeof DSF_CP017_LANES)[number]["laneId"];
export type DsfCp017Difficulty = (typeof DSF_CP017_SUPPORTED_DIFFICULTIES)[number];

type AnyQuestion = Readonly<Record<string, any>>;
type LaneEntry = (typeof DSF_CP017_LANES)[number];

export interface DsfCp017QuestionStudioInput {
  readonly seed?: string;
  readonly count?: number;
  readonly language?: string;
  readonly difficulty?: string;
  readonly laneId?: string;
  readonly canonicalProblemId?: string;
  readonly cpId?: string;
  readonly qlId?: string;
  readonly patternId?: string;
}

export const DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  id: DSF_CP017_PACKAGE_ID,
  packageId: DSF_CP017_PACKAGE_ID,
  type: "reasoning-v1" as const,
  section: "Reasoning" as const,
  domain: "reasoning" as const,
  subject: "Reasoning Ability" as const,
  topic: "Reasoning" as const,
  subtopic: "Data Sufficiency" as const,
  name: "DSF-001 Data Sufficiency — complete two-statement Question Studio breadth",
  label: "Data Sufficiency — complete two-statement breadth",
  generationDomain: "reasoning-v1" as const,
  integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
  integrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
  cpIds: Object.freeze(["DSF-CP-002", "DSF-CP-011", "DSF-CP-012", "DSF-CP-013", "DSF-CP-014", "DSF-CP-015", "DSF-CP-016", DSF_CP017_CHECKPOINT_ID] as const),
  canonicalProblems: Object.freeze(DSF_CP017_LANES.map((lane) => Object.freeze({
    id: lane.laneId,
    label: lane.label,
    checkpointId: lane.checkpointId,
    qlId: "DSF-QL-001" as const,
    domainFamily: lane.domainFamily,
    sourceChapter: lane.sourceChapter,
    supportedLanguages: DSF_CP017_SUPPORTED_LANGUAGES,
  }))),
  laneCount: DSF_CP017_LANES.length,
  permanentQlCount: DSF_CURRENT_PERMANENT_QL_REGISTRY.length,
  permanentQlIds: Object.freeze(DSF_CURRENT_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId)),
  generatableQlIds: DSF_CP017_GENERATABLE_QL_IDS,
  runtimeDeferredQlIds: DSF_CP017_RUNTIME_DEFERRED_QL_IDS,
  nextAvailableQlId: DSF_CURRENT_NEXT_AVAILABLE_QL_ID,
  supportedLanguages: DSF_CP017_SUPPORTED_LANGUAGES,
  supportedDifficulties: DSF_CP017_SUPPORTED_DIFFICULTIES,
  enabled: true as const,
  questionStudioVisible: true as const,
  questionStudioDiscoverable: true as const,
  questionStudioGenerationEnabled: true as const,
  persistenceAllowed: true as const,
  runtimeMode: "REVIEW_ONLY_CURRENT_TWO_STATEMENT_BREADTH" as const,
  reviewStatus: "QUESTION_STUDIO_REVIEW_CONNECTED" as const,
  reviewOnly: true as const,
  manualApprovalRequired: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  ql002RuntimeStatus: "PERMANENT_SEMANTICS_ALLOCATED_BATCH_RUNTIME_DEFERRED" as const,
});

function stableHash(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function numericSeed(seedText: string, itemIndex: number, attempt: number): number {
  return stableHash(`${DSF_CP017_QUESTION_STUDIO_AUTHORITY}:${seedText}:${itemIndex}:${attempt}`) & 0x7fffffff;
}

function normalizeDifficulty(value: unknown): DsfCp017Difficulty | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text) return undefined;
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  throw new Error(`Unsupported Data Sufficiency difficulty '${String(value)}'.`);
}

function normalizeLanguage(value: unknown): "en" {
  const language = String(value ?? "en").trim().toLowerCase() || "en";
  if (language !== "en") {
    throw new Error(
      `The CP011-CP013 normal Data Sufficiency Studio expansion is English-first. '${language}' remains available only through the existing approved DSF localization route until the new breadth is localized.`,
    );
  }
  return "en";
}

function requestedQl(input: DsfCp017QuestionStudioInput): string | undefined {
  const candidates = [input.qlId, input.patternId, input.canonicalProblemId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter(Boolean);
  return candidates.find((value) => value.startsWith("DSF-QL-"));
}

function assertGeneratableQl(input: DsfCp017QuestionStudioInput): void {
  const ql = requestedQl(input);
  if (!ql || ql === "DSF-QL-001") return;
  if (ql === "DSF-QL-002") {
    throw new Error(
      "DSF-QL-002 is permanently allocated, but CP015 currently provides semantic/prototype proof rather than an exhaustively reviewed batch generator. It is intentionally not exposed for normal Question Studio generation yet.",
    );
  }
  throw new Error(`Unsupported Data Sufficiency QL '${ql}'.`);
}

function laneById(value: unknown): LaneEntry | undefined {
  const id = String(value ?? "").trim().toUpperCase();
  if (!id || id.startsWith("DSF-QL-")) return undefined;
  return DSF_CP017_LANES.find((lane) => lane.laneId === id);
}

function candidateLanes(input: DsfCp017QuestionStudioInput): readonly LaneEntry[] {
  const explicitLane = laneById(input.laneId) ?? laneById(input.canonicalProblemId);
  if (input.laneId && !explicitLane) throw new Error(`Unsupported Data Sufficiency lane '${input.laneId}'.`);
  if (input.canonicalProblemId && !String(input.canonicalProblemId).toUpperCase().startsWith("DSF-QL-") && !explicitLane) {
    throw new Error(`Unsupported Data Sufficiency canonical problem '${input.canonicalProblemId}'.`);
  }
  if (explicitLane) return [explicitLane];

  const checkpoint = String(input.cpId ?? "").trim().toUpperCase();
  if (!checkpoint) return DSF_CP017_LANES;
  const lanes = DSF_CP017_LANES.filter((lane) => lane.checkpointId === checkpoint);
  if (!lanes.length) throw new Error(`Checkpoint '${checkpoint}' has no normal Data Sufficiency batch runtime.`);
  return lanes;
}

function legacyQuestion(domain: DsfStudioDomainId, seed: number): AnyQuestion {
  const result = generateDsfQuestionStudioBatch({
    seed: `${DSF_CP017_QUESTION_STUDIO_AUTHORITY}:${seed}`,
    count: 1,
    domain,
    language: "en",
  });
  return result.questions[0]! as AnyQuestion;
}

function reasoningSurface(lane: DsfReasoningEditorialLane, question: AnyQuestion): AnyQuestion {
  const seed = Number(question.seed ?? 0);
  return Object.freeze({
    ...question,
    stem: `${reasoningEditorialLead(lane, seed)}\n\n${String(question.stem ?? "")}`,
    studioExplanationLead: reasoningExplanationLead(lane, seed),
    editorialSurfaceVersion: DSF_REASONING_COMMON_BASE_EDITORIAL_VERSION,
  });
}

function generateLaneQuestion(lane: LaneEntry, seed: number): AnyQuestion {
  switch (lane.laneId) {
    case "DSF-QS-LEGACY-NUMBER-SYSTEM": return legacyQuestion("NUMBER_SYSTEM", seed);
    case "DSF-QS-LEGACY-RATIO": return legacyQuestion("RATIO_PROPORTION", seed);
    case "DSF-QS-LEGACY-PERCENTAGE": return legacyQuestion("PERCENTAGE", seed);
    case "DSF-QS-LEGACY-ALGEBRA": return legacyQuestion("ALGEBRA", seed);
    case "DSF-QS-AVERAGE": return generateDsfCp011AverageBatch([seed])[0]! as AnyQuestion;
    case "DSF-QS-AGES": return generateDsfCp011AgesEditorialBatch([seed])[0]! as AnyQuestion;
    case "DSF-QS-PROFIT-LOSS-DISCOUNT": return generateDsfCp011PnlBatch([seed])[0]! as AnyQuestion;
    case "DSF-QS-INTEREST": return generateDsfCp011InterestBatch([seed])[0]! as AnyQuestion;
    case "DSF-QS-TIME-WORK-PIPES": return generateDsfCp011TmwBatch([seed])[0]! as AnyQuestion;
    case "DSF-QS-TSD-TRAINS-BOATS": return generateDsfCp011TsdBatch([seed])[0]! as AnyQuestion;
    case "DSF-QS-MIXTURE-ALLIGATION": return generateDsfCp011MixtureBatch([seed])[0]! as AnyQuestion;
    case "DSF-QS-MENSURATION": return generateDsfCp011MensurationBatch([seed])[0]! as AnyQuestion;
    case "DSF-QS-CORE-ENRICHMENT": return generateDsfCp011CoreEnrichmentBatch([seed])[0]! as AnyQuestion;
    case "DSF-QS-ALGEBRA-ENRICHMENT": return generateDsfCp011AlgebraEnrichmentBatch([seed])[0]! as AnyQuestion;
    case "DSF-QS-RANKING": return reasoningSurface("RANKING", generateDsfCp012RankingBatch([seed])[0]! as AnyQuestion);
    case "DSF-QS-DIRECTION": return reasoningSurface("DIRECTION", generateDsfCp012DirectionBatch([seed])[0]! as AnyQuestion);
    case "DSF-QS-BLOOD-RELATIONS": return reasoningSurface("BLOOD_RELATIONS", generateDsfCp012BloodQuestion(seed) as AnyQuestion);
    case "DSF-QS-INEQUALITY": return reasoningSurface("INEQUALITY", generateDsfCp012InequalityBatch([seed])[0]! as AnyQuestion);
    case "DSF-QS-SEATING": return reasoningSurface("SEATING", generateDsfCp013SeatingBatch([seed])[0]! as AnyQuestion);
    case "DSF-QS-CODING": return reasoningSurface("CODING", generateDsfCp013CodingBatch([seed])[0]! as AnyQuestion);
    case "DSF-QS-CALENDAR": return reasoningSurface("CALENDAR", generateDsfCp013CalendarBatch([seed])[0]! as AnyQuestion);
  }
}

function stemOnly(stem: unknown): string {
  return String(stem ?? "").split(/\n\nStatement I:/u, 1)[0]!.trim();
}

function explanationBody(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.filter((entry): entry is string => typeof entry === "string").join("\n");
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  if (Array.isArray(record.steps)) {
    const steps = record.steps.filter((entry): entry is string => typeof entry === "string");
    if (steps.length) return steps.join("\n");
  }
  const preferred = ["askedTarget", "statementI", "statementII", "together", "conclusion"]
    .map((key) => record[key])
    .filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
  if (preferred.length) return preferred.join("\n");
  return Object.values(record)
    .filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    .join("\n");
}

function sourceIdentity(question: AnyQuestion): string {
  return String(
    question.sourceGenerationIdentity
    ?? question.generationIdentity
    ?? question.questionId
    ?? question.studentSurfaceFingerprint
    ?? `${question.checkpointId ?? "DSF"}:${question.seed ?? "seed"}:${question.solveModeId ?? question.solveMode ?? "mode"}`,
  );
}

function normalQuestionId(lane: LaneEntry, question: AnyQuestion): string {
  return `DSF-QS17-${createHash("sha256")
    .update(`${DSF_CP017_QUESTION_STUDIO_AUTHORITY}:${lane.laneId}:${sourceIdentity(question)}`)
    .digest("hex")
    .slice(0, 24)}`;
}

function normalizeQuestion(lane: LaneEntry, question: AnyQuestion) {
  const statements = Array.isArray(question.statements) ? question.statements : [];
  if (statements.length !== 2 || typeof statements[0]?.text !== "string" || typeof statements[1]?.text !== "string") {
    throw new Error(`${lane.laneId}: source question does not expose two valid statements.`);
  }
  const optionDetails = Array.isArray(question.options)
    ? question.options.map((option: any, index: number) => ({
        label: String(option.key ?? String.fromCharCode(65 + index)),
        text: String(option.value ?? option.text ?? ""),
        isCorrect: Boolean(option.isCorrect),
        semanticClass: String(option.semanticClass ?? ""),
      }))
    : [];
  if (optionDetails.length !== 5) throw new Error(`${lane.laneId}: source question does not expose the five-option DS contract.`);
  const derivedCorrectIndex = optionDetails.findIndex((option) => option.isCorrect);
  const correctIndex = Number.isInteger(question.correctIndex) && question.correctIndex >= 0
    ? Number(question.correctIndex)
    : derivedCorrectIndex;
  if (correctIndex < 0 || correctIndex >= optionDetails.length || optionDetails.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${lane.laneId}: source question does not have exactly one correct option.`);
  }

  const cleanStem = stemOnly(question.stem);
  const text = `${cleanStem}\nI. ${statements[0].text}\nII. ${statements[1].text}`;
  const explanation = [String(question.studioExplanationLead ?? "").trim(), explanationBody(question.explanation)]
    .filter(Boolean)
    .join("\n");
  const questionId = normalQuestionId(lane, question);
  const sourceCheckpointId = String(question.checkpointId ?? question.sourceCheckpointId ?? lane.checkpointId);
  const sourceChapterId = String(question.sourceChapterId ?? lane.sourceChapter);
  const solveMode = String(question.solveModeId ?? question.solveMode ?? "");
  const canonicalAnswer = String(question.canonicalAnswer ?? optionDetails[correctIndex]!.semanticClass);

  return Object.freeze({
    text,
    stem: cleanStem,
    questionPrompt: String(question.questionPrompt ?? "Determine whether the given statements are sufficient to answer the question."),
    statements: Object.freeze([
      Object.freeze({ ...statements[0], id: "I" as const, text: String(statements[0].text) }),
      Object.freeze({ ...statements[1], id: "II" as const, text: String(statements[1].text) }),
    ] as const),
    options: Object.freeze(optionDetails.map((option) => option.text)),
    optionDetails: Object.freeze(optionDetails),
    correct: correctIndex,
    correctIndex,
    answer: optionDetails[correctIndex]!.text,
    canonicalAnswer,
    explanation,
    richExplanation: question.explanation,
    difficulty: String(question.difficulty ?? "Medium"),
    difficultyLabel: String(question.difficulty ?? "Medium"),
    renderer: "TEXT_MATH" as const,
    packageId: DSF_CP017_PACKAGE_ID,
    patternId: "DSF-QL-001" as const,
    qlId: "DSF-QL-001" as const,
    qlName: "Two-statement target determinacy",
    canonicalProblemId: lane.laneId,
    laneId: lane.laneId,
    laneLabel: lane.label,
    checkpointId: DSF_CP017_CHECKPOINT_ID,
    sourceCheckpointId,
    sourceChapterId,
    solveMode,
    targetKind: String(question.targetKind ?? ""),
    domainFamily: String(question.domainFamily ?? lane.domainFamily),
    contextId: String(question.contextId ?? question.domain ?? lane.laneId),
    topic: "Reasoning" as const,
    subtopic: "Data Sufficiency" as const,
    subject: "Reasoning Ability" as const,
    language: "en" as const,
    locale: String(question.locale ?? "en-IN"),
    seed: Number(question.seed ?? 0),
    generationSeed: Number(question.seed ?? 0),
    questionId,
    questionLanguageId: questionId,
    sourceGenerationIdentity: sourceIdentity(question),
    contentFingerprint: String(question.studentSurfaceFingerprint ?? sourceIdentity(question)),
    editorialSurfaceVersion: question.editorialSurfaceVersion,
    proof: question.proof,
    sourceAncestry: question.sourceAncestry,
    sourceCapabilities: question.sourceCapabilities,
    sourceValidation: question.validation ?? question.proof,
    sourceLifecycle: question.lifecycle,
    integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
    integrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
    runtimeMode: DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeMode,
    reviewStatus: DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.reviewStatus,
    questionStudioRegistrationStatus: "REGISTERED" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    questionStudioDiscoverable: true as const,
    questionStudioGenerationEnabled: true as const,
    persistenceAllowed: true as const,
    reviewOnly: true as const,
    manualApprovalRequired: true as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    generationContext: Object.freeze({
      generationDomain: "reasoning-v1" as const,
      packageId: DSF_CP017_PACKAGE_ID,
      chapter: "Data Sufficiency" as const,
      laneId: lane.laneId,
      sourceCheckpointId,
      integrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
      qlId: "DSF-QL-001" as const,
      sourceChapterId,
      solveMode,
      semanticClass: canonicalAnswer,
      difficulty: String(question.difficulty ?? "Medium"),
      language: "en" as const,
      locale: String(question.locale ?? "en-IN"),
      integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
      questionStudioDiscoverable: true as const,
      persistenceAllowed: true as const,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      editorialSurfaceVersion: question.editorialSurfaceVersion ?? null,
    }),
  });
}

export function isDsf001NormalQuestionStudioRequest(input: DsfCp017QuestionStudioInput | Record<string, unknown>): boolean {
  const normalize = (value: unknown) => String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const packageId = normalize((input as any).packageId ?? (input as any).archetypeId);
  const patternId = normalize((input as any).patternId);
  const canonicalProblemId = normalize((input as any).canonicalProblemId);
  const topic = normalize((input as any).topic);
  const subtopic = normalize((input as any).subtopic);
  return packageId === "dsf 001"
    || patternId.startsWith("dsf ql")
    || canonicalProblemId.startsWith("dsf qs")
    || subtopic === "data sufficiency"
    || (topic === "reasoning" && subtopic === "data sufficiency");
}

export function previewDsf001NormalQuestionStudioReview(input: DsfCp017QuestionStudioInput = {}) {
  normalizeLanguage(input.language);
  assertGeneratableQl(input);
  const difficulty = normalizeDifficulty(input.difficulty);
  const lanes = candidateLanes(input);
  const count = Math.min(50, Math.max(1, Math.floor(Number(input.count ?? 5) || 5)));
  const seedText = String(input.seed ?? "").trim() || "dsf-normal-question-studio";
  const questions: ReturnType<typeof normalizeQuestion>[] = [];
  const seen = new Set<string>();

  for (let itemIndex = 0; itemIndex < count; itemIndex += 1) {
    let found: ReturnType<typeof normalizeQuestion> | undefined;
    let lastError: unknown;
    for (let attempt = 0; attempt < 12000; attempt += 1) {
      const lane = lanes[stableHash(`${seedText}:lane:${itemIndex}:${attempt}`) % lanes.length]!;
      const seed = numericSeed(seedText, itemIndex, attempt);
      try {
        const normalized = normalizeQuestion(lane, generateLaneQuestion(lane, seed));
        if (difficulty && normalized.difficulty !== difficulty) continue;
        if (seen.has(normalized.sourceGenerationIdentity)) continue;
        found = normalized;
        break;
      } catch (error) {
        lastError = error;
      }
    }
    if (!found) {
      throw lastError instanceof Error
        ? new Error(`Unable to generate Data Sufficiency review item ${itemIndex + 1}: ${lastError.message}`)
        : new Error(`Unable to satisfy Data Sufficiency Question Studio filters for item ${itemIndex + 1}.`);
    }
    seen.add(found.sourceGenerationIdentity);
    questions.push(found);
  }

  return Object.freeze({
    packageId: DSF_CP017_PACKAGE_ID,
    integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
    generationContext: Object.freeze({
      generationDomain: "reasoning-v1" as const,
      packageId: DSF_CP017_PACKAGE_ID,
      chapterId: "DSF-001" as const,
      integrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
      seed: seedText,
      runtimeMode: DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeMode,
      reviewStatus: DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.reviewStatus,
      lifecycleStatus: "REVIEW_ONLY" as const,
      permanentQlCount: DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount,
      permanentQlIds: DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds,
      generatableQlIds: DSF_CP017_GENERATABLE_QL_IDS,
      runtimeDeferredQlIds: DSF_CP017_RUNTIME_DEFERRED_QL_IDS,
      laneCount: DSF_CP017_LANES.length,
      selectedLaneIds: Object.freeze([...new Set(questions.map((question) => question.laneId))]),
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      language: "en" as const,
      difficulty: difficulty ?? null,
    }),
    questions: Object.freeze(questions),
  });
}
