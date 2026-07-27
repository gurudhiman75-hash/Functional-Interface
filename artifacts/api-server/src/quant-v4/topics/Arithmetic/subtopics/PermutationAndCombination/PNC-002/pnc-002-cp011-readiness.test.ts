import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import contractMatrix from "./cp011-provisional-contract-matrix.json";
import {
  auditCp011GroupingCoverage,
} from "./foundation/coverage-auditor-cp011-grouping";
import {
  getCp011GroupingEntries,
  runPnc002Cp011GroupingPipeline,
} from "./foundation/cp011-grouping-runtime";
import {
  auditCp011DistributionWave1Coverage,
  getCp011DistributionWave1Entries,
  runPnc002Cp011DistributionWave1Pipeline,
} from "./foundation/cp011-distribution-wave1-reviewed-runtime";
import {
  auditCp011DistributionWave2Coverage,
  getCp011DistributionWave2Entries,
  runPnc002Cp011DistributionWave2Pipeline,
} from "./foundation/cp011-distribution-wave2-runtime";
import {
  auditCp011InverseCoverage,
  getCp011InverseEntries,
  runPnc002Cp011InversePipeline,
} from "./foundation/cp011-inverse-wave-runtime";

type ReadyEntry = {
  qlId: string;
  difficulty: string;
  solveMode: string;
  template: string;
  run: () => {
    questionLanguageId: string;
    canonicalProblemId: string;
    validation: { valid: boolean; checks: { name: string; passed: boolean; message: string }[] };
    publiclyPublishable: boolean;
    traceability: Record<string, unknown>;
  };
};

const readyEntries: ReadyEntry[] = [
  ...getCp011GroupingEntries().map((entry) => ({
    ...entry,
    run: () => runPnc002Cp011GroupingPipeline({ questionLanguageId: entry.qlId, seed: `cp011-readiness:${entry.qlId}` }),
  })),
  ...getCp011DistributionWave1Entries().map((entry) => ({
    ...entry,
    run: () => runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `cp011-readiness:${entry.qlId}` }),
  })),
  ...getCp011DistributionWave2Entries().map((entry) => ({
    ...entry,
    run: () => runPnc002Cp011DistributionWave2Pipeline({ questionLanguageId: entry.qlId, seed: `cp011-readiness:${entry.qlId}` }),
  })),
  ...getCp011InverseEntries().map((entry) => ({
    ...entry,
    run: () => runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed: `cp011-readiness:${entry.qlId}` }),
  })),
];

const expectedIds = Array.from({ length: 33 }, (_, index) => `PNC-QL-${String(index + 209).padStart(3, "0")}`);
const actualIds = readyEntries.map((entry) => entry.qlId);
assert.equal(readyEntries.length, 33);
assert.deepEqual(actualIds, expectedIds);
assert.equal(new Set(actualIds).size, 33);
assert.equal(new Set(readyEntries.map((entry) => entry.solveMode)).size, 30);
assert.deepEqual(
  Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, readyEntries.filter((entry) => entry.difficulty === difficulty).length])),
  { Easy: 3, Medium: 17, Hard: 13 },
);

const normalizedTemplates = new Map<string, string[]>();
for (const entry of readyEntries) {
  const normalized = entry.template.toLowerCase().replace(/\{[a-z0-9_]+\}/g, "{value}").replace(/\s+/g, " ").trim();
  normalizedTemplates.set(normalized, [...(normalizedTemplates.get(normalized) ?? []), entry.qlId]);
}
assert.deepEqual([...normalizedTemplates.values()].filter((ids) => ids.length > 1), []);

assert.equal(contractMatrix.status, "SATURATED_CURRENT_ENGLISH_OWNERSHIP_RUNTIME_PROOF");
assert.equal(contractMatrix.permanentQlIdsAllocated, 33);
assert.deepEqual(contractMatrix.allocatedQlRange, ["PNC-QL-209", "PNC-QL-241"]);
assert.equal(contractMatrix.nextAvailableQlId, "PNC-QL-242");
assert.equal(contractMatrix.candidates.length, 33);
assert.deepEqual(contractMatrix.candidates.map((candidate) => candidate.qlId), expectedIds);
assert.equal(contractMatrix.candidates.every((candidate) => candidate.admissionStatus.startsWith("ADMITTED")), true);
assert.equal(contractMatrix.candidates.every((candidate) => candidate.proofStatus.includes("RUNTIME_PROOF")), true);

const audits = {
  grouping: auditCp011GroupingCoverage(),
  distinctDistribution: auditCp011DistributionWave1Coverage(),
  identicalDistribution: auditCp011DistributionWave2Coverage(),
  inverse: auditCp011InverseCoverage(),
};
assert.equal(Object.values(audits).every((audit) => audit.passed), true, JSON.stringify(audits, null, 2));

const invalidPackages: string[] = [];
for (const entry of readyEntries) {
  const generated = entry.run();
  if (generated.questionLanguageId !== entry.qlId) invalidPackages.push(`${entry.qlId}: generated QL mismatch`);
  if (generated.canonicalProblemId !== "PNC-CP-011") invalidPackages.push(`${entry.qlId}: CP mismatch`);
  if (!generated.validation.valid) invalidPackages.push(`${entry.qlId}: ${generated.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
  if (generated.publiclyPublishable !== false) invalidPackages.push(`${entry.qlId}: unexpectedly public`);
  if (generated.traceability.formulaRendering !== "LATEX_MATHJAX") invalidPackages.push(`${entry.qlId}: formula rendering contract missing`);
}
assert.deepEqual(invalidPackages, []);

const report = {
  packageId: "PNC-002",
  canonicalProblemId: "PNC-CP-011",
  status: "SATURATED_CURRENT_ENGLISH_OWNERSHIP_RUNTIME_PROOF",
  qlRange: ["PNC-QL-209", "PNC-QL-241"],
  qlCount: readyEntries.length,
  solveModeCount: new Set(readyEntries.map((entry) => entry.solveMode)).size,
  difficulty: { Easy: 3, Medium: 17, Hard: 13 },
  nextAvailableQlId: "PNC-QL-242",
  matrixCandidateCount: contractMatrix.candidates.length,
  allCandidatesAdmitted: true,
  crossWaveTemplateDuplicates: 0,
  invalidPackages: invalidPackages.length,
  audits,
  releaseSafety: {
    language: "en",
    sharedComposerIntegrated: false,
    questionStudioRegistered: false,
    questionBankWritePathEnabled: false,
    publiclyPublishable: false,
  },
};
const outputDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-cp011-readiness");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, "pnc-002-cp011-readiness-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...report, result: "PASS" }, null, 2));
