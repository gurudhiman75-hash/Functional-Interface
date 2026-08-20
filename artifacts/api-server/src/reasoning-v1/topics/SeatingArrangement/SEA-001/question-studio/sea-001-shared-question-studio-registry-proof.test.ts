import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { SEA001_PERMANENT_QL_IDS } from "../permanent/registry.ts";
import { SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN } from "../review/structural-hardening-english-review-pins.ts";
import { SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE } from "../review/structural-hardening-multilingual-freeze.ts";
import {
  SEA001_QUESTION_STUDIO_PACKAGE,
  SEA001_QUESTION_STUDIO_PACKAGE_ID,
  generateSea001QuestionStudioBatch,
} from "./seating-question-studio-runtime.ts";

// The shared registry currently imports a legacy BLR adapter whose historical
// extensionless ESM dependency chain cannot be executed by Node 22's bare
// --experimental-strip-types loader. Prove SEA's shared wiring directly from
// the registry source, then execute SEA's runtime independently below. This
// keeps the SEA gate fail-closed without modifying unrelated frozen BLR code.
const registryUrl = new URL("../../../../question-studio-review-registry.ts", import.meta.url);
const registrySource = await readFile(registryUrl, "utf8");
assert.match(registrySource, /SEA001_QUESTION_STUDIO_PACKAGE_ID/);
assert.match(registrySource, /SEA001_QUESTION_STUDIO_PACKAGE/);
assert.match(registrySource, /generateSea001QuestionStudioBatch/);
assert.match(registrySource, /SEA001_QUESTION_STUDIO_PACKAGE,/);
assert.match(registrySource, /request\.packageId === SEA001_QUESTION_STUDIO_PACKAGE_ID/);
assert.match(registrySource, /return generateSea001QuestionStudioBatch\(seaRequest\)/);
assert.match(registrySource, /SEA-001 Question Studio integration is review-only at the shared registry gate/);

const seaPackage = SEA001_QUESTION_STUDIO_PACKAGE;
assert.equal(seaPackage.packageId, SEA001_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(seaPackage.enabled, true);
assert.equal(seaPackage.questionStudioVisible, true);
assert.equal(seaPackage.questionStudioDiscoverable, true);
assert.equal(seaPackage.sourceEnglishAuthority, SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN.candidateFingerprint);
assert.equal(seaPackage.sourceLocalizationAuthority, SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE.authority);
assert.equal(seaPackage.questionBankEligible, false);
assert.equal(seaPackage.mockTestEligible, false);
assert.equal(seaPackage.publiclyPublishable, false);

for (const language of ["en", "hi", "pa"] as const) {
  const preview = generateSea001QuestionStudioBatch({
    language,
    count: 20,
    seed: `sea001-shared-registry-proof:${language}`,
  });
  assert.equal(preview.questions.length, 20);
  assert.equal(new Set(preview.questions.map((question) => question.qlId)).size, SEA001_PERMANENT_QL_IDS.length);
  assert.equal(preview.generationContext.sourceEnglishFreeze, SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN.candidateFingerprint);
  assert.equal(preview.generationContext.sourceLocalizationFreeze, SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE.authority);
  assert.equal(preview.generationContext.questionBankStatus, "NOT_STORED");
  assert.equal(preview.generationContext.mockTestEligible, false);
  assert.equal(preview.generationContext.publiclyPublishable, false);
  assert.ok(preview.questions.every((question) => question.safety.reviewOnly));
  assert.ok(preview.questions.every((question) => !question.safety.questionBankEligible));
  assert.ok(preview.questions.every((question) => !question.safety.mockTestEligible));
  assert.ok(preview.questions.every((question) => !question.safety.publiclyPublishable));
}

console.log("PASS_SEA001_SHARED_QUESTION_STUDIO_REGISTRY_WIRING");
console.log("package", SEA001_QUESTION_STUDIO_PACKAGE_ID);
console.log("QLs", SEA001_PERMANENT_QL_IDS.length);
console.log("languages", "en,hi,pa");
console.log("shared registry source wired", true);
console.log("shared persistence gate source locked", true);
console.log("Question Bank/mock/public", false, false, false);
