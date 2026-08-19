import assert from "node:assert/strict";
import { STA_ENGLISH_CORPUS_BY_QL, STA_ENGLISH_CORPUS_V2 } from "./english-corpus/index.ts";
import { generateStaQuestionFromPool } from "./generator.ts";

const ql003ExplicitCapabilityPatterns: readonly RegExp[] = [
  /\bmay be returned through\b/i,
  /\bcan complete it at\b/i,
  /\bwill operate from\b/i,
  /\bwill be handled at\b/i,
  /\bcash withdrawals can be made at\b/i,
  /\bcorrection portal remains available until\b/i,
  /\bhelp desk will remain open until\b/i,
];

let shapeChecks = 0;
let ql003StatementChecks = 0;
let generatedReviewChecks = 0;
let maxExplanationWords = 0;

for (const scenario of STA_ENGLISH_CORPUS_V2) {
  const relations = new Set(scenario.hiddenDependencies.map((dependency) => dependency.relation));

  switch (scenario.semanticShape) {
    case "SINGLE_PRECONDITION":
      assert.equal(scenario.hiddenDependencies.length, 1, `${scenario.scenarioId}: SINGLE_PRECONDITION must have exactly one hidden dependency`);
      break;
    case "MULTI_PRECONDITION":
      assert.ok(scenario.hiddenDependencies.length >= 2, `${scenario.scenarioId}: MULTI_PRECONDITION must have at least two hidden dependencies`);
      break;
    case "NEED_PLUS_EFFICACY":
      assert.ok(relations.has("EFFICACY"), `${scenario.scenarioId}: NEED_PLUS_EFFICACY is missing EFFICACY`);
      assert.ok(relations.has("EXISTENCE") || relations.has("RELEVANCE") || scenario.explicitPropositionIds.length > 0, `${scenario.scenarioId}: NEED_PLUS_EFFICACY has no need/problem anchor`);
      break;
    case "NEED_PLUS_FEASIBILITY":
      assert.ok(relations.has("FEASIBILITY"), `${scenario.scenarioId}: NEED_PLUS_FEASIBILITY is missing FEASIBILITY`);
      assert.ok(relations.has("EXISTENCE") || relations.has("RELEVANCE") || scenario.explicitPropositionIds.length > 0, `${scenario.scenarioId}: NEED_PLUS_FEASIBILITY has no need/problem anchor`);
      break;
    case "NEED_PLUS_FEASIBILITY_PLUS_EFFICACY":
      assert.ok(relations.has("FEASIBILITY"), `${scenario.scenarioId}: NEED_PLUS_FEASIBILITY_PLUS_EFFICACY is missing FEASIBILITY`);
      assert.ok(relations.has("EFFICACY"), `${scenario.scenarioId}: NEED_PLUS_FEASIBILITY_PLUS_EFFICACY is missing EFFICACY`);
      break;
    case "AUDIENCE_RELEVANCE_PLUS_CAPABILITY":
    case "SERVICE_RELEVANCE_PLUS_CAPABILITY":
      assert.ok(relations.has("RELEVANCE"), `${scenario.scenarioId}: QL003 semantic shape is missing RELEVANCE`);
      assert.ok(relations.has("CAPABILITY"), `${scenario.scenarioId}: QL003 semantic shape is missing CAPABILITY`);
      break;
    case "EXPLICIT_PREMISE_PLUS_HIDDEN_BRIDGE":
      assert.ok(scenario.explicitPropositionIds.length > 0, `${scenario.scenarioId}: QL004 shape requires an explicit premise`);
      assert.ok(relations.has("EFFICACY"), `${scenario.scenarioId}: QL004 shape requires a hidden efficacy bridge`);
      break;
  }
  shapeChecks += 1;

  if (scenario.proposedQlId === "STA-QL-003") {
    for (const statement of scenario.statementVariants) {
      for (const pattern of ql003ExplicitCapabilityPatterns) {
        assert.equal(pattern.test(statement), false, `${scenario.scenarioId}: QL003 stem explicitly states a capability that should remain an assumption: ${statement}`);
      }
      ql003StatementChecks += 1;
    }
  }

  if (scenario.scenarioId === "STA-EN2-QL002-APPOINTMENT-CALLS") {
    for (const statement of scenario.statementVariants) {
      assert.equal(/\bforget(?:ting|s|ful|fulness)?\b/i.test(statement), false, `${scenario.scenarioId}: stem explicitly states the hidden forgetfulness relevance assumption`);
    }
  }

  if (scenario.scenarioId === "STA-EN2-QL002-LOANER-DEVICES") {
    for (const statement of scenario.statementVariants) {
      assert.equal(/\b(?:without|lack(?:s|ing)?|do not have)\b[^.]{0,45}\b(?:device|tablet)\b/i.test(statement), false, `${scenario.scenarioId}: stem explicitly states the hidden device-access assumption`);
    }
  }

  if (scenario.scenarioId === "STA-EN2-QL002-ROTATING-FIELD-TEAMS") {
    for (const statement of scenario.statementVariants) {
      assert.equal(/\bpostponements? caused by local team unavailability\b/i.test(statement), false, `${scenario.scenarioId}: stem explicitly states the hidden local-team relevance bridge`);
    }
  }

  for (let index = 0; index < 2; index += 1) {
    const singleAuthorityPool = {
      ...STA_ENGLISH_CORPUS_BY_QL,
      [scenario.proposedQlId]: [scenario],
    };
    const question = generateStaQuestionFromPool(
      `STA-EXAM-READINESS-${scenario.scenarioId}-${index}`,
      scenario.proposedQlId,
      singleAuthorityPool,
    );
    assert.equal(question.explanation.includes(question.statement), false, `${question.questionId}: explanation repeats the full stem`);
    const wordCount = question.explanation.trim().split(/\s+/).length;
    assert.ok(wordCount <= 100, `${question.questionId}: explanation is too long for STA review (${wordCount} words)`);
    maxExplanationWords = Math.max(maxExplanationWords, wordCount);
    generatedReviewChecks += 1;
  }
}

assert.equal(shapeChecks, 64, "Expected semantic-shape audit over all 64 V2 authorities");
assert.equal(ql003StatementChecks, 32, "Expected both statement variants for all 16 QL003 authorities");
assert.equal(generatedReviewChecks, 128, "Expected two generated exam-readiness checks per authority");

console.log("PASS_STA_001_ENGLISH_EXAM_READINESS_V2");
console.log(`semantic-shape checks ${shapeChecks}`);
console.log(`QL003 hidden-capability statement checks ${ql003StatementChecks}`);
console.log(`generated explanation checks ${generatedReviewChecks}`);
console.log(`maximum explanation words ${maxExplanationWords}`);
console.log("English corpus status V2_REVIEW_CANDIDATE_NOT_FROZEN");
console.log("Question Studio false");
