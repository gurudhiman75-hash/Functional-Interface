import assert from "node:assert/strict";
import { SAP_CP011_E2_STRUCTURES, generateSapCp011E2 } from "./SAP-002/SAP-CP-011/runtime-final";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 } from "./SAP-002/SAP-CP-012/runtime-final";
import type { SapE2Package } from "./SAP-E2-TYPES";

const families = [
  ...SAP_CP011_E2_STRUCTURES.map(id => ({ id, checkpoint: "SAP-CP-011" as const, generate: (seed: number) => generateSapCp011E2(id, seed) })),
  ...SAP_CP012_E2_STRUCTURES.map(id => ({ id, checkpoint: "SAP-CP-012" as const, generate: (seed: number) => generateSapCp012E2(id, seed) })),
];
assert.equal(families.length, 24);
assert.equal(new Set(families.map(f => f.id)).size, 24);

function n(q: SapE2Package, key: string): number {
  const value = Number(q.oracle.data[key]);
  if (!Number.isFinite(value)) throw new Error(`${q.structureId}/${q.seed}: missing numeric oracle ${key}`);
  return value;
}
function assertNearest(q: SapE2Package, exact: number): void {
  const values = q.options.map(o => Number(o.value));
  assert.ok(values.every(Number.isFinite), `${q.structureId}/${q.seed}: numeric nearest-option family has non-numeric option.`);
  const distances = values.map(v => Math.abs(v - exact));
  const best = Math.min(...distances);
  assert.equal(distances.filter(d => Math.abs(d - best) < 1e-10).length, 1, `${q.structureId}/${q.seed}: nearest option is not unique.`);
  assert.equal(distances[q.correctIndex], best, `${q.structureId}/${q.seed}: correct option is not nearest.`);
}

function verifyCp011(q: SapE2Package): void {
  const d = q.oracle.data;
  switch (q.structureId) {
    case "CP011-E2-CLOSEST-MIXED-EXPRESSION": {
      const exact = n(q,"x100") / 100 * (n(q,"y100") / 100) + n(q,"z100") / 100;
      assertNearest(q, exact); return;
    }
    case "CP011-E2-CLOSEST-FRACTION-PRODUCT": {
      const exact = n(q,"exactNumerator") / n(q,"exactDenominator");
      assertNearest(q, exact); return;
    }
    case "CP011-E2-NEAREST-MULTIPLE-TEN": {
      const exact = n(q,"x100") / 100 * (n(q,"y100") / 100) - n(q,"z100") / 100;
      assert.equal(Number(q.canonicalAnswer) % 10, 0);
      assertNearest(q, exact); return;
    }
    case "CP011-E2-CLOSEST-ROOT-OPTION": {
      const exact = Math.sqrt(n(q,"radicand100") / 100) * (n(q,"multiplier100") / 100) + n(q,"c");
      assertNearest(q, exact); return;
    }
    case "CP011-E2-ABSOLUTE-ERROR": {
      const error100 = Math.abs(n(q,"exact100") - n(q,"estimate100"));
      assert.equal(Number(q.canonicalAnswer), error100 / 100); return;
    }
    case "CP011-E2-PERCENTAGE-ERROR": {
      const exact = n(q,"exact"), estimate = n(q,"estimate100") / 100;
      const pct = Math.abs(estimate - exact) / exact * 100;
      assert.ok(Math.abs(pct - n(q,"pct")) < 1e-9);
      assert.equal(q.canonicalAnswer, `${n(q,"pct")}%`); return;
    }
    case "CP011-E2-OVER-UNDER-DIRECTION": {
      const exact = n(q,"x100") / 100 * (n(q,"y100") / 100);
      const estimate = n(q,"estimate");
      assert.equal(q.canonicalAnswer, estimate > exact ? "Overestimate" : "Underestimate"); return;
    }
    case "CP011-E2-COMPARE-ESTIMATE-ACCURACY": {
      const e1 = Math.abs(n(q,"e1") - n(q,"exact100"));
      const e2 = Math.abs(n(q,"e2") - n(q,"exact100"));
      assert.ok(e1 < e2);
      assert.ok(q.canonicalAnswer.startsWith("Estimate 1")); return;
    }
    case "CP011-E2-COMPOSED-ROUNDING-BOUND": {
      assert.equal(n(q,"lower"), n(q,"sum") - 1);
      assert.equal(n(q,"upper"), n(q,"sum") + 1);
      assert.equal(q.canonicalAnswer, `${n(q,"lower")} < x + y < ${n(q,"upper")}`); return;
    }
    case "CP011-E2-OPTION-WITHIN-TOLERANCE": {
      const exact100 = n(q,"exact100"), tol = n(q,"tolerance100");
      const inside = q.options.filter(o => Math.abs(Number(o.value) * 100 - exact100) <= tol + 1e-9);
      assert.equal(inside.length, 1);
      assert.equal(inside[0]!.value, q.canonicalAnswer); return;
    }
    case "CP011-E2-GUARANTEED-NEAREST-FROM-INTERVAL": {
      const lower = n(q,"lower"), upper = n(q,"upper"), correct = Number(q.canonicalAnswer);
      for (const o of q.options.filter(x => !x.isCorrect)) {
        const competitor = Number(o.value);
        assert.ok(Math.abs(lower - correct) < Math.abs(lower - competitor));
        assert.ok(Math.abs(upper - correct) < Math.abs(upper - competitor));
      }
      return;
    }
    case "CP011-E2-AMBIGUOUS-OPTION-DIAGNOSIS": {
      const midpoint = n(q,"midpoint");
      assert.ok(n(q,"lower") < midpoint && midpoint < n(q,"upper"));
      assert.equal(q.canonicalAnswer, "No unique nearest option can be guaranteed"); return;
    }
    default: throw new Error(`Unknown CP011 structure ${q.structureId}`);
  }
}

