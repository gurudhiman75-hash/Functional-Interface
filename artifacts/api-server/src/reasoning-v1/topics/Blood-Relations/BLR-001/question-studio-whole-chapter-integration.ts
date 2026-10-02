import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import {
  generateBlr001StandardQuestionStudioBatch,
  listBlr001StandardQuestionStudioPackages,
} from "./question-studio-standard-integration";

export const BLR_001_QUESTION_STUDIO_PACKAGE_ID = "BLR-001" as const;

const SOURCE_PACKAGES = listBlr001StandardQuestionStudioPackages();

const QL_AUTHORITIES = SOURCE_PACKAGES.flatMap((pkg) =>
  (pkg.qlIds as readonly string[]).map((qlId) => ({
    qlId,
    checkpointId: String(pkg.checkpointId),
    sourcePackageId: String(pkg.packageId),
  })),
);

const CHECKPOINT_IDS = [...new Set(QL_AUTHORITIES.map((entry) => entry.checkpointId))];

export const BLR_001_STANDARD_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: BLR_001_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Blood Relations",
  subtopic: "Blood Relations",
  label: "Reasoning · Blood Relations · BLR-001",
  enabled: true,
  cpIds: [...CHECKPOINT_IDS],
  qlIds: QL_AUTHORITIES.map((entry) => entry.qlId),
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
  metadata: {
    permanentQlRange: "BLR-QL-001..035",
    permanentQlCount: QL_AUTHORITIES.length,
    checkpointCount: CHECKPOINT_IDS.length,
    sourcePackageCount: SOURCE_PACKAGES.length,
    deterministicGeneration: true,
    multilingualRuntimeAvailable: true,
  },
};

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

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("BLR-001 review batches require count between 1 and 50.");
  }
  return value;
}

function selectors(request: QuestionStudioGenerationRequest): string[] {
  return [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
}

function explicitAuthorityPool(request: QuestionStudioGenerationRequest) {
  const requested = selectors(request).filter(
    (value) => value !== BLR_001_QUESTION_STUDIO_PACKAGE_ID,
  );
  if (!requested.length) return QL_AUTHORITIES;

  const ql = requested.find((value) => value.startsWith("BLR-QL-"));
  const cp = requested.find((value) => value.startsWith("BLR-CP-"));

  if (ql) {
    const authority = QL_AUTHORITIES.find((entry) => entry.qlId === ql);
    if (!authority) throw new Error("Unknown BLR-001 QL selector " + ql);
    if (cp && authority.checkpointId !== cp) {
      throw new Error(ql + " is owned by " + authority.checkpointId + ", not " + cp);
    }
    return [authority];
  }

  if (cp) {
    const pool = QL_AUTHORITIES.filter((entry) => entry.checkpointId === cp);
    if (!pool.length) throw new Error("Unknown BLR-001 checkpoint selector " + cp);
    return pool;
  }

  throw new Error("Unknown BLR-001 selector " + requested[0]);
}

export function isBlr001WholeChapterQuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const packageId = text(request.packageId).toUpperCase();
  if (packageId) return packageId === BLR_001_QUESTION_STUDIO_PACKAGE_ID;

  const requested = selectors(request);
  if (requested.some((value) => value.startsWith("BLR-QL-") || value.startsWith("BLR-CP-"))) {
    return true;
  }

  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic === "blood relations" || subtopic === "blood relations";
}

export async function generateBlr001WholeChapterQuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  const count = normalizeCount(request.count);
  const language = request.language ?? "en";
  const baseSeed = text(request.seed) || "blr001-question-studio-v1";
  const pool = explicitAuthorityPool(request);
  const start = hash(baseSeed + ":ql-start") % pool.length;
  const questions: Record<string, unknown>[] = [];

  const explicitQlScoped = pool.length === 1 && selectors(request).some((value) => value.startsWith("BLR-QL-"));

  for (let index = 0; index < count; index += 1) {
    const candidateAuthorities = Array.from(
      { length: pool.length },
      (_, offset) => pool[(start + index + offset) % pool.length]!,
    );

    let resolved:
      | {
          authority: (typeof pool)[number];
          question: Record<string, unknown>;
        }
      | undefined;
    let lastFilterError: Error | undefined;

    for (const authority of candidateAuthorities) {
      try {
        const source = generateBlr001StandardQuestionStudioBatch({
          packageId: authority.sourcePackageId,
          canonicalProblemId: authority.qlId,
          language,
          difficulty: request.difficulty,
          seed: baseSeed + ":" + authority.qlId + ":" + index,
          count: 1,
        });
        const question = source.questions[0] as Record<string, unknown> | undefined;
        if (!question) {
          throw new Error(
            "BLR-001 source package " + authority.sourcePackageId + " returned no question for " + authority.qlId,
          );
        }
        resolved = { authority, question };
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const isDifficultyFilterMiss = /questions match the selected filters/i.test(message);
        if (!isDifficultyFilterMiss || explicitQlScoped) throw error;
        lastFilterError = error instanceof Error ? error : new Error(message);
      }
    }

    if (!resolved) {
      throw lastFilterError ?? new Error(
        "BLR-001 could not resolve a source-backed question for the requested difficulty without relabelling.",
      );
    }

    const { authority, question } = resolved;
    questions.push({
      ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
      ...question,
      packageId: BLR_001_QUESTION_STUDIO_PACKAGE_ID,
      sourcePackageId: authority.sourcePackageId,
      patternId: authority.qlId,
      qlId: authority.qlId,
      cpId: authority.checkpointId,
      checkpointId: authority.checkpointId,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      traceability: {
        ...(typeof question.traceability === "object" && question.traceability
          ? question.traceability as Record<string, unknown>
          : {}),
        chapterPackageId: BLR_001_QUESTION_STUDIO_PACKAGE_ID,
        sourcePackageId: authority.sourcePackageId,
        sourceCheckpointId: authority.checkpointId,
        sourceQlId: authority.qlId,
      },
    });
  }

  return {
    questions,
    generationContext: {
      ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
      engineId: "reasoning-v1",
      packageId: BLR_001_QUESTION_STUDIO_PACKAGE_ID,
      chapterId: "BLR-001",
      language,
      requestedDifficulty: request.difficulty ?? "Mixed",
      seed: baseSeed,
      count,
      permanentQlRange: "BLR-QL-001..035",
      permanentQlCount: QL_AUTHORITIES.length,
      checkpointCount: CHECKPOINT_IDS.length,
      sourcePackageCount: SOURCE_PACKAGES.length,
      explicitScopeApplied: pool.length !== QL_AUTHORITIES.length,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
}
