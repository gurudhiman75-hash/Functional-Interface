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
const EPS = 1e-6;

function point(
  question: ReturnType<(typeof GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES)[number]["generate"]>,
  id: string,
) {
  const found = question.diagramModel?.points.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Missing point ${id} in ${question.temporaryPrototypeId}`);
  return found;
}

function segment(
  question: ReturnType<(typeof GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES)[number]["generate"]>,
  id: string,
) {
  const found = question.diagramModel?.segments.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Missing segment ${id} in ${question.temporaryPrototypeId}`);
  return found;
}

function distance(a: Readonly<{ x: number; y: number }>, b: Readonly<{ x: number; y: number }>): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function dotAt(
  vertex: Readonly<{ x: number; y: number }>,
  first: Readonly<{ x: number; y: number }>,
  second: Readonly<{ x: number; y: number }>,
): number {
  return (first.x - vertex.x) * (second.x - vertex.x)
    + (first.y - vertex.y) * (second.y - vertex.y);
}

function visualPointOnCircle(
  question: ReturnType<(typeof GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES)[number]["generate"]>,
  pointId: string,
  circleId: string,
): void {
  const circle = question.diagramModel?.circles.find((candidate) => candidate.id === circleId);
  if (!circle) throw new Error(`Missing circle ${circleId}`);
  const center = point(question, circle.centerPointId);
  const p = point(question, pointId);
  assert.ok(
    Math.abs(distance(center, p) - circle.radius) <= EPS,
    `${question.temporaryPrototypeId}: ${pointId} is not visually on ${circleId}`,
  );
}

interface SvgLabelBox {
  readonly id: string;
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly collisionScore: number;
}

function svgLabelBoxes(svg: string): readonly SvgLabelBox[] {
  const labels: SvgLabelBox[] = [];
  const regex = /<text[^>]*data-geo-id="([^"]+)"[^>]*data-label-box="([^"]+)"[^>]*data-label-collision-score="([^"]+)"/g;
  for (const match of svg.matchAll(regex)) {
    const [left, top, width, height] = match[2].split(",").map(Number);
    labels.push({ id: match[1], left, top, width, height, collisionScore: Number(match[3]) });
  }
  return labels;
}

function boxesOverlap(a: SvgLabelBox, b: SvgLabelBox): boolean {
  const padding = 0.75;
  return !(
    a.left + a.width + padding <= b.left
    || b.left + b.width + padding <= a.left
    || a.top + a.height + padding <= b.top
    || b.top + b.height + padding <= a.top
  );
}

function assertCleanLabelLayout(svg: string, owner: string): void {
  const labels = svgLabelBoxes(svg);
  assert.ok(labels.length > 0, `${owner}: no instrumented SVG labels found`);
  for (const label of labels) {
    assert.equal(label.collisionScore, 0, `${owner}: label ${label.id} overlaps geometry or another label`);
  }
  for (let i = 0; i < labels.length; i += 1) {
    for (let j = i + 1; j < labels.length; j += 1) {
      assert.equal(boxesOverlap(labels[i], labels[j]), false, `${owner}: labels ${labels[i].id} and ${labels[j].id} overlap`);
    }
  }
}

function assertAngleSign(svg: string, angleId: string, label: string): void {
  assert.ok(
    svg.includes(`data-geo-kind="angle-mark" data-angle-sign="true" data-geo-id="${angleId}"`),
    `Missing visible angle sign for ${angleId}`,
  );
  assert.ok(svg.includes(`data-label="${label}"`), `Missing angle label ${label} for ${angleId}`);
}

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
    assert.ok(question.stemSvg?.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2"'));
    assert.ok(question.diagramFingerprint);
    assert.equal(question.lifecycle.stage, "DISCOVERY");
    assert.equal(question.lifecycle.permanentQlAllocated, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assertCleanLabelLayout(question.stemSvg ?? "", prototype.temporaryPrototypeId);

    const learnerText = [...question.explanation.lines, ...question.explanation.theoremNames].join(" ");
    for (const theoremId of GEOMETRY_THEOREM_IDS) {
      assert.equal(learnerText.includes(theoremId), false, `${prototype.temporaryPrototypeId} leaked theorem ID ${theoremId}`);
    }
  }
}

