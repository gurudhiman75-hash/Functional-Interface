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
    assert.equal(question.optionAnalysis.filter((option) => option.correct).length, 1);
    assert.equal(question.minimalityProof.passed, true);
    assert.equal(question.independentVerifierResult.passed, true);
    assert.ok(question.sourceEvidenceIds.length > 0);
    for (const sourceId of question.sourceEvidenceIds) assert.ok(GEO_GAP_REMEDIATION_WAVE5_SOURCE_EVIDENCE.some((source) => source.id === sourceId));

    const families = new Set(question.theoremTrace.map((id) => getTheoremDefinition(id).family).filter((family) => family !== "GENERIC"));
    assert.ok(families.size >= 2, `${prototype.temporaryPrototypeId} must remain materially mixed`);
    assert.ok(question.theoremTrace.some((id) => getTheoremDefinition(id).family === "CONGRUENCE"));
    assert.ok(question.theoremTrace.some((id) => getTheoremDefinition(id).family === "LINES"));
    assert.ok(question.theoremTrace.includes("CPCT"));

    const learnerText = [...question.explanation.lines, ...question.explanation.theoremNames].join(" ");
    for (const theoremId of GEOMETRY_THEOREM_IDS) assert.equal(learnerText.includes(theoremId), false, `${prototype.temporaryPrototypeId} leaked theorem ID ${theoremId}`);

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
assert.equal(midpoint.diagramModel.parallelMarks.length, 0, "derived parallelogram parallelism must remain hidden in stem");
assert.equal(midpoint.stemSvg.includes("OR = RN"), false, "derived midpoint equality must not leak into stem");
assert.ok(midpoint.solutionSvg.includes("ON = 12 cm"), "solution must show solve-relevant given ON dimension");
assert.ok(midpoint.solutionSvg.includes("OR = RN = 6 cm"), "solution must show derived equal halves and solved target dimension");
assert.deepEqual(midpoint.solutionDiagramModel.equalLengthMarks.map((mark) => [...mark.segmentIds]), [["OR", "RN"]]);
assert.deepEqual(midpoint.solutionDiagramModel.parallelMarks.map((mark) => [...mark.segmentIds]), [["OP", "MN"]]);

const diagonal = GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES[1].generate("wave5-a");
assert.equal(diagonal.answer, "8 cm");
assert.deepEqual(diagonal.theoremTrace, ["ALTERNATE_INTERIOR_ANGLES", "SAS_CONGRUENCE", "CPCT"]);
assert.equal(diagonal.diagramModel.equalLengthMarks.length, 0, "AB = CD remains prose-only in stem to avoid mark collision");
assert.deepEqual(diagonal.diagramModel.parallelMarks.map((mark) => [...mark.segmentIds]), [["AB", "CD"]]);
assert.ok(diagonal.stem.includes("AB = CD"), "omitted equality mark must remain explicit in stem");
assert.equal(diagonal.stemSvg.includes("BC = 8 cm"), false, "derived answer dimension must not leak into stem");
assert.ok(diagonal.solutionSvg.includes("AB = CD"), "solution must restore the given equality as a readable annotation");
assert.ok(diagonal.solutionSvg.includes("AD = 8 cm"), "solution must show the solve-relevant given side dimension");
assert.ok(diagonal.solutionSvg.includes("BC = 8 cm"), "solution must show the CPCT-derived target dimension");
assert.equal(diagonal.solutionDiagramModel.angleMarks.length, 2, "solution should visually expose the derived alternate-angle pair used for SAS");
assert.deepEqual(diagonal.solutionDiagramModel.parallelMarks.map((mark) => [...mark.segmentIds]), [["AB", "CD"]]);

console.log("Geometry gap remediation Wave 5 PASS: 2 CP014 prototypes × 3 seeds with REQUIRED_BOTH stem/solution diagrams, dimension-rich solution disclosure, zero label collisions, stem anti-leak, mixed theorem-family traces, clue minimality and operation-owned distractors.");
