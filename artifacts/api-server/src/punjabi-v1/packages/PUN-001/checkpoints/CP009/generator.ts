/**
 * PUN-001-CP009 V2 Generator
 * Synonyms & Antonyms (ਸਮਾਨਾਰਥਕ ਅਤੇ ਵਿਰੋਧੀ ਸ਼ਬਦ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import {
  CP009_V2_FAMILY_GENERATORS,
  type CP009V2FamilyId,
} from "./CP009-v2-families";
import { generateCP009V2F02Forward } from "./CP009-v2-f02";
import { generateCP009V21F07, generateCP009V21F08 } from "./CP009-v2-pair-families";

const FAMILY_GENERATORS = {
  ...CP009_V2_FAMILY_GENERATORS,
  F02: generateCP009V2F02Forward,
  F07: generateCP009V21F07,
  F08: generateCP009V21F08,
} as const;

const ELIGIBLE_BY_DIFFICULTY: Record<PunjabiDifficulty, readonly CP009V2FamilyId[]> = {
  Easy: ["F01", "F02", "F03", "F05"],
  Medium: ["F02", "F03", "F04", "F05", "F06", "F07", "F08"],
  Hard: ["F04", "F06", "F07", "F08"],
};

const TARGET_DIFFICULTIES: Record<CP009V2FamilyId, PunjabiDifficulty[]> = {
  F01: ["Easy"], F02: ["Easy", "Medium"], F03: ["Easy", "Medium"], F04: ["Medium", "Hard"],
  F05: ["Easy", "Medium"], F06: ["Medium", "Hard"], F07: ["Medium", "Hard"], F08: ["Medium", "Hard"],
};

export const PUN_001_CP009_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP009", packageId: "PUN-001", name: "Synonyms & Antonyms",
  nameGurmukhi: "ਸਮਾਨਾਰਥਕ ਅਤੇ ਵਿਰੋਧੀ ਸ਼ਬਦ",
  description: "Curated Punjabi synonym/antonym authority with direct recognition, relationship classification, lexical-set completion, correct-pair recognition and genuinely authored near-synonym contexts.",
  families: [
    { familyId: "F01", name: "Direct Synonym", description: "Basic direct synonym recognition; deliberately Easy only.", targetDifficulties: TARGET_DIFFICULTIES.F01, generate: FAMILY_GENERATORS.F01 },
    { familyId: "F02", name: "Direct Antonym", description: "Antonym recognition against source-side semantic confusables.", targetDifficulties: TARGET_DIFFICULTIES.F02, generate: FAMILY_GENERATORS.F02 },
    { familyId: "F03", name: "Meaning Relation", description: "Classify a reviewed word pair as synonym or antonym without synthetic sentence insertion.", targetDifficulties: TARGET_DIFFICULTIES.F03, generate: FAMILY_GENERATORS.F03 },
    { familyId: "F04", name: "Near-Synonym Context", description: "Choose the exact word demanded by an authored contextual distinction.", targetDifficulties: TARGET_DIFFICULTIES.F04, generate: FAMILY_GENERATORS.F04 },
    { familyId: "F05", name: "Not a Synonym", description: "Find the semantic outsider among genuine synonyms.", targetDifficulties: TARGET_DIFFICULTIES.F05, generate: FAMILY_GENERATORS.F05 },
    { familyId: "F06", name: "Complete the Synonym Set", description: "Complete a reviewed synonym set without mixing semantic poles.", targetDifficulties: TARGET_DIFFICULTIES.F06, generate: FAMILY_GENERATORS.F06 },
    { familyId: "F07", name: "Correct Synonym Pair", description: "Identify one genuine synonym pair among unique same-format false pairs.", targetDifficulties: TARGET_DIFFICULTIES.F07, generate: FAMILY_GENERATORS.F07 },
    { familyId: "F08", name: "Correct Antonym Pair", description: "Identify one genuine antonym pair among unique coherent same-format traps.", targetDifficulties: TARGET_DIFFICULTIES.F08, generate: FAMILY_GENERATORS.F08 },
  ],
};

export function generateCP009Question(seed: number, difficulty: PunjabiDifficulty = "Medium", requestedFamilyId?: string): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const eligible = ELIGIBLE_BY_DIFFICULTY[difficulty];
  const familyId = (requestedFamilyId ?? rng.pickOne(eligible)) as CP009V2FamilyId;
  if (!eligible.includes(familyId)) throw new Error(`CP009 V2 family ${familyId} is not authorized for ${difficulty} difficulty`);
  const generator = FAMILY_GENERATORS[familyId];
  if (!generator) throw new Error(`Unknown CP009 V2 family: '${requestedFamilyId}'`);
  return generator(seed, difficulty);
}

export function generateCP009ReviewBatch(count: number = 120, seedStart: number = 9000): PunjabiReviewBatch {
  if (!Number.isInteger(count) || count <= 0) throw new Error(`CP009 review count must be a positive integer; got ${count}`);
  const easyCount = Math.floor(count / 3), mediumCount = Math.floor(count / 3), hardCount = count - easyCount - mediumCount;
  const targets: Array<[PunjabiDifficulty, number]> = [["Easy", easyCount], ["Medium", mediumCount], ["Hard", hardCount]];
  const questions: PunjabiGeneratedQuestion[] = [];
  let currentSeed = seedStart;
  for (const [difficulty, targetCount] of targets) {
    const families = ELIGIBLE_BY_DIFFICULTY[difficulty];
    for (let index = 0; index < targetCount; index++) {
      questions.push(generateCP009Question(currentSeed++, difficulty, families[index % families.length]!));
    }
  }
  return {
    batchId: `BATCH-CP009-V2-${seedStart}-${count}`, packageId: "PUN-001", cpId: "PUN-001-CP009",
    generatedAt: new Date().toISOString(), totalQuestions: questions.length,
    distribution: { easy: easyCount, medium: mediumCount, hard: hardCount }, questions,
  };
}
