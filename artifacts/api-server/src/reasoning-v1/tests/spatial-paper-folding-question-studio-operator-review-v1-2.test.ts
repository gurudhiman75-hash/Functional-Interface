import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  applyPfcTpfStudioEditorialV1_1,
  PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1_1,
} from "../foundation/spatial/paper-folding-question-studio-editorial-v1-1";
import {
  generatePfcTpfStudioOperatorReviewV1_2,
  PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1_2,
  renderPfcTpfStudioOperatorReviewHtmlV1_2,
} from "../foundation/spatial/paper-folding-question-studio-operator-review-v1-2";
import {
  generatePfcTpfStudioQuestionV1,
  type PfcTpfStudioQlIdV1,
} from "../foundation/spatial/paper-folding-question-studio-seeded-runtime-v1";

const QLS = ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038", "SPA-QL-039", "SPA-QL-040"] as const;
const FORWARD_QLS = ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038"] as const;
const localizedLatinLeak = /[A-Za-z]{2,}/;

assert.equal(PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1_1.registrationAllowed, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1_2.questionStudioRegistrationAllowed, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1_2.remediation.reachableDeterministicAnswerStemPairsOnly, true);
assert.equal(PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1_1.remediation.exactRenderedTextFingerprint, true);

const stemVariantCoverage: Record<string, number[]> = {};
const editorialFingerprintCounts: Record<string, number> = {};
let auditedQuestionCount = 0;

for (const qlId of QLS) {
  const stemVariants = new Set<number>();
  const editorialFingerprints = new Set<string>();
  for (let index = 0; index < 16; index += 1) {
    const seed = `studio-editorial-audit:${qlId}:${index}`;
    const baseEn = generatePfcTpfStudioQuestionV1({ qlId: qlId as PfcTpfStudioQlIdV1, seed, language: "en" });
    const editedEn = applyPfcTpfStudioEditorialV1_1(baseEn);
    auditedQuestionCount += 1;
    stemVariants.add(editedEn.editorial.stemVariant);
    editorialFingerprints.add(editedEn.editorial.editorialFingerprint);

    assert.deepEqual(editedEn.stimulusSvgs, baseEn.stimulusSvgs);
    assert.deepEqual(editedEn.optionSvgs, baseEn.optionSvgs);
    assert.equal(editedEn.correctIndex, baseEn.correctIndex);
    assert.equal(editedEn.answer, baseEn.answer);
    assert.equal(editedEn.contentFingerprint, baseEn.contentFingerprint);
    assert.equal(editedEn.canonicalAnchorId, baseEn.canonicalAnchorId);
    assert.equal(editedEn.provenance, baseEn.provenance);
    assert.equal(editedEn.representation, baseEn.representation);
    assert.deepEqual(editedEn.lifecycle, baseEn.lifecycle);

    const baseHi = generatePfcTpfStudioQuestionV1({ qlId: qlId as PfcTpfStudioQlIdV1, seed, language: "hi" });
    const basePa = generatePfcTpfStudioQuestionV1({ qlId: qlId as PfcTpfStudioQlIdV1, seed, language: "pa" });
    const editedHi = applyPfcTpfStudioEditorialV1_1(baseHi);
    const editedPa = applyPfcTpfStudioEditorialV1_1(basePa);

    for (const localized of [editedHi, editedPa]) {
      assert.equal(localized.generationSeed, editedEn.generationSeed);
      assert.equal(localized.contentFingerprint, editedEn.contentFingerprint);
      assert.deepEqual(localized.stimulusSvgs, editedEn.stimulusSvgs);
      assert.deepEqual(localized.optionSvgs, editedEn.optionSvgs);
      assert.equal(localized.correctIndex, editedEn.correctIndex);
      assert.equal(localized.answer, editedEn.answer);
      assert.equal(localized.editorial.stemVariant, editedEn.editorial.stemVariant);
      assert.equal(localized.editorial.observationVariant, editedEn.editorial.observationVariant);
      assert.equal(localized.editorial.applicationVariant, editedEn.editorial.applicationVariant);
      assert.equal(localized.editorial.checkVariant, editedEn.editorial.checkVariant);
      const learnerText = [localized.stem, localized.explanation.observation, localized.explanation.rule, localized.explanation.application, localized.explanation.check].join(" ");
      assert.ok(!localizedLatinLeak.test(learnerText), `${qlId}/${localized.language}/${seed}: learner-facing localized text contains Latin-word leakage: ${learnerText}`);
    }
  }
  stemVariantCoverage[qlId] = [...stemVariants].sort();
  editorialFingerprintCounts[qlId] = editorialFingerprints.size;
  assert.equal(stemVariants.size, 4, `${qlId}: expected all four seeded stem variants across 16 audit seeds.`);
  assert.ok(editorialFingerprints.size >= 10, `${qlId}: expected at least 10 distinct editorial fingerprints across 16 seeds.`);
}

