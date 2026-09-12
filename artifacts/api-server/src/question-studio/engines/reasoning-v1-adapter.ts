import {
  OPS_QL_ENTRIES,
  OPS_QL_FREEZE_VERSION,
  generateFrozenOpsQuestion,
  generateLocalizedFrozenOpsQuestion,
  type OpsCheckpointId,
  type OpsQlId,
} from "../../reasoning-v1/topics/Mathematical-Operations/OPS-001/registry";
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
  "OPS-001-FORWARD-PORT-REVIEW-ONLY-V1" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const qlIds = OPS_QL_ENTRIES.map((entry) => entry.qlId) as OpsQlId[];
const cpIds = [...new Set(OPS_QL_ENTRIES.map((entry) => entry.checkpointId))] as OpsCheckpointId[];

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
  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);

  const qlMatches = [...new Set(selectors.filter(isQlId))];
  const cpMatches = [...new Set(selectors.filter(isCheckpointId))];
  const allowed = new Set<string>([
    OPS001_QUESTION_STUDIO_PACKAGE_ID_V1,
    ...qlIds,
    ...cpIds,
  ]);
  const unknownOpsSelector = selectors.find(
    (selector) => selector.startsWith("OPS-") && !allowed.has(selector),
  );
  if (unknownOpsSelector) {
    throw new Error(`Unknown OPS-001 selector ${unknownOpsSelector}`);
  }
  if (qlMatches.length > 1) {
    throw new Error(`Conflicting OPS-001 QL selectors ${qlMatches.join(", ")}`);
  }
  if (cpMatches.length > 1) {
    throw new Error(`Conflicting OPS-001 checkpoint selectors ${cpMatches.join(", ")}`);
  }

  const qlId = qlMatches[0];
  const checkpointId = cpMatches[0];
  if (qlId && checkpointId) {
    const entry = OPS_QL_ENTRIES.find((candidate) => candidate.qlId === qlId)!;
    if (entry.checkpointId !== checkpointId) {
      throw new Error(`${qlId} is owned by ${entry.checkpointId}, not ${checkpointId}`);
    }
  }
  if (qlId) return [qlId];
  if (checkpointId) {
    return OPS_QL_ENTRIES
      .filter((entry) => entry.checkpointId === checkpointId)
      .map((entry) => entry.qlId);
  }
  return [...qlIds];
}

function questionForLanguage(qlId: OpsQlId, seed: number, language: QuestionStudioLanguage) {
  if (language === "en") return generateFrozenOpsQuestion(qlId, seed);
  return generateLocalizedFrozenOpsQuestion(
    qlId,
    seed,
    language === "hi" ? "hi-IN" : "pa-IN",
  );
}

function explanationText(question: ReturnType<typeof questionForLanguage>): string {
  return [
    question.explanation.ruleStatement,
    ...question.explanation.steps.map(
      (step) => `${step.label}:\n${step.expression} → ${step.result}`,
    ),
    question.explanation.conclusion,
  ].join("\n\n");
}

function isOps001Request(request: QuestionStudioGenerationRequest): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === OPS001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.some((selector) => selector.startsWith("OPS-QL-") || selector.startsWith("OPS-CP-"))) {
    return true;
  }

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
  supportedDifficulties: [],
  difficultyFilterSupported: false,
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
    difficultyCalibrationStatus: "PENDING_INSTANCE_DERIVED_REMEDIATION",
    difficultySelectionStatus: "NOT_APPLIED_IN_REVIEW_ONLY_FORWARD_PORT",
    productionDifficultyClaimsAuthorized: false,
    examProfileControlStatus: "PENDING_REMEDIATION",
    sourceBranch: "feat/ops-001-end-to-end-design",
    forwardPortMode: "CHAPTER_SUBTREE_ONLY",
  },
};

export const reasoningV1QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "reasoning-v1",

  listPackages() {
    return [OPS001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (!isOps001Request(request)) {
      throw new Error(`reasoning-v1 cannot resolve package ${String(request.packageId ?? request.topic ?? "unknown")}`);
    }
    if (request.runtimeMode && request.runtimeMode !== OPS001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`OPS-001 only supports ${OPS001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime during forward-port review`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const pool = resolveQlPool(request);
    const baseSeed = text(request.seed) || "ops001-question-studio-forward-port-v1";
    const start = hash(`${baseSeed}:ql-start`) % pool.length;
    const questions: Record<string, unknown>[] = [];

    for (let index = 0; index < count; index += 1) {
      const qlId = pool[(start + index) % pool.length]!;
      const itemSeed = `${baseSeed}:${qlId}:${index}`;
      const numericSeed = hash(itemSeed);
      const generated = questionForLanguage(qlId, numericSeed, language);
      const entry = OPS_QL_ENTRIES.find((candidate) => candidate.qlId === qlId)!;
      const options = generated.options.map((option) => option.value);
      const questionId = `OPS-001:${qlId}:${numericSeed}:${language}`;

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
        explanation: explanationText(generated),
        packageExplanation: generated.explanation,
        renderer: generated.renderer,
        difficulty: "Uncalibrated",
        difficultyLabel: "Uncalibrated",
        difficultyCalibrationStatus: "PENDING_INSTANCE_DERIVED_REMEDIATION",
        requestedDifficulty: request.difficulty ?? null,
        requestedDifficultyApplied: false,
        requestedExam: request.exam ?? null,
        examProfileApplied: false,
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
        },
        semanticMetadata: {
          qlId,
          checkpointId: entry.checkpointId,
          solveMode: entry.solveMode,
          answerSemantic: entry.answerSemantic,
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
        requestedDifficulty: request.difficulty ?? null,
        difficultyFilterApplied: false,
        productionDifficultyClaimsAuthorized: false,
        requestedExam: request.exam ?? null,
        examProfileApplied: false,
        seed: baseSeed,
        count,
      },
    };
  },
};
