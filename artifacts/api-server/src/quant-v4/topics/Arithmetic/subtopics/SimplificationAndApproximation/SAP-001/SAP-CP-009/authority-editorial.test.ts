import assert from "node:assert/strict";
import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009,
} from "./final-runtime";
import { runCp009Authority } from "./authority-core";

const result = runCp009Authority({
  prototypeIds: SAP_CP009_PROTOTYPE_IDS,
  catalogueLength: SAP_CP009_CATALOGUE.length,
  policy: SAP_CP009_POLICY,
  generate: generateSapCp009,
  seedsPerMode: 100,
});

function roundIndependent(value: number, unit: number): number {
  const lower = Math.floor(value / unit) * unit;
  const upper = lower + unit;
  return value - lower < upper - value ? lower : upper;
}

for (let seed = 1; seed <= 100; seed += 1) {
  for (const prototypeId of [SAP_CP009_PROTOTYPE_IDS[7]!, SAP_CP009_PROTOTYPE_IDS[13]!]) {
    const q = generateSapCp009(prototypeId, seed);
    const d = q.oracle.data;
    assert.equal(Number(d.safeRatioState), 1);
    const pairs = prototypeId === SAP_CP009_PROTOTYPE_IDS[7]
      ? [[Number(d.a), Number(d.aRounded)], [Number(d.b), Number(d.bRounded)]]
      : [
          [Number(d.a), roundIndependent(Number(d.a), 100)],
          [Number(d.b), roundIndependent(Number(d.b), 100)],
          [Number(d.c), roundIndependent(Number(d.c), 100)],
          [Number(d.d), roundIndependent(Number(d.d), 100)],
        ];
    for (const [raw, rounded] of pairs) {
      assert.ok(rounded >= 1000, `${prototypeId}:${seed}: ratio benchmark too small.`);
      assert.ok(Math.abs(raw - rounded) / rounded <= 0.05, `${prototypeId}:${seed}: unsafe ratio substitution.`);
    }
  }

  const nearest = generateSapCp009(SAP_CP009_PROTOTYPE_IDS[12]!, seed);
  if (nearest.oracle.data.kind === "PRODUCT") {
    const d = nearest.oracle.data;
    assert.equal(Number(d.roundUnit), 100);
    assert.equal(roundIndependent(Number(d.a), 100), Number(d.ra));
    assert.equal(roundIndependent(Number(d.b), 100), Number(d.rb));
    assert.equal(nearest.canonicalAnswer, String(Number(d.ra) * Number(d.rb)));
    assert.ok(Number(d.ra) % 100 === 0 && Number(d.rb) % 100 === 0);
  }

  const ratioDiagnosis = generateSapCp009(SAP_CP009_PROTOTYPE_IDS[17]!, seed);
  assert.equal(Number(ratioDiagnosis.oracle.data.safeRatioState), 1);
  assert.equal(roundIndependent(Number(ratioDiagnosis.oracle.data.numerator), 100), Number(ratioDiagnosis.oracle.data.numeratorRounded));
  assert.equal(roundIndependent(Number(ratioDiagnosis.oracle.data.denominator), 100), Number(ratioDiagnosis.oracle.data.denominatorRounded));
  assert.match(ratioDiagnosis.canonicalAnswer, /nearest-hundred values/i);
  assert.doesNotMatch(ratioDiagnosis.canonicalAnswer, /same rounding place/i);
  assert.ok(ratioDiagnosis.stem.includes("safer estimate using nearest hundreds"));

  const classification = generateSapCp009(SAP_CP009_PROTOTYPE_IDS[18]!, seed);
  const d = classification.oracle.data;
  const bothDown = Number(d.a) > Number(d.ra) && Number(d.b) > Number(d.rb);
  const bothUp = Number(d.a) < Number(d.ra) && Number(d.b) < Number(d.rb);
  assert.ok(bothDown || bothUp);
  assert.equal(classification.canonicalAnswer, bothDown ? "Underestimate" : "Overestimate");
  assert.doesNotMatch(classification.explanation.steps.join(" "), /exact product\s*:/i);
}

console.log(`SAP-CP-009 editorial authority passed: ${result.total} states preserve the full proof while enforcing safe ratio substitutions, exam-calculable nearest-product states, precise unsafe-ratio diagnosis and direction-based over/under explanations.`);
