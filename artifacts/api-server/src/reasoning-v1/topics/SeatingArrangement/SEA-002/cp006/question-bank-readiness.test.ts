import assert from "node:assert/strict";
import { Buffer } from "node:buffer";

import { getPublicationIssues } from "../../../../../lib/admin-question-management.ts";
import { getGeneratedItemApprovalDisposition } from "../../../../../lib/admin-question-studio-approval-policy.ts";
import {
  generateSea002Cp006QuestionStudioBatch,
  listSea002Cp006QuestionStudioPackages,
  SEA002_CP006_QUESTION_STUDIO_QL_IDS,
} from "./question-studio-integration.ts";
import {
  prepareSea002Cp006QuestionBankCandidate,
  SEA002_CP006_QUESTION_BANK_READINESS,
  SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY,
} from "./question-bank-readiness.ts";
import {
  SEA002_CP006_ENGLISH_FREEZE,
  SEA002_CP006_FROZEN_QUERY_CONTRACTS,
  SEA002_CP006_LOCALIZATION_FREEZE,
  SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE,
} from "./permanent/freeze.ts";

process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";
const {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
  normalizeGeneratedQuestionPayload,
} = await import("../../../../../lib/admin-question-conversion.ts");

const authority = SEA002_CP006_QUESTION_BANK_READINESS;
assert.equal(authority.authorityId, SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY);
assert.equal(authority.status, "QUESTION_BANK_CONVERSION_READY_NOT_ACTIVE");
assert.equal(authority.englishFreezeFingerprint, SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint);
assert.equal(authority.localizedFreezeFingerprint, SEA002_CP006_LOCALIZATION_FREEZE.approvedLocalizedReviewFingerprint);
assert.deepEqual(authority.permanentQlIds, SEA002_CP006_QUESTION_STUDIO_QL_IDS);
assert.deepEqual(authority.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(authority.currentLifecycle.sourceQuestionBankWritable, false);
assert.equal(authority.currentLifecycle.studioPayloadQuestionBankWritable, false);
assert.equal(authority.currentLifecycle.questionBankAcceptanceActive, false);
assert.equal(authority.candidateLifecycle.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(authority.candidateLifecycle.questionBankWritable, true);
assert.equal(authority.candidateLifecycle.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(authority.candidateLifecycle.manualGenerationApprovalRequired, true);
assert.equal(authority.downstreamLifecycle.testEligible, false);
assert.equal(authority.downstreamLifecycle.mockTestEligible, false);
assert.equal(authority.downstreamLifecycle.productionStaging, false);
assert.equal(authority.downstreamLifecycle.publiclyPublishable, false);
assert.equal(authority.downstreamLifecycle.automaticStudentPublication, false);
assert.equal(authority.nextGate, "QUESTION_BANK_ACCEPTANCE_ACTIVATION_REQUIRES_SEPARATE_CHECKPOINT");

const studioCapability = listSea002Cp006QuestionStudioPackages()[0]!;
assert.equal(studioCapability.questionBankStatus, "NOT_STORED");
assert.equal(studioCapability.questionBankWritable, false);
assert.equal(studioCapability.reviewOnly, true);
assert.equal(studioCapability.testEligible, false);
assert.equal(studioCapability.mockTestEligible, false);
assert.equal(studioCapability.publiclyPublishable, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.mockTestEligible, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.productionStaging, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable, false);

const basePublicationSnapshot = {
  status: "approved",
  approvedVersionId: "version-1",
  examVersionId: "exam-1",
  primaryTaxonomyNodeId: "topic-1",
  taxonomyNodeIds: ["topic-1"],
  stem: "Question stem",
  explanation: "Explanation",
  optionCount: 4,
  correctOptionCount: 1,
};
const publicationIssues = getPublicationIssues({
  ...basePublicationSnapshot,
  generationTestEligible: false,
  generationPubliclyPublishable: false,
});
assert.ok(publicationIssues.includes("Generation lifecycle has not enabled scored-test eligibility."));
assert.ok(publicationIssues.includes("Generation lifecycle has not enabled public publication."));

const qlReach = new Set<string>();
const queryReach = new Set<string>();
const languageReach = new Set<string>();
const difficultyReach = new Set<string>();
const runtimeVariants = new Set<string>();
let candidateCount = 0;
let normalizedCount = 0;
let multilingualCount = 0;
let diagramPreservationChecks = 0;
let publicationBlockChecks = 0;
let sourceLockChecks = 0;

for (const language of ["en", "hi", "pa"] as const) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const result = await generateSea002Cp006QuestionStudioBatch({
      packageId: "SEA-002",
      canonicalProblemId: "SEA-CP-006",
      language,
      difficulty,
      count: 8,
      seed: `sea-cp006-question-bank-readiness:${language}:${difficulty}`,
    });
    assert.equal(result.questions.length, 8);
    assert.equal(result.generationContext.questionBankStatus, "NOT_STORED");
    assert.equal(result.generationContext.questionBankWritable, false);

    for (const question of result.questions) {
      candidateCount += 1;
      languageReach.add(language);
      difficultyReach.add(difficulty);
      qlReach.add(question.qlId);
      queryReach.add(question.queryContractId);
      runtimeVariants.add(question.runtimeVariant);

      assert.equal(question.questionBankStatus, "NOT_STORED");
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.traceability.sourceLifecycle.questionBankWritable, false);
      sourceLockChecks += 1;

      const candidate = prepareSea002Cp006QuestionBankCandidate(question);
      assert.equal(candidate.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(candidate.questionBankWritable, true);
      assert.equal(candidate.questionBankAcceptanceMode, "BANK_ONLY");
      assert.equal(candidate.questionBankAcceptanceAuthority, SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY);
      assert.equal(candidate.testEligibility, "INELIGIBLE");
      assert.equal(candidate.testEligible, false);
      assert.equal(candidate.mockTestEligible, false);
      assert.equal(candidate.productionStaging, false);
      assert.equal(candidate.publiclyPublishable, false);
      assert.equal(candidate.automaticStudentPublication, false);
      assert.deepEqual(
        getGeneratedItemApprovalDisposition(candidate),
        { mode: "question_bank", reason: null },
      );
      assert.equal(getGeneratedQuestionBankAcceptanceMode(candidate), "BANK_ONLY");
      assert.equal(getGeneratedQuestionBankEligibilityIssue(candidate), null);

      const normalized = normalizeGeneratedQuestionPayload(candidate, {
        itemId: `sea-cp006-bank-${candidateCount}`,
        generationRunCode: "SEA-CP006-BANK-READINESS",
      });
      normalizedCount += 1;
      assert.equal(normalized.stem, question.stem);
      assert.deepEqual(normalized.options, [...question.options]);
      assert.equal(normalized.correctIndex, question.correctIndex);
      assert.deepEqual(normalized.answerModel.canonicalAnswer, question.canonicalAnswer);
      const generation = normalized.answerModel.generation as Record<string, unknown>;
      assert.equal(generation.qlId, question.qlId);
      assert.equal(generation.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(generation.questionBankWritable, true);
      assert.equal(generation.questionBankAcceptanceMode, "BANK_ONLY");
      assert.equal(generation.questionBankAcceptanceAuthority, SEA002_CP006_QUESTION_BANK_READINESS_AUTHORITY);
      assert.equal(generation.testEligible, false);
      assert.equal(generation.mockTestEligible, false);
      assert.equal(generation.publiclyPublishable, false);
      assert.equal(generation.automaticStudentPublication, false);

      const imageMatch = /<img src="data:image\/svg\+xml;base64,([A-Za-z0-9+/=]+)" alt="([^"]+)" loading="lazy" \/>/u.exec(normalized.explanation);
      assert.ok(imageMatch, "Question Bank explanation lost the solved seating diagram");
      const decodedSvg = Buffer.from(imageMatch[1]!, "base64").toString("utf8");
      assert.match(decodedSvg, /^<svg\b/u);
      assert.match(decodedSvg, /fill="white"/u);
      assert.doesNotMatch(decodedSvg, /<\s*(?:script|foreignObject|iframe|object|embed|image|use|style|a)\b/iu);
      assert.doesNotMatch(decodedSvg, /\bon[a-z]+\s*=|\b(?:href|xlink:href)\s*=|javascript:|data:/iu);
      assert.doesNotMatch(decodedSvg, />C\d+</u);
      diagramPreservationChecks += 1;

      if (language !== "en") {
        multilingualCount += 1;
        if (language === "hi") assert.match(imageMatch[2]!, /[\u0900-\u097F]/u);
        else assert.match(imageMatch[2]!, /[\u0A00-\u0A7F]/u);
      }

      const issues = getPublicationIssues({
        ...basePublicationSnapshot,
        stem: normalized.stem,
        explanation: normalized.explanation,
        optionCount: normalized.options.length,
        generationTestEligible: generation.testEligible as boolean,
        generationPubliclyPublishable: generation.publiclyPublishable as boolean,
      });
      assert.ok(issues.includes("Generation lifecycle has not enabled scored-test eligibility."));
      assert.ok(issues.includes("Generation lifecycle has not enabled public publication."));
      publicationBlockChecks += 1;
    }
  }
}

