import type { PunjabiCheckpointDefinition, PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiReviewBatch } from "../../../../core/types";
import { generateCP014V2Question, generateCP014V2ReviewBatch, PUN_001_CP014_V2_DEFINITION } from "./generator-v2";

export const PUN_001_CP014_DEFINITION: PunjabiCheckpointDefinition = PUN_001_CP014_V2_DEFINITION;

export function generateCP014Question(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium",
  requestedFamilyId?: string
): PunjabiGeneratedQuestion {
  return generateCP014V2Question(seed, difficulty, requestedFamilyId);
}

export function generateCP014ReviewBatch(
  count: number = 120,
  seedStart: number = 29200
): PunjabiReviewBatch {
  return generateCP014V2ReviewBatch(count, seedStart);
}
