import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildAllNormalizedMultilingualEditorialLibraries,
  renderLocalizedFriendlyExplanationMarkdown,
  renderLocalizedStructuredStemMarkdown,
  type NativeEditorialLanguage,
  type QuestionStemBlock,
  type StructuredEditorialEntry,
} from "./foundation";

const root = dirname(fileURLToPath(import.meta.url));
const CP_META = [
  { cp: "CP-001", start: 1, count: 36 },
  { cp: "CP-002", start: 37, count: 34 },
  { cp: "CP-003", start: 71, count: 24 },
  { cp: "CP-004", start: 95, count: 26 },
  { cp: "CP-005", start: 121, count: 29 },
  { cp: "CP-006", start: 150, count: 37 },
] as const;

type RegistryEntry = Readonly<{
  requiredVariables: readonly string[];
  representation?: string;
  presentation?: string;
}>;

type RegistryFile = Readonly<{ entries: Readonly<Record<string, RegistryEntry>> }>;
type EnglishLibrary = Readonly<{ entries: Readonly<Record<string, StructuredEditorialEntry>>; entryCount: number }>;

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function addRequiredPlaceholders(text: string | undefined, required: Set<string>, output: Set<string>): void {
  if (!text) return;
  for (const match of text.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)) {
    if (required.has(match[1])) output.add(match[1]);
  }
}

function stemVariables(entry: StructuredEditorialEntry, requiredVariables: readonly string[]): readonly string[] {
  const required = new Set(requiredVariables);
  const output = new Set<string>();
  addRequiredPlaceholders(entry.stem.prompt, required, output);
  for (const block of entry.stem.blocks) {
    switch (block.type) {
      case "paragraph":
        addRequiredPlaceholders(block.content, required, output);
        break;
      case "table":
        addRequiredPlaceholders(block.caption, required, output);
        block.columns.forEach((value) => addRequiredPlaceholders(value, required, output));
        block.rows?.forEach((row) => row.forEach((value) => addRequiredPlaceholders(value, required, output)));
        if (block.rowSource && required.has(block.rowSource)) output.add(block.rowSource);
        break;
      case "caselet":
        addRequiredPlaceholders(block.title, required, output);
        block.paragraphs?.forEach((value) => addRequiredPlaceholders(value, required, output));
        if (block.paragraphSource && required.has(block.paragraphSource)) output.add(block.paragraphSource);
        break;
      case "statements":
        addRequiredPlaceholders(block.lead, required, output);
        block.statements.forEach((value) => addRequiredPlaceholders(value, required, output));
        break;
      case "data_sufficiency":
        addRequiredPlaceholders(block.question, required, output);
        block.statements.forEach((value) => addRequiredPlaceholders(value, required, output));
        break;
      case "equation":
        addRequiredPlaceholders(block.latex, required, output);
        break;
    }
  }
  return [...output].sort();
}

function specialBlockTypes(entry: StructuredEditorialEntry): readonly string[] {
  return entry.stem.blocks.map((block) => block.type).filter((type) => type !== "paragraph").sort();
}

function proseText(entry: StructuredEditorialEntry): string {
  const stem = entry.stem.blocks.flatMap((block): string[] => {
    switch (block.type) {
      case "paragraph": return [block.content];
      case "table": return [block.caption ?? "", ...block.columns, ...(block.rows?.flat() ?? [])];
      case "caselet": return [block.title ?? "", ...(block.paragraphs ?? [])];
      case "statements": return [block.lead ?? "", ...block.statements];
      case "data_sufficiency": return [block.question, ...block.statements];
      case "equation": return [];
    }
  });
  const explanation = entry.explanation;
  return [
    ...stem,
    entry.stem.prompt,
    explanation.opening,
    explanation.concept,
    ...explanation.steps.flatMap((step) => [step.title, step.body]),
    explanation.conclusion,
    explanation.commonTrap ?? "",
    explanation.shortcut ?? "",
    entry.difficultyRationale,
  ].join(" ");
}

