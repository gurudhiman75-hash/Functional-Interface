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
    const similarSides=question.stem.match(/If AB = (\d+) cm, PQ = (\d+) cm and AC = (\d+) cm, find PR/);
    assertPhase2(Boolean(similarSides), "Similarity stem must show its three given side lengths");
    const [,ab,pq,ac]=similarSides!.map(Number);
    assertPhase2(question.answer === `${ac*pq/ab} cm`, "Similarity answer must match the generated scale ratio");
    assertPhase2(question.theoremTrace.includes("AA_SIMILARITY"), "Missing-side prototype lacks AA theorem trace");
  }
  if (prototype.temporaryPrototypeId.includes("BPT")) {
    const bptSides=question.stem.match(/If AD = (\d+) cm, DB = (\d+) cm and AE = (\d+) cm, find EC/);
    assertPhase2(Boolean(bptSides), "BPT stem must show the relevant side segments");
    const [,ad,db,ae]=bptSides!.map(Number);
    assertPhase2(question.answer === `${db*ae/ad} cm`, "BPT answer must match the generated proportional side lengths");
    assertPhase2(question.diagramModel?.parallelMarks.length === 1, "BPT stem diagram must visibly show the explicitly stated parallel relation");
    assertPhase2(question.stemSvg?.includes('data-geo-kind="parallel-mark"'), "BPT parallel mark was not visibly rendered");
  }
  assertPhase2DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase2("cp005-similarity-wave1");
