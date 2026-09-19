import assert from "node:assert/strict";
import {
  PGK_001_CP004_REVIEW_BATCH_V2,
  PGK_001_CP004_QL_NAMES_V2,
  auditPgk001Cp004ReviewBatchV2,
} from "./pgk-001-cp004-review-batch-v2";
import {
  PGK_001_CP004_ANCIENT_RIVER_NAMES,
} from "./pgk-001-cp004-facts";

const audit = auditPgk001Cp004ReviewBatchV2();
assert.equal(audit.valid, true, audit.issues.join(" | "));
assert.equal(PGK_001_CP004_REVIEW_BATCH_V2.length, 42);
assert.equal(Object.keys(PGK_001_CP004_QL_NAMES_V2).length, 7);
assert.equal(PGK_001_CP004_ANCIENT_RIVER_NAMES.length, 5);

const ancientMap = Object.fromEntries(
  PGK_001_CP004_ANCIENT_RIVER_NAMES.map((row) => [row.modernName, row]),
);
assert.equal(ancientMap.Sutlej?.canonicalAncientName, "Shutudri");
assert.equal(ancientMap.Beas?.canonicalAncientName, "Vipasa");
assert.equal(ancientMap.Ravi?.canonicalAncientName, "Purushni");
assert.equal(ancientMap.Chenab?.canonicalAncientName, "Askini");
assert.equal(ancientMap.Jhelum?.canonicalAncientName, "Vitasta");
assert.ok(ancientMap.Beas?.acceptedAncientSpellings.includes("Vipasha"));
assert.ok(ancientMap.Ravi?.acceptedAncientSpellings.includes("Parushni"));
assert.ok(ancientMap.Chenab?.acceptedAncientSpellings.includes("Asikni"));
assert.ok(ancientMap.Jhelum?.acceptedAncientSpellings.includes("Vitasta"));

const representedAncientFacts = new Set(
  PGK_001_CP004_REVIEW_BATCH_V2.flatMap((question) => question.factIds.filter((factId) => factId.startsWith("ancient-"))),
);
assert.equal(representedAncientFacts.size, 5);

const learnerText = PGK_001_CP004_REVIEW_BATCH_V2
  .map((question) => `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)
  .join("\n")
  .toLowerCase();

for (const banned of ["government of punjab", "puda", "pseb", "master plan", "source:", "puadh"]) {
  assert.equal(learnerText.includes(banned), false, `learner text contains banned source/scope leakage: ${banned}`);
}

for (const question of PGK_001_CP004_REVIEW_BATCH_V2) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.equal(question.options.length, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
}
