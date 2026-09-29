import assert from "node:assert/strict";
import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";
import { VEN_001_SCENARIO_AUTHORITIES } from "./ven-001-scenario-authorities.ts";
import { VEN_001_QUESTION_STUDIO_PACKAGE_ID } from "./question-studio-integration.ts";

const packageDefinition = reasoningV1QuestionStudioAdapter
  .listPackages()
  .find((item) => item.packageId === VEN_001_QUESTION_STUDIO_PACKAGE_ID);
assert.ok(
  packageDefinition,
  "VEN-001 should be discoverable through the standard Question Studio package registry",
);
assert.equal(packageDefinition.engineId, "reasoning-v1");
assert.equal(packageDefinition.enabled, true);
assert.deepEqual(packageDefinition.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(packageDefinition.questionBankWritable, false);
assert.equal(packageDefinition.difficultyFilterSupported, true);
assert.equal(packageDefinition.testEligible, false);
assert.equal(packageDefinition.mockTestEligible, false);
assert.equal(packageDefinition.publiclyPublishable, false);

let canonicalOperationSignature: unknown;
for (const language of ["en", "hi", "pa"] as const) {
  const result = await reasoningV1QuestionStudioAdapter.generate({
    packageId: VEN_001_QUESTION_STUDIO_PACKAGE_ID,
    language,
    count: 4,
    seed: "ven001-integration-proof",
  });
  assert.equal(result.questions.length, 4);
  const first = result.questions[0]!;
  const repeated = await reasoningV1QuestionStudioAdapter.generate({
    packageId: VEN_001_QUESTION_STUDIO_PACKAGE_ID,
    language,
    count: 4,
    seed: "ven001-integration-proof",
  });
  assert.deepEqual(
    result.questions.map((item) => item.questionId),
    repeated.questions.map((item) => item.questionId),
  );
  const operationSignature = result.questions.map((item) => ({
    authorityId: item.sourceAuthorityId,
    questionOperation: item.questionOperation,
    topology: (item.semanticMetadata as any).targetTopologyId,
    correctIndex: item.correctIndex,
    optionSemantics: (item.optionDetails as any[]).map(
      (option) => option.semanticKey,
    ),
  }));
  if (language === "en") canonicalOperationSignature = operationSignature;
  else
    assert.deepEqual(
      operationSignature,
      canonicalOperationSignature,
      `${language} must preserve operation, topology, options and answer position`,
    );
  for (const item of result.questions) {
    assert.equal(item.options?.length, 4);
    assert.equal((item.validation as any).distinctOptions, true);
    if (item.questionOperation === "CATEGORIES_TO_DIAGRAM") {
      assert.equal((item.optionSvgs as string[]).length, 4);
      assert.equal(item.stimulusSvgs, undefined);
    } else {
      assert.equal((item.stimulusSvgs as string[]).length, 1);
      assert.equal(item.optionSvgs, undefined);
    }
    assert.equal(
      item.canonicalAnswer,
      item.options?.[item.correctIndex as number],
    );
    assert.equal((item.validation as any).exactlyOneCorrect, true);
    assert.equal(item.reviewOnly, true);
    assert.equal(item.questionBankWritable, false);
    assert.equal(item.testEligible, false);
    assert.equal(item.mockTestEligible, false);
    assert.equal(item.publiclyPublishable, false);
    assert.equal(item.productionReleaseAuthorized, false);
    assert.ok(String(item.stem).length > 20);
    assert.ok(String(item.explanation).length > 20);
    const stemText = String(item.stem);
    const explanationText = String(item.explanation);
    assert.doesNotMatch(stemText, /^Let A =|^मानें,|^ਮੰਨੋ,/);
    assert.doesNotMatch(explanationText, /Every [A-Za-z]+s is a [A-Za-z]+s/);
    if (language === "en") {
      assert.match(stemText, /Which Venn diagram|Which option names/);
    } else if (language === "hi") {
      assert.match(stemText, /वेन आरेख/);
    } else {
      assert.match(stemText, /ਵੇਨ ਚਿੱਤਰ/);
    }

  }
  assert.notEqual(first.questionId, "");
}
assert.equal(VEN_001_SCENARIO_AUTHORITIES.length, 22);
const fullReviewPool = await reasoningV1QuestionStudioAdapter.generate({
  packageId: VEN_001_QUESTION_STUDIO_PACKAGE_ID,
  count: 22,
  seed: "ven001-full-review-pool-proof",
});
assert.equal(fullReviewPool.questions.length, 22);
assert.equal(
  new Set(fullReviewPool.questions.map((item) => item.sourceAuthorityId)).size,
  22,
);
assert.ok(
  fullReviewPool.questions.every(
    (item) => (item.validation as any).exactlyOneCorrect === true,
  ),
);
const reverseBatch = await reasoningV1QuestionStudioAdapter.generate({
  packageId: VEN_001_QUESTION_STUDIO_PACKAGE_ID,
  patternId: "VEN-CP003-REVERSE",
  count: 4,
  language: "en",
  seed: "ven001-reverse-operation-proof",
});
assert.ok(
  reverseBatch.questions.every(
    (item) => item.questionOperation === "DIAGRAM_TO_CATEGORIES",
  ),
);
for (const item of reverseBatch.questions) {
  assert.equal((item.stimulusSvgs as string[]).length, 1);
  const reverseSvgLabels = [
    ...String((item.stimulusSvgs as string[])[0]).matchAll(/<text\b[^>]*>(.*?)<\/text>/g),
  ].map((match) => match[1]);
  assert.deepEqual(
    reverseSvgLabels,
    (item.semanticMetadata as any).correctCircleLabelOrder,
    "The reverse-operation diagram must visibly label the sets using the target relation order",
  );
  assert.equal(item.optionSvgs, undefined);
  assert.equal(item.options?.length, 4);
  assert.equal((item.validation as any).exactlyOneCorrect, true);
  assert.equal(
    new Set((item.optionDetails as any[]).map((option) => option.semanticKey))
      .size,
    4,
  );
  assert.equal(
    item.canonicalAnswer,
    item.options?.[item.correctIndex as number],
  );
}
const directBatch = await reasoningV1QuestionStudioAdapter.generate({
  packageId: VEN_001_QUESTION_STUDIO_PACKAGE_ID,
  patternId: "VEN-CP003-DIRECT",
  count: 3,
  seed: "ven001-direct-operation-proof",
});
assert.ok(
  directBatch.questions.every(
    (item) => item.questionOperation === "CATEGORIES_TO_DIAGRAM",
  ),
);
const easyBatch = await reasoningV1QuestionStudioAdapter.generate({
  packageId: VEN_001_QUESTION_STUDIO_PACKAGE_ID,
  difficulty: "Easy",
  count: 3,
  seed: "ven001-easy-filter-proof",
});
assert.ok(easyBatch.questions.every((item) => item.difficulty === "Easy"));
const mediumBatch = await reasoningV1QuestionStudioAdapter.generate({
  packageId: VEN_001_QUESTION_STUDIO_PACKAGE_ID,
  difficulty: "Medium",
  count: 3,
  seed: "ven001-medium-filter-proof",
});
assert.ok(mediumBatch.questions.every((item) => item.difficulty === "Medium"));
await assert.rejects(
  () =>
    reasoningV1QuestionStudioAdapter.generate({
      packageId: VEN_001_QUESTION_STUDIO_PACKAGE_ID,
      runtimeMode: "production",
    }),
  /review-only/,
);
await assert.rejects(
  () =>
    reasoningV1QuestionStudioAdapter.generate({
      packageId: VEN_001_QUESTION_STUDIO_PACKAGE_ID,
      difficulty: "Hard",
    }),
  /Easy and Medium/,
);
await assert.rejects(
  () =>
    reasoningV1QuestionStudioAdapter.generate({
      packageId: VEN_001_QUESTION_STUDIO_PACKAGE_ID,
      count: 23,
    }),
  /currently has 22 distinct review authorities/,
);
console.log("PASS_VEN_001_QUESTION_STUDIO_REVIEW_INTEGRATION");
