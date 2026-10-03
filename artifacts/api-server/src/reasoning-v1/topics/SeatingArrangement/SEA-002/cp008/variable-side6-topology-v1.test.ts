import assert from "node:assert/strict";

import {
  SEA002_CP008_VARIABLE_SIDE6_SYMMETRY,
  variableSide6OppositeIndex,
  variableSide6RelativeIndex,
  variableSide6SameSide,
  variableSide6Seat,
  variableSide6Seats,
} from "./variable-side6-topology-v1.ts";

const seats = variableSide6Seats();
assert.equal(seats.length, 6);
assert.equal(new Set(seats.map((seat) => seat.index)).size, 6);
assert.deepEqual(
  [0, 1, 2, 3].map((side) => seats.filter((seat) => seat.side === side).length),
  [1, 2, 1, 2],
);
assert.equal(seats.filter((seat) => seat.occupancyKind === "SINGLE").length, 2);
assert.equal(seats.filter((seat) => seat.occupancyKind === "PAIRED").length, 4);
assert.equal(variableSide6Seat(-1).index, 5);
assert.equal(variableSide6Seat(6).index, 0);

for (const seat of seats) {
  const opposite = variableSide6OppositeIndex(seat.index);
  assert.equal(variableSide6OppositeIndex(opposite), seat.index);
  assert.equal(opposite, (seat.index + 3) % 6);
  for (const facing of ["IN", "OUT"] as const) {
    const right = variableSide6RelativeIndex(seat.index, facing, "RIGHT", 1);
    const left = variableSide6RelativeIndex(seat.index, facing, "LEFT", 1);
    assert.notEqual(right, left);
    assert.equal(variableSide6RelativeIndex(right, facing, "LEFT", 1), seat.index);
    assert.equal(variableSide6RelativeIndex(left, facing, "RIGHT", 1), seat.index);
  }
}

assert.equal(variableSide6SameSide(1, 2), true);
assert.equal(variableSide6SameSide(4, 5), true);
assert.equal(variableSide6SameSide(0, 3), false);
assert.equal(variableSide6SameSide(2, 3), false);
assert.equal(variableSide6OppositeIndex(0), 3);
assert.equal(variableSide6OppositeIndex(1), 4);
assert.equal(variableSide6OppositeIndex(2), 5);

assert.deepEqual(SEA002_CP008_VARIABLE_SIDE6_SYMMETRY.legitimateRotationShifts, [0, 3]);
assert.equal(SEA002_CP008_VARIABLE_SIDE6_SYMMETRY.rotationalSymmetryDegrees, 180);
const occupancyPattern = seats.map((seat) => seat.occupancyKind === "SINGLE" ? "S" : "P").join("");
const rotatePattern = (shift: number) => seats.map((_, index) => seats[(index + shift) % seats.length]!.occupancyKind === "SINGLE" ? "S" : "P").join("");
assert.equal(rotatePattern(3), occupancyPattern, "half-turn must preserve 1-2-1-2 occupancy class sequence");
assert.notEqual(rotatePattern(1), occupancyPattern, "one-seat/90-degree-like quarter progression must not be treated as symmetry");
assert.notEqual(rotatePattern(2), occupancyPattern, "standard ALT8 quarter-turn assumptions must not leak here");

assert.equal(variableSide6RelativeIndex(0, "IN", "RIGHT", 1), 5);
assert.equal(variableSide6RelativeIndex(0, "OUT", "RIGHT", 1), 1);
assert.equal(variableSide6RelativeIndex(0, "IN", "LEFT", 1), 1);
assert.equal(variableSide6RelativeIndex(0, "OUT", "LEFT", 1), 5);
assert.throws(() => variableSide6RelativeIndex(0, "IN", "RIGHT", -1));

console.log("PASS_SEA002_CP008_VARIABLE_SIDE6_TOPOLOGY_V1");
console.log("seat occupancy by side", "1,2,1,2");
console.log("corner seats", 0);
console.log("opposite pairs", "0-3,1-4,2-5");
console.log("same-side pairs", "1-2,4-5");
console.log("legitimate rotational symmetry", "180 degrees only");
console.log("inward/outward left-right inversion", "PROVEN");
