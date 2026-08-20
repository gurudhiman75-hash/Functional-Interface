import assert from "node:assert/strict";
import { GEOMETRY_THEOREM_IDS, getTheoremDefinition } from "../../../../../shared/geometry";
import { GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES } from "../source-remediation/wave5-prototypes";
import { GEO_GAP_REMEDIATION_WAVE5_SOURCE_EVIDENCE } from "../source-remediation/wave5-source-evidence";
import { extractSvgLabelCollisionScores } from "../source-remediation/wave5-utils";

const seeds = ["wave5-a", "wave5-b", "wave5-c"] as const;

assert.equal(GEO_GAP_REMEDIATION_WAVE5_SOURCE_EVIDENCE.length, 2);
assert.equal(GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES.length, 2);
assert.equal(new Set(GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES.map((prototype) => prototype.temporaryPrototypeId)).size, 2);

for (const prototype of GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const fingerprints = new Set<string>();
  for (const seed of seeds) {
    const question = prototype.generate(seed);
    stems.add(question.stem);
    answers.add(question.answer);
    fingerprints.add(question.canonicalGeometryFingerprint);

    assert.equal(question.validation.ok, true, `${prototype.temporaryPrototypeId}: ${question.validation.errors.join(", ")}`);
    assert.equal(question.packageId, "GEO-002");
    assert.equal(question.cpId, "GEO-CP-014");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.sourceStatus, "EXTERNAL_SOURCE_AUDIT_WAVE5__GAP_REMEDIATION");
    assert.equal(question.diagramDisposition, "REQUIRED_STEM_DIAGRAM");
    assert.ok(question.stemSvg.includes('data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2"'));
    assert.ok(extractSvgLabelCollisionScores(question.stemSvg).every((score) => score === 0));
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.equal(question.optionAnalysis.filter((option) => option.correct).length, 1);
    assert.equal(question.minimalityProof.passed, true);
    assert.equal(question.independentVerifierResult.passed, true);
    assert.ok(question.sourceEvidenceIds.length > 0);
    for (const sourceId of question.sourceEvidenceIds) {
      assert.ok(GEO_GAP_REMEDIATION_WAVE5_SOURCE_EVIDENCE.some((source) => source.id === sourceId));
    }

    const families = new Set(question.theoremTrace.map((id) => getTheoremDefinition(id).family).filter((family) => family !== "GENERIC"));
    assert.ok(families.size >= 2, `${prototype.temporaryPrototypeId} must remain materially mixed`);
    assert.ok(question.theoremTrace.some((id) => getTheoremDefinition(id).family === "CONGRUENCE"));
    assert.ok(question.theoremTrace.some((id) => getTheoremDefinition(id).family === "LINES"));
    assert.ok(question.theoremTrace.includes("CPCT"));

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
  assert.equal(answers.size, 3, `${prototype.temporaryPrototypeId} must expose three varied answers`);
  assert.equal(fingerprints.size, 3, `${prototype.temporaryPrototypeId} fingerprints must vary by seed`);
}

const midpoint = GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES[0].generate("wave5-a");
assert.equal(midpoint.answer, "6 cm");
assert.deepEqual(midpoint.theoremTrace, ["PARALLELOGRAM_OPPOSITE_SIDES", "ALTERNATE_INTERIOR_ANGLES", "ASA_AAS_CONGRUENCE", "CPCT"]);
assert.deepEqual(midpoint.diagramModel.equalLengthMarks.map((mark) => [...mark.segmentIds]), [["MN", "NQ"]]);
assert.equal(midpoint.diagramModel.parallelMarks.length, 0, "derived parallelogram parallelism should not be additionally marked");
assert.equal(midpoint.optionAnalysis.find((option) => option.misconceptionId === "CPCT_MIDPOINT_COPIES_WHOLE_SIDE")?.text, "12 cm");
assert.equal(midpoint.optionAnalysis.find((option) => option.misconceptionId === "CPCT_MIDPOINT_ASSUMES_THREE_EQUAL_PARTS")?.text, "4 cm");
assert.equal(midpoint.optionAnalysis.find((option) => option.misconceptionId === "CPCT_MIDPOINT_USES_TWO_TO_ONE_RATIO")?.text, "8 cm");

const diagonal = GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES[1].generate("wave5-a");
assert.equal(diagonal.answer, "8 cm");
assert.deepEqual(diagonal.theoremTrace, ["ALTERNATE_INTERIOR_ANGLES", "SAS_CONGRUENCE", "CPCT"]);
assert.deepEqual(diagonal.diagramModel.equalLengthMarks.map((mark) => [...mark.segmentIds]), [["AB", "CD"]]);
assert.deepEqual(diagonal.diagramModel.parallelMarks.map((mark) => [...mark.segmentIds]), [["AB", "CD"]]);
assert.equal(diagonal.optionAnalysis.find((option) => option.misconceptionId === "CONGRUENT_SIDE_DOUBLED")?.text, "16 cm");
assert.equal(diagonal.optionAnalysis.find((option) => option.misconceptionId === "DIAGONAL_HALVES_CORRESPONDING_SIDE")?.text, "4 cm");
assert.equal(diagonal.optionAnalysis.find((option) => option.misconceptionId === "CONGRUENCE_TREATED_AS_THREE_TO_TWO_SCALE")?.text, "12 cm");

console.log("Geometry gap remediation Wave 5 PASS: 2 CP014 congruence-plus-parallel prototypes × 3 varied seeds with mixed theorem-family traces, faithful Renderer-V2 topology, anti-leak marks, clue minimality and operation-owned distractors.");
