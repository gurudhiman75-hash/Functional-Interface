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
  if (prototype.temporaryPrototypeId.includes("INTERSECTING")) {
    const given = question.stem.match(/PA = (\d+) cm, PB = (\d+) cm and PC = (\d+) cm, find PD/);
    assertPhase4(Boolean(given), "Intersecting-chord stem must state the three given segments");
    const [, pa, pb, pc] = given!.map(Number);
    assertPhase4(question.answer === `${pa * pb / pc} cm`, "Intersecting chord must satisfy PA × PB = PC × PD");
    const point = (id: string) => question.diagramModel!.points.find((candidate) => candidate.id === id)!;
    const O = point("O"); const P = point("P");
    assertPhase4(Math.hypot(O.x - P.x, O.y - P.y) > 5, "Intersecting-chord diagram overlaps centre O with intersection P");
    assertPhase4(Math.abs(cross(point("A"), P, point("B"))) < 1e-8, "A-P-B chord topology is not collinear in learner diagram");
    assertPhase4(Math.abs(cross(point("C"), P, point("D"))) < 1e-8, "C-P-D chord topology is not collinear in learner diagram");
  }
  if (prototype.temporaryPrototypeId.includes("SECANT-SECANT")) {
    const given = question.stem.match(/PA = (\d+) cm, PB = (\d+) cm, and PC = (\d+) cm/);
    assertPhase4(Boolean(given), "Secant-secant stem must state external and whole segments");
    const [, pa, pb, pc] = given!.map(Number);
    assertPhase4(question.answer === `${pa * pb / pc} cm`, "Secant-secant must satisfy PA × PB = PC × PD");
    const point = (id: string) => question.diagramModel!.points.find((candidate) => candidate.id === id)!;
    assertPhase4(Math.abs(cross(point("P"), point("A"), point("B"))) < 1e-8, "P-A-B secant topology is not collinear in learner diagram");
    assertPhase4(Math.abs(cross(point("P"), point("C"), point("D"))) < 1e-8, "P-C-D secant topology is not collinear in learner diagram");
  }
  if (prototype.temporaryPrototypeId.includes("TANGENT-SECANT")) {
    const given = question.stem.match(/PA = (\d+) cm and the whole secant PB = (\d+) cm/);
    assertPhase4(Boolean(given), "Tangent-secant stem must state PA and whole PB");
    const [, pa, pb] = given!.map(Number);
    assertPhase4(question.answer === `${Math.sqrt(pa * pb)} cm`, "Tangent-secant must satisfy PT² = PA × PB");
    assertPhase4(question.stem.includes("whole secant PB"), "Tangent-secant stem does not disambiguate whole versus external secant length");
  }
  assertPhase4DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase4("cp013-power-of-point-wave1");
