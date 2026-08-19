import assert from "node:assert/strict";
import {
  GEOMETRY_THEOREM_IDS,
  angle,
  getTheoremDefinition,
  identifyTriangleCentreFromConcurrency,
  incentreOppositeAngleFromVertexAngle,
  rightTriangleOrthocentreLocation,
  vertexAngleFromIncentreOppositeAngle,
} from "../../../../../shared/geometry";
import { GEO_GAP_REMEDIATION_WAVE3_PROTOTYPES } from "../source-remediation/wave3-prototypes";
import { GEO_GAP_REMEDIATION_WAVE3_SOURCE_EVIDENCE } from "../source-remediation/wave3-source-evidence";
import { extractSvgLabelCollisionScores, numericAngleDegrees } from "../source-remediation/wave3-utils";

const seeds = ["wave3-a", "wave3-b", "wave3-c"] as const;

assert.equal(identifyTriangleCentreFromConcurrency("ANGLE_BISECTORS"), "Incentre");
assert.equal(identifyTriangleCentreFromConcurrency("ALTITUDES"), "Orthocentre");
assert.deepEqual(incentreOppositeAngleFromVertexAngle(angle(68)), angle(124));
assert.deepEqual(vertexAngleFromIncentreOppositeAngle(angle(125)), angle(70));
assert.equal(rightTriangleOrthocentreLocation(), "RIGHT_ANGLED_VERTEX");
assert.throws(() => incentreOppositeAngleFromVertexAngle(angle(180)));
assert.throws(() => vertexAngleFromIncentreOppositeAngle(angle(90)));

for (const theoremId of [
  "TRIANGLE_CENTRE_ANGLE_BISECTORS_INCENTRE",
  "TRIANGLE_CENTRE_ALTITUDES_ORTHOCENTRE",
  "TRIANGLE_CENTRE_INCENTRE_OPPOSITE_ANGLE",
  "TRIANGLE_CENTRE_RIGHT_TRIANGLE_ORTHOCENTRE_VERTEX",
] as const) {
  assert.equal(getTheoremDefinition(theoremId).family, "TRIANGLE_CENTRES");
}

assert.equal(GEO_GAP_REMEDIATION_WAVE3_SOURCE_EVIDENCE.length, 4);
assert.equal(new Set(GEO_GAP_REMEDIATION_WAVE3_SOURCE_EVIDENCE.map((source) => source.id)).size, 4);
for (const source of GEO_GAP_REMEDIATION_WAVE3_SOURCE_EVIDENCE) {
  assert.ok(source.url.startsWith("https://"));
  assert.ok(source.support.length > 20);
}

assert.equal(GEO_GAP_REMEDIATION_WAVE3_PROTOTYPES.length, 4);
assert.equal(new Set(GEO_GAP_REMEDIATION_WAVE3_PROTOTYPES.map((prototype) => prototype.temporaryPrototypeId)).size, 4);

