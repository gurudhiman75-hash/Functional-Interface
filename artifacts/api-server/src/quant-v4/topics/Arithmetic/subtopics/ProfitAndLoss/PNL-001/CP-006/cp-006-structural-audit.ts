import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(root, name), "utf8")) as T;
}

type Registry = Readonly<{
  entryCount: number;
  entries: Record<string, Readonly<{ requiredVariables: readonly string[] }>>;
}>;

type LanguageLibrary = Readonly<{
  entryCount: number;
  entries: Record<string, Readonly<{ template: string }>>;
}>;

type ExplanationLibrary = Readonly<{
  entryCount: number;
  entries: Record<string, Readonly<{ en: string; hi: string; pa: string }>>;
}>;

function placeholders(template: string): readonly string[] {
  return [...template.matchAll(/\{([A-Za-z][A-Za-z0-9]*)\}/g)]
    .map((match) => match[1])
    .sort();
}

const registry = readJson<Registry>("task-registry.library.json");
const english = readJson<LanguageLibrary>("question-language.en.json");
const hindi = readJson<LanguageLibrary>("question-language.hi.json");
const punjabi = readJson<LanguageLibrary>("question-language.pa.json");
const explanations = readJson<ExplanationLibrary>("explanation-patterns.multilingual.json");

const expectedIds = Array.from({ length: 37 }, (_, index) => `PNL-QL-${String(150 + index).padStart(3, "0")}`);
const registryIds = Object.keys(registry.entries);
const englishIds = Object.keys(english.entries);
const hindiIds = Object.keys(hindi.entries);
const punjabiIds = Object.keys(punjabi.entries);
const explanationIds = Object.keys(explanations.entries);

assert.deepEqual(registryIds, expectedIds, "Registry IDs must be contiguous from PNL-QL-150 through PNL-QL-186.");
assert.deepEqual(englishIds, expectedIds, "English IDs must match the registry.");
assert.deepEqual(hindiIds, expectedIds, "Hindi IDs must match the registry.");
assert.deepEqual(punjabiIds, expectedIds, "Punjabi IDs must match the registry.");
assert.deepEqual(explanationIds, expectedIds, "Explanation IDs must match the registry.");

assert.equal(registry.entryCount, expectedIds.length);
assert.equal(english.entryCount, expectedIds.length);
assert.equal(hindi.entryCount, expectedIds.length);
assert.equal(punjabi.entryCount, expectedIds.length);
assert.equal(explanations.entryCount, expectedIds.length);

for (const qlId of expectedIds) {
  const required = [...registry.entries[qlId].requiredVariables].sort();
  const enPlaceholders = placeholders(english.entries[qlId].template);
  const hiPlaceholders = placeholders(hindi.entries[qlId].template);
  const paPlaceholders = placeholders(punjabi.entries[qlId].template);

  assert.deepEqual(enPlaceholders, required, `${qlId}: English placeholders must equal required variables.`);
  assert.deepEqual(hiPlaceholders, required, `${qlId}: Hindi placeholders must equal required variables.`);
  assert.deepEqual(paPlaceholders, required, `${qlId}: Punjabi placeholders must equal required variables.`);

  const explanation = explanations.entries[qlId];
  assert.ok(explanation.en.trim().length >= 30, `${qlId}: English explanation is too shallow.`);
  assert.ok(explanation.hi.trim().length >= 20, `${qlId}: Hindi explanation is too shallow.`);
  assert.ok(explanation.pa.trim().length >= 20, `${qlId}: Punjabi explanation is too shallow.`);
}
