/**
 * CP007 Generator Engine & Checkpoint Definition:
 * Case, Postpositions, Conjunctions & Interjections (ਕਾਰਕ, ਸੰਬੰਧਕ, ਯੋਜਕ, ਵਿਸਮਿਕ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import {
  generateCP007F01,
  generateCP007F02,
  generateCP007F03,
  generateCP007F04,
} from "./CP007-families";

export const PUN_001_CP007_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP007",
  packageId: "PUN-001",
  name: "Case, Postpositions & Connectors",
  nameGurmukhi: "ਕਾਰਕ, ਸੰਬੰਧਕ, ਯੋਜਕ, ਵਿਸਮਿਕ",
  description:
    "8 Grammatical Karaks, Puran/Apuran postpositions, Saman/Adheen conjunctions, and expressive interjections.",
  families: [
    {
      familyId: "F01",
      name: "Karak Identification",
      description: "Classifying the 8 grammatical cases and identifying in-sentence case markers.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP007F01,
    },
    {
      familyId: "F02",
      name: "Connectors & Interjections",
      description: "Categorizing postpositions, conjunctions, and emotive interjections.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP007F02,
    },
    {
      familyId: "F03",
      name: "Case Marker Blank Fill",
      description: "Selecting the appropriate case marker or postposition to complete sentences in context.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP007F03,
    },
    {
      familyId: "F04",
      name: "Conjunction Classification & Clause Structure",
      description: "Coordinating vs subordinating conjunction classification, subtypes, and clause joining.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP007F04,
    },
  ],
};

export function generateCP007Question(
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
      return generateCP007F01(seed, difficulty);
    case "F02":
      return generateCP007F02(seed, difficulty);
    case "F03":
      return generateCP007F03(seed, difficulty);
    case "F04":
      return generateCP007F04(seed, difficulty);
    default:
      throw new Error(`Unknown CP007 question family: '${familyId}'`);
  }
}

export function generateCP007ReviewBatch(
  count: number = 60,
  seedStart: number = 7000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP007Question(currentSeed++, "Easy"));
  }
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP007Question(currentSeed++, "Medium"));
  }
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP007Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP007-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP007",
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
