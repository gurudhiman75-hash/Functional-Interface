import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  areSpatialScenesEquivalent,
  buildSpatialEditorialReviewExport,
  findClockTimeMatchingHandAngles,
  renderSpatialSceneToSvg,
  spatialSceneSemanticFingerprint,
  transformSceneByRequestedOperation,
  validateClockOptionPerceptualSeparation,
  validateMarkerClearance,
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

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildReviewHtml(
  editorialExport: ReturnType<typeof buildSpatialEditorialReviewExport>,
): string {
  const rows = editorialExport.rows
    .map(
      (row, index) => `
<section class="question ${row.stimulusKind === "ANALOG_CLOCK" ? "clock" : ""}">
  <h2>Question ${index + 1} · ${escapeHtml(row.chapterCode)}</h2>
  <p>${row.requestedTransform === "REFLECT_VERTICAL" ? "Choose the correct mirror image." : "Choose the correct water image."}</p>
  <div class="source" style="--size:${row.recommendedOptionPixels}px">${row.sourceSvg}</div>
  <div class="options" style="--size:${row.recommendedOptionPixels}px">
    ${row.optionSvgs
      .map(
        (svg, optionIndex) => `<div class="option"><strong>${String.fromCharCode(
          65 + optionIndex,
        )}</strong>${svg}</div>`,
      )
      .join("\n")}
  </div>
  <details>
    <summary>Answer and editorial evidence</summary>
    <p><strong>Answer:</strong> ${String.fromCharCode(64 + row.correctOptionNumber)}</p>
    <p><strong>Observation:</strong> ${escapeHtml(row.learnerExplanation?.observation ?? "")}</p>
    <p><strong>Rule:</strong> ${escapeHtml(row.learnerExplanation?.rule ?? "")}</p>
    <p><strong>Application:</strong> ${escapeHtml(row.learnerExplanation?.application ?? "")}</p>
    <p><strong>Check:</strong> ${escapeHtml(row.learnerExplanation?.check ?? "")}</p>
    <p><strong>Option labels:</strong> ${escapeHtml(row.optionLabels.join(" · "))}</p>
  </details>
</section>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SPA Wave 03 remediated review</title>
<style>
body{font-family:Arial,sans-serif;max-width:1160px;margin:auto;padding:24px;background:#f8fafc;color:#111827}.question{background:white;border:1px solid #d1d5db;border-radius:12px;padding:20px;margin:0 0 24px}.source{width:var(--size);max-width:100%;margin:16px auto}.source svg,.option svg{width:100%;height:auto}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.option{border:1px solid #9ca3af;border-radius:8px;padding:10px;min-width:0}.option strong{display:block}.clock .options{gap:18px}.clock .option{padding:14px}details{margin-top:16px}summary{cursor:pointer;font-weight:700}@media(max-width:760px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}.question{padding:14px}}
</style></head><body><h1>SPA Wave 03 — Remediated Review Corpus</h1>${rows}</body></html>`;
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

const answerSequence = firstCorpus.all.map((question) => question.correctOptionIndex);
assert.deepEqual(answerSequence, [
  2, 0, 3, 1, 0, 2, 1, 3, 1, 3, 0, 2, 0, 2, 3, 1, 3, 1, 2, 0,
]);
for (let index = 1; index < answerSequence.length; index += 1) {
  assert.notEqual(answerSequence[index], answerSequence[index - 1]);
}
const answerPositions = answerSequence.reduce(
  (counts, position) => {
    counts[position] += 1;
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

const geometricQuestions = firstCorpus.all.filter(
  (question) => question.stimulusKind === "SEEDED_GEOMETRIC_COMPOSITION",
);
const templateKinds = new Set(
  geometricQuestions.map((question) => question.sourceScene.metadata?.templateKind),
);
assert(templateKinds.size >= 3);
for (const question of geometricQuestions) {
  assert.equal(question.reviewMetadata.perceptualSeparationCheck, "PASS");
  assert((question.reviewMetadata.minimumMarkerClearance ?? 0) >= 4);
  for (const option of question.options) {
    const clearance = validateMarkerClearance(option.scene);
    assert.equal(clearance.ok, true, clearance.errors.join(" | "));
  }
}

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
      question.reviewMetadata.perceptualSeparationCheck === "PASS" &&
      question.solverEvidence.clock?.shortcutCrossCheck === "PASS" &&
      question.solverEvidence.clock?.presentationPolicy === "TIME_OR_DIAGRAM" &&
      (question.solverEvidence.clock?.minimumOptionEndpointDistance ?? 0) >= 8,
  ),
);
assert.equal(mirrorClocks[0]!.solverEvidence.clock!.sourceAngles.hourAngleDeg, 70);
assert.equal(mirrorClocks[1]!.solverEvidence.clock!.sourceAngles.hourAngleDeg, 137.5);
assert(
  mirrorClocks.every((question) =>
    question.options.some(
      (option) => option.label === "CLOCK_SHORTCUT_BORROW_ERROR",
    ),
  ),
);
assert(
  mirrorClocks.every(
    (question) =>
      !question.options.some((option) => option.label === "CLOCK_HOUR_HAND_SNAPPED"),
  ),
);

const allClocks = firstCorpus.all.filter(
  (question) => question.stimulusKind === "ANALOG_CLOCK",
);
for (const question of allClocks) {
  assert.equal(
    question.sourceScene.nodes.filter((node) => node.role === "clock-tick").length,
    12,
  );
  const perceptual = validateClockOptionPerceptualSeparation(question.options, 8);
  assert.equal(perceptual.ok, true, perceptual.errors.join(" | "));
}

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
assert.equal(editorialExport.schemaVersion, "1.1");
assert.equal(editorialExport.questionCount, 20);
assert.equal(editorialExport.rows.length, 20);
assert(
  editorialExport.rows.every(
    (row) =>
      row.learnerExplanation !== undefined &&
      row.sourceSvg.startsWith("<svg ") &&
      row.sourceSvg.includes("reflection-axis-presentation") &&
      row.optionSvgs.length === 4 &&
      row.optionSvgs.every((svg) => !svg.includes("reflection-axis-presentation")),
  ),
);

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-wave-03-editorial-review.json",
  `${JSON.stringify(editorialExport, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-wave-03-editorial-review.html",
  buildReviewHtml(editorialExport),
  "utf8",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SPA_FND_001_WAVE_03_PERCEPTUAL_REMEDIATION",
      corpus: {
        total: firstCorpus.all.length,
        mirror: firstCorpus.mirror.length,
        water: firstCorpus.water.length,
        stimulusCounts,
        answerPositions,
        answerSequence,
        geometricTemplateKinds: [...templateKinds],
      },
      checks: {
        canonicalGlyphAuthorityV2: true,
        deterministicRegeneration: true,
        independentSolve: true,
        semanticOptionUniqueness: true,
        nonPredictableBalancedAnswerOrder: true,
        geometricCollisionClearance: true,
        diverseGeometricTemplates: true,
        twelveTickClockFace: true,
        clockPerceptualSeparation: true,
        mirrorClockDualProof: true,
        waterClockDiagramOnly: true,
        explicitPresentationAxis: true,
        questionSpecificExplanation: true,
        editorialJsonAndHtml: true,
        lifecycleIsolation: true,
      },
    },
    null,
    2,
  ),
);
