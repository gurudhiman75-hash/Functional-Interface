export type Sea001DifficultyBand = "EASY" | "MEDIUM" | "HARD";

export interface Sea001DifficultyInput {
  checkpointId: "SEA-CP-001" | "SEA-CP-002" | "SEA-CP-003" | "SEA-CP-004" | "SEA-CP-005";
  queryContractId: string;
  seatCount: number;
  clueCount: number;
  checkpointSkillCoverage: readonly string[];
  answerType: string;
}

export interface Sea001DifficultyAssessmentV1 {
  authority: "SEA_001_STRUCTURAL_DIFFICULTY_V1";
  band: Sea001DifficultyBand;
  score: number;
  featureVector: Readonly<{
    topologyLayer: number;
    facingLayer: number;
    queryLayer: number;
    inferenceLayer: number;
    clueInteractionLayer: number;
    counterfactualLayer: number;
  }>;
  reasons: readonly string[];
}

function topologyLayer(checkpointId: Sea001DifficultyInput["checkpointId"]): number {
  if (checkpointId === "SEA-CP-001") return 0;
  if (checkpointId === "SEA-CP-002") return 1;
  if (checkpointId === "SEA-CP-003" || checkpointId === "SEA-CP-004") return 1;
  return 2;
}

function facingLayer(input: Sea001DifficultyInput): number {
  const skills = new Set(input.checkpointSkillCoverage);
  if (skills.has("CONDITIONAL_ORIENTATION")) return 2;
  if (skills.has("INFERRED_FACING")) return 2;
  if (input.checkpointId === "SEA-CP-002" || input.checkpointId === "SEA-CP-004" || input.checkpointId === "SEA-CP-005") return 1;
  return 0;
}

function queryLayer(queryContractId: string, answerType: string): number {
  if (queryContractId === "SEA-QC-001" || queryContractId === "SEA-QC-006" || queryContractId === "SEA-QC-010") return 0;
  if (queryContractId === "SEA-QC-003" || queryContractId === "SEA-QC-005" || queryContractId === "SEA-QC-008") return 1;
  if (queryContractId === "SEA-QC-009" || queryContractId === "SEA-QC-020") return 2;
  if (queryContractId === "SEA-QC-022") return 2;
  return answerType === "SEQUENCE" ? 2 : 1;
}

function inferenceLayer(input: Sea001DifficultyInput): number {
  const skills = new Set(input.checkpointSkillCoverage);
  let value = 0;
  if (skills.has("INFERRED_FACING")) value += 1;
  if (skills.has("CONDITIONAL_ORIENTATION")) value += 1;
  if (skills.has("ROTATION_CANONICALISATION")) value += 1;
  if (skills.has("DIRECTIONAL_ARC_COUNT")) value += 1;
  return Math.min(2, value);
}

function clueInteractionLayer(input: Sea001DifficultyInput): number {
  // Clue count is only a bounded secondary feature; it can never make a question hard by itself.
  if (input.clueCount >= 8) return 1;
  return 0;
}

export function assessSea001DifficultyV1(
  input: Sea001DifficultyInput,
): Sea001DifficultyAssessmentV1 {
  const counterfactualLayer = input.queryContractId === "SEA-QC-022" ? 2 : 0;
  const features = {
    topologyLayer: topologyLayer(input.checkpointId),
    facingLayer: facingLayer(input),
    queryLayer: queryLayer(input.queryContractId, input.answerType),
    inferenceLayer: inferenceLayer(input),
    clueInteractionLayer: clueInteractionLayer(input),
    counterfactualLayer,
  } as const;
  const score = Object.values(features).reduce((sum, value) => sum + value, 0);
  const band: Sea001DifficultyBand = score <= 2 ? "EASY" : score <= 5 ? "MEDIUM" : "HARD";
  const reasons: string[] = [];
  if (features.topologyLayer > 0) reasons.push("topology requires circular or mixed-facing interpretation");
  if (features.facingLayer > 0) reasons.push("left/right depends on facing state");
  if (features.queryLayer > 0) reasons.push("query requires multi-step or directional reading");
  if (features.inferenceLayer > 0) reasons.push("facing/symmetry/arc information must be inferred or combined");
  if (features.clueInteractionLayer > 0) reasons.push("several clues interact before the query can be read");
  if (features.counterfactualLayer > 0) reasons.push("the learner must transform the facing state before answering");
  if (!reasons.length) reasons.push("direct read from a uniquely solved basic arrangement");

  return Object.freeze({
    authority: "SEA_001_STRUCTURAL_DIFFICULTY_V1",
    band,
    score,
    featureVector: Object.freeze(features),
    reasons: Object.freeze(reasons),
  });
}

export const SEA_001_STRUCTURAL_DIFFICULTY_V1 = Object.freeze({
  authorityId: "SEA_001_STRUCTURAL_DIFFICULTY_V1",
  status: "STRUCTURAL_AUDIT_DIFFICULTY_NOT_LEARNER_CALIBRATED",
  usesSeed: false,
  magnitudePrimaryDriver: false,
  seatCountPrimaryDriver: false,
  learnerAccuracyCalibrationRequiredForProductionBands: true,
});
