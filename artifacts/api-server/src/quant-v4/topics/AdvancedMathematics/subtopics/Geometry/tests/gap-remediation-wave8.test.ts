import assert from "node:assert/strict";
import { GEOMETRY_THEOREM_IDS, getTheoremDefinition } from "../../../../../shared/geometry";
import { GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES } from "../source-remediation/wave8-prototypes";
import { GEO_GAP_REMEDIATION_WAVE8_SOURCE_EVIDENCE } from "../source-remediation/wave8-source-evidence";

const seeds = ["wave8-a", "wave8-b", "wave8-c"] as const;

assert.equal(getTheoremDefinition("POLYGON_INTERIOR_SUM").family, "POLYGONS");
assert.equal(getTheoremDefinition("POLYGON_EXTERIOR_SUM").family, "POLYGONS");
assert.equal(getTheoremDefinition("LINEAR_PAIR_SUM").family, "LINES");

assert.equal(GEO_GAP_REMEDIATION_WAVE8_SOURCE_EVIDENCE.length, 2);
for (const source of GEO_GAP_REMEDIATION_WAVE8_SOURCE_EVIDENCE) {
  assert.ok(source.url.startsWith("https://testbook.com/question-answer/"));
  assert.ok(source.support.length > 60);
  assert.ok(source.exam.startsWith("SSC "));
}

assert.equal(GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES.length, 3);
assert.equal(new Set(GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES.map((prototype) => prototype.temporaryPrototypeId)).size, 3);
assert.equal(new Set(GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES.map((prototype) => prototype.sourceGapId)).size, 3);

const observedSourceIds = new Set<string>();
for (const prototype of GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const fingerprints = new Set<string>();

  for (const seed of seeds) {
    const question = prototype.generate(seed);
    stems.add(question.stem);
    answers.add(question.answer);
    fingerprints.add(question.canonicalGeometryFingerprint);

    assert.equal(question.validation.ok, true, `${prototype.temporaryPrototypeId} validation failed: ${question.validation.errors.join(", ")}`);
    assert.equal(question.packageId, "GEO-001");
    assert.equal(question.cpId, "GEO-CP-009");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.sourceStatus, "EXTERNAL_SOURCE_AUDIT_WAVE8__GAP_REMEDIATION");
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.equal(question.optionAnalysis.filter((option) => option.correct).length, 1);
    assert.equal(question.minimalityProof.passed, true);
    assert.equal(question.independentVerifierResult.oracle, "INDEPENDENT_DEFINITION_CHECK");
    assert.equal(question.independentVerifierResult.passed, true);
    assert.equal(question.diagramDisposition, "NO_DIAGRAM");
    assert.equal(question.diagramFingerprint, null);
    assert.equal("diagramModel" in question, false);
    assert.equal("stemSvg" in question, false);
    assert.equal("solutionSvg" in question, false);
    assert.ok(question.sourceEvidenceIds.length > 0);

    for (const sourceId of question.sourceEvidenceIds) {
      observedSourceIds.add(sourceId);
      assert.ok(GEO_GAP_REMEDIATION_WAVE8_SOURCE_EVIDENCE.some((source) => source.id === sourceId));
    }

    for (const wrong of question.optionAnalysis.filter((option) => !option.correct)) {
      assert.ok(wrong.misconceptionId);
      assert.ok(wrong.rationale.length > 35, `${wrong.misconceptionId} needs an operation-specific rationale`);
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

  assert.equal(stems.size, 3, `${prototype.temporaryPrototypeId} must expose three materially varied review stems`);
  assert.equal(fingerprints.size, 3, `${prototype.temporaryPrototypeId} fingerprints must vary by seed`);
  if (prototype.temporaryPrototypeId !== "GEO-TMP-GAP-W8-CP009-EXTERIOR-SUM-INVARIANT-V1") {
    assert.equal(answers.size, 3, `${prototype.temporaryPrototypeId} must expose three varied numeric targets`);
  } else {
    assert.deepEqual([...answers], ["360°"], "Exterior-sum theorem must remain invariant at 360 degrees");
  }
}

assert.deepEqual(
  [...observedSourceIds].sort(),
  GEO_GAP_REMEDIATION_WAVE8_SOURCE_EVIDENCE.map((source) => source.id).sort(),
  "Every Wave 8 source-evidence record must own at least one generated question",
);

const interiorInverse = GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES[0].generate("wave8-a");
assert.equal(interiorInverse.answer, "9 sides");
assert.deepEqual(interiorInverse.theoremTrace, ["POLYGON_INTERIOR_SUM"]);
assert.equal(interiorInverse.optionAnalysis.find((option) => option.misconceptionId === "POLYGON_INTERIOR_SUM_FORGOT_PLUS_TWO")?.text, "7 sides");

const exteriorInvariant = GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES[1].generate("wave8-a");
assert.equal(exteriorInvariant.answer, "360°");
assert.deepEqual(exteriorInvariant.theoremTrace, ["POLYGON_EXTERIOR_SUM"]);
assert.equal(exteriorInvariant.optionAnalysis.find((option) => option.misconceptionId === "USED_INTERIOR_ANGLE_SUM")?.text, "540°");
assert.equal(exteriorInvariant.optionAnalysis.find((option) => option.misconceptionId === "USED_ONE_REGULAR_EXTERIOR_ANGLE")?.text, "72°");

const mixedChain = GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES[2].generate("wave8-a");
assert.equal(mixedChain.answer, "100°");
assert.deepEqual(mixedChain.theoremTrace, ["POLYGON_INTERIOR_SUM", "POLYGON_EXTERIOR_SUM", "LINEAR_PAIR_SUM"]);
assert.deepEqual(mixedChain.sourceEvidenceIds, ["SRC-TESTBOOK-CGL-POLYGON-INTERIOR-SUM-INVERSE-PYQ-2019"]);
assert.equal(mixedChain.optionAnalysis.find((option) => option.misconceptionId === "RETURNED_INTERIOR_ANGLE_ONLY")?.text, "140°");
assert.equal(mixedChain.optionAnalysis.find((option) => option.misconceptionId === "RETURNED_EXTERIOR_ANGLE_ONLY")?.text, "40°");
assert.equal(mixedChain.optionAnalysis.find((option) => option.misconceptionId === "DOUBLED_EXTERIOR_ANGLE")?.text, "80°");

console.log("Geometry gap remediation Wave 8 PASS: 3 CP009 polygon prototypes × 3 varied seeds with exact source ownership, exact polygon inference, misconception-owned distractors, clue minimality, independent checks and NO_DIAGRAM policy QA.");
