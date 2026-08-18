import { GEO_CP_008_PHASE3_PROTOTYPES } from "../GEO-001/GEO-CP-008/prototypes";
import { assertPhase3, assertPhase3DeterministicAndShuffled, assertPhase3DiscoveryQuestion, passPhase3 } from "./phase3-test-helpers";

function diagonalVisualDot(question: ReturnType<(typeof GEO_CP_008_PHASE3_PROTOTYPES)[number]["generate"]>): number {
  const point = (id: string) => question.diagramModel?.points.find((candidate) => candidate.id === id);
  const a = point("A"); const b = point("B"); const c = point("C"); const d = point("D");
  if (!a || !b || !c || !d) throw new Error("Missing rhombus visual point");
  return (c.x - a.x) * (d.x - b.x) + (c.y - a.y) * (d.y - b.y);
}

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
    assertPhase3(diagonalVisualDot(question) !== 0, "Rhombus layout visually leaked perpendicular diagonals");
  }
  assertPhase3DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase3("cp008-quadrilateral-wave1");
