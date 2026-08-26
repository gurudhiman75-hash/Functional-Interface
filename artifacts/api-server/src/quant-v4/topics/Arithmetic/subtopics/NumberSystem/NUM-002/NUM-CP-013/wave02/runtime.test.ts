import assert from "node:assert/strict";

import { generateNumCp013Wave02 } from "./runtime-v2.ts";
import { NUM_CP013_WAVE02_PROTOTYPE_IDS } from "./types.ts";

const SYMBOLS = "0123456789ABCDEF";

function digitValue(ch: string) {
  const value = SYMBOLS.indexOf(ch.toUpperCase());
  assert.ok(value >= 0, `Unsupported digit ${ch}`);
  return value;
}

function fromBase(text: string, base: number) {
  let value = 0;
  for (const ch of text) {
    const digit = digitValue(ch);
    assert.ok(digit < base, `${text}: digit ${ch} invalid in base ${base}`);
    value = value * base + digit;
  }
  return value;
}

function parseNotation(value: string) {
  const match = /^\(([0-9A-F]+)\)_(\d+)$/u.exec(value);
  assert.ok(match, `Malformed base numeral ${value}`);
  return { text: match[1]!, base: Number(match[2]!) };
}

function notationValue(value: string) {
  const parsed = parseNotation(value);
  return fromBase(parsed.text, parsed.base);
}

const positions = new Map<string, Set<number>>();
const stems = new Map<string, Set<string>>();
const tasks = new Set<string>();
const representations = new Set<string>();
const p009Modes = new Set<number>();
const p011Modes = new Set<number>();
const p012Classes = new Set<number>();
let packages = 0;
let verifierChecks = 0;
let explanationChecks = 0;
let hexChecks = 0;
let multiplicationCarryChecks = 0;
let arithmeticBaseChecks = 0;

