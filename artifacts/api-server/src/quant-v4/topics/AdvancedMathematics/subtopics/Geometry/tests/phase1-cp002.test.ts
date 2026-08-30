import { GEO_CP_002_PHASE1_PROTOTYPES } from "../GEO-001/GEO-CP-002/prototypes";
import { assertDeterministicAndShuffled, assertDiscoveryQuestion, assertPhase1, passPhase1 } from "./phase1-test-helpers";

assertPhase1(GEO_CP_002_PHASE1_PROTOTYPES.length === 2, "GEO-CP-002 must start with exactly two recommended temporary prototypes");
for (const prototype of GEO_CP_002_PHASE1_PROTOTYPES) {
  const question = prototype.generate(`phase1-cp002:${prototype.temporaryPrototypeId}`);
  assertDiscoveryQuestion(question);
  assertPhase1(question.cpId === "GEO-CP-002", `${prototype.temporaryPrototypeId}: wrong CP ownership`);
  assertPhase1(question.diagramModel?.parallelMarks.length === 1, `${prototype.temporaryPrototypeId}: explicit parallel relation mark missing`);
  assertPhase1(question.stem.includes("∥"), `${prototype.temporaryPrototypeId}: stem does not explicitly state parallelism`);
  assertPhase1(question.stemSvg?.includes('data-geo-kind="parallel-mark"'), `${prototype.temporaryPrototypeId}: rendered parallel mark missing`);
  assertPhase1(question.independentVerifierResult.oracle === "COORDINATE_ORACLE", `${prototype.temporaryPrototypeId}: CP-002 structural oracle is not coordinate-based`);
  assertPhase1(question.displayedClueIds.includes("AB_PARALLEL_CD"), `${prototype.temporaryPrototypeId}: parallelism absent from clue-minimality proof`);
  assertDeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase1("cp002-temporary-prototypes");
