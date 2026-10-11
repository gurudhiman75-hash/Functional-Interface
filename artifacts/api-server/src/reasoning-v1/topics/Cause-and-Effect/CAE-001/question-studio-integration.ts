import type {
  QuestionStudioGenerationRequest,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import { CAE_001_MANIFEST } from "./chapter-manifest";
import { CAE_001_PROJECTION_AUTHORITIES } from "./causal-world-authorities";
import { generateReviewedCaeQuestion } from "./reviewed-generator";
import {
  assertCaeGeneratedAnswerIntegrity,
  assertCaeQuestionStudioMappingIntegrity,
} from "./question-studio-post-closure-proof.ts";
import {
  CAE_001_CURRENT_QL_ALLOCATION_STATUS,
  CAE_001_HISTORICAL_SOURCE_QL_ALLOCATION_STATUS,
  CAE_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
} from "./post-closure-current-state.ts";
import { CAE_PROVISIONAL_QL_IDS, type CaeDifficulty, type CaeLocale } from "./types";

export const CAE001_STANDARD_QUESTION_STUDIO_PACKAGE_ID = "CAE-001" as const;

export const CAE001_STANDARD_QUESTION_STUDIO_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: CAE001_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Reasoning",
  topic: "Cause and Effect",
  subtopic: "Cause and Effect",
  label: "Reasoning · Cause and Effect · CAE-001",
  enabled: true,
  cpIds: CAE_001_MANIFEST.checkpoints
    .filter((entry) => entry.checkpointId !== "CAE-CP-010")
    .map((entry) => entry.checkpointId),
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
  lifecycleStage: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.stage,
  metadata: {
    permanentQlCount: CAE_PROVISIONAL_QL_IDS.length,
    qlIds: [...CAE_PROVISIONAL_QL_IDS],
    qlAllocationStatus: CAE_001_CURRENT_QL_ALLOCATION_STATUS,
    historicalSourceQlAllocationStatus: CAE_001_HISTORICAL_SOURCE_QL_ALLOCATION_STATUS,
    sourceAuthority: "CAE-001-SOURCE-SATURATED-CONTENT-FROZEN",
    postClosureMappingProofAuthority: CAE_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
    deterministicGeneration: true,
    graphFirstProjection: true,
    bankingProfileSelection: "FIVE_WAY_ONLY_FOR_CURRENT_SOURCE_PROVEN_QL001_QL002__OTHERWISE_FOUR_WAY",
    currentFiveWayQlIds: ["CAE-QL-001", "CAE-QL-002"],
    historicalProjectionFiveWayQlIds: CAE_001_PROJECTION_AUTHORITIES
      .filter((entry) => entry.examProfiles.includes("FIVE_WAY"))
      .map((entry) => entry.qlId),
  },
};

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function localeFor(language: string | undefined): CaeLocale {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

function difficultyLabel(value: CaeDifficulty): "Easy" | "Medium" | "Hard" {
  return value === "EASY" ? "Easy" : value === "HARD" ? "Hard" : "Medium";
}

function requestedDifficulty(value: unknown): CaeDifficulty | undefined {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "EASY";
  if (normalized === "medium" || normalized === "moderate") return "MEDIUM";
  if (normalized === "hard") return "HARD";
  throw new Error("CAE-001 difficulty must be Easy, Medium, Hard or Mixed.");
}

function requestedQlId(request: QuestionStudioGenerationRequest): (typeof CAE_PROVISIONAL_QL_IDS)[number] | undefined {
  const selector = String(
    request.canonicalProblemId
    ?? request.questionLanguageId
    ?? request.patternId
    ?? "",
  ).trim().toUpperCase();
  if (!selector || selector === CAE001_STANDARD_QUESTION_STUDIO_PACKAGE_ID) return undefined;
  const qlId = CAE_PROVISIONAL_QL_IDS.find((entry) => entry === selector);
  if (!qlId) throw new Error("Unknown CAE-001 selector " + selector);
  return qlId;
}

export function isCae001QuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === CAE001_STANDARD_QUESTION_STUDIO_PACKAGE_ID;
  const selector = String(
    request.canonicalProblemId
    ?? request.questionLanguageId
    ?? request.patternId
    ?? "",
  ).trim().toUpperCase();
  if (selector.startsWith("CAE-QL-")) return true;
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return topic === "cause and effect" || subtopic === "cause and effect";
}

const CAE001_CURRENT_FIVE_WAY_QL_IDS = new Set([
  "CAE-QL-001",
  "CAE-QL-002",
] as const);

function questionProfileFor(
  qlId: (typeof CAE_PROVISIONAL_QL_IDS)[number],
  banking: boolean,
): "FOUR_WAY" | "FIVE_WAY" {
  if (!banking) return "FOUR_WAY";
  const authority = CAE_001_PROJECTION_AUTHORITIES.find((entry) => entry.qlId === qlId);
  if (!authority) throw new Error(qlId + " has no CAE projection authority.");
  return CAE001_CURRENT_FIVE_WAY_QL_IDS.has(qlId as "CAE-QL-001" | "CAE-QL-002")
    && authority.examProfiles.includes("FIVE_WAY")
    ? "FIVE_WAY"
    : "FOUR_WAY";
}

