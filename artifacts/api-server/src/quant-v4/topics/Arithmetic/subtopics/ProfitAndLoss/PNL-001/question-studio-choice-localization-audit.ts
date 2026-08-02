import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  QuestionStemBlock,
  StructuredEditorialEntry,
} from "./foundation/editorial-content";
import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";

type ReviewLibrary = Readonly<{
  entries: Readonly<Record<string, Readonly<{ stem: string }>>>;
}>;

type EditorialLibrary = Readonly<{
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
}>;

const root = dirname(fileURLToPath(import.meta.url));
const cpFolders = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006"] as const;
const canonical = PNL_001_CANONICAL_REVIEW_LIBRARY as ReviewLibrary;

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function placeholders(value: string | undefined): readonly string[] {
  if (!value) return [];
  return [...value.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((match) => match[1]!);
}

function blockPlaceholders(block: QuestionStemBlock): readonly string[] {
  switch (block.type) {
    case "paragraph":
      return placeholders(block.content);
    case "table":
      return [
        ...placeholders(block.caption),
        ...block.columns.flatMap(placeholders),
        ...(block.rows?.flatMap((row) => row.flatMap(placeholders)) ?? []),
      ];
    case "caselet":
      return [
        ...placeholders(block.title),
        ...(block.paragraphs?.flatMap(placeholders) ?? []),
      ];
    case "statements":
      return [
        ...placeholders(block.lead),
        ...block.statements.flatMap(placeholders),
      ];
    case "data_sufficiency":
      return [
        ...placeholders(block.question),
        ...block.statements.flatMap(placeholders),
      ];
    case "equation":
      return placeholders(block.latex);
  }
}

const blockTypeCounts: Record<string, number> = {};
const representationQlIds: Record<string, string[]> = {};
const rowSourceOwners: Record<string, string[]> = {};
const paragraphSourceOwners: Record<string, string[]> = {};
const scalarPlaceholderFrequency: Record<string, number> = {};
const sourceShapes: unknown[] = [];
let qlCount = 0;
let multiBlockQlCount = 0;
let maxBlocks = 0;
let qlsWithoutCanonicalStem = 0;

for (const cp of cpFolders) {
  const library = readJson<EditorialLibrary>(join(root, cp, "editorial-content.en.json"));
  for (const [qlId, entry] of Object.entries(library.entries)) {
    qlCount += 1;
    if (!canonical.entries[qlId]?.stem) qlsWithoutCanonicalStem += 1;
    if (entry.stem.blocks.length > 1) multiBlockQlCount += 1;
    maxBlocks = Math.max(maxBlocks, entry.stem.blocks.length);

    for (const block of entry.stem.blocks) {
      blockTypeCounts[block.type] = (blockTypeCounts[block.type] ?? 0) + 1;
      (representationQlIds[block.type] ??= []).push(qlId);
      for (const key of blockPlaceholders(block)) {
        scalarPlaceholderFrequency[key] = (scalarPlaceholderFrequency[key] ?? 0) + 1;
      }

      if (block.type === "table" && block.rowSource) {
        (rowSourceOwners[block.rowSource] ??= []).push(qlId);
        sourceShapes.push({
          qlId,
          type: "table-row-source",
          source: block.rowSource,
          columns: block.columns,
          caption: block.caption ?? null,
          canonicalStem: canonical.entries[qlId]?.stem,
        });
      }
      if (block.type === "caselet" && block.paragraphSource) {
        (paragraphSourceOwners[block.paragraphSource] ??= []).push(qlId);
        sourceShapes.push({
          qlId,
          type: "caselet-paragraph-source",
          source: block.paragraphSource,
          title: block.title ?? null,
          canonicalStem: canonical.entries[qlId]?.stem,
        });
      }
    }

    for (const key of placeholders(entry.stem.prompt)) {
      scalarPlaceholderFrequency[key] = (scalarPlaceholderFrequency[key] ?? 0) + 1;
    }
  }
}

const summary = {
  qlCount,
  qlsWithoutCanonicalStem,
  blockTypeCounts,
  representationQlCounts: Object.fromEntries(
    Object.entries(representationQlIds).map(([type, ids]) => [type, new Set(ids).size]),
  ),
  multiBlockQlCount,
  maxBlocks,
  rowSourceCount: Object.values(rowSourceOwners).flat().length,
  rowSources: rowSourceOwners,
  paragraphSourceCount: Object.values(paragraphSourceOwners).flat().length,
  paragraphSources: paragraphSourceOwners,
  scalarPlaceholderNames: Object.keys(scalarPlaceholderFrequency).sort(),
  scalarPlaceholderNameCount: Object.keys(scalarPlaceholderFrequency).length,
  sourceShapes,
};

console.log(JSON.stringify(summary, null, 2));

if (qlCount !== 186 || qlsWithoutCanonicalStem !== 0) {
  throw new Error("Canonical and structured English authorities are not aligned.");
}

throw new Error(
  `Context recovery shape audit complete: ${summary.rowSourceCount} row-source QLs and ${summary.paragraphSourceCount} paragraph-source QLs require dedicated parsers.`,
);
