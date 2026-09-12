/**
 * CP011 Generator Engine & Checkpoint Definition:
 * Idiomatic Mastery (ਮੁਹਾਵਰੇ - ਅਰਥ ਅਤੇ ਵਾਕ ਵਰਤੋਂ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import {
  generateCP011F01,
  generateCP011F02,
  generateCP011F03,
} from "./CP011-families";

export const PUN_001_CP011_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP011",
  packageId: "PUN-001",
  name: "Idiomatic Mastery",
  nameGurmukhi: "ਮੁਹਾਵਰੇ - ਅਰਥ ਅਤੇ ਵਾਕ ਵਰਤੋਂ",
  description:
    "Canonical Punjabi idioms with standard figurative meanings, contextual usage, and distractor traps.",
  families: [
    {
      familyId: "F01",
      name: "Idiom Meaning Resolution",
      description: "Direct identification of the authentic meaning of canonical Punjabi idioms.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP011F01,
    },
    {
      familyId: "F02",
      name: "Contextual Sentence Blank Completion",
      description: "Selecting the correct idiom to complete a situational sentence context.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP011F02,
    },
    {
      familyId: "F03",
      name: "Reverse Meaning / Scenario to Idiom",
      description: "Identifying the fitting idiom corresponding to a formal definition or real-life scenario.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP011F03,
    },
  ],
};

export function generateCP011Question(
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
      return generateCP011F01(seed, difficulty);
    case "F02":
      return generateCP011F02(seed, difficulty);
    case "F03":
      return generateCP011F03(seed, difficulty);
    default:
      throw new Error(`Unknown CP011 question family: '${familyId}'`);
  }
}

export function generateCP011ReviewBatch(
  count: number = 60,
  seedStart: number = 11000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP011Question(currentSeed++, "Easy"));
  }
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP011Question(currentSeed++, "Medium"));
  }
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP011Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP011-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP011",
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
