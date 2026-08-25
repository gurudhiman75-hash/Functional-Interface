import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1_1,
  generatePfcTpfStudioQuestionV1_1,
  type PfcTpfStudioQlIdV1,
  type PfcTpfStudioQuestionV1,
} from "../foundation/spatial/paper-folding-question-studio-seeded-runtime-v1-1";
import { PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 } from "../foundation/spatial/paper-folding-localization-freeze-v2";

const QLS = [
  "SPA-QL-035",
  "SPA-QL-036",
  "SPA-QL-037",
  "SPA-QL-038",
  "SPA-QL-039",
  "SPA-QL-040",
] as const satisfies readonly PfcTpfStudioQlIdV1[];
const LANGUAGES = ["en", "hi", "pa"] as const;
const LETTERS = ["A", "B", "C", "D"] as const;
const DEVANAGARI = /[\u0900-\u097F]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;

function hash32(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function boundaryNotchRequested(seed: string): boolean {
  return hash32(`${seed}:ql038-boundary-topology-v1-1`) % 4 === 0;
}

function findBoundarySeed(): string {
  for (let index = 0; index < 1000; index += 1) {
    const seed = `pfc-studio-boundary-review-${index}`;
    if (boundaryNotchRequested(seed)) return seed;
  }
  throw new Error("Unable to locate deterministic QL-038 boundary-notch seed.");
}

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function cutoutMarks(svg: string): Array<{ x: number; y: number }> {
  const marks: Array<{ x: number; y: number }> = [];
  const circle = /<circle\b[^>]*data-cutout="transparent"[^>]*>/g;
  for (const match of svg.matchAll(circle)) {
    const tag = match[0];
    const x = Number(tag.match(/\bcx="([\-0-9.]+)"/)?.[1]);
    const y = Number(tag.match(/\bcy="([\-0-9.]+)"/)?.[1]);
    if (Number.isFinite(x) && Number.isFinite(y)) marks.push({ x, y });
  }
  return marks;
}

function normalizedMarkSignature(svg: string): string | null {
  const marks = cutoutMarks(svg);
  if (marks.length < 2) return null;
  const cx = marks.reduce((sum, mark) => sum + mark.x, 0) / marks.length;
  const cy = marks.reduce((sum, mark) => sum + mark.y, 0) / marks.length;
  const centered = marks.map((mark) => ({ x: mark.x - cx, y: mark.y - cy }));
  const scale = Math.max(
    1e-9,
    ...centered.map((mark) => Math.hypot(mark.x, mark.y)),
  );
  return centered
    .map((mark) => `${(mark.x / scale).toFixed(2)},${(mark.y / scale).toFixed(2)}`)
    .sort()
    .join(";");
}

function assertNoSpacingOnlyCutoutPairs(question: PfcTpfStudioQuestionV1): number {
  if (!["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038"].includes(question.qlId)) return 0;
  let compared = 0;
  for (let left = 0; left < question.optionSvgs.length; left += 1) {
    for (let right = left + 1; right < question.optionSvgs.length; right += 1) {
      const leftMarks = cutoutMarks(question.optionSvgs[left]!);
      const rightMarks = cutoutMarks(question.optionSvgs[right]!);
      if (leftMarks.length < 2 || leftMarks.length !== rightMarks.length) continue;
      const a = normalizedMarkSignature(question.optionSvgs[left]!);
      const b = normalizedMarkSignature(question.optionSvgs[right]!);
      compared += 1;
      assert.notEqual(
        a,
        b,
        `${question.qlId}/${question.seed}: options ${LETTERS[left]} and ${LETTERS[right]} differ only by translation/scale of the same cutout pattern.`,
      );
    }
  }
  return compared;
}

function assertQuestion(question: PfcTpfStudioQuestionV1): number {
  assert.ok(QLS.includes(question.qlId));
  assert.equal(question.packageId, "SPA-001");
  assert.equal(question.optionSvgs.length, 4);
  assert.equal(new Set(question.optionSvgs).size, 4);
  assert.equal(question.answer, LETTERS[question.correctIndex]);
  assert.equal(question.validation.valid, true);
  assert.equal(question.validation.exactSolverBacked, true);
  assert.equal(question.validation.uniqueAnswer, true);
  assert.equal(question.validation.optionArtUnique, true);
  assert.equal(question.validation.spacingOnlyDistractorsAllowed, false);
  assert.equal(question.validation.falsePyqAttribution, false);
  assert.equal(question.lifecycle.reviewOnly, true);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.persistenceAllowed, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.equal(question.lifecycle.automaticStudentPublication, false);
  assert.ok(question.stimulusSvgs.length >= 1);
  assert.ok(question.stimulusSvgs.every((svg) => svg.includes("<svg") && svg.includes("background:#fff")));
  assert.ok(question.optionSvgs.every((svg) => svg.includes("<svg") && svg.includes("background:#fff")));
  assert.ok(!question.stem.toUpperCase().includes("PYQ"));
  assert.ok(!question.stem.includes("�"));
  assert.ok(!Object.values(question.explanation).some((value) => value.includes("�")));
  for (const svg of question.optionSvgs) {
    assert.ok(!/data-cutout="transparent"[^>]*fill="(?:black|#000(?:000)?)"/i.test(svg));
  }
  return assertNoSpacingOnlyCutoutPairs(question);
}

assert.equal(PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.governance.localizationFrozen, true);
assert.equal(PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.governance.seededQuestionStudioIntegrationAuthorized, true);
assert.equal(PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1_1.questionStudioDiscoverable, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1_1.persistenceAllowed, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1_1.publiclyPublishable, false);

const boundarySeed = findBoundarySeed();
const boundaryQuestion = generatePfcTpfStudioQuestionV1_1({
  qlId: "SPA-QL-038",
  seed: boundarySeed,
  language: "en",
});
assert.equal(boundaryQuestion.mode, "BOUNDARY_NOTCH_UNFOLD_V1_1");
assert.equal(boundaryQuestion.provenance, "SOURCE_BACKED_CORE");
assert.equal(cutoutMarks(boundaryQuestion.optionSvgs[boundaryQuestion.correctIndex]!).length, 2);

const reviewGroups: Array<{
  qlId: PfcTpfStudioQlIdV1;
  seed: string;
  en: PfcTpfStudioQuestionV1;
  hi: PfcTpfStudioQuestionV1;
  pa: PfcTpfStudioQuestionV1;
}> = [];
let sameStructurePairsChecked = 0;
const perQlDistinctFingerprints: Record<string, number> = {};
const observedProvenance = new Set<string>();
const observedRepresentations = new Set<string>();
const observedModes = new Set<string>();

for (const qlId of QLS) {
  const seeds = qlId === "SPA-QL-038"
    ? [`pfc-studio-review-${qlId}-0`, boundarySeed]
    : [`pfc-studio-review-${qlId}-0`, `pfc-studio-review-${qlId}-1`];
  const fingerprints = new Set<string>();
  for (const seed of seeds) {
    const en = generatePfcTpfStudioQuestionV1_1({ qlId, seed, language: "en" });
    const hi = generatePfcTpfStudioQuestionV1_1({ qlId, seed, language: "hi" });
    const pa = generatePfcTpfStudioQuestionV1_1({ qlId, seed, language: "pa" });
    sameStructurePairsChecked += assertQuestion(en);
    sameStructurePairsChecked += assertQuestion(hi);
    sameStructurePairsChecked += assertQuestion(pa);
    assert.equal(hi.contentFingerprint, en.contentFingerprint);
    assert.equal(pa.contentFingerprint, en.contentFingerprint);
    assert.deepEqual(hi.stimulusSvgs, en.stimulusSvgs);
    assert.deepEqual(pa.stimulusSvgs, en.stimulusSvgs);
    assert.deepEqual(hi.optionSvgs, en.optionSvgs);
    assert.deepEqual(pa.optionSvgs, en.optionSvgs);
    assert.equal(hi.correctIndex, en.correctIndex);
    assert.equal(pa.correctIndex, en.correctIndex);
    assert.equal(hi.answer, en.answer);
    assert.equal(pa.answer, en.answer);
    assert.equal(hi.mode, en.mode);
    assert.equal(pa.mode, en.mode);
    assert.equal(hi.representation, en.representation);
    assert.equal(pa.representation, en.representation);
    assert.equal(hi.provenance, en.provenance);
    assert.equal(pa.provenance, en.provenance);
    assert.equal(hi.canonicalAnchorId, en.canonicalAnchorId);
    assert.equal(pa.canonicalAnchorId, en.canonicalAnchorId);
    assert.ok(DEVANAGARI.test(hi.stem));
    assert.ok(DEVANAGARI.test(hi.explanation.rule));
    assert.ok(GURMUKHI.test(pa.stem));
    assert.ok(GURMUKHI.test(pa.explanation.rule));
    assert.notEqual(hi.questionLanguageId, en.questionLanguageId);
    assert.notEqual(pa.questionLanguageId, en.questionLanguageId);
    fingerprints.add(en.contentFingerprint);
    observedProvenance.add(en.provenance);
    observedRepresentations.add(en.representation);
    observedModes.add(en.mode);
    reviewGroups.push({ qlId, seed, en, hi, pa });
  }
  assert.equal(fingerprints.size, 2, `${qlId} must produce different geometry for two deterministic seeds.`);
  perQlDistinctFingerprints[qlId] = fingerprints.size;
}

assert.equal(reviewGroups.length, 12);
assert.ok(observedProvenance.has("SOURCE_BACKED_CORE"));
assert.ok(observedModes.has("BOUNDARY_NOTCH_UNFOLD_V1_1"));
assert.ok(observedRepresentations.size >= 3, "Review pack should expose multiple paper representations.");

function explanationHtml(question: PfcTpfStudioQuestionV1): string {
  return `<p><strong>Observe:</strong> ${esc(question.explanation.observation)}</p><p><strong>Rule:</strong> ${esc(question.explanation.rule)}</p><p><strong>Apply:</strong> ${esc(question.explanation.application)}</p><p><strong>Check:</strong> ${esc(question.explanation.check)}</p>`;
}

const cards = reviewGroups.map((group, index) => {
  const q = group.en;
  const options = q.optionSvgs.map((svg, optionIndex) =>
    `<div class="option"><strong>${LETTERS[optionIndex]}</strong>${svg}</div>`,
  ).join("");
  return `<article class="q" data-ql="${q.qlId}" data-mode="${esc(q.mode)}"><div class="meta">${index + 1}. ${q.qlId} · ${esc(q.mode)} · ${esc(q.representation)} · ${q.provenance} · seed ${esc(group.seed)}</div><h2>${esc(q.qlName)}</h2><p><strong>English:</strong> ${esc(q.stem)}</p><div class="stimulus">${q.stimulusSvgs.join("")}</div><div class="options">${options}</div><p class="answer"><strong>Answer:</strong> ${q.answer}</p><section class="lang"><h3>English explanation</h3>${explanationHtml(group.en)}</section><section class="lang"><h3>हिन्दी</h3><p><strong>प्रश्न:</strong> ${esc(group.hi.stem)}</p>${explanationHtml(group.hi)}</section><section class="lang"><h3>ਪੰਜਾਬੀ</h3><p><strong>ਪ੍ਰਸ਼ਨ:</strong> ${esc(group.pa.stem)}</p>${explanationHtml(group.pa)}</section></article>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC TPF Seeded Question Studio Review V1.1</title><style>*{box-sizing:border-box}body{margin:0;background:#fff;color:#111;font-family:Arial,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;line-height:1.45}.wrap{max-width:1240px;margin:auto;padding:18px}.intro,.q{border:1px solid #ddd;border-radius:12px;padding:18px;margin-bottom:18px;background:#fff}.meta{font-size:12px;color:#555}.q h2{font-size:18px}.stimulus{overflow:auto;margin:12px 0;padding:8px;border:1px solid #eee}.stimulus>svg{max-width:100%;height:auto}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.option{border:1px solid #ddd;border-radius:8px;padding:8px;text-align:center;overflow:hidden}.option svg{max-width:100%;height:auto}.answer{font-size:16px}.lang{border-top:1px solid #e5e5e5;margin-top:14px;padding-top:10px}.lang h3{margin:0 0 7px}.lang p{margin:6px 0}@media(max-width:780px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}.wrap{padding:10px}}@media(max-width:440px){.options{grid-template-columns:1fr}}</style></head><body><main class="wrap"><section class="intro"><h1>PFC / TPF Seeded Question Studio Review V1.1</h1><p>12 deterministic geometry samples: two per permanent QL from SPA-QL-035 through SPA-QL-040. Each geometry is checked in English, Hindi and Punjabi. This is a review-only candidate: no database write, Question Bank eligibility, test eligibility or public publication is enabled.</p><p>V1.1 specifically repairs the QL-038 folded-boundary notch family so the cut is made on a real overlapped folded edge and remains a boundary cut after unfolding.</p></section>${cards}</main></body></html>`;

assert.equal((html.match(/class="q"/g) ?? []).length, 12);
assert.equal((html.match(/class="option"/g) ?? []).length, 48);
assert.ok(html.includes("BOUNDARY_NOTCH_UNFOLD_V1_1"));
assert.ok(html.includes("हिन्दी"));
assert.ok(html.includes("ਪੰਜਾਬੀ"));

const evidence = {
  status: "PASS_PFC_TPF_SEEDED_QUESTION_STUDIO_RUNTIME_V1_1",
  authority: PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1_1,
  localizationFreezeAuthorityId: PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
  permanentQlCount: QLS.length,
  permanentQlIds: QLS,
  reviewGeometryCount: reviewGroups.length,
  localizedReviewInstances: reviewGroups.length * LANGUAGES.length,
  languages: LANGUAGES,
  perQlReviewGeometryCount: Object.fromEntries(QLS.map((qlId) => [qlId, 2])),
  perQlDistinctFingerprints,
  crossLanguageGeometryParity: true,
  crossLanguageAnswerParity: true,
  exactSolverBacked: true,
  optionArtUnique: true,
  spacingOnlyDistractorsAllowed: false,
  sameStructureCutoutPairsChecked: sameStructurePairsChecked,
  sameStructureSpacingOnlyOffenders: 0,
  boundaryNotchReachable: true,
  boundaryNotchSeed: boundarySeed,
  boundaryNotchMode: boundaryQuestion.mode,
  observedProvenance: [...observedProvenance].sort(),
  observedRepresentations: [...observedRepresentations].sort(),
  observedModes: [...observedModes].sort(),
  falsePyqAttribution: false,
  lifecycle: {
    questionStudioDiscoverable: false,
    registrationStatus: "CANDIDATE_OPERATOR_REVIEW_REQUIRED",
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
  nextGate: "PFC_TPF_SEEDED_QUESTION_STUDIO_OPERATOR_REVIEW_DECISION",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-seeded-question-studio-review-v1-1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-seeded-question-studio-review-v1-1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
