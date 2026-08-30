import { createHash } from "node:crypto";

import { generateDsfCp011AverageQuestion } from "../DSF-CP-011/average-runtime-v1.ts";
import { generateDsfCp011AgesQuestion } from "../DSF-CP-011/ages-runtime-v1.ts";
import { generateDsfCp011PnlQuestion } from "../DSF-CP-011/pnl-runtime-v1.ts";
import { generateDsfCp011InterestQuestion } from "../DSF-CP-011/interest-runtime-v1.ts";
import { generateDsfCp011TmwQuestion } from "../DSF-CP-011/time-work-pipes-runtime-v1.ts";
import { generateDsfCp011TsdQuestion } from "../DSF-CP-011/tsd-runtime-v2.ts";
import { generateDsfCp011MixtureQuestion } from "../DSF-CP-011/mixture-runtime-v1.ts";
import { generateDsfCp011MensurationQuestion } from "../DSF-CP-011/mensuration-runtime-v1.ts";
import { generateDsfCp011CoreEnrichmentQuestion } from "../DSF-CP-011/core-domain-enrichment-runtime-v1.ts";
import { generateDsfCp011AlgebraEnrichmentQuestion } from "../DSF-CP-011/algebra-enrichment-runtime-v1.ts";
import { generateDsfCp012RankingQuestion } from "../DSF-CP-012/ranking-runtime-v1.ts";
import { generateDsfCp012DirectionQuestion } from "../DSF-CP-012/direction-runtime-v1.ts";
import { generateDsfCp012BloodQuestion } from "../DSF-CP-012/blood-relations-runtime-v2.ts";
import { generateDsfCp012InequalityQuestion } from "../DSF-CP-012/inequality-runtime-v1.ts";
import { generateDsfCp013SeatingQuestion } from "../DSF-CP-013/seating-runtime-v1.ts";
import { generateDsfCp013CodingQuestion } from "../DSF-CP-013/coding-runtime-v1.ts";
import { generateDsfCp013CalendarQuestion } from "../DSF-CP-013/calendar-runtime-v1.ts";
import {
  applyReasoningCommonBaseEditorialSurface,
  reasoningExplanationLead,
  DSF_REASONING_COMMON_BASE_EDITORIAL_VERSION,
  type DsfReasoningEditorialLane,
} from "../DSF-CP-014/reasoning-common-base-editorial-overlay.ts";
import {
  DSF_CURRENT_NEXT_AVAILABLE_QL_ID,
  DSF_CURRENT_PERMANENT_QL_REGISTRY,
} from "../foundation/current-permanent-ql-registry.ts";
import { SUFFICIENCY_CLASSES, type SufficiencyClass } from "../foundation/index.ts";

export const DSF_CP017_CHECKPOINT_ID = "DSF-CP-017" as const;
export const DSF_CP017_QUESTION_STUDIO_AUTHORITY =
  "DSF_CP017_NORMAL_QUESTION_STUDIO_WORKFLOW_V1" as const;
export const DSF_CP017_RUNTIME_MODE = "EXPANDED_REVIEW" as const;
export const DSF_CP017_PACKAGE_ID = "DSF-001-EXPANDED-REVIEW" as const;
export const DSF_CP017_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const DSF_CP017_LANGUAGES = ["en"] as const;

export type DsfCp017Difficulty = (typeof DSF_CP017_DIFFICULTIES)[number];
export type DsfCp017Language = (typeof DSF_CP017_LANGUAGES)[number];

type AnySourceQuestion = Readonly<Record<string, any>>;
type SourceGenerator = (seed: number) => AnySourceQuestion;

type LaneDescriptor = Readonly<{
  id: string;
  label: string;
  checkpointId: "DSF-CP-011" | "DSF-CP-012" | "DSF-CP-013";
  domainFamily: "QUANT" | "REASONING";
  sourceChapterIds: readonly string[];
  generate: SourceGenerator;
  editorialLane?: DsfReasoningEditorialLane;
}>;

