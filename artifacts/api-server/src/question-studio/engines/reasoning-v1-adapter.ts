import {
  OPS_QL_ENTRIES,
  OPS_QL_FREEZE_VERSION,
  type OpsCheckpointId,
  type OpsQlId,
} from "../../reasoning-v1/topics/Mathematical-Operations/OPS-001/registry";
import {
  generateAuditedOpsQuestion,
  type OpsAuditedLanguage,
} from "../../reasoning-v1/topics/Mathematical-Operations/OPS-001/runtime/audited-generator";
import { generateOpsPairedCompoundPresentation } from "../../reasoning-v1/topics/Mathematical-Operations/OPS-001/runtime/paired-compound-presentation";
import type { OpsInstanceDifficulty } from "../../reasoning-v1/topics/Mathematical-Operations/OPS-001/runtime/final-audit-remediation";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const OPS001_QUESTION_STUDIO_PACKAGE_ID_V1 = "OPS-001" as const;
export const OPS001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const OPS001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  "OPS-001-FINAL-AUDIT-REMEDIATION-V1" as const;

type OpsExamProfile = "SSC_MODERN" | "BANKING" | "PUNJAB_STATE" | "GENERIC";

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const qlIds = OPS_QL_ENTRIES.map((entry) => entry.qlId) as OpsQlId[];
const cpIds = [...new Set(OPS_QL_ENTRIES.map((entry) => entry.checkpointId))] as OpsCheckpointId[];

const SSC_WEIGHTED_QLS: readonly OpsQlId[] = [
  "OPS-QL-012", "OPS-QL-014", "OPS-QL-016", "OPS-QL-017",
  "OPS-QL-024", "OPS-QL-025", "OPS-QL-026", "OPS-QL-026", "OPS-QL-027",
  "OPS-QL-001", "OPS-QL-002", "OPS-QL-010", "OPS-QL-028", "OPS-QL-029",
];
const BANKING_WEIGHTED_QLS: readonly OpsQlId[] = [
  "OPS-QL-001", "OPS-QL-003", "OPS-QL-008", "OPS-QL-010", "OPS-QL-012",
  "OPS-QL-014", "OPS-QL-017", "OPS-QL-028", "OPS-QL-029", "OPS-QL-030", "OPS-QL-031",
];
const PUNJAB_WEIGHTED_QLS: readonly OpsQlId[] = [
  "OPS-QL-001", "OPS-QL-003", "OPS-QL-008", "OPS-QL-012", "OPS-QL-014",
  "OPS-QL-018", "OPS-QL-021", "OPS-QL-024", "OPS-QL-026", "OPS-QL-028",
];

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("OPS-001 review batches require count between 1 and 50");
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  const language = value ?? "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`OPS-001 does not support language ${String(value)}`);
}

function normalizeDifficulty(value: unknown): OpsInstanceDifficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  throw new Error(`OPS-001 difficulty must be Easy, Medium, Hard or Mixed; received ${String(value)}`);
}

