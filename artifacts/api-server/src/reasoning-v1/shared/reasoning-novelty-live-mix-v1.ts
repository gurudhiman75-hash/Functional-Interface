import type {
  QuestionStudioGeneratedQuestion,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
} from "../../question-studio/engine-types";
import {
  buildReasoningNoveltyMixPlanV1,
  auditReasoningNoveltyMixV1,
} from "./reasoning-novelty-governance-v1";
import { reasoningNoveltyProviderByIdV1 } from "./reasoning-novelty-provider-registry-v1";
import { REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_V1 } from "./reasoning-novelty-human-content-review-v1";
import { generateOpsControlledNovelInferThenFillCandidateV1 } from "../topics/Mathematical-Operations/OPS-001/ops-001-controlled-novelty-discovery-v1";
import { generateDirControlledNovelGraphRelativePathCandidateV1 } from "../topics/Direction-Sense/DIR-001/dir-001-controlled-novelty-discovery-v1";
import { generateClockControlledNovelAngleCandidateV1 } from "../topics/Clocks/CLK-001/clk-001-controlled-novelty-discovery-v1";
import { generateAlpControlledNovelTransformedGapCandidateV1 } from "../topics/Alphabet-Test/ALP-001/alp-001-controlled-novelty-discovery-v1";
import { generateCalControlledNovelImplicitRangeFrequencyCandidateV1 } from "../topics/Calendar/CAL-001/cal-001-controlled-novelty-discovery-v1";
import { generateCaeControlledNovelCandidateV1 } from "../topics/Cause-and-Effect/CAE-001/cae-001-controlled-novelty-discovery-v1";
import { generateBlrControlledNovelCodedCountCandidateV1 } from "../topics/Blood-Relations/BLR-001/blr-001-controlled-novelty-discovery-v1";

export const REASONING_V1_LIVE_NOVELTY_MIX_VERSION =
  "REASONING_V1_LIVE_NOVELTY_MIX_2026_10_02_V1" as const;

type LiveActivation = Readonly<{
  packageId: "ALP-001" | "BLR-001" | "CAE-001" | "CAL-001" | "OPS-001" | "DIR-001" | "CLK-001";
  providerId:
    | "ALP-001-TRANSFORMED-GAP"
    | "BLR-001-CODED-FILTERED-COUNT"
    | "CAE-001-EDGE-FAMILIES"
    | "CAL-001-IMPLICIT-RANGE-FREQUENCY"
    | "OPS-001-INFER-THEN-FILL"
    | "DIR-001-GRAPH-RELATIVE-PATH"
    | "CLK-001-FAULTY-TIME-ANGLE";
  calibratedDifficulty: "Medium" | "Hard";
}>;

export const REASONING_V1_LIVE_NOVELTY_ACTIVATIONS: readonly LiveActivation[] = [
  {
    packageId: "BLR-001",
    providerId: "BLR-001-CODED-FILTERED-COUNT",
    calibratedDifficulty: "Medium",
  },
  {
    packageId: "CAE-001",
    providerId: "CAE-001-EDGE-FAMILIES",
    calibratedDifficulty: "Medium",
  },
  {
    packageId: "ALP-001",
    providerId: "ALP-001-TRANSFORMED-GAP",
    calibratedDifficulty: "Medium",
  },
  {
    packageId: "CAL-001",
    providerId: "CAL-001-IMPLICIT-RANGE-FREQUENCY",
    calibratedDifficulty: "Medium",
  },
  {
    packageId: "OPS-001",
    providerId: "OPS-001-INFER-THEN-FILL",
    calibratedDifficulty: "Hard",
  },
  {
    packageId: "DIR-001",
    providerId: "DIR-001-GRAPH-RELATIVE-PATH",
    calibratedDifficulty: "Medium",
  },
  {
    packageId: "CLK-001",
    providerId: "CLK-001-FAULTY-TIME-ANGLE",
    calibratedDifficulty: "Hard",
  },
] as const;

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

function requestedDifficulty(request: QuestionStudioGenerationRequest): "Easy" | "Medium" | "Hard" | null {
  const normalized = text(request.difficulty).toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  return null;
}

function hasExplicitSubchapterScope(request: QuestionStudioGenerationRequest): boolean {
  const packageId = text(request.packageId).toUpperCase();
  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);

  return selectors.some((selector) => selector !== packageId);
}