assert.equal(candidateCount, 72);
assert.equal(normalizedCount, 72);
assert.equal(multilingualCount, 48);
assert.equal(diagramPreservationChecks, 72);
assert.equal(publicationBlockChecks, 72);
assert.equal(sourceLockChecks, 72);
assert.deepEqual([...qlReach].sort(), [...SEA002_CP006_QUESTION_STUDIO_QL_IDS].sort());
assert.deepEqual([...queryReach].sort(), [...SEA002_CP006_FROZEN_QUERY_CONTRACTS].sort());
assert.deepEqual([...languageReach].sort(), ["en", "hi", "pa"]);
assert.deepEqual([...difficultyReach].sort(), ["Easy", "Hard", "Medium"]);
assert.deepEqual([...runtimeVariants].sort(), ["APPROVED_BASELINE", "EXAM_REAL_SOURCE_A", "EXAM_REAL_SOURCE_B"]);

assert.throws(
  () => prepareSea002Cp006QuestionBankCandidate({
    packageId: "SEA-002",
    canonicalProblemId: "SEA-CP-006",
    qlId: "SEA-QL-021",
    questionBankStatus: "READY_FOR_STORAGE",
    questionBankWritable: true,
  }),
  /review-only Studio lifecycle/u,
);

console.log("PASS_SEA002_CP006_QUESTION_BANK_READINESS_V1");
console.log("conversion candidates", candidateCount);
console.log("normalized bank payloads", normalizedCount);
console.log("multilingual conversions", multilingualCount);
console.log("permanent QL reach", [...qlReach].sort().join(","));
console.log("frozen query reach", [...queryReach].sort().join(","));
console.log("runtime variants", [...runtimeVariants].sort().join(","));
console.log("solved diagram preserved", diagramPreservationChecks);
console.log("publication/test blocks", publicationBlockChecks);
console.log("source lifecycle locks", sourceLockChecks);
console.log("bank candidate mode BANK_ONLY; activation applied false");
console.log("next gate", authority.nextGate);