for (const prototype of GEO_GAP_REMEDIATION_WAVE3_PROTOTYPES) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  for (const seed of seeds) {
    const question = prototype.generate(seed);
    stems.add(question.stem);
    answers.add(question.answer);
    assert.equal(question.validation.ok, true, `${prototype.temporaryPrototypeId} validation failed: ${question.validation.errors.join(", ")}`);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.sourceStatus, "EXTERNAL_SOURCE_AUDIT_WAVE3__GAP_REMEDIATION");
    assert.equal(question.packageId, "GEO-001");
    assert.equal(question.cpId, "GEO-CP-006");
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.equal(question.optionAnalysis.filter((option) => option.correct).length, 1);
    assert.equal(question.minimalityProof.passed, true);
    assert.equal(question.independentVerifierResult.passed, true);
    assert.ok(question.sourceEvidenceIds.length > 0);
    for (const sourceId of question.sourceEvidenceIds) {
      assert.ok(GEO_GAP_REMEDIATION_WAVE3_SOURCE_EVIDENCE.some((source) => source.id === sourceId));
    }
    assert.equal(question.diagramDisposition, "REQUIRED_STEM_DIAGRAM");
    assert.ok(question.diagramModel);
    assert.equal(question.diagramModel?.disclosure, "STEM");
    assert.equal(question.diagramModel?.notToScale, true);
    assert.ok(question.stemSvg?.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2"'));
    assert.ok(question.diagramFingerprint);
    assert.deepEqual(extractSvgLabelCollisionScores(question.stemSvg ?? "").filter((score) => score > 0), []);
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
  assert.equal(stems.size, 3, `${prototype.temporaryPrototypeId} must vary its stem across the three review seeds`);
  if (prototype.temporaryPrototypeId.includes("ANGLE-DIRECT") || prototype.temporaryPrototypeId.includes("ANGLE-INVERSE")) {
    assert.equal(answers.size, 3, `${prototype.temporaryPrototypeId} must vary its numeric target across review seeds`);
  }
}

const identify = GEO_GAP_REMEDIATION_WAVE3_PROTOTYPES[0].generate("visual-policy");
if (!identify.diagramModel) throw new Error("Incentre identification diagram missing");
const ip = (id: string) => {
  const point = identify.diagramModel?.points.find((candidate) => candidate.id === id);
  if (!point) throw new Error(`Missing incentre-identification point ${id}`);
  return point;
};
assert.ok(Math.abs(numericAngleDegrees(ip("B"), ip("A"), ip("I")) - numericAngleDegrees(ip("I"), ip("A"), ip("C"))) < 1e-6);
assert.ok(Math.abs(numericAngleDegrees(ip("A"), ip("B"), ip("I")) - numericAngleDegrees(ip("I"), ip("B"), ip("C"))) < 1e-6);
assert.ok(Math.abs(numericAngleDegrees(ip("A"), ip("C"), ip("I")) - numericAngleDegrees(ip("I"), ip("C"), ip("B"))) < 1e-6);

const orthocentre = GEO_GAP_REMEDIATION_WAVE3_PROTOTYPES[1].generate("visual-policy");
if (!orthocentre.diagramModel) throw new Error("Right-triangle orthocentre diagram missing");
assert.equal(orthocentre.diagramModel.rightAngleMarks.length, 1, "the stated right angle must be visibly marked");
const op = (id: string) => {
  const point = orthocentre.diagramModel?.points.find((candidate) => candidate.id === id);
  if (!point) throw new Error(`Missing right-triangle point ${id}`);
  return point;
};
assert.ok(Math.abs(numericAngleDegrees(op("B"), op("A"), op("C")) - 90) < 1e-8);

for (const index of [2, 3]) {
  const question = GEO_GAP_REMEDIATION_WAVE3_PROTOTYPES[index].generate("wave3-b");
  if (!question.diagramModel) throw new Error("Incentre-angle diagram missing");
  assert.equal(question.diagramModel.angleMarks.length, 2);
  assert.ok(question.diagramModel.angleMarks.some((mark) => mark.label === "x"));
  assert.ok(question.diagramModel.angleMarks.some((mark) => mark.label?.endsWith("°")));
  const p = (id: string) => {
    const point = question.diagramModel?.points.find((candidate) => candidate.id === id);
    if (!point) throw new Error(`Missing incentre-angle point ${id}`);
    return point;
  };
  const vertex = numericAngleDegrees(p("B"), p("A"), p("C"));
  const atI = numericAngleDegrees(p("B"), p("I"), p("C"));
  assert.ok(Math.abs(atI - (90 + vertex / 2)) < 1e-6, "learner layout must satisfy the incentre-angle relation");
}

console.log("Geometry gap remediation Wave 3 PASS: 4 CP006 source-observed prototypes × 3 seeds with exact centre inference, Renderer V2 topology, angle-sign and collision QA.");
