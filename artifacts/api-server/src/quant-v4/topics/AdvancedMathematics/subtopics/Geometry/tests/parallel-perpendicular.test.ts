import { CoordinateOracle, rational } from "../../../../../shared/geometry";
import { assert, pass } from "./test-helpers";

const oracle = new CoordinateOracle({
  A: { x: rational(0), y: rational(0) },
  B: { x: rational(4), y: rational(0) },
  C: { x: rational(0), y: rational(3) },
  D: { x: rational(8), y: rational(3) },
  E: { x: rational(0), y: rational(5) },
});
assert(oracle.parallel("A", "B", "C", "D"), "Parallel vectors were not recognized");
assert(oracle.perpendicular("A", "B", "A", "E"), "Perpendicular vectors were not recognized");
assert(!oracle.parallel("A", "A", "C", "D"), "Zero-length vector was accepted as parallel");
assert(!oracle.perpendicular("A", "A", "A", "E"), "Zero-length vector was accepted as perpendicular");
pass("parallel-perpendicular");
