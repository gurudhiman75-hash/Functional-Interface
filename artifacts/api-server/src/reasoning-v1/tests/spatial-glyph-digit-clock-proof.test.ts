import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  areSpatialScenesEquivalent,
  buildSpatialEditorialReviewExport,
  findClockTimeMatchingHandAngles,
  renderSpatialSceneToSvg,
  spatialSceneSemanticFingerprint,
  transformSceneByRequestedOperation,
  validateSpatialOptionUniqueness,
  validateSpatialProofGlyphAuthority,
  type SpatialTransformProofQuestion,
} from "../foundation/spatial";
import { buildSpatialWave03Corpus } from "../proofs/spa-fnd-001-wave-03-corpus";

function assertLifecycleLocked(question: SpatialTransformProofQuestion): void {
  assert.equal(question.lifecycle.permanentQlId, null);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
}

function independentlySolve(question: SpatialTransformProofQuestion) {
  const centre = {
    x: question.sourceScene.viewBox.minX + question.sourceScene.viewBox.width / 2,
    y: question.sourceScene.viewBox.minY + question.sourceScene.viewBox.height / 2,
  };
  return transformSceneByRequestedOperation(
    question.sourceScene,
    question.requestedTransform,
    {
      axisX:
        question.requestedTransform === "REFLECT_VERTICAL"
          ? question.solverEvidence.axisCoordinate
          : centre.x,
      axisY:
        question.requestedTransform === "REFLECT_HORIZONTAL"
          ? question.solverEvidence.axisCoordinate
          : centre.y,
      pivot: centre,
    },
  );
}

function assertQuestion(question: SpatialTransformProofQuestion): void {
  assert.equal(question.familyCode, "SPA-001");
  assert.equal(question.options.length, 4);
  assert(question.correctOptionIndex >= 0 && question.correctOptionIndex < 4);
  assert.equal(question.explanationSteps.length, 4);
  assert(question.learnerExplanation);
  assert(question.learnerExplanation.observation.length > 20);
  assert(question.learnerExplanation.rule.length > 20);
  assert(question.learnerExplanation.application.length > 20);
  assert(question.learnerExplanation.check.length > 20);
  assertLifecycleLocked(question);

  const validation = validateSpatialOptionUniqueness(
    question.options.map((option) => option.scene),
  );
  assert.equal(validation.ok, true, JSON.stringify(validation.errors));
  assert.equal(new Set(question.options.map((option) => option.fingerprint)).size, 4);
  assert.equal(
    question.options.filter((option) => option.label === "CORRECT_REFLECTION").length,
    1,
  );

  const independentlySolved = independentlySolve(question);
  assert.equal(
    areSpatialScenesEquivalent(
      independentlySolved,
      question.options[question.correctOptionIndex]!.scene,
    ),
    true,
  );
  assert.equal(
    spatialSceneSemanticFingerprint(independentlySolved),
    question.solverEvidence.correctFingerprint,
  );

  const sourceSvg = renderSpatialSceneToSvg(question.sourceScene, {
    ariaLabel: `${question.chapterCode} ${question.seed} source`,
  });
  assert.match(sourceSvg, /^<svg /);
  assert.doesNotMatch(sourceSvg, /<script|foreignObject|javascript:/i);
  for (const [index, option] of question.options.entries()) {
    const svg = renderSpatialSceneToSvg(option.scene, {
      ariaLabel: `${question.chapterCode} ${question.seed} option ${index + 1}`,
    });
    assert.match(svg, /^<svg /);
    assert.doesNotMatch(svg, /<script|foreignObject|javascript:/i);
  }
}

validateSpatialProofGlyphAuthority();

const firstCorpus = buildSpatialWave03Corpus();
const secondCorpus = buildSpatialWave03Corpus();
assert.deepEqual(firstCorpus, secondCorpus);
assert.equal(firstCorpus.mirror.length, 12);
assert.equal(firstCorpus.water.length, 8);
assert.equal(firstCorpus.all.length, 20);

for (const question of firstCorpus.all) {
  assertQuestion(question);
}

const stimulusCounts = firstCorpus.all.reduce<Record<string, number>>(
  (counts, question) => {
    const key = question.stimulusKind ?? "UNSPECIFIED";
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  },
  {},
);
assert.deepEqual(stimulusCounts, {
  SEEDED_GEOMETRIC_COMPOSITION: 7,
  WESTERN_ARABIC_DIGIT_STRING: 5,
  LATIN_GLYPH_STRING: 5,
  ANALOG_CLOCK: 3,
});