for (const prototypeId of NUM_CP013_WAVE02_PROTOTYPE_IDS) {
  const answerPositions = new Set<number>();
  const normalizedStems = new Set<string>();
  for (let seed = 1; seed <= 120; seed += 1) {
    const q = generateNumCp013Wave02(prototypeId, seed);
    const replay = generateNumCp013Wave02(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: deterministic replay drift`);
    assert.equal(q.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(q.checkpointId, "NUM-CP-013", `${label}: checkpoint drift`);
    assert.equal(q.temporaryPrototypeId, prototypeId, `${label}: prototype drift`);
    assert.equal(q.locale, "en-IN", `${label}: locale drift`);
    assert.equal(q.options.length, 4, `${label}: option count drift`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate options`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: correct-option count drift`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct-index drift`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: answer binding drift`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: canonical/verifier drift`);

    assert.equal(q.explanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1", `${label}: explanation standard drift`);
    assert.ok(q.explanation.fullDerivation.length >= 4, `${label}: full derivation too thin`);
    assert.ok(q.explanation.examShortcut.length >= 1, `${label}: exam shortcut missing`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation answer drift`);
    assert.ok(q.explanation.fullDerivation.join(" ").length >= 140, `${label}: explanation not detailed enough`);
    explanationChecks += 1;

    assert.equal(q.lifecycle.maturity, "DISCOVERY_PROTOTYPE", `${label}: maturity drift`);
    assert.equal(q.lifecycle.reviewStatus, "WAVE02_REVIEW_REQUIRED", `${label}: review status drift`);
    assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Studio gate opened`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank gate opened`);
    assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(q.lifecycle.mockTestEligible, false, `${label}: mock gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    assert.equal(q.lifecycle.automaticStudentPublication, false, `${label}: publication gate opened`);
    assert.equal("permanentQlId" in q, false, `${label}: permanent QL leaked into discovery`);
    assert.equal("questionLanguageId" in q, false, `${label}: question-language identity leaked into discovery`);

    const s = q.hiddenState as Record<string, any>;
    switch (prototypeId) {
      case "NUM-CP013-PROT-009": {
        p009Modes.add(s.mode);
        assert.equal(notationValue(q.canonicalAnswer), s.value, `${label}: direct grouping changed numeric value`);
        assert.ok([2, 8, 16].includes(s.sourceBase), `${label}: unexpected grouping source base`);
        assert.ok([2, 8, 16].includes(s.targetBase), `${label}: unexpected grouping target base`);
        if (s.sourceBase === 16 || s.targetBase === 16) hexChecks += 1;
        break;
      }
      case "NUM-CP013-PROT-010": {
        const answer = parseNotation(q.canonicalAnswer);
        assert.equal(answer.base, s.base, `${label}: invalid numeral answer base drift`);
        assert.ok([...answer.text].some((ch) => digitValue(ch) >= s.base), `${label}: marked-invalid numeral is actually valid`);
        for (const option of q.options.filter((item) => !item.isCorrect)) {
          const parsed = parseNotation(option.value);
          assert.ok([...parsed.text].every((ch) => digitValue(ch) < parsed.base), `${label}: distractor numeral is not legal`);
        }
        if (s.base > 10) hexChecks += 1;
        break;
      }
      case "NUM-CP013-PROT-011": {
        p011Modes.add(s.mode);
        if (s.mode === 0) {
          assert.equal(String(s.digits[s.index] * s.base ** s.power), q.canonicalAnswer, `${label}: place-value projection drift`);
        } else if (s.mode === 1) {
          const convertedLength = (() => {
            let value = s.decimal;
            let count = 0;
            while (value > 0) { value = Math.floor(value / s.base); count += 1; }
            return count;
          })();
          assert.equal(String(convertedLength), q.canonicalAnswer, `${label}: digit-count projection drift`);
        } else if (s.largestMode) {
          assert.equal(String(s.base ** s.n - 1), q.canonicalAnswer, `${label}: largest n-digit boundary drift`);
        } else {
          assert.equal(String(s.base ** (s.n - 1)), q.canonicalAnswer, `${label}: smallest n-digit boundary drift`);
        }
        break;
      }
      case "NUM-CP013-PROT-012": {
        p012Classes.add(s.mode);
        const enumerated = s.candidateBases.filter((base: number) => s.digits.every((digit: number) => digit < base));
        assert.deepEqual(enumerated, s.validBases, `${label}: valid-base set drift`);
        assert.equal(String(enumerated.length), q.canonicalAnswer, `${label}: valid-base count drift`);
        if (s.mode === 0) assert.equal(enumerated.length, 0, `${label}: zero class not exercised`);
        if (s.mode === 1) assert.equal(enumerated.length, 1, `${label}: unique class not exercised`);
        if (s.mode === 2) assert.ok(enumerated.length >= 2, `${label}: multiple class not exercised`);
        break;
      }
      case "NUM-CP013-PROT-013": {
        const left = fromBase(s.leftText, s.base);
        const right = fromBase(s.rightText, s.base);
        const result = fromBase(s.resultText, s.base);
        assert.equal(left + right, result, `${label}: arithmetic statement does not hold in answer base`);
        assert.deepEqual(s.solutions, [Number(q.canonicalAnswer)], `${label}: unknown arithmetic base not unique`);
        assert.equal(s.p + s.q, s.base + s.s, `${label}: units carry equation drift`);
        arithmeticBaseChecks += 1;
        break;
      }
      case "NUM-CP013-PROT-014": {
        const multiplicand = fromBase(s.multiplicandText, s.base);
        assert.equal(notationValue(q.canonicalAnswer), multiplicand * s.multiplier, `${label}: multiplication value drift`);
        assert.ok(s.carry > 0, `${label}: multiplication did not exercise carry`);
        assert.equal(s.unitsTotal, s.carry * s.base + s.unitsDigit, `${label}: multiplication carry decomposition drift`);
        multiplicationCarryChecks += 1;
        if (s.base > 10) hexChecks += 1;
        break;
      }
    }
    verifierChecks += 1;

    answerPositions.add(q.correctIndex);
    normalizedStems.add(q.stem.replace(/[0-9A-F]+/gu, "#"));
    tasks.add(q.taskKind);
    representations.add(q.representation);
    packages += 1;
  }
  positions.set(prototypeId, answerPositions);
  stems.set(prototypeId, normalizedStems);
  assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3], `${prototypeId}: answer positions did not cover all four slots`);
  assert.ok(normalizedStems.size >= 2 || prototypeId === "NUM-CP013-PROT-011", `${prototypeId}: stem wording too repetitive`);
}

assert.equal(packages, 720);
assert.equal(verifierChecks, 720);
assert.equal(explanationChecks, 720);
assert.deepEqual([...p009Modes].sort(), [0, 1, 2, 3], "P009 grouping modes incomplete");
assert.deepEqual([...p011Modes].sort(), [0, 1, 2, 3], "P011 positional projections incomplete");
assert.deepEqual([...p012Classes].sort(), [0, 1, 2], "P012 solution-count classes incomplete");
assert.equal(multiplicationCarryChecks, 120);
assert.equal(arithmeticBaseChecks, 120);
assert.ok(hexChecks > 0, "Wave02 did not exercise hexadecimal states");
assert.ok(tasks.size >= 12, `Wave02 task-kind breadth too narrow: ${tasks.size}`);
assert.ok(representations.size >= 6, `Wave02 representation breadth too narrow: ${representations.size}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_WAVE02_EDGE_REPRESENTATION",
  prototypes: NUM_CP013_WAVE02_PROTOTYPE_IDS.length,
  packages,
  verifierChecks,
  explanationChecks,
  groupingModes: [...p009Modes].sort(),
  positionalProjectionModes: [...p011Modes].sort(),
  boundedBaseClasses: [...p012Classes].sort(),
  multiplicationCarryChecks,
  arithmeticBaseChecks,
  hexChecks,
  taskKinds: [...tasks].sort(),
  representations: [...representations].sort(),
  permanentQlAllocated: false,
  downstreamGatesLocked: true,
}, null, 2));
