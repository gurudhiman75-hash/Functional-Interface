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
const LANGUAGES = ["hi", "pa"] as const;
const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const FORBIDDEN_INTERNAL_TEXT = [
  "SMALLEST_ONLY",
  "OMIT_LARGEST",
  "MISS_COMPOSITE_CLASS",
  "DOUBLE_COUNT_LARGEST",
  "NEAR_MISS",
  "TRIANGLE_FAN",
  "CROSSED_QUADRILATERAL_TRIANGLES",
  "DIAGONAL_SQUARE_GRID",
  "DIAGONAL_RECTANGLE_GRID",
  "QUADRILATERAL_LATTICE",
];

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function assertInvariantParity(
  source: CountingFiguresPermanentEnglishQuestionV1,
  localized: CountingFiguresLocalizedQuestionV1,
): void {
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

function assertLocalizedText(question: CountingFiguresLocalizedQuestionV1): void {
  const text = [
    question.permanentQlTitle,
    question.stem,
    question.explanation.observation,
    question.explanation.rule,
    question.explanation.application,
    question.explanation.check,
  ].join(" ");
  assert.ok(question.stem.length > 15);
  assert.ok(question.explanation.observation.length > 30);
  assert.ok(question.explanation.rule.length > 30);
  assert.ok(question.explanation.application.includes(String(question.correctCount)));
  assert.ok(question.explanation.check.includes(String(question.correctCount)));
  for (const forbidden of FORBIDDEN_INTERNAL_TEXT) assert.ok(!text.includes(forbidden), `${question.seed}: leaked ${forbidden}`);
  if (question.language === "hi") {
    assert.equal(question.locale, "hi-IN");
    assert.ok(DEVANAGARI.test(text), `${question.seed}: Hindi surface lacks Devanagari.`);
    assert.ok(!GURMUKHI.test(text), `${question.seed}: Hindi surface contains Gurmukhi.`);
  } else {
    assert.equal(question.locale, "pa-IN");
    assert.ok(GURMUKHI.test(text), `${question.seed}: Punjabi surface lacks Gurmukhi.`);
    assert.ok(!DEVANAGARI.test(text), `${question.seed}: Punjabi surface contains Devanagari.`);
  }
}

assert.equal(FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.status, "FCT_001_PERMANENT_ENGLISH_RUNTIME_V1_FROZEN");
assert.equal(FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.governance.hindiPunjabiGenerationAllowed, true);
assert.equal(FCT_001_LOCALIZATION_AUTHORITY_V1.englishFreezeAuthorityId, FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId);
assert.deepEqual(FCT_001_LOCALIZATION_AUTHORITY_V1.supportedLanguages, ["hi", "pa"]);
assert.equal(FCT_001_LOCALIZATION_AUTHORITY_V1.questionStudioRegistered, false);
assert.equal(FCT_001_LOCALIZATION_AUTHORITY_V1.persistenceAllowed, false);
assert.equal(FCT_001_LOCALIZATION_AUTHORITY_V1.questionBankWritable, false);
assert.equal(FCT_001_LOCALIZATION_AUTHORITY_V1.testEligible, false);
assert.equal(FCT_001_LOCALIZATION_AUTHORITY_V1.automaticPublication, false);

const canonical = Array.from({ length: 240 }, (_, index) => {
  const targetShape = TARGETS[index % TARGETS.length]!;
  const seed = `FCT-LOC-V1-${index}`;
  return generateCountingFiguresPermanentEnglishQuestionV1({ seed, targetShape });
});

const localizedSurfaces: CountingFiguresLocalizedQuestionV1[] = [];
let parityChecks = 0;
let scriptChecks = 0;
let explanationChecks = 0;
for (const source of canonical) {
  for (const language of LANGUAGES) {
    const localized = localizeCountingFiguresPermanentQuestionV1({
      seed: source.seed,
      targetShape: source.targetShape,
      language,
    });
    assertInvariantParity(source, localized);
    assertLocalizedText(localized);
    const replay = localizeCountingFiguresPermanentQuestionV1({
      seed: source.seed,
      targetShape: source.targetShape,
      language,
    });
    assert.deepEqual(replay, localized);
    localizedSurfaces.push(localized);
    parityChecks += 17;
    scriptChecks += 2;
    explanationChecks += 4;
  }
}

assert.equal(canonical.length, 240);
assert.equal(localizedSurfaces.length, 480);
assert.equal(new Set(canonical.map((question) => question.geometryFingerprint)).size, 240);
assert.equal(new Set(localizedSurfaces.map((question) => `${question.language}:${question.contentFingerprint}`)).size, 480);
assert.equal(new Set(localizedSurfaces.map((question) => question.motifFamily)).size, 11);
assert.equal(new Set(localizedSurfaces.map((question) => question.targetShape)).size, 4);
assert.equal(new Set(localizedSurfaces.map((question) => question.difficulty)).size, 3);
assert.equal(new Set(localizedSurfaces.map((question) => question.stemVariant)).size, 8);
assert.equal(new Set(localizedSurfaces.map((question) => question.correctIndex)).size, 4);
assert.equal(new Set(localizedSurfaces.map((question) => question.language)).size, 2);

const pool = Array.from({ length: 720 }, (_, index) => {
  const targetShape = TARGETS[index % TARGETS.length]!;
  return generateCountingFiguresPermanentEnglishQuestionV1({ seed: `FCT-LOC-REVIEW-${index}`, targetShape });
});

function coverageTokens(question: CountingFiguresPermanentEnglishQuestionV1): readonly string[] {
  return [
    `motif:${question.motifFamily}`,
    `target:${question.targetShape}`,
    `difficulty:${question.difficulty}`,
    `stem:${question.stemVariant}`,
    `answer:${question.correctIndex}`,
  ];
}

const required = new Set<string>();
for (const motif of new Set(pool.map((question) => question.motifFamily))) required.add(`motif:${motif}`);
for (const target of TARGETS) required.add(`target:${target}`);
for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const) required.add(`difficulty:${difficulty}`);
for (let stem = 0; stem < 8; stem += 1) required.add(`stem:${stem}`);
for (let answer = 0; answer < 4; answer += 1) required.add(`answer:${answer}`);

