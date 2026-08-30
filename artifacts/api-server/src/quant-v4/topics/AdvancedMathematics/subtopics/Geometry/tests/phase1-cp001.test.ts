import { GEO_CP_001_PHASE1_PROTOTYPES } from "../GEO-001/GEO-CP-001/prototypes";
import { assertDeterministicAndShuffled, assertDiscoveryQuestion, assertPhase1, passPhase1 } from "./phase1-test-helpers";

assertPhase1(GEO_CP_001_PHASE1_PROTOTYPES.length === 2, "GEO-CP-001 must start with exactly two recommended temporary prototypes");
for (const prototype of GEO_CP_001_PHASE1_PROTOTYPES) {
  const question = prototype.generate(`phase1-cp001:${prototype.temporaryPrototypeId}`);
  assertDiscoveryQuestion(question);
  assertPhase1(question.cpId === "GEO-CP-001", `${prototype.temporaryPrototypeId}: wrong CP ownership`);
  assertPhase1(question.diagramModel !== undefined && question.stemSvg !== undefined, `${prototype.temporaryPrototypeId}: CP-001 prototype lacks semantic diagram`);
  assertPhase1(question.independentVerifierResult.oracle === "COORDINATE_ORACLE", `${prototype.temporaryPrototypeId}: CP-001 structural oracle is not coordinate-based`);
  assertPhase1((question.stemSvg?.match(/data-geo-kind="angle-mark"/g) ?? []).length >= 2, `${prototype.temporaryPrototypeId}: given/target angle marks missing`);
  assertDeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase1("cp001-temporary-prototypes");
