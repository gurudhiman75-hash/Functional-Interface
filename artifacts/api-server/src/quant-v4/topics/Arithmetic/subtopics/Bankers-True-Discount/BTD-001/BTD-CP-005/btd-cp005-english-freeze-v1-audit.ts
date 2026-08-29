import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { BTD_CP003_QL_IDS, buildBtdPermanentQuestionV1 } from "../BTD-CP-003/btd-cp003-permanent-generator-v1";
import { buildBtdCp004EnglishReviewCorpusV1 } from "../BTD-CP-004/btd-cp004-english-review-v1";
import {
  BTD_CP005_ENGLISH_FREEZE_BOUNDARY,
  BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1,
  BTD_CP005_ENGLISH_FREEZE_VERSION,
  btdCp005EnglishContentFingerprint,
  btdCp005EnglishLearnerPayload,
  buildBtdFrozenEnglishQuestionV1,
} from "./btd-cp005-english-freeze-v1";

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
function sha256(value: unknown): string { return createHash("sha256").update(canonicalJson(value)).digest("hex"); }

assert.equal(BTD_CP005_ENGLISH_FREEZE_VERSION, "BTD-001-CP005-ENGLISH-FREEZE-v1");
assert.equal(BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.qlCount, 20);
assert.equal(BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.canonicalQuestionCount, 4000);
assert.equal(BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.reviewQuestionCount, 60);
assert.equal(BTD_CP005_ENGLISH_FREEZE_BOUNDARY.contentFreezeStatus, "FROZEN_EN");
assert.equal(BTD_CP005_ENGLISH_FREEZE_BOUNDARY.contentFrozen, true);
assert.equal(BTD_CP005_ENGLISH_FREEZE_BOUNDARY.questionStudioDiscoverable, false);
assert.equal(BTD_CP005_ENGLISH_FREEZE_BOUNDARY.publiclyPublishable, false);
assert.equal(BTD_CP003_QL_IDS.length, BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.qlCount);

let learnerEqualityChecks = 0;
let fingerprintChecks = 0;
let deterministicReplayChecks = 0;
let lifecycleChecks = 0;
let nativeJsonChecks = 0;
const chapterPayload: unknown[] = [];
const perQlObserved: Record<string, string> = {};

for (const qlId of BTD_CP003_QL_IDS) {
  const qlPayload: unknown[] = [];
  for (let index = 0; index < BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.seedsPerQl; index += 1) {
    const seed = `btd-cp005-freeze-${String(index + 1).padStart(3, "0")}`;
    const reviewed = buildBtdPermanentQuestionV1(qlId, seed) as any;
    const frozen = buildBtdFrozenEnglishQuestionV1(qlId, seed) as any;
    const replay = buildBtdFrozenEnglishQuestionV1(qlId, seed) as any;

    const reviewedLearner = btdCp005EnglishLearnerPayload(reviewed);
    const frozenLearner = btdCp005EnglishLearnerPayload(frozen);
    assert.deepEqual(frozenLearner, reviewedLearner, `${qlId}/${seed}: frozen learner content drifted from reviewed authority`);
    learnerEqualityChecks += 1;

    assert.equal(frozen.contentFingerprint, btdCp005EnglishContentFingerprint(frozen), `${qlId}/${seed}: per-question content fingerprint drift`);
    assert.equal(frozen.contentFingerprint, btdCp005EnglishContentFingerprint(reviewed), `${qlId}/${seed}: freeze fingerprint does not match reviewed content`);
    fingerprintChecks += 2;

    assert.deepEqual(replay, frozen, `${qlId}/${seed}: frozen generator is not deterministic`);
    deterministicReplayChecks += 1;

    assert.equal(frozen.chapterId, "BTD-001");
    assert.equal(frozen.checkpointId, "BTD-CP-005");
    assert.equal(frozen.qlId, qlId);
    assert.equal(frozen.language, "en");
    assert.equal(frozen.freezeVersion, BTD_CP005_ENGLISH_FREEZE_VERSION);
    assert.equal(frozen.lifecycle.permanentQlAllocated, true);
    assert.equal(frozen.lifecycle.productionAuthorityFrozen, true);
    assert.equal(frozen.lifecycle.contentFreezeStatus, "FROZEN_EN");
    assert.equal(frozen.lifecycle.contentFrozen, true);
    assert.equal(frozen.lifecycle.frozenLanguage, "en");
    assert.equal(frozen.lifecycle.questionStudioDiscoverable, false);
    assert.equal(frozen.lifecycle.questionBankWritable, false);
    assert.equal(frozen.lifecycle.testEligible, false);
    assert.equal(frozen.lifecycle.mockTestEligible, false);
    assert.equal(frozen.lifecycle.publiclyPublishable, false);
    lifecycleChecks += 14;

    const serialized = JSON.stringify(frozen);
    assert.ok(serialized.length > 100, `${qlId}/${seed}: frozen package unexpectedly small`);
    assert.equal(JSON.stringify(JSON.parse(serialized)), serialized, `${qlId}/${seed}: frozen package is not native-JSON round-trip stable`);
    nativeJsonChecks += 2;

    qlPayload.push(frozenLearner);
    chapterPayload.push(frozenLearner);
  }
  const observed = sha256(qlPayload);
  perQlObserved[qlId] = observed;
  assert.equal(observed, BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.perQl[qlId], `${qlId}: frozen 200-seed authority fingerprint drift`);
}

const chapterFingerprint = sha256(chapterPayload);
assert.equal(chapterFingerprint, BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.chapterFingerprint, "chapter-level frozen English fingerprint drift");

const reviewPayload = buildBtdCp004EnglishReviewCorpusV1().map(btdCp005EnglishLearnerPayload);
const reviewFingerprint = sha256(reviewPayload);
assert.equal(reviewPayload.length, BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.reviewQuestionCount);
assert.equal(reviewFingerprint, BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.reviewFingerprint, "review corpus drifted after English freeze");

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP005-ENGLISH-FREEZE-AUDIT-v1",
  freezeVersion: BTD_CP005_ENGLISH_FREEZE_VERSION,
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-005",
  language: "en",
  permanentQlCount: BTD_CP003_QL_IDS.length,
  canonicalQuestionsReproved: chapterPayload.length,
  reviewQuestionsReproved: reviewPayload.length,
  learnerEqualityChecks,
  fingerprintChecks,
  deterministicReplayChecks,
  lifecycleChecks,
  nativeJsonChecks,
  chapterFingerprint,
  reviewFingerprint,
  perQlObserved,
  contentFreezeStatus: BTD_CP005_ENGLISH_FREEZE_BOUNDARY.contentFreezeStatus,
  contentFrozen: BTD_CP005_ENGLISH_FREEZE_BOUNDARY.contentFrozen,
  questionStudioDiscoverable: BTD_CP005_ENGLISH_FREEZE_BOUNDARY.questionStudioDiscoverable,
  downstreamDeliveryOpened: false,
}, null, 2));
console.log("PASS_BTD_001_CP005_ENGLISH_FREEZE_AUDIT_V1");
