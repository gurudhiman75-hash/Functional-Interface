import { readFileSync } from "node:fs";
import type { StructuredEditorialEntry } from "./editorial-content";
import { validateStructuredEditorialEntry } from "./editorial-content";

export type EditorialLibraryFile = Readonly<{
  schemaVersion: 2;
  archetypeId: string;
  cpId: string;
  language: string;
  status: string;
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
  entryCount: number;
}>;

export function parseEditorialLibrary(value: unknown, source = "editorial library"): EditorialLibraryFile {
  if (!value || typeof value !== "object") throw new Error(`${source}: expected an object.`);
  const library = value as Partial<EditorialLibraryFile>;
  if (library.schemaVersion !== 2) throw new Error(`${source}: unsupported schema version.`);
  if (!library.entries || typeof library.entries !== "object") throw new Error(`${source}: entries are required.`);

  const entries = library.entries as Record<string, StructuredEditorialEntry>;
  const ids = Object.keys(entries);
  if (library.entryCount !== ids.length) {
    throw new Error(`${source}: entryCount ${library.entryCount} does not match ${ids.length} entries.`);
  }

  for (const qlId of ids) {
    const errors = validateStructuredEditorialEntry(entries[qlId]);
    if (errors.length > 0) throw new Error(`${source} ${qlId}: ${errors.join(" ")}`);
  }

  return library as EditorialLibraryFile;
}

export function loadEditorialLibrary(path: string): EditorialLibraryFile {
  const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
  return parseEditorialLibrary(parsed, path);
}

export function mergeEditorialLibraries(
  libraries: readonly EditorialLibraryFile[],
): ReadonlyMap<string, StructuredEditorialEntry> {
  const merged = new Map<string, StructuredEditorialEntry>();
  for (const library of libraries) {
    for (const [qlId, entry] of Object.entries(library.entries)) {
      if (merged.has(qlId)) throw new Error(`Duplicate editorial QL id: ${qlId}`);
      merged.set(qlId, entry);
    }
  }
  return merged;
}
