import {
  TSD_CP009_FROZEN_HINDI_LOCALIZATION,
  TSD_CP009_FROZEN_PUNJABI_LOCALIZATION,
  TSD_CP009_LOCALIZATION_FREEZE_APPROVAL,
} from "./localization-freeze-registry";
import { TSD_CP009_PERMANENT_QL_IDS, TSD_CP009_NEXT_PERMANENT_QL } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-009 localization freeze proof failed: ${message}`);
}

assert(TSD_CP009_LOCALIZATION_FREEZE_APPROVAL.status === "PRODUCT_OWNER_APPROVED_LOCALIZATION_FREEZE", "approval status changed");
assert(TSD_CP009_LOCALIZATION_FREEZE_APPROVAL.approvedSourceHead === "57aef99dbf3e29c97fa2f22d287a82487e054adb", "approved native source head changed");
assert(TSD_CP009_LOCALIZATION_FREEZE_APPROVAL.approvedReviewWorkflowRun === 90, "approved review workflow changed");
assert(TSD_CP009_LOCALIZATION_FREEZE_APPROVAL.approvedReviewArtifactId === 9528838561, "approved review artifact changed");
assert(TSD_CP009_PERMANENT_QL_IDS.length === 11, "permanent QL count changed");
assert(TSD_CP009_NEXT_PERMANENT_QL === "TSD-QL-115", "next permanent QL changed");

for (const registry of [TSD_CP009_FROZEN_HINDI_LOCALIZATION, TSD_CP009_FROZEN_PUNJABI_LOCALIZATION]) {
  assert(registry.qls.length === 11, `${registry.locale}: QL count changed`);
  assert(registry.qls.flatMap((ql) => ql.families).length === 66, `${registry.locale}: family count changed`);
  assert(JSON.stringify(registry.qls.map((ql) => ql.qlId)) === JSON.stringify(TSD_CP009_PERMANENT_QL_IDS), `${registry.locale}: QL order changed`);
}

const hindi = JSON.stringify(TSD_CP009_FROZEN_HINDI_LOCALIZATION);
const punjabi = JSON.stringify(TSD_CP009_FROZEN_PUNJABI_LOCALIZATION);
for (const rejected of ["गश्ती", "वॉटर टैक्सी", "ड्रिफ्ट मार्कर", "लाइफबॉय", "मार्कर बुआ"]) {
  assert(!hindi.includes(rejected), `Hindi rejected wording '${rejected}' returned after freeze`);
}
for (const rejected of ["ਗਸ਼ਤੀ", "ਨਿਗਰਾਨੀ", "ਸਰਵੇ ਕਿਸ਼ਤੀ", "ਵਾਟਰ ਟੈਕਸੀ", "ਡ੍ਰਿਫਟ ਮਾਰਕਰ", "ਲਾਈਫਬੁਆਇ", "ਮਾਰਕਰ ਬੁਆਇ", "ਟ੍ਰੇਨਿੰਗ ਜਹਾਜ਼"]) {
  assert(!punjabi.includes(rejected), `Punjabi rejected wording '${rejected}' returned after freeze`);
}

console.log("TSD-CP-009 NATIVE LOCALIZATION FREEZE PROOF: PASS");
console.log(JSON.stringify({
  status: TSD_CP009_LOCALIZATION_FREEZE_APPROVAL.status,
  approvedOn: TSD_CP009_LOCALIZATION_FREEZE_APPROVAL.approvedOn,
  approvedSourceHead: TSD_CP009_LOCALIZATION_FREEZE_APPROVAL.approvedSourceHead,
  qls: 11,
  hindiFamilies: 66,
  punjabiFamilies: 66,
  questionStudio: TSD_CP009_LOCALIZATION_FREEZE_APPROVAL.questionStudio,
  questionBankStatus: TSD_CP009_LOCALIZATION_FREEZE_APPROVAL.questionBankStatus,
  testEligibility: TSD_CP009_LOCALIZATION_FREEZE_APPROVAL.testEligibility,
  publiclyPublishable: TSD_CP009_LOCALIZATION_FREEZE_APPROVAL.publiclyPublishable,
}, null, 2));
