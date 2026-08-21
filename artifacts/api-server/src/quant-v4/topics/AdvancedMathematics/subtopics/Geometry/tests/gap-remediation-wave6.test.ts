import assert from "node:assert/strict";
import {
  GEOMETRY_THEOREM_IDS,
  getTheoremDefinition,
  medianLengthFromCentroidSegment,
  midpointConverseHalfLength,
  perpendicularBisectorConverseConclusion,
  perpendicularBisectorDirectConclusion,
  rational,
  toNumber,
} from "../../../../../shared/geometry";
import { GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES } from "../source-remediation/wave6-prototypes";
import { GEO_GAP_REMEDIATION_WAVE6_SOURCE_EVIDENCE } from "../source-remediation/wave6-source-evidence";
import { extractSvgLabelCollisionScores } from "../source-remediation/wave6-utils";

const seeds = ["wave6-a", "wave6-b", "wave6-c"] as const;

assert.equal(toNumber(medianLengthFromCentroidSegment(rational(27), "VERTEX_TO_CENTROID")), 40.5);
assert.equal(toNumber(medianLengthFromCentroidSegment(rational(10), "CENTROID_TO_MIDPOINT")), 30);
assert.equal(toNumber(midpointConverseHalfLength(rational(48))), 24);
assert.equal(perpendicularBisectorDirectConclusion(), "EQUIDISTANT_FROM_ENDPOINTS");
assert.equal(perpendicularBisectorConverseConclusion(), "LIES_ON_PERPENDICULAR_BISECTOR");
assert.equal(getTheoremDefinition("PERPENDICULAR_BISECTOR_EQUIDISTANT").family, "TRIANGLE_CENTRES");
assert.equal(getTheoremDefinition("PERPENDICULAR_BISECTOR_CONVERSE").family, "TRIANGLE_CENTRES");
assert.equal(GEO_GAP_REMEDIATION_WAVE6_SOURCE_EVIDENCE.length, 5);
assert.equal(GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES.length, 4);
assert.equal(new Set(GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES.map((prototype) => prototype.temporaryPrototypeId)).size, 4);

