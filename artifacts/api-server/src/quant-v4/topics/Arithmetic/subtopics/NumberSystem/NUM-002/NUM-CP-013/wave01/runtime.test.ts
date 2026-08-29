import assert from "node:assert/strict";

import { generateNumCp013Wave01 } from "./runtime-v2.ts";
import { NUM_CP013_WAVE01_PROTOTYPE_IDS } from "./types.ts";

function positionalValue(digits: readonly number[], base: number) {
  return digits.reduce((value, digit) => value * base + digit, 0);
}

function parseNotation(value: string) {
  const match = /^\((\d+)\)_(\d+)$/u.exec(value);
  assert.ok(match, `Malformed base numeral option: ${value}`);
  return { digits: [...match[1]!].map(Number), base: Number(match[2]!) };
}

function notationValue(value: string) {
  const parsed = parseNotation(value);
  assert.ok(parsed.base >= 2 && parsed.base <= 10, `Unsupported Wave01 base ${parsed.base}`);
  assert.ok(parsed.digits.every((digit) => digit < parsed.base), `${value}: digit invalid for base`);
  return positionalValue(parsed.digits, parsed.base);
}

const positionCoverage = new Map<string, Set<number>>();
const stemCoverage = new Map<string, Set<string>>();
const representationCoverage = new Set<string>();
const taskCoverage = new Set<string>();
let packages = 0;
let verifierChecks = 0;
let replayChecks = 0;
let explanationChecks = 0;
let carryChecks = 0;
let borrowChecks = 0;

