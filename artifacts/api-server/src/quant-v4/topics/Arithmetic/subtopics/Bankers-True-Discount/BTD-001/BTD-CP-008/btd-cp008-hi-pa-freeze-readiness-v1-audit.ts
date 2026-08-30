import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { BTD_CP007_LANGUAGES_V4 } from "../BTD-CP-007/btd-cp007-hi-pa-localization-v4";
import { buildBtdLocalizedQuestionV5 } from "../BTD-CP-007/btd-cp007-hi-pa-localization-v5";
import {
  BTD_CP008_HI_PA_FREEZE_READINESS_BOUNDARY,
  BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1,
  BTD_CP008_HI_PA_FREEZE_READINESS_VERSION,
  btdCp008HiPaContentFingerprint,
  btdCp008HiPaLearnerPayload,
  buildBtdHiPaFreezeReadinessCandidateV1,
} from "./btd-cp008-hi-pa-freeze-readiness-v1";

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

assert.equal(BTD_CP008_HI_PA_FREEZE_READINESS_VERSION, "BTD-001-CP008-HI-PA-FREEZE-READINESS-v1");
assert.equal(BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.qlCount, 20);
assert.equal(BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.canonicalQuestionCount, 4000);
assert.equal(BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.reviewQuestionCount, 120);
assert.equal(BTD_CP008_HI_PA_FREEZE_READINESS_BOUNDARY.readinessStatus, "READY_FOR_EXPLICIT_FREEZE_APPROVAL");
assert.equal(BTD_CP008_HI_PA_FREEZE_READINESS_BOUNDARY.multilingualFreezeApproved, false);
assert.equal(BTD_CP008_HI_PA_FREEZE_READINESS_BOUNDARY.multilingualFrozen, false);
assert.equal(BTD_CP008_HI_PA_FREEZE_READINESS_BOUNDARY.questionStudioDiscoverable, false);
assert.equal(BTD_CP008_HI_PA_FREEZE_READINESS_BOUNDARY.questionStudioGenerationEnabled, false);
assert.equal(BTD_CP008_HI_PA_FREEZE_READINESS_BOUNDARY.questionBankWritable, false);
assert.equal(BTD_CP008_HI_PA_FREEZE_READINESS_BOUNDARY.publiclyPublishable, false);

