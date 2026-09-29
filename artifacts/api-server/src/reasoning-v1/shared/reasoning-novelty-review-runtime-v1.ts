import {
  reasoningNoveltyProviderByIdV1,
  type ReasoningNoveltyProviderDescriptorV1,
} from "./reasoning-novelty-provider-registry-v1";

export const REASONING_V1_NOVELTY_REVIEW_RUNTIME_VERSION =
  "REASONING_V1_NOVELTY_REVIEW_RUNTIME_2026_09_26_V1" as const;

export type ReasoningNoveltyReviewLanguageV1 = "en" | "hi" | "pa";

export interface ReasoningNoveltyReviewRequestV1 {
  readonly providerId: string;
  readonly count?: number;
  readonly seed?: number;
  readonly language?: ReasoningNoveltyReviewLanguageV1;
}

export interface ReasoningNoveltyReviewResultV1 {
  readonly runtimeVersion: typeof REASONING_V1_NOVELTY_REVIEW_RUNTIME_VERSION;
  readonly provider: ReasoningNoveltyProviderDescriptorV1;
  readonly reviewOnly: true;
  readonly questionStudioNoveltyMixActivated: false;
  readonly count: number;
  readonly seed: number;
  readonly language: ReasoningNoveltyReviewLanguageV1;
  readonly candidates: readonly Record<string, unknown>[];
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 20) {
    throw new Error("Reasoning novelty review count must be an integer from 1 to 20.");
  }
  return value;
}

function normalizeSeed(value: number | undefined): number {
  const seed = value ?? 1;
  if (!Number.isSafeInteger(seed)) {
    throw new Error("Reasoning novelty review seed must be a safe integer.");
  }
  return seed;
}

function normalizeLanguage(
  provider: ReasoningNoveltyProviderDescriptorV1,
  value: ReasoningNoveltyReviewLanguageV1 | undefined,
): ReasoningNoveltyReviewLanguageV1 {
  const language = value ?? provider.supportedLanguages[0] ?? "en";
  if (!provider.supportedLanguages.includes(language)) {
    throw new Error(
      provider.providerId +
      " does not yet support novelty review language '" +
      language +
      "'.",
    );
  }
  return language;
}

async function oneCandidate(
  providerId: string,
  seed: number,
  language: ReasoningNoveltyReviewLanguageV1,
): Promise<Record<string, unknown>> {
  switch (providerId) {
    case "LP-001-POST-SOLUTION-SWAP": {
      const module = await import(
        "../topics/Logic-Puzzles/LP-001/lp-001-controlled-novelty-discovery-v1"
      );
      return module.generateLpControlledNovelPostSolutionSwapCandidateV1(seed) as unknown as Record<string, unknown>;
    }
    case "OPS-001-INFER-THEN-FILL": {
      const module = await import(
        "../topics/Mathematical-Operations/OPS-001/ops-001-controlled-novelty-discovery-v1"
      );
      return module.generateOpsControlledNovelInferThenFillCandidateV1(seed) as unknown as Record<string, unknown>;
    }
    case "RNK-001-CROSS-FAMILY-CASELET": {
      const module = await import(
        "../topics/Ranking-and-Order/RNK-001/rnk-001-controlled-novelty-discovery-v1"
      );
      return module.generateRnkControlledNovelCaseletV1(seed) as unknown as Record<string, unknown>;
    }
    case "CLK-001-FAULTY-TIME-ANGLE": {
      const module = await import(
        "../topics/Clocks/CLK-001/clk-001-controlled-novelty-discovery-v1"
      );
      return module.generateClockControlledNovelAngleCandidateV1(seed) as unknown as Record<string, unknown>;
    }
    case "CAE-001-EDGE-FAMILIES": {
      const module = await import(
        "../topics/Cause-and-Effect/CAE-001/cae-001-controlled-novelty-discovery-v1"
      );
      const qlId = seed % 2 === 0 ? "CAE-QL-008" : "CAE-QL-009";
      const locale = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
      return module.generateCaeControlledNovelCandidateV1({
        qlId,
        locale,
        seed,
      }) as unknown as Record<string, unknown>;
    }
    case "CAL-001-IMPLICIT-RANGE-FREQUENCY": {
      const module = await import(
        "../topics/Calendar/CAL-001/cal-001-controlled-novelty-discovery-v1"
      );
      return module.generateCalControlledNovelImplicitRangeFrequencyCandidateV1(seed) as unknown as Record<string, unknown>;
    }
    case "DIR-001-GRAPH-RELATIVE-PATH": {
      const module = await import(
        "../topics/Direction-Sense/DIR-001/dir-001-controlled-novelty-discovery-v1"
      );
      return module.generateDirControlledNovelGraphRelativePathCandidateV1(seed) as unknown as Record<string, unknown>;
    }
    case "BLR-001-CODED-FILTERED-COUNT": {
      const module = await import(
        "../topics/Blood-Relations/BLR-001/blr-001-controlled-novelty-discovery-v1"
      );
      return module.generateBlrControlledNovelCodedCountCandidateV1(seed) as unknown as Record<string, unknown>;
    }
    default:
      throw new Error(
        "Provider " +
        providerId +
        " is not a discovery-review generator in the shared novelty runtime.",
      );
  }
}

export async function generateReasoningNoveltyReviewBatchV1(
  request: ReasoningNoveltyReviewRequestV1,
): Promise<ReasoningNoveltyReviewResultV1> {
  const provider = reasoningNoveltyProviderByIdV1(request.providerId);
  if (provider.status !== "DISCOVERY_REVIEW_ONLY") {
    throw new Error(
      provider.providerId +
      " is already an approved runtime and is not served through the discovery-review sampler.",
    );
  }
  if (provider.questionStudioNoveltyMixActivated || !provider.humanReviewRequired) {
    throw new Error(
      provider.providerId +
      " violates the discovery-review activation boundary.",
    );
  }

  const count = normalizeCount(request.count);
  const seed = normalizeSeed(request.seed);
  const language = normalizeLanguage(provider, request.language);
  const candidates: Record<string, unknown>[] = [];

  for (let index = 0; index < count; index += 1) {
    const itemSeed = seed + index;
    const candidate = await oneCandidate(provider.providerId, itemSeed, language);
    if (candidate.provenance !== "CONTROLLED_NOVEL") {
      throw new Error(
        provider.providerId +
        " emitted a review candidate without CONTROLLED_NOVEL provenance.",
      );
    }
    if (candidate.humanReviewRequired !== true) {
      throw new Error(
        provider.providerId +
        " emitted a candidate outside the mandatory human-review boundary.",
      );
    }
    if (candidate.questionStudioNoveltyMixActivated === true) {
      throw new Error(
        provider.providerId +
        " emitted a candidate already activated for Question Studio novelty mixing.",
      );
    }
    candidates.push({
      ...candidate,
      noveltyReviewProviderId: provider.providerId,
      noveltyReviewRuntimeVersion: REASONING_V1_NOVELTY_REVIEW_RUNTIME_VERSION,
      reviewOnly: true,
      questionStudioNoveltyMixActivated: false,
    });
  }

  return {
    runtimeVersion: REASONING_V1_NOVELTY_REVIEW_RUNTIME_VERSION,
    provider,
    reviewOnly: true,
    questionStudioNoveltyMixActivated: false,
    count,
    seed,
    language,
    candidates,
  };
}
