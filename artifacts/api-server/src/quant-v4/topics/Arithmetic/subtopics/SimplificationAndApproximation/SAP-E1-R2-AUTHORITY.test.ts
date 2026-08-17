import assert from "node:assert/strict";
import { SAP_CP004_E1_R2_STRUCTURES, generateSapCp004E1R2 } from "./SAP-001/SAP-CP-004/e1-r2-exam-runtime";
import { SAP_CP005_E1_R2_STRUCTURES, generateSapCp005E1R2 } from "./SAP-001/SAP-CP-005/e1-r2-exam-runtime";
import { SAP_CP010_E1_R2_STRUCTURES, generateSapCp010E1R2 } from "./SAP-002/SAP-CP-010/e1-r2-exam-runtime";
import { SAP_CP007_E1_R2_PRODUCTION_POLICY } from "./SAP-001/SAP-CP-007/e1-r2-production-policy";
import type { SapE1R2Package } from "./SAP-E1-R2-TYPES";

const structureGenerators = [
  ...SAP_CP004_E1_R2_STRUCTURES.map(id => ({ id, profile: "SSC" as const, generate: (seed: number) => generateSapCp004E1R2(id, seed) })),
  ...SAP_CP005_E1_R2_STRUCTURES.map(id => ({ id, profile: "SSC" as const, generate: (seed: number) => generateSapCp005E1R2(id, seed) })),
  ...SAP_CP010_E1_R2_STRUCTURES.map(id => ({ id, profile: "BANK" as const, generate: (seed: number) => generateSapCp010E1R2(id, seed) })),
];

assert.equal(structureGenerators.length, 24, "E1-R2 must expose exactly 24 review structures in this checkpoint.");
assert.equal(new Set(structureGenerators.map(x => x.id)).size, 24);
assert.equal(SAP_CP007_E1_R2_PRODUCTION_POLICY.capabilityRetained, true);
assert.equal(SAP_CP007_E1_R2_PRODUCTION_POLICY.normalMockEligible, false);
assert.equal(SAP_CP007_E1_R2_PRODUCTION_POLICY.questionStudioDiscoverable, false);

function expectedAnswer(q: SapE1R2Package): number {
  const d = q.oracle.data;
  switch (q.structureId) {
    case "CP004-R2-ROOT-SUM-PRODUCT": return Number(d.a) + Number(d.m) * Number(d.b) - Number(d.c);
    case "CP004-R2-ROOT-DIFFERENCE-BRACKET": return (Number(d.a) - Number(d.b)) * Number(d.m) + Number(d.c);
    case "CP004-R2-SQUARE-CUBE-COMBO": return Number(d.u) + Number(d.m) * Number(d.a) - Number(d.c);
    case "CP004-R2-ROOT-FRACTION-CHAIN": return Number(d.x) + Number(d.y) + Number(d.c);
    case "CP004-R2-NESTED-PLUS-SCALAR": return Number(d.outer) + Number(d.c);
    case "CP004-R2-NESTED-SCALED": return Number(d.m) * Number(d.outer) - Number(d.c);
    case "CP004-R2-WEIGHTED-ROOT-QUOTIENT": return Number(d.m) * Number(d.x) + Number(d.y) - Number(d.c);
    case "CP004-R2-ROOT-POWER-BODMAS": return Number(d.a) + Number(d.u) + Number(d.m) ** 2 - Number(d.c);
    case "CP005-R2-TELESCOPE-SCALED-SUM": return Number(d.count);
    case "CP005-R2-TELESCOPE-SUM-OFFSET": return Number(d.count) + Number(d.c);
    case "CP005-R2-TELESCOPE-TWO-BLOCKS": return Number(d.count1) - Number(d.count2) + Number(d.c);
    case "CP005-R2-TELESCOPE-BRACKET-QUOTIENT": return Number(d.count) / Number(d.q) + Number(d.c);
    case "CP010-R2-APPROX-SQUARE-PRODUCT": return Number(d.a) ** 2 + Number(d.b) * Number(d.m) - Number(d.c);
    case "CP010-R2-APPROX-ROOT-TIMES-DECIMAL": return Number(d.a) * Number(d.m) + Number(d.c);
    case "CP010-R2-APPROX-CUBEROOT-MIXED": return Number(d.u) * Number(d.m) - Number(d.c);
    case "CP010-R2-APPROX-POWER-QUOTIENT": return Number(d.m) * Number(d.x) ** 2 + Number(d.c);
    case "CP010-R2-APPROX-ROOT-CUBE-COMBO": return Number(d.a) + Number(d.u) * Number(d.m) - Number(d.c);
    case "CP010-R2-APPROX-ROOT-QUOTIENT": return Number(d.x) * Number(d.m) - Number(d.c);
    case "CP010-R2-SUPPLIED-ROOT-PLUS": return Number(d.factor) * Number(d.suppliedHundredths) / 100 + Number(d.c);
    case "CP010-R2-SUPPLIED-ROOT-PRODUCT": return Number(d.m) * Number(d.factor) * Number(d.answerHundredths) * 0 + (Number(d.m) * Number(d.factor) * rootHundredths(q) / 100 - Number(d.c));
    case "CP010-R2-SUPPLIED-ROOT-DECIMAL-SCALE": return Number(d.factor) * rootHundredths(q) / 1000 + Number(d.c);
    case "CP010-R2-SUPPLIED-ROOT-MIXED": return Number(d.m) * Number(d.factor) * rootHundredths(q) / 100 + Number(d.c);
    case "CP010-R2-SUPPLIED-ROOT-DIFFERENCE": return 2 * rootHundredths(q) / 100 + Number(d.c);
    case "CP010-R2-SUPPLIED-ROOT-QUOTIENT": return (Number(d.factor) * rootHundredths(q) / 100 + Number(d.c)) / Number(d.q);
    default: throw new Error(`Unknown E1-R2 structure ${q.structureId}`);
  }
}

