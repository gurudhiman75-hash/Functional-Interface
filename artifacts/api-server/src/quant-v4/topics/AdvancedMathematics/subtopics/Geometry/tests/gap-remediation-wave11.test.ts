import assert from "node:assert/strict";
import { GEO_GAP_REMEDIATION_WAVE11_PROTOTYPES } from "../source-remediation/wave11-prototypes";
import { GEO_GAP_REMEDIATION_WAVE11_SOURCE_EVIDENCE } from "../source-remediation/wave11-source-evidence";
const seeds=["wave11-a","wave11-b","wave11-c"] as const;
assert.equal(GEO_GAP_REMEDIATION_WAVE11_SOURCE_EVIDENCE.length,3);assert.equal(GEO_GAP_REMEDIATION_WAVE11_PROTOTYPES.length,3);
const used=new Set<string>();
for(const p of GEO_GAP_REMEDIATION_WAVE11_PROTOTYPES){const stems=new Set<string>();const fps=new Set<string>();for(const seed of seeds){const q=p.generate(seed);stems.add(q.stem);fps.add(q.canonicalGeometryFingerprint);assert.equal(q.validation.ok,true,`${q.temporaryPrototypeId}: ${q.validation.errors.join(",")}`);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.answer,q.options[q.correctIndex]);assert.equal(q.minimalityProof.passed,true);assert.equal(q.independentVerifierResult.passed,true);assert.equal(q.diagramDisposition,"NO_DIAGRAM");assert.equal(q.diagramFingerprint,null);assert.equal(q.lifecycle.questionStudioDiscoverable,false);for(const id of q.sourceEvidenceIds){used.add(id);assert.ok(GEO_GAP_REMEDIATION_WAVE11_SOURCE_EVIDENCE.some(s=>s.id===id));}for(const w of q.optionAnalysis.filter(x=>!x.correct)){assert.ok(w.misconceptionId);assert.ok(w.rationale.length>35);}}assert.equal(stems.size,3);assert.equal(fps.size,3);}
assert.deepEqual([...used].sort(),GEO_GAP_REMEDIATION_WAVE11_SOURCE_EVIDENCE.map(s=>s.id).sort());
assert.equal(GEO_GAP_REMEDIATION_WAVE11_PROTOTYPES[0].generate("wave11-a").answer,"Circumcentre");
assert.equal(GEO_GAP_REMEDIATION_WAVE11_PROTOTYPES[1].generate("wave11-a").answer,"Both pairs of opposite sides are parallel and equal.");
assert.equal(GEO_GAP_REMEDIATION_WAVE11_PROTOTYPES[2].generate("wave11-a").answer,"They are equal, bisect each other, and are perpendicular.");
console.log("Geometry Wave 11 PASS: right-triangle centre and quadrilateral property/classification closure.");
