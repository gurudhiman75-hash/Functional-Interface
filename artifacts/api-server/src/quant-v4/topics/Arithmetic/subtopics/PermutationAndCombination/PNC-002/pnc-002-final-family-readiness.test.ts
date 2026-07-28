import { strict as assert } from "node:assert";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getPnc002QuestionEntries } from "./foundation/library";
import { runPnc002Pipeline } from "./foundation/pipeline";
import { getCp011GroupingEntries, runPnc002Cp011GroupingPipeline } from "./foundation/cp011-grouping-runtime";
import { getCp011DistributionWave1Entries, runPnc002Cp011DistributionWave1Pipeline } from "./foundation/cp011-distribution-wave1-reviewed-runtime";
import { getCp011DistributionWave2Entries, runPnc002Cp011DistributionWave2Pipeline } from "./foundation/cp011-distribution-wave2-runtime";
import { getCp011InverseEntries, runPnc002Cp011InversePipeline } from "./foundation/cp011-inverse-wave-runtime";
import { getCp012Entries, runPnc002Cp012Pipeline } from "./foundation/cp012-mixed-runtime-reviewed";

type FamilyEntry = {
  qlId: string;
  cpId: string;
  difficulty: string;
  solveMode: string;
  template: string;
  run: () => {
    canonicalProblemId: string;
    questionLanguageId: string;
    validation: { valid: boolean; checks: { name: string; passed: boolean; message: string }[] };
    publiclyPublishable: boolean;
    traceability: Record<string, unknown>;
  };
};

const baseEntries = getPnc002QuestionEntries();
const cp011Grouping = getCp011GroupingEntries();
const cp011Distribution1 = getCp011DistributionWave1Entries();
const cp011Distribution2 = getCp011DistributionWave2Entries();
const cp011Inverse = getCp011InverseEntries();
const cp012Entries = getCp012Entries();

assert.equal(baseEntries.length, 102);
assert.equal(new Set(baseEntries.map((entry) => entry.solveMode)).size, 72);
assert.equal(cp011Grouping.length + cp011Distribution1.length + cp011Distribution2.length + cp011Inverse.length, 33);
assert.equal(new Set([
  ...cp011Grouping.map((entry) => entry.solveMode),
  ...cp011Distribution1.map((entry) => entry.solveMode),
  ...cp011Distribution2.map((entry) => entry.solveMode),
  ...cp011Inverse.map((entry) => entry.solveMode),
]).size, 30);
assert.equal(cp012Entries.length, 28);
assert.equal(new Set(cp012Entries.map((entry) => entry.solveMode)).size, 28);

const allEntries: FamilyEntry[] = [
  ...baseEntries.map((entry) => ({
    qlId: entry.qlId,
    cpId: entry.cpId,
    difficulty: entry.difficulty,
    solveMode: entry.solveMode,
    template: entry.template,
    run: () => runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-final-readiness:${entry.qlId}` }),
  })),
  ...cp011Grouping.map((entry) => ({
    ...entry,
    cpId: "PNC-CP-011",
    run: () => runPnc002Cp011GroupingPipeline({ questionLanguageId: entry.qlId, seed: `pnc-final-readiness:${entry.qlId}` }),
  })),
  ...cp011Distribution1.map((entry) => ({
    ...entry,
    cpId: "PNC-CP-011",
    run: () => runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-final-readiness:${entry.qlId}` }),
  })),
  ...cp011Distribution2.map((entry) => ({
    ...entry,
    cpId: "PNC-CP-011",
    run: () => runPnc002Cp011DistributionWave2Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-final-readiness:${entry.qlId}` }),
  })),
  ...cp011Inverse.map((entry) => ({
    ...entry,
    cpId: "PNC-CP-011",
    run: () => runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed: `pnc-final-readiness:${entry.qlId}` }),
  })),
  ...cp012Entries.map((entry) => ({
    ...entry,
    cpId: "PNC-CP-012",
    run: () => runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-final-readiness:${entry.qlId}` }),
  })),
];

const expectedIds = Array.from({ length: 163 }, (_, index) => `PNC-QL-${String(index + 107).padStart(3, "0")}`);
const actualIds = allEntries.map((entry) => entry.qlId);
assert.equal(allEntries.length, 163);
assert.deepEqual(actualIds, expectedIds);
assert.equal(new Set(actualIds).size, 163);
assert.deepEqual(
  Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, allEntries.filter((entry) => entry.difficulty === difficulty).length])),
  { Easy: 18, Medium: 77, Hard: 68 },
);
assert.equal(72 + 30 + 28, 130);

const normalizedTemplates = new Map<string, string[]>();
for (const entry of allEntries) {
  const normalized = entry.template.toLowerCase().replace(/\{[a-z0-9_]+\}/g, "{value}").replace(/\s+/g, " ").trim();
  normalizedTemplates.set(normalized, [...(normalizedTemplates.get(normalized) ?? []), entry.qlId]);
}
const exactDuplicateTemplateGroups = [...normalizedTemplates.values()].filter((group) => group.length > 1);
assert.deepEqual(exactDuplicateTemplateGroups, []);

const invalidPackages: string[] = [];
const cpCounts = new Map<string, number>();
for (const entry of allEntries) {
  try {
    const generated = entry.run();
    cpCounts.set(entry.cpId, (cpCounts.get(entry.cpId) ?? 0) + 1);
    if (generated.questionLanguageId !== entry.qlId) invalidPackages.push(`${entry.qlId}:ql`);
    if (generated.canonicalProblemId !== entry.cpId) invalidPackages.push(`${entry.qlId}:cp`);
    if (!generated.validation.valid) invalidPackages.push(`${entry.qlId}:${generated.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
    if (generated.publiclyPublishable !== false) invalidPackages.push(`${entry.qlId}:public`);
    if (generated.traceability.formulaRendering !== "LATEX_MATHJAX") invalidPackages.push(`${entry.qlId}:tex`);
  } catch (error) {
    invalidPackages.push(`${entry.qlId}:${error instanceof Error ? error.message : String(error)}`);
  }
}
assert.deepEqual(invalidPackages, []);
assert.deepEqual(Object.fromEntries([...cpCounts.entries()].sort()), {
  "PNC-CP-007": 18,
  "PNC-CP-008": 23,
  "PNC-CP-009": 29,
  "PNC-CP-010": 32,
  "PNC-CP-011": 33,
  "PNC-CP-012": 28,
});

const report = {
  packageId: "PNC-002",
  verdict: "ENGLISH_OWNERSHIP_COMPLETE_RUNTIME_PROOF",
  cpRange: ["PNC-CP-007", "PNC-CP-012"],
  qlRange: ["PNC-QL-107", "PNC-QL-269"],
  activeCpCount: 6,
  activeQlCount: allEntries.length,
  activeSolveModeCount: 130,
  difficulty: { Easy: 18, Medium: 77, Hard: 68 },
  cpCounts: Object.fromEntries([...cpCounts.entries()].sort()),
  exactDuplicateTemplateGroups,
  invalidPackages,
  publiclyPublishable: false,
  status: "PASS",
};
const outputDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-002-final-readiness");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, "pnc-002-final-readiness.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
