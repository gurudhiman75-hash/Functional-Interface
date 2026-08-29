import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  enumerateRectanglesV1,
  enumerateSquaresV1,
  enumerateTrianglesV1,
} from "../foundation/spatial/counting-figures-graph-v1";
import { enumerateSimpleQuadrilateralsV2 } from "../foundation/spatial/counting-figures-graph-v2";
import { generateCountingFiguresPermanentEnglishQuestionV1 } from "../foundation/spatial/counting-figures-permanent-english-runtime-v1";
import {
  FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1,
  generateCountingFiguresQuestionStudioSeededV1,
} from "../foundation/spatial/counting-figures-question-studio-seeded-runtime-v1";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function independentCount(source: ReturnType<typeof generateCountingFiguresPermanentEnglishQuestionV1>): number {
  switch (source.targetShape) {
    case "TRIANGLE": return enumerateTrianglesV1(source.graph).length;
    case "SQUARE": return enumerateSquaresV1(source.graph).length;
    case "RECTANGLE": return enumerateRectanglesV1(source.graph, "INCLUDE_SQUARES").length;
    case "QUADRILATERAL": return enumerateSimpleQuadrilateralsV2(source.graph).length;
  }
}

const pool = Object.freeze(Array.from({ length: 960 }, (_, index) => {
  const seed = `FCT-QS-OPERATOR-${index}`;
  const studio = generateCountingFiguresQuestionStudioSeededV1({ seed, language: "en" });
  const source = generateCountingFiguresPermanentEnglishQuestionV1({ seed, targetShape: studio.targetShape });
  assert.equal(studio.geometryFingerprint, source.geometryFingerprint);
  assert.equal(studio.contentFingerprint, source.contentFingerprint);
  return Object.freeze({ seed, studio, source });
}));

const required = new Set<string>();
for (const motif of new Set(pool.map((item) => item.source.motifFamily))) required.add(`motif:${motif}`);
for (const target of new Set(pool.map((item) => item.source.targetShape))) required.add(`target:${target}`);
for (const difficulty of new Set(pool.map((item) => item.source.difficulty))) required.add(`difficulty:${difficulty}`);
for (const stem of new Set(pool.map((item) => item.source.stemVariant))) required.add(`stem:${stem}`);
for (const answer of new Set(pool.map((item) => item.source.correctIndex))) required.add(`answer:${answer}`);
for (const kind of new Set(pool.flatMap((item) => item.source.optionEvidence.map((entry) => entry.kind).filter((kind) => kind !== "CORRECT")))) {
  required.add(`distractor:${kind}`);
}

function coverageTokens(item: typeof pool[number]): readonly string[] {
  return [
    `motif:${item.source.motifFamily}`,
    `target:${item.source.targetShape}`,
    `difficulty:${item.source.difficulty}`,
    `stem:${item.source.stemVariant}`,
    `answer:${item.source.correctIndex}`,
    ...item.source.optionEvidence.filter((entry) => entry.kind !== "CORRECT").map((entry) => `distractor:${entry.kind}`),
  ];
}

const selected: typeof pool[number][] = [];
const selectedSeeds = new Set<string>();
const uncovered = new Set(required);
const add = (item: typeof pool[number] | undefined) => {
  assert.ok(item, "Unable to satisfy FCT-001 Question Studio operator-review coverage.");
  if (selectedSeeds.has(item.seed)) return;
  selectedSeeds.add(item.seed);
  selected.push(item);
  for (const token of coverageTokens(item)) uncovered.delete(token);
};

while (uncovered.size) {
  let best: typeof pool[number] | undefined;
  let score = -1;
  for (const item of pool) {
    if (selectedSeeds.has(item.seed)) continue;
    const candidateScore = coverageTokens(item).filter((token) => uncovered.has(token)).length;
    if (candidateScore > score) {
      best = item;
      score = candidateScore;
    }
  }
  assert.ok(best && score > 0, `Uncovered FCT operator-review dimensions: ${[...uncovered].join(", ")}`);
  add(best);
}

