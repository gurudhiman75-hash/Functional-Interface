import { GEO_CP_010_PHASE4_PROTOTYPES } from "../GEO-002/GEO-CP-010/prototypes";
import { assertPhase4, assertPhase4DeterministicAndShuffled, assertPhase4DiscoveryQuestion, passPhase4 } from "./phase4-test-helpers";

assertPhase4(GEO_CP_010_PHASE4_PROTOTYPES.length === 2, "CP-010 Circle Wave 1 count mismatch");
for (const prototype of GEO_CP_010_PHASE4_PROTOTYPES) {
  const question = prototype.generate(`phase4-cp010:${prototype.temporaryPrototypeId}`);
  assertPhase4DiscoveryQuestion(question);
  assertPhase4(question.cpId === "GEO-CP-010", `${prototype.temporaryPrototypeId}: wrong CP ownership`);
  assertPhase4(question.independentVerifierResult.oracle === "COORDINATE_ORACLE", `${prototype.temporaryPrototypeId}: CP-010 lacks coordinate oracle`);
  if (prototype.temporaryPrototypeId.includes("CENTRE-PERP")) {
    assertPhase4(question.answer === "6 cm", "Centre-perpendicular chord answer changed");
    assertPhase4(question.diagramModel!.rightAngleMarks.length === 1, "Supplied centre-perpendicular relation is not marked");
    assertPhase4(question.diagramModel!.equalLengthMarks.length === 0, "Stem diagram leaked derived chord bisection equality");
  } else {
    assertPhase4(question.answer === "8 cm", "Equal-centre-distance chord answer changed");
    assertPhase4(question.diagramModel!.rightAngleMarks.length === 2, "Equal centre distances are not shown as perpendicular distances");
    assertPhase4(question.diagramModel!.equalLengthMarks.length === 1, "Equal centre distances are not explicitly marked equal");
    assertPhase4(!question.diagramModel!.equalLengthMarks.some((mark) => mark.segmentIds.includes("AB") || mark.segmentIds.includes("CD")), "Stem leaked derived equal-chord conclusion");
  }
  assertPhase4DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase4("cp010-chord-centre-wave1");
