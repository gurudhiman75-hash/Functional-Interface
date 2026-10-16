import { GEO_CP_006_PHASE2_PROTOTYPES } from "../GEO-001/GEO-CP-006/prototypes";
import { assertPhase2, assertPhase2DeterministicAndShuffled, assertPhase2DiscoveryQuestion, passPhase2 } from "./phase2-test-helpers";

assertPhase2(GEO_CP_006_PHASE2_PROTOTYPES.length === 3, "GEO-CP-006 Phase-2 Wave 1 must contain three temporary prototypes");
for (const prototype of GEO_CP_006_PHASE2_PROTOTYPES) {
  const question = prototype.generate(`phase2-cp006:${prototype.temporaryPrototypeId}`);
  assertPhase2DiscoveryQuestion(question);
  assertPhase2(question.cpId === "GEO-CP-006", `${prototype.temporaryPrototypeId}: wrong CP ownership`);
  assertPhase2(question.diagramModel !== undefined && question.stemSvg !== undefined, `${prototype.temporaryPrototypeId}: centre/bisector/midpoint prototype lacks semantic diagram`);
  if (prototype.temporaryPrototypeId.includes("CENTROID")) {
    const median = question.stem.match(/median of length (\d+) cm/);
    assertPhase2(Boolean(median), "Centroid stem must name the median length");
    assertPhase2(question.answer === `${(2 * Number(median![1])) / 3} cm`, "Centroid 2:1 answer must match the generated median");
    assertPhase2(question.theoremTrace.includes("CENTROID_DIVIDES_MEDIAN_2_TO_1"), "Centroid theorem trace missing");
    assertPhase2(question.diagramModel?.equalLengthMarks.length === 1, "Centroid diagram must show that M is the supplied midpoint on the median");
  }
  if (prototype.temporaryPrototypeId.includes("ANGLE-BISECTOR")) {
    const bisector = question.stem.match(/AB = (\d+) cm, AC = (\d+) cm and BD = (\d+) cm/);
    assertPhase2(Boolean(bisector), "Angle-bisector stem must name all three segments");
    const [, ab, ac, bd] = bisector!.map(Number);
    assertPhase2(question.answer === `${bd * ac / ab} cm`, "Angle-bisector theorem answer must match the generated side ratio");
    const alphaMarks = question.diagramModel?.angleMarks.filter((mark) => mark.label === "α") ?? [];
    assertPhase2(alphaMarks.length === 2, "Angle-bisector diagram does not show the supplied equal angle halves");
    assertPhase2(question.diagramModel?.rightAngleMarks.length === 0, "Angle-bisector stem leaked the hidden oracle's right-angle realization");
  }
  if (prototype.temporaryPrototypeId.includes("MIDPOINT")) {
    const side = question.stem.match(/BC = (\d+) cm, find DE/);
    assertPhase2(Boolean(side), "Midpoint stem must name the original side length");
    assertPhase2(question.answer === `${Number(side![1]) / 2} cm`, "Midpoint theorem answer must equal half the generated third side");
    assertPhase2(question.diagramModel?.equalLengthMarks.length === 2, "Midpoint diagram must show both supplied midpoint relations");
    assertPhase2(question.diagramModel?.parallelMarks.length === 0, "Midpoint stem diagram leaked the theorem-derived DE ∥ BC relation");
  }
  assertPhase2DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase2("cp006-centres-bisectors-midpoints-wave1");
