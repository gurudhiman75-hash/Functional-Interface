import { createHash } from "node:crypto";

import { generateDsfCp011AgesQuestion } from "../DSF-CP-011/ages-runtime-v1.ts";
import { generateDsfCp011AlgebraEnrichmentQuestion } from "../DSF-CP-011/algebra-enrichment-runtime-v1.ts";
import { generateDsfCp011AverageQuestion } from "../DSF-CP-011/average-runtime-v1.ts";
import { generateDsfCp011CoreEnrichmentQuestion } from "../DSF-CP-011/core-domain-enrichment-runtime-v1.ts";
import { generateDsfCp011InterestQuestion } from "../DSF-CP-011/interest-runtime-v1.ts";
import { generateDsfCp011MensurationQuestion } from "../DSF-CP-011/mensuration-runtime-v1.ts";
import { generateDsfCp011MixtureQuestion } from "../DSF-CP-011/mixture-runtime-v1.ts";
import { generateDsfCp011PnlQuestion } from "../DSF-CP-011/pnl-runtime-v1.ts";
import { generateDsfCp011TmwQuestion } from "../DSF-CP-011/time-work-pipes-runtime-v1.ts";
import { generateDsfCp011TsdQuestion } from "../DSF-CP-011/tsd-runtime-v2.ts";
import { generateDsfCp012BloodQuestion } from "../DSF-CP-012/blood-relations-runtime-v2.ts";
import { generateDsfCp012DirectionQuestion } from "../DSF-CP-012/direction-runtime-v1.ts";
import { generateDsfCp012InequalityQuestion } from "../DSF-CP-012/inequality-runtime-v1.ts";
import { generateDsfCp012RankingQuestion } from "../DSF-CP-012/ranking-runtime-v1.ts";
import { generateDsfCp013CalendarQuestion } from "../DSF-CP-013/calendar-runtime-v1.ts";
import { generateDsfCp013CodingQuestion } from "../DSF-CP-013/coding-runtime-v1.ts";
import { generateDsfCp013SeatingQuestion } from "../DSF-CP-013/seating-runtime-v1.ts";
import {
  DSF_CP015_NUM_THREE_STATEMENT_PROTOTYPE_IDS,
  runDsfCp015NumberSystemPrototype,
  type DsfCp015NumThreeStatementPrototypeId,
} from "../DSF-CP-015/number-system-three-statement-prototypes.ts";
import { renderThreeStatementSemanticLabel } from "../DSF-CP-015/three-statement-answer-profile.ts";
import { DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1 } from "../DSF-CP-016/production-merge-evidence-v1.ts";

export const DSF_CP017_NORMAL_QUESTION_STUDIO_AUTHORITY =
  "DSF_CP017_NORMAL_QUESTION_STUDIO_INTEGRATION_V1" as const;
export const DSF_CP017_RUNTIME_MODE = "CP011_CP015_NORMAL_REVIEW" as const;
export const DSF_CP017_CHECKPOINT_ID = "DSF-CP-017" as const;
export const DSF_CP017_PERMANENT_QL_IDS = ["DSF-QL-001", "DSF-QL-002"] as const;
export const DSF_CP017_NEXT_AVAILABLE_QL_ID = "DSF-QL-003" as const;
export const DSF_CP017_SUPPORTED_LANGUAGES = ["en"] as const;
export const DSF_CP017_SUPPORTED_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export type DsfCp017Difficulty = (typeof DSF_CP017_SUPPORTED_DIFFICULTIES)[number];

export type DsfCp017NormalQuestionStudioRequest = Readonly<{
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: unknown;
  language?: string;
  seed?: string;
  count?: number;
  runtimeMode?: string;
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
}>;

type Lane = Readonly<{
  laneId: string;
  label: string;
  checkpointId: "DSF-CP-011" | "DSF-CP-012" | "DSF-CP-013";
  sourceChapterId: string;
  generate: (seed: number) => unknown;
}>;