const selected: CountingFiguresPermanentEnglishQuestionV1[] = [];
const selectedSeeds = new Set<string>();
const uncovered = new Set(required);
const add = (question: CountingFiguresPermanentEnglishQuestionV1 | undefined) => {
  assert.ok(question, "Unable to satisfy FCT localization review coverage.");
  if (selectedSeeds.has(question.seed)) return;
  selectedSeeds.add(question.seed);
  selected.push(question);
  for (const token of coverageTokens(question)) uncovered.delete(token);
};
while (uncovered.size) {
  let best: CountingFiguresPermanentEnglishQuestionV1 | undefined;
  let score = -1;
  for (const question of pool) {
    if (selectedSeeds.has(question.seed)) continue;
    const candidateScore = coverageTokens(question).filter((token) => uncovered.has(token)).length;
    if (candidateScore > score) {
      best = question;
      score = candidateScore;
    }
  }
  assert.ok(best && score > 0, `Uncovered localization dimensions: ${[...uncovered].join(", ")}`);
  add(best);
}
for (const target of TARGETS) {
  while (selected.filter((question) => question.targetShape === target).length < 5) {
    add(pool.find((question) => question.targetShape === target && !selectedSeeds.has(question.seed)));
  }
}
for (const motif of new Set(pool.map((question) => question.motifFamily))) {
  while (selected.filter((question) => question.motifFamily === motif).length < 2) {
    add(pool.find((question) => question.motifFamily === motif && !selectedSeeds.has(question.seed)));
  }
}
for (const question of pool) {
  if (selected.length >= 28) break;
  if (!selectedSeeds.has(question.seed)) add(question);
}
assert.ok(selected.length >= 28 && selected.length <= 32);

