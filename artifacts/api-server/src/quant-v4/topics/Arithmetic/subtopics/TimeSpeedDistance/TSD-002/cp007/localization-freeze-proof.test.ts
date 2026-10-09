import { TSD_CP007_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import {
  TSD_CP007_FROZEN_HINDI_LOCALIZATION,
  TSD_CP007_FROZEN_PUNJABI_LOCALIZATION,
  TSD_CP007_LOCALIZATION_FREEZE_APPROVAL,
} from "./localization-freeze-registry";
import { TSD_CP007_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-007 localization freeze proof failed: ${message}`);
}

assert(TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.status === "PRODUCT_OWNER_APPROVED_LOCALIZATION_FREEZE", "approval status changed");
assert(TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.approvedSourceHead === "26a93b66f8680566509c49ae3b41c275996f0d12", "approved localization source head changed");
assert(TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.englishFreezeStatus === "FROZEN", "English must remain frozen");
assert(TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.hindiFreezeStatus === "FROZEN", "Hindi not frozen");
assert(TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.punjabiFreezeStatus === "FROZEN", "Punjabi not frozen");
assert(TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.questionBankStatus === "NOT_STORED", "question bank lock opened unexpectedly");
assert(TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.testEligibility === "INELIGIBLE", "test eligibility opened unexpectedly");
assert(!TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.publiclyPublishable, "public publication opened unexpectedly");

for (const [locale, registry] of [
  ["hi-IN", TSD_CP007_FROZEN_HINDI_LOCALIZATION],
  ["pa-IN", TSD_CP007_FROZEN_PUNJABI_LOCALIZATION],
] as const) {
  assert(registry.length === 11, `${locale}: expected 11 frozen QLs`);
  assert(JSON.stringify(registry.map((ql) => ql.qlId)) === JSON.stringify(TSD_CP007_PERMANENT_QL_IDS), `${locale}: frozen QL order changed`);
  assert(registry.every((ql) => ql.localizationStatus === "FROZEN"), `${locale}: not every QL is frozen`);
  assert(registry.reduce((count, ql) => count + ql.stemFamilies.length, 0) === 66, `${locale}: expected 66 frozen families`);
  assert(new Set(registry.flatMap((ql) => ql.stemFamilies.map((family) => family.familyId))).size === 66, `${locale}: family IDs changed`);
}

const hindiSurface = TSD_CP007_FROZEN_HINDI_LOCALIZATION.flatMap((ql) => [
  ql.learnerContract,
  ...ql.objectPool,
  ...ql.stemFamilies.flatMap((family) => [family.stem, family.explanationGuide]),
]).join("\n");
assert(!hindiSurface.includes("चाल"), "Hindi frozen learner surface contains banned term चाल");
assert(hindiSurface.includes("गति"), "Hindi frozen learner surface does not contain preferred term गति");

assert(TSD_CP007_FROZEN_ENGLISH_REGISTRY.length === 11, "English frozen registry changed");

console.log("TSD-CP-007 LOCALIZATION FREEZE PROOF: PASS");
console.log(JSON.stringify({
  status: TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.status,
  approvedSourceHead: TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.approvedSourceHead,
  frozenEnglishQls: TSD_CP007_FROZEN_ENGLISH_REGISTRY.length,
  frozenHindiFamilies: 66,
  frozenPunjabiFamilies: 66,
  hindiPreferredSpeedTerm: TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.hindiPreferredSpeedTerm,
  questionStudioIntegrationStatus: TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.questionStudioIntegrationStatus,
  questionBankStatus: TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.questionBankStatus,
  testEligibility: TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.testEligibility,
  publiclyPublishable: TSD_CP007_LOCALIZATION_FREEZE_APPROVAL.publiclyPublishable,
}, null, 2));
