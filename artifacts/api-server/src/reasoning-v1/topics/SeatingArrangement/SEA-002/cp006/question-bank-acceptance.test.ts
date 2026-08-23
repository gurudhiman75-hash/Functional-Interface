import assert from "node:assert/strict";

import {
  getGeneratedItemApprovalDisposition,
} from "../../../../../lib/admin-question-studio-approval-policy.ts";
import {
  normalizeGeneratedQuestionPayload,
} from "../../../../../lib/admin-question-conversion.ts";
import {
  generateSea002Cp006QuestionBankAcceptedBatch,
  listSea002Cp006QuestionBankAcceptedPackages,
  SEA002_CP006_QUESTION_BANK_ACCEPTANCE,
  SEA002_CP006_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
} from "./question-bank-acceptance.ts";
import {
  generateSea002Cp006QuestionStudioBatch as generateFrozenSourceBatch,
} from "./question-studio-integration.ts";

const languages = ["en", "hi", "pa"] as const;
const difficulties = ["Easy", "Medium", "Hard"] as const;
const qls = new Set<string>();
const queries = new Set<string>();
const variants = new Set<string>();
let converted = 0;
let multilingual = 0;
let diagrams = 0;
let downstreamLocks = 0;

assert.equal(SEA002_CP006_QUESTION_BANK_ACCEPTANCE.status, "QUESTION_BANK_ACCEPTANCE_ENABLED");
assert.equal(SEA002_CP006_QUESTION_BANK_ACCEPTANCE.questionBank.writable, true);
assert.equal(SEA002_CP006_QUESTION_BANK_ACCEPTANCE.questionBank.acceptanceMode, "BANK_ONLY");
assert.equal(SEA002_CP006_QUESTION_BANK_ACCEPTANCE.downstreamLifecycle.testEligible, false);
assert.equal(SEA002_CP006_QUESTION_BANK_ACCEPTANCE.downstreamLifecycle.publiclyPublishable, false);

const packageCapability = listSea002Cp006QuestionBankAcceptedPackages()[0]!;
assert.equal(packageCapability.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(packageCapability.questionBankWritable, true);
assert.equal(packageCapability.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(packageCapability.manualApprovalRequired, true);
assert.equal(packageCapability.testEligible, false);
assert.equal(packageCapability.mockTestEligible, false);
assert.equal(packageCapability.publiclyPublishable, false);
assert.equal(packageCapability.automaticStudentPublication, false);

const frozenSource = await generateFrozenSourceBatch({
  language: "en",
  difficulty: "Medium",
  count: 1,
  seed: "cp006-bank-activation-source-lock",
});
assert.equal(frozenSource.questions[0]!.questionBankStatus, "NOT_STORED");
assert.equal(frozenSource.questions[0]!.questionBankWritable, false);
assert.equal(frozenSource.questions[0]!.testEligible, false);
assert.equal(frozenSource.questions[0]!.publiclyPublishable, false);

for (const language of languages) {
  for (const difficulty of difficulties) {
    const batch = await generateSea002Cp006QuestionBankAcceptedBatch({
      language,
      difficulty,
      count: 8,
      seed: `cp006-bank-activation:${language}:${difficulty}`,
    });

    assert.equal(batch.questions.length, 8);
    assert.equal(batch.generationContext.questionBankStatus, "READY_FOR_STORAGE");
    assert.equal(batch.generationContext.questionBankWritable, true);
    assert.equal(batch.generationContext.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(batch.generationContext.questionBankAcceptanceAuthority, SEA002_CP006_QUESTION_BANK_ACCEPTANCE_AUTHORITY);
    assert.equal(batch.generationContext.testEligible, false);
    assert.equal(batch.generationContext.publiclyPublishable, false);

    for (let index = 0; index < batch.questions.length; index += 1) {
      const question = batch.questions[index]!;
      qls.add(String(question.qlId));
      queries.add(String(question.queryContractId));
      variants.add(String(question.runtimeVariant));

      assert.equal(question.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(question.questionBankWritable, true);
      assert.equal(question.questionBankAcceptanceMode, "BANK_ONLY");
      assert.equal(question.questionBankAcceptanceAuthority, "SEA002_CP006_QUESTION_BANK_READINESS_V1");
      assert.equal(question.manualApprovalRequired, true);
      assert.equal(question.testEligibility, "INELIGIBLE");
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.automaticStudentPublication, false);
      downstreamLocks += 1;

      const explanation = String(question.explanation);
      assert.match(explanation, /<img src="data:image\/svg\+xml;base64,/u);
      assert.doesNotMatch(explanation, /<script|<iframe|javascript:/iu);
      diagrams += 1;

      const persistedPayload = {
        ...question,
        generationContext: batch.generationContext,
      };
      const disposition = getGeneratedItemApprovalDisposition(persistedPayload);
      assert.equal(disposition.mode, "question_bank");

      const normalized = normalizeGeneratedQuestionPayload(persistedPayload, {
        itemId: `cp006-bank-${language}-${difficulty}-${index}`,
        generationRunCode: `SEA002-${language}-${difficulty}`,
      });
      assert.equal(normalized.options.length, 4);
      assert.equal(normalized.correctIndex, question.correctIndex);
      assert.match(normalized.explanation, /<img src="data:image\/svg\+xml;base64,/u);
      const generation = normalized.answerModel.generation as Record<string, unknown>;
      assert.equal(generation.qlId, question.qlId);
      assert.equal(generation.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(generation.questionBankWritable, true);
      assert.equal(generation.questionBankAcceptanceMode, "BANK_ONLY");
      assert.equal(generation.testEligible, false);
      assert.equal(generation.mockTestEligible, false);
      assert.equal(generation.publiclyPublishable, false);
      assert.equal(generation.automaticStudentPublication, false);
      converted += 1;
      if (language !== "en") multilingual += 1;
    }
  }
}

assert.deepEqual([...qls].sort(), ["SEA-QL-021", "SEA-QL-022", "SEA-QL-023", "SEA-QL-024"]);
assert.deepEqual([...queries].sort(), [
  "SEA-QC-003",
  "SEA-QC-006",
  "SEA-QC-008",
  "SEA-QC-010",
  "SEA-QC-011",
  "SEA-QC-012",
  "SEA-QC-014",
  "SEA-QC-015",
]);
assert.deepEqual([...variants].sort(), [
  "APPROVED_BASELINE",
  "EXAM_REAL_SOURCE_A",
  "EXAM_REAL_SOURCE_B",
]);
assert.equal(converted, 72);
assert.equal(multilingual, 48);
assert.equal(diagrams, 72);
assert.equal(downstreamLocks, 72);

console.log("PASS_SEA002_CP006_QUESTION_BANK_ACCEPTANCE_V1");
console.log("accepted conversion payloads", converted);
console.log("multilingual accepted payloads", multilingual);
console.log("permanent QLs", [...qls].sort().join(","));
console.log("frozen queries", [...queries].sort().join(","));
console.log("runtime variants", [...variants].sort().join(","));
console.log("solved diagrams preserved", diagrams);
console.log("BANK_ONLY true; test/mock/public false", downstreamLocks);
console.log("frozen source generator remains NOT_STORED / false");
console.log("next gate", SEA002_CP006_QUESTION_BANK_ACCEPTANCE.nextGate);
