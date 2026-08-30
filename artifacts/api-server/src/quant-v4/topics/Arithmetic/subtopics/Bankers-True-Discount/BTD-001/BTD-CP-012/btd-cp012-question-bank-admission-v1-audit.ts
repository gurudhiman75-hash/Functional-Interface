import assert from "node:assert/strict";

import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  buildBtdCp010QuestionStudioPreview,
  type BtdCp010Language,
} from "../BTD-CP-010/btd-cp010-multilingual-question-studio-v1";
import {
  btdCp011BankLearnerPayload,
  buildBtdCp011QuestionBankReadinessCandidateV1,
} from "../BTD-CP-011/btd-cp011-question-bank-readiness-v1";
import {
  BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
  BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY,
  BTD_CP012_QUESTION_BANK_ADMISSION_VERSION,
  BTD_CP012_QUESTION_STUDIO_PACKAGE,
  buildBtdCp012QuestionBankAdmissionPreviewV1,
  listBtdCp012QuestionStudioPackages,
} from "./btd-cp012-question-bank-admission-v1";
import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} from "../../../../../../../lib/admin-question-conversion";
import { convertApprovedGenerationItemDedupSafe } from "../../../../../../../lib/admin-question-conversion-bank-dedup";
import { getGeneratedItemApprovalDisposition } from "../../../../../../../lib/admin-question-studio-approval-policy";

const LANGUAGES = ["en", "hi", "pa"] as const satisfies readonly BtdCp010Language[];
const SEEDS_PER_QL_LANGUAGE = 100;

