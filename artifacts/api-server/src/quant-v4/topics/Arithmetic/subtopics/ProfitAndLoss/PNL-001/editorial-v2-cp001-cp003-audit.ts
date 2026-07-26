import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildAllNormalizedLegacyEditorialLibraries,
  renderFriendlyExplanationMarkdown,
  type QuestionStemBlock,
  type StructuredEditorialEntry,
} from "./foundation";

const root = dirname(fileURLToPath(import.meta.url));

type RegistryEntry = Readonly<{
  requiredVariables: readonly string[];
  representation?: string;
  presentation?: string;
  difficulty: "Easy" | "Medium" | "Hard";
}>;

type Registry = Readonly<{ entries: Readonly<Record<string, RegistryEntry>> }>;

function readRegistry(cp: string): Registry {
  return JSON.parse(readFileSync(join(root, cp, "task-registry.library.json"), "utf8")) as Registry;
}

function addPlaceholders(text: string | undefined, output: Set<string>, required: Set<string>): void {
  if (!text) return;
  for (const match of text.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)) {
    if (required.has(match[1])) output.add(match[1]);
  }
}

function stemVariables(blocks: readonly QuestionStemBlock[], prompt: string, requiredVariables: readonly string[]): readonly string[] {
  const required = new Set(requiredVariables);
  const output = new Set<string>();
  addPlaceholders(prompt, output, required);
  for (const block of blocks) {
    switch (block.type) {
      case "paragraph":
        addPlaceholders(block.content, output, required);
        break;
      case "table":
        addPlaceholders(block.caption, output, required);
        block.columns.forEach((column) => addPlaceholders(column, output, required));
        block.rows?.forEach((row) => row.forEach((cell) => addPlaceholders(cell, output, required)));
        if (block.rowSource && required.has(block.rowSource)) output.add(block.rowSource);
        break;
      case "caselet":
        addPlaceholders(block.title, output, required);
        block.paragraphs?.forEach((paragraph) => addPlaceholders(paragraph, output, required));
        if (block.paragraphSource && required.has(block.paragraphSource)) output.add(block.paragraphSource);
        break;
      case "statements":
        addPlaceholders(block.lead, output, required);
        block.statements.forEach((statement) => addPlaceholders(statement, output, required));
        break;
      case "data_sufficiency":
        addPlaceholders(block.question, output, required);
        block.statements.forEach((statement) => addPlaceholders(statement, output, required));
        break;
      case "equation":
        addPlaceholders(block.latex, output, required);
        break;
    }
  }
  return [...output].sort();
}

function wordCount(entry: StructuredEditorialEntry): number {
  const explanation = entry.explanation;
  return [
    explanation.opening,
    explanation.concept,
    ...explanation.steps.flatMap((step) => [step.title, step.body]),
    explanation.conclusion,
    explanation.commonTrap ?? "",
    explanation.shortcut ?? "",
  ].join(" ").split(/\s+/).filter(Boolean).length;
}

function paragraphText(entry: StructuredEditorialEntry): string {
  return entry.stem.blocks
    .filter((block): block is Extract<QuestionStemBlock, { type: "paragraph" }> => block.type === "paragraph")
    .map((block) => block.content)
    .join(" ");
}

function latexValues(entry: StructuredEditorialEntry): readonly string[] {
  const values: string[] = [];
  for (const block of entry.stem.blocks) if (block.type === "equation") values.push(block.latex);
  for (const step of entry.explanation.steps) if (step.equationLatex) values.push(step.equationLatex);
  if (entry.explanation.finalAnswerLatex) values.push(entry.explanation.finalAnswerLatex);
  return values;
}

const libraries = buildAllNormalizedLegacyEditorialLibraries();
const packageMeta = [
  { cp: "CP-001", start: 1, count: 36 },
  { cp: "CP-002", start: 37, count: 34 },
  { cp: "CP-003", start: 71, count: 24 },
] as const;

const contexts = new Set<string>();
const difficultyChanges: string[] = [];
let total = 0;
let hardCount = 0;
let genericOpenings = 0;

