import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadEditorialLibrary,
  type QuestionStemBlock,
  type StructuredEditorialEntry,
} from "./foundation";

const root = dirname(fileURLToPath(import.meta.url));

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

type RegistryEntry = Readonly<{
  requiredVariables: readonly string[];
  representation?: string;
  difficulty: "Easy" | "Medium" | "Hard";
}>;

type Registry = Readonly<{
  entries: Readonly<Record<string, RegistryEntry>>;
  entryCount: number;
}>;

const SOURCE_ENCAPSULATED_VARIABLES: Readonly<Record<string, readonly string[]>> = {
  "PNL-QL-145": ["firstScheme", "secondScheme"],
};

function collectStrings(value: unknown, output: string[] = []): string[] {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, output));
  return output;
}

function addPlaceholders(text: string | undefined, variables: Set<string>): void {
  if (!text) return;
  for (const match of text.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)) variables.add(match[1]);
}

function collectStemVariables(
  qlId: string,
  blocks: readonly QuestionStemBlock[],
  prompt: string,
): readonly string[] {
  const variables = new Set<string>();
  addPlaceholders(prompt, variables);

  for (const block of blocks) {
    switch (block.type) {
      case "paragraph":
        addPlaceholders(block.content, variables);
        break;
      case "table":
        addPlaceholders(block.caption, variables);
        block.columns.forEach((column) => addPlaceholders(column, variables));
        block.rows?.forEach((row) => row.forEach((cell) => addPlaceholders(cell, variables)));
        if (block.rowSource) variables.add(block.rowSource);
        break;
      case "caselet":
        addPlaceholders(block.title, variables);
        block.paragraphs?.forEach((paragraph) => addPlaceholders(paragraph, variables));
        if (block.paragraphSource) variables.add(block.paragraphSource);
        break;
      case "statements":
        addPlaceholders(block.lead, variables);
        block.statements.forEach((statement) => addPlaceholders(statement, variables));
        break;
      case "data_sufficiency":
        addPlaceholders(block.question, variables);
        block.statements.forEach((statement) => addPlaceholders(statement, variables));
        break;
      case "equation":
        // LaTeX grouping such as m_{known} is mathematical notation, not a runtime variable.
        break;
    }
  }

  for (const variable of SOURCE_ENCAPSULATED_VARIABLES[qlId] ?? []) variables.add(variable);
  return [...variables].sort();
}

