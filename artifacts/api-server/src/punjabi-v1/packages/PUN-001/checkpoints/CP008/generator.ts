/**
 * CP008 Generator Engine & Checkpoint Definition:
 * Morphology, Prefixes & Suffixes (ਅਗੇਤਰ, ਪਿਛੇਤਰ ਅਤੇ ਸ਼ਬਦ-ਰਚਨਾ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import {
  generateCP008F01,
  generateCP008F02,
  generateCP008F03,
  generateCP008F04,
} from "./CP008-families";

export const PUN_001_CP008_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP008",
  packageId: "PUN-001",
  name: "Morphology, Prefixes & Suffixes",
  nameGurmukhi: "ਅਗੇਤਰ, ਪਿਛੇਤਰ ਅਤੇ ਸ਼ਬਦ-ਰਚਨਾ",
  description:
    "Productive derivational affixes (Prefixes: ਬੇ, ਨਿਰ, ਉਪ, ਅਣ, ਕੁ, ਸੁ / Suffixes: ਦਾਰ, ਵਾਨ, ਮੰਦ, ਆਊ, ਹਾਰ), pseudo-affix discrimination, and root word extraction.",
  families: [
    {
      familyId: "F01",
      name: "Prefix Identification",
      description: "Identification and formation of prefix-derived words.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP008F01,
    },
    {
      familyId: "F02",
      name: "Suffix Identification",
      description: "Identification and formation of suffix-derived words.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP008F02,
    },
    {
      familyId: "F03",
      name: "Pseudo-Affix Discrimination",
      description: "Distinguishing genuine derivational affixes from accidental phonetic root matches.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP008F03,
    },
    {
      familyId: "F04",
      name: "Root Word Extraction",
      description: "Morphological segmentation and extraction of authentic root base words.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP008F04,
    },
  ],
};

export function generateCP008Question(
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
      return generateCP008F01(seed, difficulty);
    case "F02":
      return generateCP008F02(seed, difficulty);
    case "F03":
      return generateCP008F03(seed, difficulty);
    case "F04":
      return generateCP008F04(seed, difficulty);
    default:
      throw new Error(`Unknown CP008 question family: '${familyId}'`);
  }
}

export function generateCP008ReviewBatch(
  count: number = 60,
  seedStart: number = 8000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP008Question(currentSeed++, "Easy"));
  }
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP008Question(currentSeed++, "Medium"));
  }
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP008Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP008-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP008",
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
