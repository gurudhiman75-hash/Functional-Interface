import assert from "node:assert/strict";
import {
  SAP_CP006_WAVE2_CATALOGUE,
  SAP_CP006_WAVE2_PROTOTYPE_IDS,
  generateSapCp006Wave2Sweep,
  type SapCp006Wave2Oracle,
  type SapCp006Wave2Package,
} from "./runtime-wave2";

function factorial(n: number): number {
  let result = 1;
  for (let value = 2; value <= n; value += 1) result *= value;
  return result;
}

function independentAnswer(oracle: SapCp006Wave2Oracle): number {
  const d = oracle.data;
  switch (oracle.kind) {
    case "SAP-CP006-PROT-MISSING-MIXED-MINUEND":
      return d.target! + d.value! + d.percentValue!;
    case "SAP-CP006-PROT-MISSING-MIXED-SUBTRAHEND":
      return d.known! - d.target!;
    case "SAP-CP006-PROT-MISSING-MIXED-DIVIDEND":
      return (d.target! - d.value! - d.percentValue!) * d.divisor!;
    case "SAP-CP006-PROT-MISSING-FRACTION-DENOMINATOR-CROSS": {
      const isolated = d.target! - d.percentValue!;
      return (d.numerator! * d.fractionBase!) / isolated;
    }
    case "SAP-CP006-PROT-COMPOSED-RADICAND-MISSING": {
      const isolatedRoot = d.target! - d.value! - d.percentValue!;
      return isolatedRoot * isolatedRoot;
    }
    case "SAP-CP006-PROT-COMPOSED-FACTORIAL-MISSING": {
      const isolated = d.target! - d.value! - d.percentValue!;
      for (let candidate = 1; candidate <= 8; candidate += 1) if (factorial(candidate) === isolated) return candidate;
      throw new Error(`No bounded factorial input reproduces ${isolated}.`);
    }
    case "SAP-CP006-PROT-TWO-SIDED-EXACT-EQUALITY":
      return d.usePlus === 1 ? d.right! - d.value! : d.right! + d.value!;
    case "SAP-CP006-PROT-FIXED-MIXED-OPERAND-MISSING":
      return (d.target! - d.percentValue!) * d.divisor! - d.value!;
  }
}

function substitutionHolds(pkg: SapCp006Wave2Package, candidate: number): boolean {
  const d = pkg.oracle.data;
  switch (pkg.prototypeId) {
    case "SAP-CP006-PROT-MISSING-MIXED-MINUEND":
      return candidate - d.value! - d.percentValue! === d.target!;
    case "SAP-CP006-PROT-MISSING-MIXED-SUBTRAHEND":
      return d.value! + d.percentValue! - candidate === d.target!;
    case "SAP-CP006-PROT-MISSING-MIXED-DIVIDEND":
      return candidate / d.divisor! + d.value! + d.percentValue! === d.target!;
    case "SAP-CP006-PROT-MISSING-FRACTION-DENOMINATOR-CROSS":
      return (d.numerator! / candidate) * d.fractionBase! + d.percentValue! === d.target!;
    case "SAP-CP006-PROT-COMPOSED-RADICAND-MISSING": {
      const root = Math.sqrt(candidate);
      return Number.isInteger(root) && root + d.value! + d.percentValue! === d.target!;
    }
    case "SAP-CP006-PROT-COMPOSED-FACTORIAL-MISSING":
      return Number.isInteger(candidate) && candidate >= 1 && candidate <= 8 && factorial(candidate) + d.value! + d.percentValue! === d.target!;
    case "SAP-CP006-PROT-TWO-SIDED-EXACT-EQUALITY": {
      const left = d.usePlus === 1 ? candidate + d.value! : candidate - d.value!;
      return left === d.percentValue! + d.squareValue!;
    }
    case "SAP-CP006-PROT-FIXED-MIXED-OPERAND-MISSING":
      return (d.value! + candidate) / d.divisor! + d.percentValue! === d.target!;
  }
}

assert.equal(SAP_CP006_WAVE2_PROTOTYPE_IDS.length, 8);
assert.equal(SAP_CP006_WAVE2_CATALOGUE.length, 8);
assert.deepEqual(
  SAP_CP006_WAVE2_CATALOGUE.map((item) => item.proposedPermanentQlId),
  Array.from({ length: 8 }, (_, index) => `SAP-QL-${String(104 + index).padStart(3, "0")}`),
);

const sweep = generateSapCp006Wave2Sweep(100);
assert.equal(sweep.length, 800);
const identities = new Set<string>();
const payloadsByPrototype = new Map<string, Set<string>>();
const answersByPrototype = new Map<string, Set<string>>();
const counts = new Map<string, number>();

for (const pkg of sweep) {
  assert.equal(pkg.validation.ok, true, `${pkg.prototypeId}/${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(String(independentAnswer(pkg.oracle)), pkg.canonicalAnswer, `${pkg.prototypeId}/${pkg.seed}: independent inverse answer mismatch.`);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.options.every((option) => /^\d+$/.test(option.value)), `${pkg.prototypeId}/${pkg.seed}: wave-two candidate options must be positive integers.`);
  assert.ok(pkg.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId) && option.analysis.length >= 45));
  assert.ok(pkg.explanation.coreConcept.length >= 120);
  assert.ok(pkg.explanation.steps.length >= 2);
  assert.ok(pkg.explanation.verification.length >= 2);
  assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer));
  assert.match(pkg.stem, /\bof\b/, `${pkg.prototypeId}/${pkg.seed}: mixed exact synthesis must include a concrete fraction-of or percentage-of quantity.`);
  assert.equal(pkg.lifecycle.permanentQlId, null);
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);

  const substitutionMatches = pkg.options.filter((option) => substitutionHolds(pkg, Number(option.value))).length;
  assert.equal(substitutionMatches, 1, `${pkg.prototypeId}/${pkg.seed}: substitution did not identify exactly one candidate.`);

  assert.ok(!identities.has(pkg.generationIdentity), `${pkg.prototypeId}/${pkg.seed}: duplicate generation identity.`);
  identities.add(pkg.generationIdentity);
  const payloads = payloadsByPrototype.get(pkg.prototypeId) ?? new Set<string>();
  payloads.add(pkg.canonicalPayloadKey);
  payloadsByPrototype.set(pkg.prototypeId, payloads);
  const answers = answersByPrototype.get(pkg.prototypeId) ?? new Set<string>();
  answers.add(pkg.canonicalAnswer);
  answersByPrototype.set(pkg.prototypeId, answers);
  counts.set(pkg.prototypeId, (counts.get(pkg.prototypeId) ?? 0) + 1);
}

assert.equal(identities.size, 800);
for (const prototypeId of SAP_CP006_WAVE2_PROTOTYPE_IDS) {
  assert.equal(counts.get(prototypeId), 100);
  assert.ok((payloadsByPrototype.get(prototypeId)?.size ?? 0) >= 10, `${prototypeId}: payload diversity collapsed.`);
  assert.ok((answersByPrototype.get(prototypeId)?.size ?? 0) >= 4, `${prototypeId}: answer diversity collapsed.`);
}

console.log("SAP-CP-006 wave-two authority passed: 800 deterministic cases across 8 inverse synthesis modes with independent reversal and exact substitution proof.");
