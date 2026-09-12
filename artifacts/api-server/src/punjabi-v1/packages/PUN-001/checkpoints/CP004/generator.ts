/**
 * CP004 Generator Engine & Checkpoint Definition:
 * Gender & Number Systems (ਲਿੰਗ ਅਤੇ ਵਚਨ ਬਦਲੋ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import {
  generateCP004F01,
  generateCP004F02,
  generateCP004F03,
  generateCP004F04,
} from "./CP004-families";

export const PUN_001_CP004_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP004",
  packageId: "PUN-001",
  name: "Gender & Number Systems",
  nameGurmukhi: "ਲਿੰਗ ਅਤੇ ਵਚਨ ਬਦਲੋ",
  description:
    "Systematic gender (Masculine/Feminine) and number (Singular/Plural) inflections, subject-verb-object agreement, and oblique case forms.",
  families: [
    {
      familyId: "F01",
      name: "Gender Transformation",
      description: "Direct masculine to feminine and feminine to masculine transformations.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP004F01,
    },
    {
      familyId: "F02",
      name: "Number Transformation",
      description: "Singular to plural transformations including invariable masculine nouns.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP004F02,
    },
    {
      familyId: "F03",
      name: "Sentence-level Agreement Inflection",
      description: "Inflectional agreement across subject, direct object, and verbal complex.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP004F03,
    },
    {
      familyId: "F04",
      name: "Oblique Case Inflection & Agreement",
      description: "Direct vs oblique case transformations with postpositions and agreement.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP004F04,
    },
  ],
};

export function generateCP004Question(
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
      return generateCP004F01(seed, difficulty);
    case "F02":
      return generateCP004F02(seed, difficulty);
    case "F03":
      return generateCP004F03(seed, difficulty);
    case "F04":
      return generateCP004F04(seed, difficulty);
    default:
      throw new Error(`Unknown CP004 question family: '${familyId}'`);
  }
}

export function generateCP004ReviewBatch(
  count: number = 60,
  seedStart: number = 4000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP004Question(currentSeed++, "Easy"));
  }
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP004Question(currentSeed++, "Medium"));
  }
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP004Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP004-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP004",
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
