/**
 * CP009 Generator Engine & Checkpoint Definition:
 * Synonyms & Antonyms (ਸਮਾਨਾਰਥਕ ਅਤੇ ਵਿਰੋਧੀ ਸ਼ਬਦ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import { generateCP009F01, generateCP009F02, generateCP009F03, generateCP009F04 } from "./CP009-families";

export const PUN_001_CP009_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP009",
  packageId: "PUN-001",
  name: "Synonyms & Antonyms",
  nameGurmukhi: "ਸਮਾਨਾਰਥਕ ਅਤੇ ਵਿਰੋਧੀ ਸ਼ਬਦ",
  description:
    "Curated literary Punjabi synonyms and antonym pairs tagged by strict semantic sense to eliminate false cross-sense pairings, plus near-synonym discrimination.",
  families: [
    {
      familyId: "F01",
      name: "Synonym Resolution",
      description: "Direct identification of standard literary Punjabi synonyms.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP009F01,
    },
    {
      familyId: "F02",
      name: "Antonym Resolution",
      description: "Direct identification of standard literary Punjabi antonyms.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP009F02,
    },
    {
      familyId: "F03",
      name: "Contextual In-Sentence Evaluation",
      description: "Evaluation and replacement of synonyms and antonyms in authentic Punjabi sentences.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP009F03,
    },
    {
      familyId: "F04",
      name: "Near-Synonym Discrimination",
      description: "Fine semantic distinction and contextual disambiguation between close synonyms.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP009F04,
    },
  ],
};

export function generateCP009Question(
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
      return generateCP009F01(seed, difficulty);
    case "F02":
      return generateCP009F02(seed, difficulty);
    case "F03":
      return generateCP009F03(seed, difficulty);
    case "F04":
      return generateCP009F04(seed, difficulty);
    default:
      throw new Error(`Unknown CP009 question family: '${familyId}'`);
  }
}

export function generateCP009ReviewBatch(
  count: number = 60,
  seedStart: number = 9000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP009Question(currentSeed++, "Easy"));
  }
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP009Question(currentSeed++, "Medium"));
  }
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP009Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP009-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP009",
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