const cards = selected.map((source, index) => {
  const hi = localizeCountingFiguresPermanentQuestionV1({ seed: source.seed, targetShape: source.targetShape, language: "hi" });
  const pa = localizeCountingFiguresPermanentQuestionV1({ seed: source.seed, targetShape: source.targetShape, language: "pa" });
  assertInvariantParity(source, hi);
  assertInvariantParity(source, pa);
  const options = source.options.map((value, optionIndex) => `<div class="option"><span class="letter">${["A", "B", "C", "D"][optionIndex]}</span><span class="value">${value}</span></div>`).join("");
  const lang = (label: string, question: CountingFiguresPermanentEnglishQuestionV1 | CountingFiguresLocalizedQuestionV1) => `<section class="lang"><h3>${label}</h3><p class="stem">${escapeHtml(question.stem)}</p><p><b>Observe:</b> ${escapeHtml(question.explanation.observation)}</p><p><b>Rule:</b> ${escapeHtml(question.explanation.rule)}</p><p><b>Apply:</b> ${escapeHtml(question.explanation.application)}</p><p><b>Check:</b> ${escapeHtml(question.explanation.check)}</p></section>`;
  return `<article class="card"><div class="qnum">Question ${index + 1}</div><div class="meta">${escapeHtml(source.targetShape)} · ${escapeHtml(source.motifFamily)} · ${source.difficulty} · Stem ${source.stemVariant + 1}</div><div class="diagram">${source.svg}</div><div class="options">${options}</div><div class="langs">${lang("English", source)}${lang("Hindi", hi)}${lang("Punjabi", pa)}</div><details><summary>Operator evidence</summary><p>Answer: ${["A", "B", "C", "D"][source.correctIndex]} (${source.correctCount}) · ${escapeHtml(source.geometryFingerprint)} · ${escapeHtml(source.contentFingerprint)}</p></details></article>`;
}).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>FCT-001 Hindi Punjabi Localization Review V1</title><style>:root{font-family:Inter,"Noto Sans Devanagari","Noto Sans Gurmukhi",system-ui,sans-serif;color:#111827;background:#f6f7f9}*{box-sizing:border-box}body{margin:0}main{max-width:1120px;margin:auto;padding:18px}.intro,.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:18px;margin-bottom:16px}.intro h1{font-size:22px;margin:0 0 8px}.intro p{font-size:13px;line-height:1.55;color:#4b5563}.qnum{font-size:11px;font-weight:700;text-transform:uppercase;color:#6b7280}.meta{font-size:11px;color:#6b7280;margin-top:4px}.diagram{display:flex;justify-content:center;align-items:center;min-height:180px;margin:12px 0;border:1px solid #eef0f2;border-radius:12px;padding:12px}.diagram svg{width:min(280px,78vw);height:auto}.options{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.option{min-height:50px;border:1px solid #d1d5db;border-radius:9px;display:flex;align-items:center;gap:10px;padding:9px}.letter{width:24px;height:24px;border:1px solid #d1d5db;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:700}.value{font-weight:650}.langs{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}.lang{border-top:1px solid #e5e7eb;padding-top:9px}.lang h3{margin:0 0 6px;font-size:13px}.lang p{font-size:12px;line-height:1.62;margin:5px 0}.stem{font-weight:650}details{margin-top:10px;font-size:11px;color:#4b5563}@media(max-width:820px){.langs{grid-template-columns:1fr}.options{grid-template-columns:repeat(2,1fr)}main{padding:10px}.intro,.card{padding:14px}}</style></head><body><main><section class="intro"><h1>FCT-001 · Hindi/Punjabi localization review</h1><p>English geometry, options, answer and canonical fingerprints are frozen. Only title, stem, explanation, language and locale are localized. Question Studio, persistence and publication remain disabled.</p></section>${cards}</main></body></html>`;

const evidence = {
  status: "PASS_FCT_001_HINDI_PUNJABI_LOCALIZATION_V1_CANDIDATE",
  localizationAuthority: FCT_001_LOCALIZATION_AUTHORITY_V1.authorityId,
  englishFreezeAuthority: FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  canonicalEnglishQuestionCount: canonical.length,
  localizedSurfaceCount: localizedSurfaces.length,
  invariantParityChecks: parityChecks,
  scriptChecks,
  explanationChecks,
  reviewQuestionCount: selected.length,
  reviewLanguageSurfaceCount: selected.length * 3,
  coverage: {
    motifFamilyCount: new Set(selected.map((question) => question.motifFamily)).size,
    targetShapeCount: new Set(selected.map((question) => question.targetShape)).size,
    difficultyCount: new Set(selected.map((question) => question.difficulty)).size,
    stemVariantCount: new Set(selected.map((question) => question.stemVariant)).size,
    answerPositionCount: new Set(selected.map((question) => question.correctIndex)).size,
    geometryUniqueCount: new Set(selected.map((question) => question.geometryFingerprint)).size,
  },
  invariants: {
    graph: true,
    svg: true,
    targetShape: true,
    motifFamily: true,
    structuralVariant: true,
    difficulty: true,
    options: true,
    correctCount: true,
    constructionExpectedCount: true,
    correctIndex: true,
    distractorEvidence: true,
    geometryFingerprint: true,
    structuralFingerprint: true,
    canonicalContentFingerprint: true,
    stemVariant: true,
  },
  governance: {
    reviewOnly: true,
    localizationFrozen: false,
    questionStudioRegistered: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    automaticPublication: false,
    mergeAuthorized: false,
    deploymentPerformed: false,
  },
  nextGate: "DIRECT_DESKTOP_MOBILE_LOCALIZATION_REVIEW_THEN_FCT_001_LOCALIZATION_FREEZE_DECISION",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-localization-v1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-localization-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
