import { CoordinateOracle, equals, rational } from "../../../../../shared/geometry";
import { assert, pass } from "./test-helpers";

const oracle = new CoordinateOracle({
  A: { x: rational(0), y: rational(0) },
  B: { x: rational(3), y: rational(4) },
  C: { x: rational(6), y: rational(8) },
  D: { x: rational(-4), y: rational(3) },
});
assert(oracle.collinear("A", "B", "C"), "Coordinate oracle collinearity failed");
assert(equals(oracle.squaredLength("A", "B"), rational(25)), "Coordinate oracle exact squared length failed");
assert(oracle.perpendicular("A", "B", "A", "D"), "Coordinate oracle perpendicular check failed");
pass("coordinate-oracle");
