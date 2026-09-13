/**
 * PUN-001-CP010 V2 Generator
 * One-Word Substitution & Lexical Precision
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import {
  CP010_V2_FAMILY_GENERATORS,
  type CP010V2FamilyId,
} from "./CP010-v2-families";

const ELIGIBLE_BY_DIFFICULTY: Record<PunjabiDifficulty, readonly CP010V2FamilyId[]> = {
  Easy: ["F01", "F02"],
  Medium: ["F02", "F03", "F04", "F05"],
  Hard: ["F03", "F04", "F05", "F06", "F07", "F08"],
};

const TARGET_DIFFICULTIES: Record<CP010V2FamilyId, PunjabiDifficulty[]> = {
  F01: ["Easy"],
  F02: ["Easy", "Medium"],
  F03: ["Medium", "Hard"],
  F04: ["Medium", "Hard"],
  F05: ["Medium", "Hard"],
  F06: ["Hard"],
  F07: ["Hard"],
  F08: ["Hard"],
};

export const PUN_001_CP010_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP010",
  packageId: "PUN-001",
  name: "One-Word Substitution & Lexical Precision",
  nameGurmukhi: "ਬਹੁਤੇ ਸ਼ਬਦਾਂ ਦੀ ਥਾਂ ਇੱਕ ਸ਼ਬਦ",
  description:
    "Governed one-word substitution with direct recognition, reverse definition matching, same-domain discrimination, mapping checks and ordered dual-item precision.",
  families: [
    { familyId: "F01", name: "Direct Phrase to Word", description: "Basic phrase-to-word recognition; Easy only.", targetDifficulties: TARGET_DIFFICULTIES.F01, generate: CP010_V2_FAMILY_GENERATORS.F01 },
    { familyId: "F02", name: "Word to Definition", description: "Reverse recognition; Medium uses same-domain phrase confusables.", targetDifficulties: TARGET_DIFFICULTIES.F02, generate: CP010_V2_FAMILY_GENERATORS.F02 },
    { familyId: "F03", name: "Same-Domain Phrase Precision", description: "Choose the exact one-word form among semantically adjacent records.", targetDifficulties: TARGET_DIFFICULTIES.F03, generate: CP010_V2_FAMILY_GENERATORS.F03 },
    { familyId: "F04", name: "Incorrect Mapping", description: "Identify the incorrect phrase-word mapping without option-analysis filler.", targetDifficulties: TARGET_DIFFICULTIES.F04, generate: CP010_V2_FAMILY_GENERATORS.F04 },
    { familyId: "F05", name: "Correct Mapping", description: "Identify the single correct phrase-word mapping among same-domain false pairs.", targetDifficulties: TARGET_DIFFICULTIES.F05, generate: CP010_V2_FAMILY_GENERATORS.F05 },
    { familyId: "F06", name: "Ordered Two-Phrase Mapping", description: "Map two reviewed phrases to two words in order.", targetDifficulties: TARGET_DIFFICULTIES.F06, generate: CP010_V2_FAMILY_GENERATORS.F06 },
    { familyId: "F07", name: "Ordered Two-Word Definitions", description: "Map two reviewed words to their definitions in order.", targetDifficulties: TARGET_DIFFICULTIES.F07, generate: CP010_V2_FAMILY_GENERATORS.F07 },
    { familyId: "F08", name: "Same-Domain Definition Precision", description: "Choose the exact definition among close same-domain alternatives.", targetDifficulties: TARGET_DIFFICULTIES.F08, generate: CP010_V2_FAMILY_GENERATORS.F08 },
  ],
};

export function generateCP010Question(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium",
  requestedFamilyId?: string
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const eligible = ELIGIBLE_BY_DIFFICULTY[difficulty];
  const familyId = (requestedFamilyId ?? rng.pickOne(eligible)) as CP010V2FamilyId;
  if (!eligible.includes(familyId)) {
    throw new Error(`CP010 V2 family ${familyId} is not authorized for ${difficulty} difficulty`);
  }
  const generator = CP010_V2_FAMILY_GENERATORS[familyId];
  if (!generator) throw new Error(`Unknown CP010 V2 family: '${requestedFamilyId}'`);
  return generator(seed, difficulty);
}

export function generateCP010ReviewBatch(
  count: number = 120,
  seedStart: number = 20000
): PunjabiReviewBatch {
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error(`CP010 review count must be a positive integer; got ${count}`);
  }
  const easyCount = Math.floor(count / 3);
  const mediumCount = Math.floor(count / 3);
  const hardCount = count - easyCount - mediumCount;
  const targets: Array<[PunjabiDifficulty, number]> = [
    ["Easy", easyCount],
    ["Medium", mediumCount],
    ["Hard", hardCount],
  ];

  const questions: PunjabiGeneratedQuestion[] = [];
  let currentSeed = seedStart;
  for (const [difficulty, targetCount] of targets) {
    const families = ELIGIBLE_BY_DIFFICULTY[difficulty];
    for (let index = 0; index < targetCount; index++) {
      questions.push(generateCP010Question(currentSeed++, difficulty, families[index % families.length]!));
    }
  }

  return {
    batchId: `BATCH-CP010-V2-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP010",
    generatedAt: new Date().toISOString(),
    totalQuestions: questions.length,
    distribution: { easy: easyCount, medium: mediumCount, hard: hardCount },
    questions,
  };
}
