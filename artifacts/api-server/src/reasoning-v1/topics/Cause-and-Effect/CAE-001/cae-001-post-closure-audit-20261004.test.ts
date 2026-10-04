import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CAE_001_PROJECTION_AUTHORITIES } from "./causal-world-authorities.ts";
import { generateReviewedCaeSourceProfileQuestion } from "./reviewed-source-profiles.ts";
import {
  assertCaeGeneratedAnswerIntegrity,
  assertCaeQuestionStudioMappingIntegrity,
  CAE_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
} from "./question-studio-post-closure-proof.ts";
import {
  CAE001_STANDARD_QUESTION_STUDIO_PACKAGE_V1,
  generateCae001QuestionStudioBatch,
} from "./question-studio-integration.ts";
import { CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE } from "./question-studio-review.ts";
import {
  CAE_001_CURRENT_QL_ALLOCATION_STATUS,
  CAE_001_HISTORICAL_SOURCE_QL_ALLOCATION_STATUS,
} from "./post-closure-current-state.ts";
import { CAE_PROVISIONAL_QL_IDS, type CaeLocale } from "./types.ts";

const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly CaeLocale[];
const LANG_BY_LOCALE = Object.freeze({
  "en-IN": "en",
  "hi-IN": "hi",
  "pa-IN": "pa",
} as const);

assert.equal(CAE_001_CURRENT_QL_ALLOCATION_STATUS, "SOURCE_SATURATED_CONTENT_FROZEN");
assert.equal(CAE_001_HISTORICAL_SOURCE_QL_ALLOCATION_STATUS, "PROVISIONAL_PENDING_SOURCE_SATURATION");
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 9);
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.provisionalQlCount, 0);
assert.deepEqual(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.provisionalQlIds, []);
assert.equal(CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.historicalProvisionalQlCount, 9);
assert.deepEqual(
  CAE_001_QUESTION_STUDIO_REVIEW_PACKAGE.historicalProvisionalQlIds,
  CAE_PROVISIONAL_QL_IDS,
);
assert.equal(CAE001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.metadata?.qlAllocationStatus, "SOURCE_SATURATED_CONTENT_FROZEN");
assert.equal(CAE001_STANDARD_QUESTION_STUDIO_PACKAGE_V1.metadata?.historicalSourceQlAllocationStatus, "PROVISIONAL_PENDING_SOURCE_SATURATION");

let directSurfaces = 0;
let fiveWaySurfaces = 0;
let mappedSurfaces = 0;
let sourceProfileSurfaces = 0;
const digestRows: unknown[] = [];
const answerPositions = new Set<number>();

for (const qlId of CAE_PROVISIONAL_QL_IDS) {
  for (const locale of LOCALES) {
    for (let seed = 0; seed < 96; seed += 1) {
      const fourWay = generateReviewedCaeQuestion({
        qlId,
        locale,
        seed,
        questionProfile: "FOUR_WAY",
      });
      assertCaeGeneratedAnswerIntegrity(fourWay);
      assert.equal(fourWay.metadata.reviewOnly, true);
      assert.equal(fourWay.metadata.questionBankWritable, false);
      assert.equal(fourWay.metadata.testEligible, false);
      assert.equal(fourWay.metadata.mockEligible, false);
      assert.equal(fourWay.metadata.publicEligible, false);
      directSurfaces += 1;
      answerPositions.add(fourWay.correctIndex);
      digestRows.push({
        qlId,
        locale,
        seed,
        profile: "FOUR_WAY",
        causalStateId: fourWay.causalStateId,
        itemVariantId: fourWay.itemVariantId,
        answerId: fourWay.answerId,
        options: fourWay.options,
        correctIndex: fourWay.correctIndex,
      });

      const projection = CAE_001_PROJECTION_AUTHORITIES.find((entry) => entry.qlId === qlId)!;
      if (seed < 32 && projection.examProfiles.includes("FIVE_WAY")) {
        const fiveWay = generateReviewedCaeQuestion({
          qlId,
          locale,
          seed,
          questionProfile: "FIVE_WAY",
        });
        assertCaeGeneratedAnswerIntegrity(fiveWay);
        assert.equal(fiveWay.options.length, 5);
        fiveWaySurfaces += 1;
        answerPositions.add(fiveWay.correctIndex);
      }
    }

    const adapter = await generateCae001QuestionStudioBatch({
      engineId: "reasoning-v1",
      packageId: "CAE-001",
      canonicalProblemId: qlId,
      language: LANG_BY_LOCALE[locale],
      difficulty: "Mixed",
      runtimeMode: "review-only",
      count: 6,
      seed: `cae-post-closure:${qlId}:${locale}`,
      exam: qlId === "CAE-QL-001" || qlId === "CAE-QL-002" ? "IBPS PO" : "SSC CGL",
    });
    assert.equal(adapter.questions.length, 6);
    for (const mapped of adapter.questions) {
      assert.equal(mapped.qlAllocationStatus, "SOURCE_SATURATED_CONTENT_FROZEN");
      assert.equal(mapped.historicalSourceQlAllocationStatus, "PROVISIONAL_PENDING_SOURCE_SATURATION");
      assert.equal(mapped.postClosureMappingProofVerified, true);
      assert.equal(mapped.questionBankWritable, false);
      assert.equal(mapped.testEligible, false);
      assert.equal(mapped.mockTestEligible, false);
      assert.equal(mapped.publiclyPublishable, false);
      mappedSurfaces += 1;
    }
  }
}

