/**
 * CP005 Generator Engine & Checkpoint Definition:
 * Adjectives & Adverbs (ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import { generateCP005F01, generateCP005F02 } from "./CP005-families";

export const PUN_001_CP005_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP005",
  packageId: "PUN-001",
  name: "Adjectives & Adverbs",
  nameGurmukhi: "ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ",
  description:
    "5 Adjective classes (Qualitative, Numeral, Quantitative, Demonstrative, Pronominal), 3 degrees of comparison, and 7 Adverb classes.",
  families: [
    {
      familyId: "F01",
      name: "Adjective Classification & Degrees",
      description: "Direct classification of adjective types and degrees of comparison.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP005F01,
    },
    {
      familyId: "F02",
      name: "Adverb Classification & Extraction",
      description: "Identification and categorization of adverbs in sentence contexts.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP005F02,
    },
  ],
};

export function generateCP005Question(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium",
  requestedFamilyId?: string
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  let familyId = requestedFamilyId;
  if (!familyId) {
    const familyOptions = ["F01", "F02"];
    familyId = rng.pickOne(familyOptions);
  }

  switch (familyId) {
    case "F01":
      return generateCP005F01(seed, difficulty);
    case "F02":
      return generateCP005F02(seed, difficulty);
    default:
      throw new Error(`Unknown CP005 question family: '${familyId}'`);
  }
}

export function generateCP005ReviewBatch(
  count: number = 60,
  seedStart: number = 5000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP005Question(currentSeed++, "Easy"));
  }
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP005Question(currentSeed++, "Medium"));
  }
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP005Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP005-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP005",
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
