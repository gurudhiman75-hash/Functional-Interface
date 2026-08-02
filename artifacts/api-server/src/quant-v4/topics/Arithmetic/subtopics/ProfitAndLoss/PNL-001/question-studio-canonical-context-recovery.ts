import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  normalizeEditorialProse,
  renderFriendlyExplanationMarkdown,
  renderStructuredStemMarkdown,
  type FriendlyExplanation,
  type QuestionStemBlock,
  type StructuredEditorialEntry,
  type StructuredQuestionStem,
} from "./foundation/editorial-content";
import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";

const CP_FOLDERS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006"] as const;
type CpFolder = (typeof CP_FOLDERS)[number];

type CanonicalReviewEntry = Readonly<{
  qlId: string;
  cpId: string;
  stem: string;
  explanation: string;
  answer: string;
}>;

type CanonicalReviewLibrary = Readonly<{
  entries: Readonly<Record<string, CanonicalReviewEntry>>;
}>;

type EditorialLibrary = Readonly<{
  cpId: string;
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
}>;

type RegistryEntry = Readonly<{
  requiredVariables: readonly string[];
}>;

type RegistryFile = Readonly<{
  entries: Readonly<Record<string, RegistryEntry>>;
}>;

type CaptureMode = "prose" | "latex" | "table-source" | "paragraph-source";

type CaptureDefinition = Readonly<{
  key: string;
  mode: CaptureMode;
}>;

type PatternFragment = Readonly<{
  pattern: string;
  captures: readonly CaptureDefinition[];
}>;

export type RecoveredCanonicalContext = Readonly<Record<string, unknown>>;

export type CanonicalContextRecovery = Readonly<{
  qlId: string;
  cpId: string;
  context: RecoveredCanonicalContext;
  englishEntry: StructuredEditorialEntry;
  canonicalEntry: CanonicalReviewEntry;
  rowSources: readonly string[];
  paragraphSources: readonly string[];
}>;

function locateRoot(): string {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    moduleDir,
    join(moduleDir, ".."),
    join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001"),
    join(process.cwd(), "src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001"),
  ];
  for (const candidate of candidates) {
    if (existsSync(join(candidate, "CP-001", "editorial-content.en.json"))) return candidate;
  }
  throw new Error("Unable to locate the PNL-001 source root for canonical context recovery.");
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

const root = locateRoot();
const canonicalLibrary = PNL_001_CANONICAL_REVIEW_LIBRARY as CanonicalReviewLibrary;
const englishEntries = new Map<string, StructuredEditorialEntry>();
const registryEntries = new Map<string, RegistryEntry>();
const cpByQl = new Map<string, string>();

