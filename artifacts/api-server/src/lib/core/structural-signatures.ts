import type {
  ExtractedPatternIntelligence,
} from "./pattern-extractors";
import type {
  Scenario,
} from "./domain-adapters";

export type StructuralSignature = {
  domain: string;
  topologyHash: string;
  inferenceHash: string;
  motifHash: string;
  distractorHash: string;
};

export type StructuralDuplicateAnalysis = {
  exactDuplicate: boolean;
  nearDuplicate: boolean;
  repeatedInferencePattern: boolean;
  repeatedDistractorStructure: boolean;
  similarityScore: number;
};

function normalizeText(
  value: string,
) {
  return value
    .toLowerCase()
    .replace(/\d+/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

function hashText(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `sig_${(hash >>> 0).toString(16)}`;
}

function buildTokenSetSimilarity(
  left: string[],
  right: string[],
) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const union = new Set([
    ...leftSet,
    ...rightSet,
  ]);

  if (!union.size) {
    return 1;
  }

  let intersection = 0;

  for (const token of leftSet) {
    if (rightSet.has(token)) {
      intersection += 1;
    }
  }

  return intersection / union.size;
}

function buildTopologyTokens(
  scenario: Scenario,
  extracted?: ExtractedPatternIntelligence,
) {
  if (extracted?.structure.structureTokens?.length) {
    return [
      `domain:${extracted.domain}`,
      `subtype:${extracted.structure.subtype}`,
      ...extracted.structure.structureTokens,
    ].map(normalizeText);
  }

  return [
    `domain:${scenario.domain}`,
    `subtype:${scenario.subtype}`,
    `entities:${scenario.entities.length}`,
    `constraints:${scenario.constraints.length}`,
    ...scenario.constraints.map(
      (constraint) =>
        `constraint:${constraint.type}`,
    ),
  ].map(normalizeText);
}

function buildInferenceTokens(
  scenario: Scenario,
  extracted?: ExtractedPatternIntelligence,
) {
  const difficulty = extracted?.difficulty;

  return [
    `inference:${difficulty?.inferenceDepth ?? scenario.difficulty.inferenceDepth ?? 0}`,
    `cognitive:${difficulty?.cognitiveLoad ?? scenario.difficulty.metrics.cognitiveLoadBase ?? 0}`,
    `ambiguity:${difficulty?.ambiguityScore ?? scenario.difficulty.metrics.ambiguityScoreBase ?? 0}`,
    ...scenario.constraints.map(
      (constraint) =>
        `expr:${normalizeText(
          constraint.expression ??
            constraint.type,
        )}`,
    ),
  ];
}

function buildMotifTokens(
  extracted?: ExtractedPatternIntelligence,
) {
  return (
    extracted?.motifs.map(
      (motif) =>
        `${motif.domain}:${motif.archetype}:${motif.motifId}`,
    ) ?? ["motif:none"]
  ).map(normalizeText);
}

function buildDistractorTokens(
  extracted?: ExtractedPatternIntelligence,
) {
  return (
    extracted?.distractors.map(
      (distractor) =>
        `${distractor.type}:${distractor.frequency}`,
    ) ?? ["distractor:none"]
  ).map(normalizeText);
}

export function buildStructuralSignature(
  scenario: Scenario,
  extracted?: ExtractedPatternIntelligence,
) : StructuralSignature {
  const topologyTokens =
    buildTopologyTokens(
      scenario,
      extracted,
    );
  const inferenceTokens =
    buildInferenceTokens(
      scenario,
      extracted,
    );
  const motifTokens =
    buildMotifTokens(extracted);
  const distractorTokens =
    buildDistractorTokens(extracted);

  return {
    domain: scenario.domain,
    topologyHash: hashText(
      topologyTokens.sort().join("|"),
    ),
    inferenceHash: hashText(
      inferenceTokens.sort().join("|"),
    ),
    motifHash: hashText(
      motifTokens.sort().join("|"),
    ),
    distractorHash: hashText(
      distractorTokens.sort().join("|"),
    ),
  };
}

export function analyzeStructuralDuplicate(
  left: {
    scenario: Scenario;
    extracted?: ExtractedPatternIntelligence;
    signature?: StructuralSignature;
  },
  right: {
    scenario: Scenario;
    extracted?: ExtractedPatternIntelligence;
    signature?: StructuralSignature;
  },
) : StructuralDuplicateAnalysis {
  const leftSignature =
    left.signature ??
    buildStructuralSignature(
      left.scenario,
      left.extracted,
    );
  const rightSignature =
    right.signature ??
    buildStructuralSignature(
      right.scenario,
      right.extracted,
    );
  const topologySimilarity =
    buildTokenSetSimilarity(
      buildTopologyTokens(
        left.scenario,
        left.extracted,
      ),
      buildTopologyTokens(
        right.scenario,
        right.extracted,
      ),
    );
  const inferenceSimilarity =
    buildTokenSetSimilarity(
      buildInferenceTokens(
        left.scenario,
        left.extracted,
      ),
      buildInferenceTokens(
        right.scenario,
        right.extracted,
      ),
    );
  const distractorSimilarity =
    buildTokenSetSimilarity(
      buildDistractorTokens(
        left.extracted,
      ),
      buildDistractorTokens(
        right.extracted,
      ),
    );
  const motifSimilarity =
    buildTokenSetSimilarity(
      buildMotifTokens(
        left.extracted,
      ),
      buildMotifTokens(
        right.extracted,
      ),
    );
  const similarityScore =
    Number(
      (
        topologySimilarity * 0.35 +
        inferenceSimilarity * 0.35 +
        distractorSimilarity * 0.15 +
        motifSimilarity * 0.15
      ).toFixed(3),
    );
  const exactDuplicate =
    leftSignature.topologyHash ===
      rightSignature.topologyHash &&
    leftSignature.inferenceHash ===
      rightSignature.inferenceHash &&
    leftSignature.motifHash ===
      rightSignature.motifHash &&
    leftSignature.distractorHash ===
      rightSignature.distractorHash;

  return {
    exactDuplicate,
    nearDuplicate:
      !exactDuplicate &&
      similarityScore >= 0.84,
    repeatedInferencePattern:
      leftSignature.inferenceHash ===
        rightSignature.inferenceHash ||
      inferenceSimilarity >= 0.9,
    repeatedDistractorStructure:
      leftSignature.distractorHash ===
        rightSignature.distractorHash ||
      distractorSimilarity >= 0.9,
    similarityScore,
  };
}
