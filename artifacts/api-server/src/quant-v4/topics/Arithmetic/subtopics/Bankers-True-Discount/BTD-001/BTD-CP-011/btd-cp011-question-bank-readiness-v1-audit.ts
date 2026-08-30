import assert from "node:assert/strict";

import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP010_LANGUAGES,
  buildBtdCp010QuestionStudioPreview,
} from "../BTD-CP-010/btd-cp010-multilingual-question-studio-v1";
import {
  BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY,
  BTD_CP011_QUESTION_BANK_READINESS_VERSION,
  buildBtdCp011QuestionBankReadinessCandidateV1,
} from "./btd-cp011-question-bank-readiness-v1";

assert.equal(BTD_CP011_QUESTION_BANK_READINESS_VERSION, "BTD-001-CP011-QUESTION-BANK-READINESS-v1");
assert.equal(BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.status, "READY_FOR_EXPLICIT_QUESTION_BANK_ADMISSION_APPROVAL");
assert.equal(BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.admissionContractValidated, true);
assert.equal(BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.questionBankAdmissionApproved, false);
assert.equal(BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.requiresManualStudioReview, true);
assert.equal(BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.requiredGenerationItemStatus, "approved");
assert.equal(BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.questionBankWritable, false);
assert.equal(BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.questionBankWriteRouteEnabled, false);
assert.equal(BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.testEligible, false);
assert.equal(BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.mockTestEligible, false);
assert.equal(BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.publiclyPublishable, false);
assert.equal(BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.automaticStudentPublication, false);
assert.equal(BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.contentMutationAuthorized, false);