type AnyRecord = Record<string, any>;

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonical(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function frozenLearnerSurface(question: AnyRecord) {
  return {
    packageId: question.packageId,
    qlId: question.qlId,
    cpId: question.cpId,
    language: question.language,
    locale: question.locale,
    semanticSignature: question.semanticSignature,
    answerSemantic: question.answerSemantic,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    answer: question.answer,
    packageExplanation: question.packageExplanation,
    difficulty: question.difficulty,
    frozenContentFingerprint: question.frozenContentFingerprint,
    frozenChapterFingerprint: question.frozenChapterFingerprint,
    freezeVersion: question.freezeVersion,
  };
}

async function proveDedupReusePath(sample: AnyRecord) {
  const calls: string[] = [];
  let invocation = 0;
  const fakeClient = (async (strings: TemplateStringsArray, ..._values: unknown[]) => {
    const sql = strings.join("?");
    calls.push(sql);
    invocation += 1;
    if (invocation === 1) {
      return [{ status: "approved", payload: sample, generationRunCode: "GEN-CP012-AUDIT" }];
    }
    if (invocation === 2) return [];
    if (invocation === 3) {
      return [{
        questionId: "11111111-1111-4111-8111-111111111111",
        questionVersionId: "22222222-2222-4222-8222-222222222222",
        publicCode: "Q-CP012-DEDUP",
      }];
    }
    return [];
  }) as any;

  const result = await convertApprovedGenerationItemDedupSafe(
    fakeClient,
    "33333333-3333-4333-8333-333333333333",
    "44444444-4444-4444-8444-444444444444",
  );
  assert.equal(result?.publicCode, "Q-CP012-DEDUP");
  assert.equal(result?.questionId, "11111111-1111-4111-8111-111111111111");
  assert.equal(calls.some((sql) => sql.includes("pg_advisory_xact_lock")), true);
  assert.equal(calls.some((sql) => sql.includes("providerQuestionId")), true);
  assert.equal(calls.some((sql) => sql.includes("accepted_question_id")), true);
  assert.equal(calls.some((sql) => sql.includes("reused_from_generation_dedup")), true);
  return calls.length;
}

async function main() {
  assert.equal(BTD_PERMANENT_QL_REGISTRY.length, 20);
  assert.equal(BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.questionBankAdmissionApproved, true);
  assert.equal(BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.requiresManualStudioReview, true);
  assert.equal(BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.automaticAdmissionAllowed, false);
  assert.equal(BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.requiredGenerationItemStatus, "approved");
  assert.equal(BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.questionBankWritable, true);
  assert.equal(BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.questionBankWriteRouteEnabled, true);
  assert.equal(BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.questionBankAcceptanceMode, "BANK_ONLY");
  assert.equal(BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.testEligible, false);
  assert.equal(BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.mockTestEligible, false);
  assert.equal(BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.publiclyPublishable, false);
  assert.equal(BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.automaticStudentPublication, false);
  assert.equal(BTD_CP012_QUESTION_BANK_ADMISSION_BOUNDARY.contentMutationAuthorized, false);

  const packages = listBtdCp012QuestionStudioPackages();
  assert.equal(packages.length, 1);
  assert.equal(packages[0].packageId, "BTD-001");
  assert.deepEqual(packages[0].supportedLanguages, ["en", "hi", "pa"]);
  assert.equal(BTD_CP012_QUESTION_STUDIO_PACKAGE.questionBankAcceptanceMode, "BANK_ONLY");

  let questions = 0;
  let learnerParityChecks = 0;
  let readinessIdentityChecks = 0;
  let deterministicChecks = 0;
  let approvalPolicyChecks = 0;
  let converterEligibilityChecks = 0;
  let normalizedPayloadChecks = 0;
  let lifecycleChecks = 0;
  let jsonChecks = 0;
  const admissionKeys = new Map<string, string>();
  const scopeKeys = new Map<string, Set<string>>();
  const languageCounts = { en: 0, hi: 0, pa: 0 };
  let dedupSample: AnyRecord | null = null;

  for (const allocation of BTD_PERMANENT_QL_REGISTRY) {
    for (const language of LANGUAGES) {
      const scope = `${allocation.qlId}:${language}`;
      const keys = new Set<string>();
      scopeKeys.set(scope, keys);
      for (let index = 0; index < SEEDS_PER_QL_LANGUAGE; index += 1) {
        const seed = `btd-cp012-audit:${allocation.qlId}:${language}:${index}`;
        const source = buildBtdCp010QuestionStudioPreview(allocation.qlId, seed, language) as AnyRecord;
        const admitted = buildBtdCp012QuestionBankAdmissionPreviewV1(allocation.qlId, seed, language) as AnyRecord;
        const replay = buildBtdCp012QuestionBankAdmissionPreviewV1(allocation.qlId, seed, language) as AnyRecord;
        const candidate = buildBtdCp011QuestionBankReadinessCandidateV1(allocation.qlId, seed, language);

        assert.deepEqual(frozenLearnerSurface(admitted), frozenLearnerSurface(source));
        assert.deepEqual(btdCp011BankLearnerPayload(admitted), btdCp011BankLearnerPayload(source));
        learnerParityChecks += 2;

        assert.equal(admitted.sourceStudioQuestionId, source.questionId);
        assert.equal(admitted.questionId, candidate.admissionKey);
        assert.equal(admitted.questionBankAdmissionKey, candidate.admissionKey);
        assert.equal(admitted.questionBankAdmissionPayloadFingerprint, candidate.admissionPayloadFingerprint);
        assert.equal(admitted.frozenContentFingerprint, candidate.bankPayload.frozenContentFingerprint);
        readinessIdentityChecks += 5;

        assert.equal(canonical(admitted), canonical(replay));
        deterministicChecks += 1;

        const disposition = getGeneratedItemApprovalDisposition({ ...admitted, generationContext: {} });
        assert.equal(disposition.mode, "question_bank");
        assert.equal(disposition.reason, null);
        approvalPolicyChecks += 2;

        assert.equal(getGeneratedQuestionBankAcceptanceMode(admitted), "BANK_ONLY");
        assert.equal(getGeneratedQuestionBankEligibilityIssue(admitted), null);
        converterEligibilityChecks += 2;

        const normalized = normalizeGeneratedQuestionPayload(admitted, {
          itemId: "33333333-3333-4333-8333-333333333333",
          generationRunCode: "GEN-CP012-AUDIT",
        });
        const generation = (normalized.answerModel as AnyRecord).generation as AnyRecord;
        assert.equal(normalized.stem, admitted.stem);
        assert.deepEqual(normalized.options, admitted.options);
        assert.equal(normalized.correctIndex, admitted.correctIndex);
        assert.equal(generation.providerQuestionId, candidate.admissionKey);
        assert.equal(generation.packageId, "BTD-001");
        assert.equal(generation.questionBankAcceptanceMode, "BANK_ONLY");
        assert.equal(generation.questionBankAcceptanceAuthority, BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY);
        assert.equal(generation.testEligible, false);
        assert.equal(generation.mockTestEligible, false);
        assert.equal(generation.publiclyPublishable, false);
        normalizedPayloadChecks += 10;

        assert.equal(admitted.manualApprovalRequired, true);
        assert.equal(admitted.questionBankAdmissionApproved, true);
        assert.equal(admitted.questionBankStatus, "READY_FOR_STORAGE");
        assert.equal(admitted.questionBankWritable, true);
        assert.equal(admitted.questionBankAcceptanceMode, "BANK_ONLY");
        assert.equal(admitted.questionBankAcceptanceAuthority, BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY);
        assert.equal(admitted.testEligibility, "INELIGIBLE");
        assert.equal(admitted.testEligible, false);
        assert.equal(admitted.mockTestEligible, false);
        assert.equal(admitted.publiclyPublishable, false);
        assert.equal(admitted.automaticStudentPublication, false);
        assert.equal(admitted.contentMutationAuthorized, false);
        lifecycleChecks += 12;

        assert.doesNotThrow(() => JSON.stringify(admitted));
        assert.doesNotThrow(() => JSON.parse(JSON.stringify(admitted)));
        jsonChecks += 2;

        const previousFingerprint = admissionKeys.get(candidate.admissionKey);
        if (previousFingerprint !== undefined) {
          assert.equal(previousFingerprint, candidate.admissionPayloadFingerprint, `${candidate.admissionKey}: unsafe admission-key collision`);
        } else {
          admissionKeys.set(candidate.admissionKey, candidate.admissionPayloadFingerprint);
        }
        keys.add(candidate.admissionKey);
        languageCounts[language] += 1;
        questions += 1;
        dedupSample ??= admitted;
      }
    }
  }

  assert.equal(questions, 6000);
  assert.deepEqual(languageCounts, { en: 2000, hi: 2000, pa: 2000 });
  const scopeUniqueCounts = Object.fromEntries([...scopeKeys].map(([scope, keys]) => [scope, keys.size]));
  const minimumScopeUnique = Math.min(...Object.values(scopeUniqueCounts));
  assert.ok(minimumScopeUnique >= 90, `minimum scope uniqueness ${minimumScopeUnique} is below 90/100`);
  const safeDedupRepeats = questions - admissionKeys.size;
  assert.ok(safeDedupRepeats >= 0);
  assert.ok(dedupSample);
  const dedupSqlCalls = await proveDedupReusePath(dedupSample!);

  const report = {
    auditVersion: "BTD-001-CP012-QUESTION-BANK-ADMISSION-AUDIT-v1",
    admissionVersion: BTD_CP012_QUESTION_BANK_ADMISSION_VERSION,
    chapterId: "BTD-001",
    checkpointId: "BTD-CP-012",
    permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
    languages: LANGUAGES,
    seedsPerQlPerLanguage: SEEDS_PER_QL_LANGUAGE,
    questionsValidated: questions,
    learnerParityChecks,
    readinessIdentityChecks,
    deterministicChecks,
    approvalPolicyChecks,
    converterEligibilityChecks,
    normalizedPayloadChecks,
    lifecycleChecks,
    jsonChecks,
    uniqueAdmissionKeys: admissionKeys.size,
    safeDedupRepeats,
    unsafeDedupCollisions: 0,
    minimumScopeUnique,
    scopeUniqueCounts,
    languageCounts,
    dedupReusePathSqlCalls: dedupSqlCalls,
    manualApprovalRequired: true,
    questionBankAdmissionApproved: true,
    questionBankWritable: true,
    questionBankAcceptanceMode: "BANK_ONLY",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  };
  console.log(JSON.stringify(report, null, 2));
  console.log("PASS_BTD_001_CP012_QUESTION_BANK_ADMISSION_AUDIT_V1");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
