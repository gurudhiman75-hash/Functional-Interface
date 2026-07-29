import assert from "node:assert/strict";
import {
  generateNumCp004Wave01Sweep,
  NUM_CP004_WAVE01_PROTOTYPE_IDS,
} from "./runtime-proven";

const packages = generateNumCp004Wave01Sweep(60);
const byPrototype = new Map<string, typeof packages>();

for (const prototypeId of NUM_CP004_WAVE01_PROTOTYPE_IDS) {
  byPrototype.set(
    prototypeId,
    packages.filter((pkg) => pkg.temporaryPrototypeId === prototypeId),
  );
}

const surfaceCounts: Record<string, number> = {};
const framingCounts: Record<string, number> = {};
const fingerprintCounts: Record<string, number> = {};
const sourceCounts = new Map<string, number>();

for (const [prototypeId, rows] of byPrototype) {
  assert.equal(rows.length, 60);
  const surfaces = new Set<string>();
  const framings = new Set<string>();
  const fingerprints = new Set<string>();

  for (const pkg of rows) {
    const learnerSurface = `${pkg.stem}\n${pkg.options.map((option) => option.value).sort().join("|")}`
      .replace(/\s+/g, " ")
      .trim();
    surfaces.add(learnerSurface);
    framings.add(pkg.stem.replace(/-?\d+(?:\^\d+)?/g, "#").replace(/\s+/g, " ").trim());
    fingerprints.add(pkg.mathematicalFingerprint);

    assert.ok(!pkg.stem.includes("NUM-CP004"), "Temporary IDs must not leak into learner stems");
    assert.ok(!pkg.explanation.finalAnswer.includes("NUM-CP004"), "Temporary IDs must not leak into learner explanations");
    assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(pkg.canonicalAnswer, pkg.options[pkg.correctIndex]?.value);
    assert.ok(pkg.sourceAncestry.every((source) => source.includes(":")));
    for (const source of pkg.sourceAncestry) {
      sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
    }
  }

  surfaceCounts[prototypeId] = surfaces.size;
  framingCounts[prototypeId] = framings.size;
  fingerprintCounts[prototypeId] = fingerprints.size;

  assert.ok(surfaces.size >= 8, `${prototypeId} has insufficient learner-surface variation`);
  assert.ok(fingerprints.size >= 3, `${prototypeId} has insufficient mathematical variation`);
}

assert.equal(surfaceCounts["NUM-CP004-PROT-008"], 60);
assert.equal(fingerprintCounts["NUM-CP004-PROT-008"], 60);
assert.ok((sourceCounts.get("UPLOAD:SSC-MATHEMATICS-PREVIOUS-YEAR-NUMBER-SYSTEM") ?? 0) > 0);
assert.ok((sourceCounts.get("UPLOAD:DISHA-SSC-MATHEMATICS-GUIDE") ?? 0) > 0);
assert.ok((sourceCounts.get("DESIGN:NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY") ?? 0) > 0);

const lifecycleViolations = packages.filter((pkg) =>
  pkg.permanentQlId !== null
  || pkg.lifecycle.active
  || pkg.lifecycle.questionStudioDiscoverable
  || pkg.lifecycle.questionBankWritable
  || pkg.lifecycle.testEligible
  || pkg.lifecycle.publiclyPublishable
);
assert.equal(lifecycleViolations.length, 0);

const impossibleCanonicalClass = packages.filter((pkg) =>
  pkg.temporaryPrototypeId === "NUM-CP004-PROT-008"
  && pkg.canonicalAnswer === "PAIRWISE_BUT_NOT_COLLECTIVELY_COPRIME"
);
assert.equal(impossibleCanonicalClass.length, 0);

console.log(JSON.stringify({
  status: "PASS_NUM_CP004_WAVE01_STRUCTURAL_AUDIT",
  generatedPackages: packages.length,
  surfaceCounts,
  framingCounts,
  fingerprintCounts,
  sourceFamilies: sourceCounts.size,
  lifecycleViolations: lifecycleViolations.length,
  permanentQlCount: 0,
}, null, 2));