function activationFor(
  request: QuestionStudioGenerationRequest,
  result: QuestionStudioGenerationResult,
): LiveActivation | undefined {
  const contextPackage = text(result.generationContext?.packageId).toUpperCase();
  const requestPackage = text(request.packageId).toUpperCase();
  const packageId = requestPackage || contextPackage;
  return REASONING_V1_LIVE_NOVELTY_ACTIVATIONS.find(
    (entry) => entry.packageId === packageId,
  );
}

function candidateFor(providerId: LiveActivation["providerId"], seed: number) {
  if (providerId === "BLR-001-CODED-FILTERED-COUNT") {
    return generateBlrControlledNovelCodedCountCandidateV1(seed);
  }
  if (providerId === "CAE-001-EDGE-FAMILIES") {
    for (let offset = 0; offset < 64; offset += 1) {
      const qlId = ((seed + offset) & 1) === 0 ? "CAE-QL-008" : "CAE-QL-009";
      const candidate = generateCaeControlledNovelCandidateV1({
        qlId,
        locale: "en-IN",
        seed: seed + offset,
      });
      if (candidate.difficultyBand === "Medium") return candidate;
    }
    throw new Error("CAE-001 live novelty mixer could not find a Medium reviewed candidate.");
  }
  if (providerId === "ALP-001-TRANSFORMED-GAP") {
    return generateAlpControlledNovelTransformedGapCandidateV1(seed);
  }
  if (providerId === "CAL-001-IMPLICIT-RANGE-FREQUENCY") {
    return generateCalControlledNovelImplicitRangeFrequencyCandidateV1(seed);
  }
  if (providerId === "OPS-001-INFER-THEN-FILL") {
    return generateOpsControlledNovelInferThenFillCandidateV1(seed);
  }
  if (providerId === "DIR-001-GRAPH-RELATIVE-PATH") {
    return generateDirControlledNovelGraphRelativePathCandidateV1(seed);
  }
  return generateClockControlledNovelAngleCandidateV1(seed);
}

function learnerQuestion(candidate: Record<string, unknown>): string {
  const shared = text(candidate.sharedPrompt);
  const stem = text(candidate.stem);
  return [shared, stem].filter(Boolean).join("\n\n");
}

function activatedQuestion(input: {
  source: QuestionStudioGeneratedQuestion;
  activation: LiveActivation;
  seed: number;
  index: number;
}): QuestionStudioGeneratedQuestion {
  const candidate = candidateFor(input.activation.providerId, input.seed) as unknown as Record<string, unknown>;
  const options = Array.isArray(candidate.options)
    ? candidate.options.map((value) => String(value))
    : [];
  const correctIndex = Number(candidate.correctIndex);
  const answer = String(candidate.answer ?? options[correctIndex] ?? "");
  const questionId =
    input.activation.packageId +
    ":CONTROLLED-NOVEL:" +
    input.activation.providerId +
    ":" +
    String(candidate.candidateId ?? input.seed);

  return {
    ...input.source,
    id: questionId,
    questionId,
    patternId: input.activation.providerId,
    qlId: null,
    cpId: null,
    checkpointId: null,
    candidateId: candidate.candidateId,
    stem: learnerQuestion(candidate),
    text: learnerQuestion(candidate),
    options,
    correctIndex,
    correct: correctIndex,
    answer,
    canonicalAnswer: answer,
    explanation: String(candidate.explanation ?? ""),
    difficulty: input.activation.calibratedDifficulty,
    difficultyLabel: input.activation.calibratedDifficulty,
    provenance: "CONTROLLED_NOVEL",
    noveltyProviderId: input.activation.providerId,
    noveltyAxes: candidate.noveltyAxes,
    parentQlIds: candidate.parentQlIds,
    semanticFingerprint: candidate.semanticFingerprint,
    solverVerified: candidate.solverVerified === true,
    uniqueCorrectAnswer: candidate.uniqueCorrectAnswer === true,
    plausibleDistractors: candidate.plausibleDistractors === true,
    examNatural: candidate.examNatural === true,
    falseHistoricalAttribution: candidate.falseHistoricalAttribution === false,
    humanReviewCompleted: true,
    questionStudioNoveltyMixActivated: true,
    countsTowardAssemblyNoveltyNow: true,
    permanentQlAllocated: false,
    generationSeed: String(input.seed),
    numericSeed: input.seed,
    registrationStatus: "REGISTERED_CONTROLLED_NOVEL_RUNTIME",
    productionReleased: false,
    reviewOnly: true,
    readOnly: true,
    traceability: {
      ...(typeof input.source.traceability === "object" && input.source.traceability
        ? input.source.traceability as Record<string, unknown>
        : {}),
      noveltyMixVersion: REASONING_V1_LIVE_NOVELTY_MIX_VERSION,
      noveltyProviderId: input.activation.providerId,
      parentQlIds: candidate.parentQlIds,
      semanticFingerprint: candidate.semanticFingerprint,
      replacedSourceQlId: input.source.qlId ?? null,
      replacedSourceCpId: input.source.cpId ?? null,
      mixIndex: input.index,
    },
  };
}

