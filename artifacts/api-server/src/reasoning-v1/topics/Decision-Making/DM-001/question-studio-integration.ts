import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types.ts";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle.ts";
import { DM_001_MANIFEST } from "./chapter-manifest.ts";
import { generateDm020QuestionSet, generateDmQuestion, modesForDmDifficulty } from "./generator.ts";
import { DM_001_QL_REGISTRY } from "./ql-registry.ts";
import { DM_001_SCENARIO_LIBRARY } from "./scenario-library.ts";
import type { DmCheckpointId, DmDifficulty, DmLocale, DmQlId, DmScenario, DmSubjectKind } from "./types.ts";

export const DM001_QUESTION_STUDIO_PACKAGE_ID_V1 = "DM-001" as const;
export const DM001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const DM001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 = "DM-001-WAVES-1-4-COMPLETE-DETERMINISTIC-DECISIONS-V1" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const qlIds = DM_001_QL_REGISTRY.map((entry) => entry.qlId);
const cpIds = [...new Set(DM_001_QL_REGISTRY.map((entry) => entry.checkpointId))];
const blueprintCpAliases: Readonly<Record<string, DmCheckpointId>> = Object.freeze({
  "DM-001": "DM-CP-001",
  "DM-002": "DM-CP-002",
  "DM-003": "DM-CP-003",
  "DM-004": "DM-CP-004",
  "DM-005": "DM-CP-005",
  "DM-006": "DM-CP-006",
  "DM-007": "DM-CP-007",
  "DM-008": "DM-CP-008",
  "DM-009": "DM-CP-009",
  "DM-010": "DM-CP-010",
  "DM-011": "DM-CP-011",
  "DM-012": "DM-CP-012",
  "DM-013": "DM-CP-013",
  "DM-014": "DM-CP-014",
  "DM-015": "DM-CP-015",
  "DM-016": "DM-CP-016",
  "DM-017": "DM-CP-017",
  "DM-018": "DM-CP-018",
  "DM-019": "DM-CP-019",
  "DM-020": "DM-CP-020",
});

type DisplayDifficulty = "Easy" | "Medium" | "Hard";

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

const SUBJECT_KIND_ORDER: readonly DmSubjectKind[] = Object.freeze(["PERSON", "PRODUCT_LOT", "ORGANIZATION"]);

function subjectKindOfScenario(scenario: DmScenario): DmSubjectKind {
  return scenario.subjectKind ?? "PERSON";
}

function balancedScenarioForQl(
  eligibleScenarios: readonly DmScenario[],
  qlId: DmQlId,
  seedText: string,
  sequenceIndex: number,
  numericSeed: number,
): DmScenario {
  const populatedGroups = SUBJECT_KIND_ORDER
    .map((kind) => Object.freeze({
      kind,
      scenarios: eligibleScenarios.filter((scenario) => subjectKindOfScenario(scenario) === kind),
    }))
    .filter((group) => group.scenarios.length > 0);
  if (populatedGroups.length === 0) throw new Error("DM-001 has no scenario authority for " + qlId);
  if (populatedGroups.length === 1) {
    const only = populatedGroups[0]!.scenarios;
    return only[numericSeed % only.length]!;
  }
  const start = hash(seedText + ":" + qlId + ":subject-start") % populatedGroups.length;
  const group = populatedGroups[(start + sequenceIndex) % populatedGroups.length]!;
  const scenarioSeed = hash(seedText + ":" + qlId + ":" + String(sequenceIndex) + ":" + group.kind + ":scenario");
  return group.scenarios[scenarioSeed % group.scenarios.length]!;
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("DM-001 review batches require a count between 1 and 50.");
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  const language = value ?? "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error("DM-001 does not support language " + String(value));
}

function dmLocale(language: QuestionStudioLanguage): DmLocale {
  return language;
}

function normalizeDifficulty(value: unknown): DmDifficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "EASY";
  if (normalized === "medium" || normalized === "moderate") return "MEDIUM";
  if (normalized === "hard") return "HARD";
  throw new Error("DM-001 difficulty must be Easy, Medium, Hard or Mixed; received " + String(value));
}

function displayDifficulty(value: DmDifficulty): DisplayDifficulty {
  return value === "EASY" ? "Easy" : value === "MEDIUM" ? "Medium" : "Hard";
}

function checkpointForSelector(selector: string): DmCheckpointId | undefined {
  if (cpIds.includes(selector as DmCheckpointId)) return selector as DmCheckpointId;
  return blueprintCpAliases[selector];
}

