import { GEO_PHASE4_TEMPORARY_PROTOTYPES, GEO_PHASE4_TEMPORARY_PROTOTYPE_IDS } from "../GEO-002/discovery/phase4-registry";
import { assertPhase4, assertPhase4DiscoveryQuestion, passPhase4 } from "./phase4-test-helpers";

assertPhase4(GEO_PHASE4_TEMPORARY_PROTOTYPES.length === 9, "Phase 4 Circle Wave 1 must contain nine temporary prototypes");
assertPhase4(new Set(GEO_PHASE4_TEMPORARY_PROTOTYPE_IDS).size === 9, "Phase 4 temporary prototype IDs are not unique");
const cpCounts = new Map<string, number>();
for (const prototype of GEO_PHASE4_TEMPORARY_PROTOTYPES) {
  cpCounts.set(prototype.cpId, (cpCounts.get(prototype.cpId) ?? 0) + 1);
  const question = prototype.generate(`phase4-crosscutting:${prototype.temporaryPrototypeId}`);
  assertPhase4DiscoveryQuestion(question);
  for (const event of question.proofEvents) {
    const reason = "reason" in event ? event.reason : "criterion" in event ? event.criterion : null;
    assertPhase4(reason !== null && question.theoremTrace.includes(reason), `${prototype.temporaryPrototypeId}: proof-event reason missing from theorem trace`);
  }
}
assertPhase4(cpCounts.get("GEO-CP-010") === 2, "CP-010 prototype count mismatch");
assertPhase4(cpCounts.get("GEO-CP-011") === 2, "CP-011 prototype count mismatch");
assertPhase4(cpCounts.get("GEO-CP-012") === 2, "CP-012 prototype count mismatch");
assertPhase4(cpCounts.get("GEO-CP-013") === 3, "CP-013 prototype count mismatch");
passPhase4("crosscutting-circle-discovery-contract");