for (const motif of new Set(pool.map((item) => item.source.motifFamily))) {
  while (selected.filter((item) => item.source.motifFamily === motif).length < 2) {
    add(pool.find((item) => item.source.motifFamily === motif && !selectedSeeds.has(item.seed)));
  }
}
for (const target of new Set(pool.map((item) => item.source.targetShape))) {
  while (selected.filter((item) => item.source.targetShape === target).length < 4) {
    add(pool.find((item) => item.source.targetShape === target && !selectedSeeds.has(item.seed)));
  }
}
for (const item of pool) {
  if (selected.length >= 28) break;
  add(item);
}

assert.equal(selected.length, 28, `Expected 28 operator-review questions, got ${selected.length}.`);
assert.equal(new Set(selected.map((item) => item.source.motifFamily)).size, 11);
assert.equal(new Set(selected.map((item) => item.source.targetShape)).size, 4);
assert.equal(new Set(selected.map((item) => item.source.difficulty)).size, 3);
assert.equal(new Set(selected.map((item) => item.source.stemVariant)).size, 8);
assert.equal(new Set(selected.map((item) => item.source.correctIndex)).size, 4);
assert.equal(new Set(selected.flatMap((item) => item.source.optionEvidence.map((entry) => entry.kind).filter((kind) => kind !== "CORRECT"))).size, 5);
assert.equal(new Set(selected.map((item) => item.source.geometryFingerprint)).size, 28);

let languageSurfaceCount = 0;
let lockedLifecycleCount = 0;
let languageParityChecks = 0;
let independentSolverChecks = 0;

const cards = selected.map((item, index) => {
  const source = item.source;
  assert.equal(independentCount(source), source.correctCount);
  independentSolverChecks += 1;

  const en = generateCountingFiguresQuestionStudioSeededV1({ seed: item.seed, language: "en" });
  const hi = generateCountingFiguresQuestionStudioSeededV1({ seed: item.seed, language: "hi" });
  const pa = generateCountingFiguresQuestionStudioSeededV1({ seed: item.seed, language: "pa" });
  const surfaces = [en, hi, pa] as const;

  for (const question of surfaces) {
    assert.equal(question.lifecycle.reviewOnly, true);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.persistenceAllowed, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.automaticStudentPublication, false);
    lockedLifecycleCount += 7;
    languageSurfaceCount += 1;
  }

  for (const localized of [hi, pa]) {
    assert.equal(localized.targetShape, en.targetShape);
    assert.equal(localized.motifFamily, en.motifFamily);
    assert.equal(localized.structuralVariant, en.structuralVariant);
    assert.equal(localized.canonicalItemId, en.canonicalItemId);
    assert.equal(localized.geometryFingerprint, en.geometryFingerprint);
    assert.equal(localized.structuralFingerprint, en.structuralFingerprint);
    assert.equal(localized.contentFingerprint, en.contentFingerprint);
    assert.deepEqual(localized.stimulusSvgs, en.stimulusSvgs);
    assert.deepEqual(localized.options, en.options);
    assert.equal(localized.correctIndex, en.correctIndex);
    assert.equal(localized.answer, en.answer);
    languageParityChecks += 11;
  }

  assert.equal(en.geometryFingerprint, source.geometryFingerprint);
  assert.equal(en.contentFingerprint, source.contentFingerprint);
  assert.deepEqual(en.options, source.options);
  assert.equal(en.correctIndex, source.correctIndex);

  const options = en.options.map((value, optionIndex) => `<div class="option"><span class="letter">${["A", "B", "C", "D"][optionIndex]}</span><span class="value">${value}</span></div>`).join("");
  const languageBlock = (label: string, question: typeof en) => `<section class="lang"><h3>${label}</h3><p class="stem">${escapeHtml(question.stem)}</p><p><b>Observe:</b> ${escapeHtml(question.explanation.observation)}</p><p><b>Rule:</b> ${escapeHtml(question.explanation.rule)}</p><p><b>Apply:</b> ${escapeHtml(question.explanation.application)}</p><p><b>Check:</b> ${escapeHtml(question.explanation.check)}</p></section>`;
  const distractors = source.optionEvidence.filter((entry) => entry.kind !== "CORRECT").map((entry) => `${entry.kind}:${entry.value}`).join(" · ");
  return `<article class="card"><div class="qnum">Question ${index + 1}</div><div class="meta">${escapeHtml(en.targetShape)} · ${escapeHtml(en.motifFamily)} · ${en.difficultyBand} · Stem ${source.stemVariant + 1}</div><div class="diagram">${en.stimulusSvgs[0]}</div><div class="options">${options}</div><div class="langs">${languageBlock("English", en)}${languageBlock("Hindi", hi as typeof en)}${languageBlock("Punjabi", pa as typeof en)}</div><details><summary>Operator evidence</summary><p>Answer: ${en.answer} (${source.correctCount}) · ${escapeHtml(distractors)} · Geometry: ${escapeHtml(en.geometryFingerprint)}</p></details></article>`;
}).join("\n");