const answerPositions = firstCorpus.all.reduce(
  (counts, question) => {
    counts[question.correctOptionIndex] += 1;
    return counts;
  },
  [0, 0, 0, 0],
);
assert.deepEqual(answerPositions, [5, 5, 5, 5]);

assert.equal(
  new Set(
    firstCorpus.all.map((question) =>
      spatialSceneSemanticFingerprint(question.sourceScene),
    ),
  ).size,
  firstCorpus.all.length,
);

const latinQuestions = firstCorpus.all.filter(
  (question) => question.stimulusKind === "LATIN_GLYPH_STRING",
);
assert.equal(latinQuestions.length, 5);
assert(
  latinQuestions.every(
    (question) => question.reviewMetadata.localeMode === "SCRIPT_SPECIFIC",
  ),
);

const digitQuestions = firstCorpus.all.filter(
  (question) => question.stimulusKind === "WESTERN_ARABIC_DIGIT_STRING",
);
assert.equal(digitQuestions.length, 5);
assert(
  digitQuestions.every(
    (question) =>
      question.reviewMetadata.localeMode === "INSTRUCTION_LOCALISED",
  ),
);

const mirrorClocks = firstCorpus.mirror.filter(
  (question) => question.stimulusKind === "ANALOG_CLOCK",
);
assert.equal(mirrorClocks.length, 2);
assert(
  mirrorClocks.every(
    (question) =>
      question.reviewMetadata.clockGeometryCheck === "PASS" &&
      question.reviewMetadata.clockShortcutCheck === "PASS" &&
      question.solverEvidence.clock?.shortcutCrossCheck === "PASS" &&
      question.solverEvidence.clock?.presentationPolicy === "TIME_OR_DIAGRAM",
  ),
);
assert.equal(mirrorClocks[0]!.solverEvidence.clock!.sourceAngles.hourAngleDeg, 70);
assert.equal(mirrorClocks[1]!.solverEvidence.clock!.sourceAngles.hourAngleDeg, 137.5);

const waterClocks = firstCorpus.water.filter(
  (question) => question.stimulusKind === "ANALOG_CLOCK",
);
assert.equal(waterClocks.length, 1);
const waterClock = waterClocks[0]!;
assert.equal(waterClock.reviewMetadata.clockGeometryCheck, "PASS");
assert.equal(waterClock.reviewMetadata.clockShortcutCheck, "NOT_APPLICABLE");
assert.equal(waterClock.solverEvidence.clock?.presentationPolicy, "DIAGRAM_ONLY");
assert.equal(waterClock.solverEvidence.clock?.shortcutCrossCheck, "NOT_APPLICABLE");
assert.equal(
  findClockTimeMatchingHandAngles(waterClock.solverEvidence.clock!.reflectedAngles),
  null,
);

const editorialExport = buildSpatialEditorialReviewExport(firstCorpus.all);
assert.equal(editorialExport.schemaVersion, "1.0");
assert.equal(editorialExport.questionCount, 20);
assert.equal(editorialExport.rows.length, 20);
assert(
  editorialExport.rows.every(
    (row) =>
      row.learnerExplanation !== undefined &&
      row.sourceSvg.startsWith("<svg ") &&
      row.optionSvgs.length === 4,
  ),
);

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-wave-03-editorial-review.json",
  `${JSON.stringify(editorialExport, null, 2)}\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SPA_FND_001_GLYPH_DIGIT_CLOCK_PROOF",
      corpus: {
        total: firstCorpus.all.length,
        mirror: firstCorpus.mirror.length,
        water: firstCorpus.water.length,
        stimulusCounts,
        answerPositions,
      },
      checks: {
        canonicalGlyphAuthority: true,
        deterministicRegeneration: true,
        independentSolve: true,
        fourUniqueOptions: true,
        balancedAnswerPositions: true,
        continuousClockHourHand: true,
        mirrorClockDualProof: true,
        waterClockDiagramOnly: true,
        learnerExplanation: true,
        editorialReviewExport: true,
        lifecycleIsolation: true,
      },
    },
    null,
    2,
  ),
);