// Mixed review batches must expose the whole chapter early. A contiguous QL walk made
// the first 15-30 questions look like one long recruitment/eligibility exercise even
// though CP011-CP020 own materially different situational and advanced decision tasks.
const DEFAULT_MIXED_CHECKPOINT_ORDER: readonly DmCheckpointId[] = Object.freeze([
  "DM-CP-001", "DM-CP-011", "DM-CP-017", "DM-CP-006", "DM-CP-012",
  "DM-CP-018", "DM-CP-002", "DM-CP-013", "DM-CP-019", "DM-CP-007",
  "DM-CP-014", "DM-CP-020", "DM-CP-003", "DM-CP-015", "DM-CP-008",
  "DM-CP-004", "DM-CP-016", "DM-CP-009", "DM-CP-005", "DM-CP-010",
]);

const DEFAULT_MIXED_QL_ORDER: readonly DmQlId[] = Object.freeze(
  [0, 1, 2].flatMap((qlOffset) =>
    DEFAULT_MIXED_CHECKPOINT_ORDER.map((checkpointId) => {
      const owned = DM_001_QL_REGISTRY.filter((entry) => entry.checkpointId === checkpointId);
      const entry = owned[qlOffset];
      if (!entry) throw new Error(checkpointId + " does not expose the expected three DM QLs.");
      return entry.qlId;
    }),
  ),
);

function resolveQlPool(request: QuestionStudioGenerationRequest): DmQlId[] {
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
  const qlMatches = [...new Set(selectors.filter((value) => qlIds.includes(value as DmQlId)))] as DmQlId[];
  const cpMatches = [...new Set(selectors.map(checkpointForSelector).filter((value): value is DmCheckpointId => Boolean(value)))];
  const allowed = new Set<string>([DM001_QUESTION_STUDIO_PACKAGE_ID_V1, ...qlIds, ...cpIds, ...Object.keys(blueprintCpAliases)]);
  const unknown = selectors.find((selector) => selector.startsWith("DM-") && !allowed.has(selector));
  if (unknown) throw new Error("Unknown DM-001 selector " + unknown);
  if (qlMatches.length > 1) throw new Error("Conflicting DM-001 QL selectors " + qlMatches.join(", "));
  if (cpMatches.length > 1) throw new Error("Conflicting DM-001 checkpoint selectors " + cpMatches.join(", "));
  const qlId = qlMatches[0];
  const checkpointId = cpMatches[0];
  if (qlId && checkpointId) {
    const owner = DM_001_QL_REGISTRY.find((entry) => entry.qlId === qlId)!.checkpointId;
    if (owner !== checkpointId) throw new Error(qlId + " is owned by " + owner + ", not " + checkpointId);
  }
  if (qlId) return [qlId];
  if (checkpointId) return DM_001_QL_REGISTRY.filter((entry) => entry.checkpointId === checkpointId).map((entry) => entry.qlId);
  return [...DEFAULT_MIXED_QL_ORDER];
}

export function isDm001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === DM001_QUESTION_STUDIO_PACKAGE_ID_V1;
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId].map((value) => text(value).toUpperCase());
  if (selectors.some((selector) => selector.startsWith("DM-QL-") || selector.startsWith("DM-CP-") || Object.hasOwn(blueprintCpAliases, selector))) return true;
  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === "decision making" || topic === "decision-making" || topic === "decision making / eligibility"
    || subtopic === "eligibility and rule application" || subtopic === "decision making" || subtopic === "decision making / eligibility";
}

const DIFFICULTY_PATTERN: readonly DmDifficulty[] = Object.freeze([
  "EASY", "EASY", "EASY", "EASY", "EASY", "EASY",
  "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM",
  "HARD", "HARD", "HARD", "HARD", "HARD",
]);

