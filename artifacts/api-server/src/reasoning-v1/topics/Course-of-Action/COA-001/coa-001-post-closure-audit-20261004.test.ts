import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";
import { COA_CURRENT_ENGLISH_AUTHORITIES } from "./english-authorities.ts";
import {
  COA_CP008_EITHER_AUTHORITIES,
  COA_CP008_THREE_ACTION_AUTHORITIES,
} from "./cp008-profile-authorities.ts";
import {
  COA_CP010_ACTIVE_QL_IDS,
} from "./cp010-question-studio-integration.ts";
import {
  generateCoaCp011QuestionStudioBatch,
} from "./cp011-final-editorial-diversity.ts";
import {
  COA_CP012_APPROVED_CHECKPOINT_ID,
  COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE,
  COA_CP012_EDITORIAL_DIVERSITY_STATUS,
  COA_CP012_RUNTIME_MODE,
  assertCoaCp012ApprovedContentIdentity,
  generateCoaCp012ApprovedQuestionStudioBatch,
} from "./cp012-internal-eligibility-approved.ts";
import {
  COA_CP012_POST_CLOSURE_ANSWER_PROOF_AUTHORITY,
  assertCoaCp012FinalAnswerIntegrity,
} from "./cp012-post-closure-answer-proof.ts";

const LANGUAGES = ["en", "hi", "pa"] as const;
const ORDINARY_PROFILES = ["TWO_ACTION_FOUR_WAY", "TWO_ACTION_FIVE_CODE"] as const;

const activeOrdinary = COA_CURRENT_ENGLISH_AUTHORITIES.filter(
  (entry) => entry.qlId !== "COA-QL-007",
);
assert.equal(activeOrdinary.length, 118);
assert.equal(COA_CP008_EITHER_AUTHORITIES.length, 4);
assert.equal(COA_CP008_THREE_ACTION_AUTHORITIES.length, 6);

assert.equal(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.questionBankWritable, true);
assert.equal(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.testEligible, true);
assert.equal(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.mockTestEligible, true);
assert.equal(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);
assert.equal(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.productionReleaseAuthorized, false);
assert.equal(COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.runtimeMode, COA_CP012_RUNTIME_MODE);
assert.deepEqual(
  COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.supportedRuntimeModes,
  [COA_CP012_RUNTIME_MODE],
);
assert.equal(
  COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.postClosureAnswerProofAuthority,
  COA_CP012_POST_CLOSURE_ANSWER_PROOF_AUTHORITY,
);
assert.equal(
  COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.editorialDiversityStatus,
  COA_CP012_EDITORIAL_DIVERSITY_STATUS,
);
assert.equal(
  COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE.metadata?.editorialDiversityStatus,
  COA_CP012_EDITORIAL_DIVERSITY_STATUS,
);

let ordinarySurfaces = 0;
let eitherSurfaces = 0;
let threeActionSurfaces = 0;
const coveredOrdinaryIds = new Set<string>();
const coveredEitherIds = new Set<string>();
const coveredThreeIds = new Set<string>();
const digestRows: unknown[] = [];

for (const qlId of COA_CP010_ACTIVE_QL_IDS) {
  const expectedIds = activeOrdinary
    .filter((entry) => entry.qlId === qlId)
    .map((entry) => entry.id)
    .sort();
  assert.ok(expectedIds.length > 0, `${qlId}: no active ordinary authority`);

  for (const profile of ORDINARY_PROFILES) {
    let baselineIds: readonly string[] | undefined;

    for (const language of LANGUAGES) {
      const batch = await generateCoaCp012ApprovedQuestionStudioBatch({
        packageId: "COA-001",
        canonicalProblemId: qlId,
        presentationProfile: profile,
        language,
        count: expectedIds.length,
        seed: `COA-POST-CLOSURE:${qlId}:${profile}`,
        runtimeMode: COA_CP012_RUNTIME_MODE,
      });

      assert.equal(batch.questions.length, expectedIds.length);
      assert.equal(batch.checkpointId, COA_CP012_APPROVED_CHECKPOINT_ID);
      assert.equal(batch.generationContext.postClosureAnswerProofVerified, true);
      assert.equal(
        batch.generationContext.postClosureAnswerProofAuthority,
        COA_CP012_POST_CLOSURE_ANSWER_PROOF_AUTHORITY,
      );

      const ids = batch.questions.map((question: any) => String(question.semanticAuthorityId)).sort();
      assert.deepEqual(ids, expectedIds, `${qlId}/${profile}/${language}: ordinary authority coverage drift`);
      if (baselineIds) assert.deepEqual(ids, baselineIds, `${qlId}/${profile}: cross-language semantic selection drift`);
      else baselineIds = ids;

      for (const question of batch.questions as readonly any[]) {
        assertCoaCp012FinalAnswerIntegrity(question);
        assert.equal(question.questionBankWritable, true);
        assert.equal(question.testEligible, true);
        assert.equal(question.mockTestEligible, true);
        assert.equal(question.publiclyPublishable, false);
        assert.equal(question.publicReleaseAuthorized, false);
        assert.equal(question.studentDeliveryAuthorized, false);
        assert.equal(question.automaticStudentPublication, false);
        assert.equal(question.lifecycleStatus, "INTERNALLY_ELIGIBLE");
        assert.equal(question.editorialDiversityStatus, COA_CP012_EDITORIAL_DIVERSITY_STATUS);
        assert.notEqual(question.editorialDiversityStatus, "FINAL_EDITORIAL_DIVERSITY_REVIEW_PENDING");
        coveredOrdinaryIds.add(String(question.semanticAuthorityId));
        ordinarySurfaces += 1;
        digestRows.push([
          question.semanticAuthorityId,
          question.presentationProfile,
          question.language,
          question.courses?.map((course: any) => course.semanticActionId),
          question.options,
          question.correctIndex,
        ]);
      }
    }
  }
}

