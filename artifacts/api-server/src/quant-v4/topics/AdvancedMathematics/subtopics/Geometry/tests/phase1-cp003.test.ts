import { GEO_CP_003_PHASE1_PROTOTYPES } from "../GEO-001/GEO-CP-003/prototypes";
import { assertDeterministicAndShuffled, assertDiscoveryQuestion, assertPhase1, passPhase1 } from "./phase1-test-helpers";

assertPhase1(GEO_CP_003_PHASE1_PROTOTYPES.length === 4, "GEO-CP-003 must start with exactly four recommended temporary prototypes");
for (const prototype of GEO_CP_003_PHASE1_PROTOTYPES) {
  const question = prototype.generate(`phase1-cp003:${prototype.temporaryPrototypeId}`);
  assertDiscoveryQuestion(question);
  assertPhase1(question.cpId === "GEO-CP-003", `${prototype.temporaryPrototypeId}: wrong CP ownership`);
  if (prototype.temporaryPrototypeId.includes("TRIANGLE-INEQUALITY")) {
    assertPhase1(question.diagramModel === undefined, "Triangle-inequality range prototype should not add a decorative diagram");
    const sides=question.stem.match(/Two sides of a triangle are (\\d+) cm and (\\d+) cm/);
    assertPhase1(Boolean(sides), "Triangle-inequality stem must state both side lengths");
    const sideA=Number(sides![1]);
    const sideB=Number(sides![2]);
    assertPhase1(question.answer === `${Math.abs(sideA-sideB)} < x < ${sideA+sideB}`,
      "Triangle-inequality range must match the generated sides");
    assertPhase1(question.independentVerifierResult.oracle === "EXACT_RANGE_ENUMERATION", "Triangle-inequality prototype lacks independent range enumeration");
  } else {
    assertPhase1(question.diagramModel !== undefined && question.stemSvg !== undefined, `${prototype.temporaryPrototypeId}: theorem-led triangle prototype lacks diagram`);
  }
  if (prototype.temporaryPrototypeId.includes("ISOSCELES")) {
    assertPhase1(question.diagramModel?.equalLengthMarks.length === 1, "Isosceles diagram lacks explicit equal-side marks");
    assertPhase1(question.stemSvg?.includes('data-geo-kind="equal-length-mark"'), "Isosceles equal-side mark was not rendered visibly");
  }
  if (prototype.temporaryPrototypeId.includes("EXTERIOR")) {
    const model = question.diagramModel!;
    assertPhase1(model.segments.some((segment) => segment.id === "AD"), "Exterior-angle diagram does not draw the extended AB line through D");
    const A = model.points.find((point) => point.id === "A")!;
    const B = model.points.find((point) => point.id === "B")!;
    const D = model.points.find((point) => point.id === "D")!;
    const cross = (B.x - A.x) * (D.y - A.y) - (B.y - A.y) * (D.x - A.x);
    assertPhase1(Math.abs(cross) < 1e-9, "Exterior-angle diagram does not place A, B and D on one straight line");
    assertPhase1(question.stem.includes("AB is extended through B to D"), "Exterior-angle stem does not state the extension topology");
  }
  assertDeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase1("cp003-temporary-prototypes");
