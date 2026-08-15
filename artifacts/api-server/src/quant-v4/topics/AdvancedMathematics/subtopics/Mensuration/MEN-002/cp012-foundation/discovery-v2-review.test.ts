import { MEN_CP_012_DISCOVERY_V2_DEFINITIONS } from "./discovery-v2";
import { auditMenCp012DiscoveryV2Review, buildMenCp012DiscoveryV2Review } from "./discovery-v2-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const review = buildMenCp012DiscoveryV2Review();
const audit = auditMenCp012DiscoveryV2Review();

assert(review.length === 56, `Expected 56 review records, got ${review.length}.`);
assert(audit.reviewRecordCount === 56, `Audit expected 56 review records, got ${audit.reviewRecordCount}.`);
assert(audit.uniqueStemCount === 56, `Expected 56 unique review stems, got ${audit.uniqueStemCount}.`);
assert(audit.correctPositions.A === 14 && audit.correctPositions.B === 14 && audit.correctPositions.C === 14 && audit.correctPositions.D === 14,
  `Wave 02 review must balance A/B/C/D as 14/14/14/14; got ${JSON.stringify(audit.correctPositions)}.`);
assert(audit.allVerified, "Every Wave 02 review record must pass exact verification.");
assert(audit.allFourOptions, "Every Wave 02 review record must have four options.");
assert(audit.allUniqueOptions, "Every Wave 02 review record must have unique option displays.");
assert(audit.productLocked, "Wave 02 review must remain product-locked.");

for (const definition of MEN_CP_012_DISCOVERY_V2_DEFINITIONS) {
  const slice = review.filter((question) => question.id === definition.id);
  assert(slice.length === 4, `${definition.id}: expected four review records, got ${slice.length}.`);
  assert(new Set(slice.map((question) => question.correctIndex)).size === 4, `${definition.id}: review must cover A/B/C/D.`);
  assert(new Set(slice.map((question) => question.stem)).size === 4, `${definition.id}: review states must have distinct stems.`);
}

console.log(JSON.stringify({
  authority: "MEN-CP012-DISCOVERY-WAVE-02-REVIEW-V1",
  ...audit,
}, null, 2));