export const DM001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = Object.freeze({
  engineId: "reasoning-v1",
  packageId: DM001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Reasoning",
  topic: "Decision Making / Eligibility",
  subtopic: "Eligibility and Rule Application",
  label: "Reasoning · Decision Making · DM-001",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: DM001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [DM001_QUESTION_STUDIO_RUNTIME_MODE_V1],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    registrationAuthorityId: DM001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    semanticQlCount: DM_001_MANIFEST.semanticQlCount,
    permanentQlRange: "DM-QL-001..DM-QL-060",
    checkpointCount: cpIds.length,
    deterministicGeneration: true,
    multilingualParityVerified: true,
    difficultyCalibrationStatus: "GENERATED_PROFILE_AND_RULE_PATH_V1",
    reviewOnly: true,
    contentClosureStatus: DM_001_MANIFEST.lifecycle.status,
    contentFrozen: DM_001_MANIFEST.lifecycle.frozen,
    contentClosureAuthority: DM_001_MANIFEST.lifecycle.chapterClosureAuthority,
    scenarioCount: DM_001_SCENARIO_LIBRARY.length,
    cpTitles: {
      "DM-CP-001": "Basic Direct Decisions · DM-001",
      "DM-CP-002": "Multiple Simultaneous Conditions · DM-002",
      "DM-CP-003": "Conditional and Exception Rules · DM-003",
      "DM-CP-004": "Referral and Escalation Decisions · DM-004",
      "DM-CP-005": "Age, Qualification and Experience · DM-005",
      "DM-CP-006": "Applicant and Provider Approval · DM-006",
      "DM-CP-007": "Benefit and Enterprise Support · DM-007",
      "DM-CP-008": "Multi-field Cut-offs · DM-008",
      "DM-CP-009": "Dependent Exceptions and Tolerances · DM-009",
      "DM-CP-010": "Priority-Based Allocation · DM-010",
      "DM-CP-011": "Administrative Course of Action · DM-011",
      "DM-CP-012": "Best Immediate Action · DM-012",
      "DM-CP-013": "Complaint and Grievance Handling · DM-013",
      "DM-CP-014": "Workplace Decisions · DM-014",
      "DM-CP-015": "Public-Service Situations · DM-015",
      "DM-CP-016": "Resource Allocation · DM-016",
      "DM-CP-017": "Conflicting Conditions and Tie-breaking · DM-017",
      "DM-CP-018": "Incomplete Information Decisions · DM-018",
      "DM-CP-019": "Multi-person Decision Sets · DM-019",
      "DM-CP-020": "Mixed Decision-Making Sets · DM-020",
    },
    chapterBlueprintStatus: "WAVES_1_TO_4_CHAPTER_COMPLETE",
    questionBankWritesEnabled: false,
    testActivationEnabled: false,
    mockActivationEnabled: false,
    publicReleaseEnabled: false,
  },
});

