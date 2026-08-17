import assert from "node:assert/strict";
import {
  SAP_CP010_CATALOGUE,
  SAP_CP010_POLICY,
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010,
  type SapCp010Package,
} from "./final-runtime";

function nearestSqrt(n: number): number {
  let k = 0;
  while ((k + 1) * (k + 1) <= n) k += 1;
  if (k * k === n) return k;
  return 4 * n < (2 * k + 1) ** 2 ? k : k + 1;
}

function nearestCbrt(n: number): number {
  let k = 0;
  while ((k + 1) ** 3 <= n) k += 1;
  if (k ** 3 === n) return k;
  return 8 * n < (2 * k + 1) ** 3 ? k : k + 1;
}

function verify(q: SapCp010Package): void {
  const d = q.oracle.data;
  switch (q.prototypeId) {
    case "SAP-CP010-PROT-SQRT-INTERVAL":
      assert.ok(Number(d.lower) ** 2 < Number(d.n) && Number(d.n) < Number(d.upper) ** 2);
      assert.equal(Number(d.upper), Number(d.lower) + 1);
      break;
    case "SAP-CP010-PROT-CBRT-INTERVAL":
      assert.ok(Number(d.lower) ** 3 < Number(d.n) && Number(d.n) < Number(d.upper) ** 3);
      assert.equal(Number(d.upper), Number(d.lower) + 1);
      break;
    case "SAP-CP010-PROT-FOURTH-ROOT-INTERVAL":
      assert.ok(Number(d.lower) ** 4 < Number(d.n) && Number(d.n) < Number(d.upper) ** 4);
      assert.equal(Number(d.upper), Number(d.lower) + 1);
      break;
    case "SAP-CP010-PROT-NEAREST-INTEGER-SQRT":
      assert.equal(Number(q.canonicalAnswer), nearestSqrt(Number(d.n)));
      break;
    case "SAP-CP010-PROT-NEAREST-INTEGER-CBRT":
      assert.equal(Number(q.canonicalAnswer), nearestCbrt(Number(d.n)));
      break;
    case "SAP-CP010-PROT-INTEGER-ROOT-BOUND": {
      const n = Number(d.n), degree = Number(d.degree), lo = Number(d.lower), hi = Number(d.upper);
      assert.ok(lo ** degree < n && n < hi ** degree);
      assert.equal(q.canonicalAnswer, String(d.kind === "LOWER" ? lo : hi));
      break;
    }
    case "SAP-CP010-PROT-DECIMAL-POWER-ESTIMATE":
      assert.ok(Math.abs(Number(d.raw) - Number(d.rounded)) < 0.5);
      assert.equal(Number(q.canonicalAnswer), Number(d.rounded) ** Number(d.exponent));
      break;
    case "SAP-CP010-PROT-PERCENT-POWER-FACTOR":
      assert.ok(Math.abs(Number(d.percent) - Number(d.roundedPercent)) < 5);
      assert.ok(Math.abs(Number(q.canonicalAnswer) - (Number(d.roundedPercent) / 100) ** Number(d.exponent)) < 1e-9);
      break;
    case "SAP-CP010-PROT-RECIPROCAL-BENCHMARK":
      assert.ok(Math.abs(Number(d.raw) - Number(d.rounded)) < 0.5);
      assert.notEqual(Number(d.rounded), 0);
      assert.equal(q.canonicalAnswer, `1/${d.rounded}`);
      break;
    case "SAP-CP010-PROT-ROOT-PRODUCT":
      assert.equal(nearestSqrt(Number(d.n1)), Number(d.r1));
      assert.equal(nearestSqrt(Number(d.n2)), Number(d.r2));
      assert.equal(Number(q.canonicalAnswer), Number(d.r1) * Number(d.r2));
      break;
    case "SAP-CP010-PROT-ROOT-QUOTIENT":
      assert.equal(nearestSqrt(Number(d.n)), Number(d.numeratorRoot));
      assert.equal(nearestSqrt(Number(d.d)), Number(d.divisorRoot));
      assert.notEqual(Number(d.divisorRoot), 0);
      assert.equal(Number(q.canonicalAnswer), Number(d.numeratorRoot) / Number(d.divisorRoot));
      break;
    case "SAP-CP010-PROT-MIXED-POWER-ROOT":
      assert.equal(nearestSqrt(Number(d.n)), Number(d.root));
      assert.ok(Math.abs(Number(d.raw) - Number(d.roundedBase)) < 0.5);
      assert.equal(Number(q.canonicalAnswer), Number(d.root) + Number(d.roundedBase) ** 2);
      break;
    case "SAP-CP010-PROT-MISSING-RADICAND":
      assert.equal(nearestSqrt(Number(q.canonicalAnswer)), Number(d.k));
      break;
    case "SAP-CP010-PROT-MISSING-POWER-BASE":
      assert.ok(Math.abs(Number(d.correct) - Number(d.rounded)) < 0.5);
      assert.equal(Number(d.rounded) ** Number(d.exponent), Number(d.target));
      assert.equal(q.canonicalAnswer, String(d.correct));
      break;
    case "SAP-CP010-PROT-NEAREST-OPTION-SPECIAL-FORM":
      if (d.kind === "ROOT") assert.equal(Number(q.canonicalAnswer), nearestSqrt(Number(d.n)));
      else assert.equal(Number(q.canonicalAnswer), Number(d.rounded) ** Number(d.exponent));
      break;
    case "SAP-CP010-PROT-COMPARE-ROOT-POWER": {
      assert.equal(nearestSqrt(Number(d.n)), Number(d.rootValue));
      assert.ok(Math.abs(Number(d.raw) - Number(d.roundedBase)) < 0.5);
      const diff = Number(d.rootValue) - Number(d.powerValue);
      assert.equal(q.canonicalAnswer, diff < 0 ? "A < B" : diff > 0 ? "A > B" : "A = B");
      break;
    }
    case "SAP-CP010-PROT-WRONG-BENCHMARK-DIAGNOSIS":
      assert.equal(nearestSqrt(Number(d.n)), Number(d.correctRoot));
      assert.notEqual(Number(d.correctRoot), Number(d.wrongRoot));
      assert.ok(q.canonicalAnswer.includes(`Use ${d.correctRoot}`));
      break;
  }
}

