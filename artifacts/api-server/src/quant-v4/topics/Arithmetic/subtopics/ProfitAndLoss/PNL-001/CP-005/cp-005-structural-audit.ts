import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const readJson = (name: string) => JSON.parse(readFileSync(join(here, name), "utf8"));

const registry = readJson("task-registry.library.json");
const english = readJson("question-language.en.json");
const hindi = readJson("question-language.hi.json");
const punjabi = readJson("question-language.pa.json");

const registryIds = Object.keys(registry.entries);
const expectedIds = Array.from({ length: 29 }, (_, index) => `PNL-QL-${String(121 + index).padStart(3, "0")}`);
assert.deepEqual(registryIds, expectedIds);
assert.deepEqual(Object.keys(english.entries), expectedIds);
assert.deepEqual(Object.keys(hindi.entries), expectedIds);
assert.deepEqual(Object.keys(punjabi.entries), expectedIds);
assert.equal(registry.entryCount, 29);
assert.equal(english.entryCount, 29);
assert.equal(hindi.entryCount, 29);
assert.equal(punjabi.entryCount, 29);

const placeholders = (template: string) =>
  [...new Set([...template.matchAll(/\{([A-Za-z0-9]+)\}/g)].map((match) => match[1]))].sort();

for (const id of expectedIds) {
  const required = [...registry.entries[id].requiredVariables].sort();
  for (const [language, library] of [
    ["en", english],
    ["hi", hindi],
    ["pa", punjabi],
  ] as const) {
    const actual = placeholders(library.entries[id].template);
    assert.deepEqual(actual, required, `${id} ${language} placeholder mismatch`);
  }
}
