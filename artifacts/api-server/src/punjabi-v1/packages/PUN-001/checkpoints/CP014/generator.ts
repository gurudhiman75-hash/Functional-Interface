/**
 * CP014 Generator Engine & Checkpoint Definition:
 * Reading Comprehension & Translation (ਪਾਠ-ਬੋਧ ਅਤੇ ਅਨੁਵਾਦ / ਪ੍ਰਬੰਧਕੀ ਸ਼ਬਦਾਵਲੀ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import {
  generateCP014_F01,
  generateCP014_F02,
  generateCP014_F03,
  generateCP014_F04,
  generateCP014_F05,
} from "./CP014-families";

export const PUN_001_CP014_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP014",
  packageId: "PUN-001",
  name: "Reading Comprehension & Translation",
  nameGurmukhi: "ਪਾਠ-ਬੋਧ ਅਤੇ ਪ੍ਰਬੰਧਕੀ ਅਨੁਵਾਦ",
  description:
    "Textual comprehension, factual retrieval, title deduction, official English <-> Punjabi administrative terminology translation, and heading/summary matching.",
  families: [
    {
      familyId: "F01",
      name: "Passage Factual Retrieval",
      description: "Direct factual and detail extraction from authentic Punjabi reading passages.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP014_F01,
    },
    {
      familyId: "F02",
      name: "Passage Inferential & Title",
      description: "Inferential deduction, main idea understanding, and appropriate title selection.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP014_F02,
    },
    {
      familyId: "F03",
      name: "Administrative Translation",
      description: "Bidirectional translation of official, administrative, and governmental exam terminology.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP014_F03,
    },
    {
      familyId: "F04",
      name: "Contextual Administrative Usage",
      description: "Official notifications and departmental framing of administrative terms.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP014_F04,
    },
    {
      familyId: "F05",
      name: "Summary & Heading Matching",
      description: "Extracting the central theme, heading, or gist from complex Punjabi prose.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP014_F05,
    },
  ],
};

export function generateCP014Question(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium",
  requestedFamilyId?: string
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  let familyId = requestedFamilyId;
  if (!familyId) {
    const familyOptions = ["F01", "F02", "F03", "F04", "F05"];
    familyId = rng.pickOne(familyOptions);
  }

  switch (familyId) {
    case "F01":
      return generateCP014_F01(seed, difficulty);
    case "F02":
      return generateCP014_F02(seed, difficulty);
    case "F03":
      return generateCP014_F03(seed, difficulty);
    case "F04":
      return generateCP014_F04(seed, difficulty);
    case "F05":
      return generateCP014_F05(seed, difficulty);
    default:
      throw new Error(`Unknown CP014 question family: '${familyId}'`);
  }
}

export function generateCP014ReviewBatch(
  count: number = 60,
  seedStart: number = 14000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP014Question(currentSeed++, "Easy"));
  }
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP014Question(currentSeed++, "Medium"));
  }
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP014Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP014-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP014",
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
