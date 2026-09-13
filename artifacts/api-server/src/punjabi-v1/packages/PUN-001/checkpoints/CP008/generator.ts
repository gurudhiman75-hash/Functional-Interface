/**
 * PUN-001-CP008 V4 Generator
 * Morphology, Prefixes & Suffixes (ਅਗੇਤਰ, ਪਿਛੇਤਰ ਅਤੇ ਸ਼ਬਦ-ਰਚਨਾ)
 *
 * V4 restores the eight-family review surface and uses an explicitly balanced
 * 120-question reviewer batch: 8 families × 3 difficulties × 5 questions.
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiCheckpointDefinition,
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiReviewBatch,
} from "../../../../core/types";
import {
  CP008_V4_FAMILY_GENERATORS,
  type CP008V4FamilyId,
} from "./CP008-v4_1-families";
import { assertCP008V4AuthorityDepth } from "./CP008-v4-authority-guards";

const CP008_V4_FAMILY_IDS = Object.keys(
  CP008_V4_FAMILY_GENERATORS
) as CP008V4FamilyId[];

const CP008_DIFFICULTIES: PunjabiDifficulty[] = ["Easy", "Medium", "Hard"];

// Fail closed at module load rather than silently weakening F05/F06 with
// unrelated distractor families.
assertCP008V4AuthorityDepth();

export const PUN_001_CP008_DEFINITION: PunjabiCheckpointDefinition = {
  cpId: "PUN-001-CP008",
  packageId: "PUN-001",
  name: "Morphology, Prefixes & Suffixes",
  nameGurmukhi: "ਅਗੇਤਰ, ਪਿਛੇਤਰ ਅਤੇ ਸ਼ਬਦ-ਰਚਨਾ",
  description:
    "Native Punjabi morphology: prefix/suffix identification, genuine-vs-spurious affix discrimination, root extraction, formation, morphological analysis and meaning-to-affix precision.",
  families: [
    { familyId: "F01", name: "Prefix Identification", description: "Identify the genuine prefix used in a target word.", targetDifficulties: CP008_DIFFICULTIES, generate: CP008_V4_FAMILY_GENERATORS.F01 },
    { familyId: "F02", name: "Suffix Identification", description: "Identify the genuine suffix used in a target word.", targetDifficulties: CP008_DIFFICULTIES, generate: CP008_V4_FAMILY_GENERATORS.F02 },
    { familyId: "F03", name: "Spurious Affix Discrimination", description: "Separate genuine affix formation from a root word that only resembles it.", targetDifficulties: CP008_DIFFICULTIES, generate: CP008_V4_FAMILY_GENERATORS.F03 },
    { familyId: "F04", name: "Root Word Extraction", description: "Recover the authentic root from a derived word.", targetDifficulties: CP008_DIFFICULTIES, generate: CP008_V4_FAMILY_GENERATORS.F04 },
    { familyId: "F05", name: "Prefix Formation", description: "Choose the genuine word formed with a stated prefix.", targetDifficulties: CP008_DIFFICULTIES, generate: CP008_V4_FAMILY_GENERATORS.F05 },
    { familyId: "F06", name: "Suffix Formation", description: "Choose the genuine word formed with a stated suffix.", targetDifficulties: CP008_DIFFICULTIES, generate: CP008_V4_FAMILY_GENERATORS.F06 },
    { familyId: "F07", name: "Morphological Segmentation", description: "Choose the correct affix-plus-root analysis of a target word.", targetDifficulties: CP008_DIFFICULTIES, generate: CP008_V4_FAMILY_GENERATORS.F07 },
    { familyId: "F08", name: "Affix Semantic Precision", description: "Select an affix from its meaning using close and opposite semantic confusables.", targetDifficulties: CP008_DIFFICULTIES, generate: CP008_V4_FAMILY_GENERATORS.F08 },
  ],
};

export function generateCP008Question(
  seed: number,
  difficulty: PunjabiDifficulty = "Medium",
  requestedFamilyId?: string
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const familyId = (requestedFamilyId ?? rng.pickOne(CP008_V4_FAMILY_IDS)) as CP008V4FamilyId;
  const generator = CP008_V4_FAMILY_GENERATORS[familyId];
  if (!generator) throw new Error(`Unknown CP008 V4 question family: '${requestedFamilyId}'`);
  return generator(seed, difficulty);
}

export function generateCP008ReviewBatch(
  count: number = 120,
  seedStart: number = 8000
): PunjabiReviewBatch {
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error(`CP008 review count must be a positive integer; got ${count}`);
  }

  const questions: PunjabiGeneratedQuestion[] = [];
  let currentSeed = seedStart;
  const cells = CP008_DIFFICULTIES.flatMap((difficulty) =>
    CP008_V4_FAMILY_IDS.map((familyId) => ({ difficulty, familyId }))
  );

  if (count === 120) {
    for (const { difficulty, familyId } of cells) {
      for (let i = 0; i < 5; i++) {
        questions.push(generateCP008Question(currentSeed++, difficulty, familyId));
      }
    }
  } else {
    for (let i = 0; i < count; i++) {
      const cell = cells[i % cells.length]!;
      questions.push(generateCP008Question(currentSeed++, cell.difficulty, cell.familyId));
    }
  }

  const easy = questions.filter((question) => question.difficulty === "Easy").length;
  const medium = questions.filter((question) => question.difficulty === "Medium").length;
  const hard = questions.filter((question) => question.difficulty === "Hard").length;

  return {
    batchId: `BATCH-CP008-V4-${seedStart}-${count}`,
    packageId: "PUN-001",
    cpId: "PUN-001-CP008",
    generatedAt: new Date().toISOString(),
    totalQuestions: questions.length,
    distribution: { easy, medium, hard },
    questions,
  };
}
