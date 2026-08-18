import { GEO_CP_006_PHASE2_PROTOTYPES } from "../GEO-001/GEO-CP-006/prototypes";
import { assertPhase2, assertPhase2DeterministicAndShuffled, assertPhase2DiscoveryQuestion, passPhase2 } from "./phase2-test-helpers";

assertPhase2(GEO_CP_006_PHASE2_PROTOTYPES.length === 3, "GEO-CP-006 Phase-2 Wave 1 must contain three temporary prototypes");
for (const prototype of GEO_CP_006_PHASE2_PROTOTYPES) {
  const question = prototype.generate(`phase2-cp006:${prototype.temporaryPrototypeId}`);
  assertPhase2DiscoveryQuestion(question);
  assertPhase2(question.cpId === "GEO-CP-006", `${prototype.temporaryPrototypeId}: wrong CP ownership`);
  assertPhase2(question.diagramModel !== undefined && question.stemSvg !== undefined, `${prototype.temporaryPrototypeId}: centre/bisector/midpoint prototype lacks semantic diagram`);
  if (prototype.temporaryPrototypeId.includes("CENTROID")) {
    assertPhase2(question.answer === "8 cm", "Centroid 2:1 answer changed");
    assertPhase2(question.theoremTrace.includes("CENTROID_DIVIDES_MEDIAN_2_TO_1"), "Centroid theorem trace missing");
    assertPhase2(question.diagramModel?.equalLengthMarks.length === 1, "Centroid diagram must show that M is the supplied midpoint on the median");
  }
  if (prototype.temporaryPrototypeId.includes("ANGLE-BISECTOR")) {
    assertPhase2(question.answer === "20 cm", "Angle-bisector theorem answer changed");
    const alphaMarks = question.diagramModel?.angleMarks.filter((mark) => mark.label === "α") ?? [];
    assertPhase2(alphaMarks.length === 2, "Angle-bisector diagram does not show the supplied equal angle halves");
    assertPhase2(question.diagramModel?.rightAngleMarks.length === 0, "Angle-bisector stem leaked the hidden oracle's right-angle realization");
  }
  if (prototype.temporaryPrototypeId.includes("MIDPOINT")) {
    assertPhase2(question.answer === "5 cm", "Midpoint theorem answer changed");
    assertPhase2(question.diagramModel?.equalLengthMarks.length === 2, "Midpoint diagram must show both supplied midpoint relations");
    assertPhase2(question.diagramModel?.parallelMarks.length === 0, "Midpoint stem diagram leaked the theorem-derived DE ∥ BC relation");
  }
  assertPhase2DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase2("cp006-centres-bisectors-midpoints-wave1");
