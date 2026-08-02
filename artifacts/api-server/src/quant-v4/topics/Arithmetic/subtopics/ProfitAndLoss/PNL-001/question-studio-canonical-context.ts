import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  normalizeEditorialProse,
  renderFriendlyExplanationMarkdown,
  renderStructuredStemMarkdown,
  type QuestionStemBlock,
  type StructuredEditorialEntry,
  type StructuredQuestionStem,
} from "./foundation/editorial-content";
import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";

const CP_FOLDERS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006"] as const;

type CanonicalEntry = Readonly<{
  qlId: string;
  cpId: string;
  stem: string;
  explanation: string;
  answer: string;
  options: readonly [string, string, string, string];
  correctIndex: number;
}>;

type CanonicalLibrary = Readonly<{
  entries: Readonly<Record<string, CanonicalEntry>>;
}>;

type EditorialLibrary = Readonly<{
  cpId: string;
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
}>;

type RegistryFile = Readonly<{
  entries: Readonly<Record<string, Readonly<{ requiredVariables: readonly string[] }>>>;
}>;

type CaptureMode = "prose" | "latex" | "table-source" | "paragraph-source";
type Capture = Readonly<{ key: string; mode: CaptureMode }>;
type Fragment = Readonly<{ pattern: string; captures: readonly Capture[] }>;
type DataSufficiencyPatternMode = "CURRENT" | "LEGACY";

export type Pnl001CanonicalContext = Readonly<Record<string, unknown>>;
export type Pnl001CanonicalStemMode = "CURRENT_STRUCTURED" | "LEGACY_DATA_SUFFICIENCY";

