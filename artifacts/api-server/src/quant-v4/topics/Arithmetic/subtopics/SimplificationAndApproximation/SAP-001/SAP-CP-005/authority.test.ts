import assert from "node:assert/strict";
import {
  SAP_CP005_CATALOGUE,
  SAP_CP005_PROPOSED_QL_BY_PROTOTYPE,
  SAP_CP005_PROTOTYPE_IDS,
  generateSapCp005Sweep,
  type SapCp005Oracle,
} from "./runtime";

interface Rational { n: bigint; d: bigint; }

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function rat(n: bigint | number, d: bigint | number = 1n): Rational {
  let numerator = BigInt(n), denominator = BigInt(d);
  assert.notEqual(denominator, 0n);
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  const divisor = gcd(numerator, denominator);
  return { n: numerator / divisor, d: denominator / divisor };
}

function mul(a: Rational, b: Rational): Rational { return rat(a.n * b.n, a.d * b.d); }
function div(a: Rational, b: Rational): Rational {
  assert.notEqual(b.n, 0n);
  return rat(a.n * b.d, a.d * b.n);
}
function add(a: Rational, b: Rational): Rational { return rat(a.n * b.d + b.n * a.d, a.d * b.d); }
function sub(a: Rational, b: Rational): Rational { return rat(a.n * b.d - b.n * a.d, a.d * b.d); }
function format(value: Rational): string { return value.d === 1n ? String(value.n) : `${value.n}/${value.d}`; }
function factorial(n: number): bigint {
  let result = 1n;
  for (let value = 2; value <= n; value += 1) result *= BigInt(value);
  return result;
}

function solveOracle(oracle: SapCp005Oracle): string {
  const d = oracle.data;
  switch (oracle.kind) {
    case "SAP-CP005-PROT-MULTI-FRACTION-CHAIN": {
      const left = mul(rat(d.x!, d.y!), rat(d.y!, d.z!));
      return format(mul(left, rat(d.z! * d.a!, d.x! * d.b!)));
    }
    case "SAP-CP005-PROT-FACTOR-EXTRACTION-CANCEL": return format(rat(d.p!, d.q!));
    case "SAP-CP005-PROT-RATIO-OF-PRODUCTS": return format(rat(d.a! * d.x! * d.y!, d.b! * d.x! * d.y!));
    case "SAP-CP005-PROT-CONSECUTIVE-PRODUCT-RATIO": {
      let numerator = 1n, denominator = 1n;
      for (let i = 0; i < d.span!; i += 1) numerator *= BigInt(d.n! - i);
      for (let i = 1; i < d.span!; i += 1) denominator *= BigInt(d.n! - i);
      return format(rat(numerator, denominator));
    }
    case "SAP-CP005-PROT-LONG-FACTORIAL-RATIO": return format(rat(factorial(d.n!), factorial(d.n! - d.k!)));
    case "SAP-CP005-PROT-PRODUCT-OF-RECIPROCALS": {
      let value = rat(1);
      for (let v = 2; v <= d.n! + 1; v += 1) value = mul(value, rat(v - 1, v));
      return format(value);
    }
    case "SAP-CP005-PROT-DIFFERENCE-OF-SQUARES": return format(rat(d.x! * d.x! - d.y! * d.y!, d.x! - d.y!));
    case "SAP-CP005-PROT-NUMERIC-CONJUGATE-PRODUCT": return String((d.x! + d.y!) * (d.x! - d.y!));
    case "SAP-CP005-PROT-NESTED-RECIPROCAL-CHAIN": return format(div(rat(d.x!), div(rat(d.y!), rat(d.z!))));
    case "SAP-CP005-PROT-TELESCOPING-SUM": {
      let value = rat(0);
      for (let n = d.start!; n <= d.end!; n += 1) value = add(value, sub(rat(1, n), rat(1, n + 1)));
      return format(value);
    }
    case "SAP-CP005-PROT-TELESCOPING-PRODUCT": {
      let value = rat(1);
      for (let n = d.start!; n <= d.end!; n += 1) value = mul(value, rat(n + 1, n));
      return format(value);
    }
    case "SAP-CP005-PROT-ONE-PLUS-MINUS-CHAIN": {
      let value = rat(1);
      for (let n = d.start!; n <= d.end!; n += 1) {
        value = mul(value, rat(n - 1, n));
        value = mul(value, rat(n + 1, n));
      }
      return format(value);
    }
    case "SAP-CP005-PROT-MISSING-FACTOR-CANCELLATION": {
      assert.equal(format(mul(rat(d.x!, d.y!), rat(d.missing!, d.x!))), String(d.target!));
      return String(d.missing!);
    }
    case "SAP-CP005-PROT-ILLEGAL-CANCELLATION-DIAGNOSIS":
      assert.notEqual(format(rat(d.x! + d.y!, d.x!)), String(1 + d.y!));
      return "Cancellation across addition is invalid";
  }
}