for (const [index, meta] of packageMeta.entries()) {
  const library = libraries[index];
  const registry = readRegistry(meta.cp);
  const expectedIds = Array.from({ length: meta.count }, (_, offset) => `PNL-QL-${String(meta.start + offset).padStart(3, "0")}`);

  assert.equal(library.entryCount, meta.count, `${meta.cp}: entry count mismatch.`);
  assert.deepEqual(Object.keys(library.entries), expectedIds, `${meta.cp}: generated IDs must be contiguous.`);
  assert.deepEqual(Object.keys(registry.entries), expectedIds, `${meta.cp}: registry IDs must match generated IDs.`);

  for (const qlId of expectedIds) {
    const entry = library.entries[qlId];
    const registryEntry = registry.entries[qlId];
    total += 1;
    contexts.add(entry.stem.contextFamily);

    const visible = stemVariables(entry.stem.blocks, entry.stem.prompt, registryEntry.requiredVariables);
    const required = [...registryEntry.requiredVariables].sort();
    assert.deepEqual(visible, required, `${qlId}: structured stem variables must match the registry.`);

    const blockTypes = new Set(entry.stem.blocks.map((block) => block.type));
    if (registryEntry.representation === "TABLE") assert.ok(blockTypes.has("table"), `${qlId}: TABLE must use a table block.`);
    if (registryEntry.representation === "CASELET") assert.ok(blockTypes.has("caselet"), `${qlId}: CASELET must use a caselet block.`);
    if (registryEntry.representation === "STATEMENT") assert.ok(blockTypes.has("statements"), `${qlId}: STATEMENT must use a statements block.`);
    if (registryEntry.representation === "ALGEBRAIC") assert.ok(blockTypes.has("equation"), `${qlId}: ALGEBRAIC must use an equation block.`);
    if (registryEntry.representation === "DATA_SUFFICIENCY") assert.ok(blockTypes.has("data_sufficiency"), `${qlId}: DATA_SUFFICIENCY must use a data-sufficiency block.`);
    if (registryEntry.presentation === "ALGEBRAIC_STATEMENT") assert.ok(blockTypes.has("equation"), `${qlId}: algebraic presentation must use an equation block.`);

    const words = wordCount(entry);
    const minimum = entry.difficulty === "Easy" ? 45 : entry.difficulty === "Medium" ? 65 : 80;
    assert.ok(words >= minimum, `${qlId}: friendly explanation has ${words} words; expected at least ${minimum}.`);
    assert.ok(entry.explanation.opening.split(/\s+/).length >= 8, `${qlId}: explanation opening is too abrupt.`);
    assert.ok(entry.explanation.steps.length >= 2, `${qlId}: at least two teaching steps are required.`);
    assert.ok(entry.explanation.commonTrap, `${qlId}: learner-facing common trap is required.`);

    const renderedExplanation = renderFriendlyExplanationMarkdown(entry.explanation);
    assert.ok(!/[×÷³²]/u.test(renderedExplanation), `${qlId}: rendered explanation contains raw calculation glyphs.`);
    assert.ok(renderedExplanation.includes("**Key idea:**"), `${qlId}: key-idea heading is missing.`);
    assert.ok(renderedExplanation.includes("**Common mistake to avoid:**"), `${qlId}: common-trap heading is missing.`);

    const prose = paragraphText(entry);
    assert.ok(!prose.includes("Additional given value"), `${qlId}: mechanical variable append remains in the stem.`);
    assert.ok(!prose.includes(". the "), `${qlId}: sentence begins with a lower-case article.`);
    assert.notEqual(entry.stem.prompt, "Select the correct answer.", `${qlId}: generic fallback prompt remains.`);

    for (const latex of latexValues(entry)) {
      assert.ok(!/[\f\r\t]/u.test(latex), `${qlId}: LaTeX contains a control-character escape.`);
      assert.ok(!/(?<!\\)(frac|left|right|times|prod|Delta|pm|mp)/u.test(latex), `${qlId}: LaTeX command is missing its backslash: ${latex}`);
    }

    const firstParagraph = entry.stem.blocks.find((block) => block.type === "paragraph");
    if (firstParagraph?.type === "paragraph" && /^(A|An) (article|dealer|trader)\b/i.test(firstParagraph.content)) genericOpenings += 1;
    if (entry.difficulty === "Hard") hardCount += 1;
    if (entry.difficulty !== registryEntry.difficulty) difficultyChanges.push(`${qlId}:${registryEntry.difficulty}->${entry.difficulty}`);
  }
}

assert.equal(total, 94, "Editorial V2 migration must cover PNL-QL-001 through PNL-QL-094.");
assert.equal(contexts.size, 94, "Every migrated QL must have a distinct context family.");
assert.ok(genericOpenings <= 5, `Too many generic openings remain: ${genericOpenings}.`);
assert.ok(difficultyChanges.length >= 20, "Difficulty recalibration must correct at least 20 legacy labels.");
assert.ok(hardCount >= 15 && hardCount <= 30, `Hard distribution is not calibrated: ${hardCount} of 94.`);

console.log(JSON.stringify({
  ok: true,
  qlCount: total,
  distinctContextFamilies: contexts.size,
  genericOpenings,
  hardCount,
  difficultyChanges,
}, null, 2));
