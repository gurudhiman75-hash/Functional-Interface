/**
 * CP002 Generator Engine & Checkpoint Definition:
 * Spelling Precision & Orthographic Diagnostics (ਸ਼ੁੱਧ-ਅਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import {
  generateCP002F01,
  generateCP002F02,
  generateCP002F03,
} from "./CP002-families";

export const PUN_001_CP002_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP002",
  packageId: "PUN-001",
  name: "Spelling Precision & Orthographic Diagnostics",
  nameGurmukhi: "ਸ਼ੁੱਧ-ਅਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ",
  description:
    "High-yield exam-tested orthographic contrasts: Sihari/Bihari, Aunkar/Dulankar, Ha-pairin tones, Tippi/Bindi, and Addak omission.",
  families: [
    {
      familyId: "F01",
      name: "Direct Orthographic Choice",
      description: "Identification of pure vs corrupt spellings in isolated sets.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP002F01,
    },
    {
      familyId: "F02",
      name: "In-Sentence Error Identification",
      description: "Locating and correcting misspelled words within natural sentence contexts.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP002F02,
    },
    {
      familyId: "F03",
      name: "Contextual Blank Fill",
      description: "Selecting standard orthographic forms to complete authentic sentences.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP002F03,
    },
  ],
};

export function generateCP002Question(
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
      return generateCP002F01(seed, difficulty);
    case "F02":
      return generateCP002F02(seed, difficulty);
    case "F03":
      return generateCP002F03(seed, difficulty);
    default:
      throw new Error(`Unknown CP002 question family: '${familyId}'`);
  }
}

export function generateCP002ReviewBatch(
  count: number = 60,
  seedStart: number = 2000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP002Question(currentSeed++, "Easy"));
  }
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP002Question(currentSeed++, "Medium"));
  }
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP002Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP002-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP002",
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
