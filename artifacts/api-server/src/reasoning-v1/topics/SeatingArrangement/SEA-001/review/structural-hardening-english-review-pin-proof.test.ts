import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";

import { SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN as pin } from "./structural-hardening-english-review-pins.ts";

const outputDir = process.argv[2] ?? "/tmp/sea001-review";
const manifest = JSON.parse(await readFile(`${outputDir}/manifest.json`, "utf8")) as {
  candidateId: string;
  blueprintCoverage: Record<string, number>;
  caseletCount: number;
  childQuestionCount: number;
  candidateFingerprint: string;
  existingApprovedFingerprint: string;
  approvalStatus: string;
  replacesApprovedAuthority: boolean;
  productActivationAuthorized: boolean;
};

assert.equal(manifest.candidateId, pin.candidateId);
assert.equal(manifest.candidateFingerprint, pin.candidateFingerprint, "English review candidate drifted after pinning");
assert.equal(manifest.caseletCount, pin.caseletCount);
assert.equal(manifest.childQuestionCount, pin.childQuestionCount);
assert.deepEqual(manifest.blueprintCoverage, pin.blueprintCoverage);
assert.equal(manifest.existingApprovedFingerprint, pin.existingApprovedEnglishFingerprint);
assert.equal(manifest.approvalStatus, "PENDING_HUMAN_REVIEW");
assert.equal(manifest.replacesApprovedAuthority, false);
assert.equal(manifest.productActivationAuthorized, false);
assert.notEqual(manifest.candidateFingerprint, manifest.existingApprovedFingerprint);

console.log("PASS_SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN");
console.log("candidate", manifest.candidateId);
console.log("fingerprint", manifest.candidateFingerprint);
console.log("approval", manifest.approvalStatus);