assert.equal(languageSurfaceCount, 84);
assert.equal(lockedLifecycleCount, 588);
assert.equal(languageParityChecks, 616);
assert.equal(independentSolverChecks, 28);

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>FCT-001 Question Studio Operator Review V1</title><style>:root{font-family:Inter,"Noto Sans Devanagari","Noto Sans Gurmukhi",system-ui,sans-serif;color:#111827;background:#f6f7f9}*{box-sizing:border-box}body{margin:0}main{max-width:1120px;margin:auto;padding:18px}.intro,.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:18px;margin-bottom:16px}.intro h1{font-size:22px;margin:0 0 8px}.intro p{font-size:13px;line-height:1.55;color:#4b5563}.qnum{font-size:11px;font-weight:700;text-transform:uppercase;color:#6b7280}.meta{font-size:11px;color:#6b7280;margin-top:4px}.diagram{display:flex;justify-content:center;align-items:center;min-height:190px;margin:12px 0;border:1px solid #eef0f2;border-radius:12px;padding:12px}.diagram svg{width:min(300px,82vw);height:auto;display:block}.options{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.option{min-height:52px;border:1px solid #d1d5db;border-radius:9px;display:flex;align-items:center;gap:10px;padding:9px}.letter{width:24px;height:24px;border:1px solid #d1d5db;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:700}.value{font-weight:650}.langs{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}.lang{border-top:1px solid #e5e7eb;padding-top:9px}.lang h3{margin:0 0 6px;font-size:13px}.lang p{font-size:12px;line-height:1.62;margin:5px 0}.stem{font-weight:650}details{margin-top:10px;font-size:11px;color:#4b5563}@media(max-width:820px){.langs{grid-template-columns:1fr}.options{grid-template-columns:repeat(2,1fr)}main{padding:10px}.intro,.card{padding:14px}}</style></head><body><main><section class="intro"><h1>FCT-001 · Question Studio Operator Review V1</h1><p>Review-only seeded runtime for SPA-QL-042. Answer evidence stays collapsed. No persistence, Question Bank write, test eligibility, public release or automatic publication is enabled.</p></section>${cards}</main></body></html>`;

const evidence = {
  status: "PASS_FCT_001_QUESTION_STUDIO_OPERATOR_REVIEW_V1_CANDIDATE",
  runtimeAuthorityId: FCT_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.authorityId,
  reviewQuestionCount: selected.length,
  languageSurfaceCount,
  lockedLifecycleCount,
  languageParityChecks,
  independentSolverChecks,
  coverage: {
    motifFamilyCount: new Set(selected.map((item) => item.source.motifFamily)).size,
    targetShapeCount: new Set(selected.map((item) => item.source.targetShape)).size,
    difficultyBandCount: new Set(selected.map((item) => item.source.difficulty)).size,
    stemVariantCount: new Set(selected.map((item) => item.source.stemVariant)).size,
    answerPositionCount: new Set(selected.map((item) => item.source.correctIndex)).size,
    distractorFamilyCount: new Set(selected.flatMap((item) => item.source.optionEvidence.map((entry) => entry.kind).filter((kind) => kind !== "CORRECT"))).size,
    geometryUniqueCount: new Set(selected.map((item) => item.source.geometryFingerprint)).size,
    implicitTargetQuestionCount: selected.length,
  },
  governance: {
    operatorReviewRequired: true,
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticPublication: false,
  },
  nextGate: "DIRECT_DESKTOP_MOBILE_OPERATOR_REVIEW_THEN_PRODUCT_OWNER_STANDARD_REGISTRATION_DECISION",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-question-studio-operator-review-v1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-question-studio-operator-review-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