export async function generateDm001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== DM001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
    throw new Error("DM-001 only supports review-only runtime.");
  }
  const language = normalizeLanguage(request.language);
  const locale = dmLocale(language);
  const count = normalizeCount(request.count);
  const requestedDifficulty = normalizeDifficulty(request.difficulty);
  const qlPool = resolveQlPool(request);
  const cohesiveDm020 = qlPool.every((qlId) =>
    DM_001_QL_REGISTRY.find((entry) => entry.qlId === qlId)?.checkpointId === "DM-CP-020"
  );
  const seedText = text(request.seed) || "dm001-waves-1-4-review-v1";
  const start = hash(seedText + ":ql-start") % qlPool.length;
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const sequenceIndex = cohesiveDm020 ? Math.floor(index / 5) : index;
    const qlId = qlPool[(start + sequenceIndex) % qlPool.length]!;
    const eligibleScenarios = DM_001_SCENARIO_LIBRARY.filter((scenario) => scenario.qlId === qlId);
    if (eligibleScenarios.length === 0) throw new Error("DM-001 has no scenario authority for " + qlId);
    const numericSeed = hash(seedText + ":" + qlId + ":" + String(sequenceIndex));
    const scenario = balancedScenarioForQl(eligibleScenarios, qlId, seedText, sequenceIndex, numericSeed);
    const difficulty = requestedDifficulty ?? DIFFICULTY_PATTERN[sequenceIndex % DIFFICULTY_PATTERN.length]!;
    const mode = modesForDmDifficulty(scenario, difficulty, numericSeed);
    const generatedSet = cohesiveDm020
      ? generateDm020QuestionSet({ scenario, locale, seed: numericSeed, mode })
      : undefined;
    const generated = generatedSet?.questions[index % 5]
      ?? generateDmQuestion({ scenario, locale, seed: numericSeed, mode });
    if (generated.difficulty !== difficulty) {
      throw new Error("DM-001 difficulty selector produced a different generated-instance difficulty.");
    }
    const options = [...generated.options];
    const setQuestionSuffix = generated.setQuestionNumber ? ":Q" + String(generated.setQuestionNumber) : "";
    const questionId = "DM-001:" + qlId + ":" + String(numericSeed) + setQuestionSuffix + ":" + language;
    const localeName = language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
    const difficultyLabel = displayDifficulty(generated.difficulty);

    questions.push({
      ...lifecycle,
      lifecycleStage: lifecycle.stage,
      id: questionId,
      questionId,
      packageId: DM001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: qlId,
      qlId,
      cpId: generated.checkpointId,
      checkpointId: generated.checkpointId,
      blueprintCheckpointId: generated.blueprintCheckpointId,
      scenarioId: generated.scenarioId,
      subjectKind: subjectKindOfScenario(scenario),
      ruleOutcome: generated.outcome,
      answerMode: generated.answerMode,
      ...(generated.selectedCandidates ? { selectedCandidates: [...generated.selectedCandidates] } : {}),
      ...(generated.candidateGroup ? { candidateGroup: generated.candidateGroup.map((candidate) => ({ ...candidate })) } : {}),
      ...(generated.setQuestionKind ? { setQuestionKind: generated.setQuestionKind, setQuestionNumber: generated.setQuestionNumber } : {}),
      ...(generatedSet ? {
        setId: generatedSet.setId,
        setSize: generatedSet.questions.length,
        setSharedStimulus: generatedSet.sharedStimulus,
        setCandidateProfiles: generatedSet.candidateGroup.map((candidate) => ({ ...candidate })),
      } : {}),
      subject: "Reasoning",
      topic: "Decision Making / Eligibility",
      subtopic: "Eligibility and Rule Application",
      language,
      locale: localeName,
      stem: generated.stem,
      text: generated.stem,
      options,
      correctIndex: generated.correctIndex,
      correct: generated.correctIndex,
      answer: generated.answerMode === "ELIGIBILITY_OUTCOME" ? generated.outcome : options[generated.correctIndex],
      canonicalAnswer: options[generated.correctIndex],
      explanation: generated.explanation,
      explanationRows: generated.explanationRows,
      difficulty: difficultyLabel,
      difficultyLabel,
      requestedDifficulty: request.difficulty ?? "Mixed",
      requestedDifficultyApplied: Boolean(requestedDifficulty),
      requestedExam: request.exam ?? null,
      generationSeed: seedText + ":" + qlId + ":" + String(sequenceIndex) + setQuestionSuffix,
      numericSeed,
      runtimeMode: DM001_QUESTION_STUDIO_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: DM001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      reviewOnly: true,
      readOnly: true,
      persistenceAllowed: false,
      canonicalQuestionPersistenceAllowed: false,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleased: false,
      traceability: {
        packageId: DM001_QUESTION_STUDIO_PACKAGE_ID_V1,
        chapterId: "DM-001",
        qlId,
        checkpointId: generated.checkpointId,
        blueprintCheckpointId: generated.blueprintCheckpointId,
        scenarioId: generated.scenarioId,
        subjectKind: subjectKindOfScenario(scenario),
        ruleOutcome: generated.outcome,
        answerMode: generated.answerMode,
        ...(generated.setQuestionKind ? { setQuestionKind: generated.setQuestionKind, setQuestionNumber: generated.setQuestionNumber } : {}),
        ...(generatedSet ? { setId: generatedSet.setId, setSize: generatedSet.questions.length } : {}),
      },
    });
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: DM001_QUESTION_STUDIO_PACKAGE_ID_V1,
      runtimeMode: DM001_QUESTION_STUDIO_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: DM001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      chapterId: "DM-001",
      subjectCode: "REAS-DCS",
      semanticQlCount: qlIds.length,
      permanentQlIds: [...qlIds],
      cpIds: [...cpIds],
      scenarioCount: DM_001_SCENARIO_LIBRARY.length,
      baseRuleScenarioCountPerCheckpoint: 25,
      structuredProductScenarioCount: 30,
      structuredOrganizationScenarioCount: 15,
      situationalScenarioCountPerCheckpoint: 75,
      advancedScenarioCountPerCheckpoint: 25,
      scenarioCountByCheckpoint: Object.fromEntries(DM_001_MANIFEST.checkpoints.map((entry) => [entry.checkpointId, entry.scenarioTarget])),
      language,
      requestedDifficulty: requestedDifficulty ? displayDifficulty(requestedDifficulty) : "Mixed",
      difficultyDistributionTarget: "30% Easy / 45% Medium / 25% Hard",
      difficultyPattern: "6 Easy / 9 Medium / 5 Hard in each 20-question cycle",
      requestedExam: request.exam ?? null,
      deterministicGeneration: true,
      contentClosureStatus: DM_001_MANIFEST.lifecycle.status,
      contentFrozen: DM_001_MANIFEST.lifecycle.frozen,
      contentClosureAuthority: DM_001_MANIFEST.lifecycle.chapterClosureAuthority,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      seed: seedText,
      count,
    },
  };
}