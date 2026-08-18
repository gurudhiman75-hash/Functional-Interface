import { getTheoremDefinition } from "../../../../../shared/geometry";
import { GEO_PHASE2_TEMPORARY_PROTOTYPES, GEO_PHASE2_TEMPORARY_PROTOTYPE_IDS } from "../GEO-001/discovery/phase2-registry";
import { assertPhase2, assertPhase2DiscoveryQuestion, passPhase2 } from "./phase2-test-helpers";

assertPhase2(GEO_PHASE2_TEMPORARY_PROTOTYPES.length === 8, "Phase 2 Wave 1 must contain exactly eight temporary prototypes");
assertPhase2(new Set(GEO_PHASE2_TEMPORARY_PROTOTYPE_IDS).size === 8, "Phase-2 temporary prototype IDs are not unique");
const cpCounts = new Map<string, number>();
for (const prototype of GEO_PHASE2_TEMPORARY_PROTOTYPES) {
  cpCounts.set(prototype.cpId, (cpCounts.get(prototype.cpId) ?? 0) + 1);
  const question = prototype.generate(`phase2-crosscut:${prototype.temporaryPrototypeId}`);
  assertPhase2DiscoveryQuestion(question);
  assertPhase2(question.proofEvents.length > 0, `${prototype.temporaryPrototypeId}: structured proof events missing`);
  for (const event of question.proofEvents) {
    const theorem = "reason" in event ? event.reason : "criterion" in event ? event.criterion : null;
    assertPhase2(theorem !== null && question.theoremTrace.includes(theorem), `${prototype.temporaryPrototypeId}: proof-event theorem missing from theorem trace`);
  }
}
assertPhase2(cpCounts.get("GEO-CP-004") === 2, "CP-004 Phase-2 prototype count mismatch");
assertPhase2(cpCounts.get("GEO-CP-005") === 3, "CP-005 Phase-2 prototype count mismatch");
assertPhase2(cpCounts.get("GEO-CP-006") === 3, "CP-006 Phase-2 prototype count mismatch");
assertPhase2(getTheoremDefinition("CENTROID_DIVIDES_MEDIAN_2_TO_1").family === "TRIANGLE_CENTRES", "Centroid theorem family classification is incorrect");
assertPhase2(!getTheoremDefinition("CENTROID_DIVIDES_MEDIAN_2_TO_1").learnerName.includes("CENTROID_DIVIDES_MEDIAN_2_TO_1"), "Centroid internal theorem id leaks through learner name");
passPhase2("crosscutting-phase2-discovery-contract");
