import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { applyPfcTpfStudioEditorialV1_1 } from "../foundation/spatial/paper-folding-question-studio-editorial-v1-1";
import {
  generatePfcTpfStudioOperatorReviewV1_2,
  renderPfcTpfStudioOperatorReviewHtmlV1_2,
} from "../foundation/spatial/paper-folding-question-studio-operator-review-v1-2";
import {
  generatePfcTpfStudioQuestionV1,
  type PfcTpfStudioLanguageV1,
  type PfcTpfStudioQlIdV1,
  type PfcTpfStudioQuestionV1,
} from "../foundation/spatial/paper-folding-question-studio-seeded-runtime-v1";
import {
  PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1,
  remediatePfcTpfStudioQuestionDirectionV1,
} from "../foundation/spatial/paper-folding-question-studio-visual-direction-remediation-v1";

const LANGUAGES = ["en", "hi", "pa"] as const;
const UNAFFECTED_QLS = ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038", "SPA-QL-039"] as const;
const DIRECTION_CUE = 'data-fold-direction-cue="true"';

assert.equal(PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.canonicalFrozenContentChanged, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.exactSolverChanged, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.optionGeometryChanged, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.answerChanged, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.localizationTextChanged, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.stimulusPresentationChanged, true);
assert.equal(PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.questionStudioDiscoverable, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.persistenceAllowed, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.questionBankWritable, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.testEligible, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1.publiclyPublishable, false);

for (const qlId of UNAFFECTED_QLS) {
  for (const language of LANGUAGES) {
    const base = generatePfcTpfStudioQuestionV1({ qlId, seed: `direction-unaffected:${qlId}`, language });
    const remediated = remediatePfcTpfStudioQuestionDirectionV1(base);
    assert.strictEqual(remediated, base, `${qlId}/${language}: unaffected QL must be returned unchanged.`);
    assert.deepEqual(remediated, base, `${qlId}/${language}: remediation changed an unaffected QL.`);
  }
}

function expectedDirection(mode: string): "LEFT_TO_RIGHT" | "BOTTOM_TO_TOP" {
  if (mode === "TRANSPARENT_VERTICAL_SUPERPOSITION") return "LEFT_TO_RIGHT";
  if (mode === "TRANSPARENT_HORIZONTAL_SUPERPOSITION") return "BOTTOM_TO_TOP";
  throw new Error(`Unexpected TPF mode ${mode}.`);
}

function assertTpfRemediation(base: PfcTpfStudioQuestionV1, remediated: PfcTpfStudioQuestionV1): void {
  assert.equal(base.qlId, "SPA-QL-040");
  assert.equal(remediated.qlId, "SPA-QL-040");
  assert.equal(base.stimulusSvgs.length, 1);
  assert.equal(remediated.stimulusSvgs.length, 1);
  assert.ok(!base.stimulusSvgs[0]!.includes(DIRECTION_CUE), `${base.seed}: legacy seeded TPF stimulus unexpectedly already carries the remediation cue.`);
  assert.ok(remediated.stimulusSvgs[0]!.includes(DIRECTION_CUE), `${base.seed}: remediated TPF stimulus has no direction cue.`);
  const direction = expectedDirection(remediated.mode);
  assert.ok(remediated.stimulusSvgs[0]!.includes(`data-fold-direction="${direction}"`), `${base.seed}: ${remediated.mode} has the wrong direction cue.`);
  assert.ok(remediated.stimulusSvgs[0]!.includes("marker-end="), `${base.seed}: direction cue has no visible arrow head.`);
  for (const option of remediated.optionSvgs) assert.ok(!option.includes(DIRECTION_CUE), `${base.seed}: fold direction cue leaked into an answer option.`);

  assert.deepEqual(remediated.optionSvgs, base.optionSvgs, `${base.seed}: option geometry changed.`);
  assert.equal(remediated.correctIndex, base.correctIndex, `${base.seed}: correct index changed.`);
  assert.equal(remediated.answer, base.answer, `${base.seed}: answer changed.`);
  assert.equal(remediated.stem, base.stem, `${base.seed}: learner stem changed.`);
  assert.deepEqual(remediated.explanation, base.explanation, `${base.seed}: learner explanation changed.`);
  assert.equal(remediated.generationSeed, base.generationSeed, `${base.seed}: generation seed changed.`);
  assert.equal(remediated.canonicalAnchorId, base.canonicalAnchorId, `${base.seed}: canonical anchor changed.`);
  assert.equal(remediated.provenance, base.provenance, `${base.seed}: provenance changed.`);
  assert.equal(remediated.representation, base.representation, `${base.seed}: representation changed.`);
  assert.deepEqual(remediated.lifecycle, base.lifecycle, `${base.seed}: lifecycle changed.`);
  assert.notEqual(remediated.contentFingerprint, base.contentFingerprint, `${base.seed}: stimulus presentation change must receive a new content fingerprint.`);
  assert.ok(remediated.questionId.endsWith(remediated.contentFingerprint));
  assert.ok(remediated.canonicalItemId.endsWith(remediated.contentFingerprint));
  assert.ok(remediated.questionLanguageId.endsWith(remediated.contentFingerprint));
}