export const DSF_CP017_LANES = Object.freeze([
  {
    id: "AVERAGE",
    label: "Average",
    checkpointId: "DSF-CP-011",
    domainFamily: "QUANT",
    sourceChapterIds: ["AVG-001"],
    generate: generateDsfCp011AverageQuestion,
  },
  {
    id: "AGES",
    label: "Ages",
    checkpointId: "DSF-CP-011",
    domainFamily: "QUANT",
    sourceChapterIds: ["RAP-003"],
    generate: generateDsfCp011AgesQuestion,
  },
  {
    id: "PROFIT_LOSS_DISCOUNT",
    label: "Profit, Loss & Discount",
    checkpointId: "DSF-CP-011",
    domainFamily: "QUANT",
    sourceChapterIds: ["PNL-001"],
    generate: generateDsfCp011PnlQuestion,
  },
  {
    id: "INTEREST",
    label: "Simple & Compound Interest",
    checkpointId: "DSF-CP-011",
    domainFamily: "QUANT",
    sourceChapterIds: ["INT-001"],
    generate: generateDsfCp011InterestQuestion,
  },
  {
    id: "TIME_WORK_PIPES",
    label: "Time & Work / Pipes & Cisterns",
    checkpointId: "DSF-CP-011",
    domainFamily: "QUANT",
    sourceChapterIds: ["TMW-001"],
    generate: generateDsfCp011TmwQuestion,
  },
  {
    id: "TSD_TRAINS_BOATS",
    label: "Time, Speed & Distance / Trains / Boats",
    checkpointId: "DSF-CP-011",
    domainFamily: "QUANT",
    sourceChapterIds: ["TSD-001"],
    generate: generateDsfCp011TsdQuestion,
  },
  {
    id: "MIXTURE_ALLIGATION",
    label: "Mixture & Alligation",
    checkpointId: "DSF-CP-011",
    domainFamily: "QUANT",
    sourceChapterIds: ["MAL-001"],
    generate: generateDsfCp011MixtureQuestion,
  },
  {
    id: "MENSURATION",
    label: "Mensuration",
    checkpointId: "DSF-CP-011",
    domainFamily: "QUANT",
    sourceChapterIds: ["MEN-001", "MEN-002"],
    generate: generateDsfCp011MensurationQuestion,
  },
  {
    id: "CORE_QUANT_ENRICHMENT",
    label: "Ratio / Percentage / Number System",
    checkpointId: "DSF-CP-011",
    domainFamily: "QUANT",
    sourceChapterIds: ["RAP-001", "PCT-001", "NUM-001"],
    generate: generateDsfCp011CoreEnrichmentQuestion,
  },
  {
    id: "ALGEBRA_ENRICHMENT",
    label: "Algebra",
    checkpointId: "DSF-CP-011",
    domainFamily: "QUANT",
    sourceChapterIds: ["ALG-002"],
    generate: generateDsfCp011AlgebraEnrichmentQuestion,
  },
  {
    id: "RANKING",
    label: "Ranking & Order",
    checkpointId: "DSF-CP-012",
    domainFamily: "REASONING",
    sourceChapterIds: ["RNK-001"],
    generate: generateDsfCp012RankingQuestion,
    editorialLane: "RANKING",
  },
  {
    id: "DIRECTION",
    label: "Direction Sense",
    checkpointId: "DSF-CP-012",
    domainFamily: "REASONING",
    sourceChapterIds: ["REAS-DIR"],
    generate: generateDsfCp012DirectionQuestion,
    editorialLane: "DIRECTION",
  },
  {
    id: "BLOOD_RELATIONS",
    label: "Blood Relations",
    checkpointId: "DSF-CP-012",
    domainFamily: "REASONING",
    sourceChapterIds: ["BLR-001"],
    generate: generateDsfCp012BloodQuestion,
    editorialLane: "BLOOD_RELATIONS",
  },
  {
    id: "INEQUALITY",
    label: "Inequality",
    checkpointId: "DSF-CP-012",
    domainFamily: "REASONING",
    sourceChapterIds: ["INEQ-001"],
    generate: generateDsfCp012InequalityQuestion,
    editorialLane: "INEQUALITY",
  },
  {
    id: "SEATING",
    label: "Seating Arrangement",
    checkpointId: "DSF-CP-013",
    domainFamily: "REASONING",
    sourceChapterIds: ["SEA-001"],
    generate: generateDsfCp013SeatingQuestion,
    editorialLane: "SEATING",
  },
  {
    id: "CODING",
    label: "Coding-Decoding",
    checkpointId: "DSF-CP-013",
    domainFamily: "REASONING",
    sourceChapterIds: ["COD-CP-001"],
    generate: generateDsfCp013CodingQuestion,
    editorialLane: "CODING",
  },
  {
    id: "CALENDAR",
    label: "Calendar",
    checkpointId: "DSF-CP-013",
    domainFamily: "REASONING",
    sourceChapterIds: ["CAL-001"],
    generate: generateDsfCp013CalendarQuestion,
    editorialLane: "CALENDAR",
  },
] satisfies readonly LaneDescriptor[]);