for (const cp of CP_FOLDERS) {
  const editorial = readJson<EditorialLibrary>(join(root, cp, "editorial-content.en.json"));
  const registry = readJson<RegistryFile>(join(root, cp, "task-registry.library.json"));
  for (const [qlId, entry] of Object.entries(editorial.entries)) {
    englishEntries.set(qlId, entry);
    cpByQl.set(qlId, editorial.cpId);
  }
  for (const [qlId, entry] of Object.entries(registry.entries)) registryEntries.set(qlId, entry);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function prosePlaceholderNames(value: string | undefined): readonly string[] {
  if (!value) return [];
  return [...value.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((match) => match[1]!);
}

function entryProsePlaceholderNames(entry: StructuredEditorialEntry): ReadonlySet<string> {
  const names = new Set<string>();
  const add = (value: string | undefined) => prosePlaceholderNames(value).forEach((name) => names.add(name));

  add(entry.stem.prompt);
  for (const block of entry.stem.blocks) {
    switch (block.type) {
      case "paragraph":
        add(block.content);
        break;
      case "table":
        add(block.caption);
        block.columns.forEach(add);
        block.rows?.forEach((row) => row.forEach(add));
        if (block.rowSource) names.add(block.rowSource);
        break;
      case "caselet":
        add(block.title);
        block.paragraphs?.forEach(add);
        if (block.paragraphSource) names.add(block.paragraphSource);
        break;
      case "statements":
        add(block.lead);
        block.statements.forEach(add);
        break;
      case "data_sufficiency":
        add(block.question);
        block.statements.forEach(add);
        break;
      case "equation":
        break;
    }
  }

  add(entry.explanation.opening);
  add(entry.explanation.concept);
  entry.explanation.steps.forEach((step) => {
    add(step.title);
    add(step.body);
  });
  add(entry.explanation.conclusion);
  add(entry.explanation.commonTrap);
  add(entry.explanation.shortcut);
  add(entry.difficultyRationale);

  return names;
}

function compileTemplate(
  template: string,
  mode: "prose" | "latex",
  variableNames: ReadonlySet<string>,
): PatternFragment {
  const source = mode === "prose" ? normalizeEditorialProse(template) : template;
  const captures: CaptureDefinition[] = [];
  let pattern = "";
  let cursor = 0;

  for (const match of source.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)) {
    const full = match[0];
    const key = match[1]!;
    const index = match.index!;
    pattern += escapeRegex(source.slice(cursor, index));
    if (variableNames.has(key)) {
      pattern += "([\\s\\S]+?)";
      captures.push({ key, mode });
    } else {
      pattern += escapeRegex(full);
    }
    cursor = index + full.length;
  }

  pattern += escapeRegex(source.slice(cursor));
  return { pattern, captures };
}

function literal(value: string): PatternFragment {
  return { pattern: escapeRegex(value), captures: [] };
}

function bold(fragment: PatternFragment): PatternFragment {
  return {
    pattern: `\\*\\*${fragment.pattern}\\*\\*`,
    captures: fragment.captures,
  };
}

function tableRow(cells: readonly PatternFragment[]): PatternFragment {
  return {
    pattern: `\\| ${cells.map((cell) => cell.pattern).join(" \\| ")} \\|`,
    captures: cells.flatMap((cell) => cell.captures),
  };
}

function combine(parts: readonly PatternFragment[]): PatternFragment {
  return {
    pattern: parts.map((part) => part.pattern).join("\\n\\n"),
    captures: parts.flatMap((part) => part.captures),
  };
}

function compileStem(
  stem: StructuredQuestionStem,
  variableNames: ReadonlySet<string>,
): PatternFragment {
  const parts: PatternFragment[] = [];

  for (const block of stem.blocks) {
    switch (block.type) {
      case "paragraph":
        parts.push(compileTemplate(block.content, "prose", variableNames));
        break;
      case "table": {
        if (block.caption) parts.push(bold(compileTemplate(block.caption, "prose", variableNames)));
        parts.push(tableRow(block.columns.map((column) => compileTemplate(column, "prose", variableNames))));
        parts.push(tableRow(block.columns.map(() => literal("---"))));
        if (block.rows) {
          for (const row of block.rows) {
            parts.push(
              tableRow(
                block.columns.map((_, index) =>
                  compileTemplate(row[index] ?? "", "prose", variableNames),
                ),
              ),
            );
          }
        } else if (block.rowSource) {
          parts.push({
            pattern: "((?:\\|[^\\n]*\\|)(?:\\n\\n\\|[^\\n]*\\|)*)",
            captures: [{ key: block.rowSource, mode: "table-source" }],
          });
        }
        break;
      }
      case "caselet":
        if (block.title) parts.push(bold(compileTemplate(block.title, "prose", variableNames)));
        if (block.paragraphs) {
          block.paragraphs.forEach((paragraph) =>
            parts.push(compileTemplate(paragraph, "prose", variableNames)),
          );
        } else if (block.paragraphSource) {
          parts.push({
            pattern: "([\\s\\S]+?)",
            captures: [{ key: block.paragraphSource, mode: "paragraph-source" }],
          });
        }
        break;
      case "statements":
        if (block.lead) parts.push(compileTemplate(block.lead, "prose", variableNames));
        block.statements.forEach((statement, index) => {
          const compiled = compileTemplate(statement, "prose", variableNames);
          parts.push({ pattern: `${index + 1}\\. ${compiled.pattern}`, captures: compiled.captures });
        });
        break;
      case "data_sufficiency":
        parts.push(compileTemplate(block.question, "prose", variableNames));
        block.statements.forEach((statement, index) => {
          const compiled = compileTemplate(statement, "prose", variableNames);
          parts.push({
            pattern: `\\*\\*Statement ${index + 1}:\\*\\* ${compiled.pattern}`,
            captures: compiled.captures,
          });
        });
        parts.push(literal("Use the standard two-statement data-sufficiency answer scheme."));
        break;
      case "equation": {
        const compiled = compileTemplate(block.latex, "latex", variableNames);
        parts.push({
          pattern:
            block.display === false
              ? `\\\\\\(${compiled.pattern}\\\\\\)`
              : `\\\\\\[${compiled.pattern}\\\\\\]`,
          captures: compiled.captures,
        });
        break;
      }
    }
  }

  parts.push(compileTemplate(stem.prompt, "prose", variableNames));
  return combine(parts);
}

function compileExplanation(
  explanation: FriendlyExplanation,
  variableNames: ReadonlySet<string>,
): PatternFragment {
  const parts: PatternFragment[] = [];
  parts.push(compileTemplate(explanation.opening, "prose", variableNames));

  const concept = compileTemplate(explanation.concept, "prose", variableNames);
  parts.push({ pattern: `\\*\\*Key idea:\\*\\* ${concept.pattern}`, captures: concept.captures });

  explanation.steps.forEach((step, index) => {
    const title = compileTemplate(step.title, "prose", variableNames);
    parts.push({
      pattern: `\\*\\*Step ${index + 1}: ${title.pattern}\\*\\*`,
      captures: title.captures,
    });
    parts.push(compileTemplate(step.body, "prose", variableNames));
    if (step.equationLatex) {
      const equation = compileTemplate(step.equationLatex, "latex", variableNames);
      parts.push({ pattern: `\\\\\\[${equation.pattern}\\\\\\]`, captures: equation.captures });
    }
  });

  const conclusion = compileTemplate(explanation.conclusion, "prose", variableNames);
  parts.push({ pattern: `\\*\\*Conclusion:\\*\\* ${conclusion.pattern}`, captures: conclusion.captures });

  if (explanation.finalAnswerLatex) {
    const finalAnswer = compileTemplate(explanation.finalAnswerLatex, "latex", variableNames);
    parts.push({
      pattern: `\\\\\\[\\\\boxed\\{${finalAnswer.pattern}\\}\\\\\\]`,
      captures: finalAnswer.captures,
    });
  }
  if (explanation.commonTrap) {
    const trap = compileTemplate(explanation.commonTrap, "prose", variableNames);
    parts.push({
      pattern: `\\*\\*Common mistake to avoid:\\*\\* ${trap.pattern}`,
      captures: trap.captures,
    });
  }
  if (explanation.shortcut) {
    const shortcut = compileTemplate(explanation.shortcut, "prose", variableNames);
    parts.push({ pattern: `\\*\\*Quick check:\\*\\* ${shortcut.pattern}`, captures: shortcut.captures });
  }

  return combine(parts);
}

function parseTableRows(value: string): readonly (readonly string[])[] {
  return value.split(/\n\n/).map((line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) {
      throw new Error(`Invalid canonical table row: ${line}`);
    }
    return trimmed
      .slice(1, -1)
      .split(/(?<!\\)\|/)
      .map((cell) => cell.trim().replaceAll("\\|", "|"));
  });
}

