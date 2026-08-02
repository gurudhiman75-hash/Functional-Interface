import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";

type ReviewEntry = Readonly<{
  qlId: string;
  options: readonly string[];
  answer: string;
}>;

type ReviewLibrary = Readonly<{
  entries: Readonly<Record<string, ReviewEntry>>;
}>;

const library = PNL_001_CANONICAL_REVIEW_LIBRARY as ReviewLibrary;

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
for (const entry of Object.values(library.entries)) {
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

console.log(
  JSON.stringify(
    {
      textualChoiceCount: textualChoices.length,
      textualChoices,
    },
    null,
    2,
  ),
);

if (textualChoices.length > 0) {
  throw new Error(
    `Textual canonical choices require explicit localization decisions: ${textualChoices
      .map((choice) => choice.value)
      .join(" | ")}`,
  );
}
