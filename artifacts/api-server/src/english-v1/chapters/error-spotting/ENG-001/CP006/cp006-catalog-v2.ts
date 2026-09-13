import type { EnglishDifficulty } from "../../../../core/types";
import { CP006_SCENES_BY_DIFFICULTY_V1, type ComparisonSceneV1 } from "./cp006-catalog-v1";

const EDITORIAL_FIXES: Readonly<Record<string, Partial<ComparisonSceneV1>>> = Object.freeze({
  "CMP-E04": {
    correctSegments: ["The patient feels", "comfortable this morning", "after taking", "the prescribed medicine."],
    errorSegments: ["The patient feels", "comfortably this morning", "after taking", "the prescribed medicine."],
    correction: "comfortable this morning",
    reason: "Feels is a linking verb here, so comfortable is the adjective that describes the patient.",
  },
  "CMP-E13": {
    correctSegments: ["Her second attempt was", "better than", "her first attempt", "in every section."],
    errorSegments: ["Her second attempt was", "best than", "her first attempt", "in every section."],
    correction: "better than",
    reason: "Two attempts are being compared, so use the irregular comparative better, not the superlative best.",
  },
  "CMP-E14": {
    correctSegments: ["The visibility was", "worse after sunset", "than it had been", "at noon."],
    errorSegments: ["The visibility was", "worst after sunset", "than it had been", "at noon."],
    correction: "worse after sunset",
    reason: "Two states of visibility are being compared, so use the irregular comparative worse, not the superlative worst.",
  },
  "CMP-E20": {
    correctSegments: ["This route is", "better than", "the longer route", "during peak hours."],
    errorSegments: ["This route is", "best than", "the longer route", "during peak hours."],
    correction: "better than",
    reason: "Two routes are being compared, so use the irregular comparative better, not the superlative best.",
  },
  "CMP-M16": {
    correctSegments: ["The latest survey produced", "worse results than", "the previous survey", "in two categories."],
    errorSegments: ["The latest survey produced", "worst results than", "the previous survey", "in two categories."],
    correction: "worse results than",
    reason: "Two surveys are directly compared with than, so use the irregular comparative worse rather than the superlative worst.",
  },
  "CMP-M17": {
    correctSegments: ["This outlet had", "the best sales record", "among all five outlets", "during the festival."],
    errorSegments: ["This outlet had", "the better sales record", "among all five outlets", "during the festival."],
    correction: "the best sales record",
    reason: "The comparison covers all five outlets, so use the irregular superlative best rather than the comparative better.",
  },
  "CMP-H01": {
    correctSegments: ["Although the file contained several detailed annexures,", "the reviewing officer checked each entry thoroughly", "before forwarding the complete case", "to the approving authority."],
    errorSegments: ["Although the file contained several detailed annexures,", "the reviewing officer checked each entry thorough", "before forwarding the complete case", "to the approving authority."],
    correction: "the reviewing officer checked each entry thoroughly",
    reason: "Thoroughly is the adverb that modifies the action checked; the nearby adjectives do not change that function.",
  },
  "CMP-H03": {
    correctSegments: ["Even after the dosage was reduced and the patient became drowsy,", "his condition remained unusually stable", "throughout the observation period", "specified by the doctor."],
    errorSegments: ["Even after the dosage was reduced and the patient became drowsy,", "his condition remained unusually stably", "throughout the observation period", "specified by the doctor."],
    correction: "his condition remained unusually stable",
    reason: "Remained is a linking verb here; unusually modifies the adjective stable, which describes the condition.",
  },
  "CMP-H04": {
    correctSegments: ["Despite several minor scratches on the casing and a loose outer label,", "the equipment appears sufficiently safe", "for routine laboratory use", "after the electrical checks."],
    errorSegments: ["Despite several minor scratches on the casing and a loose outer label,", "the equipment appears sufficiently safely", "for routine laboratory use", "after the electrical checks."],
    correction: "the equipment appears sufficiently safe",
    reason: "Appears is a linking verb here; sufficiently modifies the adjective safe, which describes the equipment.",
  },
  "CMP-H09": {
    correctSegments: ["Among all applications received before the deadline,", "this was by far the most complete file", "examined by the scrutiny team", "during the first review cycle."],
    errorSegments: ["Among all applications received before the deadline,", "this was by far most complete file", "examined by the scrutiny team", "during the first review cycle."],
    correction: "this was by far the most complete file",
    reason: "The definite article the is required before the ordinary superlative most complete, even when by far comes before it.",
  },
  "CMP-H10": {
    correctSegments: ["Although the programme began only recently and serves a narrow field,", "it has become one of the most popular certificate courses", "offered by the institute", "to first-year students."],
    errorSegments: ["Although the programme began only recently and serves a narrow field,", "it has become one of the most popular certificate course", "offered by the institute", "to first-year students."],
    correction: "it has become one of the most popular certificate courses",
    reason: "After one of the + superlative, the count noun naming the group must be plural: courses.",
  },
  "CMP-H18": {
    correctSegments: ["Although both teams improved after the break,", "the second team performed better than", "the first team in the final round", "under the same scoring rules."],
    errorSegments: ["Although both teams improved after the break,", "the second team performed best than", "the first team in the final round", "under the same scoring rules."],
    correction: "the second team performed better than",
    reason: "Two teams are directly compared with than, so use the irregular comparative better rather than the superlative best.",
  },
  "CMP-H19": {
    correctSegments: ["Of the three batches tested after recalibration,", "the first batch showed the worst defect rate", "under the revised inspection method", "used throughout the plant."],
    errorSegments: ["Of the three batches tested after recalibration,", "the first batch showed the worse defect rate", "under the revised inspection method", "used throughout the plant."],
    correction: "the first batch showed the worst defect rate",
    reason: "The sentence compares three batches, so use the irregular superlative worst rather than the comparative worse.",
  },
});

const applyEditorialFix = (scene: ComparisonSceneV1): ComparisonSceneV1 => {
  const fix = EDITORIAL_FIXES[scene.id];
  return fix ? { ...scene, ...fix } : scene;
};

export const CP006_SCENES_BY_DIFFICULTY_V2: Readonly<Record<EnglishDifficulty, readonly ComparisonSceneV1[]>> = Object.freeze({
  easy: CP006_SCENES_BY_DIFFICULTY_V1.easy.map(applyEditorialFix),
  medium: CP006_SCENES_BY_DIFFICULTY_V1.medium.map(applyEditorialFix),
  hard: CP006_SCENES_BY_DIFFICULTY_V1.hard.map(applyEditorialFix),
});

export const CP006_SCENES_V2: readonly ComparisonSceneV1[] = Object.freeze([
  ...CP006_SCENES_BY_DIFFICULTY_V2.easy,
  ...CP006_SCENES_BY_DIFFICULTY_V2.medium,
  ...CP006_SCENES_BY_DIFFICULTY_V2.hard,
]);
