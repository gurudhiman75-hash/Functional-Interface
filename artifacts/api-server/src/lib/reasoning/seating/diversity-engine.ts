import type {
  ClueGraphAnalysis,
} from "./clue-graph";

type StructuralProfile = {
  topologySignature: string;
  clueSignature: string;
  inferenceSignature: string;
  topologyTokens: string[];
  clueTokens: string[];
  inferenceTokens: string[];
};

export type StructuralDiversityAnalysis =
  {
    topologyDiversityScore: number;
    clueDiversityScore: number;
    inferenceDiversityScore: number;
    structuralDiversityScore: number;
    maxTopologySimilarity: number;
    maxClueSimilarity: number;
    maxInferenceSimilarity: number;
    exactTopologyRepeatCount: number;
    exactClueRepeatCount: number;
    exactInferenceRepeatCount: number;
    repeatedAdjacencyChain: boolean;
    rejected: boolean;
    warnings: string[];
  };

const profileRegistry: StructuralProfile[] =
  [];
const topologyRegistry =
  new Map<string, number>();
const clueRegistry =
  new Map<string, number>();
const inferenceRegistry =
  new Map<string, number>();

function round(
  value: number,
  digits = 3,
) {
  return Number(
    value.toFixed(digits),
  );
}

function jaccardSimilarity(
  left: string[],
  right: string[],
) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const intersection =
    [...leftSet].filter((token) =>
      rightSet.has(token),
    ).length;
  const union = new Set([
    ...leftSet,
    ...rightSet,
  ]).size;

  if (union === 0) {
    return 0;
  }

  return intersection / union;
}

function maxSimilarity(
  target: string[],
  profiles: StructuralProfile[],
  selectTokens: (
    profile: StructuralProfile,
  ) => string[],
) {
  let best = 0;

  for (const profile of profiles) {
    best = Math.max(
      best,
      jaccardSimilarity(
        target,
        selectTokens(profile),
      ),
    );
  }

  return best;
}

function normalizeScore(
  similarity: number,
  repeats: number,
) {
  return round(
    Math.max(
      0.05,
      1 -
        similarity * 0.75 -
        Math.min(repeats, 5) * 0.08,
    ),
  );
}

function buildProfile(
  graph: ClueGraphAnalysis,
) : StructuralProfile {
  return {
    topologySignature:
      graph.topologySignature,
    clueSignature:
      graph.clueSignature,
    inferenceSignature:
      graph.inferenceSignature,
    topologyTokens:
      graph.topologyTokens,
    clueTokens:
      graph.clueTokens,
    inferenceTokens:
      graph.inferenceTokens,
  };
}

export function resetStructuralDiversityRegistry() {
  profileRegistry.length = 0;
  topologyRegistry.clear();
  clueRegistry.clear();
  inferenceRegistry.clear();
}

export function analyzeStructuralDiversity(
  graph: ClueGraphAnalysis,
) : StructuralDiversityAnalysis {
  const exactTopologyRepeatCount =
    topologyRegistry.get(
      graph.topologySignature,
    ) ?? 0;
  const exactClueRepeatCount =
    clueRegistry.get(
      graph.clueSignature,
    ) ?? 0;
  const exactInferenceRepeatCount =
    inferenceRegistry.get(
      graph.inferenceSignature,
    ) ?? 0;
  const maxTopologySimilarity =
    round(
      maxSimilarity(
        graph.topologyTokens,
        profileRegistry,
        (profile) =>
          profile.topologyTokens,
      ),
    );
  const maxClueSimilarity = round(
    maxSimilarity(
      graph.clueTokens,
      profileRegistry,
      (profile) =>
        profile.clueTokens,
    ),
  );
  const maxInferenceSimilarity =
    round(
      maxSimilarity(
        graph.inferenceTokens,
        profileRegistry,
        (profile) =>
          profile.inferenceTokens,
      ),
    );
  const topologyDiversityScore =
    normalizeScore(
      maxTopologySimilarity,
      exactTopologyRepeatCount,
    );
  const clueDiversityScore =
    normalizeScore(
      maxClueSimilarity,
      exactClueRepeatCount,
    );
  const inferenceDiversityScore =
    normalizeScore(
      maxInferenceSimilarity,
      exactInferenceRepeatCount,
    );
  const repeatedAdjacencyChain =
    graph.repeatedAdjacencySerialization;
  const structuralDiversityScore =
    round(
      topologyDiversityScore * 0.4 +
        clueDiversityScore * 0.3 +
        inferenceDiversityScore *
          0.3,
    );
  const warnings: string[] = [];

  if (exactTopologyRepeatCount >= 2) {
    warnings.push(
      `Topology signature repeated ${exactTopologyRepeatCount} times in this process.`,
    );
  }

  if (exactClueRepeatCount >= 2) {
    warnings.push(
      `Clue signature repeated ${exactClueRepeatCount} times in this process.`,
    );
  }

  if (exactInferenceRepeatCount >= 2) {
    warnings.push(
      `Inference signature repeated ${exactInferenceRepeatCount} times in this process.`,
    );
  }

  if (
    repeatedAdjacencyChain
  ) {
    warnings.push(
      "Adjacency-chain serialization pattern detected and penalized.",
    );
  }

  const rejected =
    repeatedAdjacencyChain ||
    structuralDiversityScore <
      0.32 ||
    maxTopologySimilarity >=
      0.92 ||
    maxClueSimilarity >= 0.95 ||
    maxInferenceSimilarity >=
      0.95;

  if (rejected) {
    warnings.push(
      "Structurally repetitive puzzle rejected by diversity analyzer.",
    );
  }

  return {
    topologyDiversityScore,
    clueDiversityScore,
    inferenceDiversityScore,
    structuralDiversityScore,
    maxTopologySimilarity,
    maxClueSimilarity,
    maxInferenceSimilarity,
    exactTopologyRepeatCount,
    exactClueRepeatCount,
    exactInferenceRepeatCount,
    repeatedAdjacencyChain,
    rejected,
    warnings,
  };
}

export function recordStructuralSignature(
  graph: ClueGraphAnalysis,
) {
  profileRegistry.push(
    buildProfile(graph),
  );
  topologyRegistry.set(
    graph.topologySignature,
    (topologyRegistry.get(
      graph.topologySignature,
    ) ?? 0) + 1,
  );
  clueRegistry.set(
    graph.clueSignature,
    (clueRegistry.get(
      graph.clueSignature,
    ) ?? 0) + 1,
  );
  inferenceRegistry.set(
    graph.inferenceSignature,
    (inferenceRegistry.get(
      graph.inferenceSignature,
    ) ?? 0) + 1,
  );
}

export function getStructuralDiversityScore(
  graph: ClueGraphAnalysis,
) {
  return analyzeStructuralDiversity(
    graph,
  ).structuralDiversityScore;
}

export function getRepeatedStructureWarnings(
  graph: ClueGraphAnalysis,
) {
  return analyzeStructuralDiversity(
    graph,
  ).warnings;
}
