import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";

type ReviewEntry = Readonly<{
  qlId: string;
  options: readonly string[];
  answer: string;
  [key: string]: unknown;
}>;

type ReviewLibrary = Readonly<{
  entries: Readonly<Record<string, ReviewEntry>>;
}>;

const library = PNL_001_CANONICAL_REVIEW_LIBRARY as ReviewLibrary;
const entries = Object.values(library.entries);

function visibleProse(value: string): string {
  return value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "")
    .trim();
}

function requiresLocalizationDecision(value: string): boolean {
  return /[A-Za-z]/.test(visibleProse(value));
}

const owners = new Map<string, Set<string>>();
for (const entry of entries) {
  for (const value of [...entry.options, entry.answer]) {
    if (!requiresLocalizationDecision(value)) continue;
    const qls = owners.get(value) ?? new Set<string>();
    qls.add(entry.qlId);
    owners.set(value, qls);
  }
}

const textualChoices = [...owners.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([value, qls]) => ({ value, qlIds: [...qls].sort() }));

const entryKeys = [...new Set(entries.flatMap((entry) => Object.keys(entry)))].sort();
const objectValuedKeys = [...new Set(
  entries.flatMap((entry) =>
    Object.entries(entry)
      .filter(([, value]) => value !== null && typeof value === "object" && !Array.isArray(value))
      .map(([key]) => key),
  ),
)].sort();
const contextLikeKeys = entryKeys.filter((key) =>
  /context|variable|parameter|fixture|render|value/i.test(key),
);
const contextEntries = entries.filter((entry) =>
  contextLikeKeys.some((key) => {
    const value = entry[key];
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }),
);
const sampleIds = ["PNL-QL-001", "PNL-QL-070", "PNL-QL-092", "PNL-QL-183"];
const samples = Object.fromEntries(
  sampleIds.map((qlId) => {
    const entry = library.entries[qlId];
    return [
      qlId,
      Object.fromEntries(
        Object.entries(entry).map(([key, value]) => [
          key,
          value !== null && typeof value === "object"
            ? Array.isArray(value)
              ? { kind: "array", length: value.length, sample: value.slice(0, 2) }
              : { kind: "object", keys: Object.keys(value as Record<string, unknown>).sort() }
            : value,
        ]),
      ),
    ];
  }),
);

console.log(
  JSON.stringify(
    {
      entryCount: entries.length,
      entryKeys,
      objectValuedKeys,
      contextLikeKeys,
      entriesWithContextLikeObjects: contextEntries.length,
      textualChoiceCount: textualChoices.length,
      samples,
    },
    null,
    2,
  ),
);

if (contextEntries.length !== entries.length) {
  throw new Error(
    `Canonical fixture rendering context is not exposed for all entries: ${contextEntries.length}/${entries.length}.`,
  );
}
