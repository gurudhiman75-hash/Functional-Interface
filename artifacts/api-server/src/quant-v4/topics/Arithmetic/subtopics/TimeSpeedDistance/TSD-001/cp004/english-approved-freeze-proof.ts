import { TSD_CP003_HI_PA_FREEZE_STATUS } from "../cp003/localization/native-approved-freeze";
import { generateCp004ReviewQuestions } from "./runtime-engine";
import {
  TSD_CP004_APPROVED_ENGLISH_FROZEN_60Q,
  TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD,
  TSD_CP004_ENGLISH_FREEZE_ID,
  TSD_CP004_ENGLISH_FREEZE_STATUS,
  TSD_CP004_PRODUCT_OWNER_APPROVAL_RECORDED,
} from "./english-approved-freeze";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, child) => typeof child === "bigint" ? `${child}n` : child);
}

const source = generateCp004ReviewQuestions(6);
const frozen = TSD_CP004_APPROVED_ENGLISH_FROZEN_60Q;

assert(TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD === "99b65d54c87bfe456182bbcbad5963d30579952c", "approved CP004 source head changed");
assert(TSD_CP004_ENGLISH_FREEZE_ID === "TSD-CP-004-EN-v1-frozen", "unexpected CP004 freeze id");
assert(TSD_CP004_ENGLISH_FREEZE_STATUS === "APPROVED_ENGLISH_FROZEN", "unexpected CP004 freeze status");
assert(TSD_CP004_PRODUCT_OWNER_APPROVAL_RECORDED, "product-owner approval not recorded");
assert(source.length === 60 && frozen.length === 60, "CP004 English freeze must contain exactly 60 rows");
assert(TSD_CP003_HI_PA_FREEZE_STATUS === "APPROVED_NATIVE_FROZEN", "CP003 multilingual freeze boundary changed");

const identityFields = [
  "chapterId",
  "checkpointId",
  "authorityKey",
  "permanentQlId",
  "solveMode",
  "representation",
  "context",
  "language",
  "seed",
  "difficulty",
  "stem",
  "input",
  "solution",
  "answerText",
  "options",
  "correctIndex",
  "internalOptionAudit",
  "explanation",
  "mathematicalFingerprint",
] as const;

for (let index = 0; index < source.length; index += 1) {
  const before = source[index]!;
  const after = frozen[index]!;
  for (const field of identityFields) {
    assert(stable(before[field]) === stable(after[field]), `CP004 frozen row ${index + 1}: ${field} changed from approved source`);
  }
  assert(after.lifecycle.reviewStatus === "APPROVED_ENGLISH_FROZEN", `CP004 frozen row ${index + 1}: review status not frozen`);
  assert(after.lifecycle.englishFreezeStatus === "FROZEN", `CP004 frozen row ${index + 1}: English freeze status not frozen`);
  assert(after.lifecycle.productOwnerApprovalRecorded === true, `CP004 frozen row ${index + 1}: approval marker missing`);
  assert(!after.lifecycle.questionStudioEnabled, `CP004 frozen row ${index + 1}: Question Studio unlocked`);
  assert(after.lifecycle.questionBankStatus === "NOT_STORED", `CP004 frozen row ${index + 1}: Question Bank unlocked`);
  assert(after.lifecycle.testEligibility === "INELIGIBLE", `CP004 frozen row ${index + 1}: test eligibility unlocked`);
  assert(!after.lifecycle.publiclyPublishable, `CP004 frozen row ${index + 1}: public publication unlocked`);
}

assert(new Set(frozen.map((row) => row.permanentQlId)).size === 10, "CP004 freeze must preserve ten QLs");
assert(new Set(frozen.map((row) => row.stem)).size === 60, "CP004 frozen stems must remain unique");
assert(new Set(frozen.map((row) => row.mathematicalFingerprint)).size === 60, "CP004 frozen mathematical fingerprints must remain unique");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP004_APPROVED_ENGLISH_FREEZE",
  freezeId: TSD_CP004_ENGLISH_FREEZE_ID,
  approvedSourceHead: TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD,
  productOwnerApprovalRecorded: TSD_CP004_PRODUCT_OWNER_APPROVAL_RECORDED,
  frozenRows: frozen.length,
  permanentQlRange: "TSD-QL-048..TSD-QL-057",
  learnerContentIdentityChecks: frozen.length * identityFields.length,
  cp003MultilingualFreezePreserved: true,
  englishFreezeStatus: "FROZEN",
  hindiPunjabiLocalization: "LOCKED_PENDING_SEPARATE_REVIEW",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