function explanationCharacters(entry: StructuredEditorialEntry): number {
  return [
    entry.explanation.opening,
    entry.explanation.concept,
    ...entry.explanation.steps.flatMap((step) => [step.title, step.body]),
    entry.explanation.conclusion,
    entry.explanation.commonTrap ?? "",
    entry.explanation.shortcut ?? "",
  ].join(" ").replace(/\s+/g, "").length;
}

function latexValues(entry: StructuredEditorialEntry): readonly string[] {
  const values: string[] = [];
  for (const block of entry.stem.blocks) if (block.type === "equation") values.push(block.latex);
  for (const step of entry.explanation.steps) if (step.equationLatex) values.push(step.equationLatex);
  if (entry.explanation.finalAnswerLatex) values.push(entry.explanation.finalAnswerLatex);
  return values;
}

const libraries = buildAllNormalizedMultilingualEditorialLibraries();
assert.equal(libraries.length, 12, "Six CPs in two native languages must produce 12 libraries.");

let totalEntries = 0;
const contextFamilies = new Set<string>();
const conceptsByLanguage: Record<NativeEditorialLanguage, Set<string>> = { hi: new Set(), pa: new Set() };
const fallbackPrompts: string[] = [];

for (const [cpIndex, meta] of CP_META.entries()) {
  const registry = readJson<RegistryFile>(join(root, meta.cp, "task-registry.library.json"));
  const english = readJson<EnglishLibrary>(join(root, meta.cp, "editorial-content.en.json"));
  const expectedIds = Array.from({ length: meta.count }, (_, index) => `PNL-QL-${String(meta.start + index).padStart(3, "0")}`);

  for (const [languageOffset, language] of (["hi", "pa"] as const).entries()) {
    const library = libraries[cpIndex * 2 + languageOffset];
    assert.equal(library.language, language, `${meta.cp}: language order mismatch.`);
    assert.equal(library.entryCount, meta.count, `${meta.cp} ${language}: count mismatch.`);
    assert.deepEqual(Object.keys(library.entries), expectedIds, `${meta.cp} ${language}: IDs must be contiguous.`);

    for (const qlId of expectedIds) {
      const entry = library.entries[qlId];
      const englishEntry = english.entries[qlId];
      const registryEntry = registry.entries[qlId];
      totalEntries += 1;
      contextFamilies.add(entry.stem.contextFamily);
      conceptsByLanguage[language].add(entry.explanation.concept);

      assert.equal(entry.difficulty, englishEntry.difficulty, `${qlId} ${language}: difficulty must match approved English.`);
      assert.deepEqual(specialBlockTypes(entry), specialBlockTypes(englishEntry), `${qlId} ${language}: structured representation must match English.`);
      assert.deepEqual(
        stemVariables(entry, registryEntry.requiredVariables),
        [...registryEntry.requiredVariables].sort(),
        `${qlId} ${language}: required placeholders must match the registry.`,
      );

      const blockTypes = new Set(entry.stem.blocks.map((block) => block.type));
      if (registryEntry.representation === "TABLE") assert.ok(blockTypes.has("table"), `${qlId} ${language}: TABLE block missing.`);
      if (registryEntry.representation === "CASELET") assert.ok(blockTypes.has("caselet"), `${qlId} ${language}: CASELET block missing.`);
      if (registryEntry.representation === "STATEMENT") assert.ok(blockTypes.has("statements"), `${qlId} ${language}: STATEMENT block missing.`);
      if (registryEntry.representation === "ALGEBRAIC") assert.ok(blockTypes.has("equation"), `${qlId} ${language}: ALGEBRAIC block missing.`);
      if (registryEntry.representation === "DATA_SUFFICIENCY") assert.ok(blockTypes.has("data_sufficiency"), `${qlId} ${language}: DATA_SUFFICIENCY block missing.`);
      if (registryEntry.presentation === "ALGEBRAIC_STATEMENT") assert.ok(blockTypes.has("equation"), `${qlId} ${language}: algebraic presentation block missing.`);

      const prose = proseText(entry);
      const scriptPattern = language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
      assert.ok(scriptPattern.test(prose), `${qlId} ${language}: native script is missing.`);
      assert.ok(entry.explanation.steps.length >= 2, `${qlId} ${language}: at least two teaching steps are required.`);
      assert.ok(entry.explanation.commonTrap, `${qlId} ${language}: common-trap guidance is required.`);
      assert.ok(explanationCharacters(entry) >= 320, `${qlId} ${language}: explanation is too shallow.`);

      if (["सही उत्तर चुनिए।", "ਸਹੀ ਉੱਤਰ ਚੁਣੋ।"].includes(entry.stem.prompt)) fallbackPrompts.push(`${qlId}:${language}`);
      assert.ok(!/Additional given value|Select the correct answer|Key idea|Common mistake to avoid|Quick check/u.test(prose), `${qlId} ${language}: English editorial scaffolding remains.`);

      const renderedStem = renderLocalizedStructuredStemMarkdown(entry.stem, language);
      const renderedExplanation = renderLocalizedFriendlyExplanationMarkdown(entry.explanation, language);
      if (language === "hi") {
        assert.ok(renderedExplanation.includes("**मुख्य विचार:**"), `${qlId}: Hindi key-idea label missing.`);
        assert.ok(renderedExplanation.includes("**सामान्य गलती से बचें:**"), `${qlId}: Hindi trap label missing.`);
        assert.ok(!renderedExplanation.includes("**Step "), `${qlId}: English step label remains in Hindi.`);
      } else {
        assert.ok(renderedExplanation.includes("**ਮੁੱਖ ਵਿਚਾਰ:**"), `${qlId}: Punjabi key-idea label missing.`);
        assert.ok(renderedExplanation.includes("**ਆਮ ਗਲਤੀ ਤੋਂ ਬਚੋ:**"), `${qlId}: Punjabi trap label missing.`);
        assert.ok(!renderedExplanation.includes("**Step "), `${qlId}: English step label remains in Punjabi.`);
      }
      assert.ok(!/[×÷³²]/u.test(`${renderedStem} ${renderedExplanation}`), `${qlId} ${language}: raw calculation glyph remains.`);

      for (const latex of latexValues(entry)) {
        assert.ok(!/[\f\r\t]/u.test(latex), `${qlId} ${language}: LaTeX contains a control-character escape.`);
        assert.ok(!/\\text\{(?:profit|loss|units?|cost|revenue|contribution|fixed cost|variable cost|target profit|effective cost|net receipt|gross selling price|amount|quantity)\}/iu.test(latex), `${qlId} ${language}: English text remains inside LaTeX.`);
      }
    }
  }
}

assert.equal(totalEntries, 372, "The multilingual migration must contain 186 Hindi and 186 Punjabi entries.");
assert.equal(contextFamilies.size, 372, "Every language-specific QL must have a unique context family key.");
assert.equal(fallbackPrompts.length, 0, `Generic fallback prompts remain: ${fallbackPrompts.join(", ")}`);
assert.ok(conceptsByLanguage.hi.size >= 75, `Hindi concept diversity is too low: ${conceptsByLanguage.hi.size}.`);
assert.ok(conceptsByLanguage.pa.size >= 75, `Punjabi concept diversity is too low: ${conceptsByLanguage.pa.size}.`);

console.log(JSON.stringify({
  ok: true,
  totalEntries,
  hindiEntries: 186,
  punjabiEntries: 186,
  contextFamilies: contextFamilies.size,
  hindiConcepts: conceptsByLanguage.hi.size,
  punjabiConcepts: conceptsByLanguage.pa.size,
  fallbackPrompts,
}, null, 2));
