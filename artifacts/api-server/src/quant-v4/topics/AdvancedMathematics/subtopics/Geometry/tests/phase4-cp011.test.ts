import { GEO_CP_011_PHASE4_PROTOTYPES } from "../GEO-002/GEO-CP-011/prototypes";
import { numericAngleDegrees } from "../GEO-002/discovery/phase4-utils";
import { assertPhase4, assertPhase4DeterministicAndShuffled, assertPhase4DiscoveryQuestion, passPhase4 } from "./phase4-test-helpers";

assertPhase4(GEO_CP_011_PHASE4_PROTOTYPES.length === 2, "CP-011 Circle Wave 1 count mismatch");
for (const prototype of GEO_CP_011_PHASE4_PROTOTYPES) {
  const question = prototype.generate(`phase4-cp011:${prototype.temporaryPrototypeId}`);
  assertPhase4DiscoveryQuestion(question);
  assertPhase4(question.cpId === "GEO-CP-011", `${prototype.temporaryPrototypeId}: wrong CP ownership`);
  if (prototype.temporaryPrototypeId.includes("CENTRAL")) {
    assertPhase4(question.answer === "90°", "Central-angle answer changed");
    assertPhase4(question.diagramModel!.rightAngleMarks.length === 0, "Central-angle stem leaked target 90° with a right-angle mark");
    const point = (id: string) => question.diagramModel!.points.find((candidate) => candidate.id === id)!;
    const O = point("O"); const A = point("A"); const B = point("B");
    const visualDot = (A.x - O.x) * (B.x - O.x) + (A.y - O.y) * (B.y - O.y);
    assertPhase4(Math.abs(visualDot) > 1e-6, "Central-angle layout visually leaked a right angle");
  } else {
    assertPhase4(question.answer === "70°", "Cyclic-opposite answer changed");
    assertPhase4(question.independentVerifierResult.oracle === "HIGH_PRECISION_COORDINATE", "Cyclic prototype lacks independent coordinate angle verification");
    const point = (id: string) => question.diagramModel!.points.find((candidate) => candidate.id === id)!;
    const visualC = numericAngleDegrees(point("B"), point("C"), point("D"));
    assertPhase4(Math.abs(visualC - 70) > 3, "Cyclic learner layout is too close to the numeric target and may leak by measurement");
  }
  assertPhase4DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase4("cp011-cyclic-angle-wave1");
