import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { DIR_001_QLS, generateDirectionQuestion } from "./chapter-registry.ts";
import {
  DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  generateDir001QuestionStudioBatch,
} from "./dir-001-question-studio-integration.ts";
import {
  assertDirQuestionStudioMappingIntegrity,
  DIR_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
} from "./dir-001-post-closure-mapping-proof.ts";

const languages = ["en", "hi", "pa"] as const;
const samplesPerQl = 8;

assert.equal(DIR_001_QLS.length, 44);
assert.equal(DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata?.permanentQlCount, 44);
assert.equal(
  DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata?.multilingualFreezeAuthorityId,
  "DIR-001-MULTILINGUAL-FREEZE-V1",
);
assert.equal(
  DIR001_STANDARD_REVIEW_ONLY_PACKAGE_V1.metadata?.postClosureMappingProofAuthority,
  DIR_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
);

let mappedSurfaces = 0;
const digestRows: unknown[] = [];

for (const ql of DIR_001_QLS) {
  for (let sample = 0; sample < samplesPerQl; sample += 1) {
    const seed = `dir-post-closure:${ql.qlId}:${sample}`;
    const byLanguage = new Map<string, Record<string, any>>();

    for (const language of languages) {
      const result = await generateDir001QuestionStudioBatch({
        packageId: "DIR-001",
        canonicalProblemId: ql.qlId,
        language,
        difficulty: "Mixed",
        count: 1,
        seed,
        runtimeMode: "review-only",
      });
      assert.equal(result.questions.length, 1);
      assert.equal(result.generationContext.questionBankWritable, false);
      assert.equal(result.generationContext.testEligible, false);
      assert.equal(result.generationContext.mockTestEligible, false);
      assert.equal(result.generationContext.publiclyPublishable, false);
      assert.equal(result.generationContext.productionReleaseAuthorized, false);
      assert.equal(result.generationContext.postClosureMappingProofVerified, true);
      assert.equal(
        result.generationContext.postClosureMappingProofAuthority,
        DIR_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
      );

      const question = result.questions[0] as Record<string, any>;
      assert.equal(question.qlId, ql.qlId);
      assert.equal(question.checkpointId, ql.checkpointId);
      assert.equal(question.language, language);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
      assert.equal(question.canonicalAnswer, question.options[question.correctIndex]);
      assert.equal(question.validation.solverVerified, true);
      assert.equal(question.validation.questionDiagramAbsent, true);
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.automaticStudentPublication, false);
      assert.equal(question.productionReleaseAuthorized, false);
      assert.equal(question.reviewOnly, true);
      assert.equal(question.postClosureMappingProofVerified, true);
      assert.equal(
        question.postClosureMappingProofAuthority,
        DIR_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
      );
      if (language !== "en") assert.equal(question.validation.answerParityVerified, true);

      byLanguage.set(language, question);
      mappedSurfaces += 1;
      digestRows.push({
        qlId: ql.qlId,
        language,
        sample,
        correctIndex: question.correctIndex,
        answer: question.answer,
        canonicalAnswer: question.canonicalAnswer,
        options: question.options,
        difficulty: question.difficulty,
        numericSeed: question.numericSeed,
      });
    }

    const english = byLanguage.get("en")!;
    const hindi = byLanguage.get("hi")!;
    const punjabi = byLanguage.get("pa")!;
    assert.deepEqual(hindi.answer, english.answer, `${ql.qlId}/${sample}: Hindi semantic answer drift`);
    assert.deepEqual(punjabi.answer, english.answer, `${ql.qlId}/${sample}: Punjabi semantic answer drift`);
    assert.equal(hindi.correctIndex, english.correctIndex);
    assert.equal(punjabi.correctIndex, english.correctIndex);
    assert.equal(hindi.numericSeed, english.numericSeed);
    assert.equal(punjabi.numericSeed, english.numericSeed);
  }
}

// Deliberately corrupt the final mapped correct index; the mapping proof must reject it.
{
  const generated = generateDirectionQuestion("DIR-QL-001", 73) as Record<string, any>;
  const labels = generated.options.map((option: any) => option.label);
  const mapped = {
    options: labels,
    correctIndex: generated.correctIndex,
    correct: generated.correctIndex,
    answer: generated.correctAnswer,
    canonicalAnswer: labels[generated.correctIndex],
    validation: { solverVerified: true, answerParityVerified: true },
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
    reviewOnly: true,
  };
  assertDirQuestionStudioMappingIntegrity(generated, mapped, "en");
  assert.throws(
    () => assertDirQuestionStudioMappingIntegrity(generated, {
      ...mapped,
      correctIndex: (generated.correctIndex + 1) % 4,
      correct: (generated.correctIndex + 1) % 4,
    }, "en"),
    /changed the correct index/i,
  );
}

const semanticDigest = createHash("sha256")
  .update(JSON.stringify(digestRows))
  .digest("hex");

console.log(JSON.stringify({
  status: "PASS_DIR_001_POST_CLOSURE_AUDIT_20261004",
  permanentQlCount: DIR_001_QLS.length,
  languages,
  samplesPerQl,
  mappedSurfaces,
  multilingualFreezeAuthority: "DIR-001-MULTILINGUAL-FREEZE-V1",
  mappingProofAuthority: DIR_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
  semanticDigest,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  productionReleaseAuthorized: false,
}, null, 2));