function textWordCount(entry: StructuredEditorialEntry): number {
  const text = collectStrings(entry.explanation).join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

function firstNarrativeText(entry: StructuredEditorialEntry): string {
  for (const block of entry.stem.blocks) {
    if (block.type === "paragraph") return block.content;
    if (block.type === "caselet" && block.paragraphs?.length) return block.paragraphs[0];
  }
  return entry.stem.prompt;
}

const packages = [
  { cp: "CP-004", start: 95, count: 26 },
  { cp: "CP-005", start: 121, count: 29 },
  { cp: "CP-006", start: 150, count: 37 },
] as const;

const allEntries = new Map<string, StructuredEditorialEntry>();
const legacyDifficultyDifferences: string[] = [];
const contextFamilies: string[] = [];
let genericOpeningCount = 0;
let hardCount = 0;

for (const item of packages) {
  const cpRoot = join(root, item.cp);
  const editorial = loadEditorialLibrary(join(cpRoot, "editorial-content.en.json"));
  const registry = readJson<Registry>(join(cpRoot, "task-registry.library.json"));
  const expectedIds = Array.from(
    { length: item.count },
    (_, index) => `PNL-QL-${String(item.start + index).padStart(3, "0")}`,
  );

  assert.equal(editorial.entryCount, item.count, `${item.cp}: editorial count mismatch.`);
  assert.deepEqual(Object.keys(editorial.entries), expectedIds, `${item.cp}: editorial IDs must be contiguous.`);
  assert.deepEqual(Object.keys(registry.entries), expectedIds, `${item.cp}: registry IDs must match editorial IDs.`);

  for (const qlId of expectedIds) {
    const entry = editorial.entries[qlId];
    const registryEntry = registry.entries[qlId];
    assert.ok(!allEntries.has(qlId), `${qlId}: duplicate editorial ID.`);
    allEntries.set(qlId, entry);

    const visibleVariables = collectStemVariables(qlId, entry.stem.blocks, entry.stem.prompt);
    const requiredVariables = [...registryEntry.requiredVariables].sort();
    assert.deepEqual(visibleVariables, requiredVariables, `${qlId}: structured stem variables must match the registry.`);

    const blockTypes = new Set(entry.stem.blocks.map((block) => block.type));
    switch (registryEntry.representation) {
      case "TABLE":
        assert.ok(blockTypes.has("table"), `${qlId}: TABLE QL must contain a real table block.`);
        break;
      case "CASELET":
        assert.ok(blockTypes.has("caselet"), `${qlId}: CASELET QL must contain a caselet block.`);
        break;
      case "STATEMENT":
        assert.ok(blockTypes.has("statements"), `${qlId}: STATEMENT QL must contain a statements block.`);
        break;
      case "DATA_SUFFICIENCY":
        assert.ok(blockTypes.has("data_sufficiency"), `${qlId}: DATA_SUFFICIENCY QL must contain a data-sufficiency block.`);
        break;
      case "ALGEBRAIC":
        assert.ok(blockTypes.has("equation"), `${qlId}: ALGEBRAIC QL must contain an equation block.`);
        break;
    }

    const explanationWords = textWordCount(entry);
    const minimumWords = entry.difficulty === "Easy" ? 35 : entry.difficulty === "Medium" ? 55 : 70;
    assert.ok(explanationWords >= minimumWords, `${qlId}: explanation has ${explanationWords} words; expected at least ${minimumWords}.`);
    assert.ok(entry.explanation.opening.split(/\s+/).length >= 6, `${qlId}: opening is not friendly or explanatory enough.`);
    assert.ok(entry.explanation.commonTrap, `${qlId}: a learner-facing common trap is required.`);

    const explanationText = collectStrings(entry.explanation).join(" ");
    assert.ok(!/[×÷³²]/u.test(explanationText), `${qlId}: raw calculation symbols must be represented in LaTeX fields.`);

    contextFamilies.push(entry.stem.contextFamily);
    const opening = firstNarrativeText(entry);
    if (/^(A|An) (article|dealer|trader)\b/i.test(opening)) genericOpeningCount += 1;
    if (entry.difficulty === "Hard") hardCount += 1;
    if (entry.difficulty !== registryEntry.difficulty) {
      legacyDifficultyDifferences.push(`${qlId}:${registryEntry.difficulty}->${entry.difficulty}`);
    }
  }
}

assert.equal(allEntries.size, 92, "The editorial migration must cover all 92 QLs from PNL-QL-095 through PNL-QL-186.");
assert.ok(new Set(contextFamilies).size >= 75, "At least 75 distinct context families are required across 92 QLs.");
assert.ok(genericOpeningCount <= 10, `Generic article/dealer/trader openings remain too frequent: ${genericOpeningCount}.`);
assert.ok(hardCount <= 46, `Hard difficulty remains inflated: ${hardCount} of 92.`);
assert.ok(legacyDifficultyDifferences.length >= 8, "The recalibration should correct a meaningful number of legacy difficulty labels.");

console.log(JSON.stringify({
  ok: true,
  qlCount: allEntries.size,
  distinctContextFamilies: new Set(contextFamilies).size,
  genericOpeningCount,
  hardCount,
  difficultyRecalibrations: legacyDifficultyDifferences,
  encapsulatedSourceVariables: SOURCE_ENCAPSULATED_VARIABLES,
}, null, 2));
