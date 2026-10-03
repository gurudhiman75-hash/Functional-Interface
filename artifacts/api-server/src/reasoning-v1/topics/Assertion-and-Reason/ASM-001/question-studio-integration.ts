import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import {
  ASM_001_CHECKPOINT_IDS,
  ASM_001_CONTENT_CLOSURE,
  ASM_001_FREEZE_VERSION,
  ASM_001_PACKAGE_ID,
  ASM_001_PERMANENT_QL_IDS,
  ASM_001_RUNTIME_MODE,
} from "./asm-001-authority";
import {
  generateAsm001Question,
  type AsmDifficulty,
} from "./asm-001-runtime";
import type { AsmLanguage } from "./asm-001-corpus";

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("ASM-001 review batches require count between 1 and 50.");
  }
  return value;
}

function normalizeLanguage(
  value: QuestionStudioGenerationRequest["language"],
): AsmLanguage {
  const language = value ?? "en";
  if (language === "en" || language === "hi" || language === "pa") {
    return language;
  }
  throw new Error("ASM-001 supports English, Hindi and Punjabi.");
}

function normalizeDifficulty(value: unknown): AsmDifficulty | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text || text === "mixed") return undefined;
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  throw new Error("ASM-001 difficulty must be Easy, Medium, Hard or Mixed.");
}

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function validateSelector(request: QuestionStudioGenerationRequest): void {
  for (const raw of [
    request.canonicalProblemId,
    request.questionLanguageId,
    request.patternId,
  ]) {
    const value = String(raw ?? "").trim().toUpperCase();
    if (!value) continue;
    if (
      value === "ASM-001" ||
      value === "ASM-QL-001" ||
      value === "ASM-CP-001"
    ) {
      continue;
    }
    if (value.startsWith("ASM-QL-") || value.startsWith("ASM-CP-")) {
      throw new Error("Unknown ASM-001 selector: " + value);
    }
  }
}

export const ASM_001_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: ASM_001_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Reasoning",
  subtopic: "Assertion and Reason",
  label: "Reasoning · Assertion and Reason · ASM-001",
  enabled: true,
  cpIds: [...ASM_001_CHECKPOINT_IDS],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: ASM_001_RUNTIME_MODE,
  supportedRuntimeModes: [ASM_001_RUNTIME_MODE],
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
    freezeVersion: ASM_001_FREEZE_VERSION,
    closureAuthorityId: ASM_001_CONTENT_CLOSURE.authorityId,
    permanentQlCount: ASM_001_CONTENT_CLOSURE.permanentQlCount,
    permanentQlRange: ASM_001_CONTENT_CLOSURE.permanentQlRange,
    nextAvailablePermanentQl: ASM_001_CONTENT_CLOSURE.nextAvailablePermanentQl,
    sourcePosture: ASM_001_CONTENT_CLOSURE.sourcePosture,
    sourceSaturationClaim: ASM_001_CONTENT_CLOSURE.sourceSaturationClaim,
    curatedTruthAuthority: true,
    deterministicGeneration: true,
    multilingual: true,
    standardFourOptionProfile: true,
    extendedFiveOptionProfile: true,
    reviewOnly: true,
  },
};

export function isAsm001QuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === ASM_001_PACKAGE_ID;

  const pattern = String(request.patternId ?? "").trim().toUpperCase();
  if (
    pattern === ASM_001_PACKAGE_ID ||
    pattern === "ASM-QL-001" ||
    pattern === "ASM-CP-001"
  ) {
    return true;
  }

  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return (
    topic === "assertion and reason" ||
    topic === "assertion-reason" ||
    subtopic === "assertion and reason" ||
    subtopic === "assertion-reason" ||
    subtopic === "assertion reason"
  );
}

export async function generateAsm001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  if (request.runtimeMode && request.runtimeMode !== ASM_001_RUNTIME_MODE) {
    throw new Error("ASM-001 only supports review-only runtime.");
  }
  validateSelector(request);

  const count = normalizeCount(request.count);
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const baseSeed =
    String(request.seed ?? "").trim() || "asm001-question-studio-v1";
  const questions: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const itemSeed = baseSeed + ":ASM-QL-001:" + index;
    const generated = generateAsm001Question(
      itemSeed,
      language,
      difficulty,
    );
    const questionId =
      "ASM-001:ASM-QL-001:" + language + ":" + hash(itemSeed);

    questions.push({
      ...lifecycle,
      id: questionId,
      questionId,
      packageId: ASM_001_PACKAGE_ID,
      patternId: "ASM-QL-001",
      qlId: "ASM-QL-001",
      cpId: "ASM-CP-001",
      checkpointId: "ASM-CP-001",
      subject: "Reasoning",
      topic: "Reasoning",
      subtopic: "Assertion and Reason",
      language,
      locale: generated.locale,
      stem: generated.stem,
      text: generated.stem,
      options: [...generated.options],
      correct: generated.correctIndex,
      correctIndex: generated.correctIndex,
      answer: generated.options[generated.correctIndex],
      canonicalAnswer: generated.canonicalAnswer,
      explanation: generated.explanation,
      difficulty: generated.difficulty,
      difficultyLabel: generated.difficulty,
      generationSeed: itemSeed,
      runtimeMode: ASM_001_RUNTIME_MODE,
      reviewOnly: true,
      readOnly: true,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: ASM_001_CONTENT_CLOSURE.authorityId,
      presentationProfile: generated.optionProfile,
      traceability: {
        packageId: ASM_001_PACKAGE_ID,
        qlId: "ASM-QL-001",
        checkpointId: "ASM-CP-001",
        scenarioId: generated.scenarioId,
        solveContract:
          "Evaluate A and R independently, then test whether a true R explains a true A.",
        answerSemantic: "ASSERTION_REASON_CLASS",
        freezeVersion: ASM_001_FREEZE_VERSION,
      },
      validation: {
        semanticConsistency: generated.proof.semanticConsistency,
        curatedTruthAuthority: generated.metadata.curatedTruthAuthority,
        deterministic: generated.metadata.deterministic,
        assertionTruth: generated.proof.assertionTruth,
        reasonTruth: generated.proof.reasonTruth,
        reasonExplainsAssertion: generated.proof.reasonExplainsAssertion,
        optionCount: generated.options.length,
        uniqueOptions:
          new Set(generated.options).size === generated.options.length,
        exactlyOneCorrectIndex:
          generated.correctIndex >= 0 &&
          generated.correctIndex < generated.options.length,
      },
    });
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: ASM_001_PACKAGE_ID,
      runtimeMode: ASM_001_RUNTIME_MODE,
      closureAuthorityId: ASM_001_CONTENT_CLOSURE.authorityId,
      freezeVersion: ASM_001_FREEZE_VERSION,
      permanentQlCount: ASM_001_PERMANENT_QL_IDS.length,
      permanentQlIds: [...ASM_001_PERMANENT_QL_IDS],
      checkpointIds: [...ASM_001_CHECKPOINT_IDS],
      language,
      requestedDifficulty: difficulty ?? "Mixed",
      seed: baseSeed,
      count,
    },
  };
}