for (const prototypeId of NUM_CP013_WAVE01_PROTOTYPE_IDS) {
  const positions = new Set<number>();
  const stems = new Set<string>();
  for (let seed = 1; seed <= 80; seed += 1) {
    const q = generateNumCp013Wave01(prototypeId, seed);
    const replay = generateNumCp013Wave01(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(q.checkpointId, "NUM-CP-013", `${label}: checkpoint drift`);
    assert.equal(q.temporaryPrototypeId, prototypeId, `${label}: prototype drift`);
    assert.equal(q.locale, "en-IN", `${label}: locale drift`);
    assert.ok(["EASY", "MEDIUM", "HARD"].includes(q.difficulty), `${label}: difficulty drift`);
    assert.equal(q.options.length, 4, `${label}: option count drift`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate options`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: correct option count`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct index not correct`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: answer binding drift`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: canonical/verifier drift`);
    assert.equal(q.explanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1", `${label}: explanation standard drift`);
    assert.ok(q.explanation.fullDerivation.length >= 4, `${label}: derivation too thin`);
    assert.ok(q.explanation.examShortcut.length >= 1, `${label}: shortcut missing`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation answer drift`);
    assert.ok(q.explanation.fullDerivation.join(" ").length >= 120, `${label}: derivation lacks detail`);
    explanationChecks += 1;

    assert.equal(q.lifecycle.maturity, "DISCOVERY_PROTOTYPE", `${label}: maturity drift`);
    assert.equal(q.lifecycle.reviewStatus, "WAVE01_REVIEW_REQUIRED", `${label}: review status drift`);
    assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Studio gate opened`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank gate opened`);
    assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(q.lifecycle.mockTestEligible, false, `${label}: mock gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    assert.equal(q.lifecycle.automaticStudentPublication, false, `${label}: automatic publication gate opened`);
    assert.equal("permanentQlId" in q, false, `${label}: permanent QL leaked into discovery`);
    assert.equal("questionLanguageId" in q, false, `${label}: question-language identity leaked into discovery`);

    const s = q.hiddenState as Record<string, any>;
    switch (prototypeId) {
      case "NUM-CP013-PROT-001": {
        const rebuilt = positionalValue(s.digits, s.base);
        assert.equal(String(rebuilt), q.canonicalAnswer, `${label}: positional expansion mismatch`);
        break;
      }
      case "NUM-CP013-PROT-002": {
        assert.equal(notationValue(q.canonicalAnswer), s.decimal, `${label}: decimal-to-base reconstruction mismatch`);
        break;
      }
      case "NUM-CP013-PROT-003": {
        const sourceValue = positionalValue(s.sourceDigits, s.sourceBase);
        assert.equal(sourceValue, s.decimal, `${label}: source numeral mismatch`);
        assert.equal(notationValue(q.canonicalAnswer), sourceValue, `${label}: cross-base reconstruction mismatch`);
        assert.notEqual(s.sourceBase, s.targetBase, `${label}: source and target base collapsed`);
        break;
      }
      case "NUM-CP013-PROT-004": {
        assert.equal(Number(q.canonicalAnswer), Math.max(...s.digits) + 1, `${label}: minimum-base rule mismatch`);
        assert.ok(s.digits.every((digit: number) => digit < Number(q.canonicalAnswer)), `${label}: numeral not valid in answer base`);
        break;
      }
      case "NUM-CP013-PROT-005": {
        const valid = Array.from({ length: s.base }, (_, digit) => digit)
          .filter((digit) => s.a * s.base ** 2 + digit * s.base + s.c === s.decimal);
        assert.deepEqual(valid, [Number(q.canonicalAnswer)], `${label}: unknown digit not unique`);
        break;
      }
      case "NUM-CP013-PROT-006": {
        const minBase = Math.max(...s.digits) + 1;
        const valid = Array.from({ length: 13 - minBase }, (_, index) => minBase + index)
          .filter((base) => positionalValue(s.digits, base) === s.decimal);
        assert.deepEqual(valid, [Number(q.canonicalAnswer)], `${label}: unknown base not unique in bounded verifier domain`);
        break;
      }
      case "NUM-CP013-PROT-007": {
        assert.equal(notationValue(q.canonicalAnswer), s.leftValue + s.rightValue, `${label}: base addition mismatch`);
        assert.ok(s.trace.some((step: any) => step.carryOut > 0), `${label}: no carry exercised`);
        carryChecks += 1;
        break;
      }
      case "NUM-CP013-PROT-008": {
        assert.equal(notationValue(q.canonicalAnswer), s.topValue - s.bottomValue, `${label}: base subtraction mismatch`);
        assert.ok(s.trace.some((step: any) => step.borrowOut > 0), `${label}: no borrow exercised`);
        borrowChecks += 1;
        break;
      }
    }
    verifierChecks += 1;

    positions.add(q.correctIndex);
    stems.add(q.stem.replace(/\d+/gu, "#"));
    representationCoverage.add(q.representation);
    taskCoverage.add(q.taskKind);
    packages += 1;
  }
  positionCoverage.set(prototypeId, positions);
  stemCoverage.set(prototypeId, stems);
  assert.deepEqual([...positions].sort(), [0, 1, 2, 3], `${prototypeId}: answer positions did not cover all four slots`);
  assert.ok(stems.size >= 2, `${prototypeId}: stem wording is too repetitive`);
}

assert.equal(packages, 640);
assert.equal(verifierChecks, 640);
assert.equal(replayChecks, 640);
assert.equal(explanationChecks, 640);
assert.equal(carryChecks, 80);
assert.equal(borrowChecks, 80);
assert.equal(taskCoverage.size, 8, "Wave01 task coverage collapsed");
assert.ok(representationCoverage.size >= 7, "Wave01 representation coverage too narrow");

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_WAVE01_FOUNDATION",
  checkpoint: "NUM-CP-013",
  permanentQlAllocated: false,
  prototypes: NUM_CP013_WAVE01_PROTOTYPE_IDS.length,
  packages,
  verifierChecks,
  replayChecks,
  explanationChecks,
  carryChecks,
  borrowChecks,
  taskKinds: [...taskCoverage],
  representations: [...representationCoverage],
  answerPositionCoverage: Object.fromEntries([...positionCoverage].map(([id, positions]) => [id, [...positions].sort()])),
  downstreamGatesLocked: true,
}, null, 2));
