import { AngleConstraintEngine, angle, equals, rational } from "../../../../../shared/geometry";
import { assert, pass } from "./test-helpers";

const engine = new AngleConstraintEngine();
engine
  .addKnown("a", angle(65))
  .addEqual("a", "b", "VERTICAL_OPPOSITE_ANGLES")
  .addFixedSum(["b", "c", "d"], angle(180), "TRIANGLE_ANGLE_SUM")
  .addKnown("c", angle(45));
const solved = engine.solve("d");
assert(equals(solved.value, rational(70)), "Shared angle engine returned wrong target");
assert(solved.theoremTrace.includes("VERTICAL_OPPOSITE_ANGLES"), "Angle theorem trace missing vertical-angle theorem");
assert(solved.theoremTrace.includes("TRIANGLE_ANGLE_SUM"), "Angle theorem trace missing triangle-sum theorem");
pass("angle-engine");
