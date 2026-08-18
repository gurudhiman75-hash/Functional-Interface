import { GEO_CP_008_PHASE3_PROTOTYPES } from "../GEO-001/GEO-CP-008/prototypes";
import { assertPhase3, assertPhase3DeterministicAndShuffled, assertPhase3DiscoveryQuestion, passPhase3 } from "./phase3-test-helpers";

assertPhase3(GEO_CP_008_PHASE3_PROTOTYPES.length === 3, "CP-008 Phase-3 Wave 1 count mismatch");
for (const prototype of GEO_CP_008_PHASE3_PROTOTYPES) {
  const question = prototype.generate(`phase3-cp008:${prototype.temporaryPrototypeId}`);
  assertPhase3DiscoveryQuestion(question);
  assertPhase3(question.cpId === "GEO-CP-008", `${prototype.temporaryPrototypeId}: wrong ownership`);
  if (prototype.temporaryPrototypeId.includes("FOURTH-ANGLE")) {
    assertPhase3(question.answer === "80°", "Fourth-angle answer changed");
    assertPhase3(question.diagramModel === undefined, "General angle-sum prototype added a non-authoritative decorative quadrilateral");
    assertPhase3(question.independentVerifierResult.oracle === "INDEPENDENT_ARITHMETIC", "Fourth-angle verifier should be independent arithmetic");
  }
  if (prototype.temporaryPrototypeId.includes("PARALLELOGRAM")) {
    assertPhase3(question.answer === "9 cm", "Parallelogram diagonal answer changed");
    assertPhase3(question.diagramModel?.parallelMarks.length === 2, "Parallelogram diagram lacks both structural parallel pairs");
    assertPhase3(question.diagramModel?.equalLengthMarks.length === 0, "Parallelogram stem leaked the derived diagonal-bisection equality");
  }
  if (prototype.temporaryPrototypeId.includes("RHOMBUS")) {
    assertPhase3(question.answer === "90°", "Rhombus diagonal angle changed");
    assertPhase3(question.diagramModel?.equalLengthMarks.length === 1, "Rhombus diagram lacks the shape-defining equal-side mark group");
    assertPhase3(question.diagramModel?.rightAngleMarks.length === 0, "Rhombus stem diagram leaked the derived perpendicular-diagonal answer");
  }
  assertPhase3DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase3("cp008-quadrilateral-wave1");