export type Pnl001CanonicalContextRecovery = Readonly<{
  qlId: string;
  cpId: string;
  context: Pnl001CanonicalContext;
  canonicalEntry: CanonicalEntry;
  englishEntry: StructuredEditorialEntry;
  currentEnglishStem: string;
  currentEnglishExplanation: string;
  canonicalStemMode: Pnl001CanonicalStemMode;
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
  throw new Error("Unable to locate PNL-001 canonical source files.");
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

const root = locateRoot();
const canonical = PNL_001_CANONICAL_REVIEW_LIBRARY as CanonicalLibrary;
const englishByQl = new Map<string, StructuredEditorialEntry>();
const registryByQl = new Map<string, Readonly<{ requiredVariables: readonly string[] }>>();
const cpByQl = new Map<string, string>();

for (const cp of CP_FOLDERS) {
  const editorial = readJson<EditorialLibrary>(join(root, cp, "editorial-content.en.json"));
  const registry = readJson<RegistryFile>(join(root, cp, "task-registry.library.json"));
  for (const [qlId, entry] of Object.entries(editorial.entries)) {
    englishByQl.set(qlId, entry);
    cpByQl.set(qlId, editorial.cpId);
  }
  for (const [qlId, entry] of Object.entries(registry.entries)) registryByQl.set(qlId, entry);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function placeholders(value: string | undefined): readonly string[] {
  if (!value) return [];
  return [...value.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((match) => match[1]!);
}

function stemVariables(stem: StructuredQuestionStem): ReadonlySet<string> {
  const values = new Set<string>();
  const add = (text: string | undefined) => placeholders(text).forEach((value) => values.add(value));
  add(stem.prompt);
  for (const block of stem.blocks) {
    switch (block.type) {
      case "paragraph": add(block.content); break;
      case "table":
        add(block.caption);
        block.columns.forEach(add);
        block.rows?.forEach((row) => row.forEach(add));
        if (block.rowSource) values.add(block.rowSource);
        break;
      case "caselet":
        add(block.title);
        block.paragraphs?.forEach(add);
        if (block.paragraphSource) values.add(block.paragraphSource);
        break;
      case "statements":
        add(block.lead);
        block.statements.forEach(add);
        break;
      case "data_sufficiency":
        add(block.question);
        block.statements.forEach(add);
        break;
      case "equation": add(block.latex); break;
    }
  }
  return values;
}

function templateFragment(
  template: string,
  mode: "prose" | "latex",
  variables: ReadonlySet<string>,
): Fragment {
  const source = mode === "prose" ? normalizeEditorialProse(template) : template;
  const captures: Capture[] = [];
  let pattern = "";
  let cursor = 0;
  for (const match of source.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)) {
    const full = match[0];
    const key = match[1]!;
    const index = match.index!;
    pattern += escapeRegex(source.slice(cursor, index));
    if (variables.has(key)) {
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

function literal(value: string): Fragment {
  return { pattern: escapeRegex(value), captures: [] };
}

function bold(fragment: Fragment): Fragment {
  return { pattern: `\\*\\*${fragment.pattern}\\*\\*`, captures: fragment.captures };
}

function row(cells: readonly Fragment[]): Fragment {
  return {
    pattern: `\\| ${cells.map((cell) => cell.pattern).join(" \\| ")} \\|`,
    captures: cells.flatMap((cell) => cell.captures),
  };
}

function combine(parts: readonly Fragment[]): Fragment {
  return {
    pattern: parts.map((part) => part.pattern).join("\\n\\n"),
    captures: parts.flatMap((part) => part.captures),
  };
}

function compileStem(
  stem: StructuredQuestionStem,
  variables: ReadonlySet<string>,
  dataSufficiencyMode: DataSufficiencyPatternMode,
): Fragment {
  const parts: Fragment[] = [];
  for (const block of stem.blocks) {
    switch (block.type) {
      case "paragraph":
        parts.push(templateFragment(block.content, "prose", variables));
        break;
      case "table":
        if (block.caption) parts.push(bold(templateFragment(block.caption, "prose", variables)));
        parts.push(row(block.columns.map((value) => templateFragment(value, "prose", variables))));
        parts.push(row(block.columns.map(() => literal("---"))));
        if (block.rows) {
          for (const cells of block.rows) {
            parts.push(row(block.columns.map((_, index) => templateFragment(cells[index] ?? "", "prose", variables))));
          }
        } else if (block.rowSource) {
          parts.push({
            pattern: "((?:\\|[^\\n]*\\|)(?:\\n\\n\\|[^\\n]*\\|)*)",
            captures: [{ key: block.rowSource, mode: "table-source" }],
          });
        }
        break;
      case "caselet":
        if (block.title) parts.push(bold(templateFragment(block.title, "prose", variables)));
        if (block.paragraphs) {
          block.paragraphs.forEach((value) => parts.push(templateFragment(value, "prose", variables)));
        } else if (block.paragraphSource) {
          parts.push({ pattern: "([\\s\\S]+?)", captures: [{ key: block.paragraphSource, mode: "paragraph-source" }] });
        }
        break;
      case "statements":
        if (block.lead) parts.push(templateFragment(block.lead, "prose", variables));
        block.statements.forEach((value, index) => {
          const fragment = templateFragment(value, "prose", variables);
          parts.push({ pattern: `${index + 1}\\. ${fragment.pattern}`, captures: fragment.captures });
        });
        break;
      case "data_sufficiency":
        if (dataSufficiencyMode === "CURRENT") {
          parts.push(templateFragment(block.question, "prose", variables));
          block.statements.forEach((value, index) => {
            const fragment = templateFragment(value, "prose", variables);
            parts.push({ pattern: `\\*\\*Statement ${index + 1}:\\*\\* ${fragment.pattern}`, captures: fragment.captures });
          });
          parts.push(literal("Use the standard two-statement data-sufficiency answer scheme."));
        } else {
          block.statements.forEach((value, index) => {
            const fragment = templateFragment(value, "prose", variables);
            const numeral = index === 0 ? "I" : "II";
            parts.push({ pattern: `\\*\\*Statement ${numeral}:\\*\\* ${fragment.pattern}`, captures: fragment.captures });
          });
        }
        break;
      case "equation": {
        const fragment = templateFragment(block.latex, "latex", variables);
        parts.push({
          pattern: block.display === false
            ? `\\\\\\(${fragment.pattern}\\\\\\)`
            : `\\\\\\[${fragment.pattern}\\\\\\]`,
          captures: fragment.captures,
        });
        break;
      }
    }
  }
  parts.push(templateFragment(stem.prompt, "prose", variables));
  return combine(parts);
}

function parseTableRows(value: string): readonly (readonly string[])[] {
  return value.split(/\n\n/).map((line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) {
      throw new Error(`Invalid canonical table row: ${line}`);
    }
    return trimmed.slice(1, -1).split(/(?<!\\)\|/).map((cell) => cell.trim().replaceAll("\\|", "|"));
  });
}

function parseParagraphs(value: string): readonly string[] {
  return value.split(/\n\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

function comparable(value: string): string {
  return normalizeEditorialProse(value).replace(/\s+/g, " ").trim();
}

function mergeCapture(
  context: Record<string, unknown>,
  modes: Map<string, CaptureMode>,
  capture: Capture,
  value: string,
  qlId: string,
): void {
  const parsed: unknown = capture.mode === "table-source"
    ? parseTableRows(value)
    : capture.mode === "paragraph-source"
      ? parseParagraphs(value)
      : value;
  if (!(capture.key in context)) {
    context[capture.key] = parsed;
    modes.set(capture.key, capture.mode);
    return;
  }
  const current = context[capture.key];
  const currentMode = modes.get(capture.key)!;
  if (typeof current !== "string" || typeof parsed !== "string") {
    if (JSON.stringify(current) !== JSON.stringify(parsed)) throw new Error(`${qlId}: conflicting recovered source ${capture.key}.`);
    return;
  }
  if (current === parsed) return;
  if (comparable(current) !== comparable(parsed)) throw new Error(`${qlId}: conflicting recovered scalar ${capture.key}.`);
  if (capture.mode === "latex" && currentMode === "prose") {
    context[capture.key] = parsed;
    modes.set(capture.key, capture.mode);
  }
}

export function unresolvedPnl001ProsePlaceholders(value: string): readonly string[] {
  const prose = value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
  return [...new Set([...prose.matchAll(/\{([a-z][A-Za-z0-9_]*)\}/g)].map((match) => match[1]!))].sort();
}

function matchStem(
  stem: StructuredQuestionStem,
  variables: ReadonlySet<string>,
  canonicalStem: string,
): Readonly<{ fragment: Fragment; match: RegExpExecArray; mode: Pnl001CanonicalStemMode }> | null {
  const hasDataSufficiency = stem.blocks.some((block) => block.type === "data_sufficiency");
  const current = compileStem(stem, variables, "CURRENT");
  const currentMatch = new RegExp(`^${current.pattern}$`, "u").exec(canonicalStem);
  if (currentMatch) return { fragment: current, match: currentMatch, mode: "CURRENT_STRUCTURED" };
  if (!hasDataSufficiency) return null;
  const legacy = compileStem(stem, variables, "LEGACY");
  const legacyMatch = new RegExp(`^${legacy.pattern}$`, "u").exec(canonicalStem);
  if (legacyMatch) return { fragment: legacy, match: legacyMatch, mode: "LEGACY_DATA_SUFFICIENCY" };
  return null;
}

export function recoverPnl001CanonicalContext(qlId: string): Pnl001CanonicalContextRecovery {
  const canonicalEntry = canonical.entries[qlId];
  const englishEntry = englishByQl.get(qlId);
  const registryEntry = registryByQl.get(qlId);
  const cpId = cpByQl.get(qlId);
  if (!canonicalEntry || !englishEntry || !registryEntry || !cpId) throw new Error(`${qlId}: canonical context authorities are incomplete.`);
  if (canonicalEntry.cpId !== cpId) throw new Error(`${qlId}: canonical CP ownership mismatch.`);
  if (
    canonicalEntry.options.length !== 4 ||
    new Set(canonicalEntry.options).size !== 4 ||
    canonicalEntry.options[canonicalEntry.correctIndex] !== canonicalEntry.answer
  ) throw new Error(`${qlId}: canonical keyed-answer contract is invalid.`);

  const variables = new Set<string>([
    ...registryEntry.requiredVariables,
    ...stemVariables(englishEntry.stem),
  ]);
  const matched = matchStem(englishEntry.stem, variables, canonicalEntry.stem);
  if (!matched) throw new Error(`${qlId}: canonical stem does not match its approved structured shape.`);

  const context: Record<string, unknown> = {};
  const modes = new Map<string, CaptureMode>();
  matched.fragment.captures.forEach((capture, index) => {
    mergeCapture(context, modes, capture, matched.match[index + 1] ?? "", qlId);
  });

  const currentEnglishStem = renderStructuredStemMarkdown(englishEntry.stem, context);
  if (matched.mode === "CURRENT_STRUCTURED" && currentEnglishStem !== canonicalEntry.stem) {
    throw new Error(`${qlId}: canonical stem does not round-trip exactly.`);
  }
  const unresolvedCanonicalStem = unresolvedPnl001ProsePlaceholders(canonicalEntry.stem);
  const unresolvedCurrentStem = unresolvedPnl001ProsePlaceholders(currentEnglishStem);
  if (unresolvedCanonicalStem.length > 0 || unresolvedCurrentStem.length > 0) throw new Error(`${qlId}: unresolved canonical stem placeholders remain.`);

  const currentEnglishExplanation = renderFriendlyExplanationMarkdown(englishEntry.explanation, context);
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
    canonicalEntry,
    englishEntry,
    currentEnglishStem,
    currentEnglishExplanation,
    canonicalStemMode: matched.mode,
    rowSources,
    paragraphSources,
  };
}

export function recoverAllPnl001CanonicalContexts(): readonly Pnl001CanonicalContextRecovery[] {
  const qlIds = Object.keys(canonical.entries).sort();
  if (qlIds.length !== 186) throw new Error(`Expected 186 canonical entries, received ${qlIds.length}.`);
  return qlIds.map(recoverPnl001CanonicalContext);
}
