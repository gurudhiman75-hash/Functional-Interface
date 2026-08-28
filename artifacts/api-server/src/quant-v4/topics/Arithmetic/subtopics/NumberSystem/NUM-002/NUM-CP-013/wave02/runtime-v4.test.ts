import assert from "node:assert/strict";

import { generateNumCp013Wave02 } from "./runtime-v4.ts";
import { NUM_CP013_WAVE02_PROTOTYPE_IDS } from "./types.ts";

const SYMBOLS = "0123456789ABCDEF";
function digitValue(ch: string) { const v = SYMBOLS.indexOf(ch.toUpperCase()); assert.ok(v >= 0); return v; }
function fromBase(text: string, base: number) {
  return [...text].reduce((value, ch) => {
    const digit = digitValue(ch);
    assert.ok(digit < base);
    return value * base + digit;
  }, 0);
}
function parseNotation(value: string) {
  const match = /^\(([0-9A-F]+)\)_(\d+)$/u.exec(value);
  assert.ok(match, `Malformed notation ${value}`);
  return { text: match[1]!, base: Number(match[2]!) };
}
function notationValue(value: string) { const p = parseNotation(value); return fromBase(p.text, p.base); }

let packages = 0;
let replayChecks = 0;
let semanticChecks = 0;
let explanationChecks = 0;
const taskKinds = new Set<string>();
const positionCoverage = new Map<string, Set<number>>();
const modeCoverage = new Map<string, Set<number>>();

for (const prototypeId of NUM_CP013_WAVE02_PROTOTYPE_IDS) {
  const positions = new Set<number>();
  const modes = new Set<number>();
  for (let seed = 1; seed <= 160; seed += 1) {
    const q = generateNumCp013Wave02(prototypeId, seed);
    const replay = generateNumCp013Wave02(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;
    assert.deepEqual(replay, q, `${label}: replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002");
    assert.equal(q.checkpointId, "NUM-CP-013");
    assert.equal(q.temporaryPrototypeId, prototypeId);
    assert.equal(q.options.length, 4, `${label}: option count`);
    assert.equal(new Set(q.options.map((o) => o.value)).size, 4, `${label}: duplicate options`);
    assert.equal(q.options.filter((o) => o.isCorrect).length, 1, `${label}: correct option count`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: binding drift`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct index drift`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: verifier drift`);
    assert.equal(q.explanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
    assert.ok(q.explanation.fullDerivation.length >= 4, `${label}: derivation too short`);
    assert.ok(q.explanation.fullDerivation.join(" ").length >= 120, `${label}: derivation too thin`);
    assert.ok(q.explanation.examShortcut.length >= 1, `${label}: shortcut absent`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer);
    explanationChecks += 1;

    assert.equal(q.lifecycle.maturity, "DISCOVERY_PROTOTYPE");
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.mockTestEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.equal(q.lifecycle.automaticStudentPublication, false);
    assert.equal("permanentQlId" in q, false, `${label}: permanent QL leak`);

    const s = q.hiddenState as any;
    if (typeof s.mode === "number") modes.add(s.mode);
    switch (prototypeId) {
      case "NUM-CP013-PROT-009": {
        assert.equal(notationValue(q.canonicalAnswer), s.value, `${label}: grouping conversion value mismatch`);
        assert.ok([2, 8, 16].includes(s.sourceBase));
        assert.ok([2, 8, 16].includes(s.targetBase));
        assert.notEqual(s.sourceBase, s.targetBase);
        break;
      }
      case "NUM-CP013-PROT-010": {
        const correct = parseNotation(q.canonicalAnswer);
        assert.ok([...correct.text].some((ch) => digitValue(ch) >= correct.base), `${label}: selected numeral is not actually invalid`);
        for (const option of q.options.filter((o) => !o.isCorrect)) {
          const p = parseNotation(option.value);
          assert.ok([...p.text].every((ch) => digitValue(ch) < p.base), `${label}: distractor is also invalid`);
        }
        break;
      }
      case "NUM-CP013-PROT-011": {
        if (s.mode === 0) {
          assert.equal(Number(q.canonicalAnswer), s.digits[s.index] * s.base ** s.power, `${label}: place-value mismatch`);
        } else if (s.mode === 1) {
          assert.equal(q.canonicalAnswer, String(s.digitsCount));
          assert.ok(s.base ** (s.digitsCount - 1) <= s.decimal && s.decimal < s.base ** s.digitsCount);
        } else {
          const expected = s.largestMode ? s.base ** s.n - 1 : s.base ** (s.n - 1);
          assert.equal(Number(q.canonicalAnswer), expected, `${label}: n-digit boundary mismatch`);
        }
        break;
      }
      case "NUM-CP013-PROT-012": {
        const independentlyValid = s.candidateBases.filter((base: number) => s.digits.every((digit: number) => digit < base));
        assert.deepEqual(independentlyValid, s.validBases, `${label}: valid-base set mismatch`);
        assert.equal(Number(q.canonicalAnswer), independentlyValid.length, `${label}: valid-base count mismatch`);
        if (s.mode === 0) assert.equal(independentlyValid.length, 0);
        if (s.mode === 1) assert.equal(independentlyValid.length, 1);
        if (s.mode === 2) assert.ok(independentlyValid.length >= 2);
        break;
      }
      case "NUM-CP013-PROT-013": {
        assert.deepEqual(s.solutions, [Number(q.canonicalAnswer)], `${label}: unknown-base uniqueness mismatch`);
        assert.equal(fromBase(s.leftText, s.base) + fromBase(s.rightText, s.base), fromBase(s.resultText, s.base), `${label}: arithmetic equality mismatch`);
        assert.equal(q.correctIndex, (seed - 1) % 4, `${label}: balanced answer-position contract drift`);
        break;
      }
      case "NUM-CP013-PROT-014": {
        assert.equal(notationValue(q.canonicalAnswer), s.decimalProduct, `${label}: multiplication mismatch`);
        assert.ok(s.carry >= 1, `${label}: carry not exercised`);
        break;
      }
    }
    semanticChecks += 1;
    positions.add(q.correctIndex);
    taskKinds.add(q.taskKind);
    packages += 1;
  }
  positionCoverage.set(prototypeId, positions);
  modeCoverage.set(prototypeId, modes);
  assert.deepEqual([...positions].sort(), [0, 1, 2, 3], `${prototypeId}: answer-position coverage`);
}

assert.equal(packages, 960);
assert.equal(replayChecks, 960);
assert.equal(semanticChecks, 960);
assert.equal(explanationChecks, 960);
assert.ok(taskKinds.size >= 10, `Wave02 task projections too narrow: ${taskKinds.size}`);
assert.deepEqual([...modeCoverage.get("NUM-CP013-PROT-011")!].sort(), [0, 1, 2, 3]);
assert.deepEqual([...modeCoverage.get("NUM-CP013-PROT-012")!].sort(), [0, 1, 2]);

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_WAVE02_V4",
  packages,
  replayChecks,
  semanticChecks,
  explanationChecks,
  taskKinds: [...taskKinds],
  positionCoverage: Object.fromEntries([...positionCoverage].map(([id, set]) => [id, [...set].sort()])),
  permanentQlAllocated: false,
  downstreamGatesLocked: true,
}, null, 2));