const axisSeeds = new Map<string, string>();
let auditedTpfSeedCount = 0;
for (let index = 0; index < 160 && axisSeeds.size < 2; index += 1) {
  const seed = `direction-axis-audit:${index}`;
  const base = generatePfcTpfStudioQuestionV1({ qlId: "SPA-QL-040", seed, language: "en" });
  auditedTpfSeedCount += 1;
  const remediated = remediatePfcTpfStudioQuestionDirectionV1(base);
  assertTpfRemediation(base, remediated);
  axisSeeds.set(remediated.mode, seed);
}
assert.ok(axisSeeds.has("TRANSPARENT_VERTICAL_SUPERPOSITION"), "Seed audit did not reach a vertical transparent fold.");
assert.ok(axisSeeds.has("TRANSPARENT_HORIZONTAL_SUPERPOSITION"), "Seed audit did not reach a horizontal transparent fold.");

const directionProofQuestions: PfcTpfStudioQuestionV1[] = [];
const pairedGeometryEvidence: Record<string, unknown> = {};
for (const [mode, seed] of [...axisSeeds.entries()].sort()) {
  const byLanguage = LANGUAGES.map((language) => {
    const base = generatePfcTpfStudioQuestionV1({ qlId: "SPA-QL-040", seed, language });
    const edited = applyPfcTpfStudioEditorialV1_1(base);
    const remediated = remediatePfcTpfStudioQuestionDirectionV1(edited);
    assertTpfRemediation(edited, remediated);
    return remediated;
  });
  const en = byLanguage[0]!;
  for (const localized of byLanguage.slice(1)) {
    assert.equal(localized.generationSeed, en.generationSeed);
    assert.equal(localized.contentFingerprint, en.contentFingerprint);
    assert.deepEqual(localized.stimulusSvgs, en.stimulusSvgs);
    assert.deepEqual(localized.optionSvgs, en.optionSvgs);
    assert.equal(localized.correctIndex, en.correctIndex);
    assert.equal(localized.answer, en.answer);
    assert.equal(localized.canonicalAnchorId, en.canonicalAnchorId);
  }
  pairedGeometryEvidence[mode] = {
    seed,
    generationSeed: en.generationSeed,
    answer: en.answer,
    contentFingerprint: en.contentFingerprint,
    direction: expectedDirection(mode),
    languages: byLanguage.map((question) => question.language),
  };
  directionProofQuestions.push(...byLanguage);
}
assert.equal(directionProofQuestions.length, 6);

const oldReview = generatePfcTpfStudioOperatorReviewV1_2();
const remediatedReview = oldReview.map((question) => remediatePfcTpfStudioQuestionDirectionV1(question)) as typeof oldReview;
assert.equal(remediatedReview.length, 18);
for (let index = 0; index < oldReview.length; index += 1) {
  const before = oldReview[index]!;
  const after = remediatedReview[index]!;
  if (before.qlId === "SPA-QL-040") {
    assertTpfRemediation(before, after);
  } else {
    assert.strictEqual(after, before);
  }
}

const reviewTpf = remediatedReview.filter((question) => question.qlId === "SPA-QL-040");
assert.equal(reviewTpf.length, 3);
assert.deepEqual([...new Set(reviewTpf.map((question) => question.language))].sort(), ["en", "hi", "pa"]);
for (const question of reviewTpf) assert.ok(question.stimulusSvgs[0]!.includes(DIRECTION_CUE));

