import { ConstraintGraph, equals, rational, solveConstraintGraph } from "../../../../../shared/geometry";
import { assert, pass } from "./test-helpers";

const graph = new ConstraintGraph();
graph.addEquation([{ variable: "x", coefficient: rational(1) }, { variable: "y", coefficient: rational(1) }], rational(180), "LINEAR_PAIR_SUM");
graph.addEquation([{ variable: "y", coefficient: rational(1) }], rational(110), "GIVEN_ANGLE");
const solved = solveConstraintGraph(graph);
assert(equals(solved.values.get("x")!, rational(70)), "Constraint graph did not solve x exactly");
assert(solved.rank === 2 && solved.variableCount === 2, "Constraint rank accounting failed");
pass("constraint-graph");