function integerCountStrict(lower: number, upper: number): number {
  let count = 0;
  for (let x = Math.floor(lower) - 2; x <= Math.ceil(upper) + 2; x += 1) if (lower < x && x < upper) count += 1;
  return count;
}
function verifyCp012(q: SapE2Package): void {
  switch (q.structureId) {
    case "CP012-E2-MISSING-ADDEND-MIXED": assert.equal(Number(q.canonicalAnswer), n(q,"a") * n(q,"m") + n(q,"c") - n(q,"d")); return;
    case "CP012-E2-MISSING-MULTIPLIER": assert.equal(Number(q.canonicalAnswer), (n(q,"rhs") - n(q,"c")) / n(q,"a")); return;
    case "CP012-E2-MISSING-DIVISOR": assert.equal(Number(q.canonicalAnswer), n(q,"x") * n(q,"b") / (n(q,"target") - n(q,"c"))); return;
    case "CP012-E2-MISSING-SQUARE-ROOT": assert.equal(Number(q.canonicalAnswer) ** 2, n(q,"left") - n(q,"b") ** 2 + n(q,"c")); return;
    case "CP012-E2-MISSING-CUBE-ROOT": assert.equal(Number(q.canonicalAnswer) ** 3, n(q,"target") - n(q,"base") ** 2 + n(q,"c")); return;
    case "CP012-E2-MISSING-ROOT-RATIO": assert.equal(Number(q.canonicalAnswer), n(q,"multiplier") * n(q,"root1") / n(q,"root2")); return;
    case "CP012-E2-MISSING-PERCENTAGE": assert.equal(Number(q.canonicalAnswer.replace("%","")), (n(q,"rhs") - n(q,"c")) / n(q,"base") * 100); return;
    case "CP012-E2-TWO-SIDED-MIXED-EQUATION": assert.equal(Number(q.canonicalAnswer), n(q,"left") - n(q,"rightKnown")); return;
    case "CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE": {
      const known = n(q,"known100") / 100, target = n(q,"target100") / 100, tol = n(q,"tolerance100") / 100;
      const valid = q.options.filter(o => Math.abs(known + Number(o.value) - target) <= tol + 1e-9);
      assert.equal(valid.length, 1);
      assert.equal(valid[0]!.value, q.canonicalAnswer); return;
    }
    case "CP012-E2-COUNT-ADMISSIBLE-INTEGERS": {
      const lower = n(q,"lower10") / 10, upper = n(q,"upper10") / 10;
      let count = 0;
      for (let x = Math.ceil(lower); x <= Math.floor(upper); x += 1) count += 1;
      assert.equal(Number(q.canonicalAnswer), count); return;
    }
    case "CP012-E2-OUTCOME-CLASSIFICATION": {
      const lower = n(q,"lower10") / 10, upper = n(q,"upper10") / 10;
      const count = integerCountStrict(lower, upper);
      const expected = count === 0 ? "Impossible" : count === 1 ? "Unique" : "Multiple";
      assert.equal(q.canonicalAnswer, expected); return;
    }
    case "CP012-E2-ROUNDED-OPERAND-SYNTHESIS": {
      const rounded = (n(q,"result") - n(q,"c")) / n(q,"multiplier");
      assert.equal(rounded, n(q,"rounded"));
      assert.equal(n(q,"lower10"), rounded * 10 - 5);
      assert.equal(n(q,"upper10"), rounded * 10 + 5); return;
    }
    default: throw new Error(`Unknown CP012 structure ${q.structureId}`);
  }
}

