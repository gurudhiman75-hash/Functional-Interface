import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";

import type { CubesDicePermanentQlIdV1 } from "../foundation/spatial/cubes-dice-cp004-distractors-allocation-v1";
import { CND_001_EXAM_RENDERER_AUTHORITY_V1 } from "../foundation/spatial/cubes-dice-exam-renderer-v1";
import {
  CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1,
  generateCubesDiceQuestionStudioSeededV1,
  type CubesDiceQuestionStudioQuestionV1,
  type CubesDiceStudioDifficultyV1,
  type CubesDiceStudioLanguageV1,
} from "../foundation/spatial/cubes-dice-question-studio-seeded-runtime-v1";

const QLS: readonly CubesDicePermanentQlIdV1[] = ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045"];
const LANGUAGES: readonly CubesDiceStudioLanguageV1[] = ["en", "hi", "pa"];
const DIFFICULTIES: readonly CubesDiceStudioDifficultyV1[] = ["Easy", "Medium", "Hard"];
const QUESTIONS_PER_QL = 6;
const EXPECTED_CANONICAL_REVIEW_COUNT = QLS.length * QUESTIONS_PER_QL;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function assertExamSvg(question: CubesDiceQuestionStudioQuestionV1): void {
  const svg = question.stimulusSvgs[0];
  const prefix = `${question.qlId}/${question.seed}`;
  assert.match(svg, /^<svg\b/i, `${prefix}: stimulus must be SVG.`);
  assert.match(svg, /viewBox="0 0 \d+(?:\.\d+)? \d+(?:\.\d+)?"/, `${prefix}: canonical zero-origin viewBox required.`);
  assert.match(svg, /shape-rendering="geometricPrecision"/, `${prefix}: geometricPrecision rendering required.`);
  assert.match(svg, /<rect width="\d+(?:\.\d+)?" height="\d+(?:\.\d+)?" fill="white"\/>/, `${prefix}: explicit white background required.`);
  assert.ok(!/rotate\s*\(/i.test(svg), `${prefix}: whole-figure rotate transform is forbidden.`);
  assert.ok(!/skew[XY]?\s*\(/i.test(svg), `${prefix}: skew transforms are forbidden.`);
  assert.ok(!/matrix\s*\(/i.test(svg), `${prefix}: free matrix transforms are forbidden.`);
  const strokeWidths = [...svg.matchAll(/stroke-width="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(strokeWidths.length > 0, `${prefix}: SVG must contain stroked exam geometry.`);
  assert.ok(strokeWidths.every((width) => width === "1.35"), `${prefix}: every geometry stroke must remain 1.35px.`);
  assert.ok(!/stroke-width="(?:2|2\.|[3-9]|1\.[5-9])/i.test(svg), `${prefix}: bold exam geometry is forbidden.`);
  assert.equal(question.renderer.whiteBackground, true, `${prefix}: runtime white-background contract changed.`);
  assert.equal(question.renderer.canonicalCamera, true, `${prefix}: canonical camera contract changed.`);
  assert.equal(question.renderer.randomWholeFigureTiltAllowed, false, `${prefix}: random whole-figure tilt must remain disabled.`);
  assert.equal(question.renderer.recommendedStimulusPixels, 280, `${prefix}: recommended display size changed.`);
  assert.equal(question.renderer.mobileMinimumStimulusPixels, 220, `${prefix}: mobile display floor changed.`);

  const transforms = [...svg.matchAll(/transform="([^"]+)"/g)].map((match) => match[1] ?? "");
  assert.ok(transforms.every((transform) => /^translate\([^)]*\)$/.test(transform)), `${prefix}: only translation transforms are allowed in CND exam SVGs.`);
  if (question.qlId === "SPA-QL-044") {
    assert.equal(transforms.length, 0, `${prefix}: cube nets must stay canonical upright with no transform.`);
    assert.ok(!/<polygon\b/i.test(svg), `${prefix}: cube-net surface should be orthogonal equal squares, not tilted polygons.`);
  }
}

function maskForDifficulty(difficulty: CubesDiceStudioDifficultyV1): number {
  return 1 << DIFFICULTIES.indexOf(difficulty);
}

function chooseSixVariantBalancedQuestions(qlId: CubesDicePermanentQlIdV1): readonly CubesDiceQuestionStudioQuestionV1[] {
  const byVariant = new Map<string, CubesDiceQuestionStudioQuestionV1[]>();
  for (let index = 0; index < 420; index += 1) {
    const question = generateCubesDiceQuestionStudioSeededV1({
      seed: `CND-QS-OPERATOR-REVIEW-V1:${qlId}:${index}`,
      qlId,
      language: "en",
    });
    assertExamSvg(question);
    const bucket = byVariant.get(question.stemVariantId) ?? [];
    if (bucket.length < 24) bucket.push(question);
    byVariant.set(question.stemVariantId, bucket);
  }

  const variants = [...byVariant.keys()].sort();
  assert.equal(variants.length, QUESTIONS_PER_QL, `${qlId}: review pack requires all six stem variants.`);

  const memo = new Set<string>();
  function visit(variantIndex: number, answerMask: number, difficultyMask: number, chosen: CubesDiceQuestionStudioQuestionV1[]): CubesDiceQuestionStudioQuestionV1[] | null {
    if (variantIndex === variants.length) {
      return answerMask === 0b1111 && difficultyMask === 0b111 ? chosen : null;
    }
    const key = `${variantIndex}:${answerMask}:${difficultyMask}`;
    if (memo.has(key)) return null;
    memo.add(key);
    const variant = variants[variantIndex]!;
    const candidates = byVariant.get(variant) ?? [];
    for (const candidate of candidates) {
      const result = visit(
        variantIndex + 1,
        answerMask | (1 << candidate.correctIndex),
        difficultyMask | maskForDifficulty(candidate.difficultyBand),
        [...chosen, candidate],
      );
      if (result) return result;
    }
    return null;
  }

  const selected = visit(0, 0, 0, []);
  assert.ok(selected, `${qlId}: could not find a six-question review slice covering all variants, answer positions and difficulties.`);
  assert.equal(new Set(selected.map((question) => question.stemVariantId)).size, 6, `${qlId}: stem variants are not exhaustive.`);
  assert.equal(new Set(selected.map((question) => question.correctIndex)).size, 4, `${qlId}: all four answer positions must be visible.`);
  assert.equal(new Set(selected.map((question) => question.difficultyBand)).size, 3, `${qlId}: Easy/Medium/Hard must all be visible.`);
  assert.equal(new Set(selected.map((question) => question.contentFingerprint)).size, selected.length, `${qlId}: review slice must contain unique canonical items.`);
  return Object.freeze(selected);
}

assert.equal(CND_001_EXAM_RENDERER_AUTHORITY_V1.strokeWidth, 1.35, "CND exam renderer stroke width changed.");
assert.equal(CND_001_EXAM_RENDERER_AUTHORITY_V1.background, "WHITE", "CND exam renderer background changed.");
assert.equal(CND_001_EXAM_RENDERER_AUTHORITY_V1.cameraPolicy, "CANONICAL_ISOMETRIC_NO_RANDOM_TILT", "CND canonical camera policy changed.");
assert.equal(CND_001_EXAM_RENDERER_AUTHORITY_V1.netPolicy, "ORTHOGONAL_EQUAL_SQUARES_CANONICAL_UPRIGHT", "CND upright cube-net policy changed.");
assert.deepEqual(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.permanentQlIds, QLS);
assert.deepEqual(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.supportedLanguages, LANGUAGES);
assert.equal(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.status, "SEEDED_RUNTIME_IMPLEMENTED_OPERATOR_REVIEW_REQUIRED");
assert.equal(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.questionStudioDiscoverable, false);
assert.equal(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.persistenceAllowed, false);
assert.equal(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.questionBankWritable, false);
assert.equal(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.testEligible, false);
assert.equal(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.publiclyPublishable, false);
assert.equal(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.automaticPublication, false);

const canonicalQuestions = QLS.flatMap((qlId) => chooseSixVariantBalancedQuestions(qlId));
assert.equal(canonicalQuestions.length, EXPECTED_CANONICAL_REVIEW_COUNT);
assert.equal(new Set(canonicalQuestions.map((question) => question.contentFingerprint)).size, EXPECTED_CANONICAL_REVIEW_COUNT);

const localizedByCanonical = new Map<string, readonly CubesDiceQuestionStudioQuestionV1[]>();
for (const english of canonicalQuestions) {
  const surfaces = LANGUAGES.map((language) => language === "en"
    ? english
    : generateCubesDiceQuestionStudioSeededV1({ seed: english.seed, qlId: english.qlId, language }));
  for (const surface of surfaces) {
    assertExamSvg(surface);
    assert.equal(surface.contentFingerprint, english.contentFingerprint);
    assert.equal(surface.canonicalItemId, english.canonicalItemId);
    assert.deepEqual(surface.stimulusSvgs, english.stimulusSvgs);
    assert.deepEqual(surface.options, english.options);
    assert.equal(surface.correctIndex, english.correctIndex);
    assert.equal(surface.canonicalAnswer, english.canonicalAnswer);
    assert.equal(surface.taskKind, english.taskKind);
    assert.equal(surface.candidateId, english.candidateId);
    assert.equal(surface.stemVariantId, english.stemVariantId);
    assert.equal(surface.lifecycle.reviewOnly, true);
    assert.equal(surface.lifecycle.questionStudioDiscoverable, false);
    assert.equal(surface.lifecycle.persistenceAllowed, false);
    assert.equal(surface.lifecycle.questionBankWritable, false);
    assert.equal(surface.lifecycle.testEligible, false);
    assert.equal(surface.lifecycle.publiclyPublishable, false);
    assert.equal(surface.lifecycle.automaticStudentPublication, false);
  }
  assert.match(surfaces[1]!.stem, /\p{Script=Devanagari}/u, `${english.seed}: Hindi review surface lost Devanagari.`);
  assert.match(surfaces[2]!.stem, /\p{Script=Gurmukhi}/u, `${english.seed}: Punjabi review surface lost Gurmukhi.`);
  localizedByCanonical.set(english.canonicalItemId, Object.freeze(surfaces));
}

const qlNames: Readonly<Record<CubesDicePermanentQlIdV1, string>> = Object.freeze({
  "SPA-QL-043": "Dice — opposite face from two views",
  "SPA-QL-044": "Cube net — opposite face after folding",
  "SPA-QL-045": "Painted cube — exact face-count exposure",
});

const cards = canonicalQuestions.map((english, index) => {
  const surfaces = localizedByCanonical.get(english.canonicalItemId)!;
  const languagePanels = surfaces.map((surface) => {
    const explanation = [surface.explanation.whatIsGiven, surface.explanation.howToReason, surface.explanation.conclusion]
      .map((line) => `<p>${escapeHtml(line)}</p>`)
      .join("");
    return `<section class="language"><div class="lang-label">${surface.language.toUpperCase()}</div><div class="stem">${escapeHtml(surface.stem)}</div><details><summary>Explanation</summary>${explanation}</details></section>`;
  }).join("");
  const options = english.options.map((option, optionIndex) => `<div class="option"><span>${english.optionLabels[optionIndex]}.</span><strong>${escapeHtml(String(option))}</strong></div>`).join("");
  return `<article class="card" data-ql="${english.qlId}" data-seed="${escapeHtml(english.seed)}">
    <div class="qnum">Review item ${index + 1} of ${EXPECTED_CANONICAL_REVIEW_COUNT}</div>
    <div class="meta">${english.qlId} · ${escapeHtml(qlNames[english.qlId])} · ${escapeHtml(english.difficultyBand)} · ${escapeHtml(english.stemVariantId)} · answer position ${english.answer}</div>
    <div class="diagram">${english.stimulusSvgs[0]}</div>
    <div class="options">${options}</div>
    <div class="languages">${languagePanels}</div>
    <details class="answer"><summary>Answer / audit metadata</summary><p><strong>Correct:</strong> ${english.answer} (${escapeHtml(String(english.canonicalAnswer))})</p><p><strong>Seed:</strong> ${escapeHtml(english.seed)}</p><p><strong>Fingerprint:</strong> ${escapeHtml(english.contentFingerprint)}</p></details>
  </article>`;
}).join("\n");

const coverageRows = QLS.map((qlId) => {
  const rows = canonicalQuestions.filter((question) => question.qlId === qlId);
  return `<tr><td>${qlId}</td><td>${escapeHtml(qlNames[qlId])}</td><td>${rows.length}</td><td>${new Set(rows.map((q) => q.stemVariantId)).size}/6</td><td>${new Set(rows.map((q) => q.correctIndex)).size}/4</td><td>${new Set(rows.map((q) => q.difficultyBand)).size}/3</td></tr>`;
}).join("");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>CND-001 Question Studio Operator Review V1</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f5f6f8;color:#171717;font-family:Arial,Helvetica,sans-serif}.wrap{max-width:980px;margin:0 auto;padding:24px 16px 64px}.intro,.card{background:#fff;border:1px solid #d9dde3;border-radius:9px}.intro{padding:20px;margin-bottom:18px}.intro h1{margin:0 0 10px;font-size:24px}.intro p{margin:7px 0;line-height:1.5;color:#454b54}.rules{padding-left:20px;line-height:1.6}.coverage{width:100%;border-collapse:collapse;margin-top:14px;font-size:13px}.coverage th,.coverage td{padding:8px;border:1px solid #e1e4e8;text-align:left}.card{padding:20px;margin-bottom:16px}.qnum{font-size:12px;font-weight:700;text-transform:uppercase;color:#666}.meta{font-size:12px;color:#666;margin-top:5px;line-height:1.45}.diagram{display:flex;align-items:center;justify-content:center;min-height:220px;padding:16px;margin-top:14px;background:#fff;border:1px solid #eceff2;border-radius:5px;overflow:hidden}.diagram svg{display:block;width:min(280px,82vw);height:auto;max-height:280px;background:#fff}.options{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.option{display:flex;align-items:center;gap:10px;border:1px solid #e2e5e9;border-radius:5px;padding:10px 12px;background:#fff}.option span{color:#666}.languages{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}.language{border:1px solid #e4e7eb;border-radius:6px;padding:12px;min-width:0}.lang-label{font-size:11px;font-weight:700;color:#666;margin-bottom:8px}.stem{font-size:15px;line-height:1.55}.language details{margin-top:10px}.language details p{font-size:13px;line-height:1.5;margin:7px 0;color:#3f4650}.answer{margin-top:14px;border-top:1px solid #eceff2;padding-top:12px}.answer p{overflow-wrap:anywhere}summary{cursor:pointer;font-weight:600}@media(max-width:760px){.wrap{padding:14px 10px 44px}.card{padding:15px}.languages{grid-template-columns:1fr}.diagram{min-height:190px}.diagram svg{width:min(245px,82vw)}.coverage{font-size:11px}}@media(max-width:480px){.options{grid-template-columns:1fr}.intro h1{font-size:20px}}
</style></head><body><main class="wrap"><section class="intro"><h1>CND-001 Cubes & Dice — Question Studio Operator Review V1</h1><p>This is a review-only generated slice. It does not register CND-001 in normal Question Studio, persist questions, write Question Bank records, make items test-eligible, or publish anything to students.</p><ul class="rules"><li>White background only.</li><li>Thin 1.35px exam-standard geometry strokes.</li><li>No random whole-figure tilt, rotate, skew or free matrix transform.</li><li>Cube nets remain orthogonal, equal-square and upright.</li><li>Canonical isometric diagonals on dice/cubes are intentional perspective geometry, not accidental figure tilt.</li><li>Each permanent QL shows all 6 stem variants, all 4 answer positions and Easy/Medium/Hard.</li></ul><table class="coverage"><thead><tr><th>QL</th><th>Family</th><th>Items</th><th>Variants</th><th>Answer pos.</th><th>Difficulty</th></tr></thead><tbody>${coverageRows}</tbody></table><p><strong>${EXPECTED_CANONICAL_REVIEW_COUNT} canonical questions · ${EXPECTED_CANONICAL_REVIEW_COUNT * LANGUAGES.length} language surfaces.</strong></p></section>${cards}</main></body></html>`;

const qlCoverage = QLS.map((qlId) => {
  const rows = canonicalQuestions.filter((question) => question.qlId === qlId);
  return {
    qlId,
    canonicalQuestions: rows.length,
    stemVariants: [...new Set(rows.map((question) => question.stemVariantId))].sort(),
    answerPositions: [...new Set(rows.map((question) => question.correctIndex))].sort(),
    difficulties: [...new Set(rows.map((question) => question.difficultyBand))].sort(),
    seeds: rows.map((question) => question.seed),
  };
});

const evidence = {
  status: "PASS_CND_001_QUESTION_STUDIO_OPERATOR_REVIEW_CANDIDATE_V1",
  chapterCode: "CND-001",
  packageId: "SPA-001",
  seededRuntimeAuthority: CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.authorityId,
  rendererAuthority: CND_001_EXAM_RENDERER_AUTHORITY_V1.authorityId,
  permanentQls: QLS,
  languages: LANGUAGES,
  canonicalReviewQuestions: canonicalQuestions.length,
  languageSurfaces: canonicalQuestions.length * LANGUAGES.length,
  qlCoverage,
  visualContracts: {
    whiteBackground: true,
    exactStrokeWidth: 1.35,
    randomWholeFigureTiltAllowed: false,
    rotateTransformAllowed: false,
    skewTransformAllowed: false,
    freeMatrixTransformAllowed: false,
    canonicalCubeNetsUpright: true,
    recommendedStimulusPixels: 280,
    mobileMinimumStimulusPixels: 220,
  },
  structuralChecks: {
    allThreePermanentQlsReviewed: true,
    allThreeLanguagesReviewed: true,
    allSixStemVariantsPerQlReviewed: true,
    allFourAnswerPositionsPerQlReviewed: true,
    allThreeDifficultyBandsPerQlReviewed: true,
    exactSolverBacked: true,
    localizedSceneSvgOptionsAnswerParity: true,
    deterministicLifecycleStillReviewOnly: true,
  },
  governance: {
    assistantOperatorReviewAuthorityNotYetGrantedByThisArtifact: true,
    humanVisualArtifactReviewStillRequired: true,
    productOwnerApprovalGranted: false,
    standardQuestionStudioRegistrationAuthorized: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
  nextGate: "DIRECT_HTML_ARTIFACT_REVIEW_THEN_CND_001_OPERATOR_REVIEW_AUTHORITY_V1",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-cnd-001-question-studio-operator-review-v1.html", html);
writeFileSync("dist/reasoning-v1/spatial/spa-cnd-001-question-studio-operator-review-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({
  status: evidence.status,
  canonicalReviewQuestions: evidence.canonicalReviewQuestions,
  languageSurfaces: evidence.languageSurfaces,
  qlCoverage: evidence.qlCoverage.map(({ qlId, canonicalQuestions, stemVariants, answerPositions, difficulties }) => ({ qlId, canonicalQuestions, stemVariants: stemVariants.length, answerPositions: answerPositions.length, difficulties: difficulties.length })),
  visualContracts: evidence.visualContracts,
  governance: evidence.governance,
  nextGate: evidence.nextGate,
}, null, 2));
