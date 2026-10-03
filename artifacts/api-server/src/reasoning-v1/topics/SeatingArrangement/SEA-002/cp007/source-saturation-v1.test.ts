import assert from "node:assert/strict";

import { generateSea002Cp007Wave01 } from "./generator.ts";
import { SEA002_CP007_SOURCE_SATURATION_V1 } from "./source-saturation-v1.ts";
import { generateSea002Cp007Wave02, SEA002_CP007_WAVE02_PROTOTYPES } from "./wave02.ts";

const WAVE01 = [
  "SEA-CP007-PROT-001",
  "SEA-CP007-PROT-002",
  "SEA-CP007-PROT-003",
] as const;

const assigned = SEA002_CP007_SOURCE_SATURATION_V1.proposedAuthorities.flatMap((authority) => [...authority.prototypes]);
assert.equal(assigned.length, 7);
assert.equal(new Set(assigned).size, 7);
assert.deepEqual([...assigned].sort(), [...SEA002_CP007_SOURCE_SATURATION_V1.temporaryPrototypes].sort());
assert.equal(SEA002_CP007_SOURCE_SATURATION_V1.proposedAuthorities.length, 4);
assert.equal(SEA002_CP007_SOURCE_SATURATION_V1.proposedPermanentRangeIfApproved, "SEA-QL-025..SEA-QL-028");
assert.equal(SEA002_CP007_SOURCE_SATURATION_V1.permanentQlAllocated, false);

const authority01 = SEA002_CP007_SOURCE_SATURATION_V1.proposedAuthorities.find((entry) => entry.authorityKey === "CP007-AUTH-01")!;
assert.deepEqual([...authority01.prototypes], ["SEA-CP007-PROT-001", "SEA-CP007-PROT-002", "SEA-CP007-PROT-004"]);
const authority02 = SEA002_CP007_SOURCE_SATURATION_V1.proposedAuthorities.find((entry) => entry.authorityKey === "CP007-AUTH-02")!;
assert.deepEqual([...authority02.prototypes], ["SEA-CP007-PROT-003", "SEA-CP007-PROT-005"]);

let regressionQuestions = 0;
let lifecycleLocks = 0;
const fingerprints = new Map<string, Set<string>>();
for (const prototypeId of [...WAVE01, ...SEA002_CP007_WAVE02_PROTOTYPES]) fingerprints.set(prototypeId, new Set());

for (const prototypeId of WAVE01) {
  for (let index = 0; index < 100; index += 1) {
    const width = 3 + (index % 4);
    const question = generateSea002Cp007Wave01(prototypeId, `saturation:${prototypeId}:${index}`, width);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.lifecycle.permanentQlAllocated, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);
    fingerprints.get(prototypeId)!.add(question.mathematicalFingerprint);
    regressionQuestions += 1;
    lifecycleLocks += 5;
  }
}

for (const prototypeId of SEA002_CP007_WAVE02_PROTOTYPES) {
  for (let index = 0; index < 100; index += 1) {
    const width = 3 + (index % 4);
    const question = generateSea002Cp007Wave02(prototypeId, `saturation:${prototypeId}:${index}`, width);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.lifecycle.permanentQlAllocated, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);
    fingerprints.get(prototypeId)!.add(question.mathematicalFingerprint);
    regressionQuestions += 1;
    lifecycleLocks += 5;
  }
}

for (const [prototypeId, values] of fingerprints) {
  assert.ok(values.size >= 70, `${prototypeId} did not retain sufficient state diversity under saturation regression.`);
}

assert.ok(SEA002_CP007_SOURCE_SATURATION_V1.sourceEvidence.some((entry) => entry.family === "BANKING_MIXED_TWO_ROW"));
assert.ok(SEA002_CP007_SOURCE_SATURATION_V1.sourceEvidence.some((entry) => entry.family === "BANKING_MIXED_DIAGONAL"));
assert.ok(SEA002_CP007_SOURCE_SATURATION_V1.sourceEvidence.some((entry) => entry.family === "SAME_DIRECTION_TWO_ROW"));
assert.equal(SEA002_CP007_SOURCE_SATURATION_V1.nextGate, "PRODUCTION_CASELET_AND_INDEPENDENT_UNIQUENESS_PROOF_BEFORE_PERMANENT_ALLOCATION");

console.log("PASS_SEA002_CP007_SOURCE_SATURATION_V1");
console.log("temporary prototypes", SEA002_CP007_SOURCE_SATURATION_V1.temporaryPrototypes.length);
console.log("proposed learner authorities", SEA002_CP007_SOURCE_SATURATION_V1.proposedAuthorities.length);
console.log("prototype assignments", assigned.length);
console.log("regression questions", regressionQuestions);
console.log("lifecycle locks", lifecycleLocks);
console.log("candidate permanent range", SEA002_CP007_SOURCE_SATURATION_V1.proposedPermanentRangeIfApproved);
console.log("permanent QLs allocated", SEA002_CP007_SOURCE_SATURATION_V1.permanentQlAllocated);
console.log("next gate", SEA002_CP007_SOURCE_SATURATION_V1.nextGate);
