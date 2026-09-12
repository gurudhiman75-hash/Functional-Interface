/**
 * CP012 Generator Engine & Checkpoint Definition:
 * Proverbs & Pragmatics (ਅਖਾਣ / ਕਹਾਵਤਾਂ - ਅਰਥ ਅਤੇ ਢੁਕਵਾਂ ਪ੍ਰਸੰਗ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import {
  generateCP012F01,
  generateCP012F02,
  generateCP012F03,
} from "./CP012-families";

export const PUN_001_CP012_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP012",
  packageId: "PUN-001",
  name: "Proverbs & Pragmatics",
  nameGurmukhi: "ਅਖਾਣ / ਕਹਾਵਤਾਂ",
  description:
    "Canonical Punjabi proverbs, their situational contexts, moral lessons, and phrase completions.",
  families: [
    {
      familyId: "F01",
      name: "Proverb Meaning / Lesson",
      description: "Identification of the figurative and moral meaning of Punjabi proverbs.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP012F01,
    },
    {
      familyId: "F02",
      name: "Proverb Completion",
      description: "Supplying the second hemistich or authentic ending to complete the proverb.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP012F02,
    },
    {
      familyId: "F03",
      name: "Situational Proverb Application",
      description: "Selecting the most appropriate proverb to describe a given real-life situation.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP012F03,
    },
  ],
};

export function generateCP012Question(
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
      return generateCP012F01(seed, difficulty);
    case "F02":
      return generateCP012F02(seed, difficulty);
    case "F03":
      return generateCP012F03(seed, difficulty);
    default:
      throw new Error(`Unknown CP012 question family: '${familyId}'`);
  }
}

export function generateCP012ReviewBatch(
  count: number = 60,
  seedStart: number = 12000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP012Question(currentSeed++, "Easy"));
  }
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP012Question(currentSeed++, "Medium"));
  }
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP012Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP012-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP012",
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
