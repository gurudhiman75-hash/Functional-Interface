import { CoordinateOracle, rational } from "../../../../../shared/geometry";
import { assert, pass } from "./test-helpers";

const oracle = new CoordinateOracle({
  O: { x: rational(0), y: rational(0) },
  P: { x: rational(3), y: rational(4) },
  Q: { x: rational(4), y: rational(4) },
});
assert(oracle.pointOnCircle("P", "O", rational(25)), "On-circle point was rejected");
assert(!oracle.pointOnCircle("Q", "O", rational(25)), "Off-circle point was accepted");
pass("circle-incidence");
