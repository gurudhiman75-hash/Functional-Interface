import assert from "node:assert/strict";
import { GEOMETRY_THEOREM_IDS } from "../../../../../shared/geometry";
import { GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES } from "../source-remediation/wave9-prototypes";
import { GEO_GAP_REMEDIATION_WAVE9_SOURCE_EVIDENCE } from "../source-remediation/wave9-source-evidence";

const seeds = ["wave9-a", "wave9-b", "wave9-c"] as const;

assert.equal(GEO_GAP_REMEDIATION_WAVE9_SOURCE_EVIDENCE.length, 4);
assert.equal(GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES.length, 4);
assert.equal(new Set(GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES.map((prototype) => prototype.temporaryPrototypeId)).size, 4);

for (const source of GEO_GAP_REMEDIATION_WAVE9_SOURCE_EVIDENCE) {
  assert.ok(source.url.startsWith("https://testbook.com/question-answer/"));
  assert.ok(source.exam.startsWith("SSC CGL"));
  assert.ok(source.support.length > 70);
}

const usedSources = new Set<string>();
for (const prototype of GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES) {
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  for (const seed of seeds) {
    const question = prototype.generate(seed);
    stems.add(question.stem);
    fingerprints.add(question.canonicalGeometryFingerprint);

    assert.equal(question.validation.ok, true, `${prototype.temporaryPrototypeId}: ${question.validation.errors.join(", ")}`);
    assert.equal(question.packageId, "GEO-001");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.equal(question.optionAnalysis.filter((option) => option.correct).length, 1);
    assert.equal(question.minimalityProof.passed, true);
    assert.equal(question.independentVerifierResult.passed, true);
    assert.ok(question.sourceEvidenceIds.length > 0);

    for (const sourceId of question.sourceEvidenceIds) {
      usedSources.add(sourceId);
      assert.ok(GEO_GAP_REMEDIATION_WAVE9_SOURCE_EVIDENCE.some((source) => source.id === sourceId));
    }

    if (question.diagramDisposition === "REQUIRED_STEM_DIAGRAM") {
      assert.ok(question.diagramModel);
      assert.ok(question.stemSvg?.includes("<svg"));
      assert.ok(question.diagramFingerprint);
      assert.equal(question.stemSvg?.includes("NaN"), false);
      assert.equal(question.stemSvg?.includes("undefined"), false);
    } else {
      assert.equal(question.diagramModel, undefined);
      assert.equal(question.stemSvg, undefined);
      assert.equal(question.diagramFingerprint, null);
    }

    for (const wrong of question.optionAnalysis.filter((option) => !option.correct)) {
      assert.ok(wrong.misconceptionId);
      assert.ok(wrong.rationale.length > 35);
    }

    const learnerText = [...question.explanation.lines, ...question.explanation.theoremNames].join(" ");
    for (const theoremId of GEOMETRY_THEOREM_IDS) assert.equal(learnerText.includes(theoremId), false);

    assert.equal(question.lifecycle.stage, "DISCOVERY");
    assert.equal(question.lifecycle.permanentQlAllocated, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
  }
  assert.equal(stems.size, 3, `${prototype.temporaryPrototypeId} must vary wording across review seeds`);
  assert.equal(fingerprints.size, 3, `${prototype.temporaryPrototypeId} must vary canonical fingerprint by seed`);
}

assert.deepEqual([...usedSources].sort(), GEO_GAP_REMEDIATION_WAVE9_SOURCE_EVIDENCE.map((source) => source.id).sort());

const aroundPoint = GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES[0].generate("wave9-a");
assert.equal(aroundPoint.answer, "120°");
assert.deepEqual(aroundPoint.theoremTrace, ["ANGLE_AROUND_POINT"]);

const alternate = GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES[1].generate("wave9-a");
assert.equal(alternate.answer, "115°");
assert.deepEqual(alternate.theoremTrace, ["ALTERNATE_INTERIOR_ANGLES"]);

const integerCount = GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES[2].generate("wave9-a");
assert.equal(integerCount.answer, "11");
assert.equal(integerCount.optionAnalysis.find((option) => option.misconceptionId === "INCLUDED_DEGENERATE_BOUNDARIES")?.text, "13");
assert.equal(integerCount.optionAnalysis.find((option) => option.misconceptionId === "IGNORED_LOWER_TRIANGLE_BOUND")?.text, "17");

const claim = GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES[3].generate("wave9-a");
assert.equal(claim.answer, "The sum of any two sides is greater than the third side.");

console.log("Geometry gap remediation Wave 9 PASS: 4 CP001-003 source-backed prototypes × 3 review seeds with diagram contracts, exact source ownership, misconception-owned distractors, clue minimality and independent verification.");
