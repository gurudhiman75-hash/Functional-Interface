import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { getAvg001EditorialStemOverrideIds } from "./foundation/editorial-stem-overrides";

const entries = getAvg001QuestionEntries();
const failures: string[] = [];
const normalizedTemplates = new Map<string, string>();

function placeholders(template: string) {
  return Array.from(
    template.matchAll(/\{([A-Za-z0-9_]+)\}/g),
    (match) => match[1]!,
  ).sort();
}

function normalize(template: string) {
  return template
    .toLowerCase()
    .replace(/\{[a-z0-9_]+\}/g, "{value}")
    .replace(/\bmean\b/g, "average")
    .replace(/\bgreatest\b/g, "largest")
    .replace(/\bleast\b/g, "smallest")
    .replace(/[^a-z{}]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const bannedPatterns: Array<[RegExp, string]> = [
  [/\bwrite\s+\{count\}/i, "procedural instruction to write the sequence"],
  [/how many units does it make in all/i, "elementary classroom phrasing"],
  [/for how many days does it work/i, "awkward operating-days phrasing"],
  [/what must be scored/i, "awkward passive cricket phrasing"],
  [/find the average of the set/i, "generic classroom phrasing"],
];

const cp002Cue =
  /consecutive|arithmetic progression|equally spaced|common difference|fixed amount|equal amount|uniformly|increase(?:s|d)? by|rise(?:s)? by|steps of|differ by|differing by|odd-numbered|even roll numbers/i;

for (const entry of entries) {
  const expectedPlaceholders = [...entry.requiredVariables].sort();
  const actualPlaceholders = [...new Set(placeholders(entry.template))].sort();
  if (JSON.stringify(actualPlaceholders) !== JSON.stringify(expectedPlaceholders)) {
    failures.push(
      `${entry.qlId}: placeholder mismatch (${actualPlaceholders.join(", ")} versus ${expectedPlaceholders.join(", ")})`,
    );
  }

  if (entry.template.length > 210) {
    failures.push(`${entry.qlId}: stem exceeds 210 characters`);
  }

  for (const [pattern, reason] of bannedPatterns) {
    if (pattern.test(entry.template)) failures.push(`${entry.qlId}: ${reason}`);
  }

  const normalized = normalize(entry.template);
  const prior = normalizedTemplates.get(normalized);
  if (prior) failures.push(`${entry.qlId}: duplicates normalized stem ${prior}`);
  normalizedTemplates.set(normalized, entry.qlId);

  if (entry.cpId === "AVG-CP-001" && cp002Cue.test(entry.template)) {
    failures.push(`${entry.qlId}: CP-001 stem leaks an AP/consecutive-set cue`);
  }
  if (entry.cpId === "AVG-CP-002" && !cp002Cue.test(entry.template)) {
    failures.push(`${entry.qlId}: CP-002 stem does not make symmetry/fixed-step structure explicit`);
  }
  if (
    entry.cpId === "AVG-CP-003" &&
    (entry.scenarioVariant === "familyAgeElapsedTime" ||
      entry.scenarioVariant === "newbornAfterElapsedYears") &&
    /\bchild\b/i.test(entry.template)
  ) {
    failures.push(`${entry.qlId}: neutral family-member wording required for the 1–18 age range`);
  }
}

const cp002Entries = entries.filter((entry) => entry.cpId === "AVG-CP-002");
const formalTerminologyCount = cp002Entries.filter((entry) =>
  /\barithmetic progression\b|\bsequence\b/i.test(entry.template),
).length;
if (formalTerminologyCount > 5) {
  failures.push(
    `CP-002 overuses formal AP/sequence terminology (${formalTerminologyCount} of ${cp002Entries.length})`,
  );
}

const expectedCounts = {
  "AVG-CP-001": 72,
  "AVG-CP-002": 50,
  "AVG-CP-003": 86,
};
const counts = Object.fromEntries(
  Object.keys(expectedCounts).map((cpId) => [
    cpId,
    entries.filter((entry) => entry.cpId === cpId).length,
  ]),
);

assert.deepEqual(counts, expectedCounts);
assert.equal(getAvg001EditorialStemOverrideIds().length, 63);
assert.equal(failures.length, 0, failures.join("\n"));

console.log(
  JSON.stringify(
    {
      entryCount: entries.length,
      overrideCount: getAvg001EditorialStemOverrideIds().length,
      counts,
      formalCp002TerminologyCount: formalTerminologyCount,
      normalizedDuplicateCount: 0,
      failures,
      status: "PASS",
    },
    null,
    2,
  ),
);
