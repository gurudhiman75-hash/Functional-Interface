import { TSD_CP009_ENGLISH_STEM_POLISH } from "./english-authoring-final";
import { TSD_CP009_ENGLISH_FREEZE_APPROVAL, TSD_CP009_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { TSD_CP009_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-009 English freeze proof failed: ${message}`);
}

assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.status === "PRODUCT_OWNER_APPROVED_ENGLISH_FREEZE", "approval status changed");
assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.approvedOn === "2026-08-24", "approval date changed");
assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.approvedSourceHead === "cf35bec161c28cf06141393dc9d5cadc3394f97d", "approved source head changed");
assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.approvedQlCount === 11, "approved QL count changed");
assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.approvedQuestionFamilies === 66, "approved family count changed");
assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.editoriallyPolishedStems === 12, "polished-stem count changed");
assert(Object.keys(TSD_CP009_ENGLISH_STEM_POLISH).length === 12, "final polish overlay no longer has 12 stems");
assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.approvedDifficulty.EASY === 14, "approved Easy count changed");
assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.approvedDifficulty.MEDIUM === 52, "approved Medium count changed");
assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.approvedDifficulty.HARD === 0, "approved Hard count changed");
assert(TSD_CP009_FROZEN_ENGLISH_REGISTRY.length === 11, "frozen registry QL count changed");
assert(TSD_CP009_FROZEN_ENGLISH_REGISTRY.every((ql) => ql.editorialStatus === "FROZEN"), "one or more English QLs is not frozen");
assert(JSON.stringify(TSD_CP009_FROZEN_ENGLISH_REGISTRY.map((ql) => ql.qlId)) === JSON.stringify(TSD_CP009_PERMANENT_QL_IDS), "frozen QL order differs from allocation");
assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.localizationStatus === "IN_PROGRESS", "localization lifecycle changed");
assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.questionStudioEnabled === false, "Question Studio opened during English freeze");
assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.questionBankStatus === "NOT_STORED", "Question Bank opened during English freeze");
assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.testEligibility === "INELIGIBLE", "tests opened during English freeze");
assert(TSD_CP009_ENGLISH_FREEZE_APPROVAL.publiclyPublishable === false, "public publication opened during English freeze");

console.log("TSD-CP-009 ENGLISH FREEZE PROOF: PASS");
console.log(JSON.stringify({
  qls: 11,
  families: 66,
  polishedStems: 12,
  difficulty: TSD_CP009_ENGLISH_FREEZE_APPROVAL.approvedDifficulty,
  nextPermanentQl: TSD_CP009_ENGLISH_FREEZE_APPROVAL.nextPermanentQl,
  localization: TSD_CP009_ENGLISH_FREEZE_APPROVAL.localizationStatus,
}, null, 2));
