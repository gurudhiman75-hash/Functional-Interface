import assert from "node:assert/strict";
import {
  GEOMETRY_THEOREM_IDS,
  directCommonTangentLength,
  externallyTangentCentreDistance,
  commonTangentSimilarityRadiusFromOuterTangent,
  getTheoremDefinition,
  rational,
} from "../../../../../shared/geometry";
import { GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES } from "../source-remediation/wave2-prototypes";
import { GEO_GAP_REMEDIATION_WAVE2_SOURCE_EVIDENCE } from "../source-remediation/wave2-source-evidence";
import { extractSvgLabelCollisionScores, numericAngleDegrees } from "../source-remediation/wave2-utils";

const q = (value: number, denominator = 1) => rational(value, denominator);
const seeds = ["wave2-a", "wave2-b", "wave2-c"] as const;

const d = externallyTangentCentreDistance(q(9), q(4));
assert.deepEqual(d, q(13));
assert.deepEqual(directCommonTangentLength(d, q(9), q(4)), q(12));
assert.deepEqual(commonTangentSimilarityRadiusFromOuterTangent(q(15), q(20)), q(15, 4));
assert.deepEqual(commonTangentSimilarityRadiusFromOuterTangent(q(12), q(16)), q(3));
assert.deepEqual(commonTangentSimilarityRadiusFromOuterTangent(q(21), q(28)), q(21, 4));

assert.equal(GEO_GAP_REMEDIATION_WAVE2_SOURCE_EVIDENCE.length, 3);
assert.equal(new Set(GEO_GAP_REMEDIATION_WAVE2_SOURCE_EVIDENCE.map((source) => source.id)).size, 3);
for (const source of GEO_GAP_REMEDIATION_WAVE2_SOURCE_EVIDENCE) {
  assert.ok(source.url.startsWith("https://"));
  assert.ok(source.support.length > 20);
}

assert.equal(GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES.length, 3);
assert.equal(new Set(GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES.map((prototype) => prototype.temporaryPrototypeId)).size, 3);

for (const prototype of GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  for (const seed of seeds) {
    const question = prototype.generate(seed);
    stems.add(question.stem);
    answers.add(question.answer);
    assert.equal(question.validation.ok, true, `${prototype.temporaryPrototypeId} validation failed: ${question.validation.errors.join(", ")}`);
    assert.equal(question.permanentQlId, null);
    assert.equal(question.sourceStatus, "EXTERNAL_SOURCE_AUDIT_WAVE2__GAP_REMEDIATION");
    assert.equal(question.packageId, "GEO-002");
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.equal(question.optionAnalysis.filter((option) => option.correct).length, 1);
    assert.equal(question.minimalityProof.passed, true);
    assert.equal(question.independentVerifierResult.passed, true);
    assert.ok(question.sourceEvidenceIds.length > 0);
    for (const sourceId of question.sourceEvidenceIds) {
      assert.ok(GEO_GAP_REMEDIATION_WAVE2_SOURCE_EVIDENCE.some((source) => source.id === sourceId));
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

    if (question.cpId === "GEO-CP-014") {
      const families = new Set(question.theoremTrace.map((id) => getTheoremDefinition(id).family).filter((family) => family !== "GENERIC"));
      assert.ok(families.size >= 2, `${prototype.temporaryPrototypeId} must synthesize at least two non-generic theorem families`);
    }
  }
  assert.equal(stems.size, 3, `${prototype.temporaryPrototypeId} must vary its stem across the three review seeds`);
  assert.equal(answers.size, 3, `${prototype.temporaryPrototypeId} must vary its numeric target across the three review seeds`);
}

const direct = GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES[0].generate("visual-policy");
if (!direct.diagramModel) throw new Error("Direct common tangent diagram missing");
const directPoint = (id: string) => {
  const point = direct.diagramModel?.points.find((candidate) => candidate.id === id);
  if (!point) throw new Error(`Missing direct tangent point ${id}`);
  return point;
};
const dist = (a: string, b: string) => Math.hypot(directPoint(a).x - directPoint(b).x, directPoint(a).y - directPoint(b).y);
assert.ok(Math.abs(dist("O1", "X") - 54) < 1e-8);
assert.ok(Math.abs(dist("O2", "X") - 24) < 1e-8);
assert.ok(Math.abs(dist("O1", "O2") - 78) < 1e-8);
assert.equal(direct.diagramModel.rightAngleMarks.length, 0, "derived tangent right angles should not be semantically marked");

const similarity = GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES[1].generate("visual-policy");
if (!similarity.diagramModel) throw new Error("Common tangent similarity diagram missing");
assert.equal(similarity.diagramModel.segments.find((segment) => segment.id === "PC")?.extent, "RAY");
assert.equal(similarity.diagramModel.rightAngleMarks.length, 0, "derived tangent right angles should remain unmarked in the stem");
const simPoint = (id: string) => {
  const point = similarity.diagramModel?.points.find((candidate) => candidate.id === id);
  if (!point) throw new Error(`Missing similarity point ${id}`);
  return point;
};
const cross = (a: string, b: string, c: string) => (simPoint(b).x - simPoint(a).x) * (simPoint(c).y - simPoint(a).y) - (simPoint(b).y - simPoint(a).y) * (simPoint(c).x - simPoint(a).x);
assert.ok(Math.abs(cross("P", "D", "C")) < 1e-8, "P, D and C must lie on the same common tangent");
assert.ok(Math.abs(Math.hypot(simPoint("N").x - simPoint("X").x, simPoint("N").y - simPoint("X").y) - 22.5) < 1e-8);
assert.ok(Math.abs(Math.hypot(simPoint("M").x - simPoint("X").x, simPoint("M").y - simPoint("X").y) - 90) < 1e-8);

const synthesis = GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES[2].generate("wave2-a");
if (!synthesis.diagramModel) throw new Error("Tangent-inscribed synthesis diagram missing");
assert.equal(synthesis.diagramModel.angleMarks.length, 2);
assert.ok(synthesis.diagramModel.angleMarks.some((mark) => mark.label === "x"));
assert.ok(synthesis.diagramModel.angleMarks.some((mark) => mark.label?.endsWith("°")));
assert.equal(synthesis.diagramModel.rightAngleMarks.length, 0, "derived tangency right angles must not be shown");
const synPoint = (id: string) => {
  const point = synthesis.diagramModel?.points.find((candidate) => candidate.id === id);
  if (!point) throw new Error(`Missing synthesis point ${id}`);
  return point;
};
const givenMark = synthesis.diagramModel.angleMarks.find((mark) => mark.id === "given-tangent-angle");
if (!givenMark?.label) throw new Error("Given tangent angle label missing");
const givenAngle = Number(givenMark.label.replace("°", ""));
assert.ok(Math.abs(numericAngleDegrees(synPoint("A"), synPoint("P"), synPoint("B")) - givenAngle) < 1e-7);
assert.ok(Math.abs(numericAngleDegrees(synPoint("A"), synPoint("C"), synPoint("B")) - Number(synthesis.answer.replace("°", ""))) < 1e-7);

console.log("Geometry gap remediation Wave 2 PASS: 3 source-observed prototypes × 3 varied seeds with exact common-tangent, synthesis, Renderer V2 topology and collision QA.");