function resolveExamProfile(value: unknown): OpsExamProfile {
  const normalized = text(value).toLowerCase();
  if (!normalized) return "GENERIC";
  if (/\bssc\b|cgl|chsl|cpo|mts|gd constable/u.test(normalized)) return "SSC_MODERN";
  if (/ibps|sbi|bank|rrb officer|clerk|po\b/u.test(normalized)) return "BANKING";
  if (/punjab|psssb|ppsc|patwari|pspcl/u.test(normalized)) return "PUNJAB_STATE";
  return "GENERIC";
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function isQlId(value: string): value is OpsQlId {
  return qlIds.includes(value as OpsQlId);
}

function isCheckpointId(value: string): value is OpsCheckpointId {
  return cpIds.includes(value as OpsCheckpointId);
}

function resolveQlPool(request: QuestionStudioGenerationRequest): OpsQlId[] {
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
  const qlMatches = [...new Set(selectors.filter(isQlId))];
  const cpMatches = [...new Set(selectors.filter(isCheckpointId))];
  const allowed = new Set<string>([OPS001_QUESTION_STUDIO_PACKAGE_ID_V1, ...qlIds, ...cpIds]);
  const unknownOpsSelector = selectors.find((selector) => selector.startsWith("OPS-") && !allowed.has(selector));
  if (unknownOpsSelector) throw new Error(`Unknown OPS-001 selector ${unknownOpsSelector}`);
  if (qlMatches.length > 1) throw new Error(`Conflicting OPS-001 QL selectors ${qlMatches.join(", ")}`);
  if (cpMatches.length > 1) throw new Error(`Conflicting OPS-001 checkpoint selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const checkpointId = cpMatches[0];
  if (qlId && checkpointId) {
    const entry = OPS_QL_ENTRIES.find((candidate) => candidate.qlId === qlId)!;
    if (entry.checkpointId !== checkpointId) throw new Error(`${qlId} is owned by ${entry.checkpointId}, not ${checkpointId}`);
  }
  if (qlId) return [qlId];
  if (checkpointId) return OPS_QL_ENTRIES.filter((entry) => entry.checkpointId === checkpointId).map((entry) => entry.qlId);
  return [...qlIds];
}

function weightedPool(pool: readonly OpsQlId[], profile: OpsExamProfile): OpsQlId[] {
  if (pool.length !== qlIds.length) return [...pool];
  const weights = profile === "SSC_MODERN"
    ? SSC_WEIGHTED_QLS
    : profile === "BANKING"
      ? BANKING_WEIGHTED_QLS
      : profile === "PUNJAB_STATE"
        ? PUNJAB_WEIGHTED_QLS
        : [];
  return [...pool, ...weights.filter((qlId) => pool.includes(qlId))];
}

function shouldUseSscPairedSurface(profile: OpsExamProfile, qlId: OpsQlId, seed: string): boolean {
  return profile === "SSC_MODERN" && qlId === "OPS-QL-026" && hash(`${seed}:paired-surface`) % 2 === 0;
}

function generateOne(
  qlId: OpsQlId,
  numericSeed: number,
  language: OpsAuditedLanguage,
  profile: OpsExamProfile,
  itemSeed: string,
) {
  return shouldUseSscPairedSurface(profile, qlId, itemSeed)
    ? generateOpsPairedCompoundPresentation(numericSeed, language)
    : generateAuditedOpsQuestion(qlId, numericSeed, language);
}

function resolveInstance(
  preferredQl: OpsQlId,
  pool: readonly OpsQlId[],
  baseSeed: string,
  index: number,
  language: OpsAuditedLanguage,
  profile: OpsExamProfile,
  requestedDifficulty: OpsInstanceDifficulty | undefined,
) {
  const qlCandidates = [preferredQl, ...pool.filter((qlId) => qlId !== preferredQl)];
  const attemptLimit = requestedDifficulty ? 160 : 1;
  for (const qlId of qlCandidates) {
    for (let attempt = 0; attempt < attemptLimit; attempt += 1) {
      const itemSeed = `${baseSeed}:${qlId}:${index}:attempt:${attempt}`;
      const numericSeed = hash(itemSeed);
      try {
        const generated = generateOne(qlId, numericSeed, language, profile, itemSeed);
        if (!requestedDifficulty || generated.instanceDifficulty.difficulty === requestedDifficulty) {
          return { qlId, generated, itemSeed, numericSeed, attempt };
        }
      } catch {
        continue;
      }
    }
  }
  throw new Error(
    requestedDifficulty
      ? `OPS-001 could not produce a ${requestedDifficulty} instance for the requested QL/checkpoint scope without relabelling difficulty.`
      : "OPS-001 could not produce a valid deterministic instance for the requested scope.",
  );
}

function explanationText(question: ReturnType<typeof generateAuditedOpsQuestion>): string {
  return [
    question.explanation.ruleStatement,
    ...question.explanation.steps.map((step) => `${step.label}:\n${step.expression} → ${step.result}`),
    question.explanation.conclusion,
  ].join("\n\n");
}

function isOps001Request(request: QuestionStudioGenerationRequest): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === OPS001_QUESTION_STUDIO_PACKAGE_ID_V1;
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId].map((value) => text(value).toUpperCase());
  if (selectors.some((selector) => selector.startsWith("OPS-QL-") || selector.startsWith("OPS-CP-"))) return true;
  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === "mathematical operations" || subtopic === "symbol substitution";
}

export const OPS001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: OPS001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Reasoning",
  topic: "Mathematical Operations",
  subtopic: "Symbol Substitution",
  label: "Reasoning · Mathematical Operations · OPS-001",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: OPS001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [OPS001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    registrationAuthorityId: OPS001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    qlFreezeVersion: OPS_QL_FREEZE_VERSION,
    qlCount: qlIds.length,
    permanentQlRange: "OPS-QL-001..OPS-QL-031",
    deterministicGeneration: true,
    reviewOnly: true,
    difficultyCalibrationStatus: "INSTANCE_DERIVED_V1",
    difficultySelectionStatus: "BOUNDED_GENERATION_MATCH",
    productionDifficultyClaimsAuthorized: true,
    examProfileControlStatus: "ACTIVE_QL_WEIGHTING_AND_SSC_PRESENTATION",
    supportedExamProfiles: ["SSC_MODERN", "BANKING", "PUNJAB_STATE", "GENERIC"],
    optionCountPolicy: "CURRENT_REVIEW_SURFACE_4_OPTIONS",
    fiveOptionBankingDeliveryImplemented: false,
  },
};

export const reasoningV1QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "reasoning-v1",

  listPackages() {
    return [OPS001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (!isOps001Request(request)) throw new Error(`reasoning-v1 cannot resolve package ${String(request.packageId ?? request.topic ?? "unknown")}`);
    if (request.runtimeMode && request.runtimeMode !== OPS001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`OPS-001 only supports ${OPS001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime during review`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const requestedDifficulty = normalizeDifficulty(request.difficulty);
    const profile = resolveExamProfile(request.exam);
    const basePool = resolveQlPool(request);
    const pool = weightedPool(basePool, profile);
    const baseSeed = text(request.seed) || "ops001-question-studio-audited-v1";
    const start = hash(`${baseSeed}:${profile}:ql-start`) % pool.length;
    const questions: Record<string, unknown>[] = [];

    for (let index = 0; index < count; index += 1) {
      const preferredQl = pool[(start + index) % pool.length]!;
      const resolved = resolveInstance(preferredQl, basePool, baseSeed, index, language, profile, requestedDifficulty);
      const { qlId, generated, itemSeed, numericSeed, attempt } = resolved;
      const entry = OPS_QL_ENTRIES.find((candidate) => candidate.qlId === qlId)!;
      const options = generated.options.map((option) => option.value);
      const questionId = `OPS-001:${qlId}:${numericSeed}:${language}`;
      const difficulty = generated.instanceDifficulty.difficulty;

      questions.push({
        ...lifecycle,
        id: questionId,
        questionId,
        packageId: OPS001_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: qlId,
        qlId,
        cpId: generated.checkpointId,
        checkpointId: generated.checkpointId,
        candidateId: generated.candidateId,
        solveMode: generated.solveMode,
        taskKind: generated.taskKind,
        subject: "Reasoning",
        topic: "Mathematical Operations",
        subtopic: "Symbol Substitution",
        language,
        locale: generated.locale,
        stem: generated.stem,
        text: generated.stem,
        options,
        correctIndex: generated.correctIndex,
        correct: generated.correctIndex,
        answer: generated.answer,
        canonicalAnswer: options[generated.correctIndex],
        explanation: explanationText(generated as ReturnType<typeof generateAuditedOpsQuestion>),
        packageExplanation: generated.explanation,
        renderer: generated.renderer,
        difficulty,
        difficultyLabel: difficulty,
        difficultyScore: generated.instanceDifficulty.score,
        difficultyFactors: generated.instanceDifficulty.factors,
        difficultyCalibrationStatus: "INSTANCE_DERIVED_V1",
        requestedDifficulty: request.difficulty ?? null,
        requestedDifficultyApplied: requestedDifficulty ? difficulty === requestedDifficulty : false,
        difficultySearchAttempts: attempt + 1,
        requestedExam: request.exam ?? null,
        examProfile: profile,
        examProfileApplied: profile !== "GENERIC",
        optionCountProfileApplied: false,
        optionCountPolicy: "CURRENT_REVIEW_SURFACE_4_OPTIONS",
        generationSeed: itemSeed,
        numericSeed,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: OPS001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        reviewOnly: true,
        readOnly: true,
        productionReleased: false,
        presentationMode: generated.metadata.presentationMode ?? "DEFAULT",
        traceability: {
          packageId: OPS001_QUESTION_STUDIO_PACKAGE_ID_V1,
          qlId,
          checkpointId: generated.checkpointId,
          candidateId: generated.candidateId,
          qlFreezeVersion: OPS_QL_FREEZE_VERSION,
          solverRoute: generated.proof.solverRoute,
          semanticFingerprint: generated.proof.semanticFingerprint,
        },
        validation: {
          unique: generated.proof.unique,
          eligibleCandidateCount: generated.proof.eligibleCandidateCount,
          survivingCandidateCount: generated.proof.survivingCandidateCount,
          teachingTraceVerified: generated.metadata.teachingTraceVerified === true,
          difficultyDerivedFromInstance: generated.metadata.difficultyDerivedFromInstance === true,
          seedUsedAsDifficultyInput: generated.metadata.seedUsedAsDifficultyInput === true,
        },
        semanticMetadata: {
          qlId,
          checkpointId: entry.checkpointId,
          solveMode: entry.solveMode,
          answerSemantic: generated.metadata.presentationAnswerSemantic ?? entry.answerSemantic,
          sourceFamilyIds: entry.sourceFamilyIds,
          ambiguityPoolId: entry.ambiguityPoolId,
          explanationStrategyId: entry.explanationStrategyId,
        },
      });
    }

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "reasoning-v1",
        packageId: OPS001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: OPS001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: OPS001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        qlFreezeVersion: OPS_QL_FREEZE_VERSION,
        permanentQlCount: qlIds.length,
        permanentQlIds: [...qlIds],
        cpIds: [...cpIds],
        language,
        requestedDifficulty: requestedDifficulty ?? "Mixed",
        difficultyFilterApplied: Boolean(requestedDifficulty),
        difficultyCalibrationStatus: "INSTANCE_DERIVED_V1",
        requestedExam: request.exam ?? null,
        examProfile: profile,
        examProfileApplied: profile !== "GENERIC",
        optionCountPolicy: "CURRENT_REVIEW_SURFACE_4_OPTIONS",
        fiveOptionBankingDeliveryImplemented: false,
        seed: baseSeed,
        count,
      },
    };
  },
};