for (const locale of LOCALES) {
  for (let seed = 0; seed < 48; seed += 1) {
    for (const sourceProfileId of [
      "CLASSIC_BANK_FIVE_RELATION",
      "PUNJAB_POLICE_SI_2016_FOUR_RELATION",
      "SSC_SELECTION_POST_DIRECT_RECOGNITION",
    ] as const) {
      const qlId = sourceProfileId === "SSC_SELECTION_POST_DIRECT_RECOGNITION"
        ? "CAE-QL-001"
        : seed % 2 === 0 ? "CAE-QL-001" : "CAE-QL-002";
      try {
        const question = generateReviewedCaeSourceProfileQuestion({
          qlId,
          locale,
          seed,
          sourceProfileId,
        });
        assertCaeGeneratedAnswerIntegrity(question);
        sourceProfileSurfaces += 1;
      } catch (error) {
        if (!(error instanceof Error) || !/relationship .* is not part of this source schema/u.test(error.message)) {
          throw error;
        }
      }
    }
  }
}

const bankingQl003 = await generateCae001QuestionStudioBatch({
  engineId: "reasoning-v1",
  packageId: "CAE-001",
  canonicalProblemId: "CAE-QL-003",
  language: "en",
  difficulty: "Mixed",
  runtimeMode: "review-only",
  count: 3,
  seed: "cae-post-closure-bank-ql003",
  exam: "IBPS PO",
});
assert.equal(bankingQl003.questions.length, 3);
assert.ok(bankingQl003.questions.every((question) => question.options.length === 4));

// Mutation proof: graph-proved option metadata must reject a changed answer key.
{
  const sample = generateReviewedCaeQuestion({
    qlId: "CAE-QL-009",
    locale: "en-IN",
    seed: 73,
  });
  const wrongIndex = (sample.correctIndex + 1) % sample.options.length;
  assert.throws(
    () => assertCaeGeneratedAnswerIntegrity({ ...sample, correctIndex: wrongIndex }),
    /correctIndex disagrees with graph-proved option metadata/i,
  );

  const mapped = {
    options: [...sample.options],
    correctIndex: sample.correctIndex,
    correct: sample.correctIndex,
    answer: sample.options[sample.correctIndex],
    canonicalAnswer: sample.options[sample.correctIndex],
    causalStateId: sample.causalStateId,
    itemVariantId: sample.itemVariantId,
    answerId: sample.answerId,
  };
  assertCaeQuestionStudioMappingIntegrity(sample, mapped);
  assert.throws(
    () => assertCaeQuestionStudioMappingIntegrity(sample, { ...mapped, answerId: "DRIFTED" }),
    /answerId drifted/i,
  );
}

assert.ok(answerPositions.size >= 5, "post-closure audit must exercise all option positions across four/five-way profiles");

const digest = createHash("sha256")
  .update(JSON.stringify(digestRows))
  .digest("hex");

console.log(JSON.stringify({
  status: "PASS_CAE_001_POST_CLOSURE_AUDIT_20261004",
  qlCount: CAE_PROVISIONAL_QL_IDS.length,
  locales: LOCALES,
  directFourWaySurfaces: directSurfaces,
  directFiveWaySurfaces: fiveWaySurfaces,
  standardAdapterSurfaces: mappedSurfaces,
  sourceProfileSurfaces,
  totalAuditedSurfaces: directSurfaces + fiveWaySurfaces + mappedSurfaces + sourceProfileSurfaces,
  answerPositions: [...answerPositions].sort((a, b) => a - b),
  currentQlAllocationStatus: CAE_001_CURRENT_QL_ALLOCATION_STATUS,
  historicalQlAllocationStatus: CAE_001_HISTORICAL_SOURCE_QL_ALLOCATION_STATUS,
  postClosureMappingProofAuthority: CAE_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
  semanticDigest: digest,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
