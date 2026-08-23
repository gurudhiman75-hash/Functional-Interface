import assert from "node:assert/strict";

import { generateSea002Cp007Wave01 } from "./generator.ts";
import {
  areOpposite,
  participantById,
  sitsRelative,
  validateState,
} from "./solver.ts";
import type { Sea002Cp007PrototypeId } from "./types.ts";

const prototypes: readonly Sea002Cp007PrototypeId[] = Object.freeze([
  "SEA-CP007-PROT-001",
  "SEA-CP007-PROT-002",
  "SEA-CP007-PROT-003",
]);

let generated = 0;
const positions = new Set<number>();
const widths = new Set<number>();
const fingerprints = new Map<Sea002Cp007PrototypeId, Set<string>>();
const sameDirectionFacings = new Set<string>();
const mixedReferenceFacings = new Set<string>();

for (const prototypeId of prototypes) fingerprints.set(prototypeId, new Set());

for (const prototypeId of prototypes) {
  for (let index = 0; index < 160; index += 1) {
    const width = 3 + (index % 4);
    const seed = `sea-cp007-wave01:${prototypeId}:${index}`;
    const question = generateSea002Cp007Wave01(prototypeId, seed, width);
    const replay = generateSea002Cp007Wave01(prototypeId, seed, width);

    assert.deepEqual(replay, question, `${prototypeId} ${seed}: deterministic replay drift`);
    validateState(question.participants, width);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.ok(question.explanation.length >= 70, `${prototypeId}: explanation too thin`);
    assert.ok(!/\bcolumns?\b/i.test(question.stem));
    assert.ok(!/\bcolumns?\b/i.test(question.explanation));

    assert.equal(question.lifecycle.permanentQlAllocated, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);

    positions.add(question.correctIndex);
    widths.add(width);
    fingerprints.get(prototypeId)!.add(question.mathematicalFingerprint);

    if (prototypeId === "SEA-CP007-PROT-001") {
      const facing = question.participants[0]!.facing;
      assert.ok(question.participants.every((participant) => participant.facing === facing));
      sameDirectionFacings.add(facing);
    }

    if (prototypeId === "SEA-CP007-PROT-002") {
      const sameRowPairs = question.participants.filter((participant) => question.stem.includes(participant.id));
      assert.ok(new Set(question.participants.map((participant) => participant.facing)).size === 2);
      for (const participant of sameRowPairs) mixedReferenceFacings.add(participant.facing);
    }

    if (prototypeId === "SEA-CP007-PROT-003") {
      const named = question.participants.filter((participant) => question.stem.includes(participant.id));
      assert.ok(named.length >= 2);
      const left = named[0]!;
      const opposite = named.find((participant) => participant.id !== left.id && areOpposite(left, participant));
      assert.ok(opposite, `${seed}: stem must include physical opposite pair`);
    }

    generated += 1;
  }
}

assert.deepEqual([...positions].sort(), [0, 1, 2, 3]);
assert.deepEqual([...widths].sort(), [3, 4, 5, 6]);
assert.deepEqual([...sameDirectionFacings].sort(), ["N", "S"]);
for (const prototypeId of prototypes) {
  assert.ok(fingerprints.get(prototypeId)!.size >= 100, `${prototypeId}: insufficient state diversity`);
}

// Direct semantic checks for person-relative left/right inversion.
const north = Object.freeze({ id: "N", seat: Object.freeze({ row: "TOP" as const, position: 2 }), facing: "N" as const });
const northRight = Object.freeze({ id: "NR", seat: Object.freeze({ row: "TOP" as const, position: 3 }), facing: "S" as const });
const south = Object.freeze({ id: "S", seat: Object.freeze({ row: "BOTTOM" as const, position: 2 }), facing: "S" as const });
const southRight = Object.freeze({ id: "SR", seat: Object.freeze({ row: "BOTTOM" as const, position: 1 }), facing: "N" as const });
assert.equal(sitsRelative(northRight, north, "RIGHT"), true);
assert.equal(sitsRelative(southRight, south, "RIGHT"), true);
assert.equal(participantById([north, northRight], "NR").id, "NR");

console.log("PASS_SEA002_CP007_WAVE01_MIXED_FACING_DISCOVERY");
console.log(`temporary prototypes ${prototypes.length}`);
console.log(`generated questions ${generated}`);
console.log(`widths ${[...widths].sort().join(",")}`);
console.log(`answer positions ${[...positions].sort().join(",")}`);
console.log(`same-direction facings ${[...sameDirectionFacings].sort().join(",")}`);
console.log(`state diversity ${prototypes.map((id) => `${id}:${fingerprints.get(id)!.size}`).join(" ")}`);
console.log("permanent QL allocation 0; next free SEA-QL-025");
console.log("Studio/Bank/test/public false/false/false/false");