assert.deepEqual([...coveredOrdinaryIds].sort(), activeOrdinary.map((entry) => entry.id).sort());

// One safe-capacity five-code batch contains all four dedicated Either authorities
// at positions 0/5/10/15 without recycling a semantic authority.
for (const language of LANGUAGES) {
  const batch = await generateCoaCp012ApprovedQuestionStudioBatch({
    packageId: "COA-001",
    presentationProfile: "TWO_ACTION_FIVE_CODE",
    language,
    count: 20,
    seed: "COA-POST-CLOSURE:EITHER-COVERAGE",
    runtimeMode: COA_CP012_RUNTIME_MODE,
  });
  const eitherQuestions = (batch.questions as readonly any[]).filter(
    (question) => question.answerClass === "EITHER",
  );
  assert.equal(eitherQuestions.length, 4, `${language}: expected four dedicated Either questions`);
  assert.equal(new Set(batch.questions.map((question: any) => question.semanticAuthorityId)).size, 20);
  for (const question of eitherQuestions) {
    assertCoaCp012FinalAnswerIntegrity(question);
    coveredEitherIds.add(String(question.semanticAuthorityId));
    eitherSurfaces += 1;
  }
}
assert.deepEqual(
  [...coveredEitherIds].sort(),
  COA_CP008_EITHER_AUTHORITIES.map((entry) => entry.id).sort(),
);

// Six-item three-action batch exhausts the frozen three-action source pool.
for (const language of LANGUAGES) {
  const batch = await generateCoaCp012ApprovedQuestionStudioBatch({
    packageId: "COA-001",
    presentationProfile: "THREE_ACTION_COMBINATION",
    language,
    count: 6,
    seed: "COA-POST-CLOSURE:THREE-ACTION-COVERAGE",
    runtimeMode: COA_CP012_RUNTIME_MODE,
  });
  assert.equal(batch.questions.length, 6);
  assert.equal(new Set(batch.questions.map((question: any) => question.semanticAuthorityId)).size, 6);
  for (const question of batch.questions as readonly any[]) {
    assertCoaCp012FinalAnswerIntegrity(question);
    coveredThreeIds.add(String(question.semanticAuthorityId));
    threeActionSurfaces += 1;
  }
}
assert.deepEqual(
  [...coveredThreeIds].sort(),
  COA_CP008_THREE_ACTION_AUTHORITIES.map((entry) => entry.id).sort(),
);

// CP012 lifecycle promotion must not alter CP011 learner content.
{
  const sourceRequest = {
    packageId: "COA-001",
    canonicalProblemId: "COA-QL-008",
    presentationProfile: "TWO_ACTION_FOUR_WAY",
    language: "pa" as const,
    count: 5,
    seed: "COA-POST-CLOSURE:CONTENT-IDENTITY",
  };
  const source = await generateCoaCp011QuestionStudioBatch(sourceRequest);
  const approved = await generateCoaCp012ApprovedQuestionStudioBatch({
    ...sourceRequest,
    runtimeMode: COA_CP012_RUNTIME_MODE,
  });
  assert.equal(source.questions.length, approved.questions.length);
  for (let index = 0; index < source.questions.length; index += 1) {
    assertCoaCp012ApprovedContentIdentity(
      source.questions[index] as Readonly<Record<string, any>>,
      approved.questions[index] as Readonly<Record<string, any>>,
    );
  }
}

// Standard reasoning-v1 adapter must execute the runtime mode advertised by the package.
{
  const packageDef = reasoningV1QuestionStudioAdapter.listPackages()
    .find((entry) => entry.packageId === "COA-001");
  assert.ok(packageDef, "COA-001 missing from standard reasoning-v1 adapter");
  assert.equal(packageDef.runtimeMode, COA_CP012_RUNTIME_MODE);
  assert.deepEqual(packageDef.supportedRuntimeModes, [COA_CP012_RUNTIME_MODE]);
  assert.equal(packageDef.questionBankWritable, true);
  assert.equal(packageDef.testEligible, true);
  assert.equal(packageDef.mockTestEligible, true);
  assert.equal(packageDef.publiclyPublishable, false);
  assert.equal(packageDef.productionReleaseAuthorized, false);

  const generated = await reasoningV1QuestionStudioAdapter.generate({
    engineId: "reasoning-v1",
    packageId: "COA-001",
    language: "hi",
    difficulty: "Hard",
    runtimeMode: COA_CP012_RUNTIME_MODE,
    count: 3,
    seed: "COA-POST-CLOSURE:STANDARD-ADAPTER",
  });
  assert.equal(generated.questions.length, 3);
  for (const question of generated.questions as readonly any[]) {
    assert.equal(question.difficulty, "Hard");
    assert.equal(question.questionBankWritable, true);
    assert.equal(question.publiclyPublishable, false);
    assertCoaCp012FinalAnswerIntegrity(question);
  }
}

