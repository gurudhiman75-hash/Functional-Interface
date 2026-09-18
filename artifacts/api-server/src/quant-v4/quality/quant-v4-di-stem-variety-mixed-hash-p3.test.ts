import assert from "node:assert/strict";

import { presentationVariantIndex } from "../topics/DataInterpretation/DI-001/exact";

const SEED_PREFIX = "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI";
const VARIANT_COUNT = 6;
const SECTIONS = 20;
const SPARSE_RECURRENCE_GAPS = [5, 6, 11, 15] as const;

const TASK_KINDS = [
  "TOTAL",
  "DIFFERENCE",
  "PERCENTAGE",
  "RATIO",
  "AVERAGE",
  "MISSING_REVERSE_PERCENTAGE",
  "PERCENT_CHANGE_SELECTED",
  "SHARE_OF_TOTAL_SELECTED",
  "COMBINED_SELECTED_RATIO",
  "RELATIVE_SELECTION_RATE_CHANGE",
  "CROSS_SERIES_DIFFERENCE",
  "COMBINED_CATEGORY_RATIO",
  "PERCENT_CHANGE_WITHIN_SERIES",
  "CATEGORY_SHARE_OF_SERIES_TOTAL",
  "TOTAL_SERIES_PERCENT_EXCESS",
  "FIRST_OVERTAKE_PERIOD",
  "CLOSEST_LINES_PERIOD",
  "CONSECUTIVE_PERCENT_INCREASE_A",
  "THREE_PERIOD_AVERAGE_B",
  "B_RANGE_PERCENT_INCREASE",
  "MISSING_SECTOR_PERCENT",
  "SECTOR_ANGLE_DEGREES",
  "SECTOR_COUNT_FROM_TOTAL",
  "RATIO_OF_TWO_SECTORS",
  "RELATIVE_SECTOR_PERCENT_EXCESS",
] as const;

const summaries = TASK_KINDS.map((taskKind) => {
  const buckets: number[] = [];
  for (let sectionIndex = 1; sectionIndex <= SECTIONS; sectionIndex += 1) {
    const setSeed =
      `${SEED_PREFIX}:shadow:${sectionIndex}:DATA_INTERPRETATION:set:0`;
    buckets.push(
      presentationVariantIndex(`${setSeed}:stem-variety:${taskKind}`, VARIANT_COUNT),
    );
  }

  const counts = Object.fromEntries(
    Array.from({ length: VARIANT_COUNT }, (_value, bucket) => [
      String(bucket),
      buckets.filter((value) => value === bucket).length,
    ]),
  );
  const usedBuckets = Object.values(counts).filter((count) => count > 0).length;
  const maxShare = Math.max(...Object.values(counts)) / SECTIONS;

  assert.equal(
    usedBuckets,
    VARIANT_COUNT,
    `${taskKind}: structured shadow seeds must exercise all ${VARIANT_COUNT} stem variants.`,
  );
  assert.ok(
    maxShare <= 0.20,
    `${taskKind}: one stem variant receives ${maxShare} of structured shadow seeds.`,
  );
  for (const gap of SPARSE_RECURRENCE_GAPS) {
    for (let index = 0; index + gap < buckets.length; index += 1) {
      assert.notEqual(
        buckets[index],
        buckets[index + gap],
        `${taskKind}: section seeds ${index + 1} and ${index + 1 + gap} hit the same stem variant at observed sparse-recurrence gap ${gap}.`,
      );
    }
  }

  return { taskKind, usedBuckets, maxShare, counts };
});

console.log(
  "QUANT_V4_DI_STEM_VARIETY_MIXED_HASH_P3",
  JSON.stringify({ sections: SECTIONS, variantCount: VARIANT_COUNT, summaries }),
);
console.log("PASS_QUANT_V4_DI_STEM_VARIETY_MIXED_HASH_P3");
