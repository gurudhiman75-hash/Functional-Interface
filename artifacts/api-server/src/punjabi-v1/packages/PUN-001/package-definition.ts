/**
 * PUN-001: Punjabi Language & Grammar (ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਅਤੇ ਵਿਆਕਰਣ)
 * Master Package Definition & Complete 14-Checkpoint Registry
 */

import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../core/types";
import {
  generateCP001Question,
  generateCP001ReviewBatch,
  PUN_001_CP001_DEFINITION,
} from "./checkpoints/CP001/generator";
import {
  generateCP002Question,
  generateCP002ReviewBatch,
  PUN_001_CP002_DEFINITION,
} from "./checkpoints/CP002/generator";
import {
  generateCP003Question,
  generateCP003ReviewBatch,
  PUN_001_CP003_DEFINITION,
} from "./checkpoints/CP003/generator";
import {
  generateCP004Question,
  generateCP004ReviewBatch,
  PUN_001_CP004_DEFINITION,
} from "./checkpoints/CP004/generator";
import {
  generateCP005Question,
  generateCP005ReviewBatch,
  PUN_001_CP005_DEFINITION,
} from "./checkpoints/CP005/generator";
import {
  generateCP006Question,
  generateCP006ReviewBatch,
  PUN_001_CP006_DEFINITION,
} from "./checkpoints/CP006/generator";
import {
  generateCP007Question,
  generateCP007ReviewBatch,
  PUN_001_CP007_DEFINITION,
} from "./checkpoints/CP007/generator";
import {
  generateCP008Question,
  generateCP008ReviewBatch,
  PUN_001_CP008_DEFINITION,
} from "./checkpoints/CP008/generator";
import {
  generateCP009Question,
  generateCP009ReviewBatch,
  PUN_001_CP009_DEFINITION,
} from "./checkpoints/CP009/generator";
import {
  generateCP010Question,
  generateCP010ReviewBatch,
  PUN_001_CP010_DEFINITION,
} from "./checkpoints/CP010/generator";
import {
  generateCP011Question,
  generateCP011ReviewBatch,
  PUN_001_CP011_DEFINITION,
} from "./checkpoints/CP011/generator";
import {
  generateCP012Question,
  generateCP012ReviewBatch,
  PUN_001_CP012_DEFINITION,
} from "./checkpoints/CP012/generator";
import {
  generateCP013Question,
  generateCP013ReviewBatch,
  PUN_001_CP013_DEFINITION,
} from "./checkpoints/CP013/generator";
import {
  generateCP014Question,
  generateCP014ReviewBatch,
  PUN_001_CP014_DEFINITION,
} from "./checkpoints/CP014/generator";

export const PUN_001_PACKAGE_ID = "PUN-001" as const;

export const PUN_001_CHECKPOINTS: readonly PunjabiCheckpointDefinition[] = [
  PUN_001_CP001_DEFINITION,
  PUN_001_CP002_DEFINITION,
  PUN_001_CP003_DEFINITION,
  PUN_001_CP004_DEFINITION,
  PUN_001_CP005_DEFINITION,
  PUN_001_CP006_DEFINITION,
  PUN_001_CP007_DEFINITION,
  PUN_001_CP008_DEFINITION,
  PUN_001_CP009_DEFINITION,
  PUN_001_CP010_DEFINITION,
  PUN_001_CP011_DEFINITION,
  PUN_001_CP012_DEFINITION,
  PUN_001_CP013_DEFINITION,
  PUN_001_CP014_DEFINITION,
];

export function listPUN001Checkpoints(): readonly PunjabiCheckpointDefinition[] {
  return PUN_001_CHECKPOINTS;
}

export function generatePUN001Question(
  cpId: string,
  seed: number,
  difficulty: PunjabiDifficulty = "Medium",
  familyId?: string
): PunjabiGeneratedQuestion {
  switch (cpId) {
    case "PUN-001-CP001":
      return generateCP001Question(seed, difficulty, familyId);
    case "PUN-001-CP002":
      return generateCP002Question(seed, difficulty, familyId);
    case "PUN-001-CP003":
      return generateCP003Question(seed, difficulty, familyId);
    case "PUN-001-CP004":
      return generateCP004Question(seed, difficulty, familyId);
    case "PUN-001-CP005":
      return generateCP005Question(seed, difficulty, familyId);
    case "PUN-001-CP006":
      return generateCP006Question(seed, difficulty, familyId);
    case "PUN-001-CP007":
      return generateCP007Question(seed, difficulty, familyId);
    case "PUN-001-CP008":
      return generateCP008Question(seed, difficulty, familyId);
    case "PUN-001-CP009":
      return generateCP009Question(seed, difficulty, familyId);
    case "PUN-001-CP010":
      return generateCP010Question(seed, difficulty, familyId);
    case "PUN-001-CP011":
      return generateCP011Question(seed, difficulty, familyId);
    case "PUN-001-CP012":
      return generateCP012Question(seed, difficulty, familyId);
    case "PUN-001-CP013":
      return generateCP013Question(seed, difficulty, familyId);
    case "PUN-001-CP014":
      return generateCP014Question(seed, difficulty, familyId);
    default:
      throw new Error(`Checkpoint '${cpId}' is not registered in package PUN-001`);
  }
}

export function generatePUN001ReviewBatch(
  cpId: string,
  count: number = 60,
  seedStart: number = 1000
): PunjabiReviewBatch {
  switch (cpId) {
    case "PUN-001-CP001":
      return generateCP001ReviewBatch(count, seedStart);
    case "PUN-001-CP002":
      return generateCP002ReviewBatch(count, seedStart);
    case "PUN-001-CP003":
      return generateCP003ReviewBatch(count, seedStart);
    case "PUN-001-CP004":
      return generateCP004ReviewBatch(count, seedStart);
    case "PUN-001-CP005":
      return generateCP005ReviewBatch(count, seedStart);
    case "PUN-001-CP006":
      return generateCP006ReviewBatch(count, seedStart);
    case "PUN-001-CP007":
      return generateCP007ReviewBatch(count, seedStart);
    case "PUN-001-CP008":
      return generateCP008ReviewBatch(count, seedStart);
    case "PUN-001-CP009":
      return generateCP009ReviewBatch(count, seedStart);
    case "PUN-001-CP010":
      return generateCP010ReviewBatch(count, seedStart);
    case "PUN-001-CP011":
      return generateCP011ReviewBatch(count, seedStart);
    case "PUN-001-CP012":
      return generateCP012ReviewBatch(count, seedStart);
    case "PUN-001-CP013":
      return generateCP013ReviewBatch(count, seedStart);
    case "PUN-001-CP014":
      return generateCP014ReviewBatch(count, seedStart);
    default:
      throw new Error(`Checkpoint '${cpId}' is not registered in package PUN-001`);
  }
}