// QL007 remains retired.
await assert.rejects(
  () => generateCoaCp012ApprovedQuestionStudioBatch({
    packageId: "COA-001",
    canonicalProblemId: "COA-QL-007",
    language: "en",
    count: 1,
    seed: "COA-POST-CLOSURE:RETIRED-QL",
    runtimeMode: COA_CP012_RUNTIME_MODE,
  }),
  /QL-007 is retired/i,
);

// Fail-closed corruption tests.
{
  const ordinary = (await generateCoaCp012ApprovedQuestionStudioBatch({
    packageId: "COA-001",
    canonicalProblemId: "COA-QL-001",
    presentationProfile: "TWO_ACTION_FOUR_WAY",
    language: "en",
    count: 1,
    seed: "COA-POST-CLOSURE:DRIFT:ORDINARY",
    runtimeMode: COA_CP012_RUNTIME_MODE,
  })).questions[0] as any;

  assert.throws(
    () => assertCoaCp012FinalAnswerIntegrity({
      ...ordinary,
      correctIndex: (ordinary.correctIndex + 1) % ordinary.options.length,
      correct: (ordinary.correctIndex + 1) % ordinary.options.length,
    }),
    /runtime key disagrees/i,
  );

  const corruptedCourses = ordinary.courses.map((course: any, index: number) =>
    index === 0 ? { ...course, semanticActionId: "COA-NONEXISTENT-ACTION" } : course,
  );
  assert.throws(
    () => assertCoaCp012FinalAnswerIntegrity({ ...ordinary, courses: corruptedCourses }),
    /is not owned by the source authority/i,
  );

  const either = (await generateCoaCp012ApprovedQuestionStudioBatch({
    packageId: "COA-001",
    presentationProfile: "TWO_ACTION_FIVE_CODE",
    language: "en",
    count: 5,
    seed: "COA-POST-CLOSURE:DRIFT:EITHER",
    runtimeMode: COA_CP012_RUNTIME_MODE,
  })).questions.find((question: any) => question.answerClass === "EITHER") as any;
  assert.ok(either);
  assert.throws(
    () => assertCoaCp012FinalAnswerIntegrity({ ...either, pairRelation: "INDEPENDENT_VERDICTS" }),
    /lost its mutually-exclusive pair relation/i,
  );

  const three = (await generateCoaCp012ApprovedQuestionStudioBatch({
    packageId: "COA-001",
    presentationProfile: "THREE_ACTION_COMBINATION",
    language: "en",
    count: 1,
    seed: "COA-POST-CLOSURE:DRIFT:THREE",
    runtimeMode: COA_CP012_RUNTIME_MODE,
  })).questions[0] as any;
  assert.throws(
    () => assertCoaCp012FinalAnswerIntegrity({ ...three, answerMask: Number(three.answerMask) ^ 0b001 }),
    /runtime answer mask disagrees/i,
  );
}

const authorityDigest = createHash("sha256")
  .update(JSON.stringify(digestRows.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))))
  .digest("hex");

assert.equal(ordinarySurfaces, activeOrdinary.length * ORDINARY_PROFILES.length * LANGUAGES.length);
assert.equal(eitherSurfaces, COA_CP008_EITHER_AUTHORITIES.length * LANGUAGES.length);
assert.equal(threeActionSurfaces, COA_CP008_THREE_ACTION_AUTHORITIES.length * LANGUAGES.length);

console.log(JSON.stringify({
  status: "PASS_COA_001_POST_CLOSURE_AUDIT_20261004",
  activePermanentQlIds: COA_CP010_ACTIVE_QL_IDS,
  retiredQlId: "COA-QL-007",
  activeOrdinaryAuthorities: activeOrdinary.length,
  eitherAuthorities: COA_CP008_EITHER_AUTHORITIES.length,
  threeActionAuthorities: COA_CP008_THREE_ACTION_AUTHORITIES.length,
  ordinarySurfaces,
  eitherSurfaces,
  threeActionSurfaces,
  totalFinalSemanticProofSurfaces: ordinarySurfaces + eitherSurfaces + threeActionSurfaces,
  postClosureAnswerProofAuthority: COA_CP012_POST_CLOSURE_ANSWER_PROOF_AUTHORITY,
  runtimeMode: COA_CP012_RUNTIME_MODE,
  editorialDiversityStatus: COA_CP012_EDITORIAL_DIVERSITY_STATUS,
  authorityDigest,
  lifecycle: {
    questionBankWritable: true,
    testEligible: true,
    mockTestEligible: true,
    publiclyPublishable: false,
    productionReleaseAuthorized: false,
  },
}, null, 2));