function rootHundredths(q: SapE1R2Package): number {
  const d = q.oracle.data;
  const explicit = Number(d.suppliedHundredths);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  const n = Number(d.n);
  const lookup: Record<number, number> = { 2: 141, 3: 173, 5: 224, 6: 245, 7: 265, 10: 316, 11: 332, 15: 387 };
  const value = lookup[n];
  if (!value) throw new Error(`No supplied-root lookup for n=${n}`);
  return value;
}

function rounded2(value: number): number { return Math.round((value + Number.EPSILON) * 100) / 100; }

const allStems = new Set<string>();
const allPayloads = new Set<string>();
const allIdentities = new Set<string>();
const answerPositions = [0, 0, 0, 0];
let sscStates = 0;
let bankStates = 0;
let hardStates = 0;

for (const family of structureGenerators) {
  const stems = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = family.generate(seed);
    assert.equal(q.structureId, family.id);
    assert.equal(q.profile, family.profile);
    assert.equal(q.validation.ok, true, `${q.structureId}:${seed}: ${q.validation.errors.join("; ")}`);
    assert.ok(q.decisionCount >= 2, `${q.structureId}:${seed}: one-step production question.`);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(o => o.value)).size, 4);
    assert.equal(q.options.filter(o => o.isCorrect).length, 1);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.doesNotMatch(q.stem, /\bround\b|For estimation, take|Using cancellation|using suitable approximation|nearest whole number/i, `${q.structureId}:${seed}: guided stem.`);
    assert.doesNotMatch(q.stem, /oracle|runtime|prototype|canonical|machine policy|learner route/i);
    assert.doesNotMatch(q.stem, /[√∛∜]/);
    assert.doesNotMatch(q.options.map(o => o.value).join(" "), /Alternative\s+\d+/i);
    assert.equal(q.lifecycle.permanentQlId, null);
    assert.equal(q.lifecycle.active, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);

    const expected = expectedAnswer(q);
    if (q.profile === "BANK" && q.structureId.includes("SUPPLIED-ROOT")) {
      assert.equal(Number(q.canonicalAnswer), rounded2(expected), `${q.structureId}:${seed}: supplied-root answer mismatch.`);
    } else {
      assert.equal(Number(q.canonicalAnswer), expected, `${q.structureId}:${seed}: reconstructed answer mismatch.`);
    }

    assert.ok(!stems.has(q.stem), `${q.structureId}:${seed}: duplicate stem inside structure.`);
    assert.ok(!allStems.has(q.stem), `${q.structureId}:${seed}: duplicate stem across R2 corpus.`);
    assert.ok(!allPayloads.has(q.canonicalPayloadKey), `${q.structureId}:${seed}: duplicate payload.`);
    assert.ok(!allIdentities.has(q.generationIdentity), `${q.structureId}:${seed}: duplicate identity.`);
    stems.add(q.stem);
    allStems.add(q.stem);
    allPayloads.add(q.canonicalPayloadKey);
    allIdentities.add(q.generationIdentity);
    answerPositions[q.correctIndex]! += 1;
    if (q.profile === "SSC") sscStates += 1; else bankStates += 1;
    if (q.difficulty === "HARD") hardStates += 1;
  }
  assert.equal(stems.size, 100, `${family.id}: expected 100 materially distinct visible stems.`);
}

assert.equal(allStems.size, 2400);
assert.equal(allPayloads.size, 2400);
assert.equal(allIdentities.size, 2400);
assert.equal(sscStates, 1200);
assert.equal(bankStates, 1200);
assert.deepEqual(answerPositions, [600, 600, 600, 600]);
assert.ok(hardStates >= 700, `Expected substantial hard coverage, found ${hardStates}.`);

console.log(JSON.stringify({
  authority: "SAP-E1-R2-EXAM-REALISM",
  structures: structureGenerators.length,
  states: allStems.size,
  profiles: { SSC: sscStates, BANK: bankStates },
  answerPositions,
  hardStates,
  cp007NormalMockEligible: SAP_CP007_E1_R2_PRODUCTION_POLICY.normalMockEligible,
}));
