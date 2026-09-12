import assert from "node:assert/strict";

import { generateLocalizedTrg001QuestionNativeReviewFinal5 } from "./localization-native-v5-pedagogic-review-final5";
import { generateLocalizedTrg001QuestionNativeReviewFinal6 } from "./localization-native-v5-pedagogic-review-final6";
import { TRG_001_POST_FINAL5_FREEZE_READINESS } from "./post-final5-freeze-readiness";
import { TRG_001_POST_FINAL5_HUMAN_REVIEW_PACKET_V1 } from "./post-final5-human-review-packet-v1";
import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import { generatePostFreezeRemediatedTrg001Question } from "./production-post-freeze-remediation-v1";

type Locale = "hi-IN" | "pa-IN";

function readField(question: any, field: string) {
  switch (field) {
    case "explanation.traps[0]": return question.explanation?.traps?.[0];
    case "explanation.shortcut": return question.explanation?.shortcut;
    case "explanation.keyRule": return question.explanation?.keyRule;
    case "explanation.steps[0].body": return question.explanation?.steps?.[0]?.body;
    default: throw new Error(`Unsupported review field ${field}`);
  }
}

const packet: any = TRG_001_POST_FINAL5_HUMAN_REVIEW_PACKET_V1;
const readiness = TRG_001_POST_FINAL5_FREEZE_READINESS;

assert.equal(packet.packetVersion, "TRG001_POST_FINAL5_HUMAN_REVIEW_PACKET_V1");
assert.equal(packet.packageId, "TRG-001");
assert.deepEqual(packet.candidate, readiness.candidate);
assert.deepEqual(packet.evidence, readiness.evidence);
assert.deepEqual(packet.scope.englishChangedQlIds, readiness.historicalEnglishAuthority.changedQlIds);
assert.deepEqual(packet.scope.localizedChangedQlIds, readiness.localizedScope.remediatedQlIds);
assert.equal(packet.scope.localizedChangedSurfaces, 15);

const frozenEnglish = generateHumanApprovedTrg001Question(packet.englishChange.qlId, packet.englishChange.reviewSeed) as any;
const remediatedEnglish = generatePostFreezeRemediatedTrg001Question(packet.englishChange.qlId, packet.englishChange.reviewSeed) as any;
assert.equal(readField(frozenEnglish, packet.englishChange.field), packet.englishChange.before);
assert.equal(readField(remediatedEnglish, packet.englishChange.field), packet.englishChange.after);

const localizedSurfaceKeys = new Set<string>();
const localizedQlIds = new Set<string>();
let changedFieldAssertions = 0;

for (const item of packet.localizedChanges) {
  localizedQlIds.add(item.qlId);
  for (const [locale, fields] of Object.entries(item.locales) as Array<[Locale, any[]]>) {
    localizedSurfaceKeys.add(`${item.qlId}:${locale}`);
    const before = generateLocalizedTrg001QuestionNativeReviewFinal5(item.qlId, item.reviewSeed, locale) as any;
    const after = generateLocalizedTrg001QuestionNativeReviewFinal6(item.qlId, item.reviewSeed, locale) as any;
    for (const fieldReview of fields) {
      assert.equal(readField(before, fieldReview.field), fieldReview.before, `${item.qlId}:${locale}:${fieldReview.field}: before-text drift.`);
      assert.equal(readField(after, fieldReview.field), fieldReview.after, `${item.qlId}:${locale}:${fieldReview.field}: after-text drift.`);
      changedFieldAssertions += 1;
    }
  }
}

assert.equal(localizedSurfaceKeys.size, 15);
assert.deepEqual([...localizedQlIds].sort(), [...readiness.localizedScope.remediatedQlIds].sort());
assert.equal(changedFieldAssertions, 16, "Expected 16 localized changed-field assertions: 2 for QL069 Punjabi plus 14 single-field locale changes.");

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const secTan = generateLocalizedTrg001QuestionNativeReviewFinal6(
    "TRG-001-QL-142",
    packet.ql142VariantReview.secTanSeed,
    locale,
  ) as any;
  const cosecCot = generateLocalizedTrg001QuestionNativeReviewFinal6(
    "TRG-001-QL-142",
    packet.ql142VariantReview.cosecCotSeed,
    locale,
  ) as any;
  assert.equal(secTan.explanation.shortcut, packet.ql142VariantReview.expected[locale].secTan, `${locale}: sec+tan variant drift.`);
  assert.equal(cosecCot.explanation.shortcut, packet.ql142VariantReview.expected[locale].cosecCot, `${locale}: cosec+cot variant drift.`);
}

assert.equal(packet.governance.humanReview, "PENDING");
assert.equal(packet.governance.packetGrantsApproval, false);
assert.equal(packet.governance.packetGrantsFreeze, false);
assert.equal(packet.governance.packetGrantsActivation, false);
assert.equal(packet.governance.questionStudioEnabled, false);
assert.equal(packet.governance.questionBankWritable, false);
assert.equal(packet.governance.testBuilderEligible, false);
assert.equal(packet.governance.publiclyPublishable, false);
assert.equal(packet.governance.explicitApprovalRecordRequired, true);

console.log(JSON.stringify({
  status: "TRG001_POST_FINAL5_HUMAN_REVIEW_PACKET_PASS",
  englishChangedQls: packet.scope.englishChangedQlIds.length,
  localizedChangedQls: packet.scope.localizedChangedQlIds.length,
  localizedChangedSurfaces: localizedSurfaceKeys.size,
  changedFieldAssertions,
  ql142VariantsChecked: 2,
  evidenceArtifactId: packet.evidence.artifactId,
  humanReview: packet.governance.humanReview,
  approvalGranted: packet.governance.packetGrantsApproval,
}, null, 2));
