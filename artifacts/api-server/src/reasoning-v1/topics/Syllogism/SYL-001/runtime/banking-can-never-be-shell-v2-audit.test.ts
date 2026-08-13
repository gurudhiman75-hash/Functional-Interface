import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateBankingCanNeverShellV2 } from "./banking-can-never-be-shell-v2";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);

let records = 0;
const statuses: Record<string, number> = {};
const modalKinds: Record<string, number> = {};
const modalPositions: Record<string, number> = {};
const modalTruth: Record<string, number> = {};
const ordinaryTruth: Record<string, number> = {};
const optionPositions: Record<string, number> = {};
const grid: Record<string, number> = {};

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

for (const seed of seeds) {
  const localized = locales.map((locale) => generateBankingCanNeverShellV2(seed, locale));
  const canonical = localized[0];

  for (const question of localized) {
    records += 1;
    assert.equal(question.authority, "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2");
    assert.equal(question.prototypeId, "SYL-PROTOTYPE-BANK-CAN-NEVER-002");
    assert.equal(question.metadata.selectionPolicy, "ORTHOGONAL_STATUS_POSITION_KIND_GRID_V2");
    assert.equal(question.metadata.legacyQlChanged, false);
    assert.equal(question.metadata.registeredQlCreated, false);
    assert.equal(question.metadata.connectedToProfilePlanner, false);
    assert.equal(question.metadata.questionStudioVisible, false);
    assert.equal(question.metadata.questionBankWritable, false);
    assert.equal(question.metadata.testEligible, false);
    assert.equal(question.metadata.publiclyPublishable, false);
    assert.equal(question.conclusions.length, 2);
    assert.equal(question.options.length, 5);
    assert.equal(question.options.filter((entry) => entry.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.semanticValue, question.semanticAnswer);

    const modalIndex = question.conclusions.findIndex((entry) => entry.mode === "CAN_NEVER_BE");
    assert.ok(modalIndex === 0 || modalIndex === 1);
    const modal = question.conclusions[modalIndex];
    const ordinary = question.conclusions[modalIndex === 0 ? 1 : 0];
    assert.ok(modal?.surfaceKind);
    assert.equal(ordinary?.mode, "DEFINITE");

    const modalPosition = modalIndex === 0 ? "I" : "II";
    increment(statuses, question.semanticAnswer);
    increment(modalKinds, modal.surfaceKind);
    increment(modalPositions, modalPosition);
    increment(modalTruth, String(modal.follows));
    increment(ordinaryTruth, String(ordinary.follows));
    increment(optionPositions, String(question.correctIndex));
    increment(grid, `${question.semanticAnswer}|${modalPosition}|${modal.surfaceKind}`);
  }

  for (const question of localized.slice(1)) {
    assert.equal(question.scenarioId, canonical.scenarioId);
    assert.equal(question.sourcePatternId, canonical.sourcePatternId);
    assert.equal(question.semanticAnswer, canonical.semanticAnswer);
    assert.equal(question.correctIndex, canonical.correctIndex);
    assert.deepEqual(
      question.conclusions.map((entry) => ({
        mode: entry.mode,
        surfaceKind: entry.surfaceKind,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        disposition: entry.disposition,
      })),
      canonical.conclusions.map((entry) => ({
        mode: entry.mode,
        surfaceKind: entry.surfaceKind,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        disposition: entry.disposition,
      })),
    );
  }
}

assert.equal(records, 240);
for (const status of ["ONLY_FIRST_FOLLOWS", "ONLY_SECOND_FOLLOWS", "BOTH_FOLLOW", "NEITHER_FOLLOWS"]) {
  assert.equal(statuses[status], 60, `${status} must occupy exactly 60 localized records.`);
}
assert.equal(modalKinds.ALL_CAN_NEVER, 120);
assert.equal(modalKinds.SOME_CAN_NEVER, 120);
assert.equal(modalPositions.I, 120);
assert.equal(modalPositions.II, 120);
assert.equal(modalTruth.true, 120);
assert.equal(modalTruth.false, 120);
assert.equal(ordinaryTruth.true, 120);
assert.equal(ordinaryTruth.false, 120);
for (const index of [0, 1, 2, 3, 4]) {
  assert.equal(optionPositions[String(index)], 48, `Correct option ${index} must occur 48 times.`);
}

for (const status of ["ONLY_FIRST_FOLLOWS", "ONLY_SECOND_FOLLOWS", "BOTH_FOLLOW", "NEITHER_FOLLOWS"]) {
  for (const position of ["I", "II"]) {
    for (const kind of ["ALL_CAN_NEVER", "SOME_CAN_NEVER"]) {
      const key = `${status}|${position}|${kind}`;
      assert.equal(grid[key], 15, `Orthogonal grid cell ${key} must contain exactly 15 localized records.`);
    }
  }
}

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2",
  records,
  statuses,
  modalKinds,
  modalPositions,
  modalTruth,
  ordinaryTruth,
  correctOptionPositions: optionPositions,
  orthogonalGridCells: grid,
  antiPatternClosure: {
    conclusionIShortcutRemoved: true,
    modalTruthBiasRemoved: true,
    fallbackPermitted: false,
  },
  locks: {
    legacyQlChanged: false,
    registeredQlCreated: false,
    connectedToProfilePlanner: false,
    questionStudioVisible: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    activationPermitted: false,
  },
}, null, 2));
