import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { BTD_CP007_LANGUAGES_V4 } from "../BTD-CP-007/btd-cp007-hi-pa-localization-v4";
import {
  BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1,
  btdCp008HiPaLearnerPayload,
  buildBtdHiPaFreezeReadinessCandidateV1,
} from "../BTD-CP-008/btd-cp008-hi-pa-freeze-readiness-v1";
import {
  BTD_CP009_HI_PA_FREEZE_BOUNDARY,
  BTD_CP009_HI_PA_FREEZE_MANIFEST_V1,
  BTD_CP009_HI_PA_FREEZE_VERSION,
  btdCp009HiPaContentFingerprint,
  btdCp009HiPaLearnerPayload,
  buildBtdFrozenHiPaQuestionV1,
} from "./btd-cp009-hi-pa-freeze-v1";

function jsonNative<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
function sha256(value: unknown): string { return createHash("sha256").update(canonicalJson(jsonNative(value))).digest("hex"); }
function familyKey(stemFamilyId: string) {
  const match = stemFamilyId.match(/(?:T|STEM-)([123])-(HI|PA)$/u);
  assert.ok(match, `unexpected localized stem family ${stemFamilyId}`);
  return match![1]!;
}

assert.equal(BTD_CP009_HI_PA_FREEZE_VERSION, "BTD-001-CP009-HI-PA-FREEZE-v1");
assert.equal(BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.approvalAuthority, "EXPLICIT_OPERATOR_APPROVAL");
assert.equal(BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.approvalRecorded, true);
assert.equal(BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.readinessAuthorityHead, "d3abc619ac80788138b7aa0f30244ae0b92ea037");
assert.equal(BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.qlCount, 20);
assert.equal(BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.canonicalQuestionCount, 4000);
assert.equal(BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.reviewQuestionCount, 120);
assert.equal(BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.chapterFingerprint, BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.chapterFingerprint);
assert.equal(BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.reviewFingerprint, BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.reviewFingerprint);
assert.deepEqual(BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.perQlLanguage, BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.perQlLanguage);

assert.equal(BTD_CP009_HI_PA_FREEZE_BOUNDARY.multilingualFreezeApproved, true);
assert.equal(BTD_CP009_HI_PA_FREEZE_BOUNDARY.multilingualFrozen, true);
assert.equal(BTD_CP009_HI_PA_FREEZE_BOUNDARY.contentFreezeStatus, "FROZEN_HI_PA");
assert.deepEqual(BTD_CP009_HI_PA_FREEZE_BOUNDARY.frozenLanguages, ["hi", "pa"]);
assert.equal(BTD_CP009_HI_PA_FREEZE_BOUNDARY.questionStudioDiscoverable, false);
assert.equal(BTD_CP009_HI_PA_FREEZE_BOUNDARY.questionStudioGenerationEnabled, false);
assert.equal(BTD_CP009_HI_PA_FREEZE_BOUNDARY.questionBankWritable, false);
assert.equal(BTD_CP009_HI_PA_FREEZE_BOUNDARY.testEligible, false);
assert.equal(BTD_CP009_HI_PA_FREEZE_BOUNDARY.mockTestEligible, false);
assert.equal(BTD_CP009_HI_PA_FREEZE_BOUNDARY.publiclyPublishable, false);

