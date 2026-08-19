import assert from "node:assert/strict";
import {
  GEOMETRY_THEOREM_IDS,
  correspondingLengthFromPerimeterScale,
  getTheoremDefinition,
  perimeterFromCorrespondingSideScale,
  rational,
} from "../../../../../shared/geometry";
import { GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES } from "../source-remediation/wave4-prototypes";
import { GEO_GAP_REMEDIATION_WAVE4_SOURCE_EVIDENCE } from "../source-remediation/wave4-source-evidence";

const seeds = ["wave4-a", "wave4-b", "wave4-c"] as const;

assert.deepEqual(correspondingLengthFromPerimeterScale(rational(26), rational(39), rational(24)), rational(16));
assert.deepEqual(correspondingLengthFromPerimeterScale(rational(48), rational(72), rational(18)), rational(12));
assert.deepEqual(perimeterFromCorrespondingSideScale(rational(8), rational(12), rational(54)), rational(36));
assert.throws(() => correspondingLengthFromPerimeterScale(rational(0), rational(39), rational(24)));
assert.throws(() => perimeterFromCorrespondingSideScale(rational(8), rational(0), rational(54)));

const perimeterTheorem = getTheoremDefinition("SIMILAR_TRIANGLES_PERIMETER_SCALE");
assert.equal(perimeterTheorem.family, "SIMILARITY");
assert.equal(perimeterTheorem.learnerName, "in similar triangles, the ratio of the perimeters equals the ratio of any corresponding side pair");

assert.equal(GEO_GAP_REMEDIATION_WAVE4_SOURCE_EVIDENCE.length, 3);
for (const source of GEO_GAP_REMEDIATION_WAVE4_SOURCE_EVIDENCE) {
  assert.ok(source.url.startsWith("https://testbook.com/question-answer/"));
  assert.ok(source.support.length > 40);
}

assert.equal(GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES.length, 2);
assert.equal(new Set(GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES.map((prototype) => prototype.temporaryPrototypeId)).size, 2);

for (const prototype of GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES) {
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
    assert.equal(question.cpId, "GEO-CP-005");
    assert.equal(question.permanentQlId, null);
    assert.equal(question.sourceStatus, "EXTERNAL_SOURCE_AUDIT_WAVE4__GAP_REMEDIATION");
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
    assert.deepEqual(question.theoremTrace, ["SIMILAR_TRIANGLES_PERIMETER_SCALE"]);
    assert.ok(question.sourceEvidenceIds.length > 0);
    for (const sourceId of question.sourceEvidenceIds) {
      assert.ok(GEO_GAP_REMEDIATION_WAVE4_SOURCE_EVIDENCE.some((source) => source.id === sourceId));
    }

    for (const wrong of question.optionAnalysis.filter((option) => !option.correct)) {
      assert.ok(wrong.misconceptionId);
      assert.ok(wrong.rationale.length > 30, `${wrong.misconceptionId} needs an operation-specific rationale`);
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
  assert.equal(answers.size, 3, `${prototype.temporaryPrototypeId} must expose three varied numeric targets`);
  assert.equal(fingerprints.size, 3, `${prototype.temporaryPrototypeId} fingerprints must vary by seed`);
}

const direct = GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES[0].generate("wave4-a");
assert.equal(direct.answer, "16 cm");
assert.ok(direct.explanation.lines.some((line) => line.includes("26/39")));
assert.equal(direct.optionAnalysis.find((option) => option.misconceptionId === "SIMILARITY_SCALE_INVERTED")?.text, "36 cm");
assert.equal(direct.optionAnalysis.find((option) => option.misconceptionId === "SIMILARITY_SCALE_COPIED")?.text, "24 cm");
assert.equal(direct.optionAnalysis.find((option) => option.misconceptionId === "PERIMETER_DIFFERENCE_USED_AS_LENGTH")?.text, "13 cm");

const perimeterFromSide = GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES[1].generate("wave4-a");
assert.equal(perimeterFromSide.answer, "36 cm");
assert.ok(perimeterFromSide.explanation.lines.some((line) => line.includes("12 + 18 + 24")));
assert.equal(perimeterFromSide.optionAnalysis.find((option) => option.misconceptionId === "SIMILARITY_PERIMETER_COPIED")?.text, "54 cm");
assert.equal(perimeterFromSide.optionAnalysis.find((option) => option.misconceptionId === "SIMILARITY_SCALE_INVERTED")?.text, "81 cm");
assert.equal(perimeterFromSide.optionAnalysis.find((option) => option.misconceptionId === "SIMILARITY_ADDITIVE_SCALING")?.text, "50 cm");

console.log("Geometry gap remediation Wave 4 PASS: 2 CP005 perimeter-scale prototypes × 3 varied seeds with exact inference, operation-owned distractors, independent cross-checks, clue minimality and NO_DIAGRAM policy QA.");
