import { TSD_CP008_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-registry";
import { TSD_CP008_ENGLISH_FREEZE_APPROVAL, TSD_CP008_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { TSD_CP008_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-008 English freeze proof failed: ${message}`);
}

const families = TSD_CP008_FROZEN_ENGLISH_REGISTRY.flatMap((ql) => ql.stemFamilies);
const easy = families.filter((family) => family.difficulty === "EASY").length;
const medium = families.filter((family) => family.difficulty === "MEDIUM").length;

assert(TSD_CP008_ENGLISH_FREEZE_APPROVAL.status === "PRODUCT_OWNER_APPROVED_ENGLISH_FREEZE", "approval status changed");
assert(TSD_CP008_ENGLISH_FREEZE_APPROVAL.approvedOn === "2026-08-23", "approval date changed");
assert(TSD_CP008_ENGLISH_FREEZE_APPROVAL.approvalInstruction === "approved", "approval instruction changed");
assert(TSD_CP008_ENGLISH_FREEZE_APPROVAL.approvedSourceHead === "14f09b2c687eadd6f422dd6547e564cdf5f30305", "approved source head changed");
assert(TSD_CP008_ENGLISH_FREEZE_APPROVAL.englishFreezeStatus === "FROZEN", "English is not frozen");
assert(TSD_CP008_ENGLISH_FREEZE_APPROVAL.localizationStatus === "IN_PROGRESS", "localization should be in progress");
assert(TSD_CP008_FROZEN_ENGLISH_REGISTRY.length === 9, "frozen QL count changed");
assert(families.length === 54, "frozen family count changed");
assert(easy === 17 && medium === 37, `frozen difficulty changed: ${easy}/${medium}`);
assert(JSON.stringify(TSD_CP008_FROZEN_ENGLISH_REGISTRY.map((ql) => ql.qlId)) === JSON.stringify(TSD_CP008_PERMANENT_QL_IDS), "frozen QL order changed");
assert(TSD_CP008_FROZEN_ENGLISH_REGISTRY.every((ql) => ql.editorialStatus === "FROZEN"), "a frozen QL lost FROZEN status");
assert(JSON.stringify(TSD_CP008_FROZEN_ENGLISH_REGISTRY.map(({ editorialStatus: _status, ...ql }) => ql)) === JSON.stringify(TSD_CP008_ENGLISH_AUTHORING_REGISTRY), "frozen English content differs from approved review candidate");
assert(!TSD_CP008_ENGLISH_FREEZE_APPROVAL.questionStudioEnabled, "Question Studio opened during English freeze");
assert(TSD_CP008_ENGLISH_FREEZE_APPROVAL.questionBankStatus === "NOT_STORED", "question bank opened during English freeze");
assert(TSD_CP008_ENGLISH_FREEZE_APPROVAL.testEligibility === "INELIGIBLE", "tests opened during English freeze");
assert(!TSD_CP008_ENGLISH_FREEZE_APPROVAL.publiclyPublishable, "public publication opened during English freeze");

console.log("TSD-CP-008 APPROVED ENGLISH FREEZE PROOF: PASS");
console.log(JSON.stringify({
  approvedSourceHead: TSD_CP008_ENGLISH_FREEZE_APPROVAL.approvedSourceHead,
  qlRange: TSD_CP008_ENGLISH_FREEZE_APPROVAL.approvedQlRange,
  qls: TSD_CP008_FROZEN_ENGLISH_REGISTRY.length,
  families: families.length,
  difficulty: { EASY: easy, MEDIUM: medium, HARD: 0 },
  englishFreezeStatus: TSD_CP008_ENGLISH_FREEZE_APPROVAL.englishFreezeStatus,
  localizationStatus: TSD_CP008_ENGLISH_FREEZE_APPROVAL.localizationStatus,
  nextPermanentQl: TSD_CP008_ENGLISH_FREEZE_APPROVAL.nextPermanentQl,
}, null, 2));
