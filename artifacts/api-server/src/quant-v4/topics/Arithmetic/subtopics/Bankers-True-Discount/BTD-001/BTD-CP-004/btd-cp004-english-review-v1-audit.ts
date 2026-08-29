import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { BTD_CP003_QL_IDS } from "../BTD-CP-003/btd-cp003-permanent-generator-v1";
import { BTD_CP004_ENGLISH_REVIEW_VERSION, BTD_CP004_REVIEW_BOUNDARY, buildBtdCp004EnglishReviewCorpusV1, renderBtdCp004EnglishReviewMarkdownV1 } from "./btd-cp004-english-review-v1";

function normalize(text: string) { return text.normalize("NFKC").toLowerCase().replace(/\s+/gu, " ").trim(); }
const forbiddenLearnerTokens = [/undefined/iu, /\bNaN\b/u, /\bInfinity\b/u, /\[object Object\]/u, /BTD-PROT-/u, /BTD-CAND-/u];
const corpus = buildBtdCp004EnglishReviewCorpusV1();
assert.equal(BTD_CP004_ENGLISH_REVIEW_VERSION, "BTD-001-CP004-ENGLISH-REVIEW-v1");
assert.equal(BTD_CP004_REVIEW_BOUNDARY.reviewStatus, "ENGLISH_REVIEW_CANDIDATE");
assert.equal(BTD_CP004_REVIEW_BOUNDARY.contentFrozen, false);
assert.equal(BTD_CP004_REVIEW_BOUNDARY.questionStudioDiscoverable, false);
assert.equal(BTD_CP004_REVIEW_BOUNDARY.publiclyPublishable, false);
assert.equal(corpus.length, 60);

const exactStems = new Set<string>();
const keyIdeasByQl = new Map<string, Set<string>>();
let stemChecks = 0, optionChecks = 0, explanationChecks = 0, lifecycleChecks = 0, learnerTokenChecks = 0;
for (const qlId of BTD_CP003_QL_IDS) {
  const group = corpus.filter((question) => question.qlId === qlId);
  assert.equal(group.length, 3, `${qlId}: expected three review samples`);
  assert.equal(new Set(group.map((question) => question.presentation.stemFamilyId)).size, 3, `${qlId}: review corpus does not cover three stem families`);
  keyIdeasByQl.set(qlId, new Set());
  for (const question of group) {
    const stem = question.presentation.stem;
    assert.ok(stem.length >= 35 && stem.length <= 420, `${qlId}: stem length out of editorial bounds`);
    assert.equal(exactStems.has(normalize(stem)), false, `${qlId}: duplicate exact review stem`);
    exactStems.add(normalize(stem));
    assert.ok(/[0-9₹%:]/u.test(stem), `${qlId}: stem lacks concrete numerical grounding`);
    stemChecks += 3;

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.text)).size, 4);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]!.text, question.correctAnswer);
    optionChecks += 4;

    const learnerText = [stem, ...question.options.map((option) => option.text), question.explanation.whatGiven, question.explanation.whatAsked, question.explanation.keyIdea, ...question.explanation.steps, question.explanation.finalAnswer].join("\n");
    for (const pattern of forbiddenLearnerTokens) { assert.equal(pattern.test(learnerText), false, `${qlId}: learner text contains forbidden token ${pattern}`); learnerTokenChecks += 1; }

    assert.ok(question.explanation.whatGiven.length >= 20);
    assert.ok(question.explanation.whatAsked.length >= 10);
    assert.ok(question.explanation.keyIdea.length >= 20);
    assert.ok(question.explanation.steps.length >= 2);
    assert.ok(question.explanation.steps.every((step) => step.length >= 12));
    assert.ok(question.explanation.finalAnswer.includes(question.correctAnswer));
    assert.notEqual(normalize(question.explanation.whatGiven), normalize(stem));
    assert.notEqual(normalize(question.explanation.keyIdea), normalize(stem));
    assert.ok(/[0-9₹%:]/u.test(question.explanation.whatGiven), `${qlId}: given summary is not numerically grounded`);
    assert.ok(question.explanation.steps.some((step) => /[0-9₹%=:×÷+−/²√]/u.test(step)), `${qlId}: solution steps are not computationally grounded`);
    keyIdeasByQl.get(qlId)!.add(normalize(question.explanation.keyIdea));
    explanationChecks += 10;

    assert.equal(question.lifecycle.permanentQlAllocated, true);
    assert.equal(question.lifecycle.productionCandidate, true);
    assert.equal(question.lifecycle.contentFreezeStatus, "REVIEW_LOCKED");
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.mockTestEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    lifecycleChecks += 8;
  }
}

const reviewMarkdown = renderBtdCp004EnglishReviewMarkdownV1();
assert.ok(reviewMarkdown.length > 10000, "review artifact unexpectedly small");
assert.equal((reviewMarkdown.match(/^### Sample /gmu) ?? []).length, 60, "review artifact sample count drift");
assert.equal((reviewMarkdown.match(/^## BTD-QL-/gmu) ?? []).length, 20, "review artifact QL count drift");
writeFileSync("btd-cp004-english-review-v1.md", reviewMarkdown, "utf8");

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP004-ENGLISH-REVIEW-AUDIT-v1",
  reviewVersion: BTD_CP004_ENGLISH_REVIEW_VERSION,
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-004",
  permanentQlCount: BTD_CP003_QL_IDS.length,
  reviewQuestionCount: corpus.length,
  samplesPerQl: 3,
  exactReviewStemCount: exactStems.size,
  stemChecks,
  optionChecks,
  explanationChecks,
  learnerTokenChecks,
  lifecycleChecks,
  reviewArtifactBytes: Buffer.byteLength(reviewMarkdown, "utf8"),
  reviewStatus: BTD_CP004_REVIEW_BOUNDARY.reviewStatus,
  contentFrozen: BTD_CP004_REVIEW_BOUNDARY.contentFrozen,
  questionStudioDiscoverable: BTD_CP004_REVIEW_BOUNDARY.questionStudioDiscoverable,
  downstreamDeliveryOpened: false,
}, null, 2));
console.log("PASS_BTD_001_CP004_ENGLISH_REVIEW_AUDIT_V1");
