/**
 * CP003 Generator Engine & Checkpoint Definition:
 * Noun & Pronoun Grammar (ਨਾਂਵ ਅਤੇ ਪੜਨਾਂਵ ਪ੍ਰਣਾਲੀ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import { generateCP003F01, generateCP003F02, generateCP003F03, generateCP003F04 } from "./CP003-families";

export const PUN_001_CP003_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP003",
  packageId: "PUN-001",
  name: "Noun & Pronoun Grammar",
  nameGurmukhi: "ਨਾਂਵ ਅਤੇ ਪੜਨਾਂਵ ਪ੍ਰਣਾਲੀ",
  description:
    "7 Noun classes (Proper, Common, Collective, Material, Abstract, Liquid, Compound) and 6 Pronoun classes with case-inflection and collective noun formation.",
  families: [
    {
      familyId: "F01",
      name: "Nominal Subtype Classification",
      description: "Direct identification of noun and pronoun subcategories.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP003F01,
    },
    {
      familyId: "F02",
      name: "In-Sentence Functional Extraction",
      description: "Locating and classifying nominal tokens inside natural Punjabi sentences.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP003F02,
    },
    {
      familyId: "F03",
      name: "Pronoun Case-Inflection",
      description: "Identifying correct case forms of pronouns (nominative/accusative/genitive/ablative).",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP003F03,
    },
    {
      familyId: "F04",
      name: "Collective Noun Identification",
      description: "Matching individual members to their canonical collective noun.",
      targetDifficulties: ["Easy", "Medium", "Hard"],
      generate: generateCP003F04,
    },
  ],
};

export function generateCP003Question(
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
      return generateCP003F01(seed, difficulty);
    case "F02":
      return generateCP003F02(seed, difficulty);
    case "F03":
      return generateCP003F03(seed, difficulty);
    case "F04":
      return generateCP003F04(seed, difficulty);
    default:
      throw new Error(`Unknown CP003 question family: '${familyId}'`);
  }
}


export function generateCP003ReviewBatch(
  count: number = 60,
  seedStart: number = 3000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;

  let currentSeed = seedStart;

  for (let i = 0; i < easyCount; i++) {
    questions.push(generateCP003Question(currentSeed++, "Easy"));
  }
  for (let i = 0; i < mediumCount; i++) {
    questions.push(generateCP003Question(currentSeed++, "Medium"));
  }
  for (let i = 0; i < hardCount; i++) {
    questions.push(generateCP003Question(currentSeed++, "Hard"));
  }

  return {
    batchId: `BATCH-CP003-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP003",
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
