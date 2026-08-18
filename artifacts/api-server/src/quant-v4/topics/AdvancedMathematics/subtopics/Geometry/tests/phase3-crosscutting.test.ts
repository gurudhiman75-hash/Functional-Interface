import { getTheoremDefinition } from "../../../../../shared/geometry";
import { GEO_PHASE3_TEMPORARY_PROTOTYPES, GEO_PHASE3_TEMPORARY_PROTOTYPE_IDS } from "../GEO-001/discovery/phase3-registry";
import { assertPhase3, assertPhase3DiscoveryQuestion, passPhase3 } from "./phase3-test-helpers";

assertPhase3(GEO_PHASE3_TEMPORARY_PROTOTYPES.length === 9, "Phase 3 Wave 1 must contain nine temporary prototypes");
assertPhase3(new Set(GEO_PHASE3_TEMPORARY_PROTOTYPE_IDS).size === 9, "Phase-3 prototype IDs are not unique");
const counts = new Map<string, number>();
for (const prototype of GEO_PHASE3_TEMPORARY_PROTOTYPES) {
  counts.set(prototype.cpId, (counts.get(prototype.cpId) ?? 0) + 1);
  const question = prototype.generate(`phase3-crosscut:${prototype.temporaryPrototypeId}`);
  assertPhase3DiscoveryQuestion(question);
  for (const event of question.proofEvents) {
    const theorem = "reason" in event ? event.reason : "criterion" in event ? event.criterion : null;
    assertPhase3(theorem !== null && question.theoremTrace.includes(theorem), `${prototype.temporaryPrototypeId}: proof-event theorem missing from trace`);
  }
}
assertPhase3(counts.get("GEO-CP-007") === 2 && counts.get("GEO-CP-008") === 3 && counts.get("GEO-CP-009") === 4, "Phase-3 CP allocation mismatch");
assertPhase3(getTheoremDefinition("RIGHT_TRIANGLE_HYPOTENUSE_MEDIAN").family === "RIGHT_TRIANGLE", "Hypotenuse-median theorem family incorrect");
assertPhase3(getTheoremDefinition("PARALLELOGRAM_DIAGONALS_BISECT").family === "QUADRILATERALS", "Parallelogram theorem family incorrect");
assertPhase3(getTheoremDefinition("POLYGON_DIAGONAL_COUNT").family === "POLYGONS", "Polygon diagonal theorem family incorrect");
passPhase3("crosscutting-phase3-discovery-contract");
