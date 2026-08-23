import assert from "node:assert/strict";

import { areOpposite, facingRelation, relativeDelta, sitsRelative } from "./solver.ts";
import {
  generateSea002Cp007Wave02,
  SEA002_CP007_WAVE02_PROTOTYPES,
} from "./wave02.ts";

const fingerprints = new Map<string, Set<string>>();
const answerPositions = new Map<string, Set<number>>();
const widths = new Map<string, Set<number>>();
const facingRelations = new Set<string>();
let generated = 0;
let deterministic = 0;
let optionChecks = 0;
let semanticChecks = 0;
let lifecycleChecks = 0;
let presentationChecks = 0;

for (const prototypeId of SEA002_CP007_WAVE02_PROTOTYPES) {
  fingerprints.set(prototypeId, new Set());
  answerPositions.set(prototypeId, new Set());
  widths.set(prototypeId, new Set());

  for (let index = 0; index < 180; index += 1) {
    const width = 3 + (index % 4);
    const seed = `sea-cp007-wave02:${prototypeId}:${index}`;
    const question = generateSea002Cp007Wave02(prototypeId, seed, width);
    const replay = generateSea002Cp007Wave02(prototypeId, seed, width);
    generated += 1;

    assert.deepEqual(replay, question);
    deterministic += 1;
    assert.equal(question.participants.length, width * 2);
    assert.equal(new Set(question.participants.map((p) => `${p.seat.row}:${p.seat.position}`)).size, width * 2);
    assert.equal(new Set(question.participants.map((p) => p.id)).size, width * 2);

    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.options.filter((option) => option === question.answer).length, 1);
    optionChecks += 4;

    assert.equal(question.lifecycle.permanentQlAllocated, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);
    lifecycleChecks += 6;

    assert.ok(question.stem.length >= 80);
    assert.ok(question.explanation.length >= 80);
    assert.equal(/\bcolumns?\b/i.test(`${question.stem} ${question.explanation}`), false);
    assert.equal(/solver|oracle|fingerprint|coordinate/i.test(`${question.stem} ${question.explanation}`), false);
    presentationChecks += 4;

    if (prototypeId === "SEA-CP007-PROT-004") {
      const direction = /second to the left/i.test(question.stem) ? "LEFT" as const : "RIGHT" as const;
      const referenceId = question.stem.match(/(\w+) faces (?:north|south)\. Who sits second/)?.[1];
      assert.ok(referenceId);
      const reference = question.participants.find((p) => p.id === referenceId)!;
      const answer = question.participants.find((p) => p.id === question.answer)!;
      assert.ok(sitsRelative(answer, reference, direction, 2));
      semanticChecks += 1;
    }

    if (prototypeId === "SEA-CP007-PROT-005") {
      const direction = /immediately to the left/i.test(question.stem) ? "LEFT" as const : "RIGHT" as const;
      const referenceId = question.stem.match(/(\w+) faces (?:north|south)\. The person immediately/)?.[1];
      assert.ok(referenceId);
      const reference = question.participants.find((p) => p.id === referenceId)!;
      const target = question.participants.find((p) => sitsRelative(p, reference, direction))!;
      assert.ok(question.answer.startsWith(`${target.id} — `));
      assert.ok(question.answer.endsWith(target.facing === "N" ? "North" : "South"));
      facingRelations.add(facingRelation(reference, target));
      semanticChecks += 2;
    }

    if (prototypeId === "SEA-CP007-PROT-006") {
      const targetId = question.stem.match(/\. (\w+) sits immediately/)?.[1];
      assert.ok(targetId);
      const target = question.participants.find((p) => p.id === targetId)!;
      assert.equal(question.answer, `${target.seat.row === "TOP" ? "Upper row" : "Lower row"} — ${target.facing === "N" ? "North" : "South"}`);
      semanticChecks += 1;
    }

    if (prototypeId === "SEA-CP007-PROT-007") {
      const ids = question.stem.match(/^(\w+) and (\w+) occupy opposite positions/);
      assert.ok(ids);
      const anchor = question.participants.find((p) => p.id === ids![1])!;
      const opposite = question.participants.find((p) => p.id === ids![2])!;
      assert.ok(areOpposite(anchor, opposite));
      const targetPosition = opposite.seat.position + relativeDelta(opposite.facing, "RIGHT");
      const diagonal = question.participants.find((p) => p.seat.row === anchor.seat.row && p.seat.position === targetPosition)!;
      assert.equal(question.answer, diagonal.id);
      facingRelations.add(facingRelation(anchor, opposite));
      semanticChecks += 3;
    }

    fingerprints.get(prototypeId)!.add(question.mathematicalFingerprint);
    answerPositions.get(prototypeId)!.add(question.correctIndex);
    widths.get(prototypeId)!.add(width);
  }
}

for (const prototypeId of SEA002_CP007_WAVE02_PROTOTYPES) {
  assert.ok(fingerprints.get(prototypeId)!.size >= 120, `${prototypeId} state diversity too low`);
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3]);
  assert.deepEqual([...widths.get(prototypeId)!].sort(), [3, 4, 5, 6]);
}
assert.deepEqual([...facingRelations].sort(), ["OPPOSITE", "SAME"]);

console.log("PASS_SEA002_CP007_WAVE02_INFERENCE_DISCOVERY_V1");
console.log("temporary prototypes", SEA002_CP007_WAVE02_PROTOTYPES.length);
console.log("generated questions", generated);
console.log("deterministic replay", deterministic);
console.log("option checks", optionChecks);
console.log("semantic checks", semanticChecks);
console.log("lifecycle checks", lifecycleChecks);
console.log("presentation checks", presentationChecks);
console.log("widths", "3+3,4+4,5+5,6+6");
console.log("facing relations", [...facingRelations].sort().join(","));
console.log("permanent QLs allocated", 0);