for (const prototype of GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const fingerprints = new Set<string>();
  for (const seed of seeds) {
    const question = prototype.generate(seed);
    stems.add(question.stem); answers.add(question.answer); fingerprints.add(question.canonicalGeometryFingerprint);
    assert.equal(question.validation.ok, true, `${prototype.temporaryPrototypeId}: ${question.validation.errors.join(", ")}`);
    assert.equal(question.packageId, "GEO-001"); assert.equal(question.cpId, "GEO-CP-006"); assert.equal(question.permanentQlId, null);
    assert.equal(question.sourceStatus, "EXTERNAL_SOURCE_AUDIT_WAVE6__GAP_REMEDIATION");
    assert.equal(question.diagramDisposition, prototype.diagramDisposition);
    assert.equal(question.solutionDiagramModel.disclosure, "SOLUTION");
    assert.ok(question.solutionSvg.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2"'));
    assert.ok(extractSvgLabelCollisionScores(question.solutionSvg).every((score) => score === 0));
    if (question.diagramDisposition === "REQUIRED_BOTH") {
      assert.ok(question.diagramModel); assert.ok(question.stemSvg); assert.equal(question.diagramModel?.disclosure, "STEM");
      assert.ok(question.stemSvg?.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2"'));
      assert.ok(extractSvgLabelCollisionScores(question.stemSvg ?? "").every((score) => score === 0));
      assert.notEqual(question.diagramFingerprint, question.solutionDiagramFingerprint);
    } else {
      assert.equal(question.diagramModel, undefined); assert.equal(question.stemSvg, undefined); assert.equal(question.diagramFingerprint, null);
    }
    assert.equal(question.options.length, 4); assert.equal(new Set(question.options).size, 4); assert.equal(question.answer, question.options[question.correctIndex]);
    assert.equal(question.optionAnalysis.filter((option) => option.correct).length, 1);
    assert.equal(question.minimalityProof.passed, true); assert.equal(question.independentVerifierResult.passed, true);
    assert.ok(question.sourceEvidenceIds.length > 0);
    for (const sourceId of question.sourceEvidenceIds) assert.ok(GEO_GAP_REMEDIATION_WAVE6_SOURCE_EVIDENCE.some((source) => source.id === sourceId));
    const learnerText = [...question.explanation.lines, ...question.explanation.theoremNames].join(" ");
    for (const theoremId of GEOMETRY_THEOREM_IDS) assert.equal(learnerText.includes(theoremId), false, `${prototype.temporaryPrototypeId} leaked theorem ID ${theoremId}`);
    assert.equal(question.lifecycle.stage, "DISCOVERY"); assert.equal(question.lifecycle.permanentQlAllocated, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false); assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false); assert.equal(question.lifecycle.publiclyPublishable, false);
  }
  assert.equal(stems.size, 3, `${prototype.temporaryPrototypeId} must expose three varied review stems`);
  assert.equal(answers.size, 3, `${prototype.temporaryPrototypeId} must expose three varied answers`);
  assert.equal(fingerprints.size, 3, `${prototype.temporaryPrototypeId} fingerprints must vary by seed`);
}

const direct = GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES[0].generate("wave6-a");
assert.equal(direct.answer, "40°");
assert.deepEqual(direct.theoremTrace, ["PERPENDICULAR_BISECTOR_EQUIDISTANT", "ISOSCELES_BASE_ANGLES", "TRIANGLE_ANGLE_SUM"]);
assert.deepEqual(direct.diagramModel?.equalLengthMarks.map((mark) => [...mark.segmentIds]), [["PS", "SQ"]]);
assert.equal(direct.stemSvg?.includes("TP = TQ"), false, "derived equal distances must not leak into the stem");
assert.ok(direct.solutionSvg.includes("TP = TQ")); assert.ok(direct.solutionSvg.includes("∠PQR = 40°"));

const converse = GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES[1].generate("wave6-a");
assert.equal(converse.answer, "12 cm"); assert.equal(converse.diagramDisposition, "REQUIRED_SOLUTION_DIAGRAM");
assert.equal(converse.stemSvg, undefined, "converse stem diagram is intentionally omitted to avoid revealing O on SQ");
assert.deepEqual(converse.theoremTrace, ["RHOMBUS_DIAGONALS_PERPENDICULAR", "PERPENDICULAR_BISECTOR_CONVERSE"]);
assert.ok(converse.solutionSvg.includes("S, O, Q are collinear")); assert.ok(converse.solutionSvg.includes("SO = 5 cm"));
assert.ok(converse.solutionSvg.includes("OQ = 7 cm")); assert.ok(converse.solutionSvg.includes("SQ = 12 cm"));

const centroidA = GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES[2].generate("wave6-a");
assert.equal(centroidA.answer, "27 cm"); assert.deepEqual(centroidA.theoremTrace, ["CENTROID_DIVIDES_MEDIAN_2_TO_1"]);
assert.ok(centroidA.stemSvg?.includes("AG = 18 cm")); assert.equal(centroidA.stemSvg?.includes("AD = 27 cm"), false);
assert.ok(centroidA.solutionSvg.includes("AG : GD = 2 : 1")); assert.ok(centroidA.solutionSvg.includes("AD = 27 cm"));
const centroidB = GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES[2].generate("wave6-b");
assert.equal(centroidB.answer, "30 cm"); assert.ok(centroidB.stemSvg?.includes("GD = 10 cm"));
assert.ok(centroidB.solutionSvg.includes("AG = 20 cm")); assert.ok(centroidB.solutionSvg.includes("AD = 30 cm"));

const midpoint = GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES[3].generate("wave6-a");
assert.equal(midpoint.answer, "12 cm"); assert.deepEqual(midpoint.theoremTrace, ["MIDPOINT_CONVERSE"]);
assert.deepEqual(midpoint.diagramModel?.equalLengthMarks.map((mark) => [...mark.segmentIds]), [["AD", "DB"]]);
assert.deepEqual(midpoint.diagramModel?.parallelMarks.map((mark) => [...mark.segmentIds]), [["DE", "BC"]]);
assert.equal(midpoint.stemSvg?.includes("AE = EC"), false); assert.ok(midpoint.solutionSvg.includes("AE = EC")); assert.ok(midpoint.solutionSvg.includes("EC = 12 cm"));

console.log("Geometry gap remediation Wave 6 PASS: 4 CP006 prototypes × 3 seeds with direct/converse perpendicular-bisector reasoning, centroid inverse, midpoint converse, selective stem disclosure, dimension-rich solution diagrams, zero label collisions, clue minimality, independent verification and lifecycle locks.");