const centre = GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES[0].generate("diagram-policy");
assert.equal(centre.diagramModel?.rightAngleMarks.length, 2, "circumcentre diagram must show both supplied perpendicular facts");
assert.equal(centre.diagramModel?.equalLengthMarks.length, 2, "circumcentre diagram must show both supplied midpoint facts");
assert.equal(centre.diagramModel?.circles.length, 0, "circumcentre answer must not be leaked by drawing a circumcircle around O");
assert.equal(segment(centre, "OM").extent, "RAY", "first perpendicular bisector must visually continue through O");
assert.equal(segment(centre, "ON").extent, "RAY", "second perpendicular bisector must visually continue through O");
assert.equal(segment(centre, "OM").style, "CONSTRUCTION");
assert.equal(segment(centre, "ON").style, "CONSTRUCTION");
assert.ok(Math.abs(dotAt(point(centre, "M"), point(centre, "A"), point(centre, "O"))) <= EPS, "OM must be visually perpendicular to AB at M");
assert.ok(Math.abs(dotAt(point(centre, "N"), point(centre, "A"), point(centre, "O"))) <= EPS, "ON must be visually perpendicular to AC at N");
assert.ok(centre.stemSvg?.includes('data-extent="RAY" data-style="CONSTRUCTION"'));

const semicircle = GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES[1].generate("diagram-policy");
assert.equal(semicircle.diagramModel?.rightAngleMarks.length, 0, "semicircle answer must not be explicitly marked as a right angle in the stem");
assert.equal(semicircle.diagramModel?.angleMarks.some((mark) => mark.label === "90°"), false);
visualPointOnCircle(semicircle, "A", "circle-o");
visualPointOnCircle(semicircle, "B", "circle-o");
visualPointOnCircle(semicircle, "P", "circle-o");
assert.ok(Math.abs(numericAngleDegrees(point(semicircle, "A"), point(semicircle, "P"), point(semicircle, "B")) - 90) <= EPS);
assertAngleSign(semicircle.stemSvg ?? "", "angle-apb", "x");

const twoTangents = GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES[2].generate("diagram-policy");
assert.equal(twoTangents.diagramModel?.rightAngleMarks.length, 0, "derived radius–tangent right angles must not be semantically marked in the stem");
assert.equal(twoTangents.diagramModel?.equalLengthMarks.length, 0, "derived equal-tangent lengths must not be semantically marked in the stem");
visualPointOnCircle(twoTangents, "A", "circle-o");
visualPointOnCircle(twoTangents, "B", "circle-o");
assert.ok(Math.abs(dotAt(point(twoTangents, "A"), point(twoTangents, "O"), point(twoTangents, "P"))) <= 1e-5, "PA must visually touch the circle tangentially at A");
assert.ok(Math.abs(dotAt(point(twoTangents, "B"), point(twoTangents, "O"), point(twoTangents, "P"))) <= 1e-5, "PB must visually touch the circle tangentially at B");
assert.ok(Math.abs(numericAngleDegrees(point(twoTangents, "A"), point(twoTangents, "O"), point(twoTangents, "B")) - 124) <= 1e-5);
assert.ok(Math.abs(numericAngleDegrees(point(twoTangents, "A"), point(twoTangents, "P"), point(twoTangents, "B")) - 56) <= 1e-5);
assertAngleSign(twoTangents.stemSvg ?? "", "central-aob", "124°");
assertAngleSign(twoTangents.stemSvg ?? "", "angle-apb", "x");

const tangentChord = GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES[3].generate("diagram-policy");
assert.equal(tangentChord.diagramModel?.rightAngleMarks.length, 0, "derived tangent-radius perpendicularity must not be semantically marked in tangent-chord stem");
visualPointOnCircle(tangentChord, "T", "circle-o");
visualPointOnCircle(tangentChord, "A", "circle-o");
visualPointOnCircle(tangentChord, "B", "circle-o");
assert.equal(segment(tangentChord, "PT").extent, "RAY", "tangent PT must be drawn as a ray beginning at the contact point T");
assert.equal(segment(tangentChord, "PT").fromPointId, "T");
assert.ok(Math.abs(dotAt(point(tangentChord, "T"), point(tangentChord, "O"), point(tangentChord, "P"))) <= EPS, "PT must visually touch the circle tangentially at T");
assert.ok(Math.abs(numericAngleDegrees(point(tangentChord, "T"), point(tangentChord, "B"), point(tangentChord, "A")) - 38) <= 1e-5);
assert.ok(Math.abs(numericAngleDegrees(point(tangentChord, "P"), point(tangentChord, "T"), point(tangentChord, "A")) - 38) <= 1e-5);
assertAngleSign(tangentChord.stemSvg ?? "", "alternate-angle", "38°");
assertAngleSign(tangentChord.stemSvg ?? "", "tangent-chord-angle", "x");

console.log("Geometry gap remediation Wave 1 PASS: 4 source-observed prototypes × 3 seeds with exact visual incidence, intersection/tangency, angle-sign and label-collision QA.");
