import assert from "node:assert/strict";

import { listReasoningV1QuestionStudioReviewPackages } from "../../../question-studio-review-registry";
import { RNK_CP001_PERMANENT_QL_IDS } from "./RNK-CP-001/cp001-permanent-runtime";
import { RNK_CP002_PERMANENT_QL_IDS } from "./RNK-CP-002/cp002-permanent-runtime";
import { RNK_CP003_PERMANENT_QL_IDS } from "./RNK-CP-003/cp003-permanent-runtime";
import {
  RNK_CP004_EXPECTED_PROJECTION_SHA256,
  RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS,
} from "./RNK-CP-004/cp004-permanent-runtime-v1";
import {
  RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256,
  RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS,
} from "./RNK-CP-005/cp005-permanent-runtime-v1";
import {
  RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256,
  RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS,
} from "./RNK-CP-006/cp006-permanent-runtime-v1";
import {
  RNK_CP007_EXPECTED_PERMANENT_PROJECTION_SHA256,
  RNK_CP007_PERMANENT_QL_ID,
} from "./RNK-CP-007/cp007-permanent-runtime-v1";
import {
  RNK_CP008_LIFECYCLE,
  RNK_CP008_NEXT_AVAILABLE_QL,
  RNK_CP008_PERMANENT_QLS_ALLOCATED,
} from "./RNK-CP-008/cp008-adapter-caselet-closure-v1";
import { RNK_CP008_ADAPTER_CASELET_CLOSURE_V1_1 } from "./RNK-CP-008/cp008-adapter-caselet-closure-v1_1";

const cp004 = RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId);
const cp005 = RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId);
const cp006 = RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId);

const permanentQlIds = [
  ...RNK_CP001_PERMANENT_QL_IDS,
  ...RNK_CP002_PERMANENT_QL_IDS,
  ...RNK_CP003_PERMANENT_QL_IDS,
  ...cp004,
  ...cp005,
  ...cp006,
  RNK_CP007_PERMANENT_QL_ID,
];

const expectedQlIds = Array.from(
  { length: 42 },
  (_, index) => `RNK-QL-${String(index + 1).padStart(3, "0")}`,
);

assert.deepEqual(RNK_CP001_PERMANENT_QL_IDS, expectedQlIds.slice(0, 9));
assert.deepEqual(RNK_CP002_PERMANENT_QL_IDS, expectedQlIds.slice(9, 17));
assert.deepEqual(RNK_CP003_PERMANENT_QL_IDS, expectedQlIds.slice(17, 26));
assert.deepEqual(cp004, expectedQlIds.slice(26, 35));
assert.deepEqual(cp005, expectedQlIds.slice(35, 38));
assert.deepEqual(cp006, expectedQlIds.slice(38, 41));
assert.equal(RNK_CP007_PERMANENT_QL_ID, "RNK-QL-042");
assert.equal(permanentQlIds.length, 42);
assert.equal(new Set(permanentQlIds).size, 42);
assert.deepEqual(permanentQlIds, expectedQlIds);

assert.equal(RNK_CP004_EXPECTED_PROJECTION_SHA256, "39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f");
assert.equal(RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256, "f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717");
assert.equal(RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256, "7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819");
assert.equal(RNK_CP007_EXPECTED_PERMANENT_PROJECTION_SHA256, "44aefb019c1a55308b58f4b285b1b6f7df97dea0185652d6de73e2dafbbd446b");

assert.equal(RNK_CP008_ADAPTER_CASELET_CLOSURE_V1_1, "RNK_CP008_ADAPTER_CASELET_CLOSURE_V1_1");
assert.equal(RNK_CP008_PERMANENT_QLS_ALLOCATED, 0);
assert.equal(RNK_CP008_NEXT_AVAILABLE_QL, "RNK-QL-043");
assert.equal(RNK_CP008_LIFECYCLE.questionStudio, "DISABLED");
assert.equal(RNK_CP008_LIFECYCLE.persistence, "DISABLED");
assert.equal(RNK_CP008_LIFECYCLE.questionBank, "NOT_STORED");
assert.equal(RNK_CP008_LIFECYCLE.testEligibility, "INELIGIBLE");
assert.equal(RNK_CP008_LIFECYCLE.publiclyPublishable, false);
assert.equal(RNK_CP008_LIFECYCLE.hindiPunjabi, "NOT_STARTED");

const liveReviewPackages = listReasoningV1QuestionStudioReviewPackages();
const rnkReviewPackage = liveReviewPackages.find((entry) => entry.packageId === "RNK-001") as any;
assert.ok(rnkReviewPackage, "RNK-001 must be registered only after the separate Question Studio lifecycle transition");
assert.equal(rnkReviewPackage.reviewOnly, true);
assert.deepEqual(rnkReviewPackage.supportedLanguages, ["en"]);
assert.equal(rnkReviewPackage.permanentQlCount, 42);
assert.equal(rnkReviewPackage.questionBankStatus, "NOT_STORED");
assert.equal(rnkReviewPackage.questionBankWritable, false);
assert.equal(rnkReviewPackage.testEligible, false);
assert.equal(rnkReviewPackage.mockTestEligible, false);
assert.equal(rnkReviewPackage.publiclyPublishable, false);
assert.equal(rnkReviewPackage.englishOnlyUntilMultilingualConsolidation, true);

console.log(JSON.stringify({
  status: "PASS",
  freezeVersion: "RNK_001_CHAPTER_WIDE_ENGLISH_CONTENT_FREEZE_V1",
  permanentQlRange: "RNK-QL-001..042",
  permanentQlCount: permanentQlIds.length,
  cp008PermanentQlsAllocated: RNK_CP008_PERMANENT_QLS_ALLOCATED,
  nextAvailableQl: RNK_CP008_NEXT_AVAILABLE_QL,
  chapterWideEnglishContentFreeze: true,
  multilingualProductFinalFreeze: false,
  questionStudio: "REGISTERED_REVIEW_ONLY_ENGLISH",
  questionBankStatus: rnkReviewPackage.questionBankStatus,
  publicPublication: rnkReviewPackage.publiclyPublishable,
}, null, 2));