export const DSF_CP017_TWO_STATEMENT_LANES: readonly Lane[] = Object.freeze([
  { laneId: "DSF-LANE-AGES", label: "Ages", checkpointId: "DSF-CP-011", sourceChapterId: "RAP-003", generate: generateDsfCp011AgesQuestion },
  { laneId: "DSF-LANE-ALGEBRA", label: "Algebra", checkpointId: "DSF-CP-011", sourceChapterId: "ALG-001/ALG-002", generate: generateDsfCp011AlgebraEnrichmentQuestion },
  { laneId: "DSF-LANE-AVERAGE", label: "Average", checkpointId: "DSF-CP-011", sourceChapterId: "AVG-001", generate: generateDsfCp011AverageQuestion },
  { laneId: "DSF-LANE-CORE-ARITHMETIC", label: "Ratio, Percentage & Number System", checkpointId: "DSF-CP-011", sourceChapterId: "RAP-001/PCT-001/NUM-001", generate: generateDsfCp011CoreEnrichmentQuestion },
  { laneId: "DSF-LANE-INTEREST", label: "Simple & Compound Interest", checkpointId: "DSF-CP-011", sourceChapterId: "INT-001", generate: generateDsfCp011InterestQuestion },
  { laneId: "DSF-LANE-MENSURATION", label: "Mensuration 2D & 3D", checkpointId: "DSF-CP-011", sourceChapterId: "MEN-001/MEN-002", generate: generateDsfCp011MensurationQuestion },
  { laneId: "DSF-LANE-MIXTURE", label: "Mixture & Alligation", checkpointId: "DSF-CP-011", sourceChapterId: "MAL-001", generate: generateDsfCp011MixtureQuestion },
  { laneId: "DSF-LANE-PROFIT-LOSS", label: "Profit, Loss & Discount", checkpointId: "DSF-CP-011", sourceChapterId: "PNL-001", generate: generateDsfCp011PnlQuestion },
  { laneId: "DSF-LANE-TIME-WORK-PIPES", label: "Time & Work / Pipes", checkpointId: "DSF-CP-011", sourceChapterId: "TMW-001", generate: generateDsfCp011TmwQuestion },
  { laneId: "DSF-LANE-TSD", label: "Time, Speed & Distance / Trains / Boats", checkpointId: "DSF-CP-011", sourceChapterId: "TSD-001", generate: generateDsfCp011TsdQuestion },
  { laneId: "DSF-LANE-BLOOD-RELATIONS", label: "Blood Relations", checkpointId: "DSF-CP-012", sourceChapterId: "BLR-001", generate: generateDsfCp012BloodQuestion },
  { laneId: "DSF-LANE-DIRECTION", label: "Direction & Distance", checkpointId: "DSF-CP-012", sourceChapterId: "SPATIAL/DIRECTION", generate: generateDsfCp012DirectionQuestion },
  { laneId: "DSF-LANE-INEQUALITY", label: "Inequality", checkpointId: "DSF-CP-012", sourceChapterId: "INEQUALITY", generate: generateDsfCp012InequalityQuestion },
  { laneId: "DSF-LANE-RANKING", label: "Ranking & Order", checkpointId: "DSF-CP-012", sourceChapterId: "RNK-001", generate: generateDsfCp012RankingQuestion },
  { laneId: "DSF-LANE-CALENDAR", label: "Calendar", checkpointId: "DSF-CP-013", sourceChapterId: "CAL-001", generate: generateDsfCp013CalendarQuestion },
  { laneId: "DSF-LANE-CODING", label: "Coding-Decoding", checkpointId: "DSF-CP-013", sourceChapterId: "COD-001", generate: generateDsfCp013CodingQuestion },
  { laneId: "DSF-LANE-SEATING", label: "Seating Arrangement", checkpointId: "DSF-CP-013", sourceChapterId: "SEA-001", generate: generateDsfCp013SeatingQuestion },
]);

