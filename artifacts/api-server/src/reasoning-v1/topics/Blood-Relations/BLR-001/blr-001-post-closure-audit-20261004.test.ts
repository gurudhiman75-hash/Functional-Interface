import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import {
  generateBlr001StandardQuestionStudioBatch,
  listBlr001StandardQuestionStudioPackages,
} from "./question-studio-standard-integration.ts";
import {
  generateBlr001ChapterQuestionStudioBatch,
  BLR001_STANDARD_QUESTION_STUDIO_PACKAGE_V1,
} from "./question-studio-chapter-integration.ts";
import {
  assertBlrStandardMappingIntegrity,
  BLR_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
} from "./question-studio-post-closure-proof.ts";

const packages = listBlr001StandardQuestionStudioPackages();
assert.equal(packages.length, 7);

const qlIds = [...new Set(packages.flatMap((entry) => entry.qlIds))].sort();
assert.equal(qlIds.length, 35);
assert.equal(qlIds[0], "BLR-QL-001");
assert.equal(qlIds[34], "BLR-QL-035");
assert.equal(qlIds.includes("BLR-QL-036"), false);
assert.equal(BLR001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.metadata?.qlCount, 35);
assert.equal(BLR001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.metadata?.multilingualFreeze, true);

const languages = ["en", "hi", "pa"] as const;
let sourceMappedSurfaces = 0;
let chapterMappedSurfaces = 0;
const digestRows: unknown[] = [];

for (const pkg of packages) {
  for (const qlId of pkg.qlIds) {
    for (const language of languages) {
      for (let sample = 0; sample < 8; sample += 1) {
        const result = generateBlr001StandardQuestionStudioBatch({
          packageId: pkg.packageId,
          canonicalProblemId: qlId,
          language,
          count: 1,
          seed: `blr-post-closure:${pkg.packageId}:${qlId}:${language}:${sample}`,
        });
        assert.equal(result.generationContext.persistenceAllowed, false);
        assert.equal(result.generationContext.questionBankStatus, "NOT_STORED");
        assert.equal(result.generationContext.testEligibility, "INELIGIBLE");
        assert.equal(result.generationContext.publiclyPublishable, false);
        assert.equal(result.generationContext.postClosureMappingProofVerified, true);
        assert.equal(
          result.generationContext.postClosureMappingProofAuthority,
          BLR_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
        );

        const question = result.questions[0]!;
        assert.equal(question.qlId, qlId);
        assert.equal(question.language, language);
        assert.equal(question.options.length, 4);
        assert.equal(new Set(question.options).size, 4);
        assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
        assert.equal(question.validation?.valid, true);
        assert.equal(question.questionBankWritable, false);
        assert.equal(question.testEligible, false);
        assert.equal(question.mockTestEligible, false);
        assert.equal(question.publiclyPublishable, false);
        assert.equal(question.automaticStudentPublication, false);
        assert.equal(question.reviewOnly, true);
        assert.equal(question.manualApprovalRequired, true);
        assert.equal(question.postClosureMappingProofVerified, true);
        assert.equal(
          question.postClosureMappingProofAuthority,
          BLR_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
        );

        digestRows.push({
          packageId: pkg.packageId,
          qlId,
          language,
          sample,
          questionId: question.questionId,
          correctIndex: question.correctIndex,
          options: question.options,
          integrationAuthority: question.integrationAuthority,
        });
        sourceMappedSurfaces += 1;
      }

      for (let sample = 0; sample < 2; sample += 1) {
        const result = await generateBlr001ChapterQuestionStudioBatch({
          engineId: "reasoning-v1",
          packageId: "BLR-001",
          canonicalProblemId: qlId,
          language,
          runtimeMode: "review-only",
          count: 1,
          seed: `blr-post-closure-chapter:${qlId}:${language}:${sample}`,
        });
        assert.equal(result.generationContext.questionBankWritable, false);
        assert.equal(result.generationContext.testEligible, false);
        assert.equal(result.generationContext.mockTestEligible, false);
        assert.equal(result.generationContext.publiclyPublishable, false);
        assert.equal(result.generationContext.automaticStudentPublication, false);

        const question = result.questions[0]!;
        assert.equal(question.packageId, "BLR-001");
        assert.equal(question.qlId, qlId);
        assert.equal(question.language, language);
        assert.equal(question.questionBankWritable, false);
        assert.equal(question.testEligible, false);
        assert.equal(question.mockTestEligible, false);
        assert.equal(question.publiclyPublishable, false);
        assert.equal(question.automaticStudentPublication, false);
        chapterMappedSurfaces += 1;
      }
    }
  }
}

// CP007 may be eligible for a future explicit approval transition, but current
// learner/storage/test/public gates must remain locked.
for (const language of languages) {
  const result = generateBlr001StandardQuestionStudioBatch({
    packageId: "REASONING_V1_BLR_001_CP_007",
    language,
    count: 1,
    seed: `blr-post-closure-cp007:${language}`,
  });
  const question = result.questions[0]!;
  assert.equal(question.releaseEligibleAfterApproval, true);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(result.generationContext.persistenceAllowed, false);
}

// Mutation proof for the final source -> standard adapter boundary.
{
  const sample = generateBlr001StandardQuestionStudioBatch({
    packageId: packages[0]!.packageId,
    canonicalProblemId: packages[0]!.qlIds[0]!,
    language: "en",
    count: 1,
    seed: "blr-post-closure-mutation",
  }).questions[0]!;
  const source = {
    questionId: sample.questionId,
    qlId: sample.qlId,
    options: [...sample.options],
    correctIndex: sample.correctIndex,
    answer: sample.answer,
    validation: { valid: true },
  };
  assertBlrStandardMappingIntegrity(source, sample);
  assert.throws(
    () => assertBlrStandardMappingIntegrity(source, {
      ...sample,
      correctIndex: (sample.correctIndex + 1) % sample.options.length,
      correct: (sample.correctIndex + 1) % sample.options.length,
    }),
    /changed the correct index/i,
  );
}

const semanticDigest = createHash("sha256")
  .update(JSON.stringify(digestRows))
  .digest("hex");

console.log(JSON.stringify({
  status: "PASS_BLR_001_POST_CLOSURE_AUDIT_20261004",
  packageCount: packages.length,
  permanentQlCount: qlIds.length,
  languages,
  sourceMappedSurfaces,
  chapterMappedSurfaces,
  totalMappedSurfaces: sourceMappedSurfaces + chapterMappedSurfaces,
  mappingProofAuthority: BLR_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
  semanticDigest,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  ql036Allocated: false,
}, null, 2));
