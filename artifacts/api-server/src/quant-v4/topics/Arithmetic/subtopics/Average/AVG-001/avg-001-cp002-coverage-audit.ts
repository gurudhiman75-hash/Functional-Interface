import { strict as assert } from "node:assert";
import questionLanguage from "./question-language.cp002.en.json";
import registry from "./task-registry.cp002.library.json";
import localization from "./localization-contract.cp002.library.json";
import coverage from "./coverage-targets.cp002.library.json";
import distribution from "./distribution-targets.cp002.library.json";

type Entry = {
  qlId: string;
  solveMode: string;
  difficulty: string;
  displayPolicy: string;
  requiredVariables: string[];
  template: string;
};
type RegistryEntry = Omit<Entry, "template">;
type LocalizationEntry = {
  qlId: string;
  requiredVariables: string[];
};

const entries = questionLanguage.entries as Entry[];
const registryEntries = registry.entries as RegistryEntry[];
const localizationEntries = localization.entries as LocalizationEntry[];
const ids = entries.map((entry) => entry.qlId);
const expectedIds = Array.from(
  { length: 50 },
  (_, index) => `AVG-QL-${String(index + 73).padStart(3, "0")}`,
);

assert.equal(entries.length, 50);
assert.deepEqual(ids, expectedIds);
assert.equal(new Set(ids).size, 50);
assert.equal(registryEntries.length, 50);
assert.equal(localizationEntries.length, 50);
assert.equal(coverage.activeQlCount, 50);
assert.equal(
  Object.values(coverage.solveModeTargets).reduce(
    (sum, value) => sum + Number(value),
    0,
  ),
  50,
);
assert.equal(
  Object.values(distribution.difficulty).reduce(
    (sum, value) => sum + Number(value),
    0,
  ),
  50,
);

const registryById = new Map<string, RegistryEntry>(
  registryEntries.map((entry) => [entry.qlId, entry]),
);
const localizationById = new Map<string, LocalizationEntry>(
  localizationEntries.map((entry) => [entry.qlId, entry]),
);
const normalizedTemplates = new Set<string>();

for (const entry of entries) {
  const registryEntry = registryById.get(entry.qlId);
  const localizationEntry = localizationById.get(entry.qlId);
  if (!registryEntry) {
    throw new Error(`${entry.qlId}: missing registry entry`);
  }
  if (!localizationEntry) {
    throw new Error(`${entry.qlId}: missing localization contract`);
  }

  assert.equal(registryEntry.solveMode, entry.solveMode);
  assert.equal(registryEntry.difficulty, entry.difficulty);
  assert.equal(registryEntry.displayPolicy, entry.displayPolicy);
  assert.deepEqual(
    [...registryEntry.requiredVariables].sort(),
    [...entry.requiredVariables].sort(),
  );
  assert.deepEqual(
    [...localizationEntry.requiredVariables].sort(),
    [...entry.requiredVariables].sort(),
  );

  const placeholders = Array.from(
    entry.template.matchAll(/\{([A-Za-z0-9_]+)\}/g),
    (match) => match[1]!,
  ).sort();
  assert.deepEqual(
    [...new Set(placeholders)].sort(),
    [...entry.requiredVariables].sort(),
    `${entry.qlId}: placeholder contract mismatch`,
  );

  const normalized = entry.template
    .toLowerCase()
    .replace(/\{[a-z0-9_]+\}/g, "{value}")
    .replace(/\s+/g, " ")
    .trim();
  assert(
    !normalizedTemplates.has(normalized),
    `${entry.qlId}: duplicate normalized template`,
  );
  normalizedTemplates.add(normalized);
}

const modeCounts = Object.fromEntries(
  Object.keys(coverage.solveModeTargets).map((mode) => [
    mode,
    entries.filter((entry) => entry.solveMode === mode).length,
  ]),
);
assert.deepEqual(modeCounts, coverage.solveModeTargets);

const difficultyCounts = Object.fromEntries(
  Object.keys(distribution.difficulty).map((difficulty) => [
    difficulty,
    entries.filter((entry) => entry.difficulty === difficulty).length,
  ]),
);
assert.deepEqual(difficultyCounts, distribution.difficulty);

console.log(
  JSON.stringify(
    {
      qlCount: entries.length,
      registryCount: registryEntries.length,
      localizationContractCount: localizationEntries.length,
      normalizedDuplicateCount: 0,
      modeCounts,
      difficultyCounts,
      status: "PASS",
    },
    null,
    2,
  ),
);