const review = generatePfcTpfStudioOperatorReviewV1_2();
assert.equal(review.length, 18);
const answerCounts = { A: 0, B: 0, C: 0, D: 0 };
const forwardReviewStemVariants = new Set<number>();
const qlReviewEvidence: Record<string, unknown> = {};

for (const qlId of QLS) {
  const slice = review.filter((question) => question.qlId === qlId);
  assert.equal(slice.length, 3);
  assert.deepEqual([...new Set(slice.map((question) => question.language))].sort(), ["en", "hi", "pa"]);
  const en = slice.find((question) => question.language === "en")!;
  const hi = slice.find((question) => question.language === "hi")!;
  const pa = slice.find((question) => question.language === "pa")!;

  for (const localized of [hi, pa]) {
    assert.equal(localized.seed, en.seed);
    assert.equal(localized.generationSeed, en.generationSeed);
    assert.equal(localized.contentFingerprint, en.contentFingerprint);
    assert.deepEqual(localized.stimulusSvgs, en.stimulusSvgs);
    assert.deepEqual(localized.optionSvgs, en.optionSvgs);
    assert.equal(localized.correctIndex, en.correctIndex);
    assert.equal(localized.answer, en.answer);
    assert.equal(localized.editorial.stemVariant, en.editorial.stemVariant);
    const learnerText = [localized.stem, localized.explanation.observation, localized.explanation.rule, localized.explanation.application, localized.explanation.check].join(" ");
    assert.ok(!localizedLatinLeak.test(learnerText));
  }

  if ((FORWARD_QLS as readonly string[]).includes(qlId)) forwardReviewStemVariants.add(en.editorial.stemVariant);
  for (const question of slice) answerCounts[question.answer] += 1;
  qlReviewEvidence[qlId] = {
    answer: en.answer,
    stemVariant: en.editorial.stemVariant,
    geometryFingerprint: en.contentFingerprint,
    editorialFingerprintEn: en.editorial.editorialFingerprint,
    editorialFingerprintHi: hi.editorial.editorialFingerprint,
    editorialFingerprintPa: pa.editorial.editorialFingerprint,
    representation: en.representation,
    provenance: en.provenance,
  };
}

assert.deepEqual(answerCounts, { A: 6, B: 3, C: 6, D: 3 });
assert.deepEqual([...forwardReviewStemVariants].sort(), [0, 1, 2, 3]);

const html = renderPfcTpfStudioOperatorReviewHtmlV1_2(review);
assert.ok(html.includes("PFC / TPF Question Studio Operator Review V1.2"));
assert.ok(html.includes("all four stem styles"));
assert.ok(html.includes('.q[data-ql="SPA-QL-039"] .options{grid-template-columns:repeat(2,minmax(0,1fr))}'));
assert.ok(html.includes("body{margin:0;background:#fff"));
assert.equal((html.match(/class="q"/g) ?? []).length, 18);
assert.equal((html.match(/class="option"/g) ?? []).length, 72);

const evidence = {
  status: "PASS_PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_V1_2",
  editorialAuthority: PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1_1,
  operatorReviewAuthority: PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1_2,
  auditedQuestionCount,
  permanentQlRange: "SPA-QL-035..SPA-QL-040",
  stemVariantCoverage,
  editorialFingerprintCounts,
  pairedGeometryAcrossLanguages: true,
  localizedLatinWordLeakage: false,
  reviewQuestionCount: review.length,
  reviewAnswerCounts: answerCounts,
  forwardReviewStemVariants: [...forwardReviewStemVariants].sort(),
  qlReviewEvidence,
  geometryOptionAnswerFingerprintInvariantsPreserved: true,
  reverseInferenceWideOptionLayout: true,
  whiteReviewSurface: true,
  governance: {
    questionStudioRegistrationAllowed: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    nextGate: "PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_V1_2_HUMAN_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-question-studio-operator-review-v1-2.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-question-studio-operator-review-v1-2-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
