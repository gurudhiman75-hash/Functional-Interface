import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import { CP011_V2_FAMILY_GENERATORS, type CP011V2FamilyId } from "./CP011-v2-families";

const ELIGIBLE: Record<PunjabiDifficulty, readonly CP011V2FamilyId[]> = {
  Easy: ["F01", "F03"],
  Medium: ["F02", "F03", "F04", "F05", "F06"],
  Hard: ["F02", "F04", "F05", "F06", "F07", "F08"],
};

export const PUN_001_CP011_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP011",
  packageId: "PUN-001",
  name: "Idiomatic Mastery",
  nameGurmukhi: "ਮੁਹਾਵਰੇ - ਅਰਥ ਅਤੇ ਵਾਕ ਵਰਤੋਂ",
  description:
    "Canonical Punjabi idioms tested through direct meaning, authored context, semantic confusables, pair discrimination, and multi-item mapping.",
  families: [
    { familyId: "F01", name: "Direct Idiom Meaning", description: "Basic idiom-to-meaning recognition.", targetDifficulties: ["Easy"], generate: CP011_V2_FAMILY_GENERATORS.F01 },
    { familyId: "F02", name: "Authored Context to Idiom", description: "Choose the idiom that fits an authored context sentence.", targetDifficulties: ["Medium", "Hard"], generate: CP011_V2_FAMILY_GENERATORS.F02 },
    { familyId: "F03", name: "Meaning to Idiom", description: "Map a reviewed meaning to the correct idiom, with semantic peers at Medium.", targetDifficulties: ["Easy", "Medium"], generate: CP011_V2_FAMILY_GENERATORS.F03 },
    { familyId: "F04", name: "Figurative Precision", description: "Distinguish idiomatic and literal readings without English learner labels.", targetDifficulties: ["Medium", "Hard"], generate: CP011_V2_FAMILY_GENERATORS.F04 },
    { familyId: "F05", name: "Correct Idiom-Meaning Pair", description: "Identify the one correct pairing among semantically close alternatives.", targetDifficulties: ["Medium", "Hard"], generate: CP011_V2_FAMILY_GENERATORS.F05 },
    { familyId: "F06", name: "Incorrect Idiom-Meaning Pair", description: "Identify the one mismatched idiom and meaning.", targetDifficulties: ["Medium", "Hard"], generate: CP011_V2_FAMILY_GENERATORS.F06 },
    { familyId: "F07", name: "Two Meanings to Idioms", description: "Map two reviewed meanings to idioms in order.", targetDifficulties: ["Hard"], generate: CP011_V2_FAMILY_GENERATORS.F07 },
    { familyId: "F08", name: "Two Idioms to Meanings", description: "Map two idioms to their meanings in order.", targetDifficulties: ["Hard"], generate: CP011_V2_FAMILY_GENERATORS.F08 },
  ],
};

export function generateCP011Question(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium",
  requestedFamilyId?: string
): PunjabiGeneratedQuestion {
  const allowed = ELIGIBLE[difficulty];
  const familyId = (requestedFamilyId ?? createRng(seed).pickOne(allowed)) as CP011V2FamilyId;
  if (!allowed.includes(familyId)) {
    throw new Error(`CP011 family ${familyId} is not authorized for ${difficulty}`);
  }
  const generator = CP011_V2_FAMILY_GENERATORS[familyId];
  if (!generator) throw new Error(`Unknown CP011 question family: '${familyId}'`);
  return generator(seed, difficulty);
}

export function generateCP011ReviewBatch(
  count: number = 120,
  seedStart: number = 19000
): PunjabiReviewBatch {
  const questions: PunjabiGeneratedQuestion[] = [];
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;
  let currentSeed = seedStart;

  const addBlock = (difficulty: PunjabiDifficulty, amount: number) => {
    const families = ELIGIBLE[difficulty];
    for (let i = 0; i < amount; i++) {
      questions.push(generateCP011Question(currentSeed++, difficulty, families[i % families.length]));
    }
  };

  addBlock("Easy", easyCount);
  addBlock("Medium", mediumCount);
  addBlock("Hard", hardCount);

  return {
    batchId: `BATCH-CP011-V2-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP011",
    generatedAt: new Date().toISOString(),
    totalQuestions: questions.length,
    distribution: { easy: easyCount, medium: mediumCount, hard: hardCount },
    questions,
  };
}
