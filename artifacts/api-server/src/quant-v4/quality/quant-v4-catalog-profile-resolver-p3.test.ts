import assert from "node:assert/strict";

import {
  QUANT_V4_CATALOG_EXAM_CODE_PROFILE_MAP,
  QUANT_V4_CATALOG_PROFILE_RESOLVER_AUTHORITY,
  resolveQuantV4CatalogExamProfile,
} from "./quant-v4-catalog-profile-resolver-p3";

function identity(examCode: string, familyName: string) {
  return {
    publicationId: "publication-1",
    testId: "test-1",
    testVersionId: "test-version-1",
    testPublicCode: "test-public-code",
    testTitle: "test-title",
    examCode,
    examName: examCode,
    examFamilyCode: familyName,
    examFamilyName: familyName,
  };
}

assert.deepEqual(QUANT_V4_CATALOG_EXAM_CODE_PROFILE_MAP, {
  SSC_CGL_T1: "SSC_CGL_TIER_I",
  SSC_CHSL_T1: "SSC_CGL_CHSL",
  IBPS_PO_PRE: "BANKING_PRELIMS",
  IBPS_CLERK_PRE: "BANKING_PRELIMS",
  PUNJAB_PSSSB_CLERK: "PUNJAB_STATE",
  PUNJAB_EXCISE_INSP: "PUNJAB_STATE",
});

for (const [examCode, familyName, expectedProfile] of [
  ["SSC_CGL_T1", "SSC", "SSC_CGL_TIER_I"],
  ["SSC_CHSL_T1", "SSC", "SSC_CGL_CHSL"],
  ["IBPS_PO_PRE", "Banking", "BANKING_PRELIMS"],
  ["IBPS_CLERK_PRE", "Banking", "BANKING_PRELIMS"],
  ["PUNJAB_PSSSB_CLERK", "Punjab State", "PUNJAB_STATE"],
  ["PUNJAB_EXCISE_INSP", "Punjab State", "PUNJAB_STATE"],
] as const) {
  const result = resolveQuantV4CatalogExamProfile(identity(examCode, familyName));
  assert.equal(result.examProfile, expectedProfile, `${examCode} mapping drifted.`);
  assert.equal(result.authority, QUANT_V4_CATALOG_PROFILE_RESOLVER_AUTHORITY);
}

for (const [examCode, familyName] of [
  ["SSC_MTS", "SSC"],
  ["RRB_NTPC_CBT1", "Railway"],
  ["RRB_GROUP_D", "Railway"],
  ["UNKNOWN", "SSC"],
] as const) {
  assert.equal(
    resolveQuantV4CatalogExamProfile(identity(examCode, familyName)).examProfile,
    null,
    `${examCode} must remain unresolved until Quant adopts a matching profile.`,
  );
}

assert.equal(
  resolveQuantV4CatalogExamProfile(identity("SSC_CGL_T1", "Banking")).examProfile,
  null,
  "Family mismatch must fail closed.",
);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CATALOG_PROFILE_RESOLVER_P3",
  authority: QUANT_V4_CATALOG_PROFILE_RESOLVER_AUTHORITY,
  mappedCodes: Object.keys(QUANT_V4_CATALOG_EXAM_CODE_PROFILE_MAP),
  unmappedCodesFailClosed: true,
  familyMismatchFailsClosed: true,
}));