const stems = new Set<string>(), payloads = new Set<string>(), identities = new Set<string>();
const positions = [0,0,0,0];
let cp011 = 0, cp012 = 0, bank = 0, ssc = 0, hard = 0;
for (const family of families) {
  const local = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = family.generate(seed);
    assert.equal(q.checkpointId, family.checkpoint);
    assert.equal(q.structureId, family.id);
    assert.equal(q.validation.ok, true, `${q.structureId}/${seed}: ${q.validation.errors.join("; ")}`);
    assert.ok(q.decisionCount >= 2);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(o => o.value)).size, 4);
    assert.equal(q.options.filter(o => o.isCorrect).length, 1);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.doesNotMatch(q.stem, /For estimation, take|Using cancellation|using suitable approximation|oracle|runtime|prototype|canonical|machine policy|learner route|certified gap/i);
    assert.doesNotMatch(q.stem, /[√∛∜]/);
    assert.doesNotMatch(q.options.map(o => o.value).join(" "), /Alternative\s+\d+/i);
    assert.equal(q.lifecycle.permanentQlId, null);
    assert.equal(q.lifecycle.active, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.ok(!local.has(q.stem), `${q.structureId}/${seed}: duplicate stem within structure.`);
    assert.ok(!stems.has(q.stem), `${q.structureId}/${seed}: duplicate stem across E2.`);
    assert.ok(!payloads.has(q.canonicalPayloadKey));
    assert.ok(!identities.has(q.generationIdentity));
    local.add(q.stem); stems.add(q.stem); payloads.add(q.canonicalPayloadKey); identities.add(q.generationIdentity);
    if (q.checkpointId === "SAP-CP-011") { cp011++; verifyCp011(q); } else { cp012++; verifyCp012(q); }
    q.profile === "BANK" ? bank++ : ssc++;
    if (q.difficulty === "HARD") hard++;
    positions[q.correctIndex]! += 1;
  }
  assert.equal(local.size, 100, `${family.id}: expected 100 visible states.`);
}
assert.equal(cp011, 1200); assert.equal(cp012, 1200);
assert.equal(stems.size, 2400); assert.equal(payloads.size, 2400); assert.equal(identities.size, 2400);
assert.deepEqual(positions, [600,600,600,600]);
assert.ok(hard >= 800);
console.log(JSON.stringify({ authority: "SAP-E2-CP011-CP012-V1", structures: 24, states: 2400, checkpoints: { cp011, cp012 }, profiles: { BANK: bank, SSC: ssc }, answerPositions: positions, hardStates: hard, lifecycle: "INACTIVE" }));
