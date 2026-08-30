import { GEO_CP_005_PHASE2_PROTOTYPES } from "../GEO-001/GEO-CP-005/prototypes";
import { assertPhase2, assertPhase2DeterministicAndShuffled, assertPhase2DiscoveryQuestion, passPhase2 } from "./phase2-test-helpers";

assertPhase2(GEO_CP_005_PHASE2_PROTOTYPES.length === 3, "GEO-CP-005 Phase-2 Wave 1 must contain three temporary prototypes");
for (const prototype of GEO_CP_005_PHASE2_PROTOTYPES) {
  const question = prototype.generate(`phase2-cp005:${prototype.temporaryPrototypeId}`);
  assertPhase2DiscoveryQuestion(question);
  assertPhase2(question.cpId === "GEO-CP-005", `${prototype.temporaryPrototypeId}: wrong CP ownership`);
  assertPhase2(question.diagramModel !== undefined && question.stemSvg !== undefined, `${prototype.temporaryPrototypeId}: similarity/BPT prototype lacks semantic diagram`);
  if (prototype.temporaryPrototypeId.includes("AA-CORRESPONDENCE")) {
    assertPhase2(question.answer === "R", "AA correspondence answer changed");
    assertPhase2(question.proofEvents.some((event) => event.kind === "SIMILARITY"), "AA prototype lacks similarity proof event");
  }
  if (prototype.temporaryPrototypeId.includes("MISSING-SIDE")) {
    assertPhase2(question.answer === "12 cm", "Similarity missing-side answer changed");
    assertPhase2(question.theoremTrace.includes("AA_SIMILARITY"), "Missing-side prototype lacks AA theorem trace");
  }
  if (prototype.temporaryPrototypeId.includes("BPT")) {
    assertPhase2(question.answer === "6 cm", "BPT direct answer changed");
    assertPhase2(question.diagramModel?.parallelMarks.length === 1, "BPT stem diagram must visibly show the explicitly stated parallel relation");
    assertPhase2(question.stemSvg?.includes('data-geo-kind="parallel-mark"'), "BPT parallel mark was not visibly rendered");
  }
  assertPhase2DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase2("cp005-similarity-wave1");
