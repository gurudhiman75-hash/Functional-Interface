import { getTheoremDefinition } from "../../../../../shared/geometry";
import { GEO_CP_014_PHASE5_PROTOTYPES } from "../GEO-002/GEO-CP-014/prototypes";
import { numericAngleDegrees } from "../GEO-002/discovery/phase5-utils";
import { assertPhase5, assertPhase5DeterministicAndShuffled, assertPhase5DiscoveryQuestion, passPhase5 } from "./phase5-test-helpers";

assertPhase5(GEO_CP_014_PHASE5_PROTOTYPES.length === 4, "CP-014 Mixed Wave 1 must contain four temporary prototypes");
for (const prototype of GEO_CP_014_PHASE5_PROTOTYPES) {
  const question = prototype.generate(`phase5-cp014:${prototype.temporaryPrototypeId}`);
  assertPhase5DiscoveryQuestion(question);
  const theoremFamilies = new Set(question.theoremTrace.map((id) => getTheoremDefinition(id).family).filter((family) => family !== "GENERIC"));
  assertPhase5(theoremFamilies.size >= 2, `${prototype.temporaryPrototypeId}: mixed question does not genuinely span two theorem families`);

  if (prototype.temporaryPrototypeId.includes("CHORD-PYTHAGORAS")) {
    assertPhase5(question.answer === "12 cm", "Chord + Pythagoras answer changed");
    assertPhase5(question.diagramModel!.rightAngleMarks.length === 1, "Supplied centre-perpendicular relation is not marked");
    assertPhase5(question.diagramModel!.equalLengthMarks.length === 0, "Stem leaked derived chord-bisection equality");
    const point = (id: string) => question.diagramModel!.points.find((candidate) => candidate.id === id)!;
    const am = Math.hypot(point("A").x - point("M").x, point("A").y - point("M").y);
    const mb = Math.hypot(point("M").x - point("B").x, point("M").y - point("B").y);
    assertPhase5(Math.abs(am - mb) > 5, "Chord learner layout visually leaked exact bisection by scale");
  }

  if (prototype.temporaryPrototypeId.includes("CYCLIC-ISOSCELES")) {
    assertPhase5(question.answer === "55°", "Cyclic + isosceles answer changed");
    assertPhase5(question.diagramModel!.equalLengthMarks.some((mark) => mark.segmentIds.includes("BC") && mark.segmentIds.includes("CD")), "Supplied BC = CD relation is not marked");
    const point = (id: string) => question.diagramModel!.points.find((candidate) => candidate.id === id)!;
    const visualTarget = numericAngleDegrees(point("C"), point("B"), point("D"));
    assertPhase5(Math.abs(visualTarget - 55) > 10, "Cyclic-isosceles learner layout is too close to the numeric target");
  }

  if (prototype.temporaryPrototypeId.includes("TANGENT-TRIANGLE")) {
    assertPhase5(question.answer === "55°", "Tangent + triangle answer changed");
    assertPhase5(question.diagramModel!.rightAngleMarks.length === 0, "Tangent mixed stem leaked derived right angle");
    const point = (id: string) => question.diagramModel!.points.find((candidate) => candidate.id === id)!;
    const O = point("O"); const T = point("T"); const P = point("P");
    const visualDot = (O.x - T.x) * (P.x - T.x) + (O.y - T.y) * (P.y - T.y);
    assertPhase5(Math.abs(visualDot) > 1e-6, "Tangent mixed learner layout visually leaked perpendicularity");
    const visualTarget = numericAngleDegrees(O, P, T);
    assertPhase5(Math.abs(visualTarget - 55) > 10, "Tangent mixed learner layout is too close to the target angle");
  }

  if (prototype.temporaryPrototypeId.includes("BPT-BISECTOR")) {
    assertPhase5(question.answer === "6 cm", "BPT + angle-bisector answer changed");
    assertPhase5(question.diagramModel!.parallelMarks.some((mark) => mark.segmentIds.includes("EF") && mark.segmentIds.includes("BC")), "Supplied EF ∥ BC relation is not marked");
    assertPhase5(question.diagramModel!.equalLengthMarks.length === 0, "BPT + bisector stem invented an unstated equal-length relation");
    assertPhase5(question.diagramModel!.segments.some((segment) => segment.id === "AD"), "Angle-bisector segment AD is missing from learner diagram");
  }
  assertPhase5DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase5("cp014-genuine-mixed-wave1");
