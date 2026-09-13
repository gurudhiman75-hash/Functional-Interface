import type { EnglishDifficulty } from "../../../../core/types";
import { CP006_SCENES_BY_DIFFICULTY_V3, type ComparisonSceneV1 } from "./cp006-catalog-v3";

/** Final editorial polish over the balanced V3 layouts. Natural exam word order
 * takes priority over perfectly equal answer-position counts. */
const NATURALNESS_FIXES: Readonly<Record<string, Partial<ComparisonSceneV1>>> = Object.freeze({
  "CMP-E03": {
    correctSegments: ["After the rain,", "the road", "looks clear", "and traffic has started moving again."],
    errorSegments: ["After the rain,", "the road", "looks clearly", "and traffic has started moving again."],
    errorIndex: 2,
    correction: "looks clear",
    reason: "Looks is a linking verb here, so the adjective clear describes the road.",
  },
  "CMP-E07": {
    correctSegments: ["In the handbook,", "this chapter", "is shorter than the previous chapter", "by several pages."],
    errorSegments: ["In the handbook,", "this chapter", "is short than the previous chapter", "by several pages."],
    errorIndex: 2,
    correction: "is shorter than the previous chapter",
    reason: "A direct comparison with than requires the comparative form shorter.",
  },
  "CMP-E08": {
    correctSegments: ["According to the survey,", "this field", "is larger than the one near the road", "by several acres."],
    errorSegments: ["According to the survey,", "this field", "is large than the one near the road", "by several acres."],
    errorIndex: 2,
    correction: "is larger than the one near the road",
    reason: "A comparison of two fields requires the comparative form larger.",
  },
  "CMP-E09": {
    correctSegments: ["The smallest planet by diameter", "in the solar system", "is Mercury", "according to standard measurements."],
    errorSegments: ["Smallest planet by diameter", "in the solar system", "is Mercury", "according to standard measurements."],
    errorIndex: 0,
    correction: "The smallest planet by diameter",
    reason: "Use the before an ordinary superlative that identifies one member of a group.",
  },
  "CMP-E11": {
    correctSegments: ["For new employees,", "the revised procedure", "is easier than the old process", "during initial training."],
    errorSegments: ["For new employees,", "the revised procedure", "is more easier than the old process", "during initial training."],
    errorIndex: 2,
    correction: "is easier than the old process",
    reason: "Easier is already comparative, so more must not be added.",
  },
  "CMP-E13": {
    correctSegments: ["According to the score report,", "her second attempt", "was better than her first attempt", "in every section."],
    errorSegments: ["According to the score report,", "her second attempt", "was best than her first attempt", "in every section."],
    errorIndex: 2,
    correction: "was better than her first attempt",
    reason: "Two attempts are being compared, so use the comparative better, not the superlative best.",
  },
  "CMP-M01": {
    correctSegments: ["Before accepting the revised statement,", "the audit team", "examined the supporting records carefully,", "comparing them with the original vouchers."],
    errorSegments: ["Before accepting the revised statement,", "the audit team", "examined the supporting records careful,", "comparing them with the original vouchers."],
    errorIndex: 2,
    correction: "examined the supporting records carefully,",
    reason: "Carefully is the adverb that describes how the audit team examined the records.",
  },
  "CMP-M04": {
    correctSegments: ["After the examples were added,", "the revised instructions", "seem clear to most candidates", "during the test."],
    errorSegments: ["After the examples were added,", "the revised instructions", "seem clearly to most candidates", "during the test."],
    errorIndex: 2,
    correction: "seem clear to most candidates",
    reason: "Seem is a linking verb here, so the adjective clear describes the instructions.",
  },
  "CMP-M09": {
    correctSegments: ["In the region,", "the institute", "is one of the oldest colleges", "still offering this course."],
    errorSegments: ["In the region,", "the institute", "is one of the oldest college", "still offering this course."],
    errorIndex: 2,
    correction: "is one of the oldest colleges",
    reason: "After one of the + superlative, the noun naming the group must be plural: colleges.",
  },
  "CMP-H03": {
    correctSegments: ["Even after the dosage was reduced,", "the patient's condition", "remained", "unusually stable throughout observation."],
    errorSegments: ["Even after the dosage was reduced,", "the patient's condition", "remained", "unusually stably throughout observation."],
    errorIndex: 3,
    correction: "unusually stable throughout observation.",
    reason: "Remained is a linking verb here; unusually modifies the adjective stable, which describes the condition.",
  },
  "CMP-H04": {
    correctSegments: ["Despite several minor scratches on the casing and a loose outer label,", "the equipment", "appears safe", "for routine laboratory use after the electrical checks."],
    errorSegments: ["Despite several minor scratches on the casing and a loose outer label,", "the equipment", "appears safely", "for routine laboratory use after the electrical checks."],
    errorIndex: 2,
    correction: "appears safe",
    reason: "Appears is a linking verb here, so the adjective safe describes the equipment.",
  },
  "CMP-H05": {
    correctSegments: ["After seasonal effects were removed,", "the revised index", "was as stable as the previous quarter's measure", "for the same basket of goods."],
    errorSegments: ["After seasonal effects were removed,", "the revised index", "was as more stable as the previous quarter's measure", "for the same basket of goods."],
    errorIndex: 2,
    correction: "was as stable as the previous quarter's measure",
    reason: "The as ... as structure requires the positive degree stable.",
  },
  "CMP-H17": {
    correctSegments: ["Once the damaged road section was repaired,", "commuters found", "the morning journey", "much shorter than last week's journey."],
    errorSegments: ["Once the damaged road section was repaired,", "commuters found", "the morning journey", "very shorter than last week's journey."],
    errorIndex: 3,
    correction: "much shorter than last week's journey.",
    reason: "Much is a standard intensifier with shorter; very shorter is not.",
  },
});

const applyNaturalnessFix = (scene: ComparisonSceneV1): ComparisonSceneV1 => {
  const fix = NATURALNESS_FIXES[scene.id];
  return fix ? { ...scene, ...fix } : scene;
};

export const CP006_SCENES_BY_DIFFICULTY_V4: Readonly<Record<EnglishDifficulty, readonly ComparisonSceneV1[]>> = Object.freeze({
  easy: CP006_SCENES_BY_DIFFICULTY_V3.easy.map(applyNaturalnessFix),
  medium: CP006_SCENES_BY_DIFFICULTY_V3.medium.map(applyNaturalnessFix),
  hard: CP006_SCENES_BY_DIFFICULTY_V3.hard.map(applyNaturalnessFix),
});

export const CP006_SCENES_V4: readonly ComparisonSceneV1[] = Object.freeze([
  ...CP006_SCENES_BY_DIFFICULTY_V4.easy,
  ...CP006_SCENES_BY_DIFFICULTY_V4.medium,
  ...CP006_SCENES_BY_DIFFICULTY_V4.hard,
]);