let learnerEqualityChecks = 0;
let fingerprintChecks = 0;
let deterministicReplayChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let jsonChecks = 0;
const chapterPayload: unknown[] = [];
const perQlLanguageObserved: Record<string, string> = {};
const reviewSamples = new Map<string, unknown>();

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (const language of BTD_CP007_LANGUAGES_V4) {
    const scopePayload: unknown[] = [];
    for (let index = 0; index < BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.seedsPerQlPerLanguage; index += 1) {
      const seed = `btd-cp007-${language}:${entry.qlId}:${String(index + 1).padStart(3, "0")}`;
      const readiness = buildBtdHiPaFreezeReadinessCandidateV1(entry.qlId, seed, language) as any;
      const frozen = buildBtdFrozenHiPaQuestionV1(entry.qlId, seed, language) as any;
      const replay = buildBtdFrozenHiPaQuestionV1(entry.qlId, seed, language) as any;

      const readinessLearner = btdCp008HiPaLearnerPayload(readiness);
      const frozenLearner = btdCp009HiPaLearnerPayload(frozen);
      assert.deepEqual(frozenLearner, readinessLearner, `${entry.qlId}/${language}/${seed}: freeze changed approved learner content`);
      learnerEqualityChecks += 1;

      assert.equal(frozen.contentFingerprint, btdCp009HiPaContentFingerprint(readiness));
      assert.equal(frozen.contentFingerprint, btdCp009HiPaContentFingerprint(frozen));
      assert.match(frozen.contentFingerprint, /^[0-9a-f]{64}$/u);
      fingerprintChecks += 3;

      assert.deepEqual(replay, frozen, `${entry.qlId}/${language}/${seed}: frozen package replay drift`);
      deterministicReplayChecks += 1;

      assert.equal(frozen.chapterId, "BTD-001");
      assert.equal(frozen.checkpointId, "BTD-CP-009");
      assert.equal(frozen.qlId, entry.qlId);
      assert.equal(frozen.language, language);
      assert.equal(frozen.freezeVersion, BTD_CP009_HI_PA_FREEZE_VERSION);
      assert.equal(frozen.lifecycle.permanentQlAllocated, true);
      assert.equal(frozen.lifecycle.multilingualFreezeApproved, true);
      assert.equal(frozen.lifecycle.multilingualFrozen, true);
      assert.equal(frozen.lifecycle.contentFreezeStatus, "FROZEN_HI_PA");
      assert.deepEqual(frozen.lifecycle.frozenLanguages, ["hi", "pa"]);
      assert.equal(frozen.lifecycle.questionStudioDiscoverable, false);
      assert.equal(frozen.lifecycle.questionStudioGenerationEnabled, false);
      assert.equal(frozen.lifecycle.questionBankWritable, false);
      assert.equal(frozen.lifecycle.testEligible, false);
      assert.equal(frozen.lifecycle.mockTestEligible, false);
      assert.equal(frozen.lifecycle.publiclyPublishable, false);
      lifecycleChecks += 16;

      assert.equal(Object.isFrozen(frozen), true);
      assert.equal(Object.isFrozen(frozen.presentation), true);
      assert.equal(Object.isFrozen(frozen.options), true);
      assert.equal(Object.isFrozen(frozen.explanation), true);
      assert.equal(Object.isFrozen(frozen.lifecycle), true);
      assert.equal(Object.isFrozen(frozen.lifecycle.frozenLanguages), true);
      deepFreezeChecks += 6;

      const serialized = JSON.stringify(frozen);
      assert.ok(serialized.length > 100);
      assert.equal(JSON.stringify(JSON.parse(serialized)), serialized);
      jsonChecks += 2;

      scopePayload.push(frozenLearner);
      chapterPayload.push(frozenLearner);
      const family = familyKey(frozen.presentation.stemFamilyId);
      const reviewKey = `${entry.qlId}:${language}:T${family}`;
      if (!reviewSamples.has(reviewKey)) reviewSamples.set(reviewKey, frozenLearner);
    }
    const key = `${entry.qlId}:${language}`;
    const observed = sha256(scopePayload);
    perQlLanguageObserved[key] = observed;
    assert.equal(observed, (BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.perQlLanguage as Record<string, string>)[key], `${key}: frozen 100-seed fingerprint drift`);
  }
}

assert.equal(chapterPayload.length, BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.canonicalQuestionCount);
assert.equal(reviewSamples.size, BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.reviewQuestionCount);
const chapterFingerprint = sha256(chapterPayload);
assert.equal(chapterFingerprint, BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.chapterFingerprint, "frozen chapter fingerprint drift");

const orderedReviewPayload: unknown[] = [];
for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (const language of BTD_CP007_LANGUAGES_V4) {
    for (const family of ["1", "2", "3"]) {
      const payload = reviewSamples.get(`${entry.qlId}:${language}:T${family}`);
      assert.ok(payload, `${entry.qlId}/${language}/T${family}: missing frozen review payload`);
      orderedReviewPayload.push(payload);
    }
  }
}
const reviewFingerprint = sha256(orderedReviewPayload);
assert.equal(reviewFingerprint, BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.reviewFingerprint, "frozen 120-question review surface drift");

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP009-HI-PA-FREEZE-AUDIT-v1",
  freezeVersion: BTD_CP009_HI_PA_FREEZE_VERSION,
  readinessAuthorityHead: BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.readinessAuthorityHead,
  approvalAuthority: BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.approvalAuthority,
  approvalRecorded: BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.approvalRecorded,
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  languages: BTD_CP007_LANGUAGES_V4,
  seedsPerQlPerLanguage: BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.seedsPerQlPerLanguage,
  canonicalQuestionsFrozen: chapterPayload.length,
  reviewQuestionsFrozen: orderedReviewPayload.length,
  learnerEqualityChecks,
  fingerprintChecks,
  deterministicReplayChecks,
  lifecycleChecks,
  deepFreezeChecks,
  jsonChecks,
  chapterFingerprint,
  reviewFingerprint,
  perQlLanguageObserved,
  contentFreezeStatus: BTD_CP009_HI_PA_FREEZE_BOUNDARY.contentFreezeStatus,
  multilingualFreezeApproved: true,
  multilingualFrozen: true,
  questionStudioDiscoverable: false,
  questionStudioGenerationEnabled: false,
  downstreamDeliveryOpened: false,
}, null, 2));
console.log("PASS_BTD_001_CP009_HI_PA_FREEZE_AUDIT_V1");
