import fs from "node:fs";
import path from "node:path";
import { INT_CP006_QL_IDS } from "./cp006-si-ci-relations-runtime-v4-final";
import { INT_CP006_ENGLISH_FREEZE_ID, generateIntCp006EnglishFrozenQuestion } from "./cp006-si-ci-relations-v1-frozen";
import { generateIntCp006EnglishExplanationReviewQuestion } from "./cp006-english-explanation-amendment-v1";
import {
  INT_CP006_ENGLISH_EXPLANATION_FREEZE_ID,
  INT_CP006_ENGLISH_EXPLANATION_FREEZE_APPROVAL,
  generateIntCp006EnglishExplanationFrozenQuestion,
} from "./cp006-english-explanation-amendment-v1-frozen";
import {
  INT_CP006_LOCALIZED_EXPLANATION_VERSION,
  generateIntCp006LocalizedExplanationReviewQuestion,
} from "./cp006-si-ci-relations-localized-v7";
import {
  INT_CP006_LOCALIZED_V7_FREEZE_ID,
  INT_CP006_LOCALIZED_V7_FREEZE_APPROVAL,
  generateIntCp006LocalizedV7FrozenQuestion,
} from "./cp006-si-ci-relations-localized-v7-frozen";
import { INT_CP006_EXPANDED_EXPLANATION_VERSION } from "./cp006-expanded-explanation-v4";

const APPROVED_REVIEW_HEAD = "89e08716bbdab9266c9b8df636c473b5c9d18fc1" as const;
const APPROVED_REVIEW_RUN = 32111996290 as const;
const APPROVED_REVIEW_ARTIFACT = 9315240963 as const;
const APPROVED_REVIEW_DIGEST = "sha256:8890f824d29806172b404624cb060e90a0fca1e6b15438c3761c876d18eee8d2" as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function learnerSurface(question: any) {
  return {
    qlId: question.qlId,
    seed: question.seed,
    locale: question.locale,
    mathematicalState: question.mathematicalState,
    answerSemantic: question.answerSemantic,
    presentation: question.presentation,
    options: question.options,
    correctIndex: question.correctIndex,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  };
}
function nonExplanationQuestionSurface(question: any) {
  return {
    qlId: question.qlId,
    seed: question.seed,
    locale: question.locale,
    mathematicalState: question.mathematicalState,
    answerSemantic: question.answerSemantic,
    presentation: question.presentation,
    options: question.options,
    correctIndex: question.correctIndex,
    correctAnswer: question.correctAnswer,
  };
}
function assertLifecycleClosed(question: any, label: string) {
  assert(!question.enabled, `${label}: enabled opened`);
  assert(question.stagingStatus === "NOT_STAGED", `${label}: staging opened`);
  assert(question.registrationStatus === "NOT_REGISTERED", `${label}: registration opened`);
  assert(!question.questionStudioDiscoverable, `${label}: Question Studio opened`);
  assert(question.questionBankStatus === "NOT_STORED", `${label}: Question Bank opened`);
  assert(question.testEligibility === "INELIGIBLE", `${label}: test eligibility opened`);
  assert(!question.publiclyPublishable, `${label}: public delivery opened`);
}
function assertDeepFrozen(question: any, label: string) {
  for (const [name, object] of [
    ["question", question],
    ["presentation", question.presentation],
    ["options", question.options],
    ["explanation", question.explanation],
    ["steps", question.explanation.steps],
  ] as const) assert(Object.isFrozen(object), `${label}: ${name} is not frozen`);
  for (const option of question.options) assert(Object.isFrozen(option), `${label}: option is not frozen`);
}
function allLearnerText(question: any): string {
  return stable({ presentation: question.presentation, options: question.options, explanation: question.explanation });
}
function hasHindi(text: string): boolean { return /[\u0900-\u097F]/u.test(text); }
function hasPunjabi(text: string): boolean { return /[\u0A00-\u0A7F]/u.test(text); }

let englishFrozenQuestions = 0;
let localizedFrozenQuestions = 0;
let deterministicReplayChecks = 0;
let approvedIdentityChecks = 0;
let originalEnglishFreezeChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let nativeScriptChecks = 0;
let punjabiTerminologyChecks = 0;
let approvalEvidenceChecks = 0;