const BANNED = /\b(?:AST|RPN|canonical payload|canonical evaluator|generation identity|prototype id|runtime seed|fingerprint)\b/i;

assert.equal(SAP_CP005_PROTOTYPE_IDS.length, 14);
assert.equal(SAP_CP005_CATALOGUE.length, 14);
assert.deepEqual(
  SAP_CP005_CATALOGUE.map((item) => item.proposedPermanentQlId),
  Array.from({ length: 14 }, (_, index) => `SAP-QL-${String(72 + index).padStart(3, "0")}`),
);
assert.equal(new Set(SAP_CP005_CATALOGUE.map((item) => item.proposedPermanentQlId)).size, 14);

const sweep = generateSapCp005Sweep(100);
assert.equal(sweep.length, 1_400);

const identities = new Set<string>();
const payloadsByPrototype = new Map<string, Set<string>>();
const counts = new Map<string, number>();
const difficulties = new Set<string>();
const directions = new Set<string>();

for (const pkg of sweep) {
  assert.equal(pkg.validation.ok, true, `${pkg.prototypeId}/${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(solveOracle(pkg.oracle), pkg.canonicalAnswer, `${pkg.prototypeId}/${pkg.seed}: independent unsimplified oracle mismatch.`);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId) && option.analysis.length >= 35));
  assert.ok(pkg.explanation.coreConcept.length >= 70);
  assert.ok(pkg.explanation.steps.length >= 2);
  assert.ok(pkg.explanation.cancellationMap.length >= 2);
  assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer));
  assert.equal(pkg.proposedPermanentQlId, SAP_CP005_PROPOSED_QL_BY_PROTOTYPE[pkg.prototypeId]);
  assert.equal(pkg.lifecycle.permanentQlId, null);
  assert.equal(pkg.lifecycle.contentStatus, "ENGLISH_REVIEW_CANDIDATE");
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);
  assert.doesNotMatch([
    pkg.stem,
    pkg.explanation.coreConcept,
    ...pkg.explanation.steps,
    pkg.explanation.finalAnswer,
    ...pkg.explanation.cancellationMap,
    ...pkg.options.map((option) => `${option.value} ${option.analysis}`),
  ].join("\n"), BANNED);
  assert.ok(!identities.has(pkg.generationIdentity), `${pkg.prototypeId}/${pkg.seed}: generation identity repeated.`);
  identities.add(pkg.generationIdentity);

  const set = payloadsByPrototype.get(pkg.prototypeId) ?? new Set<string>();
  set.add(pkg.canonicalPayloadKey);
  payloadsByPrototype.set(pkg.prototypeId, set);
  counts.set(pkg.prototypeId, (counts.get(pkg.prototypeId) ?? 0) + 1);
  difficulties.add(pkg.difficulty);
  directions.add(pkg.taskDirection);
}

assert.equal(identities.size, 1_400);
for (const prototypeId of SAP_CP005_PROTOTYPE_IDS) {
  assert.equal(counts.get(prototypeId), 100);
  assert.ok((payloadsByPrototype.get(prototypeId)?.size ?? 0) >= 6, `${prototypeId} has a collapsed variable pool.`);
}
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...directions].sort(), ["DIAGNOSIS", "FORWARD", "INVERSE"]);

console.log(`SAP-CP-005 foundation authority passed: ${sweep.length} deterministic cases across ${SAP_CP005_PROTOTYPE_IDS.length} solve modes.`);