let learnerEqualityChecks = 0;
let fingerprintChecks = 0;
let deterministicReplayChecks = 0;
let lifecycleChecks = 0;
let jsonChecks = 0;
const chapterPayload: unknown[] = [];
const perQlLanguageObserved: Record<string, string> = {};
const reviewSamples = new Map<string, unknown>();

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (const language of BTD_CP007_LANGUAGES_V4) {
    const scopePayload: unknown[] = [];
    for (let index = 0; index < BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.seedsPerQlPerLanguage; index += 1) {
      const seed = `btd-cp007-${language}:${entry.qlId}:${String(index + 1).padStart(3, "0")}`;
      const reviewed = buildBtdLocalizedQuestionV5(entry.qlId, seed, language) as any;
      const candidate = buildBtdHiPaFreezeReadinessCandidateV1(entry.qlId, seed, language) as any;
      const replay = buildBtdHiPaFreezeReadinessCandidateV1(entry.qlId, seed, language) as any;

      const reviewedLearner = btdCp008HiPaLearnerPayload(reviewed);
      const candidateLearner = btdCp008HiPaLearnerPayload(candidate);
      assert.deepEqual(candidateLearner, reviewedLearner, `${entry.qlId}/${language}/${seed}: readiness layer changed reviewed learner content`);
      learnerEqualityChecks += 1;

      assert.equal(candidate.readinessFingerprint, btdCp008HiPaContentFingerprint(reviewed));
      assert.equal(candidate.readinessFingerprint, btdCp008HiPaContentFingerprint(candidate));
      assert.match(candidate.readinessFingerprint, /^[0-9a-f]{64}$/u);
      fingerprintChecks += 3;

      assert.deepEqual(replay, candidate, `${entry.qlId}/${language}/${seed}: readiness candidate replay drift`);
      deterministicReplayChecks += 1;

      assert.equal(reviewed.lifecycle.multilingualFrozen, false);
      assert.equal(reviewed.lifecycle.questionStudioDiscoverable, false);
      assert.equal(reviewed.lifecycle.questionStudioGenerationEnabled, false);
      assert.equal(candidate.lifecycle.readinessStatus, "READY_FOR_EXPLICIT_FREEZE_APPROVAL");
      assert.equal(candidate.lifecycle.multilingualFreezeApproved, false);
      assert.equal(candidate.lifecycle.multilingualFrozen, false);
      assert.equal(candidate.lifecycle.questionStudioDiscoverable, false);
      assert.equal(candidate.lifecycle.questionStudioGenerationEnabled, false);
      assert.equal(candidate.lifecycle.questionBankWritable, false);
      assert.equal(candidate.lifecycle.testEligible, false);
      assert.equal(candidate.lifecycle.mockTestEligible, false);
      assert.equal(candidate.lifecycle.publiclyPublishable, false);
      lifecycleChecks += 12;

      const serialized = JSON.stringify(candidate);
      assert.ok(serialized.length > 100);
      assert.equal(JSON.stringify(JSON.parse(serialized)), serialized);
      jsonChecks += 2;

      scopePayload.push(candidateLearner);
      chapterPayload.push(candidateLearner);
      const family = familyKey(candidate.presentation.stemFamilyId);
      const reviewKey = `${entry.qlId}:${language}:T${family}`;
      if (!reviewSamples.has(reviewKey)) reviewSamples.set(reviewKey, candidateLearner);
    }
    const key = `${entry.qlId}:${language}`;
    const observed = sha256(scopePayload);
    perQlLanguageObserved[key] = observed;
    assert.equal(observed, (BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.perQlLanguage as Record<string, string>)[key], `${key}: 100-seed readiness fingerprint drift`);
  }
}

assert.equal(chapterPayload.length, BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.canonicalQuestionCount);
assert.equal(reviewSamples.size, BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.reviewQuestionCount);
const chapterFingerprint = sha256(chapterPayload);
assert.equal(chapterFingerprint, BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.chapterFingerprint, "chapter multilingual readiness fingerprint drift");

const orderedReviewPayload: unknown[] = [];
for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (const language of BTD_CP007_LANGUAGES_V4) {
    for (const family of ["1", "2", "3"]) {
      const payload = reviewSamples.get(`${entry.qlId}:${language}:T${family}`);
      assert.ok(payload, `${entry.qlId}/${language}/T${family}: missing review payload`);
      orderedReviewPayload.push(payload);
    }
  }
}
const reviewFingerprint = sha256(orderedReviewPayload);
assert.equal(reviewFingerprint, BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.reviewFingerprint, "120-question reviewed multilingual surface drift");

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP008-HI-PA-FREEZE-READINESS-AUDIT-v1",
  readinessVersion: BTD_CP008_HI_PA_FREEZE_READINESS_VERSION,
  sourceReviewHead: BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.sourceReviewHead,
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  languages: BTD_CP007_LANGUAGES_V4,
  seedsPerQlPerLanguage: BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.seedsPerQlPerLanguage,
  canonicalQuestionsReproved: chapterPayload.length,
  reviewQuestionsReproved: orderedReviewPayload.length,
  learnerEqualityChecks,
  fingerprintChecks,
  deterministicReplayChecks,
  lifecycleChecks,
  jsonChecks,
  chapterFingerprint,
  reviewFingerprint,
  perQlLanguageObserved,
  readinessStatus: BTD_CP008_HI_PA_FREEZE_READINESS_BOUNDARY.readinessStatus,
  multilingualFreezeApproved: false,
  multilingualFrozen: false,
  questionStudioDiscoverable: false,
  downstreamDeliveryOpened: false,
}, null, 2));
console.log("PASS_BTD_001_CP008_HI_PA_FREEZE_READINESS_AUDIT_V1");
