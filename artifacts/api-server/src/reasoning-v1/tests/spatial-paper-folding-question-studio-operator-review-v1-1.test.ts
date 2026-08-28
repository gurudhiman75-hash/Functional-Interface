import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  generatePfcTpfStudioOperatorReviewV1_1,
  PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1_1,
  renderPfcTpfStudioOperatorReviewHtmlV1_1,
} from "../foundation/spatial/paper-folding-question-studio-operator-review-v1-1";

const QLS = ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038", "SPA-QL-039", "SPA-QL-040"] as const;
const review = generatePfcTpfStudioOperatorReviewV1_1();

assert.equal(PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1_1.questionStudioRegistrationAllowed, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1_1.remediation.pairedGeometryAcrossLanguages, true);
assert.equal(PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1_1.remediation.reverseInferenceWideOptionLayout, true);
assert.equal(review.length, 18);

const answerCounts = { A: 0, B: 0, C: 0, D: 0 };
const qlEvidence: Record<string, { answer: string; fingerprint: string; representation: string; provenance: string }> = {};

for (const qlId of QLS) {
  const slice = review.filter((question) => question.qlId === qlId);
  assert.equal(slice.length, 3, `${qlId}: expected one EN, one HI and one PA review item.`);
  assert.deepEqual([...new Set(slice.map((question) => question.language))].sort(), ["en", "hi", "pa"]);
  const en = slice.find((question) => question.language === "en")!;
  const hi = slice.find((question) => question.language === "hi")!;
  const pa = slice.find((question) => question.language === "pa")!;

  for (const localized of [hi, pa]) {
    assert.equal(localized.seed, en.seed, `${qlId}: localization review must use the same requested seed.`);
    assert.equal(localized.generationSeed, en.generationSeed, `${qlId}: localization review must use the same successful generation seed.`);
    assert.equal(localized.contentFingerprint, en.contentFingerprint, `${qlId}: geometry fingerprint must match across languages.`);
    assert.deepEqual(localized.stimulusSvgs, en.stimulusSvgs, `${qlId}: stimulus geometry must match across languages.`);
    assert.deepEqual(localized.optionSvgs, en.optionSvgs, `${qlId}: option geometry/order must match across languages.`);
    assert.equal(localized.correctIndex, en.correctIndex, `${qlId}: correct option position must match across languages.`);
    assert.equal(localized.answer, en.answer, `${qlId}: answer must match across languages.`);
    assert.equal(localized.representation, en.representation, `${qlId}: representation must match across languages.`);
    assert.equal(localized.provenance, en.provenance, `${qlId}: provenance must match across languages.`);
  }

  assert.notEqual(hi.stem, en.stem);
  assert.notEqual(pa.stem, en.stem);
  assert.ok(/[\u0900-\u097F]/.test(hi.stem));
  assert.ok(/[\u0A00-\u0A7F]/.test(pa.stem));
  assert.equal(en.lifecycle.reviewOnly, true);
  assert.equal(en.lifecycle.questionStudioDiscoverable, false);
  assert.equal(en.lifecycle.persistenceAllowed, false);
  assert.equal(en.lifecycle.questionBankWritable, false);
  assert.equal(en.lifecycle.testEligible, false);
  assert.equal(en.lifecycle.publiclyPublishable, false);

  for (const question of slice) answerCounts[question.answer] += 1;
  qlEvidence[qlId] = {
    answer: en.answer,
    fingerprint: en.contentFingerprint,
    representation: en.representation,
    provenance: en.provenance,
  };
}

assert.deepEqual(answerCounts, { A: 6, B: 3, C: 6, D: 3 });
assert.deepEqual(new Set(Object.values(qlEvidence).map((item) => item.answer)), new Set(["A", "B", "C", "D"]));

const html = renderPfcTpfStudioOperatorReviewHtmlV1_1(review);
assert.ok(html.includes("PFC / TPF Question Studio Operator Review V1.1"));
assert.ok(html.includes("same deterministic geometry is shown in English, Hindi and Punjabi"));
assert.ok(html.includes('.q[data-ql="SPA-QL-039"] .options{grid-template-columns:repeat(2,minmax(0,1fr))}'));
assert.ok(html.includes("body{margin:0;background:#fff"));
assert.equal((html.match(/class="q"/g) ?? []).length, 18);
assert.equal((html.match(/class="option"/g) ?? []).length, 72);

const evidence = {
  status: "PASS_PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_V1_1",
  authority: PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1_1,
  operatorReviewQuestionCount: review.length,
  permanentQlRange: "SPA-QL-035..SPA-QL-040",
  pairedGeometryAcrossLanguages: true,
  answerCounts,
  allAnswerPositionsSeen: Object.values(answerCounts).every((count) => count > 0),
  qlEvidence,
  reverseInferenceWideOptionLayout: true,
  whiteReviewSurface: true,
  governance: {
    questionStudioRegistrationAllowed: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    nextGate: "PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_V1_1_HUMAN_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-question-studio-operator-review-v1-1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-question-studio-operator-review-v1-1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
