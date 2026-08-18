import { GEO_CP_013_PHASE4_PROTOTYPES } from "../GEO-002/GEO-CP-013/prototypes";
import { assertPhase4, assertPhase4DeterministicAndShuffled, assertPhase4DiscoveryQuestion, passPhase4 } from "./phase4-test-helpers";

function cross(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

assertPhase4(GEO_CP_013_PHASE4_PROTOTYPES.length === 3, "CP-013 Circle Wave 1 count mismatch");
for (const prototype of GEO_CP_013_PHASE4_PROTOTYPES) {
  const question = prototype.generate(`phase4-cp013:${prototype.temporaryPrototypeId}`);
  assertPhase4DiscoveryQuestion(question);
  assertPhase4(question.cpId === "GEO-CP-013", `${prototype.temporaryPrototypeId}: wrong CP ownership`);
  assertPhase4(question.proofEvents.some((event) => event.kind === "SEGMENT_PRODUCT"), `${prototype.temporaryPrototypeId}: power-of-point prototype lacks product proof event`);
  if (prototype.temporaryPrototypeId.includes("INTERSECTING")) assertPhase4(question.answer === "4 cm", "Intersecting-chord answer changed");
  if (prototype.temporaryPrototypeId.includes("SECANT-SECANT")) {
    assertPhase4(question.answer === "6 cm", "Secant-secant answer changed");
    const point = (id: string) => question.diagramModel!.points.find((candidate) => candidate.id === id)!;
    assertPhase4(Math.abs(cross(point("P"), point("A"), point("B"))) < 1e-8, "P-A-B secant topology is not collinear in learner diagram");
    assertPhase4(Math.abs(cross(point("P"), point("C"), point("D"))) < 1e-8, "P-C-D secant topology is not collinear in learner diagram");
  }
  if (prototype.temporaryPrototypeId.includes("TANGENT-SECANT")) {
    assertPhase4(question.answer === "6 cm", "Tangent-secant answer changed");
    assertPhase4(question.stem.includes("whole secant PB"), "Tangent-secant stem does not disambiguate whole versus external secant length");
  }
  assertPhase4DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase4("cp013-power-of-point-wave1");