assert.equal(SAP_CP010_POLICY, "BENCHMARK_BRACKETING_AND_DECLARED_ROUNDING");
assert.equal(SAP_CP010_CATALOGUE.length, 17);
assert.deepEqual(SAP_CP010_CATALOGUE.map((x) => x.proposedPermanentQlId), Array.from({ length: 17 }, (_, i) => `SAP-QL-${String(166 + i).padStart(3, "0")}`));

const payloads = new Set<string>();
const identities = new Set<string>();
const qls = new Set<string>();
const positions = [0, 0, 0, 0];
const nearestKinds = new Set<string>();
const relations = new Set<string>();
let total = 0;

for (const prototypeId of SAP_CP010_PROTOTYPE_IDS) {
  const stems = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = generateSapCp010(prototypeId, seed);
    assert.equal(q.validation.ok, true, `${prototypeId}:${seed}: ${q.validation.errors.join("; ")}`);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.value)).size, 4);
    assert.equal(q.options.filter((o) => o.isCorrect).length, 1);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 3);
    assert.ok(q.stem.length <= 220);
    const visible = `${q.stem} ${q.canonicalAnswer} ${q.options.map((o) => o.value).join(" ")} ${q.explanation.coreConcept} ${q.explanation.steps.join(" ")} ${q.explanation.verification.join(" ")}`;
    assert.doesNotMatch(visible, /oracle|runtime|prototype|canonical|internal|guard|machine policy|newton|taylor|logarithmic interpolation|binomial series/i);
    assert.doesNotMatch(visible, /-?\d+\.\d{6,}/);
    assert.doesNotMatch(q.stem, /using\s+-?\d+(?:\.\d+)?\s+for\s+-?\d+(?:\.\d+)?/i);
    assert.equal(q.lifecycle.permanentQlId, null);
    assert.equal(q.lifecycle.contentStatus, "ENGLISH_REVIEW_CANDIDATE");
    assert.equal(q.lifecycle.active, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    verify(q);
    assert.ok(!payloads.has(q.canonicalPayloadKey), `${prototypeId}:${seed}: duplicate payload`);
    assert.ok(!identities.has(q.generationIdentity), `${prototypeId}:${seed}: duplicate identity`);
    assert.ok(!stems.has(q.stem), `${prototypeId}:${seed}: duplicate visible stem`);
    payloads.add(q.canonicalPayloadKey);
    identities.add(q.generationIdentity);
    stems.add(q.stem);
    positions[q.correctIndex]! += 1;
    qls.add(q.proposedPermanentQlId);
    total += 1;
    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[14]) nearestKinds.add(String(q.oracle.data.kind));
    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[15]) relations.add(q.canonicalAnswer);
  }
  assert.equal(stems.size, 100);
}

assert.equal(total, 1700);
assert.equal(payloads.size, 1700);
assert.equal(identities.size, 1700);
assert.deepEqual(positions, [425, 425, 425, 425]);
assert.deepEqual([...qls].sort(), Array.from({ length: 17 }, (_, i) => `SAP-QL-${String(166 + i).padStart(3, "0")}`));
assert.deepEqual([...nearestKinds].sort(), ["POWER", "ROOT"]);
assert.deepEqual([...relations].sort(), ["A < B", "A = B", "A > B"].sort());

console.log("SAP-CP-010 final authority passed: 1,700 certified benchmark states across 17 identities, exact 425/425/425/425 answer balance, 100 unique stems per identity and inactive lifecycle.");
