import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuestionStudioPackages,
} from "../../../../../question-studio/shared-generation-engine-trigonometry";
import {
  generateHumanApprovedTrg001Question,
  TRG_001_FREEZE,
  TRG_001_HUMAN_APPROVAL,
} from "./TRG-001/production-human-approved-runtime";
import { TRG_002_V4_HUMAN_APPROVAL } from "./TRG-002/exam-readiness-v4-approved-governance";

async function main() {
  const packages = listQuestionStudioPackages();
  const trg001 = packages.find((entry: any) => entry.packageId === "TRG-001") as any;
  const trg002 = packages.find((entry: any) => entry.packageId === "TRG-002") as any;

  assert.ok(trg001, "TRG-001 must be exposed through the aggregate Question Studio capability surface");
  assert.equal(trg001.permanentQlCount, 144);
  assert.deepEqual(trg001.supportedLanguages, ["en"]);
  assert.equal(trg001.questionStudioDiscoverable, true);
  assert.equal(trg001.questionBankStatus, "WRITABLE");
  assert.equal(trg001.questionBankWritable, true);
  assert.equal(trg001.testEligibility, "ELIGIBLE");
  assert.equal(trg001.testEligible, true);
  assert.equal(trg001.mockTestEligible, true);
  assert.equal(trg001.publiclyPublishable, false);
  assert.equal(trg001.publicReleaseAuthorized, false);
  assert.equal(trg001.automaticStudentPublication, false);
  assert.equal(trg001.freezeStatus, "FROZEN");
  assert.equal(trg001.localizationStatus, "ENGLISH_ONLY");
  assert.equal(trg001.approvedContentFingerprint, TRG_001_HUMAN_APPROVAL.approvedContentFingerprint);
  assert.equal(trg001.cpIds.length, 6);

  assert.ok(trg002, "TRG-002 must remain exposed through the aggregate Question Studio capability surface");
  assert.equal(trg002.qlCount, 96);
  assert.deepEqual(trg002.supportedLanguages, ["en", "hi", "pa"]);
  assert.equal(trg002.questionStudioDiscoverable, true);
  assert.equal(trg002.questionBankStatus, "WRITABLE");
  assert.equal(trg002.testEligibility, "ELIGIBLE");
  assert.equal(trg002.publiclyPublishable, false);
  assert.equal(trg002.publicReleaseAuthorized, false);
  assert.equal(trg002.freezeStatus, "FROZEN");
  assert.equal(trg002.cpIds.length, 4);

  assert.equal(TRG_001_HUMAN_APPROVAL.status, "APPROVED");
  assert.equal(TRG_001_HUMAN_APPROVAL.approvedQlCount, 144);
  assert.equal(TRG_001_FREEZE.status, "FROZEN");
  assert.equal(TRG_002_V4_HUMAN_APPROVAL.status, "APPROVED");
  assert.equal(TRG_002_V4_HUMAN_APPROVAL.approvedQlCount, 96);

  // The frozen TRG-001 source remains locked. Activation exists only at the
  // Question Studio boundary and therefore does not rewrite approved content.
  const frozenSource: any = generateHumanApprovedTrg001Question("TRG-001-QL-001", "family-integration:frozen-source");
  assert.equal(frozenSource.questionStudioDiscoverable, false);
  assert.equal(frozenSource.questionBankStatus, "NOT_STORED");
  assert.equal(frozenSource.testEligibility, "INELIGIBLE");
  assert.equal(frozenSource.publiclyPublishable, false);
  assert.equal(frozenSource.freeze.activationAuthorized, false);
  assert.equal(frozenSource.freeze.mergeAuthorized, false);

  const trg001Result: any = await generateQuestion({
    packageId: "TRG-001",
    questionLanguageId: "TRG-001-QL-001",
    language: "en",
    count: 2,
    seed: "family-integration:trg001",
  });
  assert.equal(trg001Result.questions.length, 2);
  assert.equal(trg001Result.generationContext.packageId, "TRG-001");
  assert.equal(trg001Result.generationContext.questionBankStatus, "WRITABLE");
  assert.equal(trg001Result.generationContext.testEligibility, "ELIGIBLE");
  assert.equal(trg001Result.generationContext.publiclyPublishable, false);
  assert.equal(trg001Result.generationContext.publicReleaseAuthorized, false);
  assert.equal(trg001Result.generationContext.localizationStatus, "ENGLISH_ONLY");
  assert.equal(trg001Result.generationContext.freezeFingerprint, TRG_001_FREEZE.approvedContentFingerprint);
  for (const question of trg001Result.questions) {
    assert.equal(question.packageId, "TRG-001");
    assert.equal(question.questionLanguageId, "TRG-001-QL-001");
    assert.equal(question.language, "en");
    assert.equal(question.questionStudioDiscoverable, true);
    assert.equal(question.questionBankStatus, "WRITABLE");
    assert.equal(question.testEligibility, "ELIGIBLE");
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.publicReleaseAuthorized, false);
    assert.equal(question.proceduralLogic.contentMutationAuthorized, false);
    assert.equal(question.proceduralLogic.freezeFingerprint, TRG_001_FREEZE.approvedContentFingerprint);
  }

  await assert.rejects(
    () => generateQuestion({ packageId: "TRG-001", language: "hi", count: 1, seed: "family-integration:trg001-hi" }),
    /English-only/i,
  );
  await assert.rejects(
    () => generateQuestion({ packageId: "TRG-001", language: "pa", count: 1, seed: "family-integration:trg001-pa" }),
    /English-only/i,
  );

  const trg002Result: any = await generateQuestion({
    packageId: "TRG-002",
    questionLanguageId: "TRG-002-QL-015",
    language: "en",
    count: 1,
    seed: "family-integration:trg002",
  });
  assert.equal(trg002Result.questions.length, 1);
  assert.equal(trg002Result.generationContext.packageId, "TRG-002");
  assert.equal(trg002Result.generationContext.questionBankStatus, "WRITABLE");
  assert.equal(trg002Result.generationContext.testEligibility, "ELIGIBLE");
  assert.equal(trg002Result.generationContext.publiclyPublishable, false);
  assert.equal(trg002Result.generationContext.publicReleaseAuthorized, false);
  assert.equal(trg002Result.questions[0].packageId, "TRG-002");
  assert.equal(trg002Result.questions[0].solutionDiagram.kind, "TRG002_HEIGHTS_DISTANCES");

  console.log("Trigonometry family Question Studio integration: PASS TRG-001=144/en TRG-002=96/en-hi-pa public=OFF");
}

void main();
