import assert from "node:assert/strict";
import {
  generateNumCp004Wave02Sweep,
  NUM_CP004_WAVE02_PROTOTYPE_IDS,
} from "./runtime-proven";

const packages = generateNumCp004Wave02Sweep(60);
const surfaceCounts: Record<string, number> = {};
const fingerprintCounts: Record<string, number> = {};
const sourceCounts = new Map<string, number>();

for (const prototypeId of NUM_CP004_WAVE02_PROTOTYPE_IDS) {
  const rows = packages.filter((pkg) => pkg.temporaryPrototypeId === prototypeId);
  assert.equal(rows.length, 60);
  const surfaces = new Set<string>();
  const fingerprints = new Set<string>();

  for (const pkg of rows) {
    surfaces.add(`${pkg.stem}\n${pkg.options.map((option) => option.value).sort().join("|")}`.replace(/\s+/g, " ").trim());
    fingerprints.add(pkg.mathematicalFingerprint);
    assert.ok(!pkg.stem.includes("NUM-CP004"));
    assert.ok(!pkg.explanation.finalAnswer.includes("NUM-CP004"));
    assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
    assert.ok(pkg.sourceAncestry.every((source) => source.includes(":")));
    for (const source of pkg.sourceAncestry) sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
  }

  surfaceCounts[prototypeId] = surfaces.size;
  fingerprintCounts[prototypeId] = fingerprints.size;
  assert.ok(surfaces.size >= 20, `${prototypeId} has insufficient learner-surface variation`);
  assert.ok(fingerprints.size >= 20, `${prototypeId} has insufficient mathematical variation`);
}

const lifecycleViolations = packages.filter((pkg) =>
  pkg.permanentQlId !== null
  || pkg.lifecycle.active
  || pkg.lifecycle.questionStudioDiscoverable
  || pkg.lifecycle.questionBankWritable
  || pkg.lifecycle.testEligible
  || pkg.lifecycle.publiclyPublishable
);
assert.equal(lifecycleViolations.length, 0);

const pairUniquenessViolations = packages.filter((pkg) =>
  (pkg.temporaryPrototypeId === "NUM-CP004-PROT-012" || pkg.temporaryPrototypeId === "NUM-CP004-PROT-013")
  && pkg.hiddenState.uniquenessCount !== 1
);
assert.equal(pairUniquenessViolations.length, 0);

const tripleUniquenessViolations = packages.filter((pkg) =>
  pkg.temporaryPrototypeId === "NUM-CP004-PROT-014" && pkg.hiddenState.uniquenessCount !== 1
);
assert.equal(tripleUniquenessViolations.length, 0);

console.log(JSON.stringify({
  status: "PASS_NUM_CP004_WAVE02_STRUCTURAL_AUDIT",
  generatedPackages: packages.length,
  surfaceCounts,
  fingerprintCounts,
  sourceFamilies: sourceCounts.size,
  lifecycleViolations: lifecycleViolations.length,
  pairUniquenessViolations: pairUniquenessViolations.length,
  tripleUniquenessViolations: tripleUniquenessViolations.length,
  permanentQlCount: 0,
}, null, 2));
