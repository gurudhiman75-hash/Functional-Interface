import assert from "node:assert/strict";
import {
  SAP_CP010_CATALOGUE,
  SAP_CP010_POLICY,
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010,
  type SapCp010Package,
} from "./exam-runtime";

function nearestIntegerSqrtByIntegers(n: number): number {
  const k = Math.floor(Math.sqrt(n));
  if (k * k === n) return k;
  return 4 * n < (2 * k + 1) ** 2 ? k : k + 1;
}

function nearestIntegerCbrtByIntegers(n: number): number {
  let k = 0;
  while ((k + 1) ** 3 <= n) k += 1;
  if (k ** 3 === n) return k;
  return 8 * n < (2 * k + 1) ** 3 ? k : k + 1;
}

function verify(pkg: SapCp010Package): void {
  const d = pkg.oracle.data;
  switch (pkg.prototypeId) {
    case "SAP-CP010-PROT-SQRT-INTERVAL":
      assert.ok(Number(d.lower) ** 2 < Number(d.n));
      assert.ok(Number(d.n) < Number(d.upper) ** 2);
      assert.equal(Number(d.upper), Number(d.lower) + 1);
      break;
    case "SAP-CP010-PROT-CBRT-INTERVAL":
      assert.ok(Number(d.lower) ** 3 < Number(d.n));
      assert.ok(Number(d.n) < Number(d.upper) ** 3);
      assert.equal(Number(d.upper), Number(d.lower) + 1);
      break;
    case "SAP-CP010-PROT-FOURTH-ROOT-INTERVAL":
      assert.ok(Number(d.lower) ** 4 < Number(d.n));
      assert.ok(Number(d.n) < Number(d.upper) ** 4);
      assert.equal(Number(d.upper), Number(d.lower) + 1);
      break;
    case "SAP-CP010-PROT-NEAREST-INTEGER-SQRT":
      assert.equal(Number(pkg.canonicalAnswer), nearestIntegerSqrtByIntegers(Number(d.n)));
      break;
    case "SAP-CP010-PROT-NEAREST-INTEGER-CBRT":
      assert.equal(Number(pkg.canonicalAnswer), nearestIntegerCbrtByIntegers(Number(d.n)));
      break;
    case "SAP-CP010-PROT-INTEGER-ROOT-BOUND": {
      const n = Number(d.n), degree = Number(d.degree), lower = Number(d.lower), upper = Number(d.upper);
      assert.ok(lower ** degree < n && n < upper ** degree);
      assert.equal(pkg.canonicalAnswer, String(d.kind === "LOWER" ? lower : upper));
      break;
    }
    case "SAP-CP010-PROT-DECIMAL-POWER-ESTIMATE":
      assert.equal(Number(pkg.canonicalAnswer), Number(d.rounded) ** Number(d.exponent));
      assert.ok(Math.abs(Number(d.raw) - Number(d.rounded)) < 0.5);
      break;
    case "SAP-CP010-PROT-PERCENT-POWER-FACTOR": {
      const expected = (Number(d.roundedPercent) / 100) ** Number(d.exponent);
      assert.ok(Math.abs(Number(pkg.canonicalAnswer) - expected) < 1e-9);
      assert.ok(Math.abs(Number(d.percent) - Number(d.roundedPercent)) < 5);
      break;
    }
    case "SAP-CP010-PROT-RECIPROCAL-BENCHMARK":
      assert.equal(pkg.canonicalAnswer, `1/${d.rounded}`);
      assert.ok(Math.abs(Number(d.raw) - Number(d.rounded)) < 0.5);
      assert.notEqual(Number(d.rounded), 0);
      break;
    case "SAP-CP010-PROT-ROOT-PRODUCT":
      assert.equal(nearestIntegerSqrtByIntegers(Number(d.n1)), Number(d.r1));
      assert.equal(nearestIntegerSqrtByIntegers(Number(d.n2)), Number(d.r2));
      assert.equal(Number(pkg.canonicalAnswer), Number(d.r1) * Number(d.r2));
      break;
    case "SAP-CP010-PROT-ROOT-QUOTIENT":
      assert.equal(nearestIntegerSqrtByIntegers(Number(d.n)), Number(d.numeratorRoot));
      assert.equal(nearestIntegerSqrtByIntegers(Number(d.d)), Number(d.divisorRoot));
      assert.notEqual(Number(d.divisorRoot), 0);
      assert.equal(Number(pkg.canonicalAnswer), Number(d.numeratorRoot) / Number(d.divisorRoot));
      break;
    case "SAP-CP010-PROT-MIXED-POWER-ROOT":
      assert.equal(nearestIntegerSqrtByIntegers(Number(d.n)), Number(d.root));
      assert.ok(Math.abs(Number(d.raw) - Number(d.roundedBase)) < 0.5);
      assert.equal(Number(pkg.canonicalAnswer), Number(d.root) + Number(d.roundedBase) ** 2);
      break;
    case "SAP-CP010-PROT-MISSING-RADICAND":
      assert.equal(nearestIntegerSqrtByIntegers(Number(pkg.canonicalAnswer)), Number(d.k));
      break;
    case "SAP-CP010-PROT-MISSING-POWER-BASE":
      assert.ok(Math.abs(Number(d.correct) - Number(d.rounded)) < 0.5);
      assert.equal(Number(d.rounded) ** Number(d.exponent), Number(d.target));
      assert.equal(pkg.canonicalAnswer, String(d.correct));
      break;
    case "SAP-CP010-PROT-NEAREST-OPTION-SPECIAL-FORM":
      if (d.kind === "ROOT") assert.equal(Number(pkg.canonicalAnswer), nearestIntegerSqrtByIntegers(Number(d.n)));
      else assert.equal(Number(pkg.canonicalAnswer), Number(d.rounded) ** Number(d.exponent));
      break;
    case "SAP-CP010-PROT-COMPARE-ROOT-POWER": {
      assert.equal(nearestIntegerSqrtByIntegers(Number(d.n)), Number(d.rootValue));
      assert.ok(Math.abs(Number(d.raw) - Number(d.roundedBase)) < 0.5);
      const cmp = Number(d.rootValue) - Number(d.powerValue);
      assert.equal(pkg.canonicalAnswer, cmp < 0 ? "A < B" : cmp > 0 ? "A > B" : "A = B");
      break;
    }
    case "SAP-CP010-PROT-WRONG-BENCHMARK-DIAGNOSIS":
      assert.equal(nearestIntegerSqrtByIntegers(Number(d.n)), Number(d.correctRoot));
      assert.notEqual(Number(d.correctRoot), Number(d.wrongRoot));
      assert.ok(pkg.canonicalAnswer.includes(`Use ${d.correctRoot}`));
      break;
  }
}

