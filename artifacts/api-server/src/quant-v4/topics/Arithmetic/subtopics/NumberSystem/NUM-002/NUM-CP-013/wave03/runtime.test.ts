import assert from "node:assert/strict";

import { generateNumCp013Wave03 } from "./runtime.ts";
import { NUM_CP013_WAVE03_PROTOTYPE_IDS } from "./types.ts";

const SYMBOLS = "0123456789ABCDEF";
function digitValue(ch: string) { return SYMBOLS.indexOf(ch.toUpperCase()); }
function fromBase(text: string, base: number) {
  let value = 0;
  for (const ch of text) {
    const digit = digitValue(ch);
    assert.ok(digit >= 0 && digit < base);
    value = value * base + digit;
  }
  return value;
}
function parseNotation(value: string) {
  const match = /^\(([0-9A-F]+)\)_(\d+)$/u.exec(value);
  assert.ok(match, `Malformed notation ${value}`);
  return { text: match[1]!, base: Number(match[2]!) };
}
function notationValue(value: string) {
  const parsed = parseNotation(value);
  return fromBase(parsed.text, parsed.base);
}

let packages = 0;
let replayChecks = 0;
let explanationChecks = 0;
let semanticChecks = 0;
const tasks = new Set<string>();
const representations = new Set<string>();
const topologyModes = new Set<number>();

for (const prototypeId of NUM_CP013_WAVE03_PROTOTYPE_IDS) {
  const positions = new Set<number>();
  const stems = new Set<string>();
  for (let seed = 1; seed <= 120; seed += 1) {
    const q = generateNumCp013Wave03(prototypeId, seed);
    const replay = generateNumCp013Wave03(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;
    assert.deepEqual(replay, q, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002");
    assert.equal(q.checkpointId, "NUM-CP-013");
    assert.equal(q.temporaryPrototypeId, prototypeId);
    assert.equal(q.options.length, 4, `${label}: option count`);
    assert.equal(new Set(q.options.map((o) => o.value)).size, 4, `${label}: duplicate options`);
    assert.equal(q.options.filter((o) => o.isCorrect).length, 1, `${label}: correct option count`);
    assert.equal(q.correctIndex, (seed - 1) % 4, `${label}: deterministic answer-position contract drift`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: answer binding`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: verifier drift`);
    assert.equal(q.explanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
    assert.ok(q.explanation.fullDerivation.length >= 4, `${label}: thin derivation`);
    assert.ok(q.explanation.fullDerivation.join(" ").length >= 140, `${label}: derivation detail too low`);
    assert.ok(q.explanation.examShortcut.length >= 1, `${label}: shortcut missing`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer);
    explanationChecks += 1;

    assert.equal(q.lifecycle.maturity, "DISCOVERY_PROTOTYPE");
    assert.equal(q.lifecycle.reviewStatus, "WAVE03_REVIEW_REQUIRED");
    assert.equal(q.lifecycle.active, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.mockTestEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.equal(q.lifecycle.automaticStudentPublication, false);
    assert.equal("permanentQlId" in q, false, `${label}: permanent QL leak`);

    const s = q.hiddenState as any;
    switch (prototypeId) {
      case "NUM-CP013-PROT-015": {
        const a = fromBase(s.textA, s.baseA);
        const b = fromBase(s.textB, s.baseB);
        const expected = a > b ? "First numeral is greater" : a < b ? "Second numeral is greater" : "Both numerals are equal";
        assert.equal(q.canonicalAnswer, expected, `${label}: comparison mismatch`);
        break;
      }
      case "NUM-CP013-PROT-016": {
        assert.equal(fromBase(s.text, s.base) % s.divisor, Number(q.canonicalAnswer), `${label}: remainder mismatch`);
        assert.equal(s.modularTrace.at(-1), Number(q.canonicalAnswer), `${label}: modular ladder mismatch`);
        break;
      }
      case "NUM-CP013-PROT-017": {
        const product = fromBase(s.leftText, s.base) * fromBase(s.rightText, s.base);
        const lastDigit = SYMBOLS[product % s.base];
        assert.equal(q.canonicalAnswer, lastDigit, `${label}: terminal digit mismatch`);
        break;
      }
      case "NUM-CP013-PROT-018": {
        const parsed = parseNotation(q.canonicalAnswer);
        assert.equal(parsed.text[0], "0", `${label}: expected leading-zero state`);
        assert.equal(fromBase(parsed.text, parsed.base), fromBase(parsed.text.slice(1), parsed.base), `${label}: leading zero changed value`);
        break;
      }
      case "NUM-CP013-PROT-019": {
        assert.equal(s.finalCarry, 1, `${label}: new leading carry absent`);
        assert.equal(s.resultDigits.length, 4, `${label}: result did not gain digit`);
        assert.equal(notationValue(q.canonicalAnswer), s.sumValue, `${label}: addition mismatch`);
        break;
      }
      case "NUM-CP013-PROT-020": {
        assert.equal(notationValue(q.canonicalAnswer), s.difference, `${label}: borrow-chain difference mismatch`);
        assert.deepEqual(s.resultDigits, [s.a - 1, s.base - 1, s.base - s.c], `${label}: borrow-chain digit formula mismatch`);
        break;
      }
      case "NUM-CP013-PROT-021": {
        topologyModes.add(s.mode);
        const expected = s.validBases.length === 0 ? "NO_SOLUTION" : s.validBases.length === 1 ? "ONE_SOLUTION" : "MULTIPLE_SOLUTIONS";
        assert.equal(q.canonicalAnswer, expected, `${label}: topology mismatch`);
        break;
      }
      case "NUM-CP013-PROT-022": {
        assert.equal(q.canonicalAnswer, "2", `${label}: base-two lower boundary drift`);
        assert.equal(s.minimumPositionalBase, 2);
        break;
      }
    }
    semanticChecks += 1;
    positions.add(q.correctIndex);
    stems.add(q.stem.replace(/[0-9A-F]+/gu, "#"));
    tasks.add(q.taskKind);
    representations.add(q.representation);
    packages += 1;
  }
  assert.deepEqual([...positions].sort(), [0, 1, 2, 3], `${prototypeId}: position coverage`);
  assert.ok(stems.size >= 1, `${prototypeId}: no stem coverage`);
}

assert.equal(packages, 960);
assert.equal(replayChecks, 960);
assert.equal(explanationChecks, 960);
assert.equal(semanticChecks, 960);
assert.equal(tasks.size, 8);
assert.equal(representations.size, 8);
assert.deepEqual([...topologyModes].sort(), [0, 1, 2]);

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_WAVE03_SATURATION",
  prototypes: NUM_CP013_WAVE03_PROTOTYPE_IDS.length,
  packages,
  replayChecks,
  explanationChecks,
  semanticChecks,
  taskKinds: [...tasks],
  representations: [...representations],
  topologyModes: [...topologyModes].sort(),
  permanentQlAllocated: false,
  downstreamGatesLocked: true,
}, null, 2));
