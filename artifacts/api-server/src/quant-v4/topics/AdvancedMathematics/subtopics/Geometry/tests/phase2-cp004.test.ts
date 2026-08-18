import { GEO_CP_004_PHASE2_PROTOTYPES } from "../GEO-001/GEO-CP-004/prototypes";
import { assertPhase2, assertPhase2DeterministicAndShuffled, assertPhase2DiscoveryQuestion, passPhase2 } from "./phase2-test-helpers";

assertPhase2(GEO_CP_004_PHASE2_PROTOTYPES.length === 2, "GEO-CP-004 Phase-2 Wave 1 must contain two temporary prototypes");
for (const prototype of GEO_CP_004_PHASE2_PROTOTYPES) {
  const question = prototype.generate(`phase2-cp004:${prototype.temporaryPrototypeId}`);
  assertPhase2DiscoveryQuestion(question);
  assertPhase2(question.cpId === "GEO-CP-004", `${prototype.temporaryPrototypeId}: wrong CP ownership`);
  assertPhase2(question.diagramModel !== undefined && question.stemSvg !== undefined, `${prototype.temporaryPrototypeId}: congruence prototype lacks semantic diagram`);
  assertPhase2(question.proofEvents.some((event) => event.kind === "CONGRUENCE"), `${prototype.temporaryPrototypeId}: congruence proof event missing`);
  if (prototype.temporaryPrototypeId.includes("RHS")) {
    assertPhase2(question.answer === "RHS", "RHS criterion answer changed");
    assertPhase2(question.diagramModel?.rightAngleMarks.length === 2, "RHS diagram must show both provided right angles");
    assertPhase2(question.diagramModel?.equalLengthMarks.length === 2, "RHS diagram must show exactly the two supplied equality groups");
  } else {
    assertPhase2(question.answer === "∠R", "CPCT correspondence answer changed");
    assertPhase2(question.theoremTrace.includes("SSS_CONGRUENCE") && question.theoremTrace.includes("CPCT"), "CPCT prototype theorem chain is incomplete");
    assertPhase2(question.diagramModel?.rightAngleMarks.length === 0, "SSS correspondence diagram leaked an unstated right angle");
    assertPhase2(question.diagramModel?.equalLengthMarks.length === 3, "SSS diagram does not show all three supplied side-pair equalities");
  }
  assertPhase2DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase2("cp004-congruence-wave1");
