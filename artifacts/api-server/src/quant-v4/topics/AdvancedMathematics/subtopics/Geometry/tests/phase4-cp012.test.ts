import { GEO_CP_012_PHASE4_PROTOTYPES } from "../GEO-002/GEO-CP-012/prototypes";
import { assertPhase4, assertPhase4DeterministicAndShuffled, assertPhase4DiscoveryQuestion, passPhase4 } from "./phase4-test-helpers";

assertPhase4(GEO_CP_012_PHASE4_PROTOTYPES.length === 2, "CP-012 Circle Wave 1 count mismatch");
for (const prototype of GEO_CP_012_PHASE4_PROTOTYPES) {
  const question = prototype.generate(`phase4-cp012:${prototype.temporaryPrototypeId}`);
  assertPhase4DiscoveryQuestion(question);
  assertPhase4(question.cpId === "GEO-CP-012", `${prototype.temporaryPrototypeId}: wrong CP ownership`);
  assertPhase4(question.independentVerifierResult.oracle === "COORDINATE_ORACLE", `${prototype.temporaryPrototypeId}: tangent theorem lacks coordinate oracle`);
  if (prototype.temporaryPrototypeId.includes("RADIUS-TANGENT")) {
    assertPhase4(question.answer === "90°", "Radius-tangent answer changed");
    assertPhase4(question.diagramModel!.rightAngleMarks.length === 0, "Radius-tangent stem leaked the target right angle");
    const point = (id: string) => question.diagramModel!.points.find((candidate) => candidate.id === id)!;
    const O = point("O"); const T = point("T"); const P = point("P");
    const visualDot = (O.x - T.x) * (P.x - T.x) + (O.y - T.y) * (P.y - T.y);
    assertPhase4(Math.abs(visualDot) > 1e-6, "Radius-tangent learner layout visually leaked perpendicularity");
  } else {
    assertPhase4(question.answer === "9 cm", "Equal-tangents answer changed");
    assertPhase4(question.diagramModel!.equalLengthMarks.length === 0, "Equal-tangents stem leaked the target equality with tick marks");
  }
  assertPhase4DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase4("cp012-tangent-wave1");
