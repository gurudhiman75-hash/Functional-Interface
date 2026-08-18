import { CoordinateOracle, equals, rational } from "../../../../../shared/geometry";
import { assert, pass } from "./test-helpers";

const oracle = new CoordinateOracle({
  A: { x: rational(0), y: rational(0) },
  B: { x: rational(4), y: rational(0) },
  C: { x: rational(10), y: rational(2) },
  D: { x: rational(16), y: rational(2) },
});
assert(equals(oracle.parallelSegmentRatio("A", "B", "C", "D"), rational(2, 3)), "Exact segment ratio failed");
pass("segment-ratio");
