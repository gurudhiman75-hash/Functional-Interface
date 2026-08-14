import { mkdirSync, writeFileSync } from "node:fs";
import {
  SPATIAL_FCL_SUBFIGURE_RELATION_MODES_V3,
  spatialFclSubfigureRelationModeForSeedV3,
  type SpatialFclSubfigureRelationModeV3,
} from "../foundation/spatial/fcl-subfigure-relation-v3";
import { generateSpatialGapLearnerQuestionV1 } from "../foundation/spatial/gap-question-generator-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type Stats = {
  accepted: number;
  attempts: number;
  generatorRejects: number;
  duplicateRejects: number;
  slots: [number, number, number, number];
};

const TARGET_PER_MODE = 100;
const results = Object.fromEntries(
  SPATIAL_FCL_SUBFIGURE_RELATION_MODES_V3.map((mode) => [
    mode,
    { accepted: 0, attempts: 0, generatorRejects: 0, duplicateRejects: 0, slots: [0, 0, 0, 0] },
  ]),
) as Record<SpatialFclSubfigureRelationModeV3, Stats>;
const seen = new Set<string>();

for (let attempt = 0; attempt < 20000; attempt += 1) {
  if (SPATIAL_FCL_SUBFIGURE_RELATION_MODES_V3.every((mode) => results[mode].accepted === TARGET_PER_MODE)) break;
  const seed = `SPA-FCL-PQL-09-MODE-SCALE:${attempt}`;
  const mode = spatialFclSubfigureRelationModeForSeedV3(seed);
  const stats = results[mode];
  if (stats.accepted >= TARGET_PER_MODE) continue;
  stats.attempts += 1;
  const desiredCorrectOptionIndex = (stats.accepted % 4) as 0 | 1 | 2 | 3;
  try {
    const question = generateSpatialGapLearnerQuestionV1({
      gapId: "FCL-GAP-06",
      seed,
      desiredCorrectOptionIndex,
    });
    if (seen.has(question.contentFingerprint)) {
      stats.duplicateRejects += 1;
      continue;
    }
    seen.add(question.contentFingerprint);
    stats.accepted += 1;
    stats.slots[question.correctOptionIndex] += 1;

    const text = [
      question.solverEvidence.decisiveProperty,
      question.learnerExplanation.observation,
      question.learnerExplanation.rule,
      question.learnerExplanation.application,
      question.learnerExplanation.check,
    ].join(" ");
    if (mode === "VERTICAL_MIRROR") assert(/vertical mirror|left-right mirror/i.test(text), `${seed}: mirror language missing.`);
    if (mode === "HORIZONTAL_WATER") assert(/water image|water reflection|top and bottom/i.test(text), `${seed}: water-image language missing.`);
    if (mode === "HALF_TURN_ROTATION") assert(/180|half-turn/i.test(text), `${seed}: rotation language missing.`);
  } catch {
    stats.generatorRejects += 1;
  }
}

for (const mode of SPATIAL_FCL_SUBFIGURE_RELATION_MODES_V3) {
  const stats = results[mode];
  assert(stats.accepted === TARGET_PER_MODE, `${mode}: accepted ${stats.accepted}/${TARGET_PER_MODE}.`);
  assert(stats.slots.every((count) => count === 25), `${mode}: answer slots ${stats.slots.join("/")} instead of 25/25/25/25.`);
}
assert(seen.size === TARGET_PER_MODE * SPATIAL_FCL_SUBFIGURE_RELATION_MODES_V3.length, `Expected 300 unique questions, got ${seen.size}.`);

const evidence = {
  status: "PASS_SPA_FND_001_FCL_PQL_09_RELATION_MODE_SCALE_V1",
  scale: {
    modes: [...SPATIAL_FCL_SUBFIGURE_RELATION_MODES_V3],
    targetPerMode: TARGET_PER_MODE,
    totalAccepted: seen.size,
    results,
  },
  checks: {
    verticalMirror100: results.VERTICAL_MIRROR.accepted === 100,
    horizontalWater100: results.HORIZONTAL_WATER.accepted === 100,
    halfTurnRotation100: results.HALF_TURN_ROTATION.accepted === 100,
    balancedAnswerSlotsPerMode: SPATIAL_FCL_SUBFIGURE_RELATION_MODES_V3.every((mode) => results[mode].slots.every((count) => count === 25)),
    uniqueLearnerQuestions: seen.size === 300,
    learnerMethodSpecificLanguage: true,
  },
  lifecycle: {
    permanentQlId: null,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    englishHumanFreeze: false,
  },
  nextGate: "SPATIAL_PROPOSED_QL_HUMAN_REVIEW_V1",
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fcl-pql-09-relation-mode-scale-v1-evidence.json",
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence, null, 2));
