import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { FCT_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/counting-figures-english-freeze-v1";
import {
  FCT_001_LOCALIZATION_AUTHORITY_V1,
  localizeCountingFiguresPermanentQuestionV1,
  type CountingFiguresLocalizedQuestionV1,
} from "../foundation/spatial/counting-figures-localization-v1";
import {
  generateCountingFiguresPermanentEnglishQuestionV1,
  type CountingFiguresPermanentEnglishQuestionV1,
} from "../foundation/spatial/counting-figures-permanent-english-runtime-v1";
import type { CountingFigureTargetShapeV1 } from "../foundation/spatial/counting-figures-production-generator-v1";

const TARGETS = ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"] as const satisfies readonly CountingFigureTargetShapeV1[];
const DEVANAGARI_LETTER = /\p{Script=Devanagari}/u;
const GURMUKHI_LETTER = /\p{Script=Gurmukhi}/u;
const INTERNAL = /(?:SMALLEST_ONLY|OMIT_LARGEST|MISS_COMPOSITE_CLASS|DOUBLE_COUNT_LARGEST|NEAR_MISS|TRIANGLE_FAN|CROSSED_QUADRILATERAL_TRIANGLES|DIAGONAL_SQUARE_GRID|DIAGONAL_RECTANGLE_GRID|QUADRILATERAL_LATTICE)/u;

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function learnerText(question: CountingFiguresLocalizedQuestionV1): string {
  return [question.permanentQlTitle, question.stem, question.explanation.observation, question.explanation.rule, question.explanation.application, question.explanation.check].join(" ");
}

function assertParity(source: CountingFiguresPermanentEnglishQuestionV1, localized: CountingFiguresLocalizedQuestionV1): void {
  assert.equal(localized.permanentQlId, source.permanentQlId);
  assert.equal(localized.candidateId, source.candidateId);
  assert.equal(localized.chapterCode, source.chapterCode);
  assert.equal(localized.targetShape, source.targetShape);
  assert.equal(localized.motifFamily, source.motifFamily);
  assert.equal(localized.structuralVariant, source.structuralVariant);
  assert.equal(localized.difficulty, source.difficulty);
  assert.deepEqual(localized.graph, source.graph);
  assert.equal(localized.svg, source.svg);
  assert.equal(localized.correctCount, source.correctCount);
  assert.equal(localized.constructionExpectedCount, source.constructionExpectedCount);
  assert.deepEqual(localized.options, source.options);
  assert.equal(localized.correctIndex, source.correctIndex);
  assert.deepEqual(localized.optionEvidence, source.optionEvidence);
  assert.equal(localized.geometryFingerprint, source.geometryFingerprint);
  assert.equal(localized.structuralFingerprint, source.structuralFingerprint);
  assert.equal(localized.contentFingerprint, source.contentFingerprint);
  assert.equal(localized.stemVariant, source.stemVariant);
  assert.equal(localized.localization.sourceEnglishContentFingerprint, source.contentFingerprint);
  assert.equal(localized.localization.sourceEnglishGeometryFingerprint, source.geometryFingerprint);
  assert.equal(localized.localization.reviewOnly, true);
  assert.equal(localized.localization.frozen, false);
  assert.equal(localized.lifecycle.questionStudioRegistered, false);
  assert.equal(localized.lifecycle.persistenceAllowed, false);
  assert.equal(localized.lifecycle.questionBankWritable, false);
  assert.equal(localized.lifecycle.testEligible, false);
  assert.equal(localized.lifecycle.publiclyPublishable, false);
  assert.equal(localized.lifecycle.automaticStudentPublication, false);
}

function assertLanguage(question: CountingFiguresLocalizedQuestionV1): void {
  const text = learnerText(question);
  assert.ok(question.stem.length > 15);
  assert.ok(question.explanation.observation.length > 25);
  assert.ok(question.explanation.rule.length > 25);
  assert.ok(question.explanation.application.includes(String(question.correctCount)));
  assert.ok(question.explanation.check.includes(String(question.correctCount)));
  assert.ok(!INTERNAL.test(text), `${question.seed}: internal enum leaked into learner text.`);
  if (question.language === "hi") {
    assert.equal(question.locale, "hi-IN");
    assert.ok(DEVANAGARI_LETTER.test(text), `${question.seed}: Hindi lacks Devanagari letters.`);
    assert.ok(!GURMUKHI_LETTER.test(text), `${question.seed}: Hindi contains Gurmukhi letters.`);
  } else {
    assert.equal(question.locale, "pa-IN");
    assert.ok(GURMUKHI_LETTER.test(text), `${question.seed}: Punjabi lacks Gurmukhi letters.`);
    assert.ok(!DEVANAGARI_LETTER.test(text), `${question.seed}: Punjabi contains Devanagari letters.`);
  }
}

assert.equal(FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.status, "FCT_001_PERMANENT_ENGLISH_RUNTIME_V1_FROZEN");
assert.equal(FCT_001_LOCALIZATION_AUTHORITY_V1.englishFreezeAuthorityId, FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId);
assert.deepEqual(FCT_001_LOCALIZATION_AUTHORITY_V1.supportedLanguages, ["hi", "pa"]);
assert.equal(FCT_001_LOCALIZATION_AUTHORITY_V1.questionStudioRegistered, false);
assert.equal(FCT_001_LOCALIZATION_AUTHORITY_V1.persistenceAllowed, false);
assert.equal(FCT_001_LOCALIZATION_AUTHORITY_V1.questionBankWritable, false);
assert.equal(FCT_001_LOCALIZATION_AUTHORITY_V1.testEligible, false);
assert.equal(FCT_001_LOCALIZATION_AUTHORITY_V1.automaticPublication, false);

const canonical = Array.from({ length: 240 }, (_, index) => {
  const targetShape = TARGETS[index % TARGETS.length]!;
  return generateCountingFiguresPermanentEnglishQuestionV1({ seed: `FCT-LOC-V1-${index}`, targetShape });
});
let parityChecks = 0;
let scriptChecks = 0;
let explanationChecks = 0;
const localized: CountingFiguresLocalizedQuestionV1[] = [];
for (const source of canonical) {
  for (const language of ["hi", "pa"] as const) {
    const surface = localizeCountingFiguresPermanentQuestionV1({ seed: source.seed, targetShape: source.targetShape, language });
    assertParity(source, surface);
    assertLanguage(surface);
    assert.deepEqual(localizeCountingFiguresPermanentQuestionV1({ seed: source.seed, targetShape: source.targetShape, language }), surface);
    localized.push(surface);
    parityChecks += 17;
    scriptChecks += 2;
    explanationChecks += 4;
  }
}
assert.equal(localized.length, 480);
assert.equal(new Set(canonical.map((q) => q.geometryFingerprint)).size, 240);
assert.equal(new Set(localized.map((q) => `${q.language}:${q.contentFingerprint}`)).size, 480);
assert.equal(new Set(localized.map((q) => q.motifFamily)).size, 11);
assert.equal(new Set(localized.map((q) => q.targetShape)).size, 4);
assert.equal(new Set(localized.map((q) => q.difficulty)).size, 3);
assert.equal(new Set(localized.map((q) => q.stemVariant)).size, 8);
assert.equal(new Set(localized.map((q) => q.correctIndex)).size, 4);

const pool = Array.from({ length: 720 }, (_, index) => {
  const targetShape = TARGETS[index % TARGETS.length]!;
  return generateCountingFiguresPermanentEnglishQuestionV1({ seed: `FCT-LOC-REVIEW-${index}`, targetShape });
});
const selected: CountingFiguresPermanentEnglishQuestionV1[] = [];
const seen = new Set<string>();
const add = (q: CountingFiguresPermanentEnglishQuestionV1 | undefined) => {
  assert.ok(q, "Unable to satisfy localization review coverage.");
  if (!seen.has(q.seed)) { seen.add(q.seed); selected.push(q); }
};
for (const motif of new Set(pool.map((q) => q.motifFamily))) {
  add(pool.find((q) => q.motifFamily === motif));
  add(pool.find((q) => q.motifFamily === motif && !seen.has(q.seed)));
}
for (const target of TARGETS) while (selected.filter((q) => q.targetShape === target).length < 5) add(pool.find((q) => q.targetShape === target && !seen.has(q.seed)));
for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const) add(pool.find((q) => q.difficulty === difficulty));
for (let stem = 0; stem < 8; stem += 1) add(pool.find((q) => q.stemVariant === stem));
for (let answer = 0; answer < 4; answer += 1) add(pool.find((q) => q.correctIndex === answer));
for (const q of pool) { if (selected.length >= 28) break; add(q); }
assert.ok(selected.length >= 28 && selected.length <= 32);
assert.equal(new Set(selected.map((q) => q.motifFamily)).size, 11);
assert.equal(new Set(selected.map((q) => q.targetShape)).size, 4);
assert.equal(new Set(selected.map((q) => q.difficulty)).size, 3);
assert.equal(new Set(selected.map((q) => q.stemVariant)).size, 8);
assert.equal(new Set(selected.map((q) => q.correctIndex)).size, 4);

