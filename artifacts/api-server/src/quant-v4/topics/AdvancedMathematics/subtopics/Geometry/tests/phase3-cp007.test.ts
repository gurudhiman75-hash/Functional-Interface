import { GEO_CP_007_PHASE3_PROTOTYPES } from "../GEO-001/GEO-CP-007/prototypes";
import { assertPhase3, assertPhase3DeterministicAndShuffled, assertPhase3DiscoveryQuestion, passPhase3 } from "./phase3-test-helpers";

assertPhase3(GEO_CP_007_PHASE3_PROTOTYPES.length === 2, "CP-007 Phase-3 Wave 1 count mismatch");
for (const prototype of GEO_CP_007_PHASE3_PROTOTYPES) {
  const question = prototype.generate(`phase3-cp007:${prototype.temporaryPrototypeId}`);
  assertPhase3DiscoveryQuestion(question);
  assertPhase3(question.cpId === "GEO-CP-007", `${prototype.temporaryPrototypeId}: wrong ownership`);
  assertPhase3(question.independentVerifierResult.oracle === "COORDINATE_ORACLE", `${prototype.temporaryPrototypeId}: right-triangle theorem lacks coordinate oracle`);
  assertPhase3(question.diagramModel !== undefined && question.stemSvg !== undefined, `${prototype.temporaryPrototypeId}: right-triangle prototype lacks diagram`);
  if (prototype.temporaryPrototypeId.includes("PYTHAGOREAN")) {
    assertPhase3(question.answer === "Right-angled at A", "Pythagorean-converse answer changed");
    assertPhase3(question.diagramModel?.rightAngleMarks.length === 0, "Converse-classification diagram leaked the right-angle conclusion");
    assertPhase3(!question.stemSvg?.includes('data-geo-kind="right-angle-mark"'), "Converse-classification SVG leaked the answer");
  } else {
    assertPhase3(question.answer === "7 cm", "Hypotenuse-median answer changed");
    assertPhase3(question.diagramModel?.rightAngleMarks.length === 1, "Hypotenuse-median diagram lacks the supplied right angle");
    assertPhase3(question.diagramModel?.equalLengthMarks.length === 1, "Hypotenuse-median diagram lacks the supplied midpoint relation");
  }
  assertPhase3DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase3("cp007-right-triangle-wave1");
