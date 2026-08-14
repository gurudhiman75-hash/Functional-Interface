import assert from "node:assert/strict";
import { SAP_CP004_E1_R2_STRUCTURES, generateSapCp004E1R2 } from "./SAP-001/SAP-CP-004/e1-r2-exam-runtime";
import { SAP_CP005_E1_R2_STRUCTURES, generateSapCp005E1R2 } from "./SAP-001/SAP-CP-005/e1-r2-exam-runtime";
import { SAP_CP010_E1_R2_STRUCTURES, generateSapCp010E1R2 } from "./SAP-002/SAP-CP-010/e1-r2-exam-runtime-final";
import { SAP_CP007_E1_R2_PRODUCTION_POLICY } from "./SAP-001/SAP-CP-007/e1-r2-production-policy";
import type { SapE1R2Package } from "./SAP-E1-R2-TYPES";

const families = [
  ...SAP_CP004_E1_R2_STRUCTURES.map(id => ({ id, profile: "SSC" as const, generate: (seed: number) => generateSapCp004E1R2(id, seed) })),
  ...SAP_CP005_E1_R2_STRUCTURES.map(id => ({ id, profile: "SSC" as const, generate: (seed: number) => generateSapCp005E1R2(id, seed) })),
  ...SAP_CP010_E1_R2_STRUCTURES.map(id => ({ id, profile: "BANK" as const, generate: (seed: number) => generateSapCp010E1R2(id, seed) })),
];

assert.equal(families.length, 24);
assert.equal(new Set(families.map(f => f.id)).size, 24);
assert.equal(SAP_CP007_E1_R2_PRODUCTION_POLICY.capabilityRetained, true);
assert.equal(SAP_CP007_E1_R2_PRODUCTION_POLICY.normalMockEligible, false);
assert.equal(SAP_CP007_E1_R2_PRODUCTION_POLICY.questionStudioDiscoverable, false);

const ROOT_HUNDREDTHS: Readonly<Record<number, number>> = Object.freeze({ 2: 141, 3: 173, 5: 224, 6: 245, 7: 265, 10: 316, 11: 332, 15: 387 });
const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

function suppliedHundredths(q: SapE1R2Package): number {
  const direct = Number(q.oracle.data.suppliedHundredths);
  if (Number.isFinite(direct) && direct > 0) return direct;
  const value = ROOT_HUNDREDTHS[Number(q.oracle.data.n)];
  if (!value) throw new Error(`${q.structureId}/${q.seed}: missing supplied root.`);
  return value;
}

function expected(q: SapE1R2Package): number {
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
    case "CP010-R2-SUPPLIED-ROOT-PLUS": return round2(Number(d.factor) * suppliedHundredths(q) / 100 + Number(d.c));
    case "CP010-R2-SUPPLIED-ROOT-PRODUCT": return round2(Number(d.m) * Number(d.factor) * suppliedHundredths(q) / 100 - Number(d.c));
    case "CP010-R2-SUPPLIED-ROOT-DECIMAL-SCALE": return round2(Number(d.factor) * suppliedHundredths(q) / 1000 + Number(d.c));
    case "CP010-R2-SUPPLIED-ROOT-MIXED": return round2(Number(d.m) * Number(d.factor) * suppliedHundredths(q) / 100 + Number(d.c));
    case "CP010-R2-SUPPLIED-ROOT-DIFFERENCE": return round2(2 * suppliedHundredths(q) / 100 + Number(d.c));
    case "CP010-R2-SUPPLIED-ROOT-QUOTIENT": return round2((Number(d.factor) * suppliedHundredths(q) / 100 + Number(d.c)) / Number(d.q));
    default: throw new Error(`Unknown R2 structure ${q.structureId}`);
  }
}

const stems = new Set<string>();
const payloads = new Set<string>();
const identities = new Set<string>();
const positions = [0, 0, 0, 0];
let ssc = 0, bank = 0, hard = 0;

for (const family of families) {
  const localStems = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = family.generate(seed);
    assert.equal(q.structureId, family.id);
    assert.equal(q.profile, family.profile);
    assert.equal(q.validation.ok, true, `${q.structureId}:${seed}: ${q.validation.errors.join("; ")}`);
    assert.ok(q.decisionCount >= 2, `${q.structureId}:${seed}: one-step production item.`);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(o => o.value)).size, 4);
    assert.equal(q.options.filter(o => o.isCorrect).length, 1);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.doesNotMatch(q.stem, /\bround\b|For estimation, take|Using cancellation|using suitable approximation|nearest whole number/i);
    assert.doesNotMatch(q.stem, /oracle|runtime|prototype|canonical|machine policy|learner route/i);
    assert.doesNotMatch(q.stem, /[√∛∜]/);
    assert.doesNotMatch(q.options.map(o => o.value).join(" "), /Alternative\s+\d+/i);
    assert.equal(q.lifecycle.permanentQlId, null);
    assert.equal(q.lifecycle.active, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.equal(Number(q.canonicalAnswer), expected(q), `${q.structureId}:${seed}: reconstructed answer mismatch.`);
    assert.ok(!localStems.has(q.stem), `${q.structureId}:${seed}: duplicate stem within structure.`);
    assert.ok(!stems.has(q.stem), `${q.structureId}:${seed}: duplicate stem across corpus.`);
    assert.ok(!payloads.has(q.canonicalPayloadKey), `${q.structureId}:${seed}: duplicate payload.`);
    assert.ok(!identities.has(q.generationIdentity), `${q.structureId}:${seed}: duplicate identity.`);
    localStems.add(q.stem); stems.add(q.stem); payloads.add(q.canonicalPayloadKey); identities.add(q.generationIdentity);
    positions[q.correctIndex]! += 1;
    q.profile === "SSC" ? ssc++ : bank++;
    if (q.difficulty === "HARD") hard++;
  }
  assert.equal(localStems.size, 100, `${family.id}: expected 100 distinct visible stems.`);
}

assert.equal(stems.size, 2400);
assert.equal(payloads.size, 2400);
assert.equal(identities.size, 2400);
assert.equal(ssc, 1200);
assert.equal(bank, 1200);
assert.deepEqual(positions, [600, 600, 600, 600]);
assert.ok(hard >= 700, `Expected substantial hard coverage, found ${hard}.`);

console.log(JSON.stringify({ authority: "SAP-E1-R2-EXAM-REALISM-V2", structures: 24, states: 2400, profiles: { SSC: ssc, BANK: bank }, answerPositions: positions, hardStates: hard, cp007NormalMockEligible: false }));
