import assert from "node:assert/strict";

import {
  getGeneratedQuestionBankEligibilityIssue,
} from "../../../../../lib/admin-question-conversion";
import {
  SER_CP007_FROZEN_TEMPLATE_AUTHORITIES,
} from "../SER-CP-007-ENGLISH-FREEZE/ser-cp-007-english-freeze-authority";
import {
  SER_CP007_PERMANENT_QL_IDS,
} from "../SER-PERMANENT-QL-REGISTRY";
import {
  generateSerCp007QuestionStudioReadinessProjection,
  generateSerCp007QuestionStudioReadinessSweep,
  SER_CP007_QUESTION_STUDIO_READINESS_LOCALES,
  SER_CP007_QUESTION_STUDIO_READINESS_STATE,
} from "./ser-cp-007-question-studio-readiness";

const seed = 73;
const projected = generateSerCp007QuestionStudioReadinessSweep(seed);

assert.equal(SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length, 140);
assert.equal(SER_CP007_PERMANENT_QL_IDS.length, 13);
assert.equal(SER_CP007_QUESTION_STUDIO_READINESS_LOCALES.length, 3);
assert.equal(
  projected.length,
  SER_CP007_QUESTION_STUDIO_READINESS_STATE.expectedProjectionCountPerSeed,
);
assert.equal(projected.length, 420);

const localeCounts = new Map<string, number>();
const localeQlCoverage = new Map<string, Set<string>>();
const projectedIdentities = new Set<string>();
let questionBankRejectionProofs = 0;
let lifecycleLockProofs = 0;
let optionIntegrityProofs = 0;
let provenanceProofs = 0;

for (const item of projected) {
  localeCounts.set(item.locale, (localeCounts.get(item.locale) ?? 0) + 1);
  const qls = localeQlCoverage.get(item.locale) ?? new Set<string>();
  qls.add(item.permanentQlId);
  localeQlCoverage.set(item.locale, qls);

  const identity = `${item.temporaryTemplateId}:${item.seed}:${item.locale}`;
  assert.equal(projectedIdentities.has(identity), false, `${identity}: duplicate projection`);
  projectedIdentities.add(identity);

  assert.equal(item.packageId, "SER-001");
  assert.equal(item.canonicalProblemId, "SER-CP-007");
  assert.equal(item.questionLanguageId, item.permanentQlId);
  assert.equal(item.seed, seed);
  assert.ok(item.stem.length > 0, `${identity}: missing stem`);
  assert.ok(item.explanation.length > 0, `${identity}: missing explanation`);
  assert.equal(item.text, item.stem);
  assert.equal(item.options.length, 4, `${identity}: option count`);
  assert.equal(new Set(item.options).size, 4, `${identity}: duplicate option`);
  assert.equal(item.options[item.correctIndex], item.canonicalAnswer);
  assert.equal(item.answer, item.canonicalAnswer);
  optionIntegrityProofs += 1;

  assert.ok(item.authorityId.length > 0, `${identity}: authorityId`);
  assert.ok(item.subtypeId.length > 0, `${identity}: subtypeId`);
  assert.ok(item.learnerRenderer.length > 0, `${identity}: learnerRenderer`);
  assert.ok(item.taskKind.length > 0, `${identity}: taskKind`);
  assert.equal(item.generationContext.permanentQlId, item.permanentQlId);
  assert.equal(item.generationContext.temporaryTemplateId, item.temporaryTemplateId);
  assert.equal(item.generationContext.subtypeId, item.subtypeId);
  assert.equal(item.generationContext.learnerRenderer, item.learnerRenderer);
  provenanceProofs += 1;

  assert.equal(item.integrationStatus, "READINESS_PROVEN_INACTIVE");
  assert.equal(item.runtimeMode, "INACTIVE_INTEGRATION_PROOF");
  assert.equal(item.questionBankStatus, "NOT_STORED");
  assert.equal(item.testEligibility, "INELIGIBLE");
  assert.equal(item.active, false);
  assert.equal(item.questionStudioDiscoverable, false);
  assert.equal(item.questionBankWritable, false);
  assert.equal(item.testEligible, false);
  assert.equal(item.publiclyPublishable, false);
  assert.equal(item.generationContext.active, false);
  assert.equal(item.generationContext.questionStudioDiscoverable, false);
  assert.equal(item.generationContext.questionBankWritable, false);
  assert.equal(item.generationContext.testEligible, false);
  assert.equal(item.generationContext.publiclyPublishable, false);
  lifecycleLockProofs += 1;

  assert.equal(
    getGeneratedQuestionBankEligibilityIssue(item),
    "questionBankStatus is NOT_STORED",
    `${identity}: Question Bank conversion must remain blocked`,
  );
  questionBankRejectionProofs += 1;

  assert.equal(item.validation.ok, true);
  assert.equal(item.validation.checks.length, 5);
  assert.equal(item.validation.checks.every((check) => check.passed), true);
}

for (const locale of SER_CP007_QUESTION_STUDIO_READINESS_LOCALES) {
  assert.equal(localeCounts.get(locale), 140, `${locale}: template coverage`);
  assert.deepEqual(
    [...(localeQlCoverage.get(locale) ?? new Set<string>())].sort(),
    [...SER_CP007_PERMANENT_QL_IDS].sort(),
    `${locale}: permanent QL coverage`,
  );
}

const deterministicInput = {
  temporaryTemplateId: SER_CP007_FROZEN_TEMPLATE_AUTHORITIES[0]!.temporaryTemplateId,
  seed,
  locale: "pa-IN" as const,
};
const deterministicA = generateSerCp007QuestionStudioReadinessProjection(
  deterministicInput,
);
const deterministicB = generateSerCp007QuestionStudioReadinessProjection(
  deterministicInput,
);
assert.deepEqual(deterministicA, deterministicB);

assert.deepEqual(
  {
    active: SER_CP007_QUESTION_STUDIO_READINESS_STATE.active,
    questionStudioDiscoverable:
      SER_CP007_QUESTION_STUDIO_READINESS_STATE.questionStudioDiscoverable,
    questionBankWritable:
      SER_CP007_QUESTION_STUDIO_READINESS_STATE.questionBankWritable,
    testEligible: SER_CP007_QUESTION_STUDIO_READINESS_STATE.testEligible,
    publiclyPublishable:
      SER_CP007_QUESTION_STUDIO_READINESS_STATE.publiclyPublishable,
  },
  {
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_QUESTION_STUDIO_INTEGRATION_READINESS_INACTIVE",
      authority: SER_CP007_QUESTION_STUDIO_READINESS_STATE.authority,
      frozenTemplates: SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length,
      permanentQls: SER_CP007_PERMANENT_QL_IDS.length,
      locales: SER_CP007_QUESTION_STUDIO_READINESS_LOCALES,
      projectedPayloads: projected.length,
      projectedPayloadsPerLocale: Object.fromEntries(localeCounts),
      permanentQlCoveragePerLocale: Object.fromEntries(
        [...localeQlCoverage.entries()].map(([locale, qls]) => [
          locale,
          qls.size,
        ]),
      ),
      deterministicRegenerationProofs: 1,
      optionIntegrityProofs,
      provenanceProofs,
      lifecycleLockProofs,
      questionBankRejectionProofs,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      nextAuthority:
        "SER_CP007_QUESTION_STUDIO_INTEGRATION_PROPOSAL_PENDING_EXPLICIT_ACTIVATION_APPROVAL",
    },
    null,
    2,
  ),
);