export async function applyReasoningControlledNovelMixV1(
  request: QuestionStudioGenerationRequest,
  result: QuestionStudioGenerationResult,
): Promise<QuestionStudioGenerationResult> {
  const activation = activationFor(request, result);
  if (!activation) return result;

  const provider = reasoningNoveltyProviderByIdV1(activation.providerId);
  if (
    provider.status !== "APPROVED_RUNTIME"
    || provider.questionStudioNoveltyMixActivated !== true
    || provider.countsTowardAssemblyNoveltyNow !== true
    || provider.humanReviewRequired !== false
  ) {
    throw new Error(activation.providerId + " is not fully activated for live novelty mixing.");
  }

  const review = REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_V1.find(
    (entry) => entry.providerId === activation.providerId,
  );
  if (!review || review.verdict !== "CONTENT_REVIEW_PASS_AWAITING_ACTIVATION") {
    throw new Error(activation.providerId + " is missing the completed human content-review authority.");
  }

  const language = text(request.language || result.generationContext?.language || "en").toLowerCase();
  const difficulty = requestedDifficulty(request)
    ?? requestedDifficulty({ difficulty: result.generationContext?.requestedDifficulty as string });

  const blockedReason =
    language !== "en"
      ? "SUPPORTED_LANGUAGE_NOT_REVIEWED_FOR_NOVELTY"
      : hasExplicitSubchapterScope(request)
        ? "EXPLICIT_QL_OR_CP_SCOPE_PRESERVED"
        : difficulty !== activation.calibratedDifficulty
          ? "REQUESTED_DIFFICULTY_DOES_NOT_MATCH_NOVELTY_FAMILY_CALIBRATION"
          : null;

  if (blockedReason) {
    return {
      ...result,
      generationContext: {
        ...(result.generationContext ?? {}),
        noveltyMix: {
          version: REASONING_V1_LIVE_NOVELTY_MIX_VERSION,
          eligible: false,
          applied: false,
          providerId: activation.providerId,
          blockedReason,
          controlledNovelCount: 0,
          sourceBackedCount: result.questions.length,
        },
      },
    };
  }

  const baseSeed =
    text(request.seed)
    || text(result.generationContext?.seed)
    || activation.packageId.toLowerCase() + "-live-novelty-v1";
  const plan = buildReasoningNoveltyMixPlanV1({
    count: result.questions.length,
    seed: baseSeed + ":" + activation.providerId,
  });
  const questions = [...result.questions];
  const provenance: ("SOURCE_BACKED_VARIANT" | "CONTROLLED_NOVEL")[] = [];

  for (let index = 0; index < questions.length; index += 1) {
    if (plan[index] === "CONTROLLED_NOVEL") {
      const seed = hash(baseSeed + ":" + activation.providerId + ":" + index);
      questions[index] = activatedQuestion({
        source: questions[index]!,
        activation,
        seed,
        index,
      });
      provenance.push("CONTROLLED_NOVEL");
    } else {
      provenance.push("SOURCE_BACKED_VARIANT");
    }
  }

  const audit = auditReasoningNoveltyMixV1(provenance);
  if (!audit.withinOperatingBand) {
    throw new Error(
      activation.providerId +
      " produced a live novelty share outside the governed operating band.",
    );
  }

  return {
    ...result,
    questions,
    generationContext: {
      ...(result.generationContext ?? {}),
      noveltyMix: {
        version: REASONING_V1_LIVE_NOVELTY_MIX_VERSION,
        eligible: true,
        applied: audit.controlledNovelCount > 0,
        providerId: activation.providerId,
        operatingTarget: audit.operatingTarget,
        controlledNovelCount: audit.controlledNovelCount,
        sourceBackedCount: audit.sourceBackedCount,
        controlledNovelShare: audit.controlledNovelShare,
        withinOperatingBand: audit.withinOperatingBand,
        calibratedDifficulty: activation.calibratedDifficulty,
        language: "en",
        explicitScopeProtected: true,
      },
    },
  };
}
