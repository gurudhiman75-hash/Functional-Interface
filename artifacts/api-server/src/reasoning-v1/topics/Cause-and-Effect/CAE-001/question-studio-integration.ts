import type {
  QuestionStudioGenerationRequest,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle";
import { CAE_001_MANIFEST } from "./chapter-manifest";
import { generateReviewedCaeQuestion } from "./reviewed-generator";
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
    sourceAuthority: "CAE-001-SOURCE-SATURATED-CONTENT-FROZEN",
    deterministicGeneration: true,
    graphFirstProjection: true,
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

function generateOne(input: {
  qlId: (typeof CAE_PROVISIONAL_QL_IDS)[number];
  locale: CaeLocale;
  baseSeed: number;
  targetDifficulty?: CaeDifficulty;
  banking: boolean;
}) {
  for (let offset = 0; offset < 256; offset += 1) {
    const seed = (input.baseSeed + offset) >>> 0;
    const generated = generateReviewedCaeQuestion({
      qlId: input.qlId,
      locale: input.locale,
      seed,
      questionProfile: input.banking ? "FIVE_WAY" : "FOUR_WAY",
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
    const difficulty = difficultyLabel(generated.difficulty);
    const options = [...generated.options];
    const answer = options[generated.correctIndex]!;
    const questionId = `CAE-001:${generated.qlId}:${generated.seed}:${language}`;

    return {
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
    };
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
