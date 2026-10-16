import { GEO_CP_010_PHASE4_PROTOTYPES } from "../GEO-002/GEO-CP-010/prototypes";
import { assertPhase4, assertPhase4DeterministicAndShuffled, assertPhase4DiscoveryQuestion, passPhase4 } from "./phase4-test-helpers";

assertPhase4(GEO_CP_010_PHASE4_PROTOTYPES.length === 2, "CP-010 Circle Wave 1 count mismatch");
for (const prototype of GEO_CP_010_PHASE4_PROTOTYPES) {
  const question = prototype.generate(`phase4-cp010:${prototype.temporaryPrototypeId}`);
  assertPhase4DiscoveryQuestion(question);
  assertPhase4(question.cpId === "GEO-CP-010", `${prototype.temporaryPrototypeId}: wrong CP ownership`);
  assertPhase4(question.independentVerifierResult.oracle === "COORDINATE_ORACLE", `${prototype.temporaryPrototypeId}: CP-010 lacks coordinate oracle`);
  if (prototype.temporaryPrototypeId.includes("CENTRE-PERP")) {
    const chordMatch = question.stem.match(/If AB = (\d+) cm, find AM\./);
    assertPhase4(Boolean(chordMatch), "Centre-perpendicular stem must specify a chord length");
    const chordLength = Number(chordMatch![1]);
    assertPhase4(question.answer === `${chordLength / 2} cm`, "Centre-perpendicular half-chord must equal half the stated chord");
    // Different generated scales must preserve the coordinate oracle, not
    // compare a scaled endpoint against an unscaled radius (GEO-QL-049).
    const scaledAnswers = new Set<string>();
    for (let sample = 0; sample < 40; sample++) {
      const scaled = prototype.generate(`geo-cp010-oracle-scaled:${sample}`);
      assertPhase4DiscoveryQuestion(scaled);
      assertPhase4(scaled.independentVerifierResult.passed, `Scaled oracle failed at sample ${sample}`);
      scaledAnswers.add(scaled.answer);
    }
    assertPhase4(scaledAnswers.size >= 3, "CP010 scale coverage must exercise multiple distinct chord lengths");
    assertPhase4(question.diagramModel!.rightAngleMarks.length === 1, "Supplied centre-perpendicular relation is not marked");
    assertPhase4(question.diagramModel!.equalLengthMarks.length === 0, "Stem diagram leaked derived chord bisection equality");
  } else {
    const equalChordMatch = question.stem.match(/If AB = (\d+) cm, find CD\./);
    assertPhase4(Boolean(equalChordMatch), "Equal-centre-distance stem must specify the known chord");
    assertPhase4(question.answer === `${Number(equalChordMatch![1])} cm`, "Equal-distance chords must retain the known length");
    assertPhase4(question.diagramModel!.rightAngleMarks.length === 2, "Equal centre distances are not shown as perpendicular distances");
    assertPhase4(question.diagramModel!.equalLengthMarks.length === 1, "Equal centre distances are not explicitly marked equal");
    assertPhase4(!question.diagramModel!.equalLengthMarks.some((mark) => mark.segmentIds.includes("AB") || mark.segmentIds.includes("CD")), "Stem leaked derived equal-chord conclusion");
  }
  assertPhase4DeterministicAndShuffled(prototype.generate, prototype.temporaryPrototypeId);
}
passPhase4("cp010-chord-centre-wave1");
