import assert from "node:assert/strict";

import {
  generateQuestion as generateSharedQuestionStudioQuestion,
  listQuestionStudioPackages,
} from "../../../../../question-studio/shared-generation-engine.ts";
import {
  generateSea002Cp006QuestionStudioBatch,
  isSea002Cp006QuestionStudioRequest,
  listSea002Cp006QuestionStudioPackages,
  SEA002_CP006_QUESTION_STUDIO_QL_IDS,
} from "./question-studio-integration.ts";
import {
  SEA002_CP006_ENGLISH_FREEZE,
  SEA002_CP006_FROZEN_QUERY_CONTRACTS,
  SEA002_CP006_LOCALIZATION_FREEZE,
  SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE,
} from "./permanent/freeze.ts";
import { SEA002_CP006_PERMANENT_QL_REGISTRY } from "./permanent/registry.ts";

assert.equal(SEA002_CP006_ENGLISH_FREEZE.freezeActive, true);
assert.equal(SEA002_CP006_LOCALIZATION_FREEZE.freezeActive, true);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationFrozen, true);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.mockTestEligible, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.productionStaging, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable, false);
for (const source of SEA002_CP006_PERMANENT_QL_REGISTRY) {
  assert.equal(source.active, false);
  assert.equal(source.questionStudioDiscoverable, false);
  assert.equal(source.questionBankWritable, false);
  assert.equal(source.testEligible, false);
  assert.equal(source.publiclyPublishable, false);
}

assert.equal(isSea002Cp006QuestionStudioRequest({ packageId: "SEA-002" }), true);
assert.equal(isSea002Cp006QuestionStudioRequest({ canonicalProblemId: "SEA-CP-006" }), true);
assert.equal(isSea002Cp006QuestionStudioRequest({ questionLanguageId: "SEA-QL-021" }), true);
assert.equal(isSea002Cp006QuestionStudioRequest({ topic: "Reasoning", subtopic: "Seating Arrangement" }), true);
assert.equal(isSea002Cp006QuestionStudioRequest({ packageId: "NUM-002" }), false);

const localCapability = listSea002Cp006QuestionStudioPackages()[0]!;
assert.equal(localCapability.packageId, "SEA-002");
assert.deepEqual(localCapability.cpIds, ["SEA-CP-006"]);
assert.deepEqual(localCapability.permanentQlIds, ["SEA-QL-021", "SEA-QL-022", "SEA-QL-023", "SEA-QL-024"]);
assert.deepEqual(localCapability.frozenQueryContracts, SEA002_CP006_FROZEN_QUERY_CONTRACTS);
assert.deepEqual(localCapability.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(localCapability.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(localCapability.enabled, true);
assert.equal(localCapability.runtimeMode, "QUESTION_STUDIO_ACTIVE");
assert.equal(localCapability.reviewOnly, true);
assert.equal(localCapability.sourceQuestionStudioRegistered, false);
assert.equal(localCapability.questionBankWritable, false);
assert.equal(localCapability.testEligible, false);
assert.equal(localCapability.mockTestEligible, false);
assert.equal(localCapability.publiclyPublishable, false);
assert.equal(localCapability.automaticStudentPublication, false);
assert.equal(localCapability.approvedCorpusComposition, "80_EXAM_REAL_20_APPROVED_BASELINE");

const sharedCapability = listQuestionStudioPackages().find((entry: any) => entry.packageId === "SEA-002");
assert.ok(sharedCapability, "SEA-002 must be discoverable through the shared Question Studio capability list");
assert.equal(sharedCapability.enabled, true);
assert.equal(sharedCapability.permanentQlCount, 4);
assert.deepEqual(sharedCapability.permanentQlIds, SEA002_CP006_QUESTION_STUDIO_QL_IDS);
assert.deepEqual(sharedCapability.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(sharedCapability.questionBankWritable, false);
assert.equal(sharedCapability.testEligible, false);
assert.equal(sharedCapability.publiclyPublishable, false);

const targetScript = {
  hi: /[\u0900-\u097F]/u,
  pa: /[\u0A00-\u0A7F]/u,
} as const;
const qlReach = new Set<string>();
const queryReach = new Set<string>();
const runtimeVariants = new Set<string>();
let generatedCount = 0;
let multilingualCount = 0;
let sourceLifecycleLocks = 0;
let integrationLifecycleLocks = 0;

for (const language of ["en", "hi", "pa"] as const) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const result = await generateSea002Cp006QuestionStudioBatch({
      packageId: "SEA-002",
      canonicalProblemId: "SEA-CP-006",
      language,
      difficulty,
      seed: `sea-cp006-question-studio-proof:${language}:${difficulty}`,
      count: 8,
    });
    assert.equal(result.questions.length, 8);
    assert.equal(result.questionPackages.length, 8);
    assert.equal(new Set(result.questions.map((question) => question.questionId)).size, 8);
    assert.deepEqual(
      [...new Set(result.questions.map((question) => question.queryContractId))].sort(),
      [...SEA002_CP006_FROZEN_QUERY_CONTRACTS].sort(),
    );
    assert.equal(result.generationContext.runtimeMode, "QUESTION_STUDIO_ACTIVE");
    assert.equal(result.generationContext.lifecycleStatus, "REVIEW_ONLY");
    assert.equal(result.generationContext.queryCompleteRuntime, true);
    assert.deepEqual(result.generationContext.frozenQueryContracts, SEA002_CP006_FROZEN_QUERY_CONTRACTS);
    assert.equal(result.generationContext.approvedCorpusComposition, "80_EXAM_REAL_20_APPROVED_BASELINE");
    assert.equal(result.generationContext.sourceQuestionStudioRegistered, false);
    assert.equal(result.generationContext.adapterQuestionStudioDiscoverable, true);
    assert.equal(result.generationContext.questionBankWritable, false);
    assert.equal(result.generationContext.testEligible, false);
    assert.equal(result.generationContext.mockTestEligible, false);
    assert.equal(result.generationContext.publiclyPublishable, false);

    for (const question of result.questions) {
      generatedCount += 1;
      qlReach.add(question.qlId);
      queryReach.add(question.queryContractId);
      runtimeVariants.add(question.runtimeVariant);
      assert.ok(SEA002_CP006_QUESTION_STUDIO_QL_IDS.includes(question.qlId));
      assert.ok(SEA002_CP006_FROZEN_QUERY_CONTRACTS.includes(question.queryContractId));
      assert.equal(question.options.length, 4);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
      assert.equal(question.optionMetadata[question.correctIndex]!.isCorrect, true);
      assert.equal(question.canonicalAnswer.value, question.optionMetadata[question.correctIndex]!.canonicalValue);
      assert.equal(question.answer, question.options[question.correctIndex]);
      assert.equal(question.validation.ok, true);
      assert.equal(question.validation.valid, true);
      assert.equal(question.questionStudioDiscoverable, true);
      assert.equal(question.sourceQuestionStudioRegistered, false);
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.automaticStudentPublication, false);
      assert.equal(question.solutionDiagram.background, "white");
      assert.match(question.solutionDiagram.svg, /fill="white"/u);
      assert.doesNotMatch(question.solutionDiagram.svg, />C\d+</u);
      sourceLifecycleLocks += Number(
        question.traceability.sourceLifecycle.questionStudioRegistered === false
        && question.traceability.sourceLifecycle.questionBankWritable === false
        && question.traceability.sourceLifecycle.mockTestEligible === false
        && question.traceability.sourceLifecycle.publiclyPublishable === false,
      );
      integrationLifecycleLocks += Number(
        question.questionBankWritable === false
        && question.testEligible === false
        && question.mockTestEligible === false
        && question.publiclyPublishable === false
        && question.automaticStudentPublication === false,
      );

      const learnerSurface = [
        question.text,
        ...question.options,
        question.explanation,
        ...question.packageExplanation.optionRationales,
        question.solutionDiagram.text,
      ].join("\n");
      assert.doesNotMatch(learnerSurface, /\bcolumns?\b/iu);
      if (language !== "en") {
        multilingualCount += 1;
        assert.match(learnerSurface, targetScript[language]);
        assert.doesNotMatch(learnerSurface, /[A-Za-z]/u);
      }
    }
  }
}

