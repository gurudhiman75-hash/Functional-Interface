import assert from "node:assert/strict";

import {
  squareOppositeIndex,
  squareQuarterSpan,
  squareRelativeIndex,
  squareRoleFacing,
  squareRotateQuarterIndex,
  squareSameSide,
  squareSeat,
  squareSeatCount,
  squareSeats,
  squareTopologyFingerprint,
  type Sea002Cp008SquareSchema,
} from "./topology-v1.ts";

const schemas: readonly Sea002Cp008SquareSchema[] = [
  "ALT8_CORNERS_MIDDLES",
  "SIDEPAIR8",
  "ALT12_CORNER_PLUS_TWO_SIDE",
];

for (const schema of schemas) {
  const seats = squareSeats(schema);
  const count = squareSeatCount(schema);
  assert.equal(seats.length, count);
  assert.equal(new Set(seats.map((seat) => seat.index)).size, count);
  assert.equal(new Set(seats.map((seat) => seat.side)).size, 4);
  assert.ok(squareTopologyFingerprint(schema).length > 20);

  for (const seat of seats) {
    assert.equal(squareOppositeIndex(schema, squareOppositeIndex(schema, seat.index)), seat.index);
    assert.equal(squareRotateQuarterIndex(schema, seat.index, 4), seat.index);
    assert.equal(squareRotateQuarterIndex(schema, seat.index, 1), (seat.index + squareQuarterSpan(schema)) % count);

    for (const facing of ["IN", "OUT"] as const) {
      const right = squareRelativeIndex(schema, seat.index, facing, "RIGHT", 1);
      const left = squareRelativeIndex(schema, seat.index, facing, "LEFT", 1);
      assert.notEqual(right, left);
      assert.equal(squareRelativeIndex(schema, right, facing, "LEFT", 1), seat.index);
      assert.equal(squareRelativeIndex(schema, left, facing, "RIGHT", 1), seat.index);
    }
  }
}

const alt8 = squareSeats("ALT8_CORNERS_MIDDLES");
assert.equal(alt8.filter((seat) => seat.role === "CORNER").length, 4);
assert.equal(alt8.filter((seat) => seat.role === "SIDE").length, 4);
assert.deepEqual(alt8.map((seat) => seat.role), ["CORNER", "SIDE", "CORNER", "SIDE", "CORNER", "SIDE", "CORNER", "SIDE"]);
assert.equal(squareSeat("ALT8_CORNERS_MIDDLES", 0).corner, 0);
assert.equal(squareSeat("ALT8_CORNERS_MIDDLES", 7).side, 3);

const sidePair = squareSeats("SIDEPAIR8");
assert.ok(sidePair.every((seat) => seat.role === "SIDE"));
for (let side = 0; side < 4; side += 1) {
  assert.equal(sidePair.filter((seat) => seat.side === side).length, 2);
}
assert.equal(squareSameSide("SIDEPAIR8", 0, 1), true);
assert.equal(squareSameSide("SIDEPAIR8", 1, 2), false);
assert.equal(squareOppositeIndex("SIDEPAIR8", 0), 4);
assert.equal(squareOppositeIndex("SIDEPAIR8", 1), 5);

const alt12 = squareSeats("ALT12_CORNER_PLUS_TWO_SIDE");
assert.equal(alt12.filter((seat) => seat.role === "CORNER").length, 4);
assert.equal(alt12.filter((seat) => seat.role === "SIDE").length, 8);
for (let side = 0; side < 4; side += 1) {
  assert.equal(alt12.filter((seat) => seat.side === side && seat.role === "SIDE").length, 2);
}
assert.equal(squareOppositeIndex("ALT12_CORNER_PLUS_TWO_SIDE", 0), 6);
assert.equal(squareOppositeIndex("ALT12_CORNER_PLUS_TWO_SIDE", 1), 7);
assert.equal(squareOppositeIndex("ALT12_CORNER_PLUS_TWO_SIDE", 2), 8);

assert.equal(squareRoleFacing("CORNER", "CORNERS_IN_SIDES_OUT"), "IN");
assert.equal(squareRoleFacing("SIDE", "CORNERS_IN_SIDES_OUT"), "OUT");
assert.equal(squareRoleFacing("CORNER", "CORNERS_OUT_SIDES_IN"), "OUT");
assert.equal(squareRoleFacing("SIDE", "CORNERS_OUT_SIDES_IN"), "IN");

// Indices increase clockwise. Inward right therefore moves anticlockwise; outward right moves clockwise.
assert.equal(squareRelativeIndex("ALT8_CORNERS_MIDDLES", 0, "IN", "RIGHT", 1), 7);
assert.equal(squareRelativeIndex("ALT8_CORNERS_MIDDLES", 0, "OUT", "RIGHT", 1), 1);
assert.equal(squareRelativeIndex("ALT8_CORNERS_MIDDLES", 0, "IN", "LEFT", 1), 1);
assert.equal(squareRelativeIndex("ALT8_CORNERS_MIDDLES", 0, "OUT", "LEFT", 1), 7);

assert.throws(() => squareRelativeIndex("ALT8_CORNERS_MIDDLES", 0, "IN", "RIGHT", -1));

console.log("PASS_SEA002_CP008_SQUARE_TOPOLOGY_V1");
console.log("schemas", schemas.join(","));
console.log("ALT8 roles", "4 corners + 4 side middles");
console.log("SIDEPAIR8", "2 seats per side");
console.log("ALT12 roles", "4 corners + 8 side seats");
console.log("opposite and 90-degree rotation invariants", "PROVEN");
console.log("inward/outward left-right inversion", "PROVEN");