const cards = selected.map((source, index) => {
  const hi = localizeCountingFiguresPermanentQuestionV1({ seed: source.seed, targetShape: source.targetShape, language: "hi" });
  const pa = localizeCountingFiguresPermanentQuestionV1({ seed: source.seed, targetShape: source.targetShape, language: "pa" });
  assertParity(source, hi); assertParity(source, pa); assertLanguage(hi); assertLanguage(pa);
  const options = source.options.map((value, i) => `<div class="option"><b>${["A", "B", "C", "D"][i]}</b><span>${value}</span></div>`).join("");
  const lang = (label: string, q: CountingFiguresPermanentEnglishQuestionV1 | CountingFiguresLocalizedQuestionV1) => `<section class="lang"><h3>${label}</h3><p class="stem">${escapeHtml(q.stem)}</p><p><b>Observe:</b> ${escapeHtml(q.explanation.observation)}</p><p><b>Rule:</b> ${escapeHtml(q.explanation.rule)}</p><p><b>Apply:</b> ${escapeHtml(q.explanation.application)}</p><p><b>Check:</b> ${escapeHtml(q.explanation.check)}</p></section>`;
  return `<article class="card"><div class="meta">#${index + 1} · ${escapeHtml(source.targetShape)} · ${escapeHtml(source.motifFamily)} · ${source.difficulty} · Stem ${source.stemVariant + 1}</div><div class="diagram">${source.svg}</div><div class="options">${options}</div><div class="langs">${lang("English", source)}${lang("Hindi", hi)}${lang("Punjabi", pa)}</div><details><summary>Operator evidence</summary><p>Answer ${["A", "B", "C", "D"][source.correctIndex]} = ${source.correctCount} · ${escapeHtml(source.geometryFingerprint)}</p></details></article>`;
}).join("\n");
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FCT-001 Localization Review V1.1</title><style>:root{font-family:Inter,"Noto Sans Devanagari","Noto Sans Gurmukhi",system-ui,sans-serif;color:#111827;background:#f7f7f8}*{box-sizing:border-box}body{margin:0}main{max-width:1120px;margin:auto;padding:16px}.intro,.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin-bottom:16px}.intro h1{margin:0 0 8px;font-size:22px}.intro p,.lang p{line-height:1.6}.meta{font-size:11px;color:#6b7280}.diagram{display:flex;justify-content:center;min-height:180px;padding:12px;margin:12px 0;border:1px solid #eef0f2;border-radius:10px}.diagram svg{width:min(280px,78vw);height:auto}.options{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.option{border:1px solid #d1d5db;border-radius:8px;padding:10px;display:flex;gap:12px;align-items:center}.langs{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}.lang{border-top:1px solid #e5e7eb;padding-top:8px}.lang h3{font-size:13px;margin:0}.lang p{font-size:12px;margin:5px 0}.stem{font-weight:650}details{font-size:11px;color:#4b5563;margin-top:9px}@media(max-width:820px){main{padding:9px}.langs{grid-template-columns:1fr}.options{grid-template-columns:repeat(2,1fr)}}</style></head><body><main><section class="intro"><h1>FCT-001 · Hindi/Punjabi localization review V1.1</h1><p>Frozen English geometry, option values, answer and canonical fingerprints are invariant. Only learner text and locale are localized.</p></section>${cards}</main></body></html>`;
const evidence = {
  status: "PASS_FCT_001_HINDI_PUNJABI_LOCALIZATION_V1_1_CANDIDATE",
  localizationAuthority: FCT_001_LOCALIZATION_AUTHORITY_V1.authorityId,
  englishFreezeAuthority: FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  canonicalEnglishQuestionCount: canonical.length,
  localizedSurfaceCount: localized.length,
  invariantParityChecks: parityChecks,
  scriptChecks,
  explanationChecks,
  unicodeScriptValidation: "UNICODE_SCRIPT_PROPERTY_NOT_BLOCK_RANGE",
  reviewQuestionCount: selected.length,
  reviewLanguageSurfaceCount: selected.length * 3,
  coverage: { motifFamilyCount: 11, targetShapeCount: 4, difficultyCount: 3, stemVariantCount: 8, answerPositionCount: 4, geometryUniqueCount: new Set(selected.map((q) => q.geometryFingerprint)).size },
  governance: { reviewOnly: true, localizationFrozen: false, questionStudioRegistered: false, persistenceAllowed: false, questionBankWritable: false, testEligible: false, automaticPublication: false, mergeAuthorized: false, deploymentPerformed: false },
  nextGate: "DIRECT_DESKTOP_MOBILE_LOCALIZATION_REVIEW_THEN_FCT_001_LOCALIZATION_FREEZE_DECISION",
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-localization-v1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-localization-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
