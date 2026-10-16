import { GEO_CP_009_PHASE3_PROTOTYPES } from "../GEO-001/GEO-CP-009/prototypes";
import { assertPhase3, assertPhase3DeterministicAndShuffled, assertPhase3DiscoveryQuestion, passPhase3 } from "./phase3-test-helpers";

assertPhase3(GEO_CP_009_PHASE3_PROTOTYPES.length === 4, "CP-009 Phase-3 Wave 1 count mismatch");
// Verify seeded variants from their actual mathematical givens, not a fixed seed snapshot.
function expectedFromStem(stem: string, id: string): string {
  if (id.includes("EXTERIOR-FROM-N")) {
    const n = stem.match(/regular (\d+)-sided polygon/);
    assertPhase3(Boolean(n), "Polygon exterior-angle stem must state side count");
    return `${360 / Number(n![1])}°`;
  }
  if (id.includes("N-FROM-EXTERIOR")) {
    const angle = stem.match(/exterior angle of a regular polygon is (\d+)°/);
    assertPhase3(Boolean(angle), "Polygon exterior-side count stem must state angle");
    return String(360 / Number(angle![1]));
  }
  if (id.includes("N-FROM-INTERIOR")) {
    const angle = stem.match(/interior angle of a regular polygon is (\d+)°/);
    assertPhase3(Boolean(angle), "Polygon interior-side count stem must state angle");
    return String(360 / (180 - Number(angle![1])));
  }
  const n = stem.match(/(\d+)-sided polygon/);
  assertPhase3(Boolean(n), "Polygon diagonal-count stem must state side count");
  const count = Number(n![1]);
  return String(count * (count - 3) / 2);
}
for (const prototype of GEO_CP_009_PHASE3_PROTOTYPES) {
  const question = prototype.generate(`phase3-cp009:${prototype.temporaryPrototypeId}`);
  assertPhase3DiscoveryQuestion(question);
  assertPhase3(question.cpId === "GEO-CP-009", `${prototype.temporaryPrototypeId}: wrong ownership`);
  assertPhase3(question.answer === expectedFromStem(question.stem, prototype.temporaryPrototypeId), `${prototype.temporaryPrototypeId}: answer does not match the polygon formula`);
  assertPhase3(question.diagramModel === undefined, `${prototype.temporaryPrototypeId}: polygon counting/angle prototype added a decorative diagram`);
  assertPhase3(question.independentVerifierResult.oracle !== "COORDINATE_ORACLE", `${prototype.temporaryPrototypeId}: polygon arithmetic should not pretend to need a coordinate oracle`);
  assertPhase3DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase3("cp009-polygon-wave1");
