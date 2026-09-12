/**
 * CP013 Generator Engine & Checkpoint Definition:
 * Syntax & Sentence Diagnostics (ਵਾਕ-ਵਟਾਂਦਰਾ, ਵਾਕ-ਵੰਡ ਅਤੇ ਸ਼ੁੱਧੀ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import {
  generateCP013_F01,
  generateCP013_F02,
  generateCP013_F03,
} from "./CP013-families";

export const PUN_001_CP013_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP013",
  packageId: "PUN-001",
  name: "Syntax & Sentence Diagnostics",
  nameGurmukhi: "ਵਾਕ-ਵਟਾਂਦਰਾ ਅਤੇ ਸ਼ੁੱਧੀ",
  description:
    "Sentence classification by structure and function, deterministic sentence transformation, and syntactic error correction.",
  families: [
    {
      familyId: "F01",
      name: "Sentence Classification",
      description: "Classification of sentences by structural types (Simple, Compound, Complex) and function.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP013_F01,
    },
    {
      familyId: "F02",
      name: "Sentence Transformation",
      description: "Transforming affirmative, negative, interrogative, simple, compound, and complex sentences without meaning shift.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP013_F02,
    },
    {
      familyId: "F03",
      name: "Sentence Correction",
      description: "Spotting and rectifying subject-verb agreement, case postposition, word order, and syntactic errors.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP013_F03,
    },
  ],
};

export function generateCP013Question(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium",
  requestedFamilyId?: string
): PunjabiGeneratedQuestion {
  const diffOffset = difficulty === "Easy" ? 11111 : difficulty === "Hard" ? 22222 : 0;
  const rng = createRng(seed + diffOffset);

  let familyId = requestedFamilyId;
  if (!familyId) {
    const familyOptions = ["F01", "F02", "F03"];
    familyId = rng.pickOne(familyOptions);
  }

  switch (familyId) {
    case "F01":
      return generateCP013_F01(seed, difficulty);
    case "F02":
      return generateCP013_F02(seed, difficulty);
    case "F03":
      return generateCP013_F03(seed, difficulty);
    default:
      throw new Error(`Unknown CP013 question family: '${familyId}'`);
  }
}

export function generateCP013ReviewBatch(
  count: number = 60,
  seedStart: number = 13000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP013Question(currentSeed++, "Easy"));
  }
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP013Question(currentSeed++, "Medium"));
  }
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP013Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP013-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP013",
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