for (const qlId of INT_CP006_QL_IDS) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp006-expl-freeze-v1-${qlId}-${index}`;

    const originalEnglishFrozen = generateIntCp006EnglishFrozenQuestion(qlId, seed, "en-IN");
    const approvedEnglish = generateIntCp006EnglishExplanationReviewQuestion(qlId, seed);
    const frozenEnglish = generateIntCp006EnglishExplanationFrozenQuestion(qlId, seed);
    const frozenEnglishReplay = generateIntCp006EnglishExplanationFrozenQuestion(qlId, seed);

    assert(stable(frozenEnglish) === stable(frozenEnglishReplay), `en/${qlId}/${seed}: deterministic freeze drift`);
    deterministicReplayChecks += 1;
    assert(stable(learnerSurface(frozenEnglish)) === stable(learnerSurface(approvedEnglish)), `en/${qlId}/${seed}: approved English learner content drift`);
    approvedIdentityChecks += 1;
    assert(stable(nonExplanationQuestionSurface(frozenEnglish)) === stable(nonExplanationQuestionSurface(originalEnglishFrozen)), `en/${qlId}/${seed}: original frozen English question surface drift`);
    assert(frozenEnglish.freezeId === INT_CP006_ENGLISH_FREEZE_ID, `en/${qlId}/${seed}: original English freeze ID replaced`);
    assert(frozenEnglish.explanationFreezeId === INT_CP006_ENGLISH_EXPLANATION_FREEZE_ID, `en/${qlId}/${seed}: explanation freeze ID drift`);
    originalEnglishFreezeChecks += 2;
    assert(frozenEnglish.explanationReviewVersion === INT_CP006_EXPANDED_EXPLANATION_VERSION, `en/${qlId}/${seed}: approved explanation version drift`);
    assert(frozenEnglish.explanationFreezeApproval.authority === "PRODUCT_OWNER_APPROVED_CP006_EXPLANATIONS_V4_V7_2026_08_18", `en/${qlId}/${seed}: approval authority drift`);
    assert(frozenEnglish.explanationFreezeApproval.approvedReviewHead === APPROVED_REVIEW_HEAD, `en/${qlId}/${seed}: review head drift`);
    assert(frozenEnglish.explanationFreezeApproval.reviewWorkflowRun === APPROVED_REVIEW_RUN, `en/${qlId}/${seed}: review run drift`);
    assert(frozenEnglish.explanationFreezeApproval.reviewArtifactId === APPROVED_REVIEW_ARTIFACT, `en/${qlId}/${seed}: review artifact drift`);
    assert(frozenEnglish.explanationFreezeApproval.reviewArtifactDigest === APPROVED_REVIEW_DIGEST, `en/${qlId}/${seed}: review digest drift`);
    approvalEvidenceChecks += 5;
    assert(frozenEnglish.permanentIdentityFrozen && frozenEnglish.learnerContentFrozen, `en/${qlId}/${seed}: freeze flags not closed`);
    assertLifecycleClosed(frozenEnglish, `en/${qlId}/${seed}`);
    lifecycleChecks += 7;
    assertDeepFrozen(frozenEnglish, `en/${qlId}/${seed}`);
    deepFreezeChecks += 5 + frozenEnglish.options.length;
    englishFrozenQuestions += 1;

    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const approvedLocalized = generateIntCp006LocalizedExplanationReviewQuestion(qlId, seed, locale);
      const frozenLocalized = generateIntCp006LocalizedV7FrozenQuestion(qlId, seed, locale);
      const frozenLocalizedReplay = generateIntCp006LocalizedV7FrozenQuestion(qlId, seed, locale);
      const label = `${locale}/${qlId}/${seed}`;

      assert(stable(frozenLocalized) === stable(frozenLocalizedReplay), `${label}: deterministic freeze drift`);
      deterministicReplayChecks += 1;
      assert(stable(learnerSurface(frozenLocalized)) === stable(learnerSurface(approvedLocalized)), `${label}: approved localized learner content drift`);
      approvedIdentityChecks += 1;
      assert(frozenLocalized.localizedVersion === INT_CP006_LOCALIZED_EXPLANATION_VERSION, `${label}: approved localized version drift`);
      assert(frozenLocalized.explanationReviewVersion === INT_CP006_EXPANDED_EXPLANATION_VERSION, `${label}: approved explanation version drift`);
      assert(frozenLocalized.freezeId === INT_CP006_LOCALIZED_V7_FREEZE_ID, `${label}: localized freeze ID drift`);
      assert(frozenLocalized.freezeApproval.authority === "PRODUCT_OWNER_APPROVED_CP006_EXPLANATIONS_V4_V7_2026_08_18", `${label}: approval authority drift`);
      assert(frozenLocalized.freezeApproval.approvedReviewHead === APPROVED_REVIEW_HEAD, `${label}: review head drift`);
      assert(frozenLocalized.freezeApproval.reviewWorkflowRun === APPROVED_REVIEW_RUN, `${label}: review run drift`);
      assert(frozenLocalized.freezeApproval.reviewArtifactId === APPROVED_REVIEW_ARTIFACT, `${label}: review artifact drift`);
      assert(frozenLocalized.freezeApproval.reviewArtifactDigest === APPROVED_REVIEW_DIGEST, `${label}: review digest drift`);
      approvalEvidenceChecks += 5;
      assert(frozenLocalized.permanentIdentityFrozen && frozenLocalized.learnerContentFrozen, `${label}: freeze flags not closed`);
      assertLifecycleClosed(frozenLocalized, label);
      lifecycleChecks += 7;
      assertDeepFrozen(frozenLocalized, label);
      deepFreezeChecks += 5 + frozenLocalized.options.length;

      const text = allLearnerText(frozenLocalized);
      if (locale === "hi-IN") {
        assert(hasHindi(text), `${label}: Hindi learner text missing Devanagari`);
      } else {
        assert(hasPunjabi(text), `${label}: Punjabi learner text missing Gurmukhi`);
        assert(!text.includes("ਚੱਕਰਵੱਧੀ"), `${label}: deprecated Punjabi compound-interest term survived freeze`);
        assert(!/[\u0900-\u097F]{2,}/u.test(text), `${label}: Devanagari leaked into Punjabi learner text`);
        punjabiTerminologyChecks += 2;
      }
      nativeScriptChecks += 1;
      localizedFrozenQuestions += 1;
    }
  }
}

assert(INT_CP006_ENGLISH_EXPLANATION_FREEZE_APPROVAL.approvedReviewHead === APPROVED_REVIEW_HEAD, "English freeze approval review head mismatch");
assert(INT_CP006_LOCALIZED_V7_FREEZE_APPROVAL.approvedReviewHead === APPROVED_REVIEW_HEAD, "Localized freeze approval review head mismatch");
assert(INT_CP006_ENGLISH_EXPLANATION_FREEZE_APPROVAL.reviewArtifactDigest === APPROVED_REVIEW_DIGEST, "English freeze approval digest mismatch");
assert(INT_CP006_LOCALIZED_V7_FREEZE_APPROVAL.reviewArtifactDigest === APPROVED_REVIEW_DIGEST, "Localized freeze approval digest mismatch");
approvalEvidenceChecks += 4;

const summary = {
  englishExplanationFreezeId: INT_CP006_ENGLISH_EXPLANATION_FREEZE_ID,
  localizedFreezeId: INT_CP006_LOCALIZED_V7_FREEZE_ID,
  approvedExplanationVersion: INT_CP006_EXPANDED_EXPLANATION_VERSION,
  approvedLocalizedVersion: INT_CP006_LOCALIZED_EXPLANATION_VERSION,
  approvedReviewHead: APPROVED_REVIEW_HEAD,
  approvedReviewRun: APPROVED_REVIEW_RUN,
  approvedReviewArtifact: APPROVED_REVIEW_ARTIFACT,
  approvedReviewDigest: APPROVED_REVIEW_DIGEST,
  qls: INT_CP006_QL_IDS.length,
  englishFrozenQuestions,
  localizedFrozenQuestions,
  totalFrozenQuestions: englishFrozenQuestions + localizedFrozenQuestions,
  deterministicReplayChecks,
  approvedIdentityChecks,
  originalEnglishFreezeChecks,
  lifecycleChecks,
  deepFreezeChecks,
  nativeScriptChecks,
  punjabiTerminologyChecks,
  approvalEvidenceChecks,
};
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP006_EXPLANATION_FREEZE_V1_AUDIT");

const outputDirectory = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outputDirectory, { recursive: true });
const evidencePath = path.join(outputDirectory, "INT-CP-006-EXPLANATION-FREEZE-EVIDENCE.md");
const evidence = [
  "# INT-CP-006 — Approved Explanation Freeze Evidence",
  "",
  `- English explanation freeze: **${INT_CP006_ENGLISH_EXPLANATION_FREEZE_ID}**`,
  `- Hindi/Punjabi learner freeze: **${INT_CP006_LOCALIZED_V7_FREEZE_ID}**`,
  `- Approved shared explanation authority: **${INT_CP006_EXPANDED_EXPLANATION_VERSION}**`,
  `- Approved localized authority: **${INT_CP006_LOCALIZED_EXPLANATION_VERSION}**`,
  `- Product approval authority: **PRODUCT_OWNER_APPROVED_CP006_EXPLANATIONS_V4_V7_2026_08_18**`,
  `- Approved review head: \`${APPROVED_REVIEW_HEAD}\``,
  `- Approved review run: \`${APPROVED_REVIEW_RUN}\``,
  `- Approved review artifact: \`${APPROVED_REVIEW_ARTIFACT}\``,
  `- Approved review digest: \`${APPROVED_REVIEW_DIGEST}\``,
  "",
  `Frozen replay: **${englishFrozenQuestions + localizedFrozenQuestions} questions** across 13 QLs and English/Hindi/Punjabi.`,
  `Deterministic replay checks: **${deterministicReplayChecks}**.`,
  `Approved learner-content identity checks: **${approvedIdentityChecks}**.`,
  `Original English question-freeze preservation checks: **${originalEnglishFreezeChecks}**.`,
  `Punjabi terminology/script checks: **${punjabiTerminologyChecks}**.`,
  "",
  "Punjabi compound interest is frozen as **ਮਿਸ਼ਰਤ ਵਿਆਜ**; the deprecated `ਚੱਕਰਵੱਧੀ` form is rejected from Punjabi learner surfaces.",
  "",
  "All downstream delivery remains closed: no staging, registration, Question Studio discovery, Question Bank storage, test eligibility or public publication.",
  "",
  "PASS_INT_CP006_EXPLANATION_FREEZE_V1_AUDIT",
  "",
].join("\n");
fs.writeFileSync(evidencePath, evidence, "utf8");
