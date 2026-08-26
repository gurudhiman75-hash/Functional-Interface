import assert from "node:assert/strict";

import "./english-review-v1.test.ts";
import {
  SEA002_CP008_ENGLISH_EDITORIAL_V2,
  SEA002_CP008_ENGLISH_REVIEW_SET_V2,
} from "./production-review-v2.ts";
import { SEA002_CP008_PERMANENT_QL_IDS } from "./permanent/registry.ts";

assert.equal(SEA002_CP008_ENGLISH_REVIEW_SET_V2.length, 42);
assert.equal(SEA002_CP008_ENGLISH_EDITORIAL_V2.canonicalSurfaceCount, 42);
assert.equal(SEA002_CP008_ENGLISH_EDITORIAL_V2.leadVariantCount, 6);
assert.equal(new Set(SEA002_CP008_ENGLISH_REVIEW_SET_V2.map((candidate) => candidate.stem)).size, 42);
assert.equal(new Set(SEA002_CP008_ENGLISH_REVIEW_SET_V2.map((candidate) => candidate.fingerprint)).size, 42);

for (const qlId of SEA002_CP008_PERMANENT_QL_IDS) {
  const group = SEA002_CP008_ENGLISH_REVIEW_SET_V2.filter((candidate) => candidate.permanentQlId === qlId);
  assert.equal(group.length, 6);
  assert.equal(new Set(group.map((candidate) => candidate.stem)).size, 6, `${qlId}: V2 must provide six distinct setups`);
  assert.equal(new Set(group.map((candidate) => `${candidate.stem}\n${candidate.question}\n${candidate.options.join("|")}`)).size, 6);
}

for (const candidate of SEA002_CP008_ENGLISH_REVIEW_SET_V2) {
  assert.match(candidate.stem, /^(Study|Read|Consider|Use|Analyse|Based)/u);
  assert.ok(candidate.stem.trim().split(/\s+/u).length <= 250);
  assert.equal(candidate.fingerprint.length, 64);
  assert.equal(candidate.active, false);
  assert.equal(candidate.questionStudioDiscoverable, false);
  assert.equal(candidate.questionBankWritable, false);
  assert.equal(candidate.publiclyPublishable, false);
}

console.log("PASS_SEA002_CP008_ENGLISH_REVIEW_V2");
console.log("canonical English surfaces", SEA002_CP008_ENGLISH_REVIEW_SET_V2.length);
console.log("unique setup paragraphs", new Set(SEA002_CP008_ENGLISH_REVIEW_SET_V2.map((candidate) => candidate.stem)).size);
console.log("editorial lead variants", SEA002_CP008_ENGLISH_EDITORIAL_V2.leadVariantCount);
console.log("human approval", SEA002_CP008_ENGLISH_EDITORIAL_V2.humanApprovalStatus);
console.log("Studio/Bank/public", false, false, false);