let candidatesValidated = 0;
let studioParityChecks = 0;
let deterministicReplayChecks = 0;
let identityChecks = 0;
let schemaChecks = 0;
let reviewGateChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let jsonChecks = 0;
let safeDedupCollisions = 0;
const admissionKeys = new Map<string, { payloadFingerprint: string; qlId: string; language: string; frozenContentFingerprint: string }>();
const scopeUniqueCounts: Record<string, number> = {};
const languageCounts = { en: 0, hi: 0, pa: 0 };

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (const language of BTD_CP010_LANGUAGES) {
    const scopeKeys = new Set<string>();
    for (let index = 0; index < 100; index += 1) {
      const seed = `btd-cp011-audit:${language}:${entry.qlId}:${String(index + 1).padStart(3, "0")}`;
      const studio = buildBtdCp010QuestionStudioPreview(entry.qlId, seed, language) as any;
      const candidate = buildBtdCp011QuestionBankReadinessCandidateV1(entry.qlId, seed, language) as any;
      const replay = buildBtdCp011QuestionBankReadinessCandidateV1(entry.qlId, seed, language) as any;

      assert.deepEqual(replay, candidate, `${entry.qlId}/${language}/${seed}: readiness candidate replay drift`);
      deterministicReplayChecks += 1;

      assert.equal(candidate.bankPayload.packageId, studio.packageId);
      assert.equal(candidate.bankPayload.qlId, studio.qlId);
      assert.equal(candidate.bankPayload.cpId, studio.cpId);
      assert.equal(candidate.bankPayload.language, studio.language);
      assert.equal(candidate.bankPayload.locale, studio.locale);
      assert.equal(candidate.bankPayload.difficulty, studio.difficulty);
      assert.equal(candidate.bankPayload.stem, studio.stem);
      assert.deepEqual(candidate.bankPayload.options, studio.options);
      assert.equal(candidate.bankPayload.correctIndex, studio.correctIndex);
      assert.equal(candidate.bankPayload.correctAnswer, studio.answer);
      assert.deepEqual(candidate.bankPayload.explanation, studio.packageExplanation);
      assert.equal(candidate.bankPayload.semanticSignature, studio.semanticSignature);
      assert.equal(candidate.bankPayload.answerSemantic, studio.answerSemantic);
      assert.equal(candidate.bankPayload.frozenContentFingerprint, studio.frozenContentFingerprint);
      assert.equal(candidate.bankPayload.frozenChapterFingerprint, studio.frozenChapterFingerprint);
      assert.equal(candidate.bankPayload.freezeVersion, studio.freezeVersion);
      studioParityChecks += 16;

      assert.equal(candidate.bankPayload.schemaVersion, "BTD-QUESTION-BANK-CANDIDATE-v1");
      assert.equal(candidate.bankPayload.chapterId, "BTD-001");
      assert.equal(candidate.bankPayload.options.length, 4);
      assert.equal(new Set(candidate.bankPayload.options).size, 4);
      assert.ok(candidate.bankPayload.correctIndex >= 0 && candidate.bankPayload.correctIndex < 4);
      assert.equal(candidate.bankPayload.options[candidate.bankPayload.correctIndex], candidate.bankPayload.correctAnswer);
      assert.ok(candidate.bankPayload.stem.length > 20);
      assert.ok(candidate.bankPayload.explanation.whatGiven.length > 0);
      assert.ok(candidate.bankPayload.explanation.whatAsked.length > 0);
      assert.ok(candidate.bankPayload.explanation.keyIdea.length > 0);
      assert.ok(candidate.bankPayload.explanation.steps.length > 0);
      assert.ok(candidate.bankPayload.explanation.finalAnswer.length > 0);
      schemaChecks += 12;

      assert.match(candidate.admissionKey, /^BTD-QB-[0-9a-f]{32}$/u);
      assert.match(candidate.learnerPayloadFingerprint, /^[0-9a-f]{64}$/u);
      assert.match(candidate.admissionPayloadFingerprint, /^[0-9a-f]{64}$/u);
      assert.equal(candidate.sourceStudioQuestionId, studio.questionId);
      assert.equal(candidate.sourceStudioSeed, seed);
      identityChecks += 5;

      const previous = admissionKeys.get(candidate.admissionKey);
      if (previous) {
        assert.equal(previous.payloadFingerprint, candidate.admissionPayloadFingerprint, `${candidate.admissionKey}: dedup key mapped to different bank payload`);
        assert.equal(previous.qlId, candidate.bankPayload.qlId, `${candidate.admissionKey}: dedup crossed QLs`);
        assert.equal(previous.language, candidate.bankPayload.language, `${candidate.admissionKey}: dedup crossed languages`);
        assert.equal(previous.frozenContentFingerprint, candidate.bankPayload.frozenContentFingerprint, `${candidate.admissionKey}: dedup crossed frozen content`);
        safeDedupCollisions += 1;
      } else {
        admissionKeys.set(candidate.admissionKey, {
          payloadFingerprint: candidate.admissionPayloadFingerprint,
          qlId: candidate.bankPayload.qlId,
          language: candidate.bankPayload.language,
          frozenContentFingerprint: candidate.bankPayload.frozenContentFingerprint,
        });
      }
      scopeKeys.add(candidate.admissionKey);

      assert.equal(candidate.reviewGate.required, true);
      assert.equal(candidate.reviewGate.requiredStatus, "approved");
      assert.equal(candidate.reviewGate.automaticAdmissionAllowed, false);
      reviewGateChecks += 3;

      assert.equal(candidate.lifecycle.status, "READY_FOR_EXPLICIT_QUESTION_BANK_ADMISSION_APPROVAL");
      assert.equal(candidate.lifecycle.questionBankAdmissionApproved, false);
      assert.equal(candidate.lifecycle.requiresManualStudioReview, true);
      assert.equal(candidate.lifecycle.requiredGenerationItemStatus, "approved");
      assert.equal(candidate.lifecycle.questionBankWritable, false);
      assert.equal(candidate.lifecycle.questionBankWriteRouteEnabled, false);
      assert.equal(candidate.lifecycle.testEligible, false);
      assert.equal(candidate.lifecycle.mockTestEligible, false);
      assert.equal(candidate.lifecycle.publiclyPublishable, false);
      assert.equal(candidate.lifecycle.automaticStudentPublication, false);
      assert.equal(candidate.lifecycle.contentMutationAuthorized, false);
      lifecycleChecks += 11;

      assert.equal(Object.isFrozen(candidate), true);
      assert.equal(Object.isFrozen(candidate.bankPayload), true);
      assert.equal(Object.isFrozen(candidate.bankPayload.options), true);
      assert.equal(Object.isFrozen(candidate.bankPayload.explanation), true);
      assert.equal(Object.isFrozen(candidate.reviewGate), true);
      assert.equal(Object.isFrozen(candidate.lifecycle), true);
      deepFreezeChecks += 6;

      const serialized = JSON.stringify(candidate);
      assert.ok(serialized.length > 300);
      assert.equal(JSON.stringify(JSON.parse(serialized)), serialized);
      jsonChecks += 2;

      languageCounts[language] += 1;
      candidatesValidated += 1;
    }
    assert.ok(scopeKeys.size >= 60, `${entry.qlId}/${language}: admission identity pool is too thin (${scopeKeys.size}/100 unique)`);
    scopeUniqueCounts[`${entry.qlId}:${language}`] = scopeKeys.size;
  }
}

assert.equal(candidatesValidated, 6000);
assert.deepEqual(languageCounts, { en: 2000, hi: 2000, pa: 2000 });
assert.equal(Object.keys(scopeUniqueCounts).length, 60);
const minimumScopeUnique = Math.min(...Object.values(scopeUniqueCounts));
assert.ok(minimumScopeUnique >= 60);
assert.equal(admissionKeys.size + safeDedupCollisions, candidatesValidated);

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP011-QUESTION-BANK-READINESS-AUDIT-v1",
  readinessVersion: BTD_CP011_QUESTION_BANK_READINESS_VERSION,
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-011",
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  languages: BTD_CP010_LANGUAGES,
  seedsPerQlPerLanguage: 100,
  candidatesValidated,
  studioParityChecks,
  deterministicReplayChecks,
  identityChecks,
  schemaChecks,
  reviewGateChecks,
  lifecycleChecks,
  deepFreezeChecks,
  jsonChecks,
  uniqueAdmissionKeys: admissionKeys.size,
  safeDedupCollisions,
  minimumScopeUnique,
  scopeUniqueCounts,
  languageCounts,
  readinessStatus: BTD_CP011_QUESTION_BANK_READINESS_BOUNDARY.status,
  questionBankAdmissionApproved: false,
  questionBankWritable: false,
  questionBankWriteRouteEnabled: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_BTD_001_CP011_QUESTION_BANK_READINESS_AUDIT_V1");
