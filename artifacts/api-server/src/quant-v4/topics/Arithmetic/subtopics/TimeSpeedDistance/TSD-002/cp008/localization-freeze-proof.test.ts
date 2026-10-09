import { TSD_CP008_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { TSD_CP008_QL099_SAME_DIRECTION_GUARDS } from "./localization-final";
import {
  TSD_CP008_FROZEN_HINDI_LOCALIZATION,
  TSD_CP008_FROZEN_PUNJABI_LOCALIZATION,
  TSD_CP008_LOCALIZATION_FREEZE_APPROVAL,
} from "./localization-freeze-registry";
import { TSD_CP008_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-008 localization freeze proof failed: ${message}`);
}

const hindiFamilies = TSD_CP008_FROZEN_HINDI_LOCALIZATION.qls.flatMap((ql) => ql.families);
const punjabiFamilies = TSD_CP008_FROZEN_PUNJABI_LOCALIZATION.qls.flatMap((ql) => ql.families);
const hindiText = JSON.stringify(TSD_CP008_FROZEN_HINDI_LOCALIZATION);
const punjabiText = JSON.stringify(TSD_CP008_FROZEN_PUNJABI_LOCALIZATION);

assert(TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.status === "PRODUCT_OWNER_APPROVED_LOCALIZATION_FREEZE", "approval status changed");
assert(TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.approvedOn === "2026-08-23", "approval date changed");
assert(TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.approvalInstruction === "approved", "approval instruction changed");
assert(TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.approvedSourceHead === "dce8a35d4082e8032f0b9f868565299e0031fa1a", "reviewed localization source head changed");
assert(TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.finalLocalizationLayer === "APPROVED_TEMPLATES_PLUS_CASE_CONDITIONAL_QL099_RUNTIME_GUARD", "final semantic localization layer changed");
assert(TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.englishFreezeStatus === "FROZEN", "English freeze lost");
assert(TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.hindiFreezeStatus === "FROZEN", "Hindi is not frozen");
assert(TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.punjabiFreezeStatus === "FROZEN", "Punjabi is not frozen");
assert(TSD_CP008_FROZEN_HINDI_LOCALIZATION.locale === "hi-IN", "Hindi locale changed");
assert(TSD_CP008_FROZEN_PUNJABI_LOCALIZATION.locale === "pa-IN", "Punjabi locale changed");
assert(TSD_CP008_FROZEN_HINDI_LOCALIZATION.qls.length === 9 && TSD_CP008_FROZEN_PUNJABI_LOCALIZATION.qls.length === 9, "localized QL count changed");
assert(hindiFamilies.length === 54 && punjabiFamilies.length === 54, "localized family count changed");
assert(TSD_CP008_FROZEN_HINDI_LOCALIZATION.qls.every((ql) => ql.localizationStatus === "FROZEN"), "Hindi QL lost FROZEN status");
assert(TSD_CP008_FROZEN_PUNJABI_LOCALIZATION.qls.every((ql) => ql.localizationStatus === "FROZEN"), "Punjabi QL lost FROZEN status");
assert(JSON.stringify(TSD_CP008_FROZEN_HINDI_LOCALIZATION.qls.map((ql) => ql.qlId)) === JSON.stringify(TSD_CP008_PERMANENT_QL_IDS), "Hindi QL order changed");
assert(JSON.stringify(TSD_CP008_FROZEN_PUNJABI_LOCALIZATION.qls.map((ql) => ql.qlId)) === JSON.stringify(TSD_CP008_PERMANENT_QL_IDS), "Punjabi QL order changed");
assert(JSON.stringify(TSD_CP008_FROZEN_ENGLISH_REGISTRY.map((ql) => ql.qlId)) === JSON.stringify(TSD_CP008_PERMANENT_QL_IDS), "English QL order changed");
assert(!/चाल/.test(hindiText), "deprecated Hindi चाल appears in frozen localization");
assert(/गति/.test(hindiText), "preferred Hindi गति missing from frozen localization");
assert(/\p{Script=Devanagari}/u.test(hindiText), "Hindi freeze lacks Devanagari");
assert(/\p{Script=Gurmukhi}/u.test(punjabiText), "Punjabi freeze lacks Gurmukhi");
assert(TSD_CP008_QL099_SAME_DIRECTION_GUARDS.hi === "समान दिशा वाली स्थिति में पहली ट्रेन तेज है।", "Hindi QL099 runtime uniqueness guard changed");
assert(TSD_CP008_QL099_SAME_DIRECTION_GUARDS.pa === "ਇੱਕੋ ਦਿਸ਼ਾ ਵਾਲੀ ਸਥਿਤੀ ਵਿੱਚ ਪਹਿਲੀ ਰੇਲਗੱਡੀ ਤੇਜ਼ ਹੈ।", "Punjabi QL099 runtime uniqueness guard changed");
assert(TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.questionBankStatus === "NOT_STORED", "question bank opened during localization freeze");
assert(TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.testEligibility === "INELIGIBLE", "tests opened during localization freeze");
assert(!TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.publiclyPublishable, "public publication opened during localization freeze");

console.log("TSD-CP-008 APPROVED LOCALIZATION FREEZE PROOF: PASS");
console.log(JSON.stringify({
  approvedSourceHead: TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.approvedSourceHead,
  finalLocalizationLayer: TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.finalLocalizationLayer,
  qlRange: TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.qlRange,
  qlsPerLocale: 9,
  familiesPerLocale: 54,
  english: TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.englishFreezeStatus,
  hindi: TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.hindiFreezeStatus,
  punjabi: TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.punjabiFreezeStatus,
  ql099CaseConditionalSameDirectionGuard: true,
  hindiPreferredSpeedTerm: TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.hindiPreferredSpeedTerm,
  nextQl: TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.nextQl,
  questionStudioIntegrationStatus: TSD_CP008_LOCALIZATION_FREEZE_APPROVAL.questionStudioIntegrationStatus,
}, null, 2));
