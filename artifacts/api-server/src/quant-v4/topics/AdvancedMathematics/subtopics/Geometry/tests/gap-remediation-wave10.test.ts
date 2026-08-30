import assert from "node:assert/strict";
import {
  areaRatioFromCorrespondingSideRatio,
  correspondingSideRatioFromAreaRatio,
  getTheoremDefinition,
  rational,
} from "../../../../../shared/geometry";
import { GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES } from "../source-remediation/wave10-prototypes";
import { GEO_GAP_REMEDIATION_WAVE10_SOURCE_EVIDENCE } from "../source-remediation/wave10-source-evidence";

const seeds = ["wave10-a", "wave10-b", "wave10-c"] as const;
assert.deepEqual(correspondingSideRatioFromAreaRatio(rational(121), rational(225)), rational(11, 15));
assert.deepEqual(areaRatioFromCorrespondingSideRatio(rational(11), rational(15)), rational(121, 225));
assert.throws(() => correspondingSideRatioFromAreaRatio(rational(2), rational(3)));
assert.equal(getTheoremDefinition("SIMILAR_TRIANGLES_AREA_SCALE").family, "SIMILARITY");
assert.equal(GEO_GAP_REMEDIATION_WAVE10_SOURCE_EVIDENCE.length, 6);
assert.equal(GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES.length, 5);

const usedSources = new Set<string>();
for (const prototype of GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES) {
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  for (const seed of seeds) {
    const q = prototype.generate(seed);
    stems.add(q.stem); fingerprints.add(q.canonicalGeometryFingerprint);
    assert.equal(q.validation.ok, true, `${q.temporaryPrototypeId}: ${q.validation.errors.join(", ")}`);
    assert.equal(q.options.length, 4); assert.equal(new Set(q.options).size, 4);
    assert.equal(q.answer, q.options[q.correctIndex]);
    assert.equal(q.optionAnalysis.filter((item) => item.correct).length, 1);
    assert.equal(q.minimalityProof.passed, true); assert.equal(q.independentVerifierResult.passed, true);
    assert.equal(q.permanentQlId, null); assert.equal(q.lifecycle.stage, "DISCOVERY");
    assert.equal(q.lifecycle.questionStudioDiscoverable, false); assert.equal(q.lifecycle.questionBankWritable, false);
    for (const sourceId of q.sourceEvidenceIds) { usedSources.add(sourceId); assert.ok(GEO_GAP_REMEDIATION_WAVE10_SOURCE_EVIDENCE.some((source) => source.id === sourceId)); }
    for (const wrong of q.optionAnalysis.filter((item) => !item.correct)) { assert.ok(wrong.misconceptionId); assert.ok(wrong.rationale.length > 35); }
    if (q.diagramDisposition === "REQUIRED_STEM_DIAGRAM") { assert.ok(q.stemSvg?.includes("<svg")); assert.ok(q.diagramFingerprint); }
    else { assert.equal(q.stemSvg, undefined); assert.equal(q.diagramFingerprint, null); }
  }
  assert.equal(stems.size, 3, `${prototype.temporaryPrototypeId} review stems must vary`);
  assert.equal(fingerprints.size, 3, `${prototype.temporaryPrototypeId} fingerprints must vary`);
}
assert.deepEqual([...usedSources].sort(), GEO_GAP_REMEDIATION_WAVE10_SOURCE_EVIDENCE.map((s) => s.id).sort());

assert.equal(GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES[0].generate("wave10-a").answer, "SAS");
assert.equal(GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES[1].generate("wave10-a").answer, "AAA");
assert.equal(GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES[1].generate("wave10-b").answer, "SSA");
assert.equal(GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES[2].generate("wave10-a").answer, "Yes, by SSS");
assert.equal(GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES[3].generate("wave10-a").answer, "SSS similarity");
assert.equal(GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES[4].generate("wave10-a").answer, "11:15");
console.log("Geometry Wave 10 PASS: congruence/similarity closure with exact area-scale inference, exact source ownership and retained discovery locks.");