const QL002_PROTOTYPES = DSF_CP015_NUM_THREE_STATEMENT_PROTOTYPE_IDS.map((prototypeId) => Object.freeze({
  id: prototypeId,
  label: prototypeId === "DSF-CP015-NUM-MIXED-ALTERNATIVE"
    ? "Three-statement Number System — alternative minimal sets"
    : "Three-statement Number System — all three required",
  checkpointId: "DSF-CP-015" as const,
  qlId: "DSF-QL-002" as const,
}));

export const DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE_V1 = Object.freeze({
  id: "DSF-001" as const,
  packageId: "DSF-001" as const,
  type: "reasoning-v1" as const,
  section: "Reasoning" as const,
  domain: "reasoning" as const,
  subject: "Reasoning" as const,
  topic: "Data Sufficiency" as const,
  subtopic: "Data Sufficiency" as const,
  name: "DSF-001 Data Sufficiency — Expanded Quant & Reasoning" as const,
  label: "Data Sufficiency — Expanded Quant & Reasoning" as const,
  generationDomain: "reasoning-v1" as const,
  cpIds: ["DSF-CP-011", "DSF-CP-012", "DSF-CP-013", "DSF-CP-015", DSF_CP017_CHECKPOINT_ID] as const,
  canonicalProblems: Object.freeze([
    ...DSF_CP017_TWO_STATEMENT_LANES.map((lane) => Object.freeze({
      id: lane.laneId,
      label: lane.label,
      checkpointId: lane.checkpointId,
      qlId: "DSF-QL-001" as const,
      sourceChapterId: lane.sourceChapterId,
    })),
    ...QL002_PROTOTYPES,
  ]),
  permanentQlCount: 2 as const,
  permanentQlIds: DSF_CP017_PERMANENT_QL_IDS,
  nextAvailableQlId: DSF_CP017_NEXT_AVAILABLE_QL_ID,
  twoStatementLaneCount: DSF_CP017_TWO_STATEMENT_LANES.length,
  threeStatementPrototypeCount: DSF_CP015_NUM_THREE_STATEMENT_PROTOTYPE_IDS.length,
  maxBatchSize: 50 as const,
  maxQl002BatchSize: 2 as const,
  supportedDifficulties: DSF_CP017_SUPPORTED_DIFFICULTIES,
  supportedLanguages: DSF_CP017_SUPPORTED_LANGUAGES,
  enabled: true as const,
  runtimeMode: DSF_CP017_RUNTIME_MODE,
  supportedRuntimeModes: [DSF_CP017_RUNTIME_MODE] as const,
  reviewStatus: "QUESTION_STUDIO_REVIEW_CONNECTED" as const,
  integrationAuthority: DSF_CP017_NORMAL_QUESTION_STUDIO_AUTHORITY,
  productionMergeEvidenceAuthority: DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.status,
  productionIntegrationComplete: DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.productionNewMainMergeComplete,
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

function normalizeSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function upper(value: unknown): string {
  return String(value ?? "").trim().toUpperCase();
}

function stableHash(value: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function questionId(identity: string): string {
  return `DSF-QS17-${createHash("sha256")
    .update(`${DSF_CP017_NORMAL_QUESTION_STUDIO_AUTHORITY}:${identity}`)
    .digest("hex")
    .slice(0, 24)}`;
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
  const text = String(value ?? "en").trim().toLowerCase() || "en";
  if (text !== "en") {
    throw new Error(
      `The CP011-CP015 expanded Data Sufficiency runtime currently supports English in normal Question Studio. Use the existing multilingual DSF production route for '${text}'.`,
    );
  }
  return "en";
}

export function isDsfCp017NormalQuestionStudioRequest(request: DsfCp017NormalQuestionStudioRequest): boolean {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const canonical = upper(request.canonicalProblemId);
  const cpId = upper(request.cpId);
  const patternId = upper(request.patternId);
  return packageId === "dsf 001"
    || packageId === "data sufficiency"
    || subtopic === "data sufficiency"
    || (topic === "reasoning" && subtopic === "data sufficiency")
    || canonical === "DSF-QL-001"
    || canonical === "DSF-QL-002"
    || canonical.startsWith("DSF-LANE-")
    || canonical.startsWith("DSF-CP015-NUM-")
    || patternId === "DSF-QL-001"
    || patternId === "DSF-QL-002"
    || ["DSF-CP-011", "DSF-CP-012", "DSF-CP-013", "DSF-CP-015", DSF_CP017_CHECKPOINT_ID].includes(cpId);
}

function wantsQl002(request: DsfCp017NormalQuestionStudioRequest): boolean {
  const canonical = upper(request.canonicalProblemId);
  return canonical === "DSF-QL-002"
    || upper(request.patternId) === "DSF-QL-002"
    || upper(request.cpId) === "DSF-CP-015"
    || canonical.startsWith("DSF-CP015-NUM-");
}

function candidateTwoStatementLanes(request: DsfCp017NormalQuestionStudioRequest): readonly Lane[] {
  const canonical = upper(request.canonicalProblemId);
  const cpId = upper(request.cpId);
  let lanes = [...DSF_CP017_TWO_STATEMENT_LANES];
  if (canonical.startsWith("DSF-LANE-")) lanes = lanes.filter((lane) => lane.laneId === canonical);
  if (cpId === "DSF-CP-011" || cpId === "DSF-CP-012" || cpId === "DSF-CP-013") {
    lanes = lanes.filter((lane) => lane.checkpointId === cpId);
  }
  if (!lanes.length) throw new Error("No expanded Data Sufficiency lane matches the selected Question Studio filters.");
  return lanes;
}

function explanationText(explanation: unknown): string {
  if (typeof explanation === "string") return explanation;
  const e = explanation as Record<string, unknown> | undefined;
  if (!e) return "The statements are evaluated for whether they uniquely determine the required answer.";
  return [e.askedTarget, e.statementI, e.statementII, e.together, e.conclusion]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join("\n");
}

function normalizeTwoStatementQuestion(rawValue: unknown, lane: Lane) {
  const raw = rawValue as any;
  const rawStem = String(raw.stem ?? "");
  const stem = rawStem.split(/\n\nStatement I:/i)[0]!.trim();
  const statements = Array.isArray(raw.statements)
    ? raw.statements.map((statement: any, index: number) => ({
      id: index === 0 ? "I" : "II",
      text: String(statement.text ?? statement),
      statementRuleId: statement.statementRuleId,
      statementFamily: statement.statementFamily,
    }))
    : [
      { id: "I", text: String(raw.statementI ?? "") },
      { id: "II", text: String(raw.statementII ?? "") },
    ];
  if (statements.length !== 2 || statements.some((statement: any) => !statement.text.trim())) {
    throw new Error(`${lane.laneId} returned an invalid two-statement surface.`);
  }

  const optionDetails = Array.isArray(raw.options)
    ? raw.options.map((option: any, index: number) => typeof option === "string"
      ? { label: String.fromCharCode(65 + index), text: option, isCorrect: index === raw.correctIndex }
      : {
        label: String(option.key ?? String.fromCharCode(65 + index)),
        text: String(option.value ?? option.text ?? ""),
        semanticClass: option.semanticClass,
        isCorrect: Boolean(option.isCorrect ?? index === raw.correctIndex),
      })
    : [];
  const correctIndex = Number(raw.correctIndex);
  if (optionDetails.length !== 5 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= 5) {
    throw new Error(`${lane.laneId} returned an invalid five-option contract.`);
  }
  if (optionDetails.filter((option: any) => option.isCorrect).length !== 1) {
    optionDetails.forEach((option: any, index: number) => { option.isCorrect = index === correctIndex; });
  }

  const generationIdentity = String(raw.generationIdentity ?? `${lane.laneId}:${raw.seed}:${raw.studentSurfaceFingerprint}`);
  const canonicalAnswer = String(raw.canonicalAnswer ?? raw.correctClass ?? "");
  const sourceChapterId = String(raw.sourceChapterId ?? lane.sourceChapterId);
  const solveMode = String(raw.solveModeId ?? raw.solveMode ?? lane.laneId);
  const difficulty = String(raw.difficulty ?? "Medium") as DsfCp017Difficulty;
  const explanation = explanationText(raw.explanation);
  const text = `${stem}\nI. ${statements[0]!.text}\nII. ${statements[1]!.text}`;
  const id = questionId(generationIdentity);

  return Object.freeze({
    text,
    stem,
    questionPrompt: String(raw.questionPrompt ?? "Can the required value or relation be determined?"),
    statements: Object.freeze(statements),
    options: Object.freeze(optionDetails.map((option: any) => option.text)),
    optionDetails: Object.freeze(optionDetails),
    correct: correctIndex,
    correctIndex,
    answer: optionDetails[correctIndex]!.text,
    canonicalAnswer,
    explanation,
    richExplanation: raw.explanation,
    proof: raw.proof ?? raw.evaluation,
    difficulty,
    difficultyLabel: difficulty,
    patternId: "DSF-QL-001" as const,
    qlId: "DSF-QL-001" as const,
    packageId: "DSF-001" as const,
    checkpointId: lane.checkpointId,
    normalIntegrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
    questionId: id,
    sourceQuestionId: generationIdentity,
    sourceGenerationIdentity: generationIdentity,
    sourceChapterId,
    sourceCapability: raw.sourceCapability ?? raw.sourceCapabilities ?? raw.sourceSolver,
    sourceAncestry: raw.sourceAncestry,
    solveMode,
    targetKind: String(raw.targetKind ?? "SUFFICIENCY_TARGET"),
    domain: lane.laneId,
    domainLabel: lane.label,
    topic: "Data Sufficiency" as const,
    subtopic: lane.label,
    subject: "Reasoning" as const,
    language: "en" as const,
    locale: String(raw.locale ?? "en-IN"),
    seed: raw.seed,
    renderer: "TEXT_MATH" as const,
    contentFingerprint: String(raw.studentSurfaceFingerprint ?? generationIdentity),
    questionStudioRegistrationStatus: "REGISTERED" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    integrationAuthority: DSF_CP017_NORMAL_QUESTION_STUDIO_AUTHORITY,
    productionMergeEvidenceAuthority: DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.status,
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
      chapter: "Data Sufficiency" as const,
      packageId: "DSF-001" as const,
      qlId: "DSF-QL-001" as const,
      checkpointId: lane.checkpointId,
      normalIntegrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
      laneId: lane.laneId,
      sourceChapterId,
      solveMode,
      difficulty,
      language: "en" as const,
      runtimeMode: DSF_CP017_RUNTIME_MODE,
      integrationAuthority: DSF_CP017_NORMAL_QUESTION_STUDIO_AUTHORITY,
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
  });
}

function prototypeDifficulty(prototypeId: DsfCp015NumThreeStatementPrototypeId): DsfCp017Difficulty {
  return prototypeId === "DSF-CP015-NUM-ALL-THREE-REQUIRED" ? "Hard" : "Medium";
}

function normalizeThreeStatementPrototype(
  prototypeId: DsfCp015NumThreeStatementPrototypeId,
  seed: number,
) {
  const raw = runDsfCp015NumberSystemPrototype(prototypeId, seed);
  const correctIndex = raw.options.findIndex((option) => option.isCorrect);
  if (raw.permanentQlId !== "DSF-QL-002" || raw.statements.length !== 3 || raw.options.length !== 5 || correctIndex < 0) {
    throw new Error(`${prototypeId} does not satisfy the permanent DSF-QL-002 Question Studio contract.`);
  }
  const difficulty = prototypeDifficulty(prototypeId);
  const semanticLabel = renderThreeStatementSemanticLabel(raw.evaluation.semanticKey);
  const stem = "In the three-digit number 42X, X represents one digit. Determine which statement set is sufficient to identify X uniquely.";
  const statements = raw.statements.map((statement) => ({ id: statement.id, text: statement.text }));
  const text = `${stem}\nI. ${statements[0]!.text}\nII. ${statements[1]!.text}\nIII. ${statements[2]!.text}`;
  const generationIdentity = `${prototypeId}:${seed}:${raw.evaluation.semanticKey}`;
  const id = questionId(generationIdentity);
  const optionDetails = raw.options.map((option) => ({
    label: option.key,
    text: option.text,
    semanticKey: option.semanticKey,
    isCorrect: option.isCorrect,
  }));
  const minimalSets = raw.evaluation.minimalSufficientSets.map((set) => set.join(" + "));
  const explanation = minimalSets.length
    ? `Testing the seven non-empty statement subsets shows the minimal sufficient set${minimalSets.length === 1 ? "" : "s"}: ${minimalSets.join("; ")}. ${semanticLabel}`
    : `No statement subset determines X uniquely. ${semanticLabel}`;

  return Object.freeze({
    text,
    stem,
    questionPrompt: "Which statement combination is sufficient to determine X?" as const,
    statements: Object.freeze(statements),
    options: Object.freeze(optionDetails.map((option) => option.text)),
    optionDetails: Object.freeze(optionDetails),
    correct: correctIndex,
    correctIndex,
    answer: optionDetails[correctIndex]!.text,
    canonicalAnswer: raw.evaluation.semanticKey,
    explanation,
    richExplanation: Object.freeze({
      minimalSufficientSets: raw.evaluation.minimalSufficientSets,
      subsetEvaluations: raw.evaluation.subsetEvaluations,
      conclusion: semanticLabel,
    }),
    proof: raw.evaluation,
    difficulty,
    difficultyLabel: difficulty,
    patternId: prototypeId,
    qlId: "DSF-QL-002" as const,
    packageId: "DSF-001" as const,
    checkpointId: "DSF-CP-015" as const,
    normalIntegrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
    questionId: id,
    sourceQuestionId: generationIdentity,
    sourceGenerationIdentity: generationIdentity,
    sourceChapterId: raw.sourceChapterId,
    sourceCapability: raw.sourceCapability,
    solveMode: "DSF-SM-NUM-THREE-STATEMENT-MINIMAL-SUBSET" as const,
    targetKind: "MISSING_DIGIT" as const,
    domain: "DSF-LANE-NUMBER-SYSTEM-THREE-STATEMENT" as const,
    domainLabel: "Number System — Three Statements" as const,
    topic: "Data Sufficiency" as const,
    subtopic: "Number System — Three Statements" as const,
    subject: "Reasoning" as const,
    language: "en" as const,
    locale: "en-IN" as const,
    seed,
    renderer: "TEXT_MATH" as const,
    contentFingerprint: `${prototypeId}|${raw.evaluation.semanticKey}`,
    questionStudioRegistrationStatus: "REGISTERED" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    integrationAuthority: DSF_CP017_NORMAL_QUESTION_STUDIO_AUTHORITY,
    productionMergeEvidenceAuthority: DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.status,
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
      chapter: "Data Sufficiency" as const,
      packageId: "DSF-001" as const,
      qlId: "DSF-QL-002" as const,
      checkpointId: "DSF-CP-015" as const,
      normalIntegrationCheckpointId: DSF_CP017_CHECKPOINT_ID,
      prototypeId,
      sourceChapterId: raw.sourceChapterId,
      difficulty,
      language: "en" as const,
      runtimeMode: DSF_CP017_RUNTIME_MODE,
      integrationAuthority: DSF_CP017_NORMAL_QUESTION_STUDIO_AUTHORITY,
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
  });
}

function generateQl002Batch(request: DsfCp017NormalQuestionStudioRequest, batchSeed: string, count: number, difficulty?: DsfCp017Difficulty) {
  if (count > 2) {
    throw new Error("DSF-QL-002 currently has two source-authoritative prototypes, so normal Question Studio batches are capped at 2 until the three-statement object pool is expanded.");
  }
  const canonical = upper(request.canonicalProblemId);
  let prototypes = [...DSF_CP015_NUM_THREE_STATEMENT_PROTOTYPE_IDS];
  if (canonical.startsWith("DSF-CP015-NUM-")) {
    prototypes = prototypes.filter((id) => id === canonical as DsfCp015NumThreeStatementPrototypeId);
  }
  if (difficulty) prototypes = prototypes.filter((id) => prototypeDifficulty(id) === difficulty);
  if (!prototypes.length) throw new Error("No DSF-QL-002 prototype matches the selected Question Studio filters.");
  const offset = stableHash(`${batchSeed}:ql002`) % prototypes.length;
  const questions = Array.from({ length: count }, (_, index) => {
    const prototypeId = prototypes[(offset + index) % prototypes.length]!;
    const seed = stableHash(`${batchSeed}:ql002:${prototypeId}:${index}`) & 0x7fffffff;
    return normalizeThreeStatementPrototype(prototypeId, seed);
  });
  return Object.freeze(questions);
}

function generateQl001Batch(request: DsfCp017NormalQuestionStudioRequest, batchSeed: string, count: number, difficulty?: DsfCp017Difficulty) {
  const lanes = candidateTwoStatementLanes(request);
  const laneOffset = stableHash(`${batchSeed}:lane-offset`) % lanes.length;
  const questions: any[] = [];
  const identities = new Set<string>();

  for (let itemIndex = 0; itemIndex < count; itemIndex += 1) {
    let accepted: any | undefined;
    let lastError: unknown;
    for (let attempt = 0; attempt < 512; attempt += 1) {
      const lane = lanes[(laneOffset + itemIndex + attempt) % lanes.length]!;
      const seed = stableHash(`${batchSeed}:${itemIndex}:${attempt}:${lane.laneId}`) & 0x7fffffff;
      try {
        const normalized = normalizeTwoStatementQuestion(lane.generate(seed), lane);
        if (difficulty && normalized.difficulty !== difficulty) continue;
        if (identities.has(normalized.sourceGenerationIdentity)) continue;
        accepted = normalized;
        break;
      } catch (error) {
        lastError = error;
      }
    }
    if (!accepted) {
      throw lastError instanceof Error
        ? new Error(`Unable to generate DSF normal Studio item ${itemIndex + 1}: ${lastError.message}`)
        : new Error(`Unable to generate DSF normal Studio item ${itemIndex + 1} for the selected filters.`);
    }
    identities.add(accepted.sourceGenerationIdentity);
    questions.push(accepted);
  }
  return Object.freeze(questions);
}

export function generateDsfCp017NormalQuestionStudioBatch(
  request: DsfCp017NormalQuestionStudioRequest = {},
) {
  if (!isDsfCp017NormalQuestionStudioRequest(request)) {
    throw new Error("The request does not select the DSF-001 normal Question Studio package.");
  }
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const batchSeed = String(request.seed ?? "").trim()
    || `question-studio:DSF-001:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const ql002 = wantsQl002(request);
  const questions = ql002
    ? generateQl002Batch(request, batchSeed, count, difficulty)
    : generateQl001Batch(request, batchSeed, count, difficulty);

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "reasoning-v1" as const,
      packageId: "DSF-001" as const,
      chapterId: "DSF-001" as const,
      chapter: "Data Sufficiency" as const,
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: DSF_CP017_RUNTIME_MODE,
      integrationAuthority: DSF_CP017_NORMAL_QUESTION_STUDIO_AUTHORITY,
      productionIntegrationComplete: DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.productionNewMainMergeComplete,
      permanentQlCount: 2 as const,
      permanentQlIds: DSF_CP017_PERMANENT_QL_IDS,
      nextAvailableQlId: DSF_CP017_NEXT_AVAILABLE_QL_ID,
      qlId: ql002 ? "DSF-QL-002" as const : "DSF-QL-001" as const,
      language,
      difficulty: difficulty ?? null,
      lifecycleStatus: "REVIEW_ONLY" as const,
      questionStudioDiscoverable: true as const,
      questionStudioGenerationEnabled: true as const,
      persistenceAllowed: true as const,
      manualApprovalRequired: true as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
    questionPackages: questions,
    questions,
  });
}

export function listDsfCp017NormalQuestionStudioPackages() {
  return [DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE_V1];
}
