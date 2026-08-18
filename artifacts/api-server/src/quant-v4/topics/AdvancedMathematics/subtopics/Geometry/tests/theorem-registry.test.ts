import { GEOMETRY_THEOREM_IDS, getTheoremDefinition, listTheorems } from "../../../../../shared/geometry";
import { assert, pass } from "./test-helpers";

assert(listTheorems().length === GEOMETRY_THEOREM_IDS.length, "Theorem registry is incomplete");
const vertical = getTheoremDefinition("VERTICAL_OPPOSITE_ANGLES");
assert(vertical.family === "LINES", "Vertical-angle theorem has wrong family");
assert(vertical.phase0Executable, "Vertical-angle theorem should be Phase-0 executable");
assert(!vertical.learnerName.includes("VERTICAL_OPPOSITE_ANGLES"), "Internal theorem id leaked into learner theorem name");
pass("theorem-registry");
