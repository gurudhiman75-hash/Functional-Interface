import assert from "node:assert/strict";
import {
  SAP_CP006_DATA_SUFFICIENCY_CLASSES,
  generateSapCp006Wave3Sweep,
  type SapCp006DataSufficiencyClass,
  type SapCp006Wave3Package,
} from "./runtime-wave3-v2";

const DOMAIN = [1, 2, 3, 4, 5, 6] as const;

function classify(pkg: SapCp006Wave3Package): { answer: SapCp006DataSufficiencyClass; first: number[]; second: number[]; combined: number[] } {
  const d = pkg.oracle.data;
  const e = (x: number) => d.coefficient! * x + d.percentValue!;
  const exact = (x: number) => e(x) === d.exactE!;
  const parity = d.hiddenX! % 2 === 0
    ? (x: number) => (e(x) - d.percentValue!) % (2 * d.coefficient!) === 0
    : (x: number) => (e(x) - d.percentValue!) % (2 * d.coefficient!) !== 0;
  const residue = (x: number) => (e(x) - d.percentValue!) % (3 * d.coefficient!) === d.coefficient! * d.residue!;
  const universal = (x: number) => (e(x) - d.percentValue!) % d.coefficient! === 0;
  let firstTest: (x: number) => boolean;
  let secondTest: (x: number) => boolean;
  if (d.scenario === 0) { firstTest = exact; secondTest = parity; }
  else if (d.scenario === 1) { firstTest = parity; secondTest = exact; }
  else if (d.scenario === 2) { firstTest = parity; secondTest = residue; }
  else { firstTest = parity; secondTest = universal; }
  const first = DOMAIN.filter(firstTest);
  const second = DOMAIN.filter(secondTest);
  const combined = DOMAIN.filter((x) => firstTest(x) && secondTest(x));
  let answer: SapCp006DataSufficiencyClass;
  if (first.length === 1 && second.length !== 1) answer = "I alone is sufficient";
  else if (first.length !== 1 && second.length === 1) answer = "II alone is sufficient";
  else if (first.length !== 1 && second.length !== 1 && combined.length === 1) answer = "Both together are sufficient";
  else answer = "Even together are insufficient";
  return { answer, first, second, combined };
}

const sweep = generateSapCp006Wave3Sweep(400);
assert.equal(sweep.length, 400);
const classCounts = new Map<string, number>();
const positions = [0, 0, 0, 0];
const payloads = new Set<string>();
const identities = new Set<string>();

for (const pkg of sweep) {
  assert.equal(pkg.validation.ok, true, `${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.proposedPermanentQlId, "SAP-QL-112");
  assert.equal(pkg.answerSemantic, "DATA_SUFFICIENCY_CLASS");
  assert.equal(pkg.representation, "DATA_SUFFICIENCY");
  assert.equal(pkg.options.length, 4);
  assert.deepEqual(new Set(pkg.options.map((option) => option.value)), new Set(SAP_CP006_DATA_SUFFICIENCY_CLASSES));
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.match(pkg.stem, /integer x from 1 to 6/);
  assert.match(pkg.stem, /Statement I:/);
  assert.match(pkg.stem, /Statement II:/);
  assert.equal(pkg.lifecycle.permanentQlId, null);
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);

  const independent = classify(pkg);
  assert.equal(independent.answer, pkg.canonicalAnswer, `${pkg.seed}: independent DS class mismatch.`);
  assert.deepEqual(independent.first, [...pkg.oracle.firstCandidates]);
  assert.deepEqual(independent.second, [...pkg.oracle.secondCandidates]);
  assert.deepEqual(independent.combined, [...pkg.oracle.combinedCandidates]);
  assert.ok(independent.combined.includes(pkg.oracle.data.hiddenX!));

  classCounts.set(pkg.canonicalAnswer, (classCounts.get(pkg.canonicalAnswer) ?? 0) + 1);
  positions[pkg.correctIndex]! += 1;
  assert.ok(!payloads.has(pkg.canonicalPayloadKey), `${pkg.seed}: duplicate payload.`);
  payloads.add(pkg.canonicalPayloadKey);
  assert.ok(!identities.has(pkg.generationIdentity), `${pkg.seed}: duplicate identity.`);
  identities.add(pkg.generationIdentity);
}

assert.deepEqual(SAP_CP006_DATA_SUFFICIENCY_CLASSES.map((value) => classCounts.get(value) ?? 0), [100, 100, 100, 100]);
assert.deepEqual(positions, [100, 100, 100, 100]);
assert.equal(payloads.size, 400);
assert.equal(identities.size, 400);

console.log("SAP-CP-006 wave-three v2 authority passed: 400 exact-arithmetic DS cases, 100 per class and 100 per A/B/C/D position, with independent candidate-set classification.");
