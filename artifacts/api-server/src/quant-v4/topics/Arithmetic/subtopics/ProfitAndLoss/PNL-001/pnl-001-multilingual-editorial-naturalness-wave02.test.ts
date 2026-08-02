import assert from "node:assert/strict";

import type { StructuredEditorialEntry } from "./foundation/editorial-content";
import { buildAllNormalizedMultilingualEditorialLibraries as buildWave01Libraries } from "./foundation/editorial-v2-multilingual-normalizer";
import { buildAllNormalizedMultilingualEditorialLibraries as buildWave02Libraries } from "./foundation/editorial-v2-multilingual-naturalness-wave02";

function normalize(value: string): string {
  return value
    .normalize("NFC")
    .toLowerCase()
    .replace(/\{[A-Za-z][A-Za-z0-9_]*\}/g, "{#}")
    .replace(/₹\s*[\d,.]+(?:\.\d+)?/g, "₹#")
    .replace(/\b\d+(?:\.\d+)?%/g, "#%")
    .replace(/\b\d+(?:\.\d+)?\b/g, "#")
    .replace(/[“”"'`]/g, "")
    .replace(/[—–-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function repeatedGroups(
  entries: readonly Readonly<{ qlId: string; value: string }>[],
  threshold: number,
): readonly Readonly<{ value: string; owners: readonly string[] }>[] {
  const groups = new Map<string, Set<string>>();
  for (const entry of entries) {
    const value = normalize(entry.value);
    if (!value) continue;
    const owners = groups.get(value) ?? new Set<string>();
    owners.add(entry.qlId);
    groups.set(value, owners);
  }
  return [...groups.entries()]
    .map(([value, owners]) => ({ value, owners: [...owners].sort() }))
    .filter((entry) => entry.owners.length >= threshold);
}

function structuralSignature(entry: StructuredEditorialEntry): unknown {
  return {
    difficulty: entry.difficulty,
    blockTypes: entry.stem.blocks.map((block) => block.type),
    stemEquations: entry.stem.blocks
      .filter((block) => block.type === "equation")
      .map((block) => block.latex),
    stepCount: entry.explanation.steps.length,
    stepEquations: entry.explanation.steps.map(
      (step) => step.equationLatex ?? null,
    ),
    finalAnswerLatex: entry.explanation.finalAnswerLatex ?? null,
  };
}

const wave01 = buildWave01Libraries();
const wave02 = buildWave02Libraries();

assert.equal(wave01.length, 12);
assert.equal(wave02.length, 12);
assert.equal(
  wave02.reduce((total, library) => total + library.entryCount, 0),
  372,
);

const wave01ByKey = new Map(
  wave01.map((library) => [`${library.cpId}:${library.language}`, library]),
);

const bannedPhrases = [
  "व्यावसायिक क्रम",
  "ਵਪਾਰਕ ਕ੍ਰਮ",
  "अज्ञात समूह",
  "ਅਣਜਾਣ ਸਮੂਹ",
  "लक्षित",
  "ਲਕਸ਼ਿਤ",
  "पुनर्निर्माण",
  "ਪੁਨਰਨਿਰਮਾਣ",
  "ਪਰਯਾਪਤਾ",
] as const;

const rows: Array<
  Readonly<{
    qlId: string;
    language: string;
    opening: string;
    concept: string;
    conclusion: string;
    commonTrap: string;
    stepTitles: readonly string[];
  }>
> = [];

for (const library of wave02) {
  const baseline = wave01ByKey.get(`${library.cpId}:${library.language}`);
  assert.ok(baseline, `Missing Wave 01 baseline for ${library.cpId}/${library.language}`);
  assert.deepEqual(Object.keys(library.entries), Object.keys(baseline.entries));

  for (const [qlId, entry] of Object.entries(library.entries)) {
    const baselineEntry = baseline.entries[qlId];
    assert.ok(baselineEntry, `Missing baseline entry ${qlId}`);
    assert.deepEqual(
      structuralSignature(entry),
      structuralSignature(baselineEntry),
      `Mathematical or representation structure changed for ${qlId}/${library.language}`,
    );

    const learnerText = [
      entry.stem.prompt,
      ...entry.stem.blocks.flatMap((block) => {
        if (block.type === "paragraph") return [block.content];
        if (block.type === "table") {
          return [block.caption ?? "", ...block.columns, ...(block.rows?.flat() ?? [])];
        }
        if (block.type === "caselet") {
          return [block.title ?? "", ...(block.paragraphs ?? [])];
        }
        if (block.type === "statements") {
          return [block.lead ?? "", ...block.statements];
        }
        if (block.type === "data_sufficiency") {
          return [block.question, ...block.statements];
        }
        return [];
      }),
      entry.explanation.opening,
      entry.explanation.concept,
      ...entry.explanation.steps.flatMap((step) => [step.title, step.body]),
      entry.explanation.conclusion,
      entry.explanation.commonTrap ?? "",
    ].join("\n");

    for (const phrase of bannedPhrases) {
      assert.ok(
        !learnerText.includes(phrase),
        `${qlId}/${library.language} still contains ${phrase}`,
      );
    }

    rows.push({
      qlId,
      language: library.language,
      opening: entry.explanation.opening,
      concept: entry.explanation.concept,
      conclusion: entry.explanation.conclusion,
      commonTrap: entry.explanation.commonTrap ?? "",
      stepTitles: entry.explanation.steps.map((step) => step.title),
    });
  }
}

for (const language of ["hi", "pa"] as const) {
  const languageRows = rows.filter((row) => row.language === language);
  for (const field of ["opening", "concept", "conclusion", "commonTrap"] as const) {
    const duplicates = repeatedGroups(
      languageRows.map((row) => ({ qlId: row.qlId, value: row[field] })),
      6,
    );
    assert.deepEqual(
      duplicates,
      [],
      `${language} retains repeated ${field} clusters: ${JSON.stringify(duplicates)}`,
    );
  }

  const repeatedStepTitles = repeatedGroups(
    languageRows.flatMap((row) =>
      row.stepTitles.map((value) => ({ qlId: row.qlId, value })),
    ),
    10,
  );
  assert.deepEqual(
    repeatedStepTitles,
    [],
    `${language} retains repeated step-title clusters: ${JSON.stringify(repeatedStepTitles)}`,
  );
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      libraries: wave02.length,
      entries: rows.length,
      hindiEntries: rows.filter((row) => row.language === "hi").length,
      punjabiEntries: rows.filter((row) => row.language === "pa").length,
      repeatedOpenings: 0,
      repeatedConcepts: 0,
      repeatedConclusions: 0,
      repeatedCommonTraps: 0,
      repeatedStepTitles: 0,
      structuralChanges: 0,
    },
    null,
    2,
  ),
);
