import assert from "node:assert/strict";
import {
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010,
} from "./root-depth-runtime";

function intPow(base: number, degree: number): number { return base ** degree; }
function nearestSqrt(n: number): number {
  const k = Math.floor(Math.sqrt(n));
  if (k * k === n) return k;
  return 4 * n < (2 * k + 1) ** 2 ? k : k + 1;
}
function balancedDelimiters(text: string): boolean {
  return (text.match(/\\\(/g) ?? []).length === (text.match(/\\\)/g) ?? []).length;
}

const payloads = new Set<string>();
const identities = new Set<string>();
const positions = [0, 0, 0, 0];
const bands = new Map<number, Set<number>>();
let latexRootStates = 0;

for (const id of SAP_CP010_PROTOTYPE_IDS) {
  const mode = SAP_CP010_PROTOTYPE_IDS.indexOf(id);
  const stems = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = generateSapCp010(id, seed);
    const d = q.oracle.data;
    const visible = `${q.stem} ${q.canonicalAnswer} ${q.options.map((o) => o.value).join(" ")} ${q.explanation.steps.join(" ")} ${q.explanation.verification.join(" ")}`;
    assert.equal(q.validation.ok, true, `${id}:${seed}: ${q.validation.errors.join("; ")}`);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.value)).size, 4);
    assert.equal(q.options.filter((o) => o.isCorrect).length, 1);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.doesNotMatch(visible, /[√∛∜]/, `${id}:${seed}: raw radical leaked.`);
    assert.ok(balancedDelimiters(visible), `${id}:${seed}: unbalanced inline math delimiters.`);
    if (/\\sqrt(?:\[\d+\])?\{\d+\}/.test(visible)) latexRootStates += 1;
    assert.equal(q.lifecycle.active, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.ok(!stems.has(q.stem), `${id}:${seed}: duplicate stem.`);
    assert.ok(!payloads.has(q.canonicalPayloadKey), `${id}:${seed}: duplicate payload.`);
    assert.ok(!identities.has(q.generationIdentity), `${id}:${seed}: duplicate identity.`);
    stems.add(q.stem); payloads.add(q.canonicalPayloadKey); identities.add(q.generationIdentity); positions[q.correctIndex]! += 1;

    if (mode >= 0 && mode <= 2) {
      const n = Number(d.n), degree = Number(d.degree), lo = Number(d.lower), hi = Number(d.upper);
      assert.ok(intPow(lo, degree) < n && n < intPow(hi, degree), `${id}:${seed}: root interval proof failed.`);
      bands.set(mode, bands.get(mode) ?? new Set<number>()); bands.get(mode)!.add(Number(d.band));
      assert.match(q.stem, /\\sqrt/, `${id}:${seed}: typeset radical missing.`);
    }
    if (mode === 3 || mode === 4) {
      const scaled = Number(d.scaled), midpoint = Number(d.midpoint), lo = Number(d.lower), hi = Number(d.upper);
      assert.notEqual(scaled, midpoint, `${id}:${seed}: exact midpoint tie is not allowed.`);
      assert.equal(Number(q.canonicalAnswer), scaled < midpoint ? lo : hi, `${id}:${seed}: nearest-root answer mismatch.`);
      bands.set(mode, bands.get(mode) ?? new Set<number>()); bands.get(mode)!.add(Number(d.band));
    }
    if (mode === 5) {
      const n = Number(d.n), degree = Number(d.degree), lo = Number(d.lower), hi = Number(d.upper);
      assert.ok(intPow(lo, degree) < n && n < intPow(hi, degree));
      assert.equal(Number(q.canonicalAnswer), String(d.kind) === "LOWER" ? lo : hi);
    }
    if (mode === 9) {
      assert.equal(nearestSqrt(Number(d.n1)), Number(d.r1));
      assert.equal(nearestSqrt(Number(d.n2)), Number(d.r2));
      assert.equal(Number(q.canonicalAnswer), Number(d.r1) * Number(d.r2));
    }
    if (mode === 10) {
      assert.equal(nearestSqrt(Number(d.n)), Number(d.numeratorRoot));
      assert.equal(nearestSqrt(Number(d.d)), Number(d.divisorRoot));
      assert.notEqual(Number(d.divisorRoot), 0);
      assert.equal(Number(q.canonicalAnswer), Number(d.numeratorRoot) / Number(d.divisorRoot));
    }
    if (mode === 12) {
      assert.equal(nearestSqrt(Number(d.correctN)), Number(d.k), `${id}:${seed}: missing-radicand nearest root mismatch.`);
    }
    if (mode === 14 && String(d.kind) === "ROOT") {
      assert.equal(Number(q.canonicalAnswer), nearestSqrt(Number(d.n)), `${id}:${seed}: nearest-option root mismatch.`);
    }
    if (mode === 16) {
      assert.equal(Number(d.correctRoot), nearestSqrt(Number(d.n)), `${id}:${seed}: diagnosis root mismatch.`);
      assert.ok(q.canonicalAnswer.includes(`Use ${d.correctRoot}`));
    }
  }
  assert.equal(stems.size, 100, `${id}: expected 100 distinct stems.`);
}

for (const mode of [0, 1, 2]) assert.deepEqual([...(bands.get(mode) ?? new Set())].sort(), [0, 1, 2, 3, 4]);
for (const mode of [3, 4]) assert.deepEqual([...(bands.get(mode) ?? new Set())].sort(), [0, 1, 2, 3]);
assert.equal(payloads.size, 1700);
assert.equal(identities.size, 1700);
assert.deepEqual(positions, [425, 425, 425, 425]);
assert.ok(latexRootStates >= 900, `Expected broad LaTeX-root coverage, saw ${latexRootStates}.`);

console.log("SAP-CP-010 root-depth authority passed: 1,700 unique inactive states, stratified root intervals, independently proven nearest-root logic and scoped LaTeX radicals.");
