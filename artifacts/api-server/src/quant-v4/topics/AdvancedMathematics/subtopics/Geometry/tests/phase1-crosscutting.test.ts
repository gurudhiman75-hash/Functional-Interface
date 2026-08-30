import { GEO_PHASE1_TEMPORARY_PROTOTYPES, GEO_PHASE1_TEMPORARY_PROTOTYPE_IDS } from "../GEO-001/discovery/phase1-registry";
import { assertDiscoveryQuestion, assertPhase1, passPhase1 } from "./phase1-test-helpers";

assertPhase1(GEO_PHASE1_TEMPORARY_PROTOTYPES.length === 8, "Phase 1 must contain the eight Rev-2 recommended temporary prototypes");
assertPhase1(new Set(GEO_PHASE1_TEMPORARY_PROTOTYPE_IDS).size === 8, "Temporary prototype IDs are not unique");
const cpCounts = new Map<string, number>();
let proofEventPrototypeCount = 0;
for (const prototype of GEO_PHASE1_TEMPORARY_PROTOTYPES) {
  cpCounts.set(prototype.cpId, (cpCounts.get(prototype.cpId) ?? 0) + 1);
  const question = prototype.generate(`phase1-crosscutting:${prototype.temporaryPrototypeId}`);
  assertDiscoveryQuestion(question);
  if (question.proofEvents.length > 0) proofEventPrototypeCount += 1;
  for (const event of question.proofEvents) {
    const reason = "reason" in event ? event.reason : "criterion" in event ? event.criterion : null;
    assertPhase1(reason !== null && question.theoremTrace.includes(reason), `${prototype.temporaryPrototypeId}: proof event reason missing from theorem trace`);
  }
}
assertPhase1(cpCounts.get("GEO-CP-001") === 2, "Phase-1 CP-001 prototype count mismatch");
assertPhase1(cpCounts.get("GEO-CP-002") === 2, "Phase-1 CP-002 prototype count mismatch");
assertPhase1(cpCounts.get("GEO-CP-003") === 4, "Phase-1 CP-003 prototype count mismatch");
assertPhase1(proofEventPrototypeCount === 7, "Exactly seven angle-theorem prototypes should emit structured Phase-1 proof events");
passPhase1("crosscutting-discovery-contract");
