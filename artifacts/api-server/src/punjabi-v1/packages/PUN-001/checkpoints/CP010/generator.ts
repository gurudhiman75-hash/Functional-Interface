/**
 * CP010 Generator Engine & Checkpoint Definition:
 * One-Word Substitution & Lexical Precision (ਬਹੁਤੇ ਸ਼ਬਦਾਂ ਦੀ ਥਾਂ ਇੱਕ ਸ਼ਬਦ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import {
  generateCP010F01,
  generateCP010F02,
  generateCP010F03,
  generateCP010F04,
} from "./CP010-families";

export const PUN_001_CP010_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP010",
  packageId: "PUN-001",
  name: "One-Word Substitution & Lexical Precision",
  nameGurmukhi: "ਬਹੁਤੇ ਸ਼ਬਦਾਂ ਦੀ ਥਾਂ ਇੱਕ ਸ਼ਬਦ",
  description:
    "High-frequency canonical one-word substitutions testing belief, character, place, attribution, state, relation, time, and action terminology.",
  families: [
    {
      familyId: "F01",
      name: "Phrase to One-Word Substitution",
      description: "Selecting the precise Punjabi word for an extended description or phrase.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP010F01,
    },
    {
      familyId: "F02",
      name: "Word to Definitional Meaning",
      description: "Matching a concise lexical item with its formal grammatical definition.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP010F02,
    },
    {
      familyId: "F03",
      name: "Contextual Sentence Blank Fill",
      description: "Selecting the fitting one-word lexical item to complete an authentic sentence.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP010F03,
    },
    {
      familyId: "F04",
      name: "Negative Discrimination / Mismatched Pair Identification",
      description: "Identifying incorrectly matched phrase-to-word pairs under competitive exam conditions.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP010F04,
    },
  ],
};

export function generateCP010Question(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium",
  requestedFamilyId?: string
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  let familyId = requestedFamilyId;
  if (!familyId) {
    const familyOptions = ["F01", "F02", "F03", "F04"];
    familyId = rng.pickOne(familyOptions);
  }

  switch (familyId) {
    case "F01":
      return generateCP010F01(seed, difficulty);
    case "F02":
      return generateCP010F02(seed, difficulty);
    case "F03":
      return generateCP010F03(seed, difficulty);
    case "F04":
      return generateCP010F04(seed, difficulty);
    default:
      throw new Error(`Unknown CP010 question family: '${familyId}'`);
  }
}

export function generateCP010ReviewBatch(
  count: number = 60,
  seedStart: number = 10000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP010Question(currentSeed++, "Easy"));
  }
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP010Question(currentSeed++, "Medium"));
  }
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP010Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP010-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP010",
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
