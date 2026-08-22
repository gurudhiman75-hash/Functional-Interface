import assert from "node:assert/strict";
import {
  GEOMETRY_THEOREM_IDS,
  angle,
  centreLineThroughChordMidpointAngle,
  equalCentralAngleFromEqualChord,
  equalCentreDistanceFromEqualChord,
  getTheoremDefinition,
  inscribedAngleFromCentral,
  rational,
  sameSegmentAngleFromSameChord,
  toNumber,
} from "../../../../../shared/geometry";
import { GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES } from "../source-remediation/wave7-prototypes";
import { GEO_GAP_REMEDIATION_WAVE7_SOURCE_EVIDENCE } from "../source-remediation/wave7-source-evidence";
import { extractSvgLabelCollisionScores } from "../source-remediation/wave7-utils";

const seeds = ["wave7-a", "wave7-b", "wave7-c"] as const;

assert.equal(toNumber(equalCentralAngleFromEqualChord(angle(70))), 70);
assert.equal(toNumber(equalCentreDistanceFromEqualChord(rational(8))), 8);
assert.equal(toNumber(centreLineThroughChordMidpointAngle()), 90);
assert.equal(toNumber(sameSegmentAngleFromSameChord(angle(48))), 48);
assert.equal(toNumber(inscribedAngleFromCentral(angle(134))), 67);
assert.equal(getTheoremDefinition("EQUAL_CHORD_EQUAL_CENTRAL_ANGLE").family, "CIRCLES");
assert.equal(getTheoremDefinition("PERPENDICULAR_FROM_CENTRE_BISECTS_CHORD_CONVERSE").family, "CIRCLES");
assert.equal(GEO_GAP_REMEDIATION_WAVE7_SOURCE_EVIDENCE.length, 6);
assert.equal(GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES.length, 6);
assert.equal(new Set(GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES.map((p) => p.temporaryPrototypeId)).size, 6);
assert.equal(GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES.filter((p) => p.cpId === "GEO-CP-010").length, 3);
assert.equal(GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES.filter((p) => p.cpId === "GEO-CP-011").length, 3);

