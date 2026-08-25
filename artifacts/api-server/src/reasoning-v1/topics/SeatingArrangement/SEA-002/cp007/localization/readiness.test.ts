import assert from "node:assert/strict";

import { generateSea002Cp007ProductionCaselet } from "../production-caselet-v2.ts";
import {
  SEA002_CP007_GLOSSARY,
  SEA002_CP007_LOCALIZATION_PROTECTED_FIELDS,
  SEA002_CP007_LOCALIZATION_READINESS,
  SEA002_CP007_TRANSLATION_TARGET_LOCALES,
  assertCp007LocalizationReviewReady,
  cp007CanonicalParityFingerprint,
} from "./readiness.ts";
import { SEA002_CP007_PERMANENT_QL_REGISTRY } from "../permanent/registry.ts";

assert.deepEqual(SEA002_CP007_TRANSLATION_TARGET_LOCALES, ["hi-IN", "pa-IN"]);
assert.equal(SEA002_CP007_LOCALIZATION_READINESS.status, "V2_REVIEW_READY");
assert.equal(SEA002_CP007_LOCALIZATION_READINESS.languageFidelityPolicy, "GENDER_NEUTRAL_EXAM_WORDING_V2");
assert.equal(SEA002_CP007_LOCALIZATION_READINESS.humanLanguageReviewRequired, true);
assert.equal(SEA002_CP007_LOCALIZATION_READINESS.humanReviewStatus, "PENDING");
assert.equal(SEA002_CP007_LOCALIZATION_READINESS.productDeliveryUnlocked, false);
assert.equal(SEA002_CP007_LOCALIZATION_READINESS.questionStudioRegistered, false);
assert.equal(SEA002_CP007_LOCALIZATION_READINESS.questionBankWritable, false);
assert.equal(SEA002_CP007_LOCALIZATION_READINESS.productionStagingApproved, false);
assert.equal(SEA002_CP007_LOCALIZATION_READINESS.permanentQlCount, 4);
assert.equal(SEA002_CP007_PERMANENT_QL_REGISTRY.length, 4);
assert.ok(SEA002_CP007_GLOSSARY.length >= 15);
assert.ok(SEA002_CP007_GLOSSARY.every((entry) => !entry.hi.includes("/") && !entry.pa.includes("/")), "V2 glossary must not restore gender-slash wording");
assert.ok(SEA002_CP007_LOCALIZATION_PROTECTED_FIELDS.includes("mathematicalFingerprint"));
assert.ok(SEA002_CP007_LOCALIZATION_PROTECTED_FIELDS.includes("correctIndex"));
assert.ok(SEA002_CP007_PERMANENT_QL_REGISTRY.every((entry) => entry.englishReviewStatus === "CI_CERTIFIED_SELF_REVIEW_COMPLETE"));
assert.ok(SEA002_CP007_PERMANENT_QL_REGISTRY.every((entry) => entry.localizationStatus === "V2_REVIEW_READY_HUMAN_APPROVAL_PENDING"));
assert.ok(SEA002_CP007_PERMANENT_QL_REGISTRY.every((entry) => !entry.active && !entry.questionStudioDiscoverable && !entry.questionBankWritable));
assert.doesNotThrow(() => assertCp007LocalizationReviewReady());

const authorities = ["CP007-AUTH-01", "CP007-AUTH-02", "CP007-AUTH-03", "CP007-AUTH-04"] as const;
const fingerprints = new Set<string>();
for (const authority of authorities) {
  for (let sample = 0; sample < 6; sample += 1) {
    const width = authority === "CP007-AUTH-04" ? 4 + (sample % 3) : 3 + (sample % 4);
    const seed = `cp007-localization-readiness:${authority}:${sample}`;
    const first = generateSea002Cp007ProductionCaselet(seed, width, authority);
    const second = generateSea002Cp007ProductionCaselet(seed, width, authority);
    const firstFingerprint = cp007CanonicalParityFingerprint(first);
    const secondFingerprint = cp007CanonicalParityFingerprint(second);
    assert.equal(firstFingerprint, secondFingerprint, `${authority}: canonical parity fingerprint must be deterministic`);
    assert.equal(first.correctIndex, second.correctIndex);
    assert.equal(first.mathematicalFingerprint, second.mathematicalFingerprint);
    assert.ok(firstFingerprint.length > 20);
    fingerprints.add(firstFingerprint);
  }
}
assert.equal(fingerprints.size, 24, "review seeds should expose 24 distinct canonical parity projections");

console.log("PASS_SEA002_CP007_LOCALIZATION_READINESS_V2");
console.log("target locales", SEA002_CP007_TRANSLATION_TARGET_LOCALES.join(","));
console.log("permanent QLs", SEA002_CP007_PERMANENT_QL_REGISTRY.map((entry) => entry.permanentQlId).join(","));
console.log("canonical parity samples", fingerprints.size);
console.log("review status", SEA002_CP007_LOCALIZATION_READINESS.status);
console.log("human language review", SEA002_CP007_LOCALIZATION_READINESS.humanReviewStatus);
console.log("Studio/Bank/staging", false, false, false);