function esc(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function directionProofHtml(questions: readonly PfcTpfStudioQuestionV1[]): string {
  const cards = questions.map((question) => `<article class="direction-proof" data-mode="${question.mode}" data-language="${question.language}"><div class="meta">${question.qlId} · ${question.mode} · ${question.language.toUpperCase()} · Answer ${question.answer}</div><p><strong>Question:</strong> ${esc(question.stem)}</p><div class="stimulus">${question.stimulusSvgs.join("")}</div><div class="options">${question.optionSvgs.map((svg, index) => `<div class="option"><strong>${["A", "B", "C", "D"][index]}</strong>${svg}</div>`).join("")}</div><p><strong>Rule:</strong> ${esc(question.explanation.rule)}</p><p><strong>Application:</strong> ${esc(question.explanation.application)}</p></article>`).join("\n");
  return `<section class="direction-proof-section"><h2>V1.3 focused transparent-fold direction proof</h2><p>Both supported fold axes are shown in English, Hindi and Punjabi. The arrow is part of the stimulus only; answer options retain the folded-result art without a direction cue.</p>${cards}</section>`;
}

const oldHtml = renderPfcTpfStudioOperatorReviewHtmlV1_2(remediatedReview);
const proofSection = directionProofHtml(directionProofQuestions);
const html = oldHtml
  .replaceAll("PFC / TPF Question Studio Operator Review V1.2", "PFC / TPF Question Studio Operator Review V1.3")
  .replace("</style>", ".direction-proof-section{border-top:3px solid #111;margin-top:30px;padding-top:20px}.direction-proof{border-bottom:1px solid #bbb;padding:20px 0}.direction-proof .stimulus svg{max-width:280px;height:auto}.direction-proof .options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.direction-proof .option{display:flex;flex-direction:column;align-items:center;gap:4px}@media(max-width:760px){.direction-proof .options{grid-template-columns:repeat(2,minmax(0,1fr))}}</style>")
  .replace("</main>", `${proofSection}</main>`);

assert.ok(html.includes("PFC / TPF Question Studio Operator Review V1.3"));
assert.ok(html.includes("V1.3 focused transparent-fold direction proof"));
assert.ok(html.includes('data-fold-direction="LEFT_TO_RIGHT"'));
assert.ok(html.includes('data-fold-direction="BOTTOM_TO_TOP"'));
assert.ok((html.match(/data-fold-direction-cue="true"/g) ?? []).length >= 9, "Expected remediated paired review plus six focused direction-proof stimuli.");

const evidence = {
  status: "PASS_PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_V1",
  remediationAuthority: PFC_TPF_QUESTION_STUDIO_VISUAL_DIRECTION_REMEDIATION_AUTHORITY_V1,
  supersededHumanDecisionCandidate: "PFC-TPF-QUESTION-STUDIO-OPERATOR-REVIEW-V1.2",
  currentReviewCandidate: "PFC-TPF-QUESTION-STUDIO-OPERATOR-REVIEW-V1.3",
  defectDisposition: "V1_2_HUMAN_VISUAL_REVIEW_REJECTED_MISSING_TPF_FOLD_DIRECTION_CUE",
  oldOperatorReviewRegressionQuestionCount: remediatedReview.length,
  focusedDirectionReviewQuestionCount: directionProofQuestions.length,
  auditedTpfSeedCount,
  reachedModes: [...axisSeeds.keys()].sort(),
  directionSemantics: {
    TRANSPARENT_VERTICAL_SUPERPOSITION: "LEFT_TO_RIGHT",
    TRANSPARENT_HORIZONTAL_SUPERPOSITION: "BOTTOM_TO_TOP",
  },
  pairedGeometryAcrossLanguages: true,
  pairedGeometryEvidence,
  unaffectedPermanentQls: UNAFFECTED_QLS,
  solverChanged: false,
  optionsChanged: false,
  answersChanged: false,
  localizedTextChanged: false,
  stimulusDirectionCueRestored: true,
  affectedContentFingerprintRebound: true,
  optionDirectionCueLeakage: false,
  governance: {
    questionStudioRegistrationAllowed: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticPublication: false,
    nextGate: "PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_V1_3_HUMAN_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-question-studio-operator-review-v1-3.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-question-studio-operator-review-v1-3-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
