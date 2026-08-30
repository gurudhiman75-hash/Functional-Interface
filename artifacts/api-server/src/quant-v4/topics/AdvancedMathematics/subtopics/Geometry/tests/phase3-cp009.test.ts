import { GEO_CP_009_PHASE3_PROTOTYPES } from "../GEO-001/GEO-CP-009/prototypes";
import { assertPhase3, assertPhase3DeterministicAndShuffled, assertPhase3DiscoveryQuestion, passPhase3 } from "./phase3-test-helpers";

assertPhase3(GEO_CP_009_PHASE3_PROTOTYPES.length === 4, "CP-009 Phase-3 Wave 1 count mismatch");
const expected = new Map([
  ["GEO-TMP-CP009-EXTERIOR-FROM-N-V1", "30°"],
  ["GEO-TMP-CP009-N-FROM-EXTERIOR-V1", "15"],
  ["GEO-TMP-CP009-N-FROM-INTERIOR-V1", "15"],
  ["GEO-TMP-CP009-DIAGONAL-COUNT-V1", "35"],
]);
for (const prototype of GEO_CP_009_PHASE3_PROTOTYPES) {
  const question = prototype.generate(`phase3-cp009:${prototype.temporaryPrototypeId}`);
  assertPhase3DiscoveryQuestion(question);
  assertPhase3(question.cpId === "GEO-CP-009", `${prototype.temporaryPrototypeId}: wrong ownership`);
  assertPhase3(question.answer === expected.get(prototype.temporaryPrototypeId), `${prototype.temporaryPrototypeId}: answer changed`);
  assertPhase3(question.diagramModel === undefined, `${prototype.temporaryPrototypeId}: polygon counting/angle prototype added a decorative diagram`);
  assertPhase3(question.independentVerifierResult.oracle !== "COORDINATE_ORACLE", `${prototype.temporaryPrototypeId}: polygon arithmetic should not pretend to need a coordinate oracle`);
  assertPhase3DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase3("cp009-polygon-wave1");
