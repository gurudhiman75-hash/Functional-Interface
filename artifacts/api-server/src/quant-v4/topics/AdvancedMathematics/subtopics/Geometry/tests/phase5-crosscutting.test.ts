import { getTheoremDefinition } from "../../../../../shared/geometry";
import { GEO_PHASE5_TEMPORARY_PROTOTYPES, GEO_PHASE5_TEMPORARY_PROTOTYPE_IDS } from "../GEO-002/discovery/phase5-registry";
import { assertPhase5, assertPhase5DiscoveryQuestion, passPhase5 } from "./phase5-test-helpers";

assertPhase5(GEO_PHASE5_TEMPORARY_PROTOTYPES.length === 4, "Phase 5 Mixed Wave 1 prototype count mismatch");
assertPhase5(new Set(GEO_PHASE5_TEMPORARY_PROTOTYPE_IDS).size === 4, "Phase 5 temporary prototype IDs are not unique");
for (const prototype of GEO_PHASE5_TEMPORARY_PROTOTYPES) {
  const question = prototype.generate(`phase5-crosscutting:${prototype.temporaryPrototypeId}`);
  assertPhase5DiscoveryQuestion(question);
  const families = new Set(question.theoremTrace.map((id) => getTheoremDefinition(id).family).filter((family) => family !== "GENERIC"));
  assertPhase5(families.size >= 2, `${prototype.temporaryPrototypeId}: fewer than two genuine theorem families`);
  for (const event of question.proofEvents) {
    const reason = "reason" in event ? event.reason : "criterion" in event ? event.criterion : null;
    assertPhase5(reason !== null && question.theoremTrace.includes(reason), `${prototype.temporaryPrototypeId}: proof-event reason missing from theorem trace`);
  }
}
passPhase5("crosscutting-genuine-mixed-contract");