assert.equal(generatedCount, 72);
assert.equal(multilingualCount, 48);
assert.equal(sourceLifecycleLocks, 72);
assert.equal(integrationLifecycleLocks, 72);
assert.deepEqual([...qlReach].sort(), [...SEA002_CP006_QUESTION_STUDIO_QL_IDS].sort());
assert.deepEqual([...queryReach].sort(), [...SEA002_CP006_FROZEN_QUERY_CONTRACTS].sort());
assert.deepEqual([...runtimeVariants].sort(), ["APPROVED_BASELINE", "EXAM_REAL_SOURCE_A", "EXAM_REAL_SOURCE_B"]);

const explicitQl = await generateSea002Cp006QuestionStudioBatch({
  questionLanguageId: "SEA-QL-024",
  language: "pa",
  difficulty: "Hard",
  seed: "sea-cp006-question-studio-explicit-ql",
  count: 8,
});
assert.equal(explicitQl.questions.length, 8);
assert.ok(explicitQl.questions.every((question) => question.qlId === "SEA-QL-024"));
assert.ok(explicitQl.questions.every((question) => question.authorityId === "SEA-PBA-024"));
assert.deepEqual(
  [...new Set(explicitQl.questions.map((question) => question.queryContractId))].sort(),
  [...SEA002_CP006_FROZEN_QUERY_CONTRACTS].sort(),
);

const sharedResult = await generateSharedQuestionStudioQuestion({
  packageId: "SEA-002",
  canonicalProblemId: "SEA-CP-006",
  questionLanguageId: "SEA-QL-022",
  language: "hi",
  difficulty: "Medium",
  seed: "sea-cp006-shared-routing-proof",
  count: 3,
});
assert.equal(sharedResult.questions.length, 3);
assert.ok(sharedResult.questions.every((question: any) => question.packageId === "SEA-002"));
assert.ok(sharedResult.questions.every((question: any) => question.qlId === "SEA-QL-022"));
assert.ok(sharedResult.questions.every((question: any) => question.language === "hi"));

console.log("PASS_SEA002_CP006_QUESTION_STUDIO_INTEGRATION_V1");
console.log("Question Studio generated", generatedCount);
console.log("multilingual learner checks", multilingualCount);
console.log("permanent QL reach", [...qlReach].sort().join(","));
console.log("frozen query contracts reached", [...queryReach].sort().join(","));
console.log("runtime variants", [...runtimeVariants].sort().join(","));
console.log("source lifecycle locks", sourceLifecycleLocks);
console.log("integration lifecycle locks", integrationLifecycleLocks);
console.log("English/localized freeze fingerprints", SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint, SEA002_CP006_LOCALIZATION_FREEZE.approvedLocalizedReviewFingerprint);
console.log("Studio review generation true; Bank/mock/staging/public false");