const payloads = new Set<string>();
const identities = new Set<string>();
const qls = new Set<string>();
const positions = [0, 0, 0, 0];
const compareRelations = new Set<string>();
const nearestKinds = new Set<string>();
let total = 0;

assert.equal(SAP_CP010_POLICY, "BENCHMARK_BRACKETING_AND_DECLARED_ROUNDING");
assert.equal(SAP_CP010_CATALOGUE.length, 17);
assert.deepEqual(
  SAP_CP010_CATALOGUE.map((entry) => entry.proposedPermanentQlId),
  Array.from({ length: 17 }, (_, index) => `SAP-QL-${String(166 + index).padStart(3, "0")}`),
);

for (const prototypeId of SAP_CP010_PROTOTYPE_IDS) {
  const localStems = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const pkg = generateSapCp010(prototypeId, seed);
    assert.equal(pkg.validation.ok, true, `${prototypeId}:${seed}: ${pkg.validation.errors.join("; ")}`);
    assert.equal(pkg.options.length, 4);
    assert.equal(new Set(pkg.options.map((o) => o.value)).size, 4);
    assert.equal(pkg.options.filter((o) => o.isCorrect).length, 1);
    assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
    assert.ok(pkg.explanation.steps.length >= 2 && pkg.explanation.steps.length <= 3);
    assert.ok(pkg.stem.length <= 220);
    const studentText = `${pkg.stem} ${pkg.canonicalAnswer} ${pkg.options.map((o) => o.value).join(" ")} ${pkg.explanation.coreConcept} ${pkg.explanation.steps.join(" ")} ${pkg.explanation.verification.join(" ")}`;
    assert.doesNotMatch(studentText, /oracle|runtime|prototype|canonical|internal|guard|machine policy|newton|taylor|logarithmic interpolation|binomial series/i);
    assert.doesNotMatch(studentText, /-?\d+\.\d{6,}/, `${prototypeId}:${seed}: raw floating-point display`);
    assert.doesNotMatch(pkg.stem, /using\s+-?\d+(?:\.\d+)?\s+for\s+-?\d+(?:\.\d+)?/i, `${prototypeId}:${seed}: stem supplies replacement value`);
    assert.equal(pkg.lifecycle.permanentQlId, null);
    assert.equal(pkg.lifecycle.contentStatus, "ENGLISH_REVIEW_CANDIDATE");
    assert.equal(pkg.lifecycle.active, false);
    assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
    assert.equal(pkg.lifecycle.questionBankWritable, false);
    assert.equal(pkg.lifecycle.testEligible, false);
    assert.equal(pkg.lifecycle.publiclyPublishable, false);
    verify(pkg);
    assert.ok(!payloads.has(pkg.canonicalPayloadKey), `${prototypeId}:${seed}: duplicate payload`);
    assert.ok(!identities.has(pkg.generationIdentity), `${prototypeId}:${seed}: duplicate generation identity`);
    assert.ok(!localStems.has(pkg.stem), `${prototypeId}:${seed}: duplicate visible stem`);
    payloads.add(pkg.canonicalPayloadKey);
    identities.add(pkg.generationIdentity);
    localStems.add(pkg.stem);
    positions[pkg.correctIndex]! += 1;
    qls.add(pkg.proposedPermanentQlId);
    total += 1;
    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[14]) nearestKinds.add(String(pkg.oracle.data.kind));
    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[15]) compareRelations.add(pkg.canonicalAnswer);
  }
  assert.equal(localStems.size, 100, `${prototypeId}: expected 100 unique stems`);
}

assert.equal(total, 1700);
assert.equal(payloads.size, 1700);
assert.equal(identities.size, 1700);
assert.deepEqual(positions, [425, 425, 425, 425]);
assert.deepEqual([...qls].sort(), Array.from({ length: 17 }, (_, index) => `SAP-QL-${String(166 + index).padStart(3, "0")}`));
assert.deepEqual([...nearestKinds].sort(), ["POWER", "ROOT"]);
assert.deepEqual([...compareRelations].sort(), ["A < B", "A = B", "A > B"].sort());

console.log("SAP-CP-010 authority passed: 1,700 benchmark/bracketing states across 17 identities; exact 425/425/425/425 answers; no advanced numerical methods; all delivery surfaces inactive.");
