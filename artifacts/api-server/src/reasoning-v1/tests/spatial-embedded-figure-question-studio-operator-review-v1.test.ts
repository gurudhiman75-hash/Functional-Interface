import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { generateEmbeddedFigurePermanentEnglishQuestionV1 } from "../foundation/spatial/embedded-figure-permanent-english-runtime-v1";
import {
  EMBEDDED_FIGURE_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1,
  generateEmbeddedFigureQuestionStudioSeededV1,
} from "../foundation/spatial/embedded-figure-question-studio-seeded-runtime-v1";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const pool = Object.freeze(Array.from({ length: 720 }, (_, index) => generateEmbeddedFigurePermanentEnglishQuestionV1(`EMB-QS-REVIEW-${index}`)));
const selected: typeof pool[number][] = [];
const seen = new Set<string>();
const add = (question: typeof pool[number] | undefined) => {
  assert.ok(question, "Unable to satisfy EMB-001 Question Studio operator-review coverage.");
  if (seen.has(question.seed)) return;
  seen.add(question.seed);
  selected.push(question);
};

const families = [...new Set(pool.map((question) => question.motifFamily))].sort();
for (const family of families) {
  for (const difficulty of ["L1", "L2", "L3"] as const) add(pool.find((question) => question.motifFamily === family && question.difficulty === difficulty));
}
for (let stemVariant = 0; stemVariant < 8; stemVariant += 1) add(pool.find((question) => question.stemVariant === stemVariant));
for (let correctIndex = 0; correctIndex < 4; correctIndex += 1) add(pool.find((question) => question.correctIndex === correctIndex));
for (const trap of ["ROTATION_TRAP", "REFLECTION_TRAP", "MISSING_EDGE", "WRONG_INCIDENCE", "NON_UNIFORM_SCALE"] as const) add(pool.find((question) => question.distractorKindsByIndex.includes(trap)));
add(pool.find((question) => question.connectivityValidation.sourceComponentCounts.some((count) => count > 1)));

assert.equal(selected.length, 25, `Expected 25 operator-review questions, got ${selected.length}.`);
assert.equal(new Set(selected.map((question) => question.motifFamily)).size, 8);
assert.equal(new Set(selected.map((question) => question.difficulty)).size, 3);
assert.equal(new Set(selected.map((question) => question.stemVariant)).size, 8);
assert.equal(new Set(selected.map((question) => question.correctIndex)).size, 4);
assert.equal(new Set(selected.flatMap((question) => question.distractorKindsByIndex.filter((kind) => kind !== "CORRECT"))).size, 5);

let languageSurfaceCount = 0;
let lockedLifecycleCount = 0;
let answerParityChecks = 0;
const cards = selected.map((source, index) => {
  const en = generateEmbeddedFigureQuestionStudioSeededV1({ seed: source.seed, language: "en" });
  const hi = generateEmbeddedFigureQuestionStudioSeededV1({ seed: source.seed, language: "hi" });
  const pa = generateEmbeddedFigureQuestionStudioSeededV1({ seed: source.seed, language: "pa" });
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
  assert.equal(en.answer, hi.answer);
  assert.equal(en.answer, pa.answer);
  assert.equal(en.correctIndex, hi.correctIndex);
  assert.equal(en.correctIndex, pa.correctIndex);
  assert.deepEqual(en.optionSvgs, hi.optionSvgs);
  assert.deepEqual(en.optionSvgs, pa.optionSvgs);
  answerParityChecks += 6;

  const options = en.optionSvgs.map((svg, optionIndex) => `<div class="option"><b>${["A", "B", "C", "D"][optionIndex]}</b>${svg}</div>`).join("");
  const languageBlock = (label: string, question: typeof en) => `<section class="lang"><h3>${label}</h3><p class="stem">${escapeHtml(question.stem)}</p><p><b>Observe:</b> ${escapeHtml(question.explanation.observation)}</p><p><b>Rule:</b> ${escapeHtml(question.explanation.rule)}</p><p><b>Apply:</b> ${escapeHtml(question.explanation.application)}</p><p><b>Check:</b> ${escapeHtml(question.explanation.check)}</p></section>`;
  return `<article class="card"><div class="meta">#${index + 1} · ${escapeHtml(en.motifFamily)} · ${en.difficultyBand} · Stem ${source.stemVariant + 1}</div><div class="target"><div><b>Question figure</b>${en.stimulusSvgs[0]}</div><div class="options">${options}</div></div><div class="langs">${languageBlock("English", en)}${languageBlock("Hindi", hi as typeof en)}${languageBlock("Punjabi", pa as typeof en)}</div><details><summary>Operator evidence</summary><p>Answer: ${en.answer} · Canonical ID: ${escapeHtml(en.canonicalItemId)} · Geometry: ${escapeHtml(en.geometryFingerprint)}</p></details></article>`;
}).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>EMB-001 Question Studio Operator Review V1</title><style>:root{font-family:Inter,system-ui,sans-serif;color:#0f172a;background:#f8fafc}*{box-sizing:border-box}body{margin:0}main{max-width:1180px;margin:auto;padding:18px}.intro,.card{background:white;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin-bottom:16px}.meta{font-size:11px;color:#64748b}.target{display:grid;grid-template-columns:170px 1fr;gap:14px;margin:12px 0}.target svg,.option svg{width:100%;height:auto;display:block}.options{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.option{border:1px solid #cbd5e1;border-radius:8px;padding:5px}.langs{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.lang{border-top:1px solid #e2e8f0;padding-top:9px}.lang h3{margin:0 0 6px;font-size:13px}.lang p{font-size:12px;line-height:1.55;margin:5px 0}.stem{font-weight:650}details{margin-top:8px;color:#475569;font-size:11px}@media(max-width:800px){.target,.langs{grid-template-columns:1fr}.options{grid-template-columns:repeat(2,1fr)}}</style></head><body><main><section class="intro"><h1>EMB-001 · Question Studio Operator Review V1</h1><p>Review-only seeded runtime. Learner surface is neutral; answer evidence is collapsed. No persistence, Question Bank write, test eligibility, public release or automatic publication is enabled.</p></section>${cards}</main></body></html>`;

const evidence = {
  status: "PASS_EMB_001_QUESTION_STUDIO_OPERATOR_REVIEW_V1_CANDIDATE",
  runtimeAuthorityId: EMBEDDED_FIGURE_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.authorityId,
  reviewQuestionCount: selected.length,
  languageSurfaceCount,
  lockedLifecycleCount,
  answerParityChecks,
  coverage: {
    motifFamilyCount: new Set(selected.map((question) => question.motifFamily)).size,
    difficultyBandCount: new Set(selected.map((question) => question.difficulty)).size,
    stemVariantCount: new Set(selected.map((question) => question.stemVariant)).size,
    answerPositionCount: new Set(selected.map((question) => question.correctIndex)).size,
    distractorFamilyCount: new Set(selected.flatMap((question) => question.distractorKindsByIndex.filter((kind) => kind !== "CORRECT"))).size,
    connectivityRemediationQuestionCount: selected.filter((question) => question.connectivityValidation.sourceComponentCounts.some((count) => count > 1)).length,
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
  nextGate: "PRODUCT_OWNER_OPERATOR_REVIEW_THEN_STANDARD_QUESTION_STUDIO_REGISTRATION_PROPOSAL",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-emb-001-question-studio-operator-review-v1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-emb-001-question-studio-operator-review-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