function parseParagraphs(value: string): readonly string[] {
  return value.split(/\n\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

function normalizedComparable(value: string): string {
  return normalizeEditorialProse(value).replace(/\s+/g, " ").trim();
}

function mergeCapture(
  output: Record<string, unknown>,
  modes: Map<string, CaptureMode>,
  definition: CaptureDefinition,
  value: string,
  qlId: string,
): void {
  const parsed: unknown =
    definition.mode === "table-source"
      ? parseTableRows(value)
      : definition.mode === "paragraph-source"
        ? parseParagraphs(value)
        : value;

  if (!(definition.key in output)) {
    output[definition.key] = parsed;
    modes.set(definition.key, definition.mode);
    return;
  }

  const current = output[definition.key];
  const currentMode = modes.get(definition.key)!;
  if (typeof current !== "string" || typeof parsed !== "string") {
    if (JSON.stringify(current) !== JSON.stringify(parsed)) {
      throw new Error(`${qlId}: conflicting recovered source value for ${definition.key}.`);
    }
    return;
  }

  if (current === parsed) return;
  if (normalizedComparable(current) !== normalizedComparable(parsed)) {
    throw new Error(
      `${qlId}: conflicting recovered scalar for ${definition.key}: ${JSON.stringify(current)} versus ${JSON.stringify(parsed)}.`,
    );
  }

  if (definition.mode === "latex" && currentMode === "prose") {
    output[definition.key] = parsed;
    modes.set(definition.key, definition.mode);
  }
}

function applyPattern(
  rendered: string,
  compiled: PatternFragment,
  output: Record<string, unknown>,
  modes: Map<string, CaptureMode>,
  qlId: string,
  surface: string,
): void {
  const match = new RegExp(`^${compiled.pattern}$`, "u").exec(rendered);
  if (!match) {
    throw new Error(`${qlId}: canonical ${surface} does not match its structured English authority.`);
  }
  compiled.captures.forEach((definition, index) => {
    mergeCapture(output, modes, definition, match[index + 1] ?? "", qlId);
  });
}

function unresolvedProsePlaceholders(value: string): readonly string[] {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
  return [...new Set([...proseOnly.matchAll(/\{([a-z][A-Za-z0-9_]*)\}/g)].map((match) => match[1]!))].sort();
}

export function recoverPnl001CanonicalContext(qlId: string): CanonicalContextRecovery {
  const canonicalEntry = canonicalLibrary.entries[qlId];
  const englishEntry = englishEntries.get(qlId);
  const registryEntry = registryEntries.get(qlId);
  const cpId = cpByQl.get(qlId);
  if (!canonicalEntry || !englishEntry || !registryEntry || !cpId) {
    throw new Error(`${qlId}: canonical recovery authorities are incomplete.`);
  }
  if (canonicalEntry.cpId !== cpId) {
    throw new Error(`${qlId}: canonical CP ownership differs from the English editorial library.`);
  }

  const variableNames = new Set<string>([
    ...registryEntry.requiredVariables,
    ...entryProsePlaceholderNames(englishEntry),
  ]);
  const context: Record<string, unknown> = {};
  const modes = new Map<string, CaptureMode>();
  const keyedAnswerSuffix = `\n\n**Final answer:** ${canonicalEntry.answer}`;
  if (!canonicalEntry.explanation.endsWith(keyedAnswerSuffix)) {
    throw new Error(`${qlId}: canonical explanation is missing its reviewed keyed-answer suffix.`);
  }
  const structuredCanonicalExplanation = canonicalEntry.explanation.slice(
    0,
    -keyedAnswerSuffix.length,
  );

  applyPattern(
    canonicalEntry.stem,
    compileStem(englishEntry.stem, variableNames),
    context,
    modes,
    qlId,
    "stem",
  );
  applyPattern(
    structuredCanonicalExplanation,
    compileExplanation(englishEntry.explanation, variableNames),
    context,
    modes,
    qlId,
    "explanation",
  );

  const rerenderedStem = renderStructuredStemMarkdown(englishEntry.stem, context);
  const rerenderedStructuredExplanation = renderFriendlyExplanationMarkdown(
    englishEntry.explanation,
    context,
  );
  const rerenderedFullExplanation = `${rerenderedStructuredExplanation}${keyedAnswerSuffix}`;
  if (rerenderedStem !== canonicalEntry.stem) {
    throw new Error(`${qlId}: recovered context does not reproduce the canonical English stem exactly.`);
  }
  if (rerenderedStructuredExplanation !== structuredCanonicalExplanation) {
    throw new Error(`${qlId}: recovered context does not reproduce the structured English explanation exactly.`);
  }
  if (rerenderedFullExplanation !== canonicalEntry.explanation) {
    throw new Error(`${qlId}: recovered context does not reproduce the full canonical English explanation exactly.`);
  }

  const unresolved = unresolvedProsePlaceholders(
    `${rerenderedStem}\n${rerenderedFullExplanation}`,
  );
  if (unresolved.length > 0) {
    throw new Error(`${qlId}: recovered canonical context leaves unresolved prose placeholders: ${unresolved.join(", ")}.`);
  }

  const rowSources = englishEntry.stem.blocks
    .filter((block): block is Extract<QuestionStemBlock, { type: "table" }> => block.type === "table")
    .map((block) => block.rowSource)
    .filter((value): value is string => Boolean(value));
  const paragraphSources = englishEntry.stem.blocks
    .filter((block): block is Extract<QuestionStemBlock, { type: "caselet" }> => block.type === "caselet")
    .map((block) => block.paragraphSource)
    .filter((value): value is string => Boolean(value));

  return {
    qlId,
    cpId,
    context,
    englishEntry,
    canonicalEntry,
    rowSources,
    paragraphSources,
  };
}

export function recoverAllPnl001CanonicalContexts(): readonly CanonicalContextRecovery[] {
  const qlIds = Object.keys(canonicalLibrary.entries).sort();
  if (qlIds.length !== 186) {
    throw new Error(`Expected 186 PNL canonical entries, received ${qlIds.length}.`);
  }
  return qlIds.map(recoverPnl001CanonicalContext);
}