for (const prototype of GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES) {
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  for (const seed of seeds) {
    const question = prototype.generate(seed);
    stems.add(question.stem);
    fingerprints.add(question.canonicalGeometryFingerprint);
    assert.equal(question.validation.ok, true, `${prototype.temporaryPrototypeId}: ${question.validation.errors.join(", ")}`);
    assert.equal(question.packageId, "GEO-002");
    assert.ok(question.cpId === "GEO-CP-010" || question.cpId === "GEO-CP-011");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.sourceStatus, "EXTERNAL_SOURCE_AUDIT_WAVE7__GAP_REMEDIATION");
    assert.equal(question.diagramDisposition, "REQUIRED_BOTH");
    assert.equal(question.diagramModel.disclosure, "STEM");
    assert.equal(question.solutionDiagramModel.disclosure, "SOLUTION");
    assert.ok(question.stemSvg.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2"'));
    assert.ok(question.solutionSvg.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2"'));
    assert.ok(extractSvgLabelCollisionScores(question.stemSvg).every((score) => score === 0));
    assert.ok(extractSvgLabelCollisionScores(question.solutionSvg).every((score) => score === 0));
    assert.notEqual(question.diagramFingerprint, question.solutionDiagramFingerprint);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.equal(question.optionAnalysis.filter((o) => o.correct).length, 1);
    assert.equal(question.minimalityProof.passed, true);
    assert.equal(question.independentVerifierResult.passed, true);
    assert.ok(question.sourceEvidenceIds.length > 0);
    for (const sourceId of question.sourceEvidenceIds) {
      assert.ok(GEO_GAP_REMEDIATION_WAVE7_SOURCE_EVIDENCE.some((source) => source.id === sourceId));
    }
    const learnerText = [...question.explanation.lines, ...question.explanation.theoremNames].join(" ");
    for (const theoremId of GEOMETRY_THEOREM_IDS) {
      assert.equal(learnerText.includes(theoremId), false, `${prototype.temporaryPrototypeId} leaked theorem ID ${theoremId}`);
    }
    assert.equal(question.lifecycle.stage, "DISCOVERY");
    assert.equal(question.lifecycle.permanentQlAllocated, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
  }
  assert.equal(stems.size, 3, `${prototype.temporaryPrototypeId} must expose three varied review stems`);
  assert.equal(fingerprints.size, 3, `${prototype.temporaryPrototypeId} fingerprints must vary by seed`);
}

const equalCentral = GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES[0].generate("wave7-b");
assert.equal(equalCentral.answer, "70°");
assert.deepEqual(equalCentral.theoremTrace, ["EQUAL_CHORD_EQUAL_CENTRAL_ANGLE"]);
assert.equal(equalCentral.stemSvg.includes("∠COD = 70°"), false);
assert.ok(equalCentral.solutionSvg.includes("70°"));
assert.deepEqual(equalCentral.diagramModel.equalLengthMarks.map((m) => [...m.segmentIds]), [["AB", "CD"]]);

const equalDistance = GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES[1].generate("wave7-c");
assert.equal(equalDistance.answer, "8 cm");
assert.ok(equalDistance.stemSvg.includes("OM = 8 cm"));
assert.equal(equalDistance.stemSvg.includes("ON = 8 cm"), false);
assert.ok(equalDistance.solutionSvg.includes("ON = 8 cm"));
assert.equal(equalDistance.diagramModel.equalLengthMarks.length, 0, "equal-chord ticks are omitted because they would stack on the perpendicular feet");
assert.equal(equalDistance.solutionDiagramModel.equalLengthMarks.length, 0, "solution keeps the equal-chord fact in governed prose rather than overlapping semantic marks");
assert.ok(equalDistance.stem.includes("AB = CD"), "the omitted ticks must remain explicit in the question stem");

const midpointInverse = GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES[2].generate("wave7-a");
assert.equal(midpointInverse.answer, "90°");
assert.equal(midpointInverse.diagramModel.rightAngleMarks.length, 0);
assert.equal(midpointInverse.solutionDiagramModel.rightAngleMarks.length, 1);
assert.ok(midpointInverse.solutionSvg.includes("∠ORP = 90°"));

const sameSegment = GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES[3].generate("wave7-c");
assert.equal(sameSegment.answer, "55°");
assert.deepEqual(sameSegment.theoremTrace, ["SAME_SEGMENT_ANGLE"]);
const sameR = sameSegment.diagramModel.points.find((point) => point.id === "R")!;
const sameS = sameSegment.diagramModel.points.find((point) => point.id === "S")!;
const sameO = sameSegment.diagramModel.points.find((point) => point.id === "O")!;
const rsCentreCross = (sameS.x - sameR.x) * (sameO.y - sameR.y) - (sameS.y - sameR.y) * (sameO.x - sameR.x);
assert.ok(Math.abs(rsCentreCross) > 1, "same-segment review topology must not accidentally turn RS into an unstated diameter");

const exterior = GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES[4].generate("wave7-c");
assert.equal(exterior.answer, "67°");
assert.deepEqual(exterior.theoremTrace, ["CENTRAL_ANGLE_DOUBLE_INSCRIBED", "CYCLIC_EXTERIOR_EQUALS_INTERIOR_OPPOSITE"]);
assert.ok(exterior.stemSvg.includes("134°"));
assert.equal(exterior.stemSvg.includes("67°"), false);
assert.ok(exterior.solutionSvg.includes("67°"));

const chain = GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES[5].generate("wave7-a");
assert.equal(chain.answer, "26°");
assert.deepEqual(chain.theoremTrace, ["TRIANGLE_ANGLE_SUM", "LINEAR_PAIR_SUM", "SAME_SEGMENT_ANGLE", "ANGLE_IN_SEMICIRCLE"]);
assert.equal(chain.diagramModel.rightAngleMarks.length, 0);
assert.equal(chain.stemSvg.includes("26°"), false);
assert.equal(chain.solutionDiagramModel.rightAngleMarks.length, 1);
assert.equal(chain.solutionDiagramModel.angleMarks.some((mark) => mark.id === "derived-abd"), false, "the numeric 90° angle arc is removed because the right-angle square already communicates that derived fact");
assert.ok(chain.solutionSvg.includes("∠CBD = 26°"), "final target must be named explicitly near vertex B");
assert.equal(chain.solutionSvg.includes(">90°<"), false, "avoid a detached 90° text label; the right-angle mark is the uncluttered teaching representation");

console.log("Geometry gap remediation Wave 7 PASS: 6 CP010/CP011 prototypes × 3 seeds with exact circle-theorem inference, REQUIRED_BOTH anti-leak stem/solution diagrams, dimension-rich solution disclosure, semantic-mark clarity, zero label collisions, clue minimality, independent verification and lifecycle locks.");