function generateOne(input: {
  qlId: (typeof CAE_PROVISIONAL_QL_IDS)[number];
  locale: CaeLocale;
  baseSeed: number;
  targetDifficulty?: CaeDifficulty;
  banking: boolean;
}) {
  const questionProfile = questionProfileFor(input.qlId, input.banking);
  for (let offset = 0; offset < 256; offset += 1) {
    const seed = (input.baseSeed + offset) >>> 0;
    const generated = generateReviewedCaeQuestion({
      qlId: input.qlId,
      locale: input.locale,
      seed,
      questionProfile,
    });
    if (input.targetDifficulty && generated.difficulty !== input.targetDifficulty) continue;
    return generated;
  }
  throw new Error(
    input.qlId +
    " could not produce the requested difficulty inside the bounded CAE-001 search.",
  );
}

export async function generateCae001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
) {
  const language = request.language ?? "en";
  const locale = localeFor(language);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 5) || 5)));
  const targetDifficulty = requestedDifficulty(request.difficulty);
  const explicitQl = requestedQlId(request);
  const baseSeed = String(request.seed ?? "cae001-question-studio-v1");
  const banking = /bank|sbi|ibps|rrb|rbi/u.test(String(request.exam ?? "").toLowerCase());

  const questions = Array.from({ length: count }, (_, index) => {
    const generated = (() => {
      if (explicitQl) {
        return generateOne({
          qlId: explicitQl,
          locale,
          baseSeed: hashSeed(baseSeed + ":" + explicitQl + ":" + index),
          targetDifficulty,
          banking,
        });
      }

      const start = hashSeed(baseSeed + ":ql:" + index) % CAE_PROVISIONAL_QL_IDS.length;
      for (let qlOffset = 0; qlOffset < CAE_PROVISIONAL_QL_IDS.length; qlOffset += 1) {
        const qlId = CAE_PROVISIONAL_QL_IDS[(start + qlOffset) % CAE_PROVISIONAL_QL_IDS.length]!;
        try {
          return generateOne({
            qlId,
            locale,
            baseSeed: hashSeed(baseSeed + ":" + qlId + ":" + index),
            targetDifficulty,
            banking,
          });
        } catch {
          // Chapter-wide generation may skip a QL that has no instance in the requested difficulty band.
        }
      }
      throw new Error(
        "CAE-001 could not find any source-backed QL for the requested difficulty.",
      );
    })();
    assertCaeGeneratedAnswerIntegrity(generated);
    const difficulty = difficultyLabel(generated.difficulty);
    const options = [...generated.options];
    const answer = options[generated.correctIndex]!;
    const questionId = `CAE-001:${generated.qlId}:${generated.seed}:${language}`;

    const mapped = {
      ...QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
      id: questionId,
      questionId,
      packageId: CAE001_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
      patternId: generated.qlId,
      qlId: generated.qlId,
      cpId: generated.checkpointId,
      checkpointId: generated.checkpointId,
      subject: "Reasoning",
      topic: "Cause and Effect",
      subtopic: "Cause and Effect",
      language,
      locale,
      stem: generated.stem,
      text: generated.stem,
      options,
      correctIndex: generated.correctIndex,
      correct: generated.correctIndex,
      answer,
      canonicalAnswer: answer,
      explanation: generated.explanation,
      difficulty,
      difficultyLabel: difficulty,
      generationSeed: String(generated.seed),
      numericSeed: generated.seed,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      manualApprovalRequired: true,
      causalStateId: generated.causalStateId,
      itemVariantId: generated.itemVariantId,
      difficultyEvidence: generated.difficultyEvidence,
      traceability: {
        chapterId: "CAE-001",
        checkpointId: generated.checkpointId,
        qlId: generated.qlId,
        causalWorldId: generated.causalWorldId,
        scenarioFamilyId: generated.scenarioFamilyId,
        scenarioVariantId: generated.scenarioVariantId,
        causalStateId: generated.causalStateId,
        itemVariantId: generated.itemVariantId,
        solver: generated.metadata.solver,
      },
      answerId: generated.answerId,
      causalStructure: generated.causalStructure,
      causalTrace: [...generated.causalTrace],
      qlAllocationStatus: CAE_001_CURRENT_QL_ALLOCATION_STATUS,
      historicalSourceQlAllocationStatus: generated.metadata.qlAllocation,
      postClosureMappingProofAuthority: CAE_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
      postClosureMappingProofVerified: true as const,
    };
    assertCaeQuestionStudioMappingIntegrity(generated, mapped);
    return mapped;
  });

  return {
    questions,
    generationContext: {
      engineId: "reasoning-v1",
      packageId: CAE001_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
      language,
      requestedDifficulty: targetDifficulty ? difficultyLabel(targetDifficulty) : "Mixed",
      seed: baseSeed,
      count,
      runtimeMode: "review-only",
      qlAllocationStatus: CAE_001_CURRENT_QL_ALLOCATION_STATUS,
      historicalSourceQlAllocationStatus: CAE_001_HISTORICAL_SOURCE_QL_ALLOCATION_STATUS,
      postClosureMappingProofAuthority: CAE_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
      postClosureMappingProofVerified: true,
      reviewOnly: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
}