export type DsfCp017LaneId = (typeof DSF_CP017_LANES)[number]["id"];

const LANE_IDS = new Set<string>(DSF_CP017_LANES.map((lane) => lane.id));
const DIFFICULTIES = new Set<string>(DSF_CP017_DIFFICULTIES);
const SEMANTIC_CLASSES = new Set<string>(SUFFICIENCY_CLASSES);

export interface DsfCp017QuestionStudioInput {
  readonly seed?: string;
  readonly count?: number;
  readonly laneId?: DsfCp017LaneId;
  readonly semanticClass?: SufficiencyClass;
  readonly difficulty?: DsfCp017Difficulty;
  readonly language?: DsfCp017Language;
  readonly qlId?: "DSF-QL-001";
}

function hashText(text: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function candidateSeed(seed: string, itemIndex: number, attempt: number, laneId: string): number {
  return hashText(`${DSF_CP017_QUESTION_STUDIO_AUTHORITY}:${seed}:${laneId}:${itemIndex}:${attempt}`) & 0x7fffffff;
}

function visibleStem(stem: string): string {
  return stem.split(/\n\nStatement I:/u, 1)[0]!.trim();
}

function explanationText(explanation: unknown): string {
  if (typeof explanation === "string") return explanation.trim();
  if (!explanation || typeof explanation !== "object") return "";
  const record = explanation as Record<string, unknown>;
  const steps = Array.isArray(record.steps)
    ? record.steps.filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    : [];
  if (steps.length > 0) return steps.join("\n");
  return Object.values(record)
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join("\n");
}

function assertSourceQuestionLocked(lane: LaneDescriptor, question: AnySourceQuestion): void {
  if (question.packageId !== "DSF-001" || question.qlId !== "DSF-QL-001") {
    throw new Error(`${lane.id}: CP017 received a source question outside DSF-001 / DSF-QL-001.`);
  }
  if (question.checkpointId !== lane.checkpointId) {
    throw new Error(`${lane.id}: source checkpoint ${String(question.checkpointId)} does not match ${lane.checkpointId}.`);
  }
  if (question.lifecycle?.questionStudioDiscoverable !== false) {
    throw new Error(`${lane.id}: source lifecycle must remain Question Studio locked; CP017 owns exposure.`);
  }
  if (question.lifecycle?.questionBankWritable !== false) {
    throw new Error(`${lane.id}: source lifecycle unexpectedly opened Question Bank writes.`);
  }
  if (question.lifecycle?.testEligible !== false || question.lifecycle?.publiclyPublishable !== false) {
    throw new Error(`${lane.id}: source lifecycle unexpectedly opened learner delivery.`);
  }
  if (!Array.isArray(question.statements) || question.statements.length !== 2) {
    throw new Error(`${lane.id}: QL001 source must expose exactly two statements.`);
  }
  if (!Array.isArray(question.options) || question.options.length !== 5) {
    throw new Error(`${lane.id}: QL001 source must expose exactly five options.`);
  }
  const correctCount = question.options.filter((option: any) => option?.isCorrect === true).length;
  if (correctCount !== 1 || !Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex >= 5) {
    throw new Error(`${lane.id}: source option contract is invalid.`);
  }
  if (!SEMANTIC_CLASSES.has(String(question.canonicalAnswer))) {
    throw new Error(`${lane.id}: source canonical sufficiency class is invalid.`);
  }
  if (typeof question.generationIdentity !== "string" || !question.generationIdentity.trim()) {
    throw new Error(`${lane.id}: source generation identity is missing.`);
  }
}

function presentationFor(lane: LaneDescriptor, source: AnySourceQuestion) {
  if (!lane.editorialLane) {
    return {
      stem: visibleStem(String(source.stem ?? "")),
      explanation: explanationText(source.explanation),
      editorialSurfaceVersion: undefined as string | undefined,
    };
  }
  const hardened = applyReasoningCommonBaseEditorialSurface(lane.editorialLane, source as any);
  const sourceExplanation = explanationText(source.explanation);
  return {
    stem: visibleStem(String(hardened.stem ?? "")),
    explanation: `${reasoningExplanationLead(lane.editorialLane, Number(source.seed ?? 0))} ${sourceExplanation}`.trim(),
    editorialSurfaceVersion: DSF_REASONING_COMMON_BASE_EDITORIAL_VERSION,
  };
}

function sourceCapabilities(question: AnySourceQuestion): readonly string[] {
  if (Array.isArray(question.sourceCapabilities)) return question.sourceCapabilities.map(String);
  if (typeof question.sourceCapability === "string") return [question.sourceCapability];
  if (Array.isArray(question.sourceAncestry)) return question.sourceAncestry.map(String);
  return [];
}

function toStudioReviewQuestion(lane: LaneDescriptor, source: AnySourceQuestion) {
  assertSourceQuestionLocked(lane, source);
  const presentation = presentationFor(lane, source);
  const statements = source.statements.map((statement: any, index: number) => ({
    id: index === 0 ? "I" as const : "II" as const,
    text: String(statement.text ?? ""),
    statementRuleId: typeof statement.statementRuleId === "string" ? statement.statementRuleId : undefined,
    statementFamily: typeof statement.statementFamily === "string" ? statement.statementFamily : undefined,
  })) as readonly [
    { readonly id: "I"; readonly text: string; readonly statementRuleId?: string; readonly statementFamily?: string },
    { readonly id: "II"; readonly text: string; readonly statementRuleId?: string; readonly statementFamily?: string },
  ];
  const options = source.options.map((option: any) => ({
    key: String(option.key) as "A" | "B" | "C" | "D" | "E",
    value: String(option.value ?? option.text ?? ""),
    semanticClass: String(option.semanticClass) as SufficiencyClass,
    isCorrect: option.isCorrect === true,
  }));
  const correctOption = options[source.correctIndex]!;
  const sourceGenerationIdentity = String(source.generationIdentity);
  const questionId = `DSF-QS-CP017-${createHash("sha256")
    .update(`${DSF_CP017_QUESTION_STUDIO_AUTHORITY}:${sourceGenerationIdentity}`)
    .digest("hex")
    .slice(0, 24)}`;
  const richExplanation = source.explanation;
  const sourceCheckpointId = String(source.checkpointId) as "DSF-CP-011" | "DSF-CP-012" | "DSF-CP-013";
  const difficulty = String(source.difficulty) as DsfCp017Difficulty;
  const semanticClass = String(source.canonicalAnswer) as SufficiencyClass;
  const sourceChapterId = String(source.sourceChapterId ?? lane.sourceChapterIds[0] ?? "UNKNOWN");
  const solveModeId = String(source.solveModeId ?? source.solveMode ?? "UNKNOWN");
  const targetKind = String(source.targetKind ?? source.questionPrompt ?? "Target");
  const text = `${presentation.stem}\nI. ${statements[0].text}\nII. ${statements[1].text}`;

  return Object.freeze({
    text,
    stem: presentation.stem,
    questionPrompt: String(source.questionPrompt ?? "Determine whether the statements are sufficient."),
    statements,
    options,
    optionDetails: options,
    correct: source.correctIndex,
    correctIndex: source.correctIndex,
    answer: correctOption.value,
    canonicalAnswer: semanticClass,
    explanation: presentation.explanation,
    richExplanation,
    difficulty,
    difficultyLabel: difficulty,
    qlId: "DSF-QL-001" as const,
    packageId: "DSF-001" as const,
    sourceCheckpointId,
    integrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
    questionId,
    sourceQuestionId: sourceGenerationIdentity,
    sourceGenerationIdentity,
    sourceChapterId,
    sourceCapabilities: sourceCapabilities(source),
    solveMode: solveModeId,
    solveModeId,
    targetKind,
    domain: lane.id,
    domainLabel: lane.label,
    laneId: lane.id,
    domainFamily: lane.domainFamily,
    topic: "Data Sufficiency" as const,
    subtopic: lane.label,
    subject: "Reasoning" as const,
    language: "en" as const,
    locale: "en-IN" as const,
    seed: Number(source.seed ?? 0),
    answerProfile: "GENERIC_DS_STANDARD_5_EN" as const,
    examFamily: "GENERIC" as const,
    profileEvidenceLevel: "CP017_EXPANDED_REVIEW_ONLY" as const,
    profileSourcePatternIds: [] as readonly string[],
    profileRepresentedSemanticClasses: SUFFICIENCY_CLASSES,
    profileOmittedSemanticClasses: [] as readonly SufficiencyClass[],
    renderer: "TEXT_MATH" as const,
    runtimeMode: DSF_CP017_RUNTIME_MODE,
    reviewStatus: "EXPANDED_REVIEW_QUEUE" as const,
    questionStudioRegistrationStatus: "REGISTERED" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    reviewOnly: true as const,
    editorialSurfaceVersion: presentation.editorialSurfaceVersion,
    sourceProof: source.proof,
    studentSurfaceFingerprint: source.studentSurfaceFingerprint,
    integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
    deliveryProfileAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
    sourceFreezeAuthority: `PRODUCTION_MERGED:${sourceCheckpointId}` as const,
    manualApprovalRequired: true as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    questionBankAcceptanceMode: "FULL_RELEASE" as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    validation: Object.freeze({
      valid: true as const,
      sourceValidated: true as const,
      exactlyOneCorrect: true as const,
      standardFiveOptionContract: true as const,
      qlIdentityPreserved: true as const,
      semanticTruthPreserved: true as const,
      sourceLifecyclePreserved: true as const,
      questionStudioExposureOwnedByCp017: true as const,
      questionBankLocked: true as const,
      testMockLocked: true as const,
      publicationLocked: true as const,
      editorialSurfaceApplied: lane.editorialLane ? true as const : false as const,
    }),
    lifecycle: Object.freeze({
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
    }),
    generationContext: Object.freeze({
      generationDomain: "reasoning-v1" as const,
      chapter: "Data Sufficiency" as const,
      packageId: "DSF-001" as const,
      qlId: "DSF-QL-001" as const,
      laneId: lane.id,
      domainFamily: lane.domainFamily,
      sourceCheckpointId,
      integrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
      sourceChapterId,
      solveMode: solveModeId,
      semanticClass,
      difficulty,
      language: "en" as const,
      locale: "en-IN" as const,
      answerProfile: "GENERIC_DS_STANDARD_5_EN" as const,
      integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
      runtimeMode: DSF_CP017_RUNTIME_MODE,
      reviewStatus: "EXPANDED_REVIEW_QUEUE" as const,
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
      editorialSurfaceVersion: presentation.editorialSurfaceVersion,
    }),
  });
}

function validateInput(input: DsfCp017QuestionStudioInput): void {
  if (input.language && input.language !== "en") {
    throw new Error("CP017 expanded Data Sufficiency review generation is English-only until expansion localization is separately approved.");
  }
  if (input.qlId && input.qlId !== "DSF-QL-001") {
    throw new Error("DSF-QL-002 is permanently allocated but does not yet have a breadth-qualified normal Question Studio generator.");
  }
  if (input.laneId && !LANE_IDS.has(input.laneId)) {
    throw new Error(`Unsupported CP017 Data Sufficiency lane '${String(input.laneId)}'.`);
  }
  if (input.semanticClass && !SEMANTIC_CLASSES.has(input.semanticClass)) {
    throw new Error(`Unsupported Data Sufficiency semantic class '${String(input.semanticClass)}'.`);
  }
  if (input.difficulty && !DIFFICULTIES.has(input.difficulty)) {
    throw new Error(`Unsupported Data Sufficiency difficulty '${String(input.difficulty)}'.`);
  }
}

function candidateLanes(input: DsfCp017QuestionStudioInput): readonly LaneDescriptor[] {
  if (!input.laneId) return DSF_CP017_LANES;
  return DSF_CP017_LANES.filter((lane) => lane.id === input.laneId);
}

function matchesFilters(question: ReturnType<typeof toStudioReviewQuestion>, input: DsfCp017QuestionStudioInput): boolean {
  if (input.semanticClass && question.canonicalAnswer !== input.semanticClass) return false;
  if (input.difficulty && question.difficulty !== input.difficulty) return false;
  return true;
}

export function generateDsfCp017QuestionStudioBatch(input: DsfCp017QuestionStudioInput = {}) {
  validateInput(input);
  const count = Math.min(50, Math.max(1, Math.floor(input.count ?? 5)));
  const seedText = input.seed?.trim() || "dsf-cp017-question-studio";
  const lanes = candidateLanes(input);
  const questions: ReturnType<typeof toStudioReviewQuestion>[] = [];
  const seen = new Set<string>();

  for (let itemIndex = 0; itemIndex < count; itemIndex += 1) {
    let found: ReturnType<typeof toStudioReviewQuestion> | undefined;
    const laneStart = hashText(`${seedText}:lane:${itemIndex}`) % lanes.length;
    for (let attempt = 0; attempt < 1800 && !found; attempt += 1) {
      const lane = lanes[(laneStart + attempt) % lanes.length]!;
      const numericSeed = candidateSeed(seedText, itemIndex, Math.floor(attempt / lanes.length), lane.id);
      try {
        const source = lane.generate(numericSeed);
        const normalized = toStudioReviewQuestion(lane, source);
        if (!matchesFilters(normalized, input)) continue;
        if (seen.has(normalized.sourceGenerationIdentity)) continue;
        seen.add(normalized.sourceGenerationIdentity);
        found = normalized;
      } catch {
        // Individual source generators may reject seeds that cannot realize a
        // requested semantic/difficulty combination. CP017 keeps scanning the
        // already-audited source runtime instead of changing source semantics.
      }
    }
    if (!found) {
      throw new Error(`Unable to generate CP017 item ${itemIndex + 1}/${count} for the selected filters.`);
    }
    questions.push(found);
  }

  return Object.freeze({
    packageId: DSF_CP017_PACKAGE_ID,
    runtimeMode: DSF_CP017_RUNTIME_MODE,
    integrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
    integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
    questionCount: questions.length,
    questions: Object.freeze(questions),
  });
}

export const DSF_CP017_QUESTION_STUDIO_PACKAGE = Object.freeze({
  packageId: DSF_CP017_PACKAGE_ID,
  chapterPackageId: "DSF-001" as const,
  label: "Data Sufficiency · CP011-CP013 expanded review generation",
  integrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
  integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
  sourceImplementationCheckpoints: ["DSF-CP-011", "DSF-CP-012", "DSF-CP-013"] as const,
  editorialCheckpointId: "DSF-CP-014" as const,
  closureCheckpointIds: ["DSF-CP-015", "DSF-CP-016"] as const,
  currentPermanentQlIds: DSF_CURRENT_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId),
  generatableQlIds: ["DSF-QL-001"] as const,
  nonGeneratablePermanentQlIds: Object.freeze([
    Object.freeze({
      qlId: "DSF-QL-002" as const,
      status: "PERMANENT_SEMANTIC_FOUNDATION_NO_BREADTH_QUALIFIED_STUDIO_RUNTIME" as const,
      reason: "Three-statement QL002 currently has semantic foundation and source-backed NUM-001 prototypes, not a breadth-qualified bulk Question Studio generator.",
    }),
  ]),
  nextAvailableQlId: DSF_CURRENT_NEXT_AVAILABLE_QL_ID,
  lanes: DSF_CP017_LANES.map((lane) => Object.freeze({
    id: lane.id,
    label: lane.label,
    checkpointId: lane.checkpointId,
    domainFamily: lane.domainFamily,
    sourceChapterIds: lane.sourceChapterIds,
    editorialSurfaceVersion: lane.editorialLane ? DSF_REASONING_COMMON_BASE_EDITORIAL_VERSION : undefined,
  })),
  laneCount: DSF_CP017_LANES.length,
  supportedSemanticClasses: SUFFICIENCY_CLASSES,
  supportedDifficulties: DSF_CP017_DIFFICULTIES,
  supportedLanguages: DSF_CP017_LANGUAGES,
  defaultLanguage: "en" as const,
  defaultAnswerProfile: "GENERIC_DS_STANDARD_5_EN" as const,
  runtimeMode: DSF_CP017_RUNTIME_MODE,
  reviewStatus: "EXPANDED_REVIEW_QUEUE" as const,
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
});
