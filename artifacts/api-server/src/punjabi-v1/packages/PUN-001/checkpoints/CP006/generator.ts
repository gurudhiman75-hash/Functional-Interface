/**
 * CP006 Generator Engine & Checkpoint Definition:
 * Verbs, Tenses & Aspects (ਕਿਰਿਆ, ਕਾਲ ਅਤੇ ਰੂਪਾਂਤਰਣ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import { generateCP006F01, generateCP006F02 } from "./CP006-families";

export const PUN_001_CP006_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP006",
  packageId: "PUN-001",
  name: "Verbs, Tenses & Aspects",
  nameGurmukhi: "ਕਿਰਿਆ, ਕਾਲ ਅਤੇ ਰੂਪਾਂਤਰਣ",
  description:
    "Transitive (ਸਕਰਮਕ) and Intransitive (ਅਕਰਮਕ) verbs, auxiliary verbs, and Past/Present/Future tense transformations.",
  families: [
    {
      familyId: "F01",
      name: "Transitive vs Intransitive & Verb Structure",
      description: "Classifying verbal transitivity and auxiliary components.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP006F01,
    },
    {
      familyId: "F02",
      name: "Tense Identification & Shift",
      description: "Recognizing and transforming sentences between grammatical tenses.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP006F02,
    },
  ],
};

export function generateCP006Question(
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
      return generateCP006F01(seed, difficulty);
    case "F02":
      return generateCP006F02(seed, difficulty);
    default:
      throw new Error(`Unknown CP006 question family: '${familyId}'`);
  }
}

export function generateCP006ReviewBatch(
  count: number = 60,
  seedStart: number = 6000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP006Question(currentSeed++, "Easy"));
  }
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP006Question(currentSeed++, "Medium"));
  }
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP006Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP006-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP006",
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
