import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuestionStudioPackages,
} from "../../../../../question-studio/shared-generation-engine-trigonometry";
import { generateLocalizedTrg001QuestionNativeReviewFinal6 } from "./TRG-001/localization-native-v5-pedagogic-review-final6";
import { TRG_001_POST_FINAL5_FREEZE_V1 } from "./TRG-001/post-final5-freeze-v1";
import { TRG_001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1 } from "./TRG-001/post-final5-question-studio-activation-v1";
import { generatePostFreezeRemediatedTrg001Question } from "./TRG-001/production-post-freeze-remediation-v1";
import { generateHumanApprovedTrg001Question } from "./TRG-001/production-human-approved-runtime";
import { TRG_002_V4_HUMAN_APPROVAL } from "./TRG-002/exam-readiness-v4-approved-governance";

async function main() {
  const packages = listQuestionStudioPackages();
  const trg001 = packages.find((entry: any) => entry.packageId === "TRG-001") as any;
  const trg002 = packages.find((entry: any) => entry.packageId === "TRG-002") as any;
  const freeze = TRG_001_POST_FINAL5_FREEZE_V1;
  const activation = TRG_001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1;

  assert.ok(trg001, "TRG-001 must be exposed through the aggregate Question Studio capability surface");
  assert.equal(trg001.permanentQlCount, 144);
  assert.deepEqual(trg001.supportedLanguages, ["en", "hi", "pa"]);
  assert.equal(trg001.enabled, true);
  assert.equal(trg001.questionStudioDiscoverable, true);
  assert.equal(trg001.questionBankStatus, "LOCKED");
  assert.equal(trg001.questionBankWritable, false);
  assert.equal(trg001.testEligibility, "INELIGIBLE");
  assert.equal(trg001.testEligible, false);
  assert.equal(trg001.testBuilderEligible, false);
  assert.equal(trg001.mockTestEligible, false);
  assert.equal(trg001.publiclyPublishable, false);
  assert.equal(trg001.publicReleaseAuthorized, false);
  assert.equal(trg001.automaticStudentPublication, false);
  assert.equal(trg001.freezeStatus, "FROZEN");
  assert.equal(trg001.freezeVersion, freeze.version);
  assert.equal(trg001.localizationStatus, "MULTILINGUAL_FROZEN_ACTIVE");
  assert.equal(trg001.multilingualFreezeGranted, true);
  assert.equal(trg001.englishRemediationVersion, freeze.candidate.englishRemediationVersion);
  assert.equal(trg001.localizationVersion, freeze.candidate.localizationVersion);
  assert.equal(trg001.reviewedSourceHead, freeze.candidate.reviewedSourceHead);
  assert.equal(trg001.approvedContentFingerprint, freeze.evidence.artifactDigest);
  assert.equal(trg001.cpIds.length, 6);

  assert.equal(freeze.status, "FROZEN");
  assert.equal(freeze.execution.newEnglishFreezeGranted, true);
  assert.equal(freeze.execution.multilingualFreezeGranted, true);
  assert.equal(activation.status, "ACTIVE_INTERNAL_QUESTION_STUDIO");
  assert.equal(activation.activationScope, "QUESTION_STUDIO_ONLY");
  assert.equal(activation.execution.questionStudioEnabled, true);
  assert.equal(activation.execution.questionBankWritable, false);
  assert.equal(activation.execution.testBuilderEligible, false);
  assert.equal(activation.execution.publicReleaseAuthorized, false);

  // Historical authority remains provenance-only and is not mutated by the new activation.
  const historicalSource: any = generateHumanApprovedTrg001Question("TRG-001-QL-001", "family-integration:historical-source");
  assert.equal(historicalSource.questionStudioDiscoverable, false);
  assert.equal(historicalSource.questionBankStatus, "NOT_STORED");
  assert.equal(historicalSource.testEligibility, "INELIGIBLE");
  assert.equal(historicalSource.publiclyPublishable, false);

  // English must come from the post-freeze-remediated candidate, not the historical frozen source.
  const enBatchSeed = "family-integration:trg001-en";
  const enQlId = "TRG-001-QL-093";
  const enSourceSeed = `${enBatchSeed}:en:${enQlId}:0`;
  const expectedEnglish: any = generatePostFreezeRemediatedTrg001Question(enQlId, enSourceSeed);
  const trg001English: any = await generateQuestion({
    packageId: "TRG-001",
    questionLanguageId: enQlId,
    language: "en",
    count: 1,
    seed: enBatchSeed,
  });
  assert.equal(trg001English.questions.length, 1);
  assert.equal(trg001English.questions[0].stem, expectedEnglish.stem);
  assert.deepEqual(trg001English.questions[0].packageExplanation, expectedEnglish.explanation);
  assert.equal(trg001English.questions[0].packageExplanation.traps[0], "Write 1 as a fraction with the same denominator before combining.");
  assert.equal(trg001English.questions[0].packageExplanation.traps[0].includes("${t.h}"), false);

  // Hindi must come from Final6 under the multilingual freeze.
  const hiBatchSeed = "family-integration:trg001-hi";
  const hiQlId = "TRG-001-QL-113";
  const hiSourceSeed = `${hiBatchSeed}:hi:${hiQlId}:0`;
  const expectedHindi: any = generateLocalizedTrg001QuestionNativeReviewFinal6(hiQlId, hiSourceSeed, "hi-IN");
  const trg001Hindi: any = await generateQuestion({
    packageId: "TRG-001",
    questionLanguageId: hiQlId,
    language: "hi",
    count: 1,
    seed: hiBatchSeed,
  });
  assert.equal(trg001Hindi.questions.length, 1);
  assert.equal(trg001Hindi.questions[0].language, "hi");
  assert.equal(trg001Hindi.questions[0].locale, "hi-IN");
  assert.equal(trg001Hindi.questions[0].stem, expectedHindi.stem);
  assert.deepEqual(trg001Hindi.questions[0].packageExplanation, expectedHindi.explanation);
  assert.equal(trg001Hindi.questions[0].packageExplanation.keyRule, "cos θ से भाग देकर tan θ को अलग करें।");

  // Punjabi must come from Final6 and include the QL-069 native-order remediation.
  const paBatchSeed = "family-integration:trg001-pa";
  const paQlId = "TRG-001-QL-069";
  const paSourceSeed = `${paBatchSeed}:pa:${paQlId}:0`;
  const expectedPunjabi: any = generateLocalizedTrg001QuestionNativeReviewFinal6(paQlId, paSourceSeed, "pa-IN");
  const trg001Punjabi: any = await generateQuestion({
    packageId: "TRG-001",
    questionLanguageId: paQlId,
    language: "pa",
    count: 1,
    seed: paBatchSeed,
  });
  assert.equal(trg001Punjabi.questions.length, 1);
  assert.equal(trg001Punjabi.questions[0].language, "pa");
  assert.equal(trg001Punjabi.questions[0].locale, "pa-IN");
  assert.equal(trg001Punjabi.questions[0].stem, expectedPunjabi.stem);
  assert.deepEqual(trg001Punjabi.questions[0].packageExplanation, expectedPunjabi.explanation);
  assert.equal(
    trg001Punjabi.questions[0].packageExplanation.shortcut,
    "ਕੋਣ ਨੂੰ ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ, cos ਦਾ ਸਹੀ ਚਿੰਨ੍ਹ ਲਗਾਓ ਅਤੇ ਫਿਰ ਪਰਸਪਰ ਲਓ।",
  );

  for (const result of [trg001English, trg001Hindi, trg001Punjabi]) {
    assert.equal(result.generationContext.packageId, "TRG-001");
    assert.deepEqual(result.generationContext.supportedLanguages, ["en", "hi", "pa"]);
    assert.equal(result.generationContext.multilingualFreezeGranted, true);
    assert.equal(result.generationContext.questionStudioDiscoverable, true);
    assert.equal(result.generationContext.internalReviewRunsWritable, true);
    assert.equal(result.generationContext.questionBankStatus, "LOCKED");
    assert.equal(result.generationContext.questionBankWritable, false);
    assert.equal(result.generationContext.testEligibility, "INELIGIBLE");
    assert.equal(result.generationContext.testEligible, false);
    assert.equal(result.generationContext.testBuilderEligible, false);
    assert.equal(result.generationContext.publiclyPublishable, false);
    assert.equal(result.generationContext.publicReleaseAuthorized, false);
    assert.equal(result.generationContext.localizationStatus, "MULTILINGUAL_FROZEN_ACTIVE");
    assert.equal(result.generationContext.freezeVersion, freeze.version);
    assert.equal(result.generationContext.freezeFingerprint, freeze.evidence.artifactDigest);
    for (const question of result.questions) {
      assert.equal(question.packageId, "TRG-001");
      assert.equal(question.questionStudioDiscoverable, true);
      assert.equal(question.questionBankStatus, "LOCKED");
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligibility, "INELIGIBLE");
      assert.equal(question.testEligible, false);
      assert.equal(question.testBuilderEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.publicReleaseAuthorized, false);
      assert.equal(question.proceduralLogic.contentMutationAuthorized, false);
      assert.equal(question.proceduralLogic.freezeVersion, freeze.version);
      assert.equal(question.proceduralLogic.freezeFingerprint, freeze.evidence.artifactDigest);
    }
  }

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
  assert.equal(TRG_002_V4_HUMAN_APPROVAL.status, "APPROVED");
  assert.equal(TRG_002_V4_HUMAN_APPROVAL.approvedQlCount, 96);

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

  console.log("Trigonometry family Question Studio integration: PASS TRG-001=144/en-hi-pa question-studio-only TRG-002=96/en-hi-pa public=OFF");
}

void main();