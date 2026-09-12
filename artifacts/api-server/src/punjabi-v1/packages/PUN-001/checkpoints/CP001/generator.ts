/**
 * CP001 Generator Engine & Checkpoint Definition:
 * Gurmukhi Orthography, Lagaan & Lagakhars (ਗੁਰਮੁਖੀ ਲਿਪੀ, ਵਰਣਮਾਲਾ, ਲਗਾਂ-ਲਗਾਖਰ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import {
  generateCP001F01,
  generateCP001F02,
  generateCP001F03,
} from "./CP001-families";

export const PUN_001_CP001_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP001",
  packageId: "PUN-001",
  name: "Gurmukhi Orthography, Lagaan & Lagakhars",
  nameGurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ, ਵਰਣਮਾਲਾ, ਲਗਾਂ ਅਤੇ ਲਗਾਖਰ",
  description:
    "Comprehensive coverage of Gurmukhi script structure, 35+6 letters, 3 vowel carriers, 10 lagan, 3 lagakhars, and 3 dutt akkhars.",
  families: [
    {
      familyId: "F01",
      name: "Character Classification",
      description: "Identification of character classes, vargs, carriers, and nasal consonants.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP001F01,
    },
    {
      familyId: "F02",
      name: "Vowel Carrier & Lagan Rules",
      description: "Permissible and prohibited lagan attachments with ੳ, ਅ, and ੲ.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP001F02,
    },
    {
      familyId: "F03",
      name: "Lagakhar Distribution & Usage",
      description: "Distribution of Bindi, Tippi, and Addak across the 10 lagan.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP001F03,
    },
  ],
};

export function generateCP001Question(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium",
  requestedFamilyId?: string
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  let familyId = requestedFamilyId;
  if (!familyId) {
    const familyOptions = ["F01", "F02", "F03"];
    familyId = rng.pickOne(familyOptions);
  }

  switch (familyId) {
    case "F01":
      return generateCP001F01(seed, difficulty);
    case "F02":
      return generateCP001F02(seed, difficulty);
    case "F03":
      return generateCP001F03(seed, difficulty);
    default:
      throw new Error(`Unknown CP001 question family: '${familyId}'`);
  }
}

/**
 * Generates a balanced golden review batch of CP001 questions
 */
export function generateCP001ReviewBatch(
  count: number = 60,
  seedStart: number = 1000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  // Easy
  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP001Question(currentSeed++, "Easy"));
  }

  // Medium
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP001Question(currentSeed++, "Medium"));
  }

  // Hard
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP001Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP001-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP001",
    generatedAt: new Date().toISOString(),
    totalQuestions: questions.length,
    distribution: {
      easy: easyCount,
      medium: mediumCount,
      hard: hardCount,
    },
    questions,
  };
}
