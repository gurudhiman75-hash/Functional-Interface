import assert from "node:assert/strict";

import { TRG_001_PRODUCTION_REGISTRY } from "../topics/AdvancedMathematics/subtopics/Trigonometry/TRG-001/production-runtime";
import {
  generateQuantV4AdvancedMathSectionQuestion,
  listQuantV4Trg001RuntimeDifficultyQlIds,
  quantV4AdvancedMathDifficultyForSeed,
  quantV4TrigonometryPackageForSeed,
  type QuantV4AdvancedMathDifficulty,
} from "./quant-v4-real-exam-advanced-math-adapters-p2";

function duplicateItems(values: readonly string[]): number {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
}

const poolSizes = Object.fromEntries(
  (["Easy", "Medium", "Hard"] as const).map((difficulty) => [
    difficulty,
    listQuantV4Trg001RuntimeDifficultyQlIds(difficulty).length,
  ]),
) as Record<QuantV4AdvancedMathDifficulty, number>;

const runtimeDifficultyByQl = new Map<string, QuantV4AdvancedMathDifficulty>();
for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  for (const qlId of listQuantV4Trg001RuntimeDifficultyQlIds(difficulty)) {
    runtimeDifficultyByQl.set(qlId, difficulty);
  }
}
const registryDifficultyMismatches = TRG_001_PRODUCTION_REGISTRY
  .filter((entry) => runtimeDifficultyByQl.get(entry.qlId) !== entry.difficulty)
  .map((entry) => ({
    qlId: entry.qlId,
    registryDifficulty: entry.difficulty,
    runtimeDifficulty: runtimeDifficultyByQl.get(entry.qlId) ?? null,
  }));

const currentQlIds: string[] = [];
const capacityQlIds: string[] = [];
const capacityCursor: Record<QuantV4AdvancedMathDifficulty, number> = {
  Easy: 0,
  Medium: 0,
  Hard: 0,
};
const selectedByDifficulty: Record<QuantV4AdvancedMathDifficulty, number> = {
  Easy: 0,
  Medium: 0,
  Hard: 0,
};

for (let sectionIndex = 1; sectionIndex <= 20; sectionIndex += 1) {
  const sectionSeed = `QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI:shadow:${sectionIndex}`;
  for (let slotIndex = 0; slotIndex < 3; slotIndex += 1) {
    const seed = `${sectionSeed}:TRIGONOMETRY:${slotIndex}`;
    const family = quantV4TrigonometryPackageForSeed("SSC_CGL_TIER_I", seed);
    const difficulty = quantV4AdvancedMathDifficultyForSeed(seed);

    const current = await generateQuantV4AdvancedMathSectionQuestion({
      examId: "SSC_CGL_TIER_I",
      slotKind: "TRIGONOMETRY",
      seed,
    });

    if (current.packageId === "TRG-001") {
      currentQlIds.push(String(current.question.questionLanguageId ?? current.question.qlId ?? ""));
    }

    const diversityOrdinal = family === "TRG-001"
      ? capacityCursor[difficulty]++
      : undefined;

    const capacity = await generateQuantV4AdvancedMathSectionQuestion({
      examId: "SSC_CGL_TIER_I",
      slotKind: "TRIGONOMETRY",
      seed,
      diversityCapacityOrdinal: diversityOrdinal,
    });

    if (capacity.packageId === "TRG-001") {
      selectedByDifficulty[difficulty] += 1;
      capacityQlIds.push(String(capacity.question.questionLanguageId ?? capacity.question.qlId ?? ""));
    }
  }
}

assert.equal(currentQlIds.length, capacityQlIds.length);
assert.ok(currentQlIds.length > 0);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  assert.ok(
    selectedByDifficulty[difficulty] <= poolSizes[difficulty],
    `${difficulty} TRG-001 sample exceeds its frozen QL pool; capacity mode cannot avoid reuse.`,
  );
}

const currentDuplicateItems = duplicateItems(currentQlIds);
const capacityDuplicateItems = duplicateItems(capacityQlIds);

assert.ok(
  currentDuplicateItems > 0,
  "The baseline CGL shadow sample no longer exhibits TRG-001 QL collisions; revisit this diagnostic.",
);
assert.equal(
  capacityDuplicateItems,
  0,
  "TRG-001 diversity-capacity mode must use eligible frozen QLs before reuse.",
);

console.log("QUANT_V4_TRG001_DIVERSITY_CAPACITY_P4", JSON.stringify({
  trg001Records: currentQlIds.length,
  poolSizes,
  selectedByDifficulty,
  baseline: {
    uniqueQlIds: new Set(currentQlIds).size,
    duplicateItems: currentDuplicateItems,
  },
  diversityCapacity: {
    uniqueQlIds: new Set(capacityQlIds).size,
    duplicateItems: capacityDuplicateItems,
  },
  registryDifficultyMismatchCount: registryDifficultyMismatches.length,
  registryDifficultyMismatches: registryDifficultyMismatches.slice(0, 30),
  productionBehaviorChanged: false,
}));
