import assert from "node:assert/strict";
import {
  GEOMETRY_THEOREM_IDS,
  angle,
  angleBetweenTangentsFromCentral,
  angleInSemicircle,
  getTheoremDefinition,
  identifyTriangleCentreFromConcurrency,
  tangentChordAngleFromAlternateSegment,
} from "../../../../../shared/geometry";
import { GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES } from "../source-remediation/wave1-prototypes";
import { numericAngleDegrees } from "../source-remediation/wave1-utils";

const seeds = ["gap-wave1-a", "gap-wave1-b", "gap-wave1-c"] as const;

assert.equal(identifyTriangleCentreFromConcurrency("MEDIANS"), "Centroid");
assert.equal(identifyTriangleCentreFromConcurrency("ANGLE_BISECTORS"), "Incentre");
assert.equal(identifyTriangleCentreFromConcurrency("PERPENDICULAR_BISECTORS"), "Circumcentre");
assert.equal(identifyTriangleCentreFromConcurrency("ALTITUDES"), "Orthocentre");
assert.equal(angleInSemicircle().numerator, 90n);
assert.equal(angleBetweenTangentsFromCentral(angle(124)).numerator, 56n);
assert.equal(tangentChordAngleFromAlternateSegment(angle(38)).numerator, 38n);
assert.equal(
  getTheoremDefinition("TRIANGLE_CENTRE_PERP_BISECTORS_CIRCUMCENTRE").family,
  "TRIANGLE_CENTRES",
);

assert.equal(GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES.length, 4);
assert.equal(new Set(GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES.map((p) => p.temporaryPrototypeId)).size, 4);

for (const prototype of GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES) {
  for (const seed of seeds) {
    const question = prototype.generate(seed);
    assert.equal(question.validation.ok, true, `${prototype.temporaryPrototypeId} validation failed: ${question.validation.errors.join(", ")}`);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.sourceStatus, "EXTERNAL_SOURCE_AUDIT_WAVE1__GAP_REMEDIATION");
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.equal(question.optionAnalysis.filter((option) => option.correct).length, 1);
    assert.equal(question.minimalityProof.passed, true);
    assert.equal(question.independentVerifierResult.passed, true);
    assert.ok(question.sourceEvidenceIds.length > 0);
    assert.equal(question.diagramDisposition, "REQUIRED_STEM_DIAGRAM");
    assert.ok(question.diagramModel, `${prototype.temporaryPrototypeId} must have a stem diagram`);
    assert.equal(question.diagramModel?.disclosure, "STEM");
    assert.equal(question.diagramModel?.notToScale, true);
    assert.ok(question.stemSvg?.startsWith("<svg"));
    assert.ok(question.diagramFingerprint);
    assert.equal(question.lifecycle.stage, "DISCOVERY");
    assert.equal(question.lifecycle.permanentQlAllocated, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);

    const learnerText = [...question.explanation.lines, ...question.explanation.theoremNames].join(" ");
    for (const theoremId of GEOMETRY_THEOREM_IDS) {
      assert.equal(learnerText.includes(theoremId), false, `${prototype.temporaryPrototypeId} leaked theorem ID ${theoremId}`);
    }
  }
}

const centre = GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES[0].generate("diagram-policy");
assert.equal(centre.diagramModel?.rightAngleMarks.length, 2, "circumcentre diagram must show the two supplied perpendicular-bisector facts");
assert.equal(centre.diagramModel?.equalLengthMarks.length, 2, "circumcentre diagram must show the two supplied midpoint facts");
assert.equal(centre.diagramModel?.circles.length, 0, "circumcentre answer must not be leaked by drawing the circumcircle around O");

const semicircle = GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES[1].generate("diagram-policy");
assert.equal(semicircle.diagramModel?.rightAngleMarks.length, 0, "semicircle answer must not be semantically marked as a right angle in the stem");
assert.equal(semicircle.diagramModel?.angleMarks.some((mark) => mark.label === "90°"), false);
if (!semicircle.diagramModel) throw new Error("Semicircle diagram missing");
const sPoint = (id: string) => {
  const point = semicircle.diagramModel?.points.find((candidate) => candidate.id === id);
  if (!point) throw new Error(`Missing semicircle point ${id}`);
  return point;
};
const semicircleVisual = numericAngleDegrees(sPoint("A"), sPoint("P"), sPoint("B"));
assert.ok(Math.abs(semicircleVisual - 90) > 1, `semicircle visual layout leaked an exact right angle: ${semicircleVisual}`);

const twoTangents = GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES[2].generate("diagram-policy");
assert.equal(twoTangents.diagramModel?.rightAngleMarks.length, 0, "derived radius–tangent right angles must not be marked in the stem");
assert.equal(twoTangents.diagramModel?.equalLengthMarks.length, 0, "derived equal-tangent lengths must not be marked in the stem");
if (!twoTangents.diagramModel) throw new Error("Two-tangents diagram missing");
const tPoint = (id: string) => {
  const point = twoTangents.diagramModel?.points.find((candidate) => candidate.id === id);
  if (!point) throw new Error(`Missing two-tangents point ${id}`);
  return point;
};
const tangentVisual = numericAngleDegrees(tPoint("A"), tPoint("P"), tPoint("B"));
assert.ok(Math.abs(tangentVisual - 56) > 5, `two-tangents visual layout leaked the answer: ${tangentVisual}`);

const tangentChord = GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES[3].generate("diagram-policy");
assert.equal(tangentChord.diagramModel?.rightAngleMarks.length, 0, "derived tangent-radius perpendicularity must not be marked in tangent-chord stem");
if (!tangentChord.diagramModel) throw new Error("Tangent-chord diagram missing");
const cPoint = (id: string) => {
  const point = tangentChord.diagramModel?.points.find((candidate) => candidate.id === id);
  if (!point) throw new Error(`Missing tangent-chord point ${id}`);
  return point;
};
const tangentChordVisual = numericAngleDegrees(cPoint("P"), cPoint("T"), cPoint("A"));
assert.ok(Math.abs(tangentChordVisual - 38) > 2, `tangent-chord visual layout leaked the answer: ${tangentChordVisual}`);

console.log("Geometry gap remediation Wave 1 PASS: 4 source-observed temporary prototypes × 3 seeds with Rev-3 diagram anti-leak checks.");
