import assert from "node:assert/strict";
import {
  SAP_CP006_DATA_SUFFICIENCY_CLASSES,
  generateSapCp006Wave3Sweep,
  type SapCp006DataSufficiencyClass,
  type SapCp006Wave3Package,
} from "./runtime-wave3-v3";

const DOMAIN = [1, 2, 3, 4, 5, 6] as const;

function predicateHolds(kind: number, threshold: number, value: number): boolean {
  if (kind === 0) return value === threshold;
  if (kind === 1) return value > threshold;
  if (kind === 2) return value < threshold;
  if (kind === 3) return value >= threshold;
  if (kind === 4) return value <= threshold;
  throw new Error(`Unknown arithmetic DS predicate kind ${kind}.`);
}

function classify(pkg: SapCp006Wave3Package): { answer: SapCp006DataSufficiencyClass; first: number[]; second: number[]; combined: number[] } {
  const d = pkg.oracle.data;
  const e = (x: number) => d.coefficient! * x + d.percentValue!;
  const firstTest = (x: number) => predicateHolds(d.firstKind!, d.firstThreshold!, e(x));
  const secondTest = (x: number) => predicateHolds(d.secondKind!, d.secondThreshold!, e(x));
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
const classesByPosition = [new Set<string>(), new Set<string>(), new Set<string>(), new Set<string>()];
const payloads = new Set<string>();
const identities = new Set<string>();

for (const pkg of sweep) {
  assert.equal(pkg.validation.ok, true, `${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.proposedPermanentQlId, "SAP-QL-112");
  assert.equal(pkg.answerSemantic, "DATA_SUFFICIENCY_CLASS");
  assert.equal(pkg.representation, "DATA_SUFFICIENCY");
  assert.equal(pkg.oracle.data.editorialMode, 3);
  assert.equal(pkg.options.length, 4);
  assert.deepEqual(new Set(pkg.options.map((option) => option.value)), new Set(SAP_CP006_DATA_SUFFICIENCY_CLASSES));
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.match(pkg.stem, /integer x from 1 to 6/);
  assert.match(pkg.stem, /Statement I:/);
  assert.match(pkg.stem, /Statement II:/);
  assert.match(pkg.stem, /E\s*[=<>≥≤]/);
  assert.doesNotMatch(pkg.stem, /divis|remainder|parity/i, `${pkg.seed}: Number-System vocabulary leaked into arithmetic DS.`);
  assert.doesNotMatch(pkg.explanation.steps.join(" "), /divis|remainder|parity/i, `${pkg.seed}: Number-System explanation leakage.`);
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
  classesByPosition[pkg.correctIndex]!.add(pkg.canonicalAnswer);
  assert.ok(!payloads.has(pkg.canonicalPayloadKey), `${pkg.seed}: duplicate payload.`);
  payloads.add(pkg.canonicalPayloadKey);
  assert.ok(!identities.has(pkg.generationIdentity), `${pkg.seed}: duplicate identity.`);
  identities.add(pkg.generationIdentity);
}

assert.deepEqual(SAP_CP006_DATA_SUFFICIENCY_CLASSES.map((value) => classCounts.get(value) ?? 0), [100, 100, 100, 100]);
assert.deepEqual(positions, [100, 100, 100, 100]);
for (let position = 0; position < 4; position += 1) {
  assert.deepEqual(classesByPosition[position], new Set(SAP_CP006_DATA_SUFFICIENCY_CLASSES), `Position ${position} does not exercise all DS classes.`);
}
assert.equal(payloads.size, 400);
assert.equal(identities.size, 400);

console.log("SAP-CP-006 wave-three v3 authority passed: 400 arithmetic-only data-sufficiency cases, 100 per class, 100 per A/B/C/D position, no Number-System predicate leakage, and independent bounded candidate-set proof.");
