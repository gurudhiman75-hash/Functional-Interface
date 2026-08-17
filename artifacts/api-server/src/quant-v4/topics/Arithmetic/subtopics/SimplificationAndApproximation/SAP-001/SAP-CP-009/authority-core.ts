import assert from "node:assert/strict";
import type { SapCp009Package, SapCp009PrototypeId } from "./runtime-v5";

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}
function frac(n: number, d: number): string {
  let nn = BigInt(n), dd = BigInt(d);
  const g = gcd(nn, dd);
  nn /= g; dd /= g;
  return dd === 1n ? `${nn}` : `${nn}/${dd}`;
}
function roundIndependent(value: number, unit: number): number {
  const lower = Math.floor(value / unit) * unit;
  const upper = lower + unit;
  return value - lower < upper - value ? lower : upper;
}
function basics(pkg: SapCp009Package, policy: string): void {
  assert.equal(pkg.validation.ok, true, `${pkg.prototypeId}:${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.policy, policy);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((o) => o.value)).size, 4);
  assert.equal(pkg.options.filter((o) => o.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.explanation.steps.length >= 2 && pkg.explanation.steps.length <= 3);
  assert.ok(pkg.explanation.coreConcept.length <= 240, `${pkg.prototypeId}:${pkg.seed}: concept too long`);
  for (const step of pkg.explanation.steps) assert.ok(step.length <= 180, `${pkg.prototypeId}:${pkg.seed}: working step too long`);
  const visible = `${pkg.stem} ${pkg.explanation.coreConcept} ${pkg.explanation.steps.join(" ")} ${pkg.explanation.verification.join(" ")} ${pkg.options.map((o) => o.analysis).join(" ")}`;
  assert.doesNotMatch(visible, /oracle|runtime|prototype|canonical payload|learner route|transformed expression|internal|guard/i);
  assert.doesNotMatch(pkg.stem, /apply the declared|machine|authority|canonical/i);
  assert.equal(pkg.lifecycle.permanentQlId, null);
  assert.equal(pkg.lifecycle.contentStatus, "ENGLISH_REVIEW_CANDIDATE");
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);
}
function verify(pkg: SapCp009Package): void {
  const d = pkg.oracle.data;
  switch (pkg.prototypeId) {
    case "SAP-CP009-PROT-ROUNDED-PRODUCT": {
      const ra = roundIndependent(Number(d.a), 10), rb = roundIndependent(Number(d.b), 10);
      assert.equal(ra, Number(d.ra)); assert.equal(rb, Number(d.rb));
      assert.equal(pkg.canonicalAnswer, String(ra * rb)); break;
    }
    case "SAP-CP009-PROT-DECIMAL-PRODUCT": {
      const ra10 = roundIndependent(Number(d.a10), 10), rb10 = roundIndependent(Number(d.b10), 10);
      assert.equal(ra10, Number(d.ra10)); assert.equal(rb10, Number(d.rb10));
      assert.equal(pkg.canonicalAnswer, String((ra10 / 10) * (rb10 / 10))); break;
    }
    case "SAP-CP009-PROT-COMPATIBLE-QUOTIENT": {
      assert.equal(roundIndependent(Number(d.dividend), 10), Number(d.dividendRounded));
      assert.equal(roundIndependent(Number(d.divisor), 10), Number(d.divisorRounded));
      assert.notEqual(Number(d.divisorRounded), 0);
      assert.equal(pkg.canonicalAnswer, String(Number(d.dividendRounded) / Number(d.divisorRounded))); break;
    }
    case "SAP-CP009-PROT-PERCENT-OF-QUANTITY": {
      assert.equal(pkg.canonicalAnswer, String(Number(d.pRounded) * Number(d.qRounded) / 100)); break;
    }
    case "SAP-CP009-PROT-QUANTITY-AS-PERCENT": {
      assert.equal(pkg.canonicalAnswer, `${Number(d.numeratorRounded) / Number(d.denominatorRounded) * 100}%`); break;
    }
    case "SAP-CP009-PROT-PERCENT-FACTOR-PRODUCT": {
      assert.equal(roundIndependent(Number(d.q10), 10), Number(d.qRounded) * 10);
      assert.equal(pkg.canonicalAnswer, String(Number(d.qRounded) * Number(d.factorPercent) / 100)); break;
    }
    case "SAP-CP009-PROT-PRODUCT-QUOTIENT-CHAIN": {
      assert.equal(roundIndependent(Number(d.a), 10), Number(d.aRounded));
      assert.equal(roundIndependent(Number(d.b), 10), Number(d.bRounded));
      assert.equal(roundIndependent(Number(d.divisor), 10), Number(d.divisorRounded));
      assert.notEqual(Number(d.divisorRounded), 0);
      assert.equal(pkg.canonicalAnswer, String(Number(d.aRounded) * Number(d.bRounded) / Number(d.divisorRounded))); break;
    }
    case "SAP-CP009-PROT-COORDINATED-RATIO-SCALING": {
      assert.equal(roundIndependent(Number(d.a), 100), Number(d.aRounded));
      assert.equal(roundIndependent(Number(d.b), 100), Number(d.bRounded));
      assert.equal(pkg.canonicalAnswer, `${d.rp}:${d.rq}`); break;
    }
    case "SAP-CP009-PROT-CANCEL-BEFORE-APPROXIMATION": {
      assert.equal(roundIndependent(Number(d.a), 10), Number(d.ra));
      assert.equal(roundIndependent(Number(d.b), 10), Number(d.rb));
      assert.equal(Number(d.numeratorFactor) / Number(d.denominatorFactor), 2);
      const expected = Math.round((2 * Number(d.ra) / Number(d.rb)) * 10) / 10;
      assert.equal(Number(pkg.canonicalAnswer), expected); break;
    }
    case "SAP-CP009-PROT-RECIPROCAL-THEN-MULTIPLY": {
      assert.notEqual(Number(d.divisorRounded), 0);
      assert.equal(pkg.canonicalAnswer, String(Number(d.numeratorRounded) / Number(d.divisorRounded))); break;
    }
    case "SAP-CP009-PROT-MISSING-APPROX-FACTOR": {
      assert.equal(Number(d.known) * Number(pkg.canonicalAnswer), Number(d.target)); break;
    }
    case "SAP-CP009-PROT-MISSING-APPROX-DIVISOR": {
      assert.equal(Number(d.dividend) / Number(pkg.canonicalAnswer), Number(d.quotient)); break;
    }
    case "SAP-CP009-PROT-NEAREST-OPTION-PRODUCT-QUOTIENT": {
      if (d.kind === "PRODUCT") assert.equal(pkg.canonicalAnswer, String(Number(d.ra) * Number(d.rb)));
      else assert.equal(pkg.canonicalAnswer, String(Number(d.n) / Number(d.d)));
      break;
    }
    case "SAP-CP009-PROT-COMPARE-APPROX-RATIOS": {
      const cmp = Number(d.leftN) * Number(d.rightD) - Number(d.rightN) * Number(d.leftD);
      assert.equal(pkg.canonicalAnswer, cmp < 0 ? "A < B" : cmp > 0 ? "A > B" : "A = B"); break;
    }
    case "SAP-CP009-PROT-POSITIVE-PRODUCT-BOUNDS": {
      assert.equal(pkg.canonicalAnswer, `${(Number(d.ra) - 5) * (Number(d.rb) - 5)} ≤ exact product < ${(Number(d.ra) + 5) * (Number(d.rb) + 5)}`); break;
    }
    case "SAP-CP009-PROT-POSITIVE-QUOTIENT-BOUNDS": {
      assert.ok(Number(d.dLow) > 0);
      assert.equal(pkg.canonicalAnswer, `${frac(Number(d.nLow), Number(d.dHigh))} < exact quotient < ${frac(Number(d.nHigh), Number(d.dLow))}`); break;
    }
    case "SAP-CP009-PROT-DECIMAL-SCALE-DIAGNOSIS": {
      assert.equal(Number(d.wrongValue), Number(d.correct) * 10);
      assert.ok(pkg.canonicalAnswer.includes(String(d.correct))); break;
    }
    case "SAP-CP009-PROT-RATIO-DISTORTION-DIAGNOSIS": {
      assert.equal(roundIndependent(Number(d.numerator), 100), Number(d.numeratorRounded));
      assert.equal(roundIndependent(Number(d.denominator), 100), Number(d.denominatorRounded));
      assert.ok(pkg.canonicalAnswer.includes(`${d.numeratorRounded}:${d.denominatorRounded}`)); break;
    }
    case "SAP-CP009-PROT-PRODUCT-OVER-UNDER-CLASS": {
      const expected = Number(d.estimate) > Number(d.exact) ? "Overestimate" : Number(d.estimate) < Number(d.exact) ? "Underestimate" : "Exact after rounding";
      assert.equal(pkg.canonicalAnswer, expected); break;
    }
  }
}

export interface Cp009AuthorityResult {
  readonly total: number;
  readonly payloads: number;
  readonly identities: number;
  readonly positions: readonly number[];
  readonly qls: readonly string[];
  readonly ratioRelations: readonly string[];
  readonly overUnder: readonly string[];
}

export function runCp009Authority(args: {
  prototypeIds: readonly SapCp009PrototypeId[];
  catalogueLength: number;
  policy: string;
  generate: (prototypeId: SapCp009PrototypeId, seed: number) => SapCp009Package;
  seedsPerMode?: number;
}): Cp009AuthorityResult {
  const seedsPerMode = args.seedsPerMode ?? 100;
  const payloads = new Set<string>();
  const identities = new Set<string>();
  const positions = [0, 0, 0, 0];
  const qls = new Set<string>();
  const ratioRelations = new Set<string>();
  const overUnder = new Set<string>();
  let total = 0;
  for (const prototypeId of args.prototypeIds) {
    const localStems = new Set<string>();
    for (let seed = 1; seed <= seedsPerMode; seed += 1) {
      const pkg = args.generate(prototypeId, seed);
      basics(pkg, args.policy);
      verify(pkg);
      assert.ok(!payloads.has(pkg.canonicalPayloadKey), `${prototypeId}:${seed}: duplicate payload`);
      assert.ok(!identities.has(pkg.generationIdentity), `${prototypeId}:${seed}: duplicate identity`);
      assert.ok(!localStems.has(pkg.stem), `${prototypeId}:${seed}: duplicate visible stem`);
      payloads.add(pkg.canonicalPayloadKey);
      identities.add(pkg.generationIdentity);
      localStems.add(pkg.stem);
      positions[pkg.correctIndex]! += 1;
      qls.add(pkg.proposedPermanentQlId);
      total += 1;
      if (prototypeId === "SAP-CP009-PROT-COMPARE-APPROX-RATIOS") ratioRelations.add(pkg.canonicalAnswer);
      if (prototypeId === "SAP-CP009-PROT-PRODUCT-OVER-UNDER-CLASS") overUnder.add(pkg.canonicalAnswer);
    }
    assert.equal(localStems.size, seedsPerMode, `${prototypeId}: expected ${seedsPerMode} unique stems`);
  }
  assert.equal(total, args.prototypeIds.length * seedsPerMode);
  assert.equal(payloads.size, total);
  assert.equal(identities.size, total);
  assert.equal(args.catalogueLength, 19);
  assert.deepEqual([...qls].sort(), Array.from({ length: 19 }, (_, i) => `SAP-QL-${String(147 + i).padStart(3, "0")}`));
  assert.deepEqual(positions, [total / 4, total / 4, total / 4, total / 4]);
  assert.deepEqual([...ratioRelations].sort(), ["A < B", "A = B", "A > B"].sort());
  assert.ok(overUnder.has("Overestimate"));
  assert.ok(overUnder.has("Underestimate"));
  return Object.freeze({
    total,
    payloads: payloads.size,
    identities: identities.size,
    positions: Object.freeze([...positions]),
    qls: Object.freeze([...qls].sort()),
    ratioRelations: Object.freeze([...ratioRelations].sort()),
    overUnder: Object.freeze([...overUnder].sort()),
  });
}
