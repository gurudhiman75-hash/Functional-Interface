import assert from "node:assert/strict";
import {
  SAP_CP005_WAVE2_CATALOGUE,
  SAP_CP005_WAVE2_PROPOSED_QL_BY_PROTOTYPE,
  SAP_CP005_WAVE2_PROTOTYPE_IDS,
  generateSapCp005Wave2Sweep,
  type SapCp005Wave2Oracle,
} from "./runtime-wave2";

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
function format(value: Rational): string { return value.d === 1n ? String(value.n) : `${value.n}/${value.d}`; }

function solveUnsimplified(oracle: SapCp005Wave2Oracle): string {
  const d = oracle.data;
  switch (oracle.kind) {
    case "SAP-CP005-PROT-COMMON-FACTOR-BEFORE-MULTIPLY":
      return format(mul(rat(d.p!, d.q!), rat(d.r!)));

    case "SAP-CP005-PROT-REPEATED-COMMON-FACTOR-BLOCKS":
      return format(rat((d.a! * d.b!) * d.u! * d.v!, (d.a! * d.b!) * d.w! * d.z!));

    case "SAP-CP005-PROT-SYMMETRIC-FRACTION-PAIR": {
      const firstBracket = add(rat(d.a!, d.b!), rat(d.b!, d.a!));
      const displayedDivisor = rat(d.a! * d.a! + d.b! * d.b!, d.a! * d.b!);
      return format(div(firstBracket, displayedDivisor));
    }

    case "SAP-CP005-PROT-REPEATED-BLOCK-COMPRESSION":
      return format(rat(d.k! * d.a! + d.k! * d.b!, d.k! * d.c!));

    case "SAP-CP005-PROT-BEST-FIRST-CANCELLATION": {
      assert.equal(Number(gcd(BigInt(d.p!), BigInt(d.q!))), d.k!, "Declared first reduction is not the HCF.");
      assert.equal(d.p!, d.k! * d.m!);
      assert.equal(d.q!, d.k! * d.n!);
      return `Reduce ${d.p!}/${d.q!} by the common factor ${d.k!} first`;
    }

    case "SAP-CP005-PROT-RAW-VS-STRUCTURAL-ROUTE": {
      const rawRoute = rat(d.p! * d.r!, d.q! * d.s!);
      const structuralRoute = mul(rat(d.m!, d.n!), rat(d.r!, d.s!));
      assert.equal(format(rawRoute), format(structuralRoute), "Raw and structural routes changed the exact value.");
      assert.ok(d.p! * d.r! >= d.m! * d.r!, "Raw numerator is not at least as large as the structurally reduced numerator.");
      assert.ok(d.q! * d.s! >= d.n! * d.s!, "Raw denominator is not at least as large as the structurally reduced denominator.");
      return "Both routes are valid, but Route B is more efficient";
    }
  }
}

const BANNED = /\b(?:AST|RPN|canonical payload|canonical evaluator|generation identity|prototype id|runtime seed|fingerprint)\b/i;

assert.equal(SAP_CP005_WAVE2_PROTOTYPE_IDS.length, 6);
assert.equal(SAP_CP005_WAVE2_CATALOGUE.length, 6);
assert.deepEqual(
  SAP_CP005_WAVE2_CATALOGUE.map((item) => item.proposedPermanentQlId),
  Array.from({ length: 6 }, (_, index) => `SAP-QL-${String(86 + index).padStart(3, "0")}`),
);
assert.equal(new Set(SAP_CP005_WAVE2_CATALOGUE.map((item) => item.proposedPermanentQlId)).size, 6);

const sweep = generateSapCp005Wave2Sweep(100);
assert.equal(sweep.length, 600);

const identities = new Set<string>();
const payloadsByPrototype = new Map<string, Set<string>>();
const counts = new Map<string, number>();
const directions = new Set<string>();
const difficulties = new Set<string>();

for (const pkg of sweep) {
  assert.equal(pkg.validation.ok, true, `${pkg.prototypeId}/${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(solveUnsimplified(pkg.oracle), pkg.canonicalAnswer, `${pkg.prototypeId}/${pkg.seed}: independent unsimplified verification mismatch.`);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId) && option.analysis.length >= 45));
  assert.ok(pkg.explanation.coreConcept.length >= 100);
  assert.ok(pkg.explanation.steps.length >= 2);
  assert.ok(pkg.explanation.cancellationMap.length >= 2);
  assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer));
  assert.equal(pkg.proposedPermanentQlId, SAP_CP005_WAVE2_PROPOSED_QL_BY_PROTOTYPE[pkg.prototypeId]);
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

  const payloads = payloadsByPrototype.get(pkg.prototypeId) ?? new Set<string>();
  payloads.add(pkg.canonicalPayloadKey);
  payloadsByPrototype.set(pkg.prototypeId, payloads);
  counts.set(pkg.prototypeId, (counts.get(pkg.prototypeId) ?? 0) + 1);
  directions.add(pkg.taskDirection);
  difficulties.add(pkg.difficulty);
}

assert.equal(identities.size, 600);
for (const prototypeId of SAP_CP005_WAVE2_PROTOTYPE_IDS) {
  assert.equal(counts.get(prototypeId), 100);
  assert.ok((payloadsByPrototype.get(prototypeId)?.size ?? 0) >= 6, `${prototypeId} has a collapsed variable pool.`);
}
assert.deepEqual([...directions].sort(), ["FORWARD", "STRATEGY"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);

console.log(`SAP-CP-005 wave-two authority passed: ${sweep.length} deterministic cases across ${SAP_CP005_WAVE2_PROTOTYPE_IDS.length} solve modes.`);
